import { Suspense } from "react";

import DirectionalTransition from "@/components/layout/directional-transition";
import PageShell from "@/components/layout/page-shell";
import ArchiveList, { type ArchivePost } from "@/components/post/archive-list";
import PageHeader from "@/components/ui/page-header";
import { getSortedPosts } from "@/lib/content";
import { pageAlternates, pageOpenGraph, pageTwitter } from "@/lib/seo";
import { t } from "@/lib/strings";

export const metadata = {
  title: t("archive"),
  alternates: pageAlternates("/archive"),
  openGraph: pageOpenGraph({ url: "/archive", title: t("archive") }),
  twitter: pageTwitter({ title: t("archive") }),
};

export default function ArchivePage() {
  const posts: ArchivePost[] = getSortedPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    tags: post.encrypted ? [] : post.tags,
    category: post.encrypted ? null : post.category,
    published: post.published,
    pinned: post.pinned,
    encrypted: post.encrypted,
  }));

  return (
    <PageShell page="archive">
      <DirectionalTransition>
        <PageHeader
          title={t("archive")}
          count={`${posts.length} ${t("postCount")}`}
        />
        <Suspense
          fallback={
            <div
              role="status"
              className="card bg-base-100 p-8 text-center opacity-70"
            >
              アーカイブを読み込んでいます&hellip;
            </div>
          }
        >
          <ArchiveList posts={posts} />
        </Suspense>
      </DirectionalTransition>
    </PageShell>
  );
}
