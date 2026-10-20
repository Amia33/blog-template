"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { siteConfig } from "@/lib/config";
import { t } from "@/lib/strings";

export type TocHeading = {
  depth: number;
  text: string;
  slug: string;
};

const EMPTY = "[]";

let snapshot = EMPTY;

function collectHeadings(): TocHeading[] {
  const container = document.querySelector("article");
  if (!container) return [];

  const nodes = container.querySelectorAll<HTMLElement>(
    "h1[id], h2[id], h3[id], h4[id]",
  );
  const headings: TocHeading[] = [];

  for (const node of nodes) {
    const text = (node.firstChild?.textContent ?? "").trim();
    if (!text) continue;
    headings.push({
      depth: Number(node.tagName.slice(1)),
      text,
      slug: node.id,
    });
  }

  if (headings.length === 0) return [];

  const minDepth = Math.min(...headings.map((heading) => heading.depth));
  const maxDepth = minDepth + siteConfig.toc.depth;

  return headings.filter((heading) => heading.depth < maxDepth);
}

const listeners = new Set<() => void>();

function refresh() {
  const next = JSON.stringify(collectHeadings());
  if (next === snapshot) return;
  snapshot = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  const observer = new MutationObserver(refresh);
  observer.observe(document.body, { childList: true, subtree: true });
  refresh();

  return () => {
    listeners.delete(listener);
    observer.disconnect();
  };
}

function getSnapshot() {
  if (snapshot === EMPTY) snapshot = JSON.stringify(collectHeadings());
  return snapshot;
}

function getServerSnapshot() {
  return EMPTY;
}

export function useTocHeadings(): TocHeading[] {
  const serialized = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return useMemo(() => JSON.parse(serialized) as TocHeading[], [serialized]);
}

export function useActiveHeading(headings: TocHeading[]): string {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((heading) => document.getElementById(heading.slug))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "0px 0px -75% 0px", threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  return active;
}

export function TocList({
  headings,
  active,
}: {
  headings: TocHeading[];
  active: string;
}) {
  if (headings.length === 0) return null;

  const minDepth = Math.min(...headings.map((heading) => heading.depth));

  return (
    <nav>
      <ul className="menu menu-sm w-full">
        {headings.map((heading) => (
          <li key={heading.slug}>
            <a
              href={`#${heading.slug}`}
              className={
                active === heading.slug ? "active font-medium" : "opacity-70"
              }
              style={{
                paddingInlineStart: `${0.5 + (heading.depth - minDepth) * 0.75}rem`,
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Toc() {
  const headings = useTocHeadings();
  const active = useActiveHeading(headings);

  if (!siteConfig.toc.enable || headings.length === 0) return null;

  return (
    <aside className="fixed top-24 right-4 z-30 hidden max-h-[calc(100vh-8rem)] w-56 overflow-y-auto 2xl:block">
      <p className="mb-1 px-3 text-xs font-semibold tracking-wide uppercase opacity-70">
        {t("contents")}
      </p>
      <TocList headings={headings} active={active} />
    </aside>
  );
}
