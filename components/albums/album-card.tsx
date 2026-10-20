"use client";

import Link from "next/link";

import PostCover from "@/components/post/post-cover";
import { Icon } from "@/components/ui/icon";
import type { AlbumIndexItem } from "@/lib/content";
import { t } from "@/lib/strings";
import { formatDateToYYYYMMDD } from "@/lib/utils";

export default function AlbumCard({ album }: { album: AlbumIndexItem }) {
  const href = `/albums/${album.slug}`;
  const date = new Date(album.date);

  return (
    <article className="card card-border overflow-hidden bg-base-100">
      <Link href={href} aria-label={album.title} className="block">
        <div className="relative aspect-[4/3] bg-base-200">
          {album.cover ? (
            <PostCover
              cover={album.cover}
              alt=""
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Icon
                name={album.encrypted ? "lock" : "photoLibrary"}
                className="text-5xl opacity-30"
              />
            </div>
          )}
          {album.encrypted ? (
            <span className="absolute top-2 right-2 badge badge-warning badge-sm gap-1">
              <Icon name="lock" className="text-xs" />
              {t("protected")}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="card-body gap-2 p-4">
        <h2 className="card-title">
          <Link href={href} className="transition-colors hover:text-primary">
            {album.title}
          </Link>
        </h2>
        {album.description ? (
          <p className="line-clamp-2 text-sm opacity-70">{album.description}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs opacity-70">
          <span className="flex items-center gap-1">
            <Icon name="calendar" className="text-sm" />
            {formatDateToYYYYMMDD(date)}
          </span>
          {!album.encrypted ? (
            <span className="flex items-center gap-1">
              <Icon name="photo" className="text-sm" />
              {album.photoCount}{" "}
              {t(album.photoCount === 1 ? "photoCount" : "photosCount")}
            </span>
          ) : null}
        </div>
        {album.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {album.tags.map((tag) => (
              <span key={tag} className="badge badge-ghost badge-sm">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
