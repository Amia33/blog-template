import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import type { NavBarLink } from "@/lib/types/config";

export default function NavMenu({ links }: { links: NavBarLink[] }) {
  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-square"
        aria-label="メニュー"
      >
        <Icon name="menu" className="text-xl" />
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-50 mt-2 w-52 rounded-box bg-base-100 p-2 shadow"
      >
        {links.map((link) => (
          <li key={link.name}>
            {link.external ? (
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.name}
                <Icon name="external" className="text-xs opacity-50" />
              </a>
            ) : (
              <Link href={link.url}>{link.name}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
