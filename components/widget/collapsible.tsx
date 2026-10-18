"use client";

import { useState, type ReactNode } from "react";

import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/lib/icons";
import { i18n, I18nKey } from "@/lib/i18n";

export default function Collapsible({
  title,
  icon,
  collapsedHeight = "7.5rem",
  defaultCollapsed = false,
  children,
}: {
  title: string;
  icon: IconName;
  collapsedHeight?: string;
  defaultCollapsed?: boolean;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(!defaultCollapsed);

  return (
    <section className="card bg-base-100 p-4">
      <h2 className="mb-2 flex items-center gap-2 text-lg font-bold">
        <Icon name={icon} className="text-primary" />
        {title}
      </h2>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: expanded ? undefined : collapsedHeight }}
      >
        {children}
      </div>
      {defaultCollapsed && !expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="btn btn-ghost btn-sm mt-2 w-full text-primary"
        >
          <Icon name="more" className="text-lg" />
          {i18n(I18nKey.more)}
        </button>
      ) : null}
    </section>
  );
}
