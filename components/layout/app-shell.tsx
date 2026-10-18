import type { ReactNode } from "react";

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import BackToTop from "@/components/ui/back-to-top";
import Sidebar from "@/components/widget/sidebar";
import Toc from "@/components/widget/toc";
import { siteConfig } from "@/lib/config";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto w-full max-w-[var(--page-width)] px-2 md:px-4">
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
          <Sidebar />
          <main className="min-w-0">
            {children}
            <Footer />
          </main>
        </div>
      </div>
      {siteConfig.toc.enable ? <Toc /> : null}
      <BackToTop />
    </div>
  );
}
