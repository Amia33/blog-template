"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/lib/icons";
import { t } from "@/lib/strings";

export default function Collapsible({
  id,
  title,
  icon,
  collapsedHeight = "7.5rem",
  defaultCollapsed = false,
  footer,
  children,
}: {
  id?: string;
  title: string;
  icon: IconName;
  collapsedHeight?: string;
  defaultCollapsed?: boolean;
  footer?: { text: string; href: string };
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(!defaultCollapsed);

  return (
    <section id={id} className="card bg-base-100 p-4">
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
          aria-expanded={expanded}
          className="btn btn-ghost btn-sm mt-2 w-full text-primary"
        >
          <Icon name="more" className="text-lg" />
          {t("more")}
        </button>
      ) : null}
      {footer ? (
        <Link
          href={footer.href}
          className="btn btn-ghost btn-sm mt-2 w-full text-primary"
        >
          {footer.text}
          <Icon name="arrowForward" className="text-base" />
        </Link>
      ) : null}
    </section>
  );
}
