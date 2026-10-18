import { notFound } from "next/navigation";

import MainGridLayout from "@/components/layout/main-grid";
import Pagination from "@/components/post/pagination";
import PostCard from "@/components/post/post-card";
import { PAGE_SIZE } from "@/lib/constants";
import { getSortedPosts } from "@/lib/content";

export const ensureStatic = "navigation";

function getPagination() {
  const posts = getSortedPosts();
  const lastPage = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  return { posts, lastPage };
}

export function generateStaticParams() {
  const { lastPage } = getPagination();
  const pages = Array.from(
    { length: Math.max(0, lastPage - 1) },
    (_, index) => ({
      page: [String(index + 2)],
    }),
  );
  return [{ page: [] }, ...pages];
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ page?: string[] }>;
}) {
  const { page } = await params;
  const currentPage = page && page.length > 0 ? Number(page[0]) : 1;

  const { posts, lastPage } = getPagination();

  if (
    !Number.isInteger(currentPage) ||
    currentPage < 1 ||
    currentPage > lastPage
  ) {
    notFound();
  }

  const pagePosts = posts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <MainGridLayout>
      <div className="flex flex-col gap-4">
        {pagePosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        className="mt-4"
      />
    </MainGridLayout>
  );
}
