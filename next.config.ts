import { withContentCollections } from "@content-collections/next";
import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // `webp` is the only default; AVIF is noticeably smaller for photos.
    formats: ["image/avif", "image/webp"],
    // Next 16 restricts quality values to this list, defaulting to [75].
    qualities: [75, 90],
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
