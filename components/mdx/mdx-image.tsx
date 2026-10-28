import Image from "next/image";

import { isMediaUrl } from "@/lib/media";

type MdxImageProps = {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  "data-blur"?: string;
  "data-priority"?: string;
};

/** Any scheme (`data:`, `https:`) or a protocol-relative `//host/path`. */
const NON_LOCAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const PROTECTED = /^\/api\/protected\//;
const SAFE_REMOTE = /^(?:https?:|data:|\/\/)/i;

export function MdxImage({
  src,
  alt = "",
  width,
  height,
  "data-blur": blur,
  "data-priority": priority,
}: MdxImageProps) {
  if (!src) return null;

  if (!src.startsWith("/") && !SAFE_REMOTE.test(src)) {
    return null;
  }

  const parsedWidth = Number(width);
  const parsedHeight = Number(height);
  const hasSize =
    Number.isFinite(parsedWidth) &&
    parsedWidth > 0 &&
    Number.isFinite(parsedHeight) &&
    parsedHeight > 0;
  const isPriority = priority === "true";

  // The image optimizer fetches server-side without the viewer's session
  // cookie, so protected images must go straight to the browser.
  if (PROTECTED.test(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={hasSize ? parsedWidth : undefined}
        height={hasSize ? parsedHeight : undefined}
        loading={isPriority ? "eager" : "lazy"}
        fetchPriority={isPriority ? "high" : "auto"}
        decoding="async"
        className="my-4 h-auto w-full rounded-box object-cover"
      />
    );
  }

  // Remote sources are optimized only when the build step resolved their
  // dimensions and the host is in `images.remotePatterns`.
  if (NON_LOCAL.test(src)) {
    if (isMediaUrl(src) && hasSize) {
      return (
        <Image
          src={src}
          alt={alt}
          width={parsedWidth}
          height={parsedHeight}
          sizes="(min-width: 768px) 768px, 100vw"
          loading={isPriority ? "eager" : "lazy"}
          fetchPriority={isPriority ? "high" : "auto"}
          placeholder={blur ? "blur" : "empty"}
          blurDataURL={blur || undefined}
          className="my-4 h-auto w-full rounded-box object-cover"
        />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={isPriority ? "eager" : "lazy"}
        fetchPriority={isPriority ? "high" : "auto"}
        decoding="async"
        className="my-4 rounded-box"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={hasSize ? parsedWidth : 1200}
      height={hasSize ? parsedHeight : 630}
      sizes="(min-width: 768px) 768px, 100vw"
      // `priority` is deprecated in Next 16; the first image in a post body is
      // the likely LCP candidate when there is no cover.
      loading={isPriority ? "eager" : "lazy"}
      fetchPriority={isPriority ? "high" : "auto"}
      placeholder={blur ? "blur" : "empty"}
      blurDataURL={blur || undefined}
      className="my-4 h-auto w-full rounded-box object-cover"
    />
  );
}
