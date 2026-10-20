"use server";

import { checkBotId } from "botid/server";
import { headers } from "next/headers";

import { getAlbumBySlug, getPostBySlug } from "@/lib/content";
import { verifyAlbumPassword } from "@/lib/protected/albums";
import { verifyPostPassword } from "@/lib/protected/posts";
import { checkRateLimit, clearRateLimit } from "@/lib/protected/rate-limit";
import { setProtectedSession } from "@/lib/protected/session";
import { t } from "@/lib/strings";

export type UnlockState = {
  ok: boolean;
  error?: string;
};

async function getClientKey(scope: string): Promise<string> {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";

  return `${ip}:${scope}`;
}

async function isBotRequest(): Promise<boolean> {
  if (process.env.VERCEL !== "1") return false;

  try {
    const { isBot } = await checkBotId();
    return isBot;
  } catch (error) {
    console.error("BotID check failed", error);
    return false;
  }
}

function readCredentials(
  formData: FormData,
): { slug: string; password: string } | null {
  const slug = formData.get("slug");
  const password = formData.get("password");

  if (typeof slug !== "string" || typeof password !== "string") {
    return null;
  }

  const trimmedSlug = slug.trim();

  if (
    trimmedSlug === "" ||
    trimmedSlug.length > 200 ||
    password.length === 0 ||
    password.length > 200
  ) {
    return null;
  }

  return { slug: trimmedSlug, password };
}

export async function unlockPost(
  _previous: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const credentials = readCredentials(formData);

  if (!credentials) {
    return { ok: false, error: t("invalidPassword") };
  }

  const key = await getClientKey(`post:${credentials.slug}`);
  const rateLimit = checkRateLimit(key);

  if (!rateLimit.allowed) {
    return { ok: false, error: t("tooManyAttempts") };
  }

  if (await isBotRequest()) {
    return { ok: false, error: t("tooManyAttempts") };
  }

  const post = getPostBySlug(credentials.slug);

  if (!post || !post.encrypted) {
    return { ok: false, error: t("invalidPassword") };
  }

  if (!(await verifyPostPassword(post, credentials.password))) {
    return { ok: false, error: t("invalidPassword") };
  }

  await setProtectedSession(`post:${credentials.slug}`);
  clearRateLimit(key);

  return { ok: true };
}

export async function unlockAlbum(
  _previous: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const credentials = readCredentials(formData);

  if (!credentials) {
    return { ok: false, error: t("invalidPassword") };
  }

  const key = await getClientKey(`album:${credentials.slug}`);
  const rateLimit = checkRateLimit(key);

  if (!rateLimit.allowed) {
    return { ok: false, error: t("tooManyAttempts") };
  }

  if (await isBotRequest()) {
    return { ok: false, error: t("tooManyAttempts") };
  }

  const album = getAlbumBySlug(credentials.slug);

  if (!album || !album.encrypted) {
    return { ok: false, error: t("invalidPassword") };
  }

  if (!(await verifyAlbumPassword(album, credentials.password))) {
    return { ok: false, error: t("invalidPassword") };
  }

  await setProtectedSession(`album:${credentials.slug}`);
  clearRateLimit(key);

  return { ok: true };
}
