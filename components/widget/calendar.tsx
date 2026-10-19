import CalendarView from "@/components/widget/calendar-view";
import { getCalendarData } from "@/lib/calendar";
import { siteConfig } from "@/lib/config";

export default function Calendar() {
  const data = getCalendarData();
  const startOfWeek = siteConfig.lang.startsWith("ja") ? 0 : 1;

  return (
    <CalendarView
      data={data}
      locale={siteConfig.lang === "ja" ? "ja-JP" : siteConfig.lang}
      startOfWeek={startOfWeek}
    />
  );
}
