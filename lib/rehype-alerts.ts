import type { DefaultBuildType, IOptions } from "rehype-github-alerts";
import { rehypeGithubAlerts } from "rehype-github-alerts";

export const ALERT_TITLE: Record<string, string> = {
  NOTE: "補足",
  TIP: "ヒント",
  IMPORTANT: "重要",
  WARNING: "注意",
  CAUTION: "警告",
};

export const ALERT_KEYWORDS = Object.keys(ALERT_TITLE);

// Emitted as an `Alert` element rather than a styled `div`, so the MDX
// component map renders it: the daisyUI classes, the icon and the title all
// live in components/mdx/mdx-alert.tsx.
const build: DefaultBuildType = (alert, originalChildren) => ({
  type: "element",
  tagName: "Alert",
  properties: { variant: alert.keyword.toLowerCase() },
  children: originalChildren,
});

export const rehypeAlertOptions: IOptions = {
  supportLegacy: false,
  build,
};

export { rehypeGithubAlerts };
