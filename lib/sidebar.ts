import type {
  SidebarConfig,
  SidebarPage,
  SidebarWidget,
} from "@/lib/types/config";

export function isWidgetVisibleOnPage(
  widget: SidebarWidget,
  page: SidebarPage,
): boolean {
  return !widget.pages || widget.pages.includes(page);
}

export function getWidgetsFor(
  config: SidebarConfig,
  page: SidebarPage,
  column: "primary" | "secondary",
): SidebarWidget[] {
  return config.components.filter(
    (widget) =>
      widget.enable !== false &&
      (widget.column ?? "primary") === column &&
      isWidgetVisibleOnPage(widget, page),
  );
}

export function hasSecondaryWidgets(
  config: SidebarConfig,
  page: SidebarPage,
): boolean {
  return getWidgetsFor(config, page, "secondary").length > 0;
}

export function isDual(config: SidebarConfig, page: SidebarPage): boolean {
  return (
    config.enable &&
    config.arrangement === "dual" &&
    hasSecondaryWidgets(config, page)
  );
}

export function getGridClass(config: SidebarConfig, page: SidebarPage): string {
  if (!config.enable) return "site-grid";

  const dual = isDual(config, page);
  const side = config.side === "left" ? "left" : "right";

  return dual
    ? `site-grid site-grid-dual-${side}`
    : `site-grid site-grid-single-${side}`;
}

export function getPageWidth(config: SidebarConfig, page: SidebarPage): string {
  return isDual(config, page) ? "var(--page-width-dual)" : "var(--page-width)";
}

export function hasSidebarToc(
  config: SidebarConfig,
  page: SidebarPage,
): boolean {
  return [
    ...getWidgetsFor(config, page, "primary"),
    ...getWidgetsFor(config, page, "secondary"),
  ].some((widget) => widget.type === "toc");
}
