# Blog

A Next.js 16 (App Router) blog built with content-collections, Tailwind CSS 4 + daisyUI 5,
MDX + Expressive Code, and Argon2-protected posts and albums. Deployed on Vercel at
`https://446256.xyz`.

## Requirements

- Node.js >= 20.9
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

Production builds fail when the secret is missing or too short. Preview deployments and local
development render protected content as unavailable instead of failing the build.

## Scripts

- `pnpm dev` — start the development server.
- `pnpm build` — production build (also runs the content-collections and image steps).
- `pnpm start` — serve the production build locally.
- `pnpm lint` — ESLint.
- `pnpm typecheck` — TypeScript without emitting.
- `pnpm new-post` — scaffold a new post.
- `pnpm hash-password "your-password"` — generate an Argon2id hash for protected content.

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

## Protected content

Set `encrypted: true` and a `passwordHash` using Argon2id with `m >= 19456`, `t >= 2`, `p >= 1`.
Protected images are served through `/api/protected/posts` and `/api/protected/albums` only after
the session check. The sample encrypted post and album use demo credentials; replace or remove
them before using this as a real personal blog.

## Deployment

- `master` deploys to production on Vercel.
- Work on a feature branch, run `pnpm lint && pnpm typecheck && pnpm build`, then verify the
  Vercel preview before merging.
- No CI workflow is configured by choice; the checks above are run locally before merging.
