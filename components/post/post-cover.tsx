import Image from "next/image";

import type { Cover } from "@/lib/images";

export default function PostCover({
  cover,
  alt,
  sizes,
  className,
  priority = false,
}: {
  cover: Cover;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  if (!cover.optimizable) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={cover.src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={className}
      />
    );
  }

  return (
    <Image
      src={cover.src}
      alt={alt}
      width={cover.width}
      height={cover.height}
      sizes={sizes}
      // `priority` is deprecated in Next 16; `loading` + `fetchPriority` are the
      // documented replacement for marking the LCP image.
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      placeholder={cover.blurDataURL === "" ? "empty" : "blur"}
      blurDataURL={cover.blurDataURL === "" ? undefined : cover.blurDataURL}
      className={className}
    />
  );
}
