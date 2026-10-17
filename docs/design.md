# Design

## Direction

**Noir and honey.** A crisp, confident agency look: deep honey amber on a neutral rich black, with true white light sections (no cream or brown tints). One bold moment per page (the hero and its gold ticker); everything else quiet, roomy, and editorial.

## Colour tokens (`src/index.css` → `@theme`)

| Token | Hex | Use |
|---|---|---|
| `gold` | `#F2A516` | Brand colour: primary buttons, ticker band, key numbers, active states |
| `gold-light` | `#F7BA4A` | Hover on gold buttons |
| `gold-dark` | `#7A5600` | Gold text/icons on light backgrounds (contrast) |
| `ink` | `#0B0B0C` | Neutral rich-black page background |
| `dark-surface` | `#121214` | Alternate dark sections |
| `dark-card` | `#19191C` | Cards and placeholders on dark |
| `wax` | `#FAFAFA` | Light sections (neutral white) |
| `wax-deep` | `#F0F0EE` | Placeholders on light |

Section rhythm on the home page: hero (ink) → services (wax) → about + industries (ink) → process (dark-surface) → why us (wax) → CTA (gold panel on ink) → footer (ink).

## Typography

| Role | Face | Weights | Notes |
|---|---|---|---|
| Headlines, numbers, nav CTA | **Clash Display** (Fontshare, ITF Free Font License) | 500/600/700 | `.font-display`; slight extra word-spacing at large sizes |
| Body, UI | **Satoshi** (Fontshare, ITF FFL) | 400/500/700 | Default `font-sans` |

Scale: `.text-fluid-hero` (44→104px), `.text-fluid-h2` (34→64px), `.text-fluid-h3` (21→30px). Body 16–18px, line length under ~70 characters (`max-w-[44ch]`–`max-w-xl`).

## Layout

- `.shell`: max 1720px wide, 20/32/48px side padding. Every section uses it.
- Sections: `py-24 sm:py-32`.
- Headings left-aligned. Section headers: title left (7 cols), intro + action right (5 cols).
- Cards: large radius (`rounded-3xl`) on photos; mixed widths (bento 7/5, 5/7, 6/6) rather than identical grids.

## Motion system (2026-10-15)

One easing everywhere: `cubic-bezier(0.22, 1, 0.36, 1)` (`EASE` in `src/lib/motion.ts`). Only `transform`, `opacity` and (for two photo reveals) `clip-path` are animated. Phones travel half the distance; reduced motion shows everything at once.

| Piece | File | Use |
|---|---|---|
| `Reveal` | `common/Reveal.tsx` | Fade plus short travel from `up`/`down`/`left`/`right`; stagger by passing `delay` (0.08-0.1s per item, capped at 0.5s) |
| `RevealWords` | `common/RevealWords.tsx` | Section headings: words rise from behind a mask (used automatically by `SectionHeader` for string titles) |
| `ImageReveal` | `common/ImageReveal.tsx` | Photo uncovered from an edge with a slight scale settle (About photo, Services rows) |
| `TiltCard` | `common/TiltCard.tsx` | 4 degree 3D tilt on image-led cards only (Work); off for touch and reduced motion |

Directions: left-side content enters from the left, right-side from the right, lists rise from below; Services rows alternate sides with their images. The hero keeps its own sequence and is not touched by this system.

Added 2026-10-15 (second pass), all pointer-gated and reduced-motion safe:

| Effect | File | Where |
|---|---|---|
| Scroll progress line | `common/ScrollProgress.tsx` | Top edge, every page (hidden for reduced motion) |
| Scroll-velocity ticker | `Marquee.tsx` | Hero ticker. Mouse/trackpad devices run it in JavaScript (speeds up to 7x when scrolling fast, pauses on hover); touch devices get the plain CSS ticker for speed |
| Cursor spotlight, lift, heavier name | `common/Spotlight.tsx` + `IndustriesStrip.tsx` | Industry tiles |
| Magnetic button | `common/Magnetic.tsx` | Navbar "Let's talk", hero primary, CTA banner primary (no wrapper on touch) |
| Animated mobile menu | `Navbar.tsx` | Fade-down panel, links cascade in |
| SVG path drawing | `PackageTiers.tsx` | Three hexagons draw themselves, fills fade to their own level |
| Underline draw | `Footer.tsx` (`link-draw-gold`) | Footer links |

Added 2026-10-15 after studying digitalmarketingking.in (technique only, nothing copied): `KineticBand.tsx` (home, before the CTA: two oversized rows, solid and gold-outline words, opposite directions, scroll-linked drift on mouse devices, decorative so `aria-hidden`) and `common/FloatingWhatsApp.tsx` (bottom-right, appears after the hero, pulses 3 times, hides while the footer is visible). Their media-logo and testimonial carousels were not added: they need real logos and quotes.

Considered and rejected: WebGL/Three.js/shaders (removed Three.js earlier for speed), GSAP (Framer Motion covers it), horizontal/pinned scroll (breaks phones and fights Lenis), navbar entrance animation (delays the logo, which is the LCP element), character-level text, ripple, grayscale-to-colour, image displacement.

Deliberately not animated: the hero (already choreographed), footer, forms, body paragraphs, pricing-card text, anything that would delay reading.

## Motion

Motion is reserved for moments that mean something:
- Hero: photo crossfade with slow zoom, headline words rising from a mask, gold ticker.
- Parallax on the hero photo and About photo.
- Count-up on About stats, once.
- Process timeline: gold line fills as you scroll.
- Smooth (inertia) scrolling via Lenis.
- Hover: image zoom 1.05, arrow chips rotate 45°.

**Not used on purpose:** fade-up on every section, glows, gradient text, floating blobs.

## Avoid (these read as template or AI-generated)

- A small label above every heading; tracked all-caps eyebrows.
- Putting one word of a headline in italic or a different colour.
- Middle-dot strings ("A · B · C") and "01 / Label" numbering on things that are not sequences.
- Monospace fonts for labels; neon glows; identical card grids; grey near-black backgrounds with one accent.
- Emoji as icons.

## Components to reuse

`SectionHeader`, `PageHeader` (inner-page opener with breadcrumb + ticker), `LazyImage`, `Marquee`, `CountUp`. Buttons: height 48px (`h-12`) for secondary/section actions, 56px (`h-14`) for primary hero/CTA actions, always `rounded-full`.

## Where the serif is used (Fraunces, a Google font, self-hosted)

Clash Display carries headlines and Satoshi carries body text. Fraunces (`.font-serif-display`) is kept for a few "feature" moments so it stays special: the industry tile names, the big About numbers, the struck-through "usual way" lines on the home comparison, "Custom quote" on package cards, the Packages intro question, the Work call-to-action line, and the footer tagline. Do not use it for buttons, navigation or body text.

## Photos: one image, one job

Every photo appears once per page and each page has its own set; nothing on an inner page repeats the home hero. Files are WebP in `public/images/` and always go through the helpers in `src/lib/images.ts`.

| Folder | Used for | Sizes |
|---|---|---|
| `hero/` | the six home hero slides only | 1600-3840 landscape, 900/1400 portrait |
| `pages/` | inner-page headers: about, services, process, packages, work, contact | same as hero |
| `services/` | home service cards and Services page rows (social, design, video, web, ads, growth) | 800-2000, 4:3 |
| `work/` | Work page and home work preview | 800-1600, 4:3 |
| `sections/` | About story team photo | 700-1800, 4:5 |

Picking a photo: it must show the section's subject (calculator for Packages, flow diagram for Process, telephone for Contact), be bright and sharp, and carry no third-party brand logos. Verify with `scratchpad/tools/imgs.mjs`-style check: no repeats on a page.

Overlays: home hero uses `.scrim-hero`; inner headers use `.scrim-page`, which below 1024px keeps the photo clear in the top part and puts the text on the dark lower end.

## Sliding rows

- Gold service ticker (hero): `Marquee`. Page-header service links: `PillMarquee` (same motion, glass pills, pauses on hover/touch/focus, swipeable row under reduced motion).
- Filters (Work page): `FilterRail`, one line that swipes sideways on small screens; never wrap pills into several rows.

## References

akirafresh.com (ticker band, fact strip), wearecollins.com (large type lists, footer), basicagency.com (full-bleed hero), the frontend-design skill, and the ui-ux-pro-max checklist.

## Cinematic motion (2026-10-15)

- **Hero:** pinned scroll scene — 3D tilt back, shrink to a rounded frame, photo push-in, copy fade, letterbox bars, dim; opening letterbox on load; film grain + vignette.
- **Big blocks:** `Scene3D` screen lift (CTA, card grids). **Entrances:** `Reveal` tilts up into place. **Cards:** `TiltCard` follows the mouse.
- Everything is off for reduced-motion visitors.

## Cinematic 3D layer (2026-10-16)

Real-time 3D honeycomb scenes, cursor ring, page-transition wipe, tilt-and-shine cards and gold button glint. See `docs/cinematic-3d.md` for where each runs, the files, the fallbacks and how to tweak colours and speed.

## Home About teaser (2026-10-17)

Honeycomb floor (`common/HexLattice.tsx`, two SVG paths per lattice) on a plane tilted 58° that drifts toward you on scroll, with a larger, fainter lattice moving the other way; masked into the ink at the horizon, bottom and left (`.floor-mask`). Four stat cards deal in from depth (alternating ±26° rotateY, each on its own spring-smoothed slice of scroll) with TiltCard + Spotlight inside; numbers size to their card (`cqw`). Text tones (owner request): silver-white headline (`.text-silver`), lit gold "Working as yours." and numbers (`.text-gold-lit`). Phones: flat static lattice, fade-ups; reduced motion: static.

## About page story (2026-10-17)

Team photo as an object in depth: it turns flat from rotateY −16° as the section scrolls in (outer wrapper) with pointer tilt inside (TiltCard), and pushes in slowly (scale 1.18 → 1.04); a large gold hexagon outline behind it and a small hex cluster in front move at different speeds; faint lattice on the right (`.lattice-fade-left`). Quote in Fraunces as a `<blockquote>` with a word-by-word read-along (0.4 → 1, StatementScene pattern). Pillars: hexagon bullets that draw in and fill gold on hover, rows that rise in, and ServicesOverview-style dimming. No blend modes over the photo (they forced a re-blend every scrolled frame). Phones: no turn, tilt, push-in or cluster parallax.

## Services deep dive (2026-10-17)

Six blocks as one journey: big outlined Fraunces numbers 01–06 (`.num-outline`, a real sequence) drifting behind silver Clash titles; photo as a 3D object (outer scroll turn ±14° toward the text, inner TiltCard, push-in) with a drawn hexagon behind and a two-hex cluster in front; alternating 7/5 and 5/7 columns. Lists are hairline rows with drawing hexagon bullets and ServicesOverview-style dimming. A travelling gold dot links the blocks; on laptops a sticky hexagon rail (a labelled `<nav>`) fills with scroll and jumps to each id. Phones: no turn, tilt, rail or parallax.
