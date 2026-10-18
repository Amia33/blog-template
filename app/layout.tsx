import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";

import { mPlus1, mPlus1Code, notoSansSC } from "@/app/fonts";
import AppShell from "@/components/layout/app-shell";
import JsonLd from "@/components/ui/json-ld";
import { siteConfig } from "@/lib/config";

import "./globals.css";
import "katex/dist/katex.css";

const themeScript = `(function(){try{var m=localStorage.getItem("theme")||"auto";var p=window.matchMedia("(prefers-color-scheme: dark)").matches;var d=m==="dark"||(m==="auto"&&p);var e=document.documentElement;e.dataset.theme=d?"fuwari-dark":"fuwari";e.dataset.themeMode=m;}catch(_){}
try{if(document.fonts&&document.fonts.load){var s="あいうえおアイウエオ漢字ABC123";document.fonts.load('400 1em "M PLUS 1"',s);document.fonts.load('400 1em "M PLUS 1 Code"',s);}}catch(_){}})();`;

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.title} - ${siteConfig.subtitle}`,
    template: `%s - ${siteConfig.title}`,
  },
  description: siteConfig.subtitle,
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  icons: {
    icon: [
      {
        url: "/favicon/favicon-light-32.png",
        sizes: "32x32",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon/favicon-dark-32.png",
        sizes: "32x32",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteConfig.title,
            description: siteConfig.subtitle,
            url: siteConfig.url,
          }}
        />
        <AppShell>{children}</AppShell>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
