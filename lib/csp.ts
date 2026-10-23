const isDevelopment = process.env.NODE_ENV === "development";

export const CSP_REPORT_PATH = "/api/csp-report";

const directives = [
  "default-src 'self'",
  // Nonces would force dynamic rendering and break PPR, so inline scripts and
  // styles stay allowed. The policy still restricts where scripts can load from.
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // Covers and body images may point at arbitrary remote hosts.
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' blob: https:",
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
  `connect-src 'self'${
    isDevelopment ? " ws: wss: https://va.vercel-scripts.com" : ""
  }`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
  `report-uri ${CSP_REPORT_PATH}`,
];

export const CSP_REPORT_ONLY = directives.join("; ");
