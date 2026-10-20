"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@/components/ui/icon";
import type { NavBarLink } from "@/lib/types/config";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavLink({
  link,
  className = "",
}: {
  link: NavBarLink;
  className?: string;
}) {
  const pathname = usePathname();

  if (link.external) {
    return (
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {link.name}
        <Icon name="external" className="text-xs opacity-50" />
      </a>
    );
  }

  const active = isActive(pathname, link.url);

  return (
    <Link
      href={link.url}
      aria-current={active ? "page" : undefined}
      className={`${className}${active ? " text-primary" : ""}`.trim()}
    >
      {link.name}
    </Link>
  );
}
