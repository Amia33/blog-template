import { readdir } from "node:fs/promises";
import path from "node:path";

import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import readingTime from "reading-time";
import { z } from "zod";

import { imageMeta, postSlug, resolveCover } from "./lib/images";
import { extractExcerpt } from "./lib/markdown-utils";
import { createRehypePlugins, remarkPlugins } from "./lib/mdx-plugins";
import { renderMarkdownHtml } from "./lib/render-markdown";

const POSTS_DIRECTORY = "content/posts";
const SPEC_DIRECTORY = "content/spec";
const MOMENTS_DIRECTORY = "content/moments";
const ALBUMS_DIRECTORY = "content/albums";

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
]);

const webPath = (value: string) => value.split(path.sep).join("/");

async function listImageFiles(directory: string): Promise<string[]> {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    return entries
      .filter(
        (entry) =>
          entry.isFile() &&
          IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()),
      )
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

function assertArgon2Hash(hash: string, label: string): void {
  if (!hash.startsWith("$argon2id$")) {
    throw new Error(
      `${label}: protected content requires an Argon2id passwordHash. ` +
        'Generate one with `pnpm hash-password "your-password"`.',
    );
  }
}

const posts = defineCollection({
  name: "posts",
  directory: POSTS_DIRECTORY,
  include: "**/*.{md,mdx}",
  schema: z.object({
    title: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    description: z.string().default(""),
    image: z.string().default(""),
    tags: z.array(z.string()).default([]),
    category: z.string().nullable().default(null),
    lang: z.string().default(""),
    pinned: z.boolean().default(false),
    encrypted: z.boolean().default(false),
    passwordHash: z.string().default(""),
    passwordHint: z.string().default(""),
    hideHomeContent: z.boolean().default(true),
    content: z.string(),
  }),
  transform: async (document, context) => {
    if (document.encrypted) {
      assertArgon2Hash(document.passwordHash, document._meta.path);
    }

    const stats = readingTime(document.content);
    const mdx = await compileMDX(context, document, {
      remarkPlugins,
      rehypePlugins: createRehypePlugins(POSTS_DIRECTORY),
    });

    return {
      ...document,
      // Do not keep the plaintext body in the generated collection for
      // protected posts. The compiled `mdx` code is only read by a server
      // component after the session is validated.
      content: document.encrypted ? "" : document.content,
      slug: document._meta.path.replace(/\/index$/, ""),
      mdx,
      cover: await resolveCover(
        document.image,
        document._meta,
        POSTS_DIRECTORY,
      ),
      excerpt: document.encrypted ? "" : extractExcerpt(document.content),
      readingTime: Math.max(1, Math.round(stats.minutes)),
      words: stats.words,
    };
  },
});

const spec = defineCollection({
  name: "spec",
  directory: SPEC_DIRECTORY,
  include: "*.{md,mdx}",
  schema: z.object({
    content: z.string(),
  }),
  transform: async (document, context) => ({
    ...document,
    mdx: await compileMDX(context, document, {
      remarkPlugins,
      rehypePlugins: createRehypePlugins(SPEC_DIRECTORY),
    }),
  }),
});

const moments = defineCollection({
  name: "moments",
  directory: MOMENTS_DIRECTORY,
  include: "**/*.md",
  schema: z.object({
    published: z.coerce.date(),
    pinned: z.boolean().default(false),
    location: z.string().default(""),
    mood: z.string().default(""),
    tags: z.array(z.string()).default([]),
    images: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string().default(""),
        }),
      )
      .default([]),
    draft: z.boolean().default(false),
    content: z.string(),
  }),
  transform: async (document) => {
    const meta = document._meta;
    const slug = postSlug(meta);
    const html = await renderMarkdownHtml(document.content, {
      collectionDir: MOMENTS_DIRECTORY,
      meta,
    });

    const images = await Promise.all(
      document.images.map(async (image) => {
        const cover = await resolveCover(image.src, meta, MOMENTS_DIRECTORY);

        if (!cover) {
          return {
            src: image.src,
            alt: image.alt,
            width: 0,
            height: 0,
            blurDataURL: "",
            remote: false,
          };
        }

        return { ...cover, alt: image.alt };
      }),
    );

    return {
      ...document,
      slug,
      html,
      images,
    };
  },
});

const albums = defineCollection({
  name: "albums",
  directory: ALBUMS_DIRECTORY,
  include: "**/index.md",
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    cover: z.string().default(""),
    date: z.coerce.date(),
    location: z.string().default(""),
    tags: z.array(z.string()).default([]),
    layout: z.enum(["grid", "masonry", "columns"]).default("masonry"),
    columns: z.number().int().min(1).max(6).default(3),
    hidden: z.boolean().default(false),
    encrypted: z.boolean().default(false),
    passwordHash: z.string().default(""),
    passwordHint: z.string().default(""),
    photos: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string().default(""),
          title: z.string().default(""),
          tags: z.array(z.string()).default([]),
        }),
      )
      .default([]),
    content: z.string(),
  }),
  transform: async (document) => {
    if (document.encrypted) {
      assertArgon2Hash(document.passwordHash, document._meta.path);
    }

    const meta = document._meta;
    const slug = postSlug(meta);
    const albumDirectory = meta.directory;
    const publicRoot = path.join(
      process.cwd(),
      "public/images/albums",
      albumDirectory,
    );
    const protectedRoot = path.join(
      process.cwd(),
      ALBUMS_DIRECTORY,
      albumDirectory,
      "photos",
    );

    const publicFiles = document.encrypted
      ? []
      : await listImageFiles(publicRoot);

    const photos = await Promise.all(
      publicFiles.map(async (file) => {
        const absolute = path.join(publicRoot, file);
        const { width, height, blurDataURL } = await imageMeta(absolute);
        const src = `/images/albums/${webPath(albumDirectory)}/${file}`;
        const explicit = document.photos.find(
          (photo) =>
            photo.src === file || photo.src === `/${file}` || photo.src === src,
        );

        return {
          src,
          width,
          height,
          blurDataURL,
          alt: explicit?.alt ?? "",
          title: explicit?.title ?? file,
          tags: explicit?.tags ?? [],
        };
      }),
    );

    const protectedFiles = document.encrypted
      ? await listImageFiles(protectedRoot)
      : [];

    const protectedPhotos = await Promise.all(
      protectedFiles.map(async (file) => {
        const absolute = path.join(protectedRoot, file);
        const { width, height } = await imageMeta(absolute);
        const explicit = document.photos.find(
          (photo) => photo.src === file || photo.src === `/${file}`,
        );

        return {
          file,
          width,
          height,
          alt: explicit?.alt ?? "",
          title: explicit?.title ?? file,
          tags: explicit?.tags ?? [],
        };
      }),
    );

    let cover = null;

    if (document.cover) {
      const isRemote = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(document.cover);
      const isPublic = document.cover.startsWith("/");

      // Never copy a protected album image into public/ just to use it as a
      // cover. Protected albums need a public or remote cover, or none.
      if (!document.encrypted || isRemote || isPublic) {
        cover = await resolveCover(document.cover, meta, ALBUMS_DIRECTORY);
      }
    } else if (photos.length > 0) {
      cover = {
        src: photos[0].src,
        width: photos[0].width,
        height: photos[0].height,
        blurDataURL: photos[0].blurDataURL,
        remote: false,
      };
    }

    return {
      ...document,
      slug,
      cover,
      photos,
      protectedPhotos,
    };
  },
});

export default defineConfig({
  content: [posts, spec, moments, albums],
});
