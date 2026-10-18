import type { ReactNode } from "react";
import {
  FaCircleExclamation,
  FaCircleInfo,
  FaCircleXmark,
  FaLightbulb,
  FaTriangleExclamation,
} from "react-icons/fa6";

import { ALERT_TITLE } from "@/lib/rehype-alerts";

// Both the daisyUI classes and the icon are kept as complete, literal values so
// Tailwind's scanner can see them: alerts only ever appear in compiled
// markdown, which lives in gitignored build output, so a computed
// `alert-${variant}` would never be generated.
const VARIANTS = {
  note: { Icon: FaCircleInfo, className: "alert-info" },
  tip: { Icon: FaLightbulb, className: "alert-success" },
  important: { Icon: FaCircleExclamation, className: "alert-primary" },
  warning: { Icon: FaTriangleExclamation, className: "alert-warning" },
  caution: { Icon: FaCircleXmark, className: "alert-error" },
} as const;

type Variant = keyof typeof VARIANTS;

export function MdxAlert({
  variant = "note",
  title,
  children,
}: {
  variant?: Variant;
  title?: string;
  children?: ReactNode;
}) {
  const key: Variant = variant in VARIANTS ? variant : "note";
  const { Icon, className } = VARIANTS[key];

  return (
    <div role="alert" className={`alert ${className} items-start my-4`}>
      <Icon aria-hidden className="mt-0.5 size-5 shrink-0" />
      <div className="flex min-w-0 flex-col gap-1">
        <span className="font-bold">
          {title ?? ALERT_TITLE[key.toUpperCase()]}
        </span>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}
