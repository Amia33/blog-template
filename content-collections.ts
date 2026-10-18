import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import readingTime from "reading-time";
import { z } from "zod";

import { extractExcerpt } from "./lib/markdown-utils";
import { rehypePlugins, remarkPlugins } from "./lib/mdx-plugins";

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
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
      rehypePlugins,
    });

    return {
      ...document,
      slug: document._meta.path.replace(/\/index$/, ""),
      mdx,
      excerpt: extractExcerpt(document.content),
      readingTime: Math.max(1, Math.round(stats.minutes)),
      words: stats.words,
    };
  },
});

const spec = defineCollection({
  name: "spec",
  directory: "content/spec",
  include: "*.{md,mdx}",
  schema: z.object({
    content: z.string(),
  }),
  transform: async (document, context) => ({
    ...document,
    mdx: await compileMDX(context, document, {
      remarkPlugins,
      rehypePlugins,
    }),
  }),
});

export default defineConfig({
  content: [posts, spec],
});
