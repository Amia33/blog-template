"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { i18n, I18nKey } from "@/lib/i18n";
import { getPostUrlBySlug } from "@/lib/utils";

export type ArchivePost = {
  slug: string;
  title: string;
  tags: string[];
  category: string | null;
  published: Date;
};

function formatDate(date: Date): string {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}-${day}`;
}

export default function ArchiveList({ posts }: { posts: ArchivePost[] }) {
  const searchParams = useSearchParams();
  const paramsKey = searchParams.toString();

  const groups = useMemo(() => {
    const params = new URLSearchParams(paramsKey);
    const tags = params.getAll("tag");
    const categories = params.getAll("category");
    const uncategorized = params.get("uncategorized");

    let filtered = posts;
    if (tags.length > 0) {
      filtered = filtered.filter((post) =>
        post.tags.some((tag) => tags.includes(tag)),
      );
    }
    if (categories.length > 0) {
      filtered = filtered.filter(
        (post) => post.category && categories.includes(post.category),
      );
    }
    if (uncategorized) {
      filtered = filtered.filter((post) => !post.category);
    }

    const map = new Map<number, ArchivePost[]>();
    for (const post of filtered) {
      const year = post.published.getFullYear();
      const bucket = map.get(year);
      if (bucket) bucket.push(post);
      else map.set(year, [post]);
    }

    return [...map.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([year, items]) => ({ year, items }));
  }, [posts, paramsKey]);

  if (groups.length === 0) {
    return (
      <div className="card bg-base-100 p-8 text-center opacity-70">
        No posts found.
      </div>
    );
  }

  return (
    <div className="card bg-base-100 p-6">
      {groups.map((group) => (
        <section key={group.year}>
          <div className="flex items-center gap-3 border-b border-dashed border-base-300 py-3">
            <span className="text-2xl font-bold tabular-nums">
              {group.year}
            </span>
            <span className="text-sm opacity-50">
              {group.items.length}{" "}
              {i18n(
                group.items.length === 1
                  ? I18nKey.postCount
                  : I18nKey.postsCount,
              )}
            </span>
          </div>
          <ul className="menu w-full p-0 py-1">
            {group.items.map((post) => (
              <li key={post.slug}>
                <Link
                  href={getPostUrlBySlug(post.slug)}
                  aria-label={post.title}
                  className="flex-wrap gap-x-4"
                >
                  <span className="w-14 shrink-0 text-sm tabular-nums opacity-60">
                    {formatDate(post.published)}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {post.title}
                  </span>
                  <span className="hidden shrink-0 text-xs opacity-40 md:block">
                    {post.tags.map((tag) => `#${tag}`).join(" ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
