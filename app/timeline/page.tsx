import DirectionalTransition from "@/components/layout/directional-transition";
import PageShell from "@/components/layout/page-shell";
import TimelineSection from "@/components/timeline/timeline-section";
import PageHeader from "@/components/ui/page-header";
import { timelineConfig } from "@/lib/config";
import { timelineData } from "@/lib/data/timeline";
import { pageAlternates, pageOpenGraph, pageTwitter } from "@/lib/seo";
import { t } from "@/lib/strings";
import { parseTimelineDateKey } from "@/lib/timeline-date";

export const metadata = {
  title: t("timeline"),
  description: t("timelineDescription"),
  alternates: pageAlternates("/timeline"),
  openGraph: pageOpenGraph({
    url: "/timeline",
    title: t("timeline"),
    description: t("timelineDescription"),
  }),
  twitter: pageTwitter({
    title: t("timeline"),
    description: t("timelineDescription"),
  }),
};

export default function TimelinePage() {
  const items = timelineData
    .filter(
      (item) =>
        item.enable !== false &&
        !timelineConfig.disabledTitles.includes(item.title),
    )
    .sort((a, b) => {
      const difference =
        parseTimelineDateKey(a.date) - parseTimelineDateKey(b.date);
      return timelineConfig.order === "asc" ? difference : -difference;
    });

  return (
    <PageShell page="timeline">
      <DirectionalTransition>
        <PageHeader
          title={t("timeline")}
          description={t("timelineDescription")}
          count={`${items.length} ${t("postCount")}`}
        />
        <TimelineSection categories={timelineConfig.categories} items={items} />
      </DirectionalTransition>
    </PageShell>
  );
}
