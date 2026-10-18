import { navBarConfig } from "@/lib/config";
import { i18n, I18nKey } from "@/lib/i18n";
import { LinkPreset, type NavBarLink } from "@/lib/types/config";

const linkPresets: Record<LinkPreset, NavBarLink> = {
  [LinkPreset.Home]: { name: i18n(I18nKey.home), url: "/" },
  [LinkPreset.Archive]: { name: i18n(I18nKey.archive), url: "/archive" },
  [LinkPreset.About]: { name: i18n(I18nKey.about), url: "/about" },
};

export function getNavLinks(): NavBarLink[] {
  return navBarConfig.links.map((item) =>
    typeof item === "number" ? linkPresets[item] : item,
  );
}
