import type { IframeHTMLAttributes } from "react";

const SAFE_EMBED = /^https?:\/\//i;

/**
 * Responsive 16:9 wrapper for video embeds.
 *
 * Authored HTML bypasses the MDX component map (MDX treats `<iframe>` written by
 * hand as explicit JSX), so a raw snippet from YouTube is not restyled. Use
 * `<Embed src="..." title="..." />` instead - the `width`/`height` attributes
 * from a copied snippet are intentionally ignored.
 */
export function MdxEmbed({
  className,
  ...rest
}: IframeHTMLAttributes<HTMLIFrameElement>) {
  if (typeof rest.src !== "string" || !SAFE_EMBED.test(rest.src)) {
    return null;
  }

  return (
    <div
      className={`not-prose relative my-4 aspect-video w-full overflow-hidden rounded-box ${className ?? ""}`}
    >
      <iframe {...rest} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
