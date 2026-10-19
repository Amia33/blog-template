import { navBarConfig } from "@/lib/config";
import { t } from "@/lib/strings";
import { LinkPreset, type NavBarLink } from "@/lib/types/config";

const linkPresets: Record<LinkPreset, NavBarLink> = {
  [LinkPreset.Home]: { name: t("home"), url: "/" },
  [LinkPreset.Archive]: { name: t("archive"), url: "/archive" },
  [LinkPreset.About]: { name: t("about"), url: "/about" },
  [LinkPreset.Moments]: { name: t("moments"), url: "/moments" },
  [LinkPreset.Albums]: { name: t("albums"), url: "/albums" },
  [LinkPreset.Timeline]: { name: t("timeline"), url: "/timeline" },
  [LinkPreset.Categories]: { name: t("categories"), url: "/categories" },
  [LinkPreset.Tags]: { name: t("tags"), url: "/tags" },
};

export function getNavLinks(): NavBarLink[] {
  return navBarConfig.links.map((item) =>
    typeof item === "number" ? linkPresets[item] : item,
  );
}
