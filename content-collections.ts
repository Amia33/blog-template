import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import readingTime from "reading-time";
import { z } from "zod";

import { extractExcerpt } from "./lib/markdown-utils";
import { createRehypePlugins, remarkPlugins } from "./lib/mdx-plugins";
import { resolveCover } from "./lib/images";

const POSTS_DIRECTORY = "content/posts";
const SPEC_DIRECTORY = "content/spec";

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
    content: z.string(),
  }),
  transform: async (document, context) => {
    const stats = readingTime(document.content);
    const mdx = await compileMDX(context, document, {
      remarkPlugins,
      rehypePlugins: createRehypePlugins(POSTS_DIRECTORY),
    });

    return {
      ...document,
      slug: document._meta.path.replace(/\/index$/, ""),
      mdx,
      cover: await resolveCover(
        document.image,
        document._meta,
        POSTS_DIRECTORY,
      ),
      excerpt: extractExcerpt(document.content),
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

export default defineConfig({
  content: [posts, spec],
});
