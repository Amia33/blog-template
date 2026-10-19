"use client";

import Image from "next/image";

import MomentGallery from "@/components/moments/moment-gallery";
import { Icon } from "@/components/ui/icon";
import { t } from "@/lib/strings";

export type MomentItem = {
  slug: string;
  published: string;
  pinned: boolean;
  location: string;
  mood: string;
  tags: string[];
  html: string;
  images: {
    src: string;
    alt: string;
    width: number;
    height: number;
    blurDataURL: string;
    remote: boolean;
  }[];
};

export default function MomentCard({
  moment,
  author,
  onTagClick,
}: {
  moment: MomentItem;
  author: { name: string; avatar?: string };
  onTagClick: (tag: string) => void;
}) {
  const date = new Date(moment.published);
  const formattedDate = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);

  return (
    <article id={moment.slug} className="card bg-base-100 p-4">
      <div className="flex items-center gap-3">
        {author.avatar ? (
          <Image
            src={author.avatar}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-base-200">
            <Icon name="person" className="text-xl opacity-60" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{author.name}</span>
            {moment.pinned ? (
              <span className="badge badge-primary badge-sm gap-1">
                <Icon name="pin" className="text-xs" />
                {t("pinned")}
              </span>
            ) : null}
            {moment.mood ? <span aria-hidden="true">{moment.mood}</span> : null}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 text-xs opacity-60">
            <time dateTime={moment.published}>{formattedDate}</time>
            {moment.location ? (
              <span className="flex items-center gap-1">
                <Icon name="location" className="text-sm" />
                {moment.location}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className="prose prose-sm mt-3 max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: moment.html }}
      />

      <MomentGallery images={moment.images} />

      {moment.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1">
          {moment.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick(tag)}
              className="badge badge-ghost badge-sm transition-colors hover:bg-primary hover:text-primary-content"
            >
              #{tag}
            </button>
          ))}
        </div>
      ) : null}
    </article>
  );
}
