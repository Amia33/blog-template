import type { ReactNode } from "react";

export function MdxCollapse({
  title,
  open = false,
  children,
}: {
  title?: string;
  open?: boolean;
  children?: ReactNode;
}) {
  return (
    <details
      className="not-prose collapse collapse-arrow my-4 border border-base-300 bg-base-100"
      open={open}
    >
      <summary className="collapse-title font-medium">{title}</summary>
      <div className="collapse-content text-sm text-base-content/85">
        {children}
      </div>
    </details>
  );
}
