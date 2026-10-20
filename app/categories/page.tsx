import Link from "next/link";

import DirectionalTransition from "@/components/layout/directional-transition";
import PageShell from "@/components/layout/page-shell";
import PageHeader from "@/components/ui/page-header";
import { Icon } from "@/components/ui/icon";
import { getCategories } from "@/lib/content";
import { pageAlternates, pageOpenGraph, pageTwitter } from "@/lib/seo";
import { t } from "@/lib/strings";

export const metadata = {
  title: t("categories"),
  description: t("categoriesDescription"),
  alternates: pageAlternates("/categories"),
  openGraph: pageOpenGraph({
    url: "/categories",
    title: t("categories"),
    description: t("categoriesDescription"),
  }),
  twitter: pageTwitter({
    title: t("categories"),
    description: t("categoriesDescription"),
  }),
};

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <PageShell page="categories">
      <DirectionalTransition>
        <PageHeader
          title={t("categories")}
          description={t("categoriesDescription")}
          count={`${categories.length} ${t("postCount")}`}
        />
        {categories.length === 0 ? (
          <div className="card bg-base-100 p-8 text-center opacity-70">
            {t("noPosts")}
          </div>
        ) : (
          <ul className="card bg-base-100 p-4">
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  href={category.url}
                  className="flex items-center gap-3 border-b border-dotted border-base-300 py-3 last:border-0 hover:text-primary"
                >
                  <Icon name="folder" className="text-lg text-primary" />
                  <span className="min-w-0 flex-1 truncate">
                    {category.name}
                  </span>
                  <span className="text-sm tabular-nums opacity-70">
                    {category.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </DirectionalTransition>
    </PageShell>
  );
}
