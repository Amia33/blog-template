import type { ReactNode } from "react";

export default function Markdown({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`prose max-w-none dark:prose-invert ${className}`}>
      {children}
    </div>
  );
}
