# Blog

A Next.js 16 (App Router) blog built with content-collections, Tailwind CSS 4 + daisyUI 5,
MDX + Expressive Code, Video.js 10 for `<Video>`/`<Audio>`, KaTeX, PhotoSwipe, and
Argon2-protected posts and albums. BotID and a Vercel WAF rule protect the unlock actions,
and an Upstash-backed rate limiter runs inside the app. Deployed on Vercel at
`https://446256.xyz`.

## Requirements

- Node.js >= 20.9 (enforced by the `engines` field in `package.json`)
- pnpm 12 (see `packageManager` in `package.json`)

## Setup

```bash
pnpm install
env -u NODE_ENV pnpm dev
```

Open <http://localhost:3000>. If your shell exports `NODE_ENV=production`, unset it for
development; Next expects `development` under `next dev`.

## Environment

| Name                       | Required   | Notes                                                            |
| -------------------------- | ---------- | ---------------------------------------------------------------- |
| `PROTECTED_SESSION_SECRET` | Production | At least 32 characters. Generate with `openssl rand -base64 32`. |
| `UPSTASH_REDIS_REST_URL`   | Production | Injected by the Upstash Vercel Marketplace integration.          |
| `UPSTASH_REDIS_REST_TOKEN` | Production | Injected by the Upstash Vercel Marketplace integration.          |

Production builds fail when `PROTECTED_SESSION_SECRET` is missing or too short, and when the
Upstash variables are missing. Preview deployments and local development render protected
content as unavailable / run without the rate limiter instead of failing the build.

The rate limiter also accepts the legacy `KV_REST_API_URL` and `KV_REST_API_TOKEN` names.

## Scripts

- `pnpm dev` — start the development server.
- `pnpm build` — production build. Content collections are compiled through the
  `withContentCollections` wrapper in `next.config.ts`.
- `pnpm start` — serve the production build locally.
- `pnpm lint` — ESLint.
- `pnpm typecheck` — TypeScript without emitting.
- `pnpm new-post` — scaffold a new post.
- `pnpm hash-password "your-password"` — generate an Argon2id hash for protected content.
- `pnpm prepare` — install Husky hooks (runs automatically after `pnpm install`).

Manual generators (not wired into `package.json`):

- `node scripts/generate-icons.mjs`
- `node scripts/generate-og-image.mjs`

## Content

- `content/posts/**` — Markdown/MDX posts. Colocate post images with `index.md` and reference
  them relatively.
- `content/moments/*.md` — short moment entries.
- `content/albums/<slug>/index.md` — flat albums only. Public photos live under
  `public/images/albums/<slug>/`; protected photos live under
  `content/albums/<slug>/photos/`.
- `content/spec/about.mdx` — the about page.
- `public/content/` is generated during the build; do not edit it by hand.

Nested album directories are rejected at build time because the album routes and the protected
photo API only match a single slug segment.

## Media and embeds

Remote images must be HTTPS URLs on the media bucket `https://oss.446256.xyz` with no query
string; `images.remotePatterns` and `lib/media.ts` both enforce this. Images from any other
host render as plain `<img>` without `next/image` optimization.

Use the Video.js components `<Video src="..." poster="..." />` and `<Audio src="..." />` for
media. There is no `<Embed>`/iframe MDX component.

## Protected content

Set `encrypted: true` and a `passwordHash` using Argon2id with `m >= 19456`, `t >= 2`, `p >= 1`.
Protected images are served through `/api/protected/posts` and `/api/protected/albums` only after
the session check. The sample encrypted post and album use demo credentials; replace or remove
them before using this as a real personal blog.

Unlock attempts are limited in two layers:

- **In-app (Upstash sliding window):** 10 attempts per 10 minutes per IP, 20 per 10 minutes
  per protected item, and 300 protected-media requests per minute per IP.
- **Vercel WAF (fixed window):** 10 requests per minute per IP, scoped by Server Action Name
  to `app/actions/unlock.ts#unlockPost` and `app/actions/unlock.ts#unlockAlbum`.

BotID is checked on Vercel. A detected bot sees an inline 403-style card instead of the password
form; a BotID classification error fails closed but keeps the normal error message.

## Deployment

- `master` deploys to production on Vercel.
- Work on a feature branch, run `pnpm lint && pnpm typecheck && pnpm build`, then verify the
  Vercel preview before merging.
- No CI workflow is configured by choice; the checks above are run locally before merging.
- The WAF rule lives in the Vercel dashboard, not in this repository. Its conditions reference
  the Server Action names above, so renaming or moving `app/actions/unlock.ts` (or the
  `unlockPost`/`unlockAlbum` exports) requires updating the rule.
