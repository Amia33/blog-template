import { allPosts, allSpecs } from "content-collections";

import { t } from "@/lib/strings";
import { getCategoryUrl } from "@/lib/utils";

export type Post = (typeof allPosts)[number];

export type PostWithNav = Post & {
  prevSlug?: string;
  prevTitle?: string;
  nextSlug?: string;
  nextTitle?: string;
};

const isProduction = process.env.NODE_ENV === "production";

export function getSortedPosts(): Post[] {
  return allPosts
    .filter((post) => (isProduction ? !post.draft : true))
    .sort((a, b) => (a.published > b.published ? -1 : 1));
}

export function getSortedPostsWithNav(): PostWithNav[] {
  const sorted = getSortedPosts();

  return sorted.map((post, index) => ({
    ...post,
    nextSlug: sorted[index - 1]?.slug,
    nextTitle: sorted[index - 1]?.title,
    prevSlug: sorted[index + 1]?.slug,
    prevTitle: sorted[index + 1]?.title,
  }));
}

export function getPostBySlug(slug: string): PostWithNav | undefined {
  return getSortedPostsWithNav().find((post) => post.slug === slug);
}

export type Tag = {
  name: string;
  count: number;
};

export function getTags(): Tag[] {
  const countMap: Record<string, number> = {};

  for (const post of getSortedPosts()) {
    for (const tag of post.tags) {
      countMap[tag] = (countMap[tag] ?? 0) + 1;
    }
  }

  return Object.keys(countMap)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map((name) => ({ name, count: countMap[name] }));
}

export type Category = {
  name: string;
  count: number;
  url: string;
};

export function getCategories(): Category[] {
  const countMap: Record<string, number> = {};

  for (const post of getSortedPosts()) {
    const name =
      post.category && post.category.trim() !== ""
        ? post.category.trim()
        : t("uncategorized");
    countMap[name] = (countMap[name] ?? 0) + 1;
  }

  return Object.keys(countMap)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map((name) => ({
      name,
      count: countMap[name],
      url: getCategoryUrl(name),
    }));
}

export function getAbout() {
  return allSpecs[0];
}

export function paginate<T>(items: T[], pageSize: number) {
  const lastPage = Math.max(1, Math.ceil(items.length / pageSize));
  return { items, lastPage };
}
