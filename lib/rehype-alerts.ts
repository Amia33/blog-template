import type { Element, ElementContent } from "hast";
import {
  rehypeGithubAlerts,
  type DefaultBuildType,
  type IOptions,
} from "rehype-github-alerts";

export const ALERT_TITLE: Record<string, string> = {
  NOTE: "補足",
  TIP: "ヒント",
  IMPORTANT: "重要",
  WARNING: "注意",
  CAUTION: "警告",
};

// Kept as complete string literals so Tailwind's scanner can discover the
// daisyUI class names. These classes are only ever produced for markdown
// content, which lives in gitignored build output, so a computed
// `alert-${variant}` would never be generated.
const ALERT_CLASS: Record<string, string> = {
  NOTE: "alert alert-info alert-vertical items-start my-4",
  TIP: "alert alert-success alert-vertical items-start my-4",
  IMPORTANT: "alert alert-primary alert-vertical items-start my-4",
  WARNING: "alert alert-warning alert-vertical items-start my-4",
  CAUTION: "alert alert-error alert-vertical items-start my-4",
};

export const ALERT_KEYWORDS = Object.keys(ALERT_CLASS);

export function alertClassNames(keyword: string): string[] {
  const classes = ALERT_CLASS[keyword.toUpperCase()] ?? ALERT_CLASS.NOTE;
  return classes.split(" ");
}

function alertElement(
  keyword: string,
  title: string,
  body: ElementContent[],
): Element {
  return {
    type: "element",
    tagName: "div",
    properties: { className: alertClassNames(keyword) },
    children: [
      {
        type: "element",
        tagName: "span",
        properties: { className: ["font-bold"] },
        children: [{ type: "text", value: title }],
      },
      ...body,
    ],
  };
}

const build: DefaultBuildType = (alert, originalChildren) => {
  const keyword = alert.keyword.toUpperCase();
  return alertElement(keyword, ALERT_TITLE[keyword] ?? alert.title, [
    ...originalChildren,
  ]);
};

export const rehypeAlertOptions: IOptions = {
  supportLegacy: false,
  build,
};

export { rehypeGithubAlerts };
