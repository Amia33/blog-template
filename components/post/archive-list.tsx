"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { Icon } from "@/components/ui/icon";
import { t } from "@/lib/strings";
import { getPostUrlBySlug } from "@/lib/utils";

export type ArchivePost = {
  slug: string;
  title: string;
  tags: string[];
  category: string | null;
  published: Date;
  pinned: boolean;
  encrypted: boolean;
};

function formatDate(date: Date): string {
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
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
      const year = post.published.getUTCFullYear();
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
        {t("noPosts")}
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
            <span className="text-sm opacity-70">
              {group.items.length}{" "}
              {t(group.items.length === 1 ? "postCount" : "postsCount")}
            </span>
          </div>
          <ul className="menu w-full p-0 py-1">
            {group.items.map((post) => (
              <li key={post.slug}>
                <Link
                  href={getPostUrlBySlug(post.slug)}
                  aria-label={post.title}
                  transitionTypes={["nav-forward"]}
                  className="flex-wrap gap-x-4"
                >
                  <span className="w-14 shrink-0 text-sm tabular-nums opacity-70">
                    {formatDate(post.published)}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {post.title}
                  </span>
                  {post.pinned ? (
                    <span
                      className="shrink-0 text-primary"
                      role="img"
                      aria-label={t("pinned")}
                    >
                      <Icon name="pin" className="text-sm" />
                    </span>
                  ) : null}
                  {post.encrypted ? (
                    <span
                      className="shrink-0 opacity-70"
                      role="img"
                      aria-label={t("protected")}
                    >
                      <Icon name="lock" className="text-sm" />
                    </span>
                  ) : null}
                  <span className="hidden shrink-0 text-xs opacity-70 md:block">
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
