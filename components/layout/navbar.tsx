import Link from "next/link";

import DisplaySettings from "@/components/layout/display-settings";
import NavLink from "@/components/layout/nav-link";
import NavMenu from "@/components/layout/nav-menu";
import { Icon } from "@/components/ui/icon";
import ThemeSwitch from "@/components/widget/theme-switch";
import { siteConfig } from "@/lib/config";
import { getNavLinks } from "@/lib/nav";

export default function Navbar() {
  const links = getNavLinks();

  return (
    <header className="sticky top-0 z-50 border-b border-base-300/60 bg-base-100/85 backdrop-blur">
      <div className="navbar mx-auto min-h-16 w-full max-w-[var(--page-width-dual)] gap-2 px-2 md:px-4">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost gap-2 px-2 text-primary">
            <Icon name="home" className="text-xl" />
            <span className="text-base font-bold">{siteConfig.title}</span>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">
            {links.map((link) => (
              <li key={link.name}>
                <NavLink link={link} className="gap-1 font-medium" />
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end gap-1">
          <DisplaySettings />
          <ThemeSwitch />
          <div className="lg:hidden">
            <NavMenu links={links} />
          </div>
        </div>
      </div>
    </header>
  );
}
