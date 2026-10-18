import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import type { RehypeExpressiveCodeOptions } from "rehype-expressive-code";

export const expressiveCodeOptions: RehypeExpressiveCodeOptions = {
  themes: ["github-light", "github-dark"],
  themeCssSelector: (theme) =>
    `[data-theme="${theme.type === "dark" ? "fuwari-dark" : "fuwari"}"]`,
  useDarkModeMediaQuery: false,
  plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
  defaultProps: {
    wrap: true,
  },
  frames: {
    showCopyToClipboardButton: true,
  },
  styleOverrides: {
    codeFontFamily: "var(--font-mplus-code)",
    codeFontSize: "0.875rem",
    borderRadius: "0.75rem",
    codeBackground: "var(--color-base-200)",
  },
};
