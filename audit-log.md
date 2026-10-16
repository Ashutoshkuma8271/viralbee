# Audit log

Record of approved changes that deleted, overwrote or bulk-edited project data. Newest first.

## 2026-10-16: Cinematic 3D hero and site-wide 3D motion (owner request)

- **Requested by:** project owner, in chat ("cinematic 3D animation in hero, scroll and hover, across the whole website").
- **Restore point:** the uploaded `digitalagency-main.zip` as it was before this change. No data deleted; nothing in `public/` touched.
- **Added packages:** `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing`, `@types/three`. (`three` had been removed on 2026-10-14 when the old hero was replaced; it is back on purpose for the new scenes.)
- **New files:** `src/components/three/` (`SceneHost`, `SceneCanvas`, `SceneContent`), `src/lib/scene3d.ts`, `src/lib/usePointerDepth.ts`, `src/components/common/CursorGlow.tsx`, `src/components/common/RouteCurtain.tsx`, `docs/cinematic-3d.md`.
- **Edited files:** `Hero.tsx`, `StatementScene.tsx`, `ProcessPreview.tsx`, `CtaBanner.tsx`, `common/PageHeader.tsx`, `common/TiltCard.tsx` (rewritten, now used), `PackageTiers.tsx`, `FirstMonth.tsx`, `WorkPreview.tsx`, `WorkGallery.tsx`, `KineticBand.tsx`, `layout/Layout.tsx`, `index.css`, `vite.config.ts`.
- **How to undo:** restore those files from the original zip, delete the new files and run `npm install`.

## 2026-10-14: Replace the Packages header photo

- **Approved by:** project owner, in chat (asked for a different Packages banner photo that fits phones).
- **What:** the six files `public/images/pages/packages-*.webp` (calculator photo, created earlier the same day) were overwritten with a seedling-in-a-jar-of-coins photo; the phone sizes are cropped around the jar.
- **Backup:** `_backup/2026-10-14-packages-header/` (the 6 previous files).
- **Restore:** copy them back into `public/images/pages/`.

## 2026-10-14: Replace three service photos with brighter ones

- **Approved by:** project owner, in chat ("replace if not [representing / visible]").
- **What:** `public/images/services/design-*`, `video-*`, `web-*` (12 files, created earlier the same day) were overwritten with brighter photos (paint brushes, a filming photographer, a laptop with code).
- **Backup:** `_backup/2026-10-14-service-photos/` (the 12 previous files).
- **Restore:** copy them back into `public/images/services/`.

## 2026-10-14: Remove unused CSS utilities from the old design

- **Approved by:** project owner, in chat ("remove not used part that are unused and old components").
- **What:** eight unused rules in `src/index.css`: `.font-syne`, `.text-gold-gradient`, `.card-hive` (+ `:hover`), `.shadow-gold-subtle`, `.hairline-b`, `.hairline-t`, `.bg-noise-grid`. A search showed no `.tsx` file used any of them; build passes.
- **Backup:** `_backup/2026-10-14-css/index.css` (the file as it was before removal).
- **Restore:** copy that file back over `src/index.css`.

## 2026-10-14: Delete five leftover unused files

- **Approved by:** project owner, in chat ("remove not used part that are unused and old components"), after the assistant's message naming these exact files.
- **What:** `src/assets/hero.png`, `src/assets/typescript.svg`, `src/assets/vite.svg` (Vite starter-template leftovers), `public/icons.svg`, `src/components/common/Reveal.tsx` (a no-op wrapper no component uses any more). A search showed zero references to any of them; `tsc` passes after removal.
- **Backup:** `_backup/2026-10-14-leftovers/`.
- **Restore:** copy the files back to their original paths, or `git checkout 52cf0d5 -- <path>` for the tracked ones.

## 2026-10-14: Replace hero and page-header photos

- **Approved by:** project owner, in chat (asked for brighter, clearly visible banner images on all pages).
- **What:** the 42 files in `public/images/hero/` were overwritten with new photos in the same file names and sizes.
- **Backup:** `_backup/2026-10-14-hero-images/` (all 42 originals).
- **Restore:** copy the files back into `public/images/hero/`.

## 2026-10-14: Delete five unused components

- **Approved by:** project owner, in chat ("del things that are not in used"), in reply to the assistant's list naming these five files.
- **What:** `src/components/Portfolio.tsx`, `PricingPackages.tsx`, `Contact.tsx`, `Industries.tsx`, `BeforeAfterSlider.tsx`. Replaced by `WorkGallery`, `PackageTiers`, `ContactPanel` and `IndustriesStrip`. Confirmed with a search that nothing imports them; `tsc` passes after removal.
- **Backup:** `_backup/2026-10-14-unused/src/components/`. Originals are also in git history (commit `52cf0d5`).
- **Restore:** copy the files back from the backup folder, or `git checkout 52cf0d5 -- src/components/<name>.tsx`.
- **Not touched (not named in the approval):** `src/assets/hero.png`, `typescript.svg`, `vite.svg`, `public/icons.svg`, `src/components/common/Reveal.tsx`. Awaiting separate approval.

## 2026-10-14: Delete temporary browser-profile folders created by the screenshot script

- **Approved by:** project owner, in chat ("APPROVE"), in reply to the approval banner listing these exact folders.
- **What:** 61 folders matching `cdp-XXXXXX` in `C:\Users\91933\AppData\Local\Temp` (about 2.7 GB), created today 12:43 to 14:35 by the assistant's headless-Chrome screenshot script. None were project files or user data.
- **Why:** The C: drive was down to 0.39 GB free and screenshots and builds were failing (`ENOSPC`).
- **Result:** 61 of 61 deleted, none skipped. Free space went from 0.70 GB to 3.38 GB.
- **Backup:** none; the folders only held disposable browser cache.
- **Prevention:** the script now reuses one folder (`viralbee-shared-profile` in Temp) instead of creating a new one per run.

## 2026-10-14: Remove unused 3D hero and font packages; fix logo spelling

- **Approved by:** project owner, in chat ("APPROVE"), covering all three items below.
- **Backup:** `_backup/2026-10-14/` (contains `src/components/Hero3D.tsx`, `package.json`, `package-lock.json`, `public/logo.svg` as they were before the change). `Hero3D.tsx` and `logo.svg` are also in git history at commit `52cf0d5`.

| # | What | Action | Why |
|---|------|--------|-----|
| 1 | `src/components/Hero3D.tsx` | Deleted | No longer imported after the hero was rebuilt as a photo slider |
| 2 | `three`, `@types/three`, `@fontsource-variable/inter-tight`, `@fontsource/instrument-serif` | `npm uninstall` (edits `package.json`, `package-lock.json`) | Unused; fonts are now self-hosted Clash Display and Satoshi in `public/fonts/` |
| 3 | `public/logo.svg` | Text `VYRAL` changed to `VIRAL` (line 55 and its comment) | Brand name is spelled "Viral Bee" |

**How to restore:** copy the files from `_backup/2026-10-14/` back to the same paths and run `npm install`, or run `git checkout 52cf0d5 -- src/components/Hero3D.tsx public/logo.svg` and reinstall the packages.

## 2026-10-15: New colour palette (owner request: premium white, better yellow and black, no cream)

- **Requested by:** project owner, in chat. Code edits only; no data deleted.
- **Backup:** `_backup/2026-10-15-colors/` holds `src/index.css`, `index.html`, `src/components/PackageTiers.tsx`, `src/components/common/Spotlight.tsx`, `src/constants/content.ts` as they were before.

| Token / place | Before | After |
|---|---|---|
| gold | `#F5B90F` | `#FFC21F` |
| gold-light | `#FFD34D` | `#FFD452` |
| ink / dark-bg (also `index.html` theme colour, scrims) | `#13110D` | `#0B0B0C` |
| dark-surface / dark-card / hover | `#1A1712` / `#211D17` / `#29241C` | `#121214` / `#19191C` / `#212125` |
| wax / paper / warm-light | `#FAF5E8` | `#FAFAFA` |
| wax-deep | `#F1E9D4` | `#F0F0EE` |
| body text, muted text, scrollbar, glows | warm tints | neutral equivalents |

**How to restore:** copy the five files from `_backup/2026-10-15-colors/` back to the same paths.

## 2026-10-15: Undo the Work filter / Packages redesign and new page sections (owner request)

- **Requested by:** project owner, in chat ("make it like previous ... I do not want change").
- **What:** `FilterRail.tsx`, `WorkGallery.tsx`, `PackageTiers.tsx` and the Packages, Services, Process, About and Work pages restored to how they were before that request (colour palette kept). The three new files (`ComparePlans.tsx`, `Faq.tsx`, `constants/faqs.ts`) were moved out of `src`, not deleted.
- **Backup of the undone work:** `_backup/2026-10-15-reverted-redesign/` (edited files at the same paths; new files in `_new_files_moved/`). Copy them back to reapply.

## 2026-10-15: Restore point, then new page sections (owner request)

- **Restore point ("previous UI"):** `_backup/2026-10-15-previous-ui/` is a full copy of `src/`, `index.html`, `vite.config.ts`, `package.json`, `package-lock.json` and `vercel.json` taken before this change. To go back: copy its contents over the project root.
- **Added (new sections only, existing sections untouched):** FAQ on Packages, Services and Process (`Faq.tsx`, `constants/faqs.ts`); plan comparison table on Packages (`ComparePlans.tsx`); "Less agency friction" (`WhyChooseUs`) on About; industries (`IndustriesStrip`) on Work. `PackageTiers.tsx`: `PLAIN` is now exported (no visual change).
- **Colour previews:** `design/color-options.png` (new file; nothing on the site changed).

## 2026-10-15: Packages plan cards redesigned (owner request)

- **Restore point:** `_backup/2026-10-15-previous-ui-2/` (full `src/` and config before this change). To go back: copy its contents over the project root.
- **Changed:** `src/components/PackageTiers.tsx` intro and plan cards only (headline with gold italic accent, three plain reassurance lines, "best for" line per plan, earlier-plan items as tags, all three cards the same size, no sparkle icon or glow). "How to get started" box unchanged.
- **Colour previews:** `design/accent-options.png` (new file; site colours not changed).

## 2026-10-15: Plan names centred; accent colour changed to Honey Amber (owner chose option B)

- **Restore point:** `_backup/2026-10-15-previous-ui-3/` (full `src/` and config before this change).
- **Changed:** plan name and tagline centred in `PackageTiers.tsx`; `gold` `#FFC21F` → `#F2A516`, `gold-light` `#FFD452` → `#F7BA4A` (in `src/index.css`, `PackageTiers.tsx`, `Spotlight.tsx`, `constants/content.ts`, `docs/design.md`). Logo file not changed.

## 2026-10-15: Review follow-up, steps 2–4 (owner approved "go ahead step by step")

- **Restore point:** `_backup/2026-10-15-previous-ui-4/` (full `src/`, `index.html` and config before these steps).
- **Step 2, hero photo:** new files `public/images/hero/social-phone-{900,1400,1600,1920,2560,3840}.webp` (Unsplash photo 1512428559087, free licence, no app logos). Social Media slide and the first-load preload in `index.html` now use them; optional per-slide `position` added (`Hero.tsx`, `content.ts`). Old `social-*.webp` files left in place (not deleted).
- **Step 3, readability:** faint text brightened across 18 components (`text-white/50→60`, `/55→70`, `/60→70`, `/65→75`, `text-ink/65→75`); 15px running text → 16px; section intros left-aligned on laptops (`SectionHeader.tsx`). Home service cards untouched.
- **Step 4, phone length and amber:** home service cards and "Why us" are swipe rows on phones; industries in 2 columns on phones (`ServicesOverview`, `WhyChooseUs`, `IndustriesStrip`). Phone home page 15,646px → 10,816px. Stat numbers (`About.tsx`) and About pillar titles (`AboutStory.tsx`) changed from amber to white.

## 2026-10-15: "Your first month" cards equal size (owner request)

- **Restore point:** `_backup/2026-10-15-previous-ui-5/`.
- **Changed:** `src/components/FirstMonth.tsx` — each card stretches to the tallest in its row; four in a row from 1280px, 2×2 on tablets and small laptops, one column on phones.

## 2026-10-15: Real phone, WhatsApp and email (owner request)

- **Restore point:** `_backup/2026-10-15-previous-ui-6/`.
- **Changed:** `src/constants/content.ts` — phone `+91 85128 77877` (call link `tel:+918512877877`), WhatsApp `wa.me/918512877877`, email `info@akirafresh.in`. Replaces the `+1 (555)` and `hello@vyralbee.com` placeholders everywhere (header menu, contact page, footer, floating WhatsApp button, CTA, privacy page, error page).

## 2026-10-15: Real address and business hours (owner request)

- **Restore point:** `_backup/2026-10-15-previous-ui-7/`.
- **Changed:** `src/constants/content.ts` (address R-18, Vikas Marg, Laxmi Nagar, Near Nirman Vihar Metro Station, Pillar No. 48, New Delhi, Delhi – 110092, India; Google Maps link; hours Mon – Sat 10:00 AM – 7:00 PM), `ContactPanel.tsx` ("Visit us" with address and map link), `Footer.tsx` (address on three lines), `index.html` (structured data now includes address, phone and email).

## 2026-10-15: Contact form — country-code phone picker and optional website field (owner request)

- **Restore point:** `_backup/2026-10-15-previous-ui-8/` (includes `package.json` / `package-lock.json` from before).
- **Added:** dependency `libphonenumber-js` (phone formats and validation for every country); new `src/components/common/PhoneField.tsx` (searchable country picker with flags, example number per country, formatting when leaving the field); 256 flag images in `public/flags/` (copied from `country-flag-icons`, MIT licence — the package itself was installed only to copy them and then uninstalled).
- **Changed:** `src/components/ContactPanel.tsx` — phone checked against the chosen country's rules and sent as a full international number (e.g. "+91 85128 77877"); new optional "Your website" field, sent with the enquiry.

## 2026-10-15: Disk full on C: — temporary test files moved to D: (owner approved "APPROVE")

- **What:** my own temporary files only — the session scratchpad screenshots/test images (488 items) and the test-browser profile `viralbee-shared-profile` (~584 MB total). No project files touched.
- **Action:** moved (not deleted) to `D:\viralbee-temp-moved\`. C: went from 0 GB to 1.1 GB free.
- **Undo:** move the folders back from `D:\viralbee-temp-moved\`.

## 2026-10-15: Cinematic 3D scroll hero (owner request)

- **Restore point:** `_backup/2026-10-15-previous-ui-9/`.
- **Changed:** `Hero.tsx` (pinned scroll stage: 3D tilt, shrink to rounded frame, photo push-in, copy drift and fade, letterbox bars, dimming; opening letterbox on load; film grain and vignette; scroll cue), `index.css` (film look styles), `FloatingWhatsApp.tsx` (appears after the hero scene). Reduced-motion visitors get the normal hero.

## 2026-10-15: Cinematic 3D layer for the other sections (owner request)

- **Restore point:** `_backup/2026-10-15-previous-ui-10/`.
- **Added:** `src/components/common/Scene3D.tsx` — scroll-linked "screen lift" (block starts tilted back, smaller, dimmer; settles flat). Used on the CTA banner (every page), home services / work / industries grids, first-month cards, package cards and the Work gallery.
- **Changed:** `Reveal.tsx` — every entrance now tilts up into place (or turns in from the side); `ServicesOverview.tsx` — home service cards tilt in 3D with the mouse (mouse devices only); the hero's text fade is now one-way (fixed a bounce-back found in testing). Reduced-motion visitors get no movement.

## 2026-10-15: Master brief, Phase 1 audit + step 1 (hero art direction)

- **Restore point:** `_backup/2026-10-15-previous-ui-11/`.
- **Audit decisions:** stay on framer-motion (no GSAP: avoids a second animation system); no Three.js (CSS/SVG depth is lighter and enough); no testimonials or case-study results invented.
- **Added:** `src/components/HeroHoneycomb.tsx` — honeycomb brand motif (gold cell, frosted cell, fine outlines) floating in 3D on the photo side; turns toward the mouse, cells parallax by depth, rise at different speeds on scroll, draw in on load. Laptop/desktop only.
- **Changed:** `Hero.tsx` (mouse depth parallax on the photo, motif, `overflow-x-clip`), `index.css` (`hex-float`), `layout/Layout.tsx` (`main` gets `overflow-x-clip` so 3D tilts never cause sideways scrolling).

## 2026-10-15: Master brief step 2 — editorial services index (owner approved "go ahead")

- **Restore point:** `_backup/2026-10-15-previous-ui-12/` (has the previous card version of `ServicesOverview.tsx`).
- **Changed:** `src/components/ServicesOverview.tsx` — the home service cards became a numbered editorial index: oversized titles rising out of a mask, self-drawing dividers, description + platforms + badge, arrow; laptop: a photo of the hovered service follows the mouse (springs, leans with movement, wipe between photos) and other rows dim; below laptop size each row has its own small photo. Each row links to that service on the Services page (`/services#…`).

## 2026-10-15: Disk space — npm and pip download caches cleared (owner approved "APPROVE")

- **What:** `npm cache clean --force` (npm-cache, ~4.32 GB) and `pip cache purge` (~0.48 GB). Only re-downloadable package copies; no project or personal files.
- **Result:** C: free 7.94 GB → 12.25 GB. Undo: not needed — npm/pip re-download on demand.

## 2026-10-15: Master brief step 3 — portfolio (owner approved "go ahead")

- **Restore point:** `_backup/2026-10-15-previous-ui-13/`.
- **Changed:** `src/components/WorkPreview.tsx` — home work section: laptop/desktop pinned scene where vertical scroll moves a row of six large project panels sideways (1.5× speed to keep the scene short), photos drift inside their frames, opening and closing panels, progress line + "01 / 06" counter; phones/tablets/reduced motion: swipeable row, no pinning. `src/components/WorkGallery.tsx` — Work page grid became editorial alternating rows (large photo settling from a zoom with parallax, big faint number, category, title, description); filter kept. All items still labelled "Concept project"; no results shown.

## 2026-10-16: Master brief step 4 — scroll storytelling (owner approved "yes")

- **Restore point:** `_backup/2026-10-16-previous-ui-14/`.
- **Added:** `src/components/StatementScene.tsx` (pinned statement: positioning line grows in with a drawn underline, agency description lights up word by word, tagline last; placed after services on Home).
- **Changed:** `ProcessPreview.tsx` (laptop+: pinned six-step sequence — big current step with 3D swap, step list with filling gold line and lighting hexagons, "Step x of 6"; phones/tablets: plain list), `pages/Home.tsx` (adds the scene).
- **Fix (site-wide):** new `useRamp` helper in `lib/motion.ts`; scroll transitions that finish early (hero frame radius/bars/dimming, process line, statement scene, Work page zoom, screen-lift opacity) now use it. framer-motion's browser scroll-timeline path made them run backwards inside pinned sections.

## 2026-10-16: Master brief step 5 — navigation (owner approved "yes")

- **Restore point:** `_backup/2026-10-16-previous-ui-15/`.
- **Changed:** `src/components/Navbar.tsx` — header slides away while scrolling down and returns on scroll up (never near the top, with the menu open, or with keyboard focus inside); one gold indicator glides to the hovered link and back to the current page; phone menu opens with a circular reveal from the menu button, numbered links rise out of masks, contact block (button, email, phone) fades in last.

## 2026-10-16: Master brief step 6 — about, CTA and footer (owner approved "yes")

- **Restore point:** `_backup/2026-10-16-previous-ui-16/`.
- **Added:** `src/components/FooterWordmark.tsx` — giant edge-to-edge "Viral Bee" ("Bee" in amber) whose letters rise out of a mask in a wave as the footer arrives (decorative, hidden from screen readers).
- **Changed:** `Footer.tsx` (wordmark replaces the faint corner honeycomb; all links and contact details unchanged), `CtaBanner.tsx` (headline rises line by line; three nested honeycomb outlines draw themselves in the corner), `About.tsx` (amber italic "Working as yours."; gold line draws along each fact card).

## 2026-10-16: Master brief step 7 — performance, accessibility and final checks (owner approved "yes")

- **Restore point:** `_backup/2026-10-16-previous-ui-17/`.
- **Measured problem:** after steps 1–6, Lighthouse (production build) phone perf 56–67 (TBT 0.9–1.6 s), desktop perf 79, accessibility 96.
- **Fixes:** heavy film effects (grain with blend mode, opening blur, honeycomb) laptop-only (`Hero.tsx`); hero photo full strength from the first frame on phones so it counts as the main picture; screen lift off on phones (`Scene3D.tsx`); below-the-fold home sections built just before they are scrolled near (new `common/Deferred.tsx`, `pages/Home.tsx`); contrast of service numbers and statement-scene dim state raised; service row links no longer override their visible text for screen readers (`ServicesOverview.tsx`, `StatementScene.tsx`).
- **Result:** desktop perf 93, accessibility 100, best practices 100, SEO 100, CLS 0; phone median perf 76 over 7 runs (TBT ~0.5 s). Reduced motion: no pinning, nothing hidden, no overflow on all 8 pages; keyboard order and focus rings OK.

## 2026-10-16: Creative-director review of the rendered site (owner request)

- **Restore point:** `_backup/2026-10-16-previous-ui-18/`.
- **Reviewed:** screen-by-screen walks of all pages at 1440px and 390px.
- **Duplicates removed (each section now appears once):** kinetic word band removed from Home (it repeated the hero ticker and the tagline; `KineticBand.tsx` kept, unused); industries moved to About only (removed from Home and Work); "Why us" kept on Home only (removed from About); the Work page's inline "Want work like this?" box removed (the CTA banner right below says the same).
- **Pacing:** hero scene shorter (135svh phone / 150svh laptop) with lighter dimming and bars, so there is no empty dark screen after it; statement scene ~2 screens instead of 3; process sequence tighter; compact process list on phones. Home: 23 → 20 screens on laptop, 18 → 15 on phones.
- **Checks:** no console errors on all 9 routes (incl. 404); no sideways overflow; reduced motion clean on all pages; build OK; Lighthouse desktop perf 90, accessibility/best practices/SEO 100, CLS 0; phone perf varies 56–80 on this machine (LCP ~4 s, client-rendered — prerendering is the remaining fix).

## 2026-10-16: Published to GitHub (owner request)

- **Remote:** `origin` switched from `https://github.com/Ashutoshkuma8271/ViralBee.git` to `https://github.com/Ashutoshkuma8271/digitalagency.git` (owner chose "Switch to digitalagency"). The ViralBee repository on GitHub is untouched. To switch back: `git remote set-url origin https://github.com/Ashutoshkuma8271/ViralBee.git`.
- **Commit:** all current work (full redesign) in one commit on `main`; `_backup/`, `node_modules`, `dist` and `*.tsbuildinfo` excluded by `.gitignore`. Checked beforehand: no secrets or real `.env` files.

## 2026-10-16: Packages redesign step 2 — simplified plan cards (owner approved "go")

- **Restore point:** `_backup/2026-10-16-packages-redesign/` (full copy of `src/`, `index.html`, `vite.config.ts`, `package.json`, `package-lock.json`, `vercel.json` and this log, taken before the change). To undo: copy `src/components/PackageTiers.tsx`, `src/components/ComparePlans.tsx` and `src/constants/content.ts` back from it.
- **Changed:** `PackageTiers.tsx` — each card now shows only: name (+ "Most popular" on Growth), one-line promise, "Custom quote / Priced to your goals", one full-width "Get a quote for …" button, "What's included" with only the new items ("Everything in Starter/Growth, plus" first), and a "See full details" link to the comparison table. Removed from the card face: level hexagons, Essential/Full Suite badges, tagline, "best for" box, item descriptions (still in the table), "Already included" tags, per-card add-on note (now one line under all cards, built from the data). Intro and "How to get started" untouched for now.
- **Data (additive only):** `content.ts` — new `promise` field on each package; `tagline`, `badge`, `highlight` and all other fields kept.
- **Also:** `ComparePlans.tsx` section gets `id="compare"` (anchor target), nothing else.
- **Checks:** `tsc` OK; `/contact?package=Growth` still prefills the message; cards equal height (649px at 1440); card text sizes 32/16/14px only; no horizontal scroll at 1440/390.

## 2026-10-16: Packages redesign step 2 undone (owner request: "make it like the previous", approved "APPROVE")

- **What:** `src/components/PackageTiers.tsx`, `src/components/ComparePlans.tsx`, `src/constants/content.ts` overwritten with their pre-step-2 copies from `_backup/2026-10-16-packages-redesign/`. All of `src/` is now identical to that restore point (checked with `diff -r`); `tsc` OK.
- **Backup of the undone step-2 work:** `_backup/2026-10-16-packages-step2-undone/` (same paths). To reapply: copy those three files back over `src/`.

## 2026-10-16: "Less agency friction" (WhyChooseUs) step 2 — new layout and styles (owner approved "go")

- **Restore point:** `_backup/2026-10-16-why-choose-us/` (full copy of `src/`, `index.html`, `vite.config.ts`, `package.json`, `package-lock.json`, `vercel.json` and this log, taken before the change). To undo: copy `src/components/WhyChooseUs.tsx`, `src/components/common/RevealWords.tsx` and `src/index.css` back from it.
- **Changed:** `WhyChooseUs.tsx` — laptop+: sticky left column (eyebrow "Why Viral Bee", headline with "More results." in deep gold, Satoshi intro, small key "The usual / With Viral Bee", "Start a conversation"); right: the 8 points as white cards (number, struck "usual" chip with red-grey line and x, connector, ink hexagon with gold tick + Clash title, description). Tablet: cards in two columns. Phones: swipe row kept (84% cards) plus a "01 / 08" counter and progress line. No Fraunces in this section any more. Copy in `content.ts` unchanged; sr-only "Instead of / With Viral Bee" kept.
- **Added (no effect elsewhere):** optional `wordClassName` prop on `common/RevealWords.tsx`; `.text-gold-ink` utility in `index.css` (gradient #A87200 → #7A5600, ≥3:1 on wax).
- **Checks:** `tsc` OK; no horizontal scroll at 1900/1440/768/390; equal card heights per row; sticky column holds mid-section and releases at the end.

## 2026-10-16: Footer links and layout tidied (owner request: "why there line below text … make professional")

- **Restore point:** `_backup/2026-10-16-footer/` (`src/components/Footer.tsx`, `src/index.css`, this log, before the change). To undo: copy `Footer.tsx` back.
- **Cause of the stray lines:** every footer link had `link-draw-gold`, a permanent underline at 35% width that only grew on hover; on phones the links were centred and wrapped, so the stubs sat at random spots.
- **Changed (`Footer.tsx` only):** no line at rest; on hover/keyboard focus the link turns white and a 1px gold underline draws in under every line. Everything left-aligned on all screens (phones and tablets: two link columns, then contact full width; laptop+: four columns as before). Column titles are small uppercase labels (white/55). Even 24px heading-to-list and 14px link gaps. Contact icons dimmed; "Book a strategy call" is now an outline pill. Bottom bar: copyright + privacy left, "We make brands visible." in Satoshi (was Fraunces) right. All links, text and the wordmark unchanged.
- **Not removed:** the `.link-draw-gold` CSS in `index.css` is now unused but left in place.
- **Checks:** `tsc` OK; no horizontal scroll at 1900/1440/768/390.

## 2026-10-16: "Less agency friction" (WhyChooseUs) step 3 — motion (owner approved "ok")

- **Restore point:** `_backup/2026-10-16-why-choose-us-motion/` (`WhyChooseUs.tsx`, `common/TiltCard.tsx`, `index.css` and this log, before the change). To undo: copy those three files back.
- **Changed:** `WhyChooseUs.tsx` — eyebrow and intro fade up; headline words rise from a mask; a gold light sweeps across "More results." once after it appears, then every 8 s. Cards tilt up into place (rotateX 12° → 0, 32 px, stagger 0.08 s, once); the strike line draws across the "usual" text (0.6 s). Laptop+: the card nearest the middle of the screen gets a soft gold edge glow (opacity only); hover tilts the card up to 4° with a soft gold shine, turns the hexagon 60° and slides the title 6 px; three large faint hexagon outlines drift behind the section at different scroll speeds (CSS/framer-motion, no WebGL). Section uses `overflow-clip` so the sticky column still works.
- **Phones:** no tilt, no glow, no hexagons; 16 px entrances only. **Reduced motion:** everything static and visible (checked).
- **Left out on purpose:** scroll-linked scale (0.96 → 1) made card text render blurry; scroll-linked dimming pushed the struck text under 4.5:1. Only the glow marks the card in focus.
- **Added (no effect elsewhere):** optional `glareColor` prop on `common/TiltCard.tsx` (default unchanged); `.text-gold-sweep` and `.drift-slow` in `index.css`, both off for reduced motion.
- **Checks:** `tsc` OK; no console errors; no horizontal scroll at 1440/390; sticky column holds mid-section and releases at the end.

## 2026-10-16: Step 4 — other sections, small fixes (owner approved "ok")

- **Restore point:** `_backup/2026-10-16-step4-other-sections/` (full `src/` before step 4).
- **Fonts:** serif (Fraunces) intro lines switched to Satoshi 500 in `common/SectionHeader.tsx` (Services, Work, Process previews on Home; WhyChooseUs; Industries; First month; Compare plans), `Faq.tsx`, `WorkPreview.tsx` (phone intro). `IndustriesStrip.tsx` industry names and `AboutStory.tsx` pull quote now Clash Display 500. Fraunces kept only for the gold italic accent words, the big About stat numbers, and the Packages cards (left untouched).
- **First month:** all four "Week" labels share one style (gold outline), so Week 1 no longer looks like a selected tab. **CTA:** WhatsApp outline border ink/30 → ink/50.

## 2026-10-16: Brand name Viral → Vyral, Instagram link, premium white, card numbers, centred buttons (owner request)

- **Restore points:** `_backup/2026-10-16-rename-vyral/` (`src/`, `index.html`, `public/logo.svg`, `public/og-image.png`, `design/og/og.html` before the rename) and `_backup/2026-10-16-premium-white/` (`src/` before the colour/number/button changes).
- **Rename:** "Viral Bee" → "Vyral Bee" (44 places: navbar/footer logo text, footer wordmark, page titles and descriptions, `index.html` SEO and structured data, WhatsApp greeting, aria labels, copy). `public/logo.svg` badge text VIRAL → VYRAL. `public/og-image.png` (link preview) re-rendered from `design/og/og.html`. Kept on purpose: the portfolio project title "Viral Lifestyle Brand Reel Series" (the word, not the brand) and internal build names in `vite.config.ts`.
- **Instagram:** `https://instagram.com/vyralbee` → `https://www.instagram.com/vyralbee/` (owner's link without the share-tracking `?vrfl=` part).
- **Premium white (no cream):** light sections `#FAFAFA` → `#FFFFFF`; inset surfaces `#F0F0EE` → cool `#F5F5F7`; body text `#F5F5F4` → `#F5F5F5`. Gold-on-white tints removed: WhyChooseUs hover shine and gold halo (now a neutral lift shadow + thin gold edge), gold backdrop hexagon (now ink), contact "email app opened" box (white with gold border), phone-country highlight (cool grey). Share image colours: cream text/warm black → white/#0B0B0C, gold → #F2A516.
- **Numbers:** 01–08 removed from the WhyChooseUs cards (the phone "01 / 08" position counter kept).
- **Buttons centred at the bottom:** WhyChooseUs "Start a conversation" (was in the left column on laptops); ProcessPreview "See the full process" (laptop pinned view; pin logic unchanged).
- **Checks:** `tsc` OK; production build OK (to a scratch folder; `dist/` untouched); no horizontal scroll at 1440/390; pinned process button centred and clear of the step list at 900 and 720 px tall.

## 2026-10-16: Step 5 — final check (owner approved "ok")

- **Fix:** phone counter "/ 08" in `WhyChooseUs.tsx` ink/45 → ink/60 (was 3.2:1 on white, now about 5.2:1). No other code changes.
- **Checked:** all 9 routes (incl. contact, privacy, 404) at 1900/1440/768/390 px: no horizontal scroll, no text past the screen edge, no console errors; page titles all "Vyral Bee". WhyChooseUs: 8× "Instead of" and 8× "With Vyral Bee" screen-reader text, h2 then eight h3s, all cards the same height, keyboard Tab goes heading → "Start a conversation" with the gold focus ring visible on white; reduced motion static and visible; `tsc` and production build OK.

## 2026-10-16: Remaining numbering removed (owner request: "yes … remove numbering from there and adjust")

- **Restore point:** `_backup/2026-10-16-remove-numbers/` (full `src/` and this log, before the change).
- **Services list (`ServicesOverview.tsx`):** 01–06 removed; laptop title now spans the freed column (7 of 12); phones: title beside the photo, description full width.
- **Process (`ProcessPreview.tsx`):** phone/tablet list "01–06" replaced by a small gold hexagon marker; pinned laptop view: big faint step number removed, title moved up, reserved height reduced (no empty gap); visible "Step x of 6" removed, kept as screen-reader-only live text (now also says the step name).
- **Work (`WorkPreview.tsx`):** "01 / 06" under each project and the pinned counter removed (filling progress line kept); the now-unused current-project state and props removed. **Work page (`WorkGallery.tsx`):** big faint number and "· 1 of 6" removed; category label leads each project.
- **WhyChooseUs phone counter:** "01 / 08" removed, progress line kept (slightly wider).
- **Not changed:** the phone menu's link numbers (01–07) in `Navbar.tsx` (not in the request).
- **Checks:** `tsc` OK; Home and Work at 1440 and 390 px: no horizontal scroll, no errors.

## 2026-10-16: Footer visual polish + cursor ring (owner request)

- **Restore point:** `_backup/2026-10-16-footer-polish/` (`Footer.tsx`, `FooterWordmark.tsx`, `common/CursorGlow.tsx`, this log, before the change). To undo: copy those files back.
- **Footer (`Footer.tsx`; content, links and 4-column layout unchanged):** amber gradient hairline on top instead of a flat border; two faint static amber glows (brand block, CTA side; the second laptop-only); static monochrome grain at 3.5% (no blend mode, no animation). Column headings get a small amber dot. Links: 44 px tall rows; hover/focus turns them amber, the underline draws in from the left and retracts, navigation links slide 6 px right. Social buttons: lift 3 px, amber fill and soft glow, dark glyph, icon 1.1×. "Book a strategy call": underline draws in, arrow moves 4 px up-right, soft amber glow. Logo: slight scale and brightness on hover. Email and phone: amber + underline (no slide); email/phone rows now have icons so all four contact rows align. Columns fade and rise 20 px in sequence (80 ms apart, once). Reduced motion: no movement, colour/underline only. Hover effects only on hover-capable devices.
- **Fix (`FooterWordmark.tsx`):** after the Vyral rename the big wordmark was 8 px too wide on phones and broke into "Vyral B / ee". Size 18.5vw → 17.6vw below 1536 px (big screens unchanged) and the letters set in one non-wrapping row; measured to fit from 360 to 1900 px.
- **Cursor ring (`common/CursorGlow.tsx`):** now neutral (ink ring, no gold glow) over light backgrounds, gold over dark. Note: this component is not mounted anywhere on the site, so visitors see no change; it only matters if the ring is switched on later.
- **Checks:** `tsc` and production build OK; footer at 1440/768/390: no horizontal scroll, all links ≥ 44 px tall, hover states measured (link 6 px slide + amber + full underline; social −3 px lift + amber fill + 1.1× icon; CTA arrow 4 px up-right + glow); reduced motion: no movement.

## 2026-10-16: Phone menu numbers removed; project published to GitHub (owner request)

- **Menu:** `Navbar.tsx` — the 01–07 numbers before each phone-menu link removed (current page still shown in gold); the decorative arrow is now hidden from screen readers. Restore point: `_backup/2026-10-16-menu-numbers/`.
- **GitHub:** new local repository in `digitalagency-main`, all project files committed ("first commit", 493 files; `node_modules`, `dist`, `_backup/` excluded by `.gitignore`; checked beforehand: no secrets, only `.env.example` with an empty placeholder), branch `main`, pushed to `https://github.com/Ashutoshkuma8271/viralbee.git` (the repository was empty, so nothing there was overwritten). The owner's pasted commands added only `README.md`; the whole project was added instead because the goal was to publish the site.

## 2026-10-16: Real logo on the site (owner request; also fixes the "VYRABEE" badge)

- **Restore point:** `_backup/2026-10-16-real-logo/` (`public/logo.svg`, `favicon.svg`, `favicon-48.png`, `apple-touch-icon.png`, `icon-512.png`, `og-image.png`, `src/components/Logo.tsx`, `design/og/og.html`, `index.html`, this log). To undo: copy them back.
- **Why "VYRABEE":** the old drawn badge placed its text for "VIRAL"; after the rename the wider "VYRAL" ran under the white "BEE", hiding the "L". Replaced entirely.
- **Source:** owner's logo saved as `design/brand/vyralbee-logo-original.jpg` (master copy). The VB bee mark (V, B, antennae, white wings) was lifted off its yellow background into `design/brand/vb-mark.png` (transparent, smooth edges; soft shadow kept).
- **New emblem** (`public/logo.svg`, `public/favicon.svg`, hi-res `design/brand/vyralbee-emblem-hires.svg`): the real mark on a disc in the site gold (#F2A516, lit gradient), thin inner ring as in the original, fine light rim and soft top highlight. The tiny in-circle wordmark and tagline are left out at icon sizes (unreadable at 16–48 px); the name stays beside the emblem. PNG icons re-rendered: `favicon-48.png`, `icon-512.png`, `apple-touch-icon.png` (on site black). `og-image.png` re-rendered.
- **`Logo.tsx`:** emblem gets a soft gold halo and, on hover (mouse, motion allowed), a light sweep across the disc.
- **Checks:** `tsc` and production build OK; logo loads in navbar and footer at 1440/390, no console errors.
