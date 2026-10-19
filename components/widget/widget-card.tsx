import type { ReactNode } from "react";

import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/lib/icons";

export default function WidgetCard({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon: IconName;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card bg-base-100 p-4 ${className}`}>
      <h2 className="mb-2 flex items-center gap-2 text-lg font-bold">
        <Icon name={icon} className="text-primary" />
        {title}
      </h2>
      {children}
    </section>
  );
}
