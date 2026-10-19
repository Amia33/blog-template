import type { IconName } from "@/lib/icons";

export type SiteConfig = {
  title: string;
  subtitle: string;
  lang: string;
  url: string;
  themeColor: {
    hue: number;
    fixed: boolean;
  };
  banner: {
    enable: boolean;
    src: string;
    position: "top" | "center" | "bottom";
    credit: {
      enable: boolean;
      text: string;
      url?: string;
    };
  };
  toc: {
    enable: boolean;
    depth: 1 | 2 | 3;
  };
};

export enum LinkPreset {
  Home = 0,
  Archive = 1,
  About = 2,
  Moments = 3,
  Albums = 4,
  Timeline = 5,
  Categories = 6,
  Tags = 7,
}

export type NavBarLink = {
  name: string;
  url: string;
  external?: boolean;
};

export type NavBarConfig = {
  links: (NavBarLink | LinkPreset)[];
};

export type ProfileConfig = {
  avatar?: string;
  name: string;
  bio?: string;
  links: {
    name: string;
    url: string;
    icon: IconName;
  }[];
};

export type LicenseConfig = {
  enable: boolean;
  name: string;
  url: string;
};

export type PostListConfig = {
  pageSize: number;
  layout: {
    mode: "list" | "grid";
    cover: "left" | "right";
    cardWidth: "compact" | "regular" | "relaxed";
  };
};

export type TexturePreset =
  "none" | "starlight" | "cyber-dots" | "topography" | "geometric" | "sakura";

export type TextureConfig = {
  enable: boolean;
  defaultPreset: TexturePreset;
  defaultOpacity: number;
  allowMotion: boolean;
};

export type SidebarPage =
  | "home"
  | "archive"
  | "about"
  | "post"
  | "categories"
  | "tags"
  | "moments"
  | "albums"
  | "timeline"
  | "notFound";

type SidebarWidgetBase = {
  enable?: boolean;
  column?: "primary" | "secondary";
  sticky?: boolean;
  pages?: SidebarPage[];
};

export type SidebarWidget =
  | (SidebarWidgetBase & { type: "profile" })
  | (SidebarWidgetBase & { type: "categories"; collapseAfter?: number })
  | (SidebarWidgetBase & { type: "tags"; collapseAfter?: number })
  | (SidebarWidgetBase & { type: "announcement" })
  | (SidebarWidgetBase & { type: "stats" })
  | (SidebarWidgetBase & { type: "calendar" })
  | (SidebarWidgetBase & { type: "toc" })
  | (SidebarWidgetBase & { type: "music" });

export type SidebarConfig = {
  enable: boolean;
  arrangement: "single" | "dual";
  side: "left" | "right";
  components: SidebarWidget[];
};

export type AnnouncementConfig = {
  title: string;
  content: string;
  closable: boolean;
  closeDuration: number;
  link?: {
    text: string;
    url: string;
    external?: boolean;
  };
};

export type Track = {
  id: string;
  title: string;
  artist?: string;
  source: string;
  cover?: string;
  duration?: number;
};

export type MusicConfig = {
  enable: boolean;
  tracks: Track[];
  defaultVolume: number;
  defaultMode: "sequence" | "repeat-one" | "shuffle";
};

export type ArticleConfig = {
  lastUpdated: {
    enable: boolean;
    minimumAgeDays: number;
  };
};

export type TimelineCategory = {
  name: string;
  color?: string;
};

export type TimelineLink = {
  text: string;
  url: string;
  external?: boolean;
};

export type TimelineItem = {
  title: string;
  date: string;
  category: string;
  subtitle?: string;
  location?: string;
  description?: string;
  highlights?: string[];
  tags?: string[];
  links?: TimelineLink[];
  icon?: IconName;
  featured?: boolean;
  enable?: boolean;
};

export type TimelineConfig = {
  enable: boolean;
  categories: TimelineCategory[];
  disabledTitles: string[];
  order: "asc" | "desc";
};

export type MomentImage = {
  src: string;
  alt?: string;
};

export type AlbumPhoto = {
  src: string;
  alt?: string;
  title?: string;
  tags?: string[];
};

export type AlbumLayout = "grid" | "masonry" | "columns";
