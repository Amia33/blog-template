import "server-only";

import AlbumGallery from "@/components/albums/album-gallery";
import Lightbox from "@/components/post/lightbox";
import PasswordGate from "@/components/post/password-gate";
import { getAlbumBySlug } from "@/lib/albums";
import {
  getProtectedAlbumPhotos,
  toProtectedPhotoUrl,
} from "@/lib/protected/albums";
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
  const unlocked = await hasProtectedSession(`album:${slug}`);

  if (!unlocked) {
    return <PasswordGate kind="album" slug={slug} hint={hint} title={title} />;
  }

  const album = getAlbumBySlug(slug);

  if (!album) return null;

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
      <AlbumGallery
        photos={photos}
        layout={album.layout}
        columns={album.columns}
        protected
      />
    </Lightbox>
  );
}
