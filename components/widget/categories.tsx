import Link from "next/link";

import Collapsible from "@/components/widget/collapsible";
import { getCategories } from "@/lib/content";
import { t } from "@/lib/strings";

export default function Categories() {
  const categories = getCategories();
  if (categories.length === 0) return null;

  return (
    <Collapsible
      title={t("categories")}
      icon="category"
      defaultCollapsed={categories.length >= 5}
    >
      <ul className="menu w-full p-0">
        {categories.map((category) => (
          <li key={category.name}>
            <Link href={category.url} className="justify-between">
              <span className="truncate">{category.name}</span>
              <span className="badge badge-ghost badge-sm">
                {category.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Collapsible>
  );
}
