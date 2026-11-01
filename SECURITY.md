# Security Policy

## Supported Versions

`master` is the supported branch. Security changes are developed on a feature
branch and merged after a preview deployment passes verification.

## Reporting a Vulnerability

To report a vulnerability, please send an E-mail to `admin#amia.work` (change
`#` to `@`). I will reply within a week.

## Security Model

- **Content is trusted code.** MDX and moment content are compiled and executed
  at build time. Pull requests that touch `content/` need the same review as
  application code. Do not accept content from untrusted authors without
  sanitizing raw HTML and restricting MDX imports.
- **Protected posts and albums** use Argon2id password hashes and an encrypted
  iron-session cookie. Hashes must use `m>=19456, t>=2, p>=1`. The plaintext body
  is never included in the public build.
- **Protected images** are served only through `/api/protected/posts` and
  `/api/protected/albums` after a session check. They are never copied into
  `public/`. Encrypted covers are shown only after unlock.
- **`hidden: true`** on an album means unlisted, not private. Direct URLs still
  resolve. Use `encrypted: true` for access control.
- **Unlock protection has two layers.** The Vercel WAF rate-limits the two
  unlock Server Actions (`app/actions/unlock.ts#unlockPost` and `#unlockAlbum`)
  to 10 requests per minute per IP, using the Server Action Name condition
  (requires Next.js 15.5+, available on all plans). Because Hobby allows only
  one rate-limit rule and fixed windows, the app also enforces sliding-window
  limits with Upstash Redis: 10 attempts per 10 minutes per IP, 20 per 10
  minutes per protected item, and 300 protected-media requests per minute per
  IP. If Upstash errors or times out, the in-app check fails open so readers
  are not locked out; the WAF rule remains the hard backstop. The WAF rule is
  dashboard state, so renaming or moving the action file/functions requires
  updating it.
- **BotID** is checked on Vercel. `isBot` renders an inline 403-style card
  instead of the password form. If BotID cannot classify a request, the unlock
  fails closed with the normal rejection message.
- **Headers:** Vercel provides HSTS. The app adds `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, and an enforcing
  `Content-Security-Policy`. Inline `<script>` elements and inline styles must
  stay allowed because Next.js inlines bootstrap/RSC payload scripts per page;
  a nonce would force dynamic rendering and disable static/PPR caching. Inline
  event-handler attributes are blocked with `script-src-attr 'none'`. The
  policy is header-only and has no reporting endpoint (`report-uri`/`report-to`
  are intentionally absent); add an external collector if CSP monitoring is
  needed. `media-src` is limited to the site plus the media bucket
  (`oss.446256.xyz`), which is also allowed in `connect-src` for Video.js
  streams. `frame-src 'self'` is retained for the BotID challenge.
- **Media URLs:** the media bucket is a custom domain that serves with CORS;
  presigned URLs are not used. `next.config.ts` sets
  `images.remotePatterns.search: ""`, and `lib/media.ts` rejects URLs with a
  query string, credentials, or a non-default port. This prevents the image
  optimizer from being used with unintended query-string variants.
- **Dependencies:** the in-app limiter uses `@upstash/ratelimit` and
  `@upstash/redis`. No pnpm overrides are currently pinned. Run `pnpm audit`
  after dependency changes and pin patched versions only when an advisory
  affects a shipped path.
- **Protected content configuration:** production builds fail if
  `PROTECTED_SESSION_SECRET` is missing or shorter than 32 characters, or if
  the Upstash Redis variables are missing. Preview and local development render
  protected content as unavailable / run without the rate limiter instead of
  failing.
