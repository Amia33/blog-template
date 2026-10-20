import "server-only";

import { connection } from "next/server";

import Lightbox from "@/components/post/lightbox";
import Markdown from "@/components/post/markdown";
import MdxContent from "@/components/post/mdx-content";
import PasswordGate from "@/components/post/password-gate";
import ProtectedUnavailable from "@/components/protected/protected-unavailable";
import { isProtectedConfigured } from "@/lib/protected/env";
import { getProtectedPostForRender } from "@/lib/protected/posts";
import { hasProtectedSession } from "@/lib/protected/session";

export default async function ProtectedPostBody({
  slug,
  hint,
}: {
  slug: string;
  hint: string;
}) {
  await connection();

  if (!isProtectedConfigured()) {
    return <ProtectedUnavailable />;
  }

  const unlocked = await hasProtectedSession(`post:${slug}`);

  if (!unlocked) {
    return <PasswordGate kind="post" slug={slug} hint={hint} />;
  }

  const post = getProtectedPostForRender(slug);

  if (!post) return null;

  return (
    <Lightbox>
      <Markdown className="mb-6">
        <MdxContent code={post.mdx} />
      </Markdown>
    </Lightbox>
  );
}
