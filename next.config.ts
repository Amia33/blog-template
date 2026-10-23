import { withContentCollections } from "@content-collections/next";
import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

import { CSP_REPORT_ONLY } from "./lib/csp";
import { isProtectedConfigured } from "./lib/protected/env";

if (process.env.VERCEL_ENV === "production" && !isProtectedConfigured()) {
  throw new Error(
    "PROTECTED_SESSION_SECRET must be set to at least 32 characters for " +
      "production builds. Generate one with `openssl rand -base64 32`.",
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
  },
  outputFileTracingIncludes: {
    "/api/protected/**": [
      "./content/albums/**/photos/**/*",
      "./content/posts/**/*",
    ],
  },
  async headers() {
    // Report-only for now: violations are logged by /api/csp-report but
    // nothing is blocked. Once the reports are clean, rename the header below
    // to "Content-Security-Policy" to enforce it.
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
          {
            key: "Content-Security-Policy-Report-Only",
            value: CSP_REPORT_ONLY,
          },
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
