// Public media and image bucket. Keep this in sync with `next.config.ts`
// (`images.remotePatterns`) and the CSP `img-src`/`media-src` directives.
export const MEDIA_ORIGIN = "https://oss.446256.xyz";
export const MEDIA_HOSTNAME = new URL(MEDIA_ORIGIN).hostname;

/** True for HTTPS URLs served directly from the media bucket. */
export function isMediaUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === MEDIA_HOSTNAME;
  } catch {
    return false;
  }
}
