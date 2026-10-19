import type { MetadataRoute } from "next";

import { postListConfig, siteConfig } from "@/lib/config";
import { getAlbums, getSortedPosts } from "@/lib/content";
import { getAlbumUrl, getPostUrlBySlug } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getSortedPosts();
  const lastPage = Math.max(
    1,
    Math.ceil(posts.length / postListConfig.pageSize),
  );

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

  const albumRoutes: MetadataRoute.Sitemap = getAlbums().map((album) => ({
    url: `${siteConfig.url}${getAlbumUrl(album.slug)}`,
    lastModified: album.date,
    changeFrequency: "monthly" as const,
    priority: 0.6,
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
      url: `${siteConfig.url}/moments`,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/albums`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/timeline`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/categories`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/tags`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...postRoutes,
    ...albumRoutes,
  ];
}
