import Image from "next/image";
import Link from "next/link";

import PostMeta from "@/components/post/post-meta";
import type { Post } from "@/lib/content";
import { t } from "@/lib/strings";
import { getPostUrlBySlug } from "@/lib/utils";

export default function PostCard({ post }: { post: Post }) {
  const href = getPostUrlBySlug(post.slug);

  return (
    <article className="card card-border bg-base-100">
      <div className="card-body gap-3 md:flex-row md:items-stretch">
        <div className="min-w-0 flex-1">
          <h2 className="card-title">
            <Link
              href={href}
              transitionTypes={["nav-forward"]}
              className="transition-colors hover:text-primary"
            >
              {post.title}
            </Link>
          </h2>
          <PostMeta
            published={post.published}
            updated={post.updated}
            tags={post.tags}
            category={post.category}
            className="mt-1"
          />
          <p className="mt-3 line-clamp-2 text-base-content/75">
            {post.description || post.excerpt}
          </p>
          <div className="mt-3 text-xs text-base-content/50">
            {post.words} {t(post.words === 1 ? "wordCount" : "wordsCount")}
            {" · "}
            {post.readingTime}{" "}
            {t(post.readingTime === 1 ? "minuteCount" : "minutesCount")}
          </div>
        </div>
        {post.image ? (
          <Link
            href={href}
            aria-label={post.title}
            transitionTypes={["nav-forward"]}
            className="block w-full shrink-0 overflow-hidden rounded-box md:w-56"
          >
            <Image
              src={post.image}
              alt=""
              width={640}
              height={360}
              className="h-40 w-full object-cover md:h-full"
            />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
