import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import MainGridLayout from "@/components/layout/main-grid";
import License from "@/components/post/license";
import Markdown from "@/components/post/markdown";
import MdxContent from "@/components/post/mdx-content";
import PostMeta from "@/components/post/post-meta";
import { Icon } from "@/components/ui/icon";
import { getPostBySlug, getSortedPosts } from "@/lib/content";
import { i18n, I18nKey } from "@/lib/i18n";
import { getPostHeadings } from "@/lib/toc";
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

  const headings = getPostHeadings(post.content);
  const postUrl = getPostUrlBySlug(post.slug);

  return (
    <MainGridLayout headings={headings}>
      <article className="card bg-base-100 p-6 md:p-9">
        <div className="mb-3 flex gap-5 text-sm text-base-content/50">
          <span className="flex items-center gap-1">
            <Icon name="notes" className="text-base" />
            {post.words}{" "}
            {i18n(post.words === 1 ? I18nKey.wordCount : I18nKey.wordsCount)}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="schedule" className="text-base" />
            {post.readingTime}{" "}
            {i18n(
              post.readingTime === 1
                ? I18nKey.minuteCount
                : I18nKey.minutesCount,
            )}
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

      <div className="mt-4 flex flex-col gap-4 md:flex-row">
        {post.nextSlug ? (
          <Link
            href={getPostUrlBySlug(post.nextSlug)}
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
            className="btn btn-soft h-auto min-h-14 flex-1 justify-end gap-3 overflow-hidden py-3 normal-case"
          >
            <span className="truncate font-medium">{post.prevTitle}</span>
            <Icon name="chevronRight" className="text-2xl text-primary" />
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </div>
    </MainGridLayout>
  );
}
