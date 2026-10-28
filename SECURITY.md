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
- **Unlock rate limiting** is enforced at the Vercel Firewall; the in-process
  limiter is a best-effort fallback. BotID adds a second signal on Vercel.
- **Headers:** Vercel provides HSTS. The app adds `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, and an enforcing
  `Content-Security-Policy`. Inline `<script>` elements and inline styles must
  stay allowed because Next.js inlines bootstrap/RSC payload scripts per page;
  a nonce would force dynamic rendering and disable static/PPR caching. Inline
  event-handler attributes are blocked with `script-src-attr 'none'`, and
  violations are reported to `/api/csp-report`.
- **Dependencies:** no pnpm overrides are currently pinned. Run `pnpm audit` after dependency
  changes and pin patched versions only when an advisory affects a shipped path.
- **Protected content configuration:** production builds fail if
  `PROTECTED_SESSION_SECRET` is missing or shorter than 32 characters. Preview and local
  development render protected content as unavailable instead of failing.
