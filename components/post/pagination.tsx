import Link from "next/link";

import { Icon } from "@/components/ui/icon";

const HIDDEN = -1;
const ADJ_DIST = 2;
const VISIBLE = ADJ_DIST * 2 + 1;

function getPageUrl(page: number): string {
  return page === 1 ? "/" : `/${page}`;
}

export default function Pagination({
  currentPage,
  lastPage,
  className = "",
}: {
  currentPage: number;
  lastPage: number;
  className?: string;
}) {
  if (lastPage <= 1) return null;

  let count = 1;
  let left = currentPage;
  let right = currentPage;

  while (left > 1 && right + 1 <= lastPage && count + 2 <= VISIBLE) {
    count += 2;
    left -= 1;
    right += 1;
  }
  while (left > 1 && count < VISIBLE) {
    count += 1;
    left -= 1;
  }
  while (right + 1 <= lastPage && count < VISIBLE) {
    count += 1;
    right += 1;
  }

  const pages: number[] = [];
  if (left > 1) pages.push(1);
  if (left === 3) pages.push(2);
  if (left > 3) pages.push(HIDDEN);
  for (let page = left; page <= right; page += 1) pages.push(page);
  if (right < lastPage - 2) pages.push(HIDDEN);
  if (right === lastPage - 2) pages.push(lastPage - 1);
  if (right < lastPage) pages.push(lastPage);

  return (
    <nav
      aria-label="ページネーション"
      className={`flex justify-center ${className}`}
    >
      <div className="join">
        {currentPage > 1 ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            transitionTypes={["nav-back"]}
            className="join-item btn"
            aria-label="前のページ"
          >
            <Icon name="chevronLeft" className="text-xl" />
          </Link>
        ) : (
          <button
            type="button"
            className="btn join-item btn-disabled"
            aria-label="前のページ"
          >
            <Icon name="chevronLeft" className="text-xl" />
          </button>
        )}
        {pages.map((page, index) =>
          page === HIDDEN ? (
            <button
              key={`hidden-${index}`}
              type="button"
              className="btn join-item btn-disabled"
            >
              &hellip;
            </button>
          ) : page === currentPage ? (
            <button
              key={page}
              type="button"
              className="btn join-item btn-primary"
              aria-current="page"
            >
              {page}
            </button>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page)}
              transitionTypes={[
                page > currentPage ? "nav-forward" : "nav-back",
              ]}
              className="join-item btn"
              aria-label={`${page} ページ目`}
            >
              {page}
            </Link>
          ),
        )}
        {currentPage < lastPage ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            transitionTypes={["nav-forward"]}
            className="join-item btn"
            aria-label="次のページ"
          >
            <Icon name="chevronRight" className="text-xl" />
          </Link>
        ) : (
          <button
            type="button"
            className="btn join-item btn-disabled"
            aria-label="次のページ"
          >
            <Icon name="chevronRight" className="text-xl" />
          </button>
        )}
      </div>
    </nav>
  );
}
