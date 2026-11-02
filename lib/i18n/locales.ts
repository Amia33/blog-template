export const LOCALES = ["en", "ja", "zh"] as const;

export type Locale = (typeof LOCALES)[number];

export const INTL_LOCALE: Record<Locale, string> = {
  en: "en-US",
  ja: "ja-JP",
  zh: "zh-CN",
};

// Open Graph expects a language_TERRITORY value rather than a bare BCP-47 tag.
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
};

// Japan starts the week on Sunday; en-US and zh-CN start on Monday.
export function getStartOfWeek(locale: Locale): 0 | 1 {
  return locale === "ja" ? 0 : 1;
}
