import { MdxAlert } from "@/components/mdx/mdx-alert";
import { MdxAudio } from "@/components/mdx/mdx-audio";
import { MdxBadge } from "@/components/mdx/mdx-badge";
import { MdxCard } from "@/components/mdx/mdx-card";
import { MdxCollapse } from "@/components/mdx/mdx-collapse";
import { MdxEmbed } from "@/components/mdx/mdx-embed";
import { MdxImage } from "@/components/mdx/mdx-image";
import { MdxKbd } from "@/components/mdx/mdx-kbd";
import { MdxLink } from "@/components/mdx/mdx-link";
import { MdxStep, MdxSteps } from "@/components/mdx/mdx-steps";
import { MdxTable } from "@/components/mdx/mdx-table";
import { MdxTabs } from "@/components/mdx/mdx-tabs";
import { MdxVideo } from "@/components/mdx/mdx-video";

// Applied to every MDX document. Note that MDX resolves *all* HTML elements
// through this map, including the ones rehype plugins generate, which is why
// `pre`, `code`, `figure` and `div` are deliberately absent: overriding them
// would wrap Expressive Code's own markup.
export const mdxComponents = {
  a: MdxLink,
  img: MdxImage,
  table: MdxTable,
  iframe: MdxEmbed,
  Embed: MdxEmbed,
  Video: MdxVideo,
  Audio: MdxAudio,
  Card: MdxCard,
  Alert: MdxAlert,
  Collapse: MdxCollapse,
  Tabs: MdxTabs,
  Badge: MdxBadge,
  Kbd: MdxKbd,
  Steps: MdxSteps,
  Step: MdxStep,
};
