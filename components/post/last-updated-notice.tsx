import { Icon } from "@/components/ui/icon";
import { resolveLastUpdatedNoticeState } from "@/lib/dates";
import { t } from "@/lib/strings";
import { formatDateToYYYYMMDD } from "@/lib/utils";

export default function LastUpdatedNotice({
  date,
  minimumAgeDays,
  reference,
}: {
  date: Date;
  minimumAgeDays: number;
  reference: Date;
}) {
  const { visible, days } = resolveLastUpdatedNoticeState(
    date,
    minimumAgeDays,
    reference,
  );

  if (!visible) return null;

  return (
    <aside className="mt-6 flex items-start gap-3 rounded-box bg-base-200 p-4 text-sm">
      <Icon name="history" className="mt-0.5 text-lg text-primary" />
      <div>
        <p className="font-semibold">
          {t("lastUpdated")}: {formatDateToYYYYMMDD(date)}
          <span className="ml-2 font-normal opacity-60">
            ({days} {t("daysAgo")})
          </span>
        </p>
        <p className="mt-1 opacity-70">{t("lastUpdatedNotice")}</p>
      </div>
    </aside>
  );
}
