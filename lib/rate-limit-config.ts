// Kept free of `server-only` and `next/headers` so `next.config.ts` can import
// the build-time guard below.
export function getRateLimitCredentials(): {
  url: string;
  token: string;
} | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  return url && token ? { url, token } : null;
}

export function isRateLimitConfigured(): boolean {
  return getRateLimitCredentials() !== null;
}
