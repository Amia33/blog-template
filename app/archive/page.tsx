import { Suspense } from "react";

import MainGridLayout from "@/components/layout/main-grid";
import ArchiveList, { type ArchivePost } from "@/components/post/archive-list";
import { getSortedPosts } from "@/lib/content";
import { i18n, I18nKey } from "@/lib/i18n";

export const metadata = {
  title: i18n(I18nKey.archive),
};

export default function ArchivePage() {
  const posts: ArchivePost[] = getSortedPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    tags: post.tags,
    category: post.category,
    published: post.published,
  }));

  return (
    <MainGridLayout>
      <Suspense
        fallback={
          <div className="card bg-base-100 p-8 text-center opacity-70">
            Loading&hellip;
          </div>
        }
      >
        <ArchiveList posts={posts} />
      </Suspense>
    </MainGridLayout>
  );
}
