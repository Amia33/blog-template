"use client";

import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import type { TimelineItem } from "@/lib/types/config";

export default function TimelineCard({
  item,
  isLast,
}: {
  item: TimelineItem;
  isLast: boolean;
}) {
  return (
    <div className="relative pl-10">
      {!isLast ? (
        <span className="absolute top-8 bottom-0 left-3 w-px bg-base-300" />
      ) : null}
      <span className="absolute top-1 left-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon name={item.icon ?? "flag"} className="text-base" />
      </span>

      <div
        className={`card bg-base-100 p-4 ${
          item.featured ? "card-border border-primary/40" : ""
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="badge badge-primary badge-sm">{item.category}</span>
          <time className="opacity-70">{item.date}</time>
          {item.featured ? (
            <span className="badge badge-secondary badge-sm">Featured</span>
          ) : null}
        </div>

        <h2 className="mt-2 text-lg font-bold">{item.title}</h2>
        {item.subtitle ? (
          <p className="text-sm opacity-70">{item.subtitle}</p>
        ) : null}

        {item.location ? (
          <p className="mt-1 flex items-center gap-1 text-xs opacity-70">
            <Icon name="location" className="text-sm" />
            {item.location}
          </p>
        ) : null}

        {item.description ? (
          <p className="mt-2 text-sm opacity-80">{item.description}</p>
        ) : null}

        {item.highlights && item.highlights.length > 0 ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm opacity-80">
            {item.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        ) : null}

        {item.tags && item.tags.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <span key={tag} className="badge badge-ghost badge-sm">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        {item.links && item.links.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {item.links.map((link) =>
              link.external ? (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary inline-flex items-center gap-1 text-sm"
                >
                  {link.text}
                  <Icon name="external" className="text-xs" />
                </a>
              ) : (
                <Link
                  key={link.url}
                  href={link.url}
                  className="link link-primary inline-flex items-center gap-1 text-sm"
                >
                  {link.text}
                  <Icon name="arrowForward" className="text-xs" />
                </Link>
              ),
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
