"use client";

import {
  TocList,
  useActiveHeading,
  useTocHeadings,
} from "@/components/widget/toc";
import WidgetCard from "@/components/widget/widget-card";
import { t } from "@/lib/strings";

export default function SidebarToc() {
  const headings = useTocHeadings();
  const active = useActiveHeading(headings);

  if (headings.length === 0) return null;

  return (
    <WidgetCard title={t("contents")} icon="list">
      <TocList headings={headings} active={active} />
    </WidgetCard>
  );
}
