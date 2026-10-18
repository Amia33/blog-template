import type { Options } from "@content-collections/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExpressiveCode from "rehype-expressive-code";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { expressiveCodeOptions } from "@/lib/expressive-code";
import { rehypeAlertOptions, rehypeGithubAlerts } from "@/lib/rehype-alerts";
import { remarkDirectives } from "@/lib/remark-directives";

// Order matters:
//   remark: gfm -> math -> directive -> our directive shim (alerts / spoilers)
//   rehype: katex (must run before expressive-code so `math` nodes are not
//           mistaken for code blocks) -> expressive-code -> slug -> alerts ->
//           autolink (needs the slugs)
export const remarkPlugins: NonNullable<Options["remarkPlugins"]> = [
  remarkGfm,
  remarkMath,
  remarkDirective,
  remarkDirectives,
];

export const rehypePlugins: NonNullable<Options["rehypePlugins"]> = [
  rehypeKatex,
  [rehypeExpressiveCode, expressiveCodeOptions],
  rehypeSlug,
  [rehypeGithubAlerts, rehypeAlertOptions],
  [
    rehypeAutolinkHeadings,
    {
      behavior: "append",
      properties: {
        className: ["anchor"],
        ariaLabel: "この見出しへのリンク",
      },
      content: { type: "text", value: "#" },
    },
  ],
];
