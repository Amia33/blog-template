import type { ReactNode } from "react";

export function MdxSteps({ children }: { children?: ReactNode }) {
  return (
    <ul className="not-prose steps steps-vertical my-4 w-full lg:steps-horizontal">
      {children}
    </ul>
  );
}

export function MdxStep({
  title,
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <li className="step step-primary">
      <div className="font-medium">{title}</div>
      {children ? (
        <div className="text-xs text-base-content/60">{children}</div>
      ) : null}
    </li>
  );
}
