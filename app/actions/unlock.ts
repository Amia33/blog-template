"use server";

import { checkBotId } from "botid/server";

import { getAlbumBySlug, getPostBySlug } from "@/lib/content";
import { isProtectedConfigured } from "@/lib/protected/env";
import { verifyAlbumPassword } from "@/lib/protected/albums";
import { verifyPostPassword } from "@/lib/protected/posts";
import { setProtectedSession } from "@/lib/protected/session";
import { limitByPolicy, resolveClientIp } from "@/lib/rate-limit";
import { t } from "@/lib/strings";

export type UnlockState = {
  ok: boolean;
  error?: string;
  blocked?: boolean;
};

type BotVerdict = "human" | "bot" | "unavailable";

async function detectBot(): Promise<BotVerdict> {
  if (process.env.VERCEL !== "1") return "human";

  try {
    const { isBot } = await checkBotId();
    return isBot ? "bot" : "human";
  } catch (error) {
    // Fail closed: if BotID cannot classify the request, do not unlock.
    console.error("BotID check failed", error);
    return "unavailable";
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

async function guardUnlock(
  kind: "post" | "album",
  slug: string,
): Promise<UnlockState | null> {
  const ip = await resolveClientIp();

  const perIp = await limitByPolicy("unlockIp", ip);

  if (!perIp.allowed) {
    return { ok: false, error: t("tooManyAttempts") };
  }

  const perSlug = await limitByPolicy("unlockSlug", `${kind}:${slug}`);

  if (!perSlug.allowed) {
    return { ok: false, error: t("tooManyAttempts") };
  }

  const bot = await detectBot();

  if (bot === "bot") {
    return { ok: false, blocked: true };
  }

  if (bot === "unavailable") {
    return { ok: false, error: t("botRejected") };
  }

  return null;
}

export async function unlockPost(
  _previous: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  if (!isProtectedConfigured()) {
    return { ok: false, error: t("protectedUnavailableDescription") };
  }

  const credentials = readCredentials(formData);

  if (!credentials) {
    return { ok: false, error: t("invalidPassword") };
  }

  const guard = await guardUnlock("post", credentials.slug);

  if (guard) return guard;

  const post = getPostBySlug(credentials.slug);

  if (!post || !post.encrypted) {
    return { ok: false, error: t("invalidPassword") };
  }

  if (!(await verifyPostPassword(post, credentials.password))) {
    return { ok: false, error: t("invalidPassword") };
  }

  await setProtectedSession(`post:${credentials.slug}`);

  return { ok: true };
}

export async function unlockAlbum(
  _previous: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  if (!isProtectedConfigured()) {
    return { ok: false, error: t("protectedUnavailableDescription") };
  }

  const credentials = readCredentials(formData);

  if (!credentials) {
    return { ok: false, error: t("invalidPassword") };
  }

  const guard = await guardUnlock("album", credentials.slug);

  if (guard) return guard;

  const album = getAlbumBySlug(credentials.slug);

  if (!album || !album.encrypted) {
    return { ok: false, error: t("invalidPassword") };
  }

  if (!(await verifyAlbumPassword(album, credentials.password))) {
    return { ok: false, error: t("invalidPassword") };
  }

  await setProtectedSession(`album:${credentials.slug}`);

  return { ok: true };
}
