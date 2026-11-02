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
  title: "Blog",
  subtitle: "Daily notes",
  locale: "en",
  url: "https://446256.xyz",
  ogImage: "/banner.jpg",
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
  bio: "Add your introduction here.",
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
      pages: [
        "home",
        "archive",
        "post",
        "moments",
        "albums",
        "timeline",
        "about",
        "tags",
      ],
    },
    {
      type: "tags",
      column: "primary",
      sticky: true,
      collapseAfter: 20,
      pages: [
        "home",
        "archive",
        "post",
        "moments",
        "albums",
        "timeline",
        "about",
        "categories",
      ],
    },
    {
      type: "stats",
      column: "secondary",
      pages: ["home", "archive", "categories", "tags"],
    },
    {
      type: "calendar",
      column: "secondary",
      pages: ["home", "archive", "post", "categories", "tags"],
    },
    {
      type: "toc",
      column: "secondary",
      sticky: true,
      pages: ["post"],
    },
  ],
};

export const announcementConfig: AnnouncementConfig = {
  title: "Announcement",
  content: "Add an announcement here.",
  closable: true,
  closeDuration: 7 * 24 * 60 * 60,
  link: {
    text: "Learn more",
    url: "/about",
  },
};

export const musicConfig: MusicConfig = {
  enable: true,
  tracks: [
    {
      id: "sample",
      title: "Sample Track",
      artist: "Sample Artist",
      source: "/media/sample.mp3",
      cover: "/media/sample.webp",
    },
  ],
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
