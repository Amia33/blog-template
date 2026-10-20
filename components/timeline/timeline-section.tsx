"use client";

import { useMemo, useState } from "react";

import TimelineCard from "@/components/timeline/timeline-card";
import FilterChip from "@/components/ui/filter-chip";
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
          <FilterChip
            active={activeCategory === ""}
            onClick={() => setActiveCategory("")}
          >
            {t("allTags")} ({items.length})
          </FilterChip>
          {categories.map((category) => (
            <FilterChip
              key={category.name}
              active={activeCategory === category.name}
              onClick={() =>
                setActiveCategory(
                  category.name === activeCategory ? "" : category.name,
                )
              }
            >
              {category.name} ({counts[category.name] ?? 0})
            </FilterChip>
          ))}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {filtered.length} {t("postCount")}
      </p>

      {filtered.length === 0 ? (
        <div className="card bg-base-100 p-8 text-center">
          <p className="opacity-70">{t("noTimeline")}</p>
          {activeCategory ? (
            <button
              type="button"
              onClick={() => setActiveCategory("")}
              className="btn btn-sm mt-3 self-center"
            >
              {t("clearFilters")}
            </button>
          ) : null}
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
