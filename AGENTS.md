<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project conventions

See `README.md` for setup and `SECURITY.md` for the security model.

- Stack: Next.js 16 App Router (`cacheComponents`, `partialPrefetching`), React 19, strict
  TypeScript, Tailwind CSS 4 + daisyUI 5, content-collections, Video.js 10, BotID, and Upstash
  rate limiting.
- Verify with `pnpm lint`, `pnpm typecheck`, and `pnpm build`. Run `pnpm exec next typegen`
  after changing route props.
- Server Actions live in `app/actions/`. Validate input, then call `limitByPolicy` /
  `resolveClientIp` from `lib/rate-limit.ts` before expensive work (Argon2, BotID).
- A BotID-detected bot gets the inline 403 card in `components/post/password-gate.tsx` via
  `UnlockState.blocked`.
- There is no `MdxEmbed`/`<Embed>` component and no CSP reporting endpoint. Media uses the
  Video.js `<Video>`/`<Audio>` components.
- Remote images must be HTTPS media-bucket URLs (`https://oss.446256.xyz`) with no query
  string.
- Next 16 renamed `middleware.ts` to `proxy.ts`; this project currently has neither.
- The Vercel WAF rate-limit rule references `app/actions/unlock.ts#unlockPost` and
  `app/actions/unlock.ts#unlockAlbum`. Renaming or moving them requires a dashboard update.
