/**
 * Parses the loose date keys used by the timeline config:
 *   `2026.08`, `2024-11`, `2025.03 – Present`, `2025.03 - 2025.06`, `至今`.
 * Only the start date is needed for ordering.
 */
export function parseTimelineDateKey(value: string): number {
  const normalized = value
    .replace(/[–—]/g, "-")
    .replace(/至今|present/gi, "present")
    .trim();

  const match = /(\d{4})[./-](\d{1,2})/.exec(normalized);
  if (!match) return 0;

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (!Number.isFinite(year) || !Number.isFinite(month)) return 0;

  return Date.UTC(year, Math.min(11, Math.max(0, month - 1)), 1);
}

export function isPresentDateKey(value: string): boolean {
  return /至今|present/i.test(value.replace(/[–—]/g, "-"));
}
