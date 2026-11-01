import WidgetCard from "@/components/widget/widget-card";
import { siteConfig } from "@/lib/config";
import { INTL_LOCALE } from "@/lib/i18n/locales";
import { getSiteStats } from "@/lib/stats";
import { t } from "@/lib/strings";
import { formatDateToYYYYMMDD } from "@/lib/utils";

export default function SiteStats() {
  const stats = getSiteStats();
  const locale = INTL_LOCALE[siteConfig.locale];

  const rows = [
    { label: t("posts"), value: stats.posts.toLocaleString(locale) },
    { label: t("moments"), value: stats.moments.toLocaleString(locale) },
    {
      label: t("categories"),
      value: stats.categories.toLocaleString(locale),
    },
    { label: t("tags"), value: stats.tags.toLocaleString(locale) },
    { label: t("words"), value: stats.words.toLocaleString(locale) },
    { label: t("days"), value: stats.days.toLocaleString(locale) },
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
