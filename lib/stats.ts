import "server-only";

import {
  getCategories,
  getSortedMoments,
  getSortedPosts,
  getTags,
} from "@/lib/content";

const DAY_MS = 24 * 60 * 60 * 1000;

export type SiteStats = {
  posts: number;
  moments: number;
  categories: number;
  tags: number;
  words: number;
  days: number;
  lastUpdated: Date | null;
};

export function getSiteStats(): SiteStats {
  const posts = getSortedPosts();
  const moments = getSortedMoments();
  const categories = getCategories();
  const tags = getTags();

  const totalWords = posts.reduce((sum, post) => sum + post.words, 0);

  // Use content dates rather than `Date.now()` so the value is stable during
  // static prerendering. "Days" is the span from the first post to the most
  // recent update.
  const earliest = posts.reduce(
    (min, post) => Math.min(min, post.published.getTime()),
    Number.POSITIVE_INFINITY,
  );
  const lastUpdated = posts.reduce(
    (max, post) => Math.max(max, (post.updated ?? post.published).getTime()),
    0,
  );

  return {
    posts: posts.length,
    moments: moments.length,
    categories: categories.length,
    tags: tags.length,
    words: totalWords,
    days:
      Number.isFinite(earliest) && lastUpdated > 0
        ? Math.max(1, Math.ceil((lastUpdated - earliest) / DAY_MS))
        : 0,
    lastUpdated: lastUpdated > 0 ? new Date(lastUpdated) : null,
  };
}
