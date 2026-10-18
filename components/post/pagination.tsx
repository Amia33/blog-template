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
    <nav aria-label="Pagination" className={`flex justify-center ${className}`}>
      <div className="join">
        {currentPage > 1 ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="join-item btn"
            aria-label="Previous page"
          >
            <Icon name="chevronLeft" className="text-xl" />
          </Link>
        ) : (
          <button
            type="button"
            className="btn join-item btn-disabled"
            aria-label="Previous page"
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
              className="join-item btn"
              aria-label={`Page ${page}`}
            >
              {page}
            </Link>
          ),
        )}
        {currentPage < lastPage ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="join-item btn"
            aria-label="Next page"
          >
            <Icon name="chevronRight" className="text-xl" />
          </Link>
        ) : (
          <button
            type="button"
            className="btn join-item btn-disabled"
            aria-label="Next page"
          >
            <Icon name="chevronRight" className="text-xl" />
          </button>
        )}
      </div>
    </nav>
  );
}
