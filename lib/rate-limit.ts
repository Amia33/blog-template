import "server-only";

import { createHash } from "node:crypto";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

import { getRateLimitCredentials } from "@/lib/rate-limit-config";

type RateLimitPolicy = "unlockIp" | "unlockSlug" | "protectedMedia";

const POLICIES = {
  unlockIp: { tokens: 10, window: "10 m" },
  unlockSlug: { tokens: 20, window: "10 m" },
  protectedMedia: { tokens: 300, window: "1 m" },
} as const;

type Limiters = Record<RateLimitPolicy, Ratelimit>;

let limiters: Limiters | null | undefined;

function getLimiters(): Limiters | null {
  if (limiters !== undefined) return limiters;

  const credentials = getRateLimitCredentials();

  if (!credentials) {
    console.warn(
      "[rate-limit] Upstash credentials are not set; rate limiting is disabled.",
    );
    limiters = null;
    return limiters;
  }

  const redis = new Redis(credentials);

  limiters = Object.fromEntries(
    (
      Object.entries(POLICIES) as [
        RateLimitPolicy,
        (typeof POLICIES)[RateLimitPolicy],
      ][]
    ).map(([policy, { tokens, window }]) => [
      policy,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(tokens, window),
        prefix: `blog:rl:${policy}`,
        analytics: false,
        // Upstash allows the request if Redis does not answer in time. The
        // Vercel WAF rule is the hard backstop, so an outage must not lock
        // every reader out.
        timeout: 1000,
        ephemeralCache: new Map(),
      }),
    ]),
  ) as Limiters;

  return limiters;
}

function hashIdentifier(identifier: string): string {
  return createHash("sha256").update(identifier).digest("hex").slice(0, 32);
}

export type RateLimitOutcome =
  { allowed: true } | { allowed: false; retryAfter: number };

export async function limitByPolicy(
  policy: RateLimitPolicy,
  identifier: string,
): Promise<RateLimitOutcome> {
  const limiter = getLimiters()?.[policy];

  if (!limiter) return { allowed: true };

  try {
    const { success, reset } = await limiter.limit(hashIdentifier(identifier));

    if (success) return { allowed: true };

    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
    };
  } catch (error) {
    console.error("[rate-limit] check failed", error);
    return { allowed: true };
  }
}

export function clientIpFromHeaders(requestHeaders: Headers): string {
  const forwarded = requestHeaders.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();

  if (first) return first;

  return (
    requestHeaders.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown"
  );
}

export async function resolveClientIp(request?: Request): Promise<string> {
  if (request) return clientIpFromHeaders(request.headers);

  return clientIpFromHeaders(await headers());
}
