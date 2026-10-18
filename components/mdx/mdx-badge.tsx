import type { ReactNode } from "react";

const VARIANTS = {
  primary: "badge badge-soft badge-primary",
  neutral: "badge badge-soft badge-neutral",
  info: "badge badge-soft badge-info",
  success: "badge badge-soft badge-success",
  warning: "badge badge-soft badge-warning",
  error: "badge badge-soft badge-error",
} as const;

export function MdxBadge({
  variant = "primary",
  children,
}: {
  variant?: keyof typeof VARIANTS;
  children?: ReactNode;
}) {
  return (
    <span className={VARIANTS[variant] ?? VARIANTS.primary}>{children}</span>
  );
}
