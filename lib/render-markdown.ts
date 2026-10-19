import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { type PostMeta } from "@/lib/images";
import { createRehypePlugins, remarkPlugins } from "@/lib/mdx-plugins";

/**
 * Renders Markdown to an HTML string using the same remark/rehype chain as the
 * MDX posts. Moments use this because their filtering happens on the client and
 * the rendered HTML needs to be serializable.
 */
export async function renderMarkdownHtml(
  content: string,
  {
    collectionDir,
    meta,
  }: {
    collectionDir: string;
    meta: PostMeta;
  },
): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use({ plugins: remarkPlugins })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use({ plugins: createRehypePlugins(collectionDir) })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process({ value: content, data: { _meta: meta } });

  return String(file);
}
