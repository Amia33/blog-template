import "server-only";

import { connection } from "next/server";

import AlbumGallery from "@/components/albums/album-gallery";
import Lightbox from "@/components/post/lightbox";
import PasswordGate from "@/components/post/password-gate";
import { getAlbumBySlug } from "@/lib/albums";
import ProtectedUnavailable from "@/components/protected/protected-unavailable";
import {
  getProtectedAlbumPhotos,
  toProtectedPhotoUrl,
} from "@/lib/protected/albums";
import { isProtectedConfigured } from "@/lib/protected/env";
import { hasProtectedSession } from "@/lib/protected/session";

export default async function ProtectedAlbum({
  slug,
  title,
  hint,
}: {
  slug: string;
  title: string;
  hint: string;
}) {
  await connection();

  if (!isProtectedConfigured()) {
    return <ProtectedUnavailable />;
  }

  const unlocked = await hasProtectedSession(`album:${slug}`);

  if (!unlocked) {
    return <PasswordGate kind="album" slug={slug} hint={hint} title={title} />;
  }

  const album = getAlbumBySlug(slug);

  if (!album) return null;

  const cover = album.protectedCover;
  const photos = getProtectedAlbumPhotos(album).map((photo) => ({
    src: toProtectedPhotoUrl(slug, photo.file),
    width: photo.width,
    height: photo.height,
    alt: photo.alt,
    title: photo.title,
    tags: photo.tags,
    file: photo.file,
  }));

  return (
    <Lightbox>
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={toProtectedPhotoUrl(slug, cover.file)}
          width={cover.width}
          height={cover.height}
          alt={cover.alt || title}
          loading="lazy"
          decoding="async"
          className="mb-4 h-auto w-full rounded-box object-cover"
        />
      ) : null}
      <AlbumGallery
        photos={photos}
        layout={album.layout}
        columns={album.columns}
        protected
      />
    </Lightbox>
  );
}
