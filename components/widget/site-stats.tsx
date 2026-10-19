import WidgetCard from "@/components/widget/widget-card";
import { getSiteStats } from "@/lib/stats";
import { t } from "@/lib/strings";
import { formatDateToYYYYMMDD } from "@/lib/utils";

export default function SiteStats() {
  const stats = getSiteStats();

  const rows = [
    { label: t("posts"), value: stats.posts.toLocaleString("ja-JP") },
    { label: t("moments"), value: stats.moments.toLocaleString("ja-JP") },
    {
      label: t("categories"),
      value: stats.categories.toLocaleString("ja-JP"),
    },
    { label: t("tags"), value: stats.tags.toLocaleString("ja-JP") },
    { label: t("words"), value: stats.words.toLocaleString("ja-JP") },
    { label: t("days"), value: stats.days.toLocaleString("ja-JP") },
    {
      label: t("lastUpdated"),
      value: stats.lastUpdated ? formatDateToYYYYMMDD(stats.lastUpdated) : "-",
    },
  ];

  return (
    <WidgetCard title={t("stats")} icon="stats">
      <ul className="text-sm">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-baseline justify-between gap-2 border-b border-dotted border-base-300 py-1 last:border-0"
          >
            <span className="opacity-70">{row.label}</span>
            <span className="font-medium tabular-nums">{row.value}</span>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
}
