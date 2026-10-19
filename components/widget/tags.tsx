import Link from "next/link";

import Collapsible from "@/components/widget/collapsible";
import { getTags } from "@/lib/content";
import { t } from "@/lib/strings";
import { getTagUrl } from "@/lib/utils";

export default function Tags({
  collapseAfter = 20,
}: {
  collapseAfter?: number;
}) {
  const tags = getTags();
  if (tags.length === 0) return null;

  return (
    <Collapsible
      title={t("tags")}
      icon="tag"
      defaultCollapsed={tags.length >= collapseAfter}
      footer={{ text: t("viewAll"), href: "/tags" }}
    >
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            href={getTagUrl(tag.name)}
            className="badge badge-lg badge-ghost transition-colors hover:bg-primary hover:text-primary-content"
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </Collapsible>
  );
}
