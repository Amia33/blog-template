import { siteConfig } from "@/lib/config";
import { extractHeadings, type TocHeading } from "@/lib/markdown-utils";

export type { TocHeading };

export function getPostHeadings(content: string): TocHeading[] {
  const headings = extractHeadings(content);
  if (headings.length === 0) return [];

  const minDepth = Math.min(...headings.map((heading) => heading.depth));
  const maxDepth = minDepth + siteConfig.toc.depth;

  return headings.filter((heading) => heading.depth < maxDepth);
}
