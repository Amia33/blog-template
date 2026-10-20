import { cacheLife } from "next/cache";
import { Feed } from "feed";

import { siteConfig } from "@/lib/config";
import { getSortedPosts } from "@/lib/content";
import { getPostUrlBySlug } from "@/lib/utils";

async function buildRssFeed(): Promise<string> {
  "use cache";
  cacheLife("days");

  // Protected posts are intentionally excluded. Their body is server-gated, so
  // publishing even a summary here would leak more than the site exposes.
  const posts = getSortedPosts().filter((post) => !post.encrypted);

  const feed = new Feed({
    title: siteConfig.title,
    description: siteConfig.subtitle,
    id: siteConfig.url,
    link: siteConfig.url,
    language: siteConfig.lang,
    feedLinks: { rss: `${siteConfig.url}/rss.xml` },
  });

  for (const post of posts) {
    const url = `${siteConfig.url}${getPostUrlBySlug(post.slug)}`;

    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.description || post.excerpt,
      date: post.updated ?? post.published,
      category: post.tags.map((name) => ({ name })),
    });
  }

  return feed.rss2();
}

export async function GET() {
  const xml = await buildRssFeed();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
