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
