import { profileConfig, siteConfig } from "@/lib/config";
import type { Post } from "@/lib/content";
import { absoluteUrl, ogImageUrl } from "@/lib/seo";
import { t } from "@/lib/strings";
import { getCategoryUrl, getPostUrlBySlug } from "@/lib/utils";

function personJsonLd() {
  return {
    "@type": "Person",
    name: profileConfig.name,
    ...(profileConfig.bio ? { description: profileConfig.bio } : {}),
    ...(profileConfig.avatar
      ? { image: absoluteUrl(profileConfig.avatar) }
      : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.title,
    description: siteConfig.subtitle,
    url: siteConfig.url,
    inLanguage: siteConfig.lang,
    author: personJsonLd(),
  };
}

function breadcrumbJsonLd(post: Post) {
  const hidden = post.encrypted && post.hideHomeContent;
  const items = [
    { name: siteConfig.title, url: absoluteUrl("/") },
    ...(!hidden && post.category
      ? [
          {
            name: post.category,
            url: absoluteUrl(getCategoryUrl(post.category)),
          },
        ]
      : []),
    { name: post.title, url: absoluteUrl(getPostUrlBySlug(post.slug)) },
  ];

  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function postJsonLd(post: Post) {
  const url = absoluteUrl(getPostUrlBySlug(post.slug));
  const hidden = post.encrypted && post.hideHomeContent;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: hidden
          ? t("protectedPostDescription")
          : post.description || post.excerpt,
        datePublished: post.published.toISOString(),
        dateModified: (post.updated ?? post.published).toISOString(),
        inLanguage: post.lang || siteConfig.lang,
        author: personJsonLd(),
        image: ogImageUrl(post),
        url,
        mainEntityOfPage: url,
        ...(!hidden && post.tags.length > 0
          ? { keywords: post.tags.join(", ") }
          : {}),
        ...(!hidden && post.category ? { articleSection: post.category } : {}),
      },
      breadcrumbJsonLd(post),
    ],
  };
}
