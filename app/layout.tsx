import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";

import { notoMono, notoSans } from "@/app/fonts";
import { siteConfig } from "@/lib/config";

import "./globals.css";

const themeScript = `(function(){try{var m=localStorage.getItem("theme")||"auto";var p=window.matchMedia("(prefers-color-scheme: dark)").matches;var d=m==="dark"||(m==="auto"&&p);var e=document.documentElement;e.dataset.theme=d?"fuwari-dark":"fuwari";e.dataset.themeMode=m;}catch(_){}})();`;

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.title} - ${siteConfig.subtitle}`,
    template: `%s - ${siteConfig.title}`,
  },
  description: siteConfig.subtitle,
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
      className={`${notoSans.variable} ${notoMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-base-100 text-base-content antialiased">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
