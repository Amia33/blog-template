import type { ReactNode } from "react";

import Footer from "@/components/layout/footer";
import BackToTop from "@/components/ui/back-to-top";
import Sidebar from "@/components/widget/sidebar";
import Toc from "@/components/widget/toc";
import { sidebarConfig, siteConfig } from "@/lib/config";
import {
  getGridClass,
  getPageWidth,
  hasSidebarToc,
  isDual,
} from "@/lib/sidebar";
import type { SidebarPage } from "@/lib/types/config";

export default function PageShell({
  page,
  children,
}: {
  page: SidebarPage;
  children: ReactNode;
}) {
  const showSidebar = sidebarConfig.enable;
  const dual = isDual(sidebarConfig, page);
  const sidebarToc = hasSidebarToc(sidebarConfig, page);

  return (
    <div>
      <div
        className="mx-auto w-full px-2 md:px-4"
        style={{ maxWidth: getPageWidth(sidebarConfig, page) }}
      >
        <div
          className={`mt-4 lg:min-h-[calc(100vh-6rem)] ${showSidebar ? getGridClass(sidebarConfig, page) : "site-grid"}`}
        >
          {showSidebar ? <Sidebar page={page} column="primary" /> : null}

          <main className="site-main flex min-w-0 flex-col">
            {children}
            <div className="mt-auto hidden lg:block">
              <Footer />
            </div>
          </main>

          {dual ? <Sidebar page={page} column="secondary" /> : null}
        </div>

        <div className="lg:hidden">
          <Footer />
        </div>
      </div>

      {siteConfig.toc.enable && !sidebarToc ? <Toc /> : null}
      <BackToTop />
    </div>
  );
}
