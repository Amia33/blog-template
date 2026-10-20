import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import AlbumGallery from "@/components/albums/album-gallery";
import ProtectedAlbum from "@/components/albums/protected-album";
import DirectionalTransition from "@/components/layout/directional-transition";
import PageShell from "@/components/layout/page-shell";
import Lightbox from "@/components/post/lightbox";
import PostCover from "@/components/post/post-cover";
import { Icon } from "@/components/ui/icon";
import { getAlbumBySlug, getAlbums, toGalleryPhotos } from "@/lib/albums";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  pageAlternates,
  pageOpenGraph,
  pageTwitter,
} from "@/lib/seo";
import { t } from "@/lib/strings";
import { formatDateToYYYYMMDD } from "@/lib/utils";

function GallerySkeleton() {
  return (
    <div
      className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="skeleton aspect-[4/3] rounded-box" />
      ))}
    </div>
  );
}

export function generateStaticParams() {
  return getAlbums().map((album) => ({ slug: album.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) return {};

  const description = album.encrypted
    ? t("protectedAlbumDescription")
    : album.description;
  const image = album.cover
    ? album.cover.remote
      ? album.cover.src
      : absoluteUrl(album.cover.src)
    : DEFAULT_OG_IMAGE;

  return {
    ...(album.encrypted ? { robots: { index: false, follow: false } } : {}),
    title: album.title,
    description,
    alternates: pageAlternates(`/albums/${album.slug}`),
    openGraph: pageOpenGraph({
      url: `/albums/${album.slug}`,
      title: album.title,
      description,
      image,
    }),
    twitter: pageTwitter({
      title: album.title,
      description,
      image,
    }),
  };
}

function AlbumPageSkeleton() {
  return (
    <article className="card bg-base-100 p-6 md:p-9" aria-hidden="true">
      <div className="skeleton mb-3 h-9 w-2/3" />
      <div className="skeleton mb-3 h-4 w-1/2" />
      <div className="skeleton mb-5 h-4 w-40" />
      <div className="skeleton mb-5 h-64 w-full rounded-box" />
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="skeleton aspect-[4/3] rounded-box" />
        ))}
      </div>
    </article>
  );
}

export default function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <PageShell page="albums">
      <DirectionalTransition>
        <Suspense fallback={<AlbumPageSkeleton />}>
          <AlbumContent params={params} />
        </Suspense>
      </DirectionalTransition>
    </PageShell>
  );
}

async function AlbumContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const album = getAlbumBySlug(slug);

  if (!album) notFound();

  const photoCount = album.photos.length;

  return (
    <article className="card bg-base-100 p-6 md:p-9">
      <h1 className="text-3xl font-bold md:text-4xl">{album.title}</h1>

      {album.description ? (
        <p className="mt-2 opacity-70">{album.description}</p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm opacity-60">
        <span className="flex items-center gap-1">
          <Icon name="calendar" className="text-base" />
          {formatDateToYYYYMMDD(album.date)}
        </span>
        {album.location ? (
          <span className="flex items-center gap-1">
            <Icon name="location" className="text-base" />
            {album.location}
          </span>
        ) : null}
        {!album.encrypted ? (
          <span className="flex items-center gap-1">
            <Icon name="photo" className="text-base" />
            {photoCount} {t(photoCount === 1 ? "photoCount" : "photosCount")}
          </span>
        ) : null}
        {album.encrypted ? (
          <span className="flex items-center gap-1 text-warning">
            <Icon name="lock" className="text-base" />
            {t("protected")}
          </span>
        ) : null}
      </div>

      {album.tags.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {album.tags.map((tag) => (
            <span key={tag} className="badge badge-ghost badge-sm">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      {!album.encrypted && album.cover ? (
        <PostCover
          cover={album.cover}
          alt={album.title}
          sizes="(min-width: 768px) 768px, 100vw"
          priority
          className="mt-5 h-auto w-full rounded-box object-cover"
        />
      ) : null}

      {album.encrypted ? (
        <Suspense fallback={<GallerySkeleton />}>
          <ProtectedAlbum
            slug={album.slug}
            title={album.title}
            hint={album.passwordHint}
          />
        </Suspense>
      ) : (
        <Lightbox>
          <AlbumGallery
            photos={toGalleryPhotos(album)}
            layout={album.layout}
            columns={album.columns}
          />
        </Lightbox>
      )}
    </article>
  );
}
