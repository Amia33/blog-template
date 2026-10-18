import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

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

export async function resolveSource(
  src: string,
  postDir: string,
): Promise<ImageSource> {
  const value = src.trim();

  if (value === "" || REMOTE_PATTERN.test(value)) {
    return { kind: "remote", src: value };
  }

  if (value.startsWith("/")) {
    return { kind: "file", absolutePath: path.join(PUBLIC_DIR, value) };
  }

  return { kind: "file", absolutePath: path.resolve(postDir, value) };
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

export async function resolveCover(
  image: string,
  meta: PostMeta,
  collectionDir: string,
): Promise<Cover | null> {
  const source = await resolveSource(image, postDirectory(meta, collectionDir));

  if (source.kind === "remote") {
    if (source.src === "") return null;

    return {
      src: source.src,
      width: 1200,
      height: 630,
      blurDataURL: "",
      remote: true,
    };
  }

  const src = await toPublicUrl(source.absolutePath, postSlug(meta));
  const { width, height, blurDataURL } = await imageMeta(source.absolutePath);

  return { src, width, height, blurDataURL, remote: false };
}
