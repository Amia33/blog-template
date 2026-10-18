import type { ReactNode } from "react";

export function MdxKbd({ children }: { children?: ReactNode }) {
  return <kbd className="kbd kbd-sm mx-0.5">{children}</kbd>;
}
