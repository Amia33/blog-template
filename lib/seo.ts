import type { Metadata } from "next";

import { siteConfig } from "@/lib/config";
import type { Post } from "@/lib/content";
import { OG_LOCALE } from "@/lib/i18n/locales";

export const SITE_TITLE = `${siteConfig.title} - ${siteConfig.subtitle}`;
export const SITE_DESCRIPTION = siteConfig.subtitle;
export const DEFAULT_OG_IMAGE = siteConfig.ogImage ?? siteConfig.banner.src;

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
    locale: OG_LOCALE[siteConfig.locale],
    images: [{ url: image, alt: title }],
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
  return {
    card: "summary_large_image",
    title,
    description,
    images: [image],
  };
}
