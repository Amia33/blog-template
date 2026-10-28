const isDevelopment = process.env.NODE_ENV === "development";

export const CSP_REPORT_PATH = "/api/csp-report";

// Video.js plays self-hosted clips from the media bucket. Add another origin
// here (and to `media-src`) when media moves.
const MEDIA_ORIGIN = "https://oss.446256.xyz";

const directives = [
  "default-src 'self'",
  // Next.js inlines bootstrap and RSC payload scripts into every page, and a
  // nonce would force dynamic rendering, losing static and PPR caching. Inline
  // <script> elements stay allowed; inline event-handler attributes do not.
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "script-src-attr 'none'",
  // Inline style attributes are used throughout the UI and MDX output.
  "style-src 'self' 'unsafe-inline'",
  // Covers and body images may point at arbitrary remote hosts.
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  // Media is restricted to the bucket used by the Video.js players. `blob:`
  // keeps Media Source Extensions working for adaptive streams.
  `media-src 'self' blob: ${MEDIA_ORIGIN}`,
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
  // HLS/DASH manifests and segments are fetched with XHR/fetch by Video.js.
  `connect-src 'self' ${MEDIA_ORIGIN}${
    isDevelopment ? " ws: wss: https://va.vercel-scripts.com" : ""
  }`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Local development runs over plain HTTP, so only upgrade on the deployed site.
  ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
  `report-uri ${CSP_REPORT_PATH}`,
];

export const CSP = directives.join("; ");
