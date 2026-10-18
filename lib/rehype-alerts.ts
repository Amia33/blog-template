import type { Element, ElementContent } from "hast";
import {
  rehypeGithubAlerts,
  type DefaultBuildType,
  type IOptions,
} from "rehype-github-alerts";

export const ALERT_VARIANT: Record<string, string> = {
  NOTE: "info",
  TIP: "success",
  IMPORTANT: "primary",
  WARNING: "warning",
  CAUTION: "error",
};

export const ALERT_TITLE: Record<string, string> = {
  NOTE: "補足",
  TIP: "ヒント",
  IMPORTANT: "重要",
  WARNING: "注意",
  CAUTION: "警告",
};

export function alertClassNames(keyword: string): string[] {
  const variant = ALERT_VARIANT[keyword.toUpperCase()] ?? "info";
  return ["alert", `alert-${variant}`, "alert-vertical", "items-start", "my-4"];
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
