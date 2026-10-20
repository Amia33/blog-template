import "server-only";

import { verify } from "@node-rs/argon2";

import type { Album } from "@/lib/content";
import { isAcceptableArgon2id } from "@/lib/protected/argon2";

export type ProtectedAlbumPhoto = {
  file: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  tags: string[];
};

export async function verifyAlbumPassword(
  album: Album,
  password: string,
): Promise<boolean> {
  if (!album.encrypted || !isAcceptableArgon2id(album.passwordHash)) {
    return false;
  }

  try {
    return await verify(album.passwordHash, password);
  } catch {
    return false;
  }
}

export function getProtectedAlbumPhotos(album: Album): ProtectedAlbumPhoto[] {
  return album.protectedPhotos;
}

export function toProtectedPhotoUrl(slug: string, file: string): string {
  const encodedFile = file
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `/api/protected/albums/${encodeURIComponent(slug)}/${encodedFile}`;
}
