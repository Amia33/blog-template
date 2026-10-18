import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { i18n, I18nKey } from "@/lib/i18n";
import { formatDateToYYYYMMDD, getCategoryUrl, getTagUrl } from "@/lib/utils";

export default function PostMeta({
  published,
  updated,
  tags,
  category,
  className = "",
}: {
  published: Date;
  updated?: Date;
  tags: string[];
  category: string | null;
  className?: string;
}) {
  const showUpdated = updated && updated.getTime() !== published.getTime();

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-base-content/60 ${className}`}
    >
      <span className="flex items-center gap-1">
        <Icon name="calendar" className="text-base" />
        {formatDateToYYYYMMDD(published)}
      </span>
      {showUpdated ? (
        <span className="flex items-center gap-1">
          <Icon name="editCalendar" className="text-base" />
          {formatDateToYYYYMMDD(updated)}
        </span>
      ) : null}
      <Link
        href={getCategoryUrl(category)}
        className="flex items-center gap-1 hover:text-primary"
      >
        <Icon name="category" className="text-base" />
        {category || i18n(I18nKey.uncategorized)}
      </Link>
      {tags.length > 0 ? (
        <span className="flex flex-wrap items-center gap-1">
          <Icon name="tag" className="text-base" />
          {tags.map((tag, index) => (
            <span key={tag} className="flex items-center">
              {index > 0 ? <span className="mx-1 opacity-40">/</span> : null}
              <Link href={getTagUrl(tag)} className="hover:text-primary">
                {tag}
              </Link>
            </span>
          ))}
        </span>
      ) : null}
    </div>
  );
}
