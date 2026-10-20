import "server-only";

import { allAlbums, allMoments, allPosts, allSpecs } from "content-collections";

import { t } from "@/lib/strings";
import { getCategoryUrl } from "@/lib/utils";

export type Post = (typeof allPosts)[number];
export type Moment = (typeof allMoments)[number];
export type Album = (typeof allAlbums)[number];

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
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      const byDate = b.published.getTime() - a.published.getTime();
      return byDate !== 0 ? byDate : a.slug.localeCompare(b.slug);
    });
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

export function getLatestPostDate(): Date {
  return getSortedPosts().reduce((latest, post) => {
    const date = post.updated ?? post.published;
    return date > latest ? date : latest;
  }, new Date(0));
}

export function getSortedMoments(): Moment[] {
  return allMoments
    .filter((moment) => (isProduction ? !moment.draft : true))
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      const byDate = b.published.getTime() - a.published.getTime();
      return byDate !== 0 ? byDate : a.slug.localeCompare(b.slug);
    });
}

export type Tag = {
  name: string;
  count: number;
};

export function getTags(): Tag[] {
  const countMap: Record<string, number> = {};

  for (const post of getSortedPosts()) {
    if (post.encrypted) continue;

    for (const tag of post.tags) {
      countMap[tag] = (countMap[tag] ?? 0) + 1;
    }
  }

  return Object.keys(countMap)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map((name) => ({ name, count: countMap[name] }));
}

export function getMomentTags(): Tag[] {
  const countMap: Record<string, number> = {};

  for (const moment of getSortedMoments()) {
    for (const tag of moment.tags) {
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
    if (post.encrypted) continue;

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

export function getAlbums(): Album[] {
  return allAlbums
    .filter((album) => !album.hidden)
    .sort((a, b) => {
      const byDate = b.date.getTime() - a.date.getTime();
      return byDate !== 0 ? byDate : a.slug.localeCompare(b.slug);
    });
}

export function getAlbumBySlug(slug: string): Album | undefined {
  // `hidden` keeps an album out of listings; direct links still resolve.
  return allAlbums.find((album) => album.slug === slug);
}

export type AlbumIndexItem = {
  slug: string;
  title: string;
  description: string;
  cover: Album["cover"];
  date: string;
  tags: string[];
  encrypted: boolean;
  photoCount: number;
};

export function toAlbumIndexItem(album: Album): AlbumIndexItem {
  return {
    slug: album.slug,
    title: album.title,
    description: album.description,
    cover: album.encrypted ? null : album.cover,
    date: album.date.toISOString(),
    tags: album.tags,
    encrypted: album.encrypted,
    photoCount: album.encrypted ? 0 : album.photos.length,
  };
}

export function getAbout() {
  return allSpecs[0];
}

export function paginate<T>(items: T[], pageSize: number) {
  const lastPage = Math.max(1, Math.ceil(items.length / pageSize));
  return { items, lastPage };
}
