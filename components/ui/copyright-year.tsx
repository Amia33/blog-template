"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export default function CopyrightYear() {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <span suppressHydrationWarning>
      {mounted ? new Date().getFullYear() : ""}
    </span>
  );
}
