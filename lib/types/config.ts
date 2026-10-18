import type { IconName } from "@/lib/icons";

export type SiteConfig = {
  title: string;
  subtitle: string;
  lang: string;
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
