import NavLink from "@/components/layout/nav-link";
import { Icon } from "@/components/ui/icon";
import type { NavBarLink } from "@/lib/types/config";

export default function NavMenu({ links }: { links: NavBarLink[] }) {
  return (
    <div className="dropdown dropdown-end">
      <button
        type="button"
        className="btn btn-ghost btn-square"
        aria-label="メニュー"
        aria-haspopup="true"
      >
        <Icon name="menu" className="text-xl" />
      </button>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-50 mt-2 w-52 rounded-box bg-base-100 p-2 shadow"
      >
        {links.map((link) => (
          <li key={link.name}>
            <NavLink link={link} className="gap-1" />
          </li>
        ))}
      </ul>
    </div>
  );
}
