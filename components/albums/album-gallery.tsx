"use client";

import Image from "next/image";

import type { AlbumLayout } from "@/lib/types/config";

export type AlbumGalleryPhoto = {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
  alt: string;
  title: string;
  tags: string[];
  file?: string;
};

export default function AlbumGallery({
  photos,
  layout,
  columns,
  protected: isProtected = false,
}: {
  photos: AlbumGalleryPhoto[];
  layout: AlbumLayout;
  columns: number;
  protected?: boolean;
}) {
  if (photos.length === 0) {
    return (
      <div className="card bg-base-100 p-8 text-center opacity-70">
        写真がありません。
      </div>
    );
  }

  const isGrid = layout === "grid";

  return (
    <article
      className={isGrid ? "mt-4 grid gap-3" : "mt-4 columns-1 gap-3 [&>*]:mb-3"}
      style={
        isGrid
          ? {
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }
          : { columnCount: columns }
      }
    >
      {photos.map((photo, index) => (
        <figure
          key={`${photo.src}-${index}`}
          className={`overflow-hidden rounded-box bg-base-200 ${
            isGrid ? "" : "break-inside-avoid"
          }`}
        >
          {isProtected || photo.width === 0 || photo.height === 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo.src}
              alt={photo.alt || photo.title}
              width={photo.width || undefined}
              height={photo.height || undefined}
              loading="lazy"
              className={`w-full object-cover ${
                isGrid ? "aspect-[4/3]" : "h-auto"
              }`}
            />
          ) : (
            <Image
              src={photo.src}
              alt={photo.alt || photo.title}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              placeholder={photo.blurDataURL ? "blur" : "empty"}
              blurDataURL={photo.blurDataURL || undefined}
              className={`w-full object-cover ${
                isGrid ? "aspect-[4/3]" : "h-auto"
              }`}
            />
          )}
          {photo.title ? (
            <figcaption className="px-3 py-2 text-xs opacity-60">
              {photo.title}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </article>
  );
}
