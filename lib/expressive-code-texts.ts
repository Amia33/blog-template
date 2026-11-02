import { pluginCollapsibleSectionsTexts } from "@expressive-code/plugin-collapsible-sections";
import {
  type ExpressiveCodePlugin,
  pluginFramesTexts,
} from "rehype-expressive-code";

import type { Locale } from "@/lib/i18n/locales";

// Expressive Code ships `en` and `de` only, and there is no localization package
// on npm. Both text collections are exported module singletons, so registering a
// locale here is all that is needed - no `node_modules` patch and no dependency
// on `@expressive-code/core` (which is only installed transitively).
//
// `addLocale` requires the complete key set for the locale; partial tweaks would
// use `overrideTexts` instead. English uses the built-in defaults.
export function pluginLocalizedTexts(locale: Locale): ExpressiveCodePlugin {
  if (locale === "ja") {
    pluginFramesTexts.addLocale("ja", {
      terminalWindowFallbackTitle: "ターミナル",
      copyButtonTooltip: "クリップボードにコピー",
      copyButtonCopied: "コピーしました!",
    });

    pluginCollapsibleSectionsTexts.addLocale("ja", {
      // No plural branch: the template must keep exactly one catch-all placeholder.
      collapsedLines: "残り {lineCount} 行",
    });
  } else if (locale === "zh") {
    pluginFramesTexts.addLocale("zh", {
      terminalWindowFallbackTitle: "终端",
      copyButtonTooltip: "复制到剪贴板",
      copyButtonCopied: "已复制!",
    });

    pluginCollapsibleSectionsTexts.addLocale("zh", {
      collapsedLines: "剩余 {lineCount} 行",
    });
  }

  return { name: `Localized UI texts (${locale})` };
}
