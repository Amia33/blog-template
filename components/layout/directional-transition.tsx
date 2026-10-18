"use client";

import { ViewTransition } from "react";
import type { ReactNode } from "react";

export default function DirectionalTransition({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ViewTransition
      enter={{
        "nav-forward": "slide-in-right",
        "nav-back": "slide-in-left",
        default: "fade-in",
      }}
      exit={{
        "nav-forward": "slide-out-left",
        "nav-back": "slide-out-right",
        default: "fade-out",
      }}
    >
      {children}
    </ViewTransition>
  );
}
