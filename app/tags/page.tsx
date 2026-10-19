import Link from "next/link";

import DirectionalTransition from "@/components/layout/directional-transition";
import PageShell from "@/components/layout/page-shell";
import PageHeader from "@/components/ui/page-header";
import { getTags } from "@/lib/content";
import { pageAlternates, pageOpenGraph, pageTwitter } from "@/lib/seo";
import { t } from "@/lib/strings";
import { getTagUrl } from "@/lib/utils";

export const metadata = {
  title: t("tags"),
  description: t("tagsDescription"),
  alternates: pageAlternates("/tags"),
  openGraph: pageOpenGraph({
    url: "/tags",
    title: t("tags"),
    description: t("tagsDescription"),
  }),
  twitter: pageTwitter({
    title: t("tags"),
    description: t("tagsDescription"),
  }),
};

export default function TagsPage() {
  const tags = getTags();

  return (
    <PageShell page="tags">
      <DirectionalTransition>
        <PageHeader
          title={t("tags")}
          description={t("tagsDescription")}
          count={`${tags.length} ${t("postCount")}`}
        />
        {tags.length === 0 ? (
          <div className="card bg-base-100 p-8 text-center opacity-70">
            {t("noTags")}
          </div>
        ) : (
          <div className="card bg-base-100 p-6">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.name}
                  href={getTagUrl(tag.name)}
                  className="badge badge-lg badge-ghost gap-2 transition-colors hover:bg-primary hover:text-primary-content"
                >
                  #{tag.name}
                  <span className="badge badge-sm">{tag.count}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </DirectionalTransition>
    </PageShell>
  );
}
