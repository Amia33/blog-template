"use client";

import { useEffect, useState } from "react";

import type { TocHeading } from "@/lib/toc";

export default function Toc({ headings }: { headings: TocHeading[] }) {
  const [active, setActive] = useState("");

  useEffect(() => {
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

  if (headings.length === 0) return null;

  const minDepth = Math.min(...headings.map((heading) => heading.depth));

  return (
    <aside className="fixed top-24 right-4 z-30 hidden max-h-[calc(100vh-8rem)] w-56 overflow-y-auto 2xl:block">
      <p className="mb-1 px-3 text-xs font-semibold tracking-wide uppercase opacity-50">
        Contents
      </p>
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
    </aside>
  );
}
