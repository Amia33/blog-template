"use client";

import { useEffect, useState } from "react";

import { Icon } from "@/components/ui/icon";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="トップへ戻る"
      onClick={() => {
        const reduced =
          document.documentElement.dataset.motionReduced === "true" ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      }}
      className={`back-to-top btn btn-circle btn-primary fixed right-6 bottom-8 z-40 shadow-lg transition-all duration-300 motion-reduce:transition-none ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <Icon name="arrowUp" className="text-xl" />
    </button>
  );
}
