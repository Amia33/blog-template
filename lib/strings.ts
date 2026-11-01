import { siteConfig } from "@/lib/config";
import { en, type UIKey } from "@/lib/i18n/en";
import { ja } from "@/lib/i18n/ja";
import type { Locale } from "@/lib/i18n/locales";
import { zh } from "@/lib/i18n/zh";

const dictionaries: Record<Locale, Record<UIKey, string>> = { en, ja, zh };

export type { UIKey };

export const UI = dictionaries[siteConfig.locale];

export function t(
  key: UIKey,
  params?: Record<string, string | number>,
): string {
  const template = UI[key];

  if (!params) return template;

  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in params ? String(params[name]) : match,
  );
}
