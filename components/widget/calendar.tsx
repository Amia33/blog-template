import CalendarView from "@/components/widget/calendar-view";
import { getCalendarData } from "@/lib/calendar";
import { siteConfig } from "@/lib/config";
import { getStartOfWeek, INTL_LOCALE } from "@/lib/i18n/locales";

export default function Calendar() {
  const data = getCalendarData();

  return (
    <CalendarView
      data={data}
      locale={INTL_LOCALE[siteConfig.locale]}
      startOfWeek={getStartOfWeek(siteConfig.locale)}
    />
  );
}
