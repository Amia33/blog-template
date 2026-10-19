import { readFile } from "node:fs/promises";
import path from "node:path";

import { getAlbumBySlug } from "@/lib/albums";
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
  const album = getAlbumBySlug(slug);

  if (!album || !album.encrypted) {
    return new Response("Not found", { status: 404 });
  }

  if (!(await hasProtectedSession(`album:${slug}`))) {
    return new Response("Unauthorized", { status: 401 });
  }

  const requested = photo.join("/");

  if (
    requested === "" ||
    requested.includes("..") ||
    path.isAbsolute(requested)
  ) {
    return new Response("Not found", { status: 404 });
  }

  const allowed = album.protectedPhotos.some(
    (entry) => entry.file === requested,
  );

  if (!allowed) {
    return new Response("Not found", { status: 404 });
  }

  const root = path.join(process.cwd(), "content/albums", slug, "photos");
  const absolute = path.resolve(root, requested);

  if (!absolute.startsWith(root + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const data = await readFile(absolute);
    const contentType =
      CONTENT_TYPES[path.extname(absolute).toLowerCase()] ??
      "application/octet-stream";

    return new Response(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
