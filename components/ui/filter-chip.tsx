import type { ReactNode } from "react";

import { Icon } from "@/components/ui/icon";

export default function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`badge badge-sm gap-1 transition-colors ${
        active ? "badge-primary" : "badge-ghost hover:bg-base-200"
      }`}
    >
      {active ? <Icon name="check" className="text-xs" /> : null}
      {children}
    </button>
  );
}
