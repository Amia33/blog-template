import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import Banner from "@/components/layout/banner";
import DirectionalTransition from "@/components/layout/directional-transition";
import PageShell from "@/components/layout/page-shell";
import Pagination from "@/components/post/pagination";
import PostCard from "@/components/post/post-card";
import { postListConfig } from "@/lib/config";
import { getSortedPosts } from "@/lib/content";
import { pageAlternates } from "@/lib/seo";
import { t } from "@/lib/strings";

// Unknown pagination params must wait for their static result (a 404 or the /1
// redirect) instead of serving the Partial Prerender shell as a 200.
export const ensureStatic = "navigation";

const PAGE_SIZE = postListConfig.pageSize;
const PAGE_SEGMENT = /^\d{1,6}$/;

function parsePageSegment(page?: string[]): number | null {
  if (!page || page.length === 0) return 1;
  if (page.length > 1 || !PAGE_SEGMENT.test(page[0])) return null;
  return Number(page[0]);
}

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
  return [{ page: [] }, { page: ["1"] }, ...pages];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page?: string[] }>;
}): Promise<Metadata> {
  const { page } = await params;
  const currentPage = parsePageSegment(page);

  if (currentPage === null) return {};

  return {
    alternates: pageAlternates(currentPage > 1 ? `/${currentPage}` : "/"),
    ...(currentPage > 1
      ? { title: `${t("home")}（${currentPage}ページ目）` }
      : {}),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ page?: string[] }>;
}) {
  const { page } = await params;
  const currentPage = parsePageSegment(page);

  if (currentPage === null) notFound();

  if (currentPage === 1 && page && page.length === 1) {
    permanentRedirect("/");
  }

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
    <PageShell page="home">
      <DirectionalTransition>
        {currentPage === 1 ? <Banner /> : null}
        <div
          className="post-list"
          data-card-width={postListConfig.layout.cardWidth}
          data-cover={postListConfig.layout.cover}
        >
          {pagePosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          className="mt-4"
        />
      </DirectionalTransition>
    </PageShell>
  );
}
