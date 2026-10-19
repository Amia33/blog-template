import "server-only";

import { verify } from "@node-rs/argon2";

import { getPostBySlug, type Post } from "@/lib/content";

export async function verifyPostPassword(
  post: Post,
  password: string,
): Promise<boolean> {
  if (!post.encrypted || !post.passwordHash.startsWith("$argon2id$")) {
    return false;
  }

  try {
    return await verify(post.passwordHash, password);
  } catch {
    return false;
  }
}

export function getProtectedPostForRender(slug: string): Post | undefined {
  const post = getPostBySlug(slug);

  if (!post || !post.encrypted) return undefined;

  return post;
}
