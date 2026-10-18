import { navBarConfig } from "@/lib/config";
import { t } from "@/lib/strings";
import { LinkPreset, type NavBarLink } from "@/lib/types/config";

const linkPresets: Record<LinkPreset, NavBarLink> = {
  [LinkPreset.Home]: { name: t("home"), url: "/" },
  [LinkPreset.Archive]: { name: t("archive"), url: "/archive" },
  [LinkPreset.About]: { name: t("about"), url: "/about" },
};

export function getNavLinks(): NavBarLink[] {
  return navBarConfig.links.map((item) =>
    typeof item === "number" ? linkPresets[item] : item,
  );
}
