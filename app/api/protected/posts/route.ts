import { readFile } from "node:fs/promises";
import path from "node:path";

import { getPostBySlug } from "@/lib/content";
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const file = searchParams.get("path");

  if (!isProtectedConfigured()) {
    return protectedError(503, "Protected content is unavailable");
  }

  if (!slug || !file || slug.length > 200 || file.length > 500) {
    return protectedError(404, "Not found");
  }

  const post = getPostBySlug(slug);

  if (!post || !post.encrypted) {
    return protectedError(404, "Not found");
  }

  if (!(await hasProtectedSession(`post:${slug}`))) {
    return protectedError(401, "Unauthorized");
  }

  if (file.includes("..") || path.isAbsolute(file)) {
    return protectedError(404, "Not found");
  }

  if (!post.protectedImages.includes(file)) {
    return protectedError(404, "Not found");
  }

  const root = path.join(process.cwd(), "content/posts", post._meta.directory);
  const absolute = path.resolve(root, file);

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
