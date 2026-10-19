"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

import MomentCard, { type MomentItem } from "@/components/moments/moment-card";
import Lightbox from "@/components/post/lightbox";
import { Icon } from "@/components/ui/icon";
import { t } from "@/lib/strings";

const LOCATION_EVENT = "moments:location";

function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener(LOCATION_EVENT, listener);

  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(LOCATION_EVENT, listener);
  };
}

function getSearch(): string {
  if (typeof window === "undefined") return "";
  return window.location.search;
}

function getServerSearch(): string {
  return "";
}

function emitLocation() {
  window.dispatchEvent(new Event(LOCATION_EVENT));
}

function updateUrl(query: string, tag: string) {
  const params = new URLSearchParams(window.location.search);

  if (query) params.set("q", query);
  else params.delete("q");

  if (tag) params.set("tag", tag);
  else params.delete("tag");

  const search = params.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${search ? `?${search}` : ""}`,
  );
  emitLocation();
}

export default function MomentSection({
  moments,
  author,
}: {
  moments: MomentItem[];
  author: { name: string; avatar?: string };
}) {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch);
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const query = params.get("q") ?? "";
  const activeTag = params.get("tag") ?? "";
  const [shownCount, setShownCount] = useState(10);

  const tags = useMemo(
    () =>
      [...new Set(moments.flatMap((moment) => moment.tags))].sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase()),
      ),
    [moments],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return moments.filter((moment) => {
      const matchesTag = !activeTag || moment.tags.includes(activeTag);
      if (!matchesTag) return false;
      if (!normalizedQuery) return true;

      const text = moment.html.replace(/<[^>]+>/g, " ").toLowerCase();
      return (
        text.includes(normalizedQuery) ||
        moment.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [activeTag, moments, query]);

  const visible = filtered.slice(0, shownCount);

  const setQuery = (value: string) => {
    updateUrl(value, activeTag);
    setShownCount(10);
  };

  const setActiveTag = (value: string) => {
    updateUrl(query, value);
    setShownCount(10);
  };

  return (
    <div>
      <div className="card mb-4 bg-base-100 p-4">
        <label className="relative block">
          <span className="sr-only">{t("searchMoments")}</span>
          <Icon
            name="search"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-lg opacity-50"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="input input-bordered w-full pl-10"
          />
        </label>

        {tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setActiveTag("")}
              className={`badge badge-sm ${activeTag === "" ? "badge-primary" : "badge-ghost"}`}
            >
              {t("allTags")}
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag === activeTag ? "" : tag)}
                className={`badge badge-sm ${activeTag === tag ? "badge-primary" : "badge-ghost"}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <div className="card bg-base-100 p-8 text-center opacity-70">
          {t("noResults")}
        </div>
      ) : (
        <Lightbox key={`${activeTag}-${query}-${shownCount}`}>
          <div className="flex flex-col gap-3">
            {visible.map((moment) => (
              <MomentCard
                key={moment.slug}
                moment={moment}
                author={author}
                onTagClick={(tag) => setActiveTag(tag === activeTag ? "" : tag)}
              />
            ))}
          </div>
        </Lightbox>
      )}

      {shownCount < filtered.length ? (
        <button
          type="button"
          onClick={() => setShownCount((count) => count + 10)}
          className="btn btn-soft mt-4 w-full"
        >
          <Icon name="expand" className="text-lg" />
          {t("loadMore")}
        </button>
      ) : null}
    </div>
  );
}
