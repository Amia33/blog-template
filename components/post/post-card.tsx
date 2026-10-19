import Link from "next/link";

import PostCover from "@/components/post/post-cover";
import PostMeta from "@/components/post/post-meta";
import { Icon } from "@/components/ui/icon";
import type { Post } from "@/lib/content";
import { t } from "@/lib/strings";
import { getPostUrlBySlug } from "@/lib/utils";

export default function PostCard({ post }: { post: Post }) {
  const href = getPostUrlBySlug(post.slug);
  const hidden = post.encrypted && post.hideHomeContent;
  const summary = hidden
    ? t("protectedPostSummary")
    : post.description || post.excerpt;

  return (
    <article className="post-card card card-border bg-base-100">
      <div className="post-card-layout">
        <div className="post-card-body card-body gap-3">
          <h2 className="card-title flex-wrap gap-2">
            <Link
              href={href}
              transitionTypes={["nav-forward"]}
              className="transition-colors hover:text-primary"
            >
              {post.title}
            </Link>
            {post.pinned ? (
              <span className="badge badge-primary badge-sm gap-1">
                <Icon name="pin" className="text-xs" />
                {t("pinned")}
              </span>
            ) : null}
            {post.encrypted ? (
              <span className="badge badge-warning badge-sm gap-1">
                <Icon name="lock" className="text-xs" />
                {t("protected")}
              </span>
            ) : null}
          </h2>
          <PostMeta
            published={post.published}
            updated={post.updated}
            tags={post.tags}
            category={post.category}
            showCategory={!hidden}
            showTags={!hidden}
            className="mt-1"
          />
          <p className="mt-3 line-clamp-2 text-base-content/75">{summary}</p>
          <div className="mt-3 text-xs text-base-content/50">
            {post.words} {t(post.words === 1 ? "wordCount" : "wordsCount")}
            {" · "}
            {post.readingTime}{" "}
            {t(post.readingTime === 1 ? "minuteCount" : "minutesCount")}
          </div>
        </div>
        {post.cover ? (
          <Link
            href={href}
            aria-label={post.title}
            transitionTypes={["nav-forward"]}
            className="post-card-cover"
          >
            <PostCover
              cover={post.cover}
              alt=""
              sizes="(min-width: 1280px) 28rem, (min-width: 768px) 24rem, 100vw"
              className="h-full w-full object-cover"
            />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
