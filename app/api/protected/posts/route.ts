import { readFile } from "node:fs/promises";
import path from "node:path";

import { getPostBySlug } from "@/lib/content";
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

  if (!slug || !file || slug.length > 200 || file.length > 500) {
    return new Response("Not found", { status: 404 });
  }

  const post = getPostBySlug(slug);

  if (!post || !post.encrypted) {
    return new Response("Not found", { status: 404 });
  }

  if (!(await hasProtectedSession(`post:${slug}`))) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (file.includes("..") || path.isAbsolute(file)) {
    return new Response("Not found", { status: 404 });
  }

  if (!post.protectedImages.includes(file)) {
    return new Response("Not found", { status: 404 });
  }

  const root = path.join(process.cwd(), "content/posts", post._meta.directory);
  const absolute = path.resolve(root, file);

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
