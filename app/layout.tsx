import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";

import { mPlus1, mPlus1Code, notoSansSC } from "@/app/fonts";
import AppShell from "@/components/layout/app-shell";
import JsonLd from "@/components/ui/json-ld";
import { profileConfig, siteConfig } from "@/lib/config";
import { getExpressiveCodeJsModules } from "@/lib/expressive-code";
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  pageAlternates,
  pageOpenGraph,
  pageTwitter,
} from "@/lib/seo";
import { websiteJsonLd } from "@/lib/structured-data";

import "./globals.css";
import "katex/dist/katex.css";

const themeScript = `(function(){try{var m=localStorage.getItem("theme")||"auto";var p=window.matchMedia("(prefers-color-scheme: dark)").matches;var d=m==="dark"||(m==="auto"&&p);var e=document.documentElement;e.dataset.theme=d?"fuwari-dark":"fuwari";e.dataset.themeMode=m;}catch(_){}
try{if(document.fonts&&document.fonts.load){var s="あいうえおアイウエオ漢字ABC123";document.fonts.load('400 1em "M PLUS 1"',s);document.fonts.load('400 1em "M PLUS 1 Code"',s);}}catch(_){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: SITE_TITLE,
    template: `%s - ${siteConfig.title}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: profileConfig.name }],
  alternates: pageAlternates("/"),
  openGraph: pageOpenGraph({ url: "/" }),
  twitter: pageTwitter(),
  // No `icons` key on purpose: setting it makes Next skip the file-based icon
  // metadata (resolve-metadata.js:418). `app/icon.svg` carries its own
  // light/dark variants, with `app/favicon.ico` and `app/apple-icon.png` as
  // fallbacks, and `app/manifest.ts` covers install icons.
};

// Mirrors the `--color-base-100` tokens in app/globals.css.
export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(100% 0 0deg)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(23% 0.015 250deg)" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const expressiveCodeModules = await getExpressiveCodeJsModules();

  return (
    <html
      lang={siteConfig.lang.replace("_", "-")}
      className={`${mPlus1.variable} ${mPlus1Code.variable} ${notoSansSC.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-base-100 text-base-content antialiased">
        <JsonLd data={websiteJsonLd()} />
        <AppShell>{children}</AppShell>
        {expressiveCodeModules.map((module, index) => (
          <script
            key={`expressive-code-${index}`}
            type="module"
            dangerouslySetInnerHTML={{ __html: module }}
          />
        ))}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
