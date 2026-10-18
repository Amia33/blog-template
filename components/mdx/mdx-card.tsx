import Link from "next/link";
import type { ReactNode } from "react";

export function MdxCard({
  title,
  href,
  children,
}: {
  title?: string;
  href?: string;
  children?: ReactNode;
}) {
  const inner = (
    <div className="card card-border h-full bg-base-100">
      <div className="card-body gap-2">
        {title ? <h3 className="card-title text-base">{title}</h3> : null}
        <div className="text-sm text-base-content/80">{children}</div>
      </div>
    </div>
  );

  if (!href) {
    return <div className="not-prose my-4">{inner}</div>;
  }

  return (
    <Link
      href={href}
      className="not-prose my-4 block transition-opacity hover:opacity-90"
    >
      {inner}
    </Link>
  );
}
