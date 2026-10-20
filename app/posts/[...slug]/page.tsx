import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import DirectionalTransition from "@/components/layout/directional-transition";
import PageShell from "@/components/layout/page-shell";
import LastUpdatedNotice from "@/components/post/last-updated-notice";
import License from "@/components/post/license";
import Lightbox from "@/components/post/lightbox";
import Markdown from "@/components/post/markdown";
import MdxContent from "@/components/post/mdx-content";
import PostCover from "@/components/post/post-cover";
import PostMeta from "@/components/post/post-meta";
import ProtectedPostBody from "@/components/post/protected-post-body";
import { Icon } from "@/components/ui/icon";
import JsonLd from "@/components/ui/json-ld";
import { articleConfig } from "@/lib/config";
import {
  getLatestPostDate,
  getPostBySlug,
  getSortedPosts,
} from "@/lib/content";
import { ogImageUrl, pageAlternates } from "@/lib/seo";
import { postJsonLd } from "@/lib/structured-data";
import { t } from "@/lib/strings";
import { getPostUrlBySlug } from "@/lib/utils";

function ProtectedContentSkeleton() {
  return (
    <div className="my-6 space-y-3" aria-hidden="true">
      <div className="skeleton h-6 w-2/3" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-11/12" />
      <div className="skeleton h-4 w-4/5" />
    </div>
  );
}

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

  const hidden = post.encrypted && post.hideHomeContent;
  const description = hidden
    ? t("protectedPostDescription")
    : post.description || post.excerpt;
  const image = ogImageUrl(post);

  return {
    ...(post.encrypted ? { robots: { index: false, follow: false } } : {}),
    title: post.title,
    description,
    alternates: pageAlternates(getPostUrlBySlug(post.slug)),
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: getPostUrlBySlug(post.slug),
      publishedTime: post.published.toISOString(),
      modifiedTime: (post.updated ?? post.published).toISOString(),
      tags: hidden ? [] : post.tags,
      images: [{ url: image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [image],
    },
  };
}

function PostSkeleton() {
  return (
    <article className="card bg-base-100 p-6 md:p-9" aria-hidden="true">
      <div className="skeleton mb-4 h-4 w-40" />
      <div className="skeleton mb-3 h-9 w-3/4" />
      <div className="skeleton mb-5 h-4 w-1/2" />
      <div className="skeleton mb-6 h-56 w-full rounded-box" />
      <div className="space-y-3">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-11/12" />
        <div className="skeleton h-4 w-4/5" />
      </div>
    </article>
  );
}

export default function PostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  return (
    <PageShell page="post">
      <DirectionalTransition>
        <Suspense fallback={<PostSkeleton />}>
          <PostContent params={params} />
        </Suspense>
      </DirectionalTransition>
    </PageShell>
  );
}

async function PostContent({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug.join("/"));

  if (!post) notFound();

  const postUrl = getPostUrlBySlug(post.slug);
  const hidden = post.encrypted && post.hideHomeContent;
  const latestPostDate = getLatestPostDate();

  return (
    <>
      {!post.encrypted ? <JsonLd data={postJsonLd(post)} /> : null}
      <article className="card bg-base-100 p-6 md:p-9">
        <div className="mb-3 flex flex-wrap gap-5 text-sm text-base-content/50">
          {!post.encrypted ? (
            <>
              <span className="flex items-center gap-1">
                <Icon name="notes" className="text-base" />
                {post.words} {t(post.words === 1 ? "wordCount" : "wordsCount")}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="schedule" className="text-base" />
                {post.readingTime}{" "}
                {t(post.readingTime === 1 ? "minuteCount" : "minutesCount")}
              </span>
            </>
          ) : null}
          {post.pinned ? (
            <span className="flex items-center gap-1 text-primary">
              <Icon name="pin" className="text-base" />
              {t("pinned")}
            </span>
          ) : null}
          {post.encrypted ? (
            <span className="flex items-center gap-1">
              <Icon name="lock" className="text-base" />
              {t("protected")}
            </span>
          ) : null}
        </div>

        <h1 className="mb-3 text-3xl font-bold md:text-4xl">{post.title}</h1>

        <PostMeta
          published={post.published}
          updated={post.updated}
          tags={post.tags}
          category={post.category}
          showCategory={!hidden}
          showTags={!hidden}
          className="mb-5"
        />

        {post.encrypted ? (
          <div
            className="mb-6 flex h-48 items-center justify-center rounded-box bg-base-200"
            aria-hidden="true"
          >
            <Icon name="lock" className="text-5xl opacity-30" />
          </div>
        ) : post.cover ? (
          <PostCover
            cover={post.cover}
            alt={post.title}
            sizes="(min-width: 768px) 768px, 100vw"
            priority
            className="mb-6 h-auto w-full rounded-box object-cover"
          />
        ) : (
          <div className="mb-5 border-b border-dashed border-base-300" />
        )}

        {post.encrypted ? (
          <Suspense fallback={<ProtectedContentSkeleton />}>
            <ProtectedPostBody slug={post.slug} hint={post.passwordHint} />
          </Suspense>
        ) : (
          <Lightbox>
            <Markdown className="mb-6">
              <MdxContent code={post.mdx} />
            </Markdown>
          </Lightbox>
        )}

        {articleConfig.lastUpdated.enable ? (
          <LastUpdatedNotice
            date={post.updated ?? post.published}
            minimumAgeDays={articleConfig.lastUpdated.minimumAgeDays}
            reference={latestPostDate}
          />
        ) : null}

        <License title={post.title} url={postUrl} pubDate={post.published} />
      </article>

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
    </>
  );
}
