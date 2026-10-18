import { t } from "@/lib/strings";

export function pathsEqual(path1: string, path2: string): boolean {
  const normalize = (p: string) => p.replace(/^\/|\/$/g, "").toLowerCase();
  return normalize(path1) === normalize(path2);
}

function joinUrl(...parts: string[]): string {
  const joined = parts.join("/");
  return joined.replace(/\/+/g, "/");
}

export function url(path: string): string {
  return joinUrl("", path);
}

export function getPostUrlBySlug(slug: string): string {
  return url(`/posts/${slug}`);
}

export function getTagUrl(tag: string): string {
  if (!tag) return url("/archive");
  return url(`/archive?tag=${encodeURIComponent(tag.trim())}`);
}

export function getCategoryUrl(category: string | null): string {
  if (
    !category ||
    category.trim() === "" ||
    category.trim().toLowerCase() === t("uncategorized").toLowerCase()
  ) {
    return url("/archive?uncategorized=true");
  }
  return url(`/archive?category=${encodeURIComponent(category.trim())}`);
}

export function formatDateToYYYYMMDD(date: Date): string {
  return date.toISOString().substring(0, 10);
}
