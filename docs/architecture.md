# Architecture

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Build | Vite 8 | `npm run dev`, `npm run build` (runs `tsc` first) |
| UI | React 19 + TypeScript | Function components only |
| Routing | react-router-dom 7 | `BrowserRouter`; `vercel.json` rewrites all paths to `index.html` |
| Styling | Tailwind CSS 4 | Tokens and utilities in `src/index.css` (`@theme` block) |
| Motion | framer-motion | Hero, parallax, count-ups, scroll-linked timeline |
| Smooth scroll | lenis | `src/lib/smoothScroll.ts`; off when the user prefers reduced motion |
| Icons | lucide-react | SVG icons only, never emoji |
| Hosting | Vercel | Static output in `dist/` |

## Folder map

```
public/
  fonts/            Clash Display + Satoshi (.woff2, self-hosted)
  images/hero/      Service photos, every size (see "Images" below)
  images/sections/  Other section photos (team-*.webp)
  logo.svg, favicon.svg
src/
  App.tsx           Routes; every page is lazy-loaded (code-split)
  main.tsx          Entry; imports index.css
  index.css         Fonts, colour tokens, type scale, shared utilities
  constants/content.ts   ALL copy and data: brand, services, slides, process, industries, packages, portfolio
  lib/images.ts     srcset helpers for responsive images
  lib/smoothScroll.ts    Lenis setup, scroll reset, scroll lock
  pages/            One file per route; pages only compose sections
  components/       Sections (Hero, ServicesOverview, About, ...)
  components/common/     Shared pieces: LazyImage, SectionHeader, PageHeader, CountUp, Reveal, ScrollToTop
  components/layout/Layout.tsx   Navbar + routed page + Footer, route transition, starts smooth scroll
docs/               These project notes
audit-log.md        Record of approved destructive changes (see rules.md)
```

## Data flow

All visible text and lists come from `src/constants/content.ts`. Components never hard-code service names, prices, or contact details; change the constant and every page updates. Exception: section headlines and short intros live in the component that renders them.

## Images

- Format: WebP only, stored locally in `public/images` (no hotlinking).
- Hero photos have one key per service (`social`, `design`, `video`, `web`, `ads`, `growth`) and these files:
  - `{key}-1600|1920|2560|3840.webp`: 16:10 landscape up to 4K
  - `{key}-900|1400.webp`: 3:4 portrait crops for phones
  - `{key}-card.webp`: 800×600 for small cards
- Always reference them through `src/lib/images.ts` (`heroSrcSet`, `heroMobileSrcSet`, `cardSrcSet`, `heroSrc`) with a correct `sizes` attribute, so each screen downloads only what it needs.
- Below-the-fold images use `LazyImage` (native lazy loading, skeleton placeholder, fade-in).
- The first hero slide is preloaded in `index.html` with `imagesrcset`.

## Hero slider (`src/components/Hero.tsx`)

- Only the current slide and the next one are mounted; images are marked ready after `img.decode()`.
- Transition: the incoming photo fades in on top while the outgoing one stays fully opaque beneath (no dark dip). Autoplay waits until the next image is decoded.
- Copy for all slides sits in one CSS grid cell so the block height never changes between slides.
- Pauses on hover/focus of the buttons, when the tab is hidden, and when the hero is out of view. Disabled entirely for reduced motion.

## SEO

- **One domain setting:** `SITE_URL` in `vite.config.ts` (or the `SITE_URL` environment variable on the host). It feeds the canonical and Open Graph URLs in `index.html` (`%SITE_URL%`), `usePageMeta` (`__SITE_URL__`), the JSON-LD, and the generated `dist/robots.txt` and `dist/sitemap.xml`. `public/robots.txt` and `public/sitemap.xml` are only used by the dev server; the build overwrites them.
- **Routes for the sitemap:** `ROUTES` in `vite.config.ts`. Add a route there when a page is added to `src/App.tsx`.
- **Per-page tags:** `usePageMeta(title, description, noindex)` in every page. Titles stay at or under ~60 characters, descriptions ~115-145. Canonicals never carry a trailing slash or query string.
- **Structured data:** `Organization` and `WebSite` in `index.html`, facts only. Add `sameAs` (social profiles), `email`, `telephone` and an address only once they are real.
- **Hosting:** `vercel.json` sets `trailingSlash: false`, so `/about/` redirects to `/about`.
- **Known limits:** pages render in the browser, so non-Google crawlers and link previews see the home-page tags; unknown URLs return HTTP 200 with a `noindex` tag (soft 404). Both need prerendering or route-level rewrites, which change the build or hosting setup.

## Error handling

- `ErrorBoundary` (in `Layout`, keyed by route) shows a recovery screen with "Try again" and "Back to home" if a page crashes while drawing.
- `lazyWithRetry` (used for every page in `App.tsx`) reloads once if a page's code fails to download (weak connection, or the site was updated while the tab was open); a second failure goes to the error screen.
- `LazyImage` stops its shimmer and leaves a calm block if a photo fails; the hero treats a failed slide as ready so the slider never stalls.
- The contact form never claims success unless the send worked (see `ContactPanel`).
- Drill: `scratchpad/tools/breakit.mjs` blocks a page's code and all photos in a real browser and reports what a visitor sees.

## Performance notes (measured with Lighthouse on the production build)

- **Do not preload fonts.** Preloading the two main fonts cost about 25 Lighthouse points on a simulated slow phone because they compete with the CSS; `font-display: swap` already keeps text visible.
- **First paint:** `index.html` contains the first hero slide's text (`#boot`), shown before JavaScript runs and replaced when React mounts; an inline script removes it on every route except `/`. Keep its padding in step with the real hero if the hero layout changes.
- **Smooth scrolling (Lenis)** is loaded on demand and skipped on touch screens and for reduced motion.
- **Home is bundled, other pages are lazy.** The page loader is full-height (`min-h-svh`) so the footer never jumps when a page replaces it.
- **Windows build lock:** `npm run build` fails with `EPERM` while `vite preview` is running (it holds files in `dist/`). Stop the preview first.
- **Page titles and descriptions** are set in the browser by `src/lib/usePageMeta.ts`; social crawlers only read `index.html`.

## Performance budget

- Home route JS chunk under ~5 KB gzipped (currently ~4 KB); shared vendor chunk ~134 KB gzipped.
- No third-party requests at runtime (fonts and images are local).
- Avoid adding heavy libraries (3D, animation suites) without a measured reason.
