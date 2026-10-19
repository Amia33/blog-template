import Announcement from "@/components/widget/announcement";
import Calendar from "@/components/widget/calendar";
import Categories from "@/components/widget/categories";
import MusicPlayer from "@/components/widget/music-player";
import ProfileCard from "@/components/widget/profile-card";
import SidebarToc from "@/components/widget/sidebar-toc";
import SiteStats from "@/components/widget/site-stats";
import Tags from "@/components/widget/tags";
import { musicConfig, sidebarConfig } from "@/lib/config";
import { getWidgetsFor } from "@/lib/sidebar";
import type { SidebarPage, SidebarWidget } from "@/lib/types/config";

function renderWidget(widget: SidebarWidget, index: number) {
  const key = `${widget.type}-${index}`;

  switch (widget.type) {
    case "profile":
      return <ProfileCard key={key} />;
    case "categories":
      return <Categories key={key} collapseAfter={widget.collapseAfter} />;
    case "tags":
      return <Tags key={key} collapseAfter={widget.collapseAfter} />;
    case "announcement":
      return <Announcement key={key} />;
    case "stats":
      return <SiteStats key={key} />;
    case "calendar":
      return <Calendar key={key} />;
    case "toc":
      return <SidebarToc key={key} />;
    case "music":
      return musicConfig.enable && musicConfig.tracks.length > 0 ? (
        <MusicPlayer key={key} />
      ) : null;
  }
}

export default function Sidebar({
  page,
  column,
}: {
  page: SidebarPage;
  column: "primary" | "secondary";
}) {
  const widgets = getWidgetsFor(sidebarConfig, page, column);

  if (widgets.length === 0) return null;

  const top = widgets.filter((widget) => !widget.sticky);
  const sticky = widgets.filter((widget) => widget.sticky);

  return (
    <aside className={`site-${column} flex w-full flex-col gap-4`}>
      {top.map(renderWidget)}
      {sticky.length > 0 ? (
        <div className="flex w-full flex-col gap-4 lg:sticky lg:top-20">
          {sticky.map(renderWidget)}
        </div>
      ) : null}
    </aside>
  );
}
