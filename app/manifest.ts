import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.title,
    description: siteConfig.subtitle,
    lang: siteConfig.lang,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6d86f0",
    icons: [
      {
        src: "/favicon/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/favicon/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/favicon/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
