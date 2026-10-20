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
  title: "ブログ",
  subtitle: "日々の記録",
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
  ],
};

export const profileConfig: ProfileConfig = {
  avatar: "/avatar.png",
  name: "Your Name",
  bio: "ここに自己紹介を入力してください。",
  links: [],
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
  content: "ここにお知らせを入力できます。",
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
