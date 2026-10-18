import type { Metadata } from "next";

import { profileConfig, siteConfig } from "@/lib/config";
import type { Post } from "@/lib/content";

export const SITE_TITLE = `${siteConfig.title} - ${siteConfig.subtitle}`;
export const SITE_DESCRIPTION = siteConfig.subtitle;
export const DEFAULT_OG_IMAGE = "/og-default.jpg";

// Metadata is merged shallowly between segments, so any page that sets
// `alternates` or `openGraph` replaces the root layout's value wholesale. These
// helpers keep the shared fields from disappearing.
const RSS_TYPES = { "application/rss+xml": "/rss.xml" };

export function absoluteUrl(path: string): string {
  return `${siteConfig.url.replace(/\/+$/, "")}${path}`;
}

export function pageAlternates(canonical: string): Metadata["alternates"] {
  return { canonical, types: RSS_TYPES };
}

function twitterCreator(): string | undefined {
  const link = profileConfig.links.find((item) => item.icon === "twitter");
  const handle = link
    ? /(?:twitter|x)\.com\/@?([A-Za-z0-9_]{1,15})\/?$/.exec(link.url)
    : null;

  return handle ? `@${handle[1]}` : undefined;
}

export function ogImageUrl(post: Post): string {
  const cover = post.cover;
  if (!cover) return DEFAULT_OG_IMAGE;
  return cover.remote ? cover.src : absoluteUrl(cover.src);
}

export function pageOpenGraph({
  url,
  title = SITE_TITLE,
  description = SITE_DESCRIPTION,
  image = DEFAULT_OG_IMAGE,
}: {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}): Metadata["openGraph"] {
  return {
    type: "website",
    siteName: siteConfig.title,
    title,
    description,
    url,
    locale: siteConfig.lang,
    images: [{ url: image, width: 1200, height: 630, alt: title }],
  };
}

export function pageTwitter({
  title = SITE_TITLE,
  description = SITE_DESCRIPTION,
  image = DEFAULT_OG_IMAGE,
}: {
  title?: string;
  description?: string;
  image?: string;
} = {}): Metadata["twitter"] {
  const creator = twitterCreator();

  return {
    card: "summary_large_image",
    title,
    description,
    images: [image],
    ...(creator ? { creator } : {}),
  };
}
