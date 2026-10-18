import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import {
  createRenderer,
  type RehypeExpressiveCodeOptions,
  type RehypeExpressiveCodeRenderer,
} from "rehype-expressive-code";

const baseOptions: RehypeExpressiveCodeOptions = {
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

let rendererPromise: Promise<RehypeExpressiveCodeRenderer> | undefined;

function getRenderer(): Promise<RehypeExpressiveCodeRenderer> {
  rendererPromise ??= createRenderer(baseOptions);
  return rendererPromise;
}

// Expressive Code inlines its JS modules into every MDX document, but a script
// that arrives through a client-side navigation is inserted via the DOM and
// never executes, which left the copy button dead on every navigated page.
// Dropping them here and loading them once from the root layout instead keeps a
// single long-lived MutationObserver that also picks up code blocks rendered by
// later navigations.
export const expressiveCodeOptions: RehypeExpressiveCodeOptions = {
  ...baseOptions,
  customCreateRenderer: async () => {
    const renderer = await getRenderer();
    return { ...renderer, jsModules: [] };
  },
};

export async function getExpressiveCodeJsModules(): Promise<string[]> {
  const renderer = await getRenderer();
  return renderer.jsModules;
}
