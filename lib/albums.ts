import "server-only";

import {
  getAlbumBySlug as getAlbumBySlugFromContent,
  getAlbums as getAlbumsFromContent,
  toAlbumIndexItem,
  type Album,
  type AlbumIndexItem,
} from "@/lib/content";

export { toAlbumIndexItem };
export type { Album, AlbumIndexItem };

export type GalleryPhoto = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  alt: string;
  title: string;
  tags: string[];
};

export function getAlbums(): Album[] {
  return getAlbumsFromContent();
}

export function getAlbumBySlug(slug: string): Album | undefined {
  return getAlbumBySlugFromContent(slug);
}

export function toGalleryPhotos(album: Album): GalleryPhoto[] {
  return album.photos.map((photo) => ({
    src: photo.src,
    width: photo.width,
    height: photo.height,
    blurDataURL: photo.blurDataURL,
    alt: photo.alt,
    title: photo.title,
    tags: photo.tags,
  }));
}
