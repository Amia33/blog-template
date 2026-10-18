import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

import { Icon } from "@/components/ui/icon";

/** Only `http(s)` (and protocol-relative) links open in a new tab. */
const EXTERNAL = /^(?:https?:\/\/|\/\/)/i;

export function MdxLink({
  href = "",
  className,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  // rehype-autolink-headings appends `a.anchor` to every heading. Those must
  // stay plain in-page links, not become router navigations.
  if (typeof className === "string" && className.includes("anchor")) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }

  if (EXTERNAL.test(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...rest}
      >
        {children}
        <Icon
          name="external"
          className="ml-1 inline-block align-baseline text-[0.7em] text-base-content/50"
        />
      </a>
    );
  }

  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}
