import { withContentCollections } from "@content-collections/next";
import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

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
    // CSP is intentionally deferred; when added, use hashes or static
    // script files so the static/PPR cache keeps working.
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
