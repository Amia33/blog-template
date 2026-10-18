import GithubSlugger from "github-slugger";

export type TocHeading = {
  depth: number;
  text: string;
  slug: string;
};

function stripFencedCode(markdown: string): string {
  return markdown.replace(/^(```|~~~)[\s\S]*?^\1.*$/gm, "");
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/[*_~]/g, "")
    .replace(/\s+#+\s*$/, "")
    .trim();
}

function isParagraphBreaker(line: string): boolean {
  return (
    line === "" ||
    /^#{1,6}\s/.test(line) ||
    line.startsWith(">") ||
    line.startsWith("::") ||
    line.startsWith("|") ||
    /^([-*+]|\d+[.)])\s/.test(line) ||
    /^[-*_]{3,}$/.test(line)
  );
}

export function extractHeadings(markdown: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];
  const lines = stripFencedCode(markdown).split("\n");

  for (const line of lines) {
    const match = /^(#{1,6})\s+(.*)$/.exec(line);
    if (!match) continue;
    const depth = match[1].length;
    const text = stripInlineMarkdown(match[2]);
    if (!text) continue;
    headings.push({ depth, text, slug: slugger.slug(text) });
  }

  return headings;
}

export function extractExcerpt(markdown: string): string {
  const lines = stripFencedCode(markdown).split("\n");
  const paragraph: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (isParagraphBreaker(trimmed)) {
      if (paragraph.length > 0) break;
      continue;
    }

    paragraph.push(trimmed);
  }

  return paragraph.length > 0 ? stripInlineMarkdown(paragraph.join(" ")) : "";
}
