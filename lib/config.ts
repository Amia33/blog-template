import {
  LinkPreset,
  type AnnouncementConfig,
  type ArticleConfig,
  type LicenseConfig,
  type MusicConfig,
  type NavBarConfig,
  type PostListConfig,
  type ProfileConfig,
  type SidebarConfig,
  type SiteConfig,
  type TextureConfig,
  type TimelineConfig,
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
    LinkPreset.Moments,
    LinkPreset.Albums,
    LinkPreset.Timeline,
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

export const postListConfig: PostListConfig = {
  pageSize: 8,
  layout: {
    mode: "list",
    cover: "right",
    cardWidth: "regular",
  },
};

export const textureConfig: TextureConfig = {
  enable: true,
  defaultPreset: "starlight",
  defaultOpacity: 0.12,
  allowMotion: true,
};

export const sidebarConfig: SidebarConfig = {
  enable: true,
  arrangement: "dual",
  side: "left",
  components: [
    { type: "profile", column: "primary" },
    { type: "music", column: "primary" },
    {
      type: "announcement",
      column: "primary",
      pages: ["home"],
    },
    {
      type: "categories",
      column: "primary",
      sticky: true,
      collapseAfter: 5,
    },
    {
      type: "tags",
      column: "primary",
      sticky: true,
      collapseAfter: 20,
    },
    {
      type: "stats",
      column: "secondary",
      pages: ["home", "archive", "categories", "tags"],
    },
    { type: "calendar", column: "secondary" },
    {
      type: "toc",
      column: "secondary",
      sticky: true,
      pages: ["post"],
    },
  ],
};

export const announcementConfig: AnnouncementConfig = {
  title: "お知らせ",
  content: "このサイトは Next.js 16 で動作しています。",
  closable: true,
  closeDuration: 7 * 24 * 60 * 60,
  link: {
    text: "詳しく見る",
    url: "/about",
  },
};

export const musicConfig: MusicConfig = {
  enable: false,
  tracks: [],
  defaultVolume: 0.6,
  defaultMode: "sequence",
};

export const articleConfig: ArticleConfig = {
  lastUpdated: {
    enable: true,
    minimumAgeDays: 90,
  },
};

export const timelineConfig: TimelineConfig = {
  enable: true,
  categories: [
    { name: "Work" },
    { name: "Education" },
    { name: "Projects" },
    { name: "Life" },
  ],
  disabledTitles: [],
  order: "desc",
};
