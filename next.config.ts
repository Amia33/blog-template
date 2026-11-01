import { withContentCollections } from "@content-collections/next";
import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

import { CSP } from "./lib/csp";
import { MEDIA_HOSTNAME } from "./lib/media";
import { isProtectedConfigured } from "./lib/protected/env";
import { isRateLimitConfigured } from "./lib/rate-limit-config";

if (process.env.VERCEL_ENV === "production" && !isProtectedConfigured()) {
  throw new Error(
    "PROTECTED_SESSION_SECRET must be set to at least 32 characters for " +
      "production builds. Generate one with `openssl rand -base64 32`.",
  );
}

if (process.env.VERCEL_ENV === "production" && !isRateLimitConfigured()) {
  throw new Error(
    "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set for " +
      "production builds. Add the Upstash integration in Vercel or set them " +
      "in the project environment variables.",
  );
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    // `webp` is the only default; AVIF is noticeably smaller for photos.
    formats: ["image/avif", "image/webp"],
    // Next 16 restricts quality values to this list, defaulting to [75].
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: MEDIA_HOSTNAME,
        port: "",
        pathname: "/**",
        // The media bucket uses a custom domain with CORS, not presigned URLs,
        // so query strings are not allowed.
        search: "",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/api/protected/**": [
      "./content/albums/**/photos/**/*",
      "./content/posts/**/*",
    ],
  },
  async headers() {
    // Enforced policy. There is no reporting endpoint; CSP violations are not
    // collected by the application.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withContentCollections(withBotId(nextConfig));
