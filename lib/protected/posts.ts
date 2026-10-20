import "server-only";

import { verify } from "@node-rs/argon2";

import { getPostBySlug, type Post } from "@/lib/content";
import { isAcceptableArgon2id } from "@/lib/protected/argon2";

export async function verifyPostPassword(
  post: Post,
  password: string,
): Promise<boolean> {
  if (!post.encrypted || !isAcceptableArgon2id(post.passwordHash)) {
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
