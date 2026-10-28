import { MEDIA_ORIGIN } from "./media";

const isDevelopment = process.env.NODE_ENV === "development";

export const CSP_REPORT_PATH = "/api/csp-report";

const directives = [
  "default-src 'self'",
  // Next.js inlines bootstrap and RSC payload scripts into every page, and a
  // nonce would force dynamic rendering, losing static and PPR caching. Inline
  // <script> elements stay allowed; inline event-handler attributes do not.
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "script-src-attr 'none'",
  // Inline style attributes are used throughout the UI and MDX output.
  "style-src 'self' 'unsafe-inline'",
  // Local images, inline blur placeholders, and the media bucket. Add another
  // origin here if covers or post bodies reference images from other hosts.
  `img-src 'self' data: blob: ${MEDIA_ORIGIN}`,
  "font-src 'self' data:",
  // Media is restricted to the bucket used by the Video.js players. `blob:`
  // keeps Media Source Extensions working for adaptive streams.
  `media-src 'self' blob: ${MEDIA_ORIGIN}`,
  "frame-src 'self'",
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
