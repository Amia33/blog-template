"use client";

import { useMemo, useState } from "react";

import AlbumCard from "@/components/albums/album-card";
import FilterChip from "@/components/ui/filter-chip";
import { Icon } from "@/components/ui/icon";
import type { AlbumIndexItem } from "@/lib/content";
import { t } from "@/lib/strings";

export default function AlbumSection({ albums }: { albums: AlbumIndexItem[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [shownCount, setShownCount] = useState(12);

  const tags = useMemo(
    () =>
      [...new Set(albums.flatMap((album) => album.tags))].sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase()),
      ),
    [albums],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return albums.filter((album) => {
      const matchesTag = !activeTag || album.tags.includes(activeTag);
      if (!matchesTag) return false;
      if (!normalizedQuery) return true;

      return (
        album.title.toLowerCase().includes(normalizedQuery) ||
        album.description.toLowerCase().includes(normalizedQuery) ||
        album.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [activeTag, albums, query]);

  const visible = filtered.slice(0, shownCount);

  return (
    <div>
      <div className="card mb-4 bg-base-100 p-4">
        <label className="relative block">
          <span className="sr-only">{t("searchAlbums")}</span>
          <Icon
            name="search"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-lg opacity-50"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setShownCount(12);
            }}
            placeholder={t("searchPlaceholder")}
            className="input input-bordered w-full pl-10"
          />
        </label>

        {tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1">
            <FilterChip
              active={activeTag === ""}
              onClick={() => {
                setActiveTag("");
                setShownCount(12);
              }}
            >
              {t("allTags")}
            </FilterChip>
            {tags.map((tag) => (
              <FilterChip
                key={tag}
                active={activeTag === tag}
                onClick={() => {
                  setActiveTag(tag === activeTag ? "" : tag);
                  setShownCount(12);
                }}
              >
                #{tag}
              </FilterChip>
            ))}
          </div>
        ) : null}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {filtered.length} {t("postCount")}
      </p>

      {visible.length === 0 ? (
        <div className="card bg-base-100 p-8 text-center">
          <p className="opacity-70">{t("noResults")}</p>
          {query || activeTag ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveTag("");
                setShownCount(12);
              }}
              className="btn btn-sm mt-3 self-center"
            >
              {t("clearFilters")}
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((album) => (
            <AlbumCard key={album.slug} album={album} />
          ))}
        </div>
      )}

      {shownCount < filtered.length ? (
        <button
          type="button"
          onClick={() => setShownCount((count) => count + 12)}
          className="btn btn-soft mt-4 w-full"
        >
          <Icon name="expand" className="text-lg" />
          {t("loadMore")}
        </button>
      ) : null}
    </div>
  );
}
