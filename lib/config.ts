import {
  LinkPreset,
  type LicenseConfig,
  type NavBarConfig,
  type ProfileConfig,
  type SiteConfig,
} from "@/lib/types/config";

export const siteConfig: SiteConfig = {
  title: "Fuwari",
  subtitle: "デモサイト",
  lang: "ja",
  url: "https://446256.xyz",
  themeColor: {
    hue: 250,
    fixed: false,
  },
  banner: {
    enable: true,
    src: "/banner.jpg",
    position: "center",
    credit: {
      enable: true,
      text: "Fuwari",
      url: "https://github.com/saicaca/fuwari",
    },
  },
  toc: {
    enable: true,
    depth: 2,
  },
};

export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
    {
      name: "GitHub",
      url: "https://github.com/saicaca/fuwari",
      external: true,
    },
  ],
};

export const profileConfig: ProfileConfig = {
  avatar: "/avatar.png",
  name: "Lorem Ipsum",
  bio: "Fuwari テーマのデモサイトです。日々の学びを書き留めています。",
  links: [
    {
      name: "Twitter",
      icon: "twitter",
      url: "https://twitter.com",
    },
    {
      name: "Steam",
      icon: "steam",
      url: "https://store.steampowered.com",
    },
    {
      name: "GitHub",
      icon: "github",
      url: "https://github.com/saicaca/fuwari",
    },
  ],
};

export const licenseConfig: LicenseConfig = {
  enable: true,
  name: "CC BY-NC-SA 4.0",
  url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};
