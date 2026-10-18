"use client";

import { Children, type ReactNode, useState } from "react";

export function MdxTabs({
  labels,
  children,
}: {
  labels?: string;
  children?: ReactNode;
}) {
  const items = Children.toArray(children);
  const names = (labels ?? "").split("|").map((label) => label.trim());
  const [active, setActive] = useState(0);
  const current = Math.min(active, Math.max(0, items.length - 1));

  return (
    <div className="not-prose my-4">
      <div role="tablist" className="tabs tabs-box">
        {items.map((item, index) => (
          <button
            key={names[index] ?? `tab-${index}`}
            type="button"
            role="tab"
            aria-selected={index === current}
            className={index === current ? "tab tab-active" : "tab"}
            onClick={() => setActive(index)}
          >
            {names[index] ?? `Tab ${index + 1}`}
          </button>
        ))}
      </div>
      <div className="pt-4">{items[current]}</div>
    </div>
  );
}
