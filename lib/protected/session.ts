import "server-only";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export type ProtectedSession = {
  v: 1;
  scopes: Record<string, number>;
};

const TTL_SECONDS = 30 * 60;
const TTL_MS = TTL_SECONDS * 1000;

function getSessionOptions() {
  const password = process.env.PROTECTED_SESSION_SECRET;

  if (!password || password.length < 32) {
    throw new Error(
      "PROTECTED_SESSION_SECRET must be set to at least 32 characters. " +
        "Generate one with `openssl rand -base64 32`.",
    );
  }

  return {
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Host-protected_session"
        : "protected_session",
    password,
    ttl: TTL_SECONDS,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

async function getSession() {
  return getIronSession<ProtectedSession>(await cookies(), getSessionOptions());
}

export async function setProtectedSession(scope: string): Promise<void> {
  const session = await getSession();
  session.v = 1;
  session.scopes = {
    ...(session.scopes ?? {}),
    [scope]: Date.now() + TTL_MS,
  };
  await session.save();
}

export async function hasProtectedSession(scope: string): Promise<boolean> {
  const session = await getSession();
  if (session.v !== 1) return false;
  return (session.scopes?.[scope] ?? 0) > Date.now();
}

export async function clearProtectedSession(scope: string): Promise<void> {
  const session = await getSession();

  if (session.scopes?.[scope]) {
    delete session.scopes[scope];
    await session.save();
  }
}
