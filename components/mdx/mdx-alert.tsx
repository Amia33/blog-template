import type { ReactNode } from "react";

import { ALERT_TITLE, alertClassNames } from "@/lib/rehype-alerts";

const VARIANTS = {
  note: "NOTE",
  tip: "TIP",
  important: "IMPORTANT",
  warning: "WARNING",
  caution: "CAUTION",
} as const;

export function MdxAlert({
  variant = "note",
  title,
  children,
}: {
  variant?: keyof typeof VARIANTS;
  title?: string;
  children?: ReactNode;
}) {
  const keyword = VARIANTS[variant] ?? VARIANTS.note;

  return (
    <div className={alertClassNames(keyword).join(" ")}>
      <span className="font-bold">{title ?? ALERT_TITLE[keyword]}</span>
      <div className="text-sm">{children}</div>
    </div>
  );
}
