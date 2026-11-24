# Krops website

Marketing site for **Krops**: drone mapping, per-tree fertilizer dosing and a connected spreader for oil palm smallholders. The site is a single page in Bahasa Indonesia.

- **Stack:** Next.js 16 (App Router, static) · React 19 · TypeScript
- **Animation:** GSAP (ScrollTrigger, SplitText) · Lenis smooth scroll
- **Styling:** plain CSS

## Getting started

Requires Node 24 (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck + production build (same as CI)
```

## Project structure

```
src/
  app/
    layout.tsx            <head>: metadata/SEO, fonts, stylesheets, theme boot script
    page.tsx              renders <KropsPage /> + <KropsBehaviors />
    css/[file]/route.ts   serves src/styles/*.css at /css/*.css (asset URLs versioned)
  components/krops/
    content.ts            ALL site copy, links, image/video paths  <- edit text here
    KropsPage.tsx         section order
    KropsHero.tsx         hero (video -> per-tree colour map, scroll story)
    KropsHow.tsx          "Cara kerja" 5-step pinned timeline
    KropsTech.tsx         "Teknologi" (AI detection scan + VARI) + system cards
    KropsBuiltFor.tsx     "Untuk siapa" (4:3 field video + benefits)
    KropsNextPlan.tsx     "Rencana berikutnya" (roadmap concepts)
    KropsTeam.tsx         team intro + TeamCarousel.tsx
    KropsCloser.tsx       footer
    KropsContactModal.tsx contact form (opens the visitor's email app)
    LiquidButton.tsx      shared gooey button
    base/                 nav, mobile menu, preloader, scroll progress, SVG filters
    behaviors/            client-side behaviour (scroll stories, nav, modal,
                          carousel video loading, theme toggle, Lenis)
    KropsBehaviors.tsx    starts every behaviour once on load
  lib/assets.ts           content-hash versioning for /assets and /css URLs
  styles/
    base.css              base design system (from the original template)
    how-it-works.css      "Cara kerja" layout, scoped under .bh
    krops.css             Krops brand layer + all section/dark-mode changes
public/assets/            fonts, logo, images, team photos, videos
scripts/
  video-to-web.swift      re-encode videos (HEVC/H.264, crop, bitrate)
docs/CONTENT.md           where each claim on the site comes from
```

## Common edits

| Task | Where |
|---|---|
| Change text, links, email, team members | `src/components/krops/content.ts` |
| LinkedIn URL | `social.linkedin` in `content.ts` (currently `#`) |
| Colours, spacing, typography | `src/styles/krops.css` (palette tokens at the top; dark mode in the "Dark mode" block) |
| Replace an image | overwrite the file in `public/assets/…` (same name is fine), or add a new one and update the path in `content.ts` |
| Replace a video | see below |

### Replacing a video
Encode each video in two codecs (HEVC for Safari/iOS, H.264 for everything else), plus a smaller variant for phones. The script uses macOS AVFoundation, so no ffmpeg is needed.

```bash
swift scripts/video-to-web.swift input.mov out.hevc.mp4 --codec hevc --kbps 3000 --width 1280
swift scripts/video-to-web.swift input.mov out.h264.mp4 --codec h264 --kbps 4000 --width 1280
# optional centre crop, e.g. 4:3:  --crop-aspect 1.3333   9:16:  --crop-aspect 0.5625
```

Put the files in `public/assets/video/` (overwriting is fine) and list them in the `sources` of the video in `content.ts`.

## How the page works
- **Theme:** light/dark follows the OS until the visitor uses the nav toggle. The choice is saved in `localStorage`, and an inline script sets it before first paint, so there is no flash.
- **Videos:** each video shows a poster first. The source is picked per device and codec, the video loads after the page (or when near the viewport) and pauses off screen. Data Saver, 2G and reduced-motion visitors get the poster only.
- **Caching:** every `/assets/…` and `/css/…` URL the page emits gets `?v=<content hash>` (`src/lib/assets.ts`), including `url()`s inside the stylesheets.
  - Versioned URLs are cached for a year.
  - Replacing or editing a file changes its hash, so visitors get the new version on a normal reload (no hard refresh). In development it shows on the next reload; in production after the next build/deploy.
  - Requests without `?v` always revalidate.
  - Always reference assets by their plain path (`/assets/img/x.webp`); versioning is added automatically.
- **Contact form:** there is no backend yet. Submitting opens the visitor's email app addressed to `contact.email`. To receive messages directly, connect a form service (e.g. Formspree/Web3Forms) in `behaviors/contactModal.ts`.

## Deploy
- **Vercel:** import the repo; no config needed.
- **Docker:** `docker build -t krops-website . && docker run -p 3000:3000 krops-website` (uses `output: "standalone"`).

## Not in the repo
Raw source material (`KROPS/`, `krops-team/`: original renders, HEIC photos, `.mov` files, the Krops Type font sources) is git-ignored because of its size. Keep it in shared storage; everything the site needs is already exported to `public/assets`.
