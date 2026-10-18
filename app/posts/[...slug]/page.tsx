import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import DirectionalTransition from "@/components/layout/directional-transition";
import License from "@/components/post/license";
import Lightbox from "@/components/post/lightbox";
import Markdown from "@/components/post/markdown";
import MdxContent from "@/components/post/mdx-content";
import PostMeta from "@/components/post/post-meta";
import { Icon } from "@/components/ui/icon";
import JsonLd from "@/components/ui/json-ld";
import { profileConfig, siteConfig } from "@/lib/config";
import { getPostBySlug, getSortedPosts } from "@/lib/content";
import { t } from "@/lib/strings";
import { getPostUrlBySlug } from "@/lib/utils";

export const ensureStatic = "navigation";

export function generateStaticParams() {
  return getSortedPosts().map((post) => ({ slug: post.slug.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug.join("/"));
  if (!post) return {};
  return {
    title: post.title,
    description: post.description || post.excerpt,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug.join("/"));

  if (!post) notFound();

  const postUrl = getPostUrlBySlug(post.slug);

  return (
    <DirectionalTransition>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description || post.excerpt,
          datePublished: post.published.toISOString(),
          dateModified: (post.updated ?? post.published).toISOString(),
          author: { "@type": "Person", name: profileConfig.name },
          image: post.image ? `${siteConfig.url}${post.image}` : undefined,
          mainEntityOfPage: `${siteConfig.url}${postUrl}`,
        }}
      />
      <Lightbox>
        <article className="card bg-base-100 p-6 md:p-9">
          <div className="mb-3 flex gap-5 text-sm text-base-content/50">
            <span className="flex items-center gap-1">
              <Icon name="notes" className="text-base" />
              {post.words} {t(post.words === 1 ? "wordCount" : "wordsCount")}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="schedule" className="text-base" />
              {post.readingTime}{" "}
              {t(post.readingTime === 1 ? "minuteCount" : "minutesCount")}
            </span>
          </div>

          <h1 className="mb-3 text-3xl font-bold md:text-4xl">{post.title}</h1>

          <PostMeta
            published={post.published}
            updated={post.updated}
            tags={post.tags}
            category={post.category}
            className="mb-5"
          />

          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              width={1200}
              height={630}
              className="mb-6 h-auto w-full rounded-box object-cover"
            />
          ) : (
            <div className="mb-5 border-b border-dashed border-base-300" />
          )}

          <Markdown className="mb-6">
            <MdxContent code={post.mdx} />
          </Markdown>

          <License title={post.title} url={postUrl} pubDate={post.published} />
        </article>
      </Lightbox>

      <div className="mt-4 flex flex-col gap-4 md:flex-row">
        {post.nextSlug ? (
          <Link
            href={getPostUrlBySlug(post.nextSlug)}
            transitionTypes={["nav-forward"]}
            className="btn btn-soft h-auto min-h-14 flex-1 justify-start gap-3 overflow-hidden py-3 normal-case"
          >
            <Icon name="chevronLeft" className="text-2xl text-primary" />
            <span className="truncate font-medium">{post.nextTitle}</span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {post.prevSlug ? (
          <Link
            href={getPostUrlBySlug(post.prevSlug)}
            transitionTypes={["nav-forward"]}
            className="btn btn-soft h-auto min-h-14 flex-1 justify-end gap-3 overflow-hidden py-3 normal-case"
          >
            <span className="truncate font-medium">{post.prevTitle}</span>
            <Icon name="chevronRight" className="text-2xl text-primary" />
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </div>
    </DirectionalTransition>
  );
}
