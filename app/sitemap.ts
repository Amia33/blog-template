import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config";
import { PAGE_SIZE } from "@/lib/constants";
import { getSortedPosts } from "@/lib/content";
import { getPostUrlBySlug } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getSortedPosts();
  const lastPage = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));

  const paginationRoutes: MetadataRoute.Sitemap = Array.from(
    { length: Math.max(0, lastPage - 1) },
    (_, index) => ({
      url: `${siteConfig.url}/${index + 2}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }),
  );

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}${getPostUrlBySlug(post.slug)}`,
    lastModified: post.updated ?? post.published,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: siteConfig.url,
      changeFrequency: "daily",
      priority: 1,
    },
    ...paginationRoutes,
    {
      url: `${siteConfig.url}/archive`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...postRoutes,
  ];
}
