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
  `Referrer-Policy`, `X-Frame-Options`, and `Permissions-Policy`. CSP is
  intentionally deferred; if added, use hashes or static script files so
  static/PPR caching keeps working.
- **Dependency overrides** in `pnpm-workspace.yaml` pin patched `katex`,
  `toml`, `uuid`, and `postcss-selector-parser` versions. One build-time
  advisory remains in `sprintf-js` (no patched version; reached through
  `gray-matter`/`js-yaml`/`argparse`) and is limited to trusted repository
  content during the build. `braces` is dev-only. Re-check after upstream
  releases.
