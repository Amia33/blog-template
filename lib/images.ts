import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import { isMediaUrl } from "./media";

export type PostMeta = {
  filePath: string;
  fileName: string;
  directory: string;
  path: string;
  extension: string;
};

export type ImageMeta = {
  width: number;
  height: number;
  blurDataURL: string;
};

export type Cover = ImageMeta & {
  src: string;
  remote: boolean;
  optimizable: boolean;
};

type ImageSource =
  { kind: "remote"; src: string } | { kind: "file"; absolutePath: string };

const PUBLIC_DIR = path.join(process.cwd(), "public");
const CONTENT_DIR = path.join(PUBLIC_DIR, "content");

/** Any scheme (`https:`, `data:`) or a protocol-relative `//host/path`. */
const REMOTE_PATTERN = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/** Characters that cannot appear in a path segment or a URL path. */
const UNSAFE_SEGMENT = /[\\/:*?"<>|#%\u0000-\u001f]/g;

function safeSegment(value: string): string {
  const cleaned = value
    .replace(UNSAFE_SEGMENT, "-")
    .replace(/^[.\s-]+|[.\s-]+$/g, "");
  return cleaned === "" ? "file" : cleaned;
}

function safeSlug(slug: string): string {
  return slug.split("/").map(safeSegment).join("/");
}

/** Absolute directory holding a collection document, used to resolve relative paths. */
export function postDirectory(meta: PostMeta, collectionDir: string): string {
  // Both `filePath` and `directory` are relative to the collection's own
  // directory, e.g. `content/posts/guide/index.md` has `directory: "guide"`.
  return path.join(process.cwd(), collectionDir, meta.directory);
}

export function postSlug(meta: PostMeta): string {
  return meta.path.replace(/\/index$/, "");
}

export function isPathInside(baseDir: string, target: string): boolean {
  const relative = path.relative(baseDir, target);
  return (
    relative !== "" &&
    relative !== ".." &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  );
}

export async function resolveSource(
  src: string,
  postDir: string,
  options: { confineTo?: string; rejectPublic?: boolean } = {},
): Promise<ImageSource> {
  const value = src.trim();

  if (value === "" || REMOTE_PATTERN.test(value)) {
    return { kind: "remote", src: value };
  }

  if (value.startsWith("/")) {
    if (options.rejectPublic) {
      throw new Error(
        `Encrypted content cannot reference public images: ${value}`,
      );
    }

    const absolutePath = path.join(PUBLIC_DIR, value);

    if (!isPathInside(PUBLIC_DIR, absolutePath)) {
      throw new Error(`Image path escapes public/: ${value}`);
    }

    return { kind: "file", absolutePath };
  }

  const absolutePath = path.resolve(postDir, value);

  if (options.confineTo && !isPathInside(options.confineTo, absolutePath)) {
    throw new Error(`Image path escapes ${options.confineTo}: ${value}`);
  }

  return { kind: "file", absolutePath };
}

export function toProtectedPostImageUrl(slug: string, file: string): string {
  const params = new URLSearchParams({ slug, path: file });
  return `/api/protected/posts?${params.toString()}`;
}

/**
 * Returns the public URL for an image. Files already under `public/` are served
 * in place; anything else is copied into `public/content/<slug>/` under a
 * content-addressed name, so the URL changes whenever the bytes change and the
 * image optimizer can never serve a stale variant.
 */
export async function toPublicUrl(
  absolutePath: string,
  slug: string,
): Promise<string> {
  const relative = path.relative(PUBLIC_DIR, absolutePath);

  if (
    relative !== "" &&
    !relative.startsWith("..") &&
    !path.isAbsolute(relative)
  ) {
    return `/${relative.split(path.sep).join("/")}`;
  }

  const data = await readFile(absolutePath);
  const hash = createHash("sha1").update(data).digest("hex").slice(0, 8);
  const parsed = path.parse(absolutePath);
  const fileName = `${safeSegment(parsed.name)}-${hash}${parsed.ext.toLowerCase()}`;
  const targetDirectory = path.join(CONTENT_DIR, safeSlug(slug));
  const target = path.join(targetDirectory, fileName);

  try {
    await stat(target);
  } catch {
    await mkdir(targetDirectory, { recursive: true });
    await writeFile(target, data);
  }

  return `/content/${safeSlug(slug)}/${fileName}`;
}

const metaCache = new Map<string, Promise<ImageMeta>>();

export function imageMeta(absolutePath: string): Promise<ImageMeta> {
  let pending = metaCache.get(absolutePath);

  if (!pending) {
    pending = (async () => {
      const image = sharp(absolutePath);
      const { width, height } = await image.metadata();

      if (!width || !height) {
        throw new Error(`Could not read image dimensions: ${absolutePath}`);
      }

      const blur = await image
        .clone()
        .resize(16)
        .webp({ quality: 40 })
        .toBuffer();

      return {
        width,
        height,
        blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
      };
    })();

    metaCache.set(absolutePath, pending);
  }

  return pending;
}

const REMOTE_IMAGE_TIMEOUT_MS = 10_000;
const REMOTE_IMAGE_MAX_BYTES = 10 * 1024 * 1024;

const remoteMetaCache = new Map<string, Promise<ImageMeta | null>>();

async function fetchRemoteImageMeta(src: string): Promise<ImageMeta | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REMOTE_IMAGE_TIMEOUT_MS);

  try {
    const response = await fetch(src, {
      signal: controller.signal,
      headers: { accept: "image/*" },
      // Never turn a build-time metadata read into an arbitrary fetch.
      redirect: "error",
    });

    if (!response.ok || !isMediaUrl(response.url)) return null;

    const contentType = (
      response.headers.get("content-type") ?? ""
    ).toLowerCase();
    if (!contentType.startsWith("image/") || contentType.includes("svg")) {
      return null;
    }

    const declaredSize = Number(response.headers.get("content-length") ?? "0");
    if (declaredSize > REMOTE_IMAGE_MAX_BYTES) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength > REMOTE_IMAGE_MAX_BYTES) return null;

    const image = sharp(buffer);
    const { width, height } = await image.metadata();
    if (!width || !height) return null;

    const blur = await image
      .clone()
      .resize(16)
      .webp({ quality: 40 })
      .toBuffer();

    return {
      width,
      height,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Reads dimensions and a blur placeholder for an image on the media bucket.
 * Returns `null` for other origins or when the image cannot be fetched, so
 * callers can fall back to a plain `<img>`.
 */
export function remoteImageMeta(src: string): Promise<ImageMeta | null> {
  if (!isMediaUrl(src)) return Promise.resolve(null);

  let pending = remoteMetaCache.get(src);

  if (!pending) {
    pending = fetchRemoteImageMeta(src);
    remoteMetaCache.set(src, pending);
  }

  return pending;
}

export async function resolveCover(
  image: string,
  meta: PostMeta,
  collectionDir: string,
): Promise<Cover | null> {
  const source = await resolveSource(
    image,
    postDirectory(meta, collectionDir),
    {
      confineTo: path.join(process.cwd(), collectionDir),
    },
  );

  if (source.kind === "remote") {
    if (source.src === "") return null;

    const meta = await remoteImageMeta(source.src);

    if (meta) {
      return {
        src: source.src,
        ...meta,
        remote: true,
        optimizable: true,
      };
    }

    return {
      src: source.src,
      width: 1200,
      height: 630,
      blurDataURL: "",
      remote: true,
      optimizable: false,
    };
  }

  const src = await toPublicUrl(source.absolutePath, postSlug(meta));
  const { width, height, blurDataURL } = await imageMeta(source.absolutePath);

  return {
    src,
    width,
    height,
    blurDataURL,
    remote: false,
    optimizable: true,
  };
}
