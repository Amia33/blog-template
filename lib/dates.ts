const DAY_MS = 24 * 60 * 60 * 1000;

export function differenceInUtcCalendarDays(
  date: Date,
  reference: Date = new Date(),
): number {
  const from = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  const to = Date.UTC(
    reference.getUTCFullYear(),
    reference.getUTCMonth(),
    reference.getUTCDate(),
  );

  return Math.round((to - from) / DAY_MS);
}

export function resolveLastUpdatedNoticeState(
  date: Date,
  minimumAgeDays: number,
  reference: Date = new Date(),
): { visible: boolean; days: number } {
  const days = differenceInUtcCalendarDays(date, reference);
  return { visible: days >= minimumAgeDays, days };
}
