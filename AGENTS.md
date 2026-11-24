<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Krops website

Single-page marketing site for Krops (per-tree fertilizer dosing for oil palm
smallholders). See README.md for structure and commands.

## Rules for changes
- **Copy:** all text lives in `src/components/krops/content.ts`. Edit it there, not in components.
  - The site is in Bahasa Indonesia.
  - Check claims against `docs/CONTENT.md` before adding new ones.
- **Styles:** load order is `src/styles/base.css` → `how-it-works.css` → `krops.css` (served at `/css/*` by `src/app/css/[file]/route.ts`).
  - Put changes in `krops.css`.
  - Leave `base.css` and `how-it-works.css` untouched unless removing dead rules.
  - Colours must be palette tokens (`--cream`, `--forest`, `--mist`, `--moss`, `--sage`, `--krops-orange`) so dark mode keeps working.
- **Scoped selectors:** keep `data-astro-cid-*` attributes on elements whose styles use them.
- **Behaviour:** behaviour scripts in `src/components/krops/behaviors/` hook into fixed ids, classes and `data-*` attributes. Keep those names when editing markup.
- **Assets:** reference them by plain path (`/assets/…`). Server components pass content through `versionAssets()` / `assetUrl()` from `src/lib/assets.ts`, which appends a content hash so the long cache never serves stale files. Do the same for any new asset reference.
- **Videos:** encode with `scripts/video-to-web.swift`.
- **Before committing:** run `npm run check` (lint + typecheck + production build).
