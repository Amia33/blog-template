import { readFile } from "node:fs/promises";
import path from "node:path";

import { getAlbumBySlug } from "@/lib/albums";
import { isProtectedConfigured } from "@/lib/protected/env";
import { protectedError, protectedFile } from "@/lib/protected/http";
import { hasProtectedSession } from "@/lib/protected/session";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ slug: string; photo: string[] }>;
  },
) {
  const { slug, photo } = await params;

  if (!isProtectedConfigured()) {
    return protectedError(503, "Protected content is unavailable");
  }

  const album = getAlbumBySlug(slug);

  if (!album || !album.encrypted) {
    return protectedError(404, "Not found");
  }

  if (!(await hasProtectedSession(`album:${slug}`))) {
    return protectedError(401, "Unauthorized");
  }

  const requested = photo.join("/");

  if (
    requested === "" ||
    requested.includes("..") ||
    path.isAbsolute(requested)
  ) {
    return protectedError(404, "Not found");
  }

  const allowed = album.protectedPhotos.some(
    (entry) => entry.file === requested,
  );

  if (!allowed) {
    return protectedError(404, "Not found");
  }

  const root = path.join(process.cwd(), "content/albums", slug, "photos");
  const absolute = path.resolve(root, requested);

  if (!absolute.startsWith(root + path.sep)) {
    return protectedError(404, "Not found");
  }

  try {
    const data = await readFile(absolute);
    const contentType =
      CONTENT_TYPES[path.extname(absolute).toLowerCase()] ??
      "application/octet-stream";

    return protectedFile(data, contentType);
  } catch {
    return protectedError(404, "Not found");
  }
}
