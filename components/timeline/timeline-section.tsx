"use client";

import { useMemo, useState } from "react";

import TimelineCard from "@/components/timeline/timeline-card";
import { t } from "@/lib/strings";
import type { TimelineCategory, TimelineItem } from "@/lib/types/config";

export default function TimelineSection({
  categories,
  items,
}: {
  categories: TimelineCategory[];
  items: TimelineItem[];
}) {
  const [activeCategory, setActiveCategory] = useState("");

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const item of items) {
      result[item.category] = (result[item.category] ?? 0) + 1;
    }
    return result;
  }, [items]);

  const filtered = activeCategory
    ? items.filter((item) => item.category === activeCategory)
    : items;

  return (
    <div>
      <div className="card mb-4 bg-base-100 p-4">
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveCategory("")}
            className={`badge badge-sm ${activeCategory === "" ? "badge-primary" : "badge-ghost"}`}
          >
            {t("allTags")} ({items.length})
          </button>
          {categories.map((category) => (
            <button
              key={category.name}
              type="button"
              onClick={() =>
                setActiveCategory(
                  category.name === activeCategory ? "" : category.name,
                )
              }
              className={`badge badge-sm ${
                activeCategory === category.name
                  ? "badge-primary"
                  : "badge-ghost"
              }`}
            >
              {category.name} ({counts[category.name] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card bg-base-100 p-8 text-center opacity-70">
          {t("noTimeline")}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((item, index) => (
            <TimelineCard
              key={`${item.title}-${item.date}`}
              item={item}
              isLast={index === filtered.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
