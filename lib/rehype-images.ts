import path from "node:path";

import {
  type PostMeta,
  imageMeta,
  postDirectory,
  postSlug,
  resolveSource,
  toProtectedPostImageUrl,
  toPublicUrl,
} from "@/lib/images";

type Node = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
};

type VFileLike = {
  data: Record<string, unknown>;
};

function collectImages(node: Node, found: Node[]): void {
  if (node.tagName === "img") {
    found.push(node);
  }

  for (const child of node.children ?? []) {
    collectImages(child, found);
  }
}

/**
 * Resolves `img` sources that are relative to the post file, copies them into
 * `public/content/`, and annotates the element with the real intrinsic size so
 * `next/image` can emit a correct `srcset` instead of guessing.
 *
 * `collectionDir` is the collection's directory as configured in
 * `content-collections.ts`; `_meta` alone cannot express it.
 */
export function rehypeImages({
  collectionDir,
  protected: isProtected = false,
  slug: protectedSlug,
}: {
  collectionDir: string;
  protected?: boolean;
  slug?: string;
}) {
  return async (tree: Node, file: VFileLike): Promise<void> => {
    // Injected by `@content-collections/mdx` as the first remark plugin.
    const meta = file.data._meta as PostMeta | undefined;
    if (!meta) return;

    const images: Node[] = [];
    collectImages(tree, images);
    if (images.length === 0) return;

    const postDir = postDirectory(meta, collectionDir);
    const slug = protectedSlug ?? postSlug(meta);
    const collectionRoot = path.join(process.cwd(), collectionDir);
    let isFirst = true;

    for (const node of images) {
      const src = node.properties?.src;
      if (typeof src !== "string" || src.trim() === "") continue;

      const source = await resolveSource(src, postDir, {
        confineTo: isProtected ? postDir : collectionRoot,
        rejectPublic: isProtected,
      });
      if (source.kind === "remote") continue;

      if (isProtected) {
        const relative = path
          .relative(postDir, source.absolutePath)
          .split(path.sep)
          .join("/");

        if (
          relative === "" ||
          relative === ".." ||
          relative.startsWith(`..${path.sep}`) ||
          path.isAbsolute(relative)
        ) {
          throw new Error(
            `Image path escapes the encrypted post directory: ${src}`,
          );
        }

        const { width, height, blurDataURL } = await imageMeta(
          source.absolutePath,
        );

        node.properties = {
          ...node.properties,
          src: toProtectedPostImageUrl(slug, relative),
          width,
          height,
          "data-blur": blurDataURL,
          "data-priority": isFirst ? "true" : "false",
        };

        isFirst = false;
        continue;
      }

      const url = await toPublicUrl(source.absolutePath, slug);
      const { width, height, blurDataURL } = await imageMeta(
        source.absolutePath,
      );

      node.properties = {
        ...node.properties,
        src: url,
        width,
        height,
        "data-blur": blurDataURL,
        "data-priority": isFirst ? "true" : "false",
      };

      isFirst = false;
    }
  };
}
