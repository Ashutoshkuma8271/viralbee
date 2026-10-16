# Memory

Decisions and context that are not obvious from the code. Newest first. Add an entry when you make a choice someone might otherwise undo.

## 2026-10-16

- **Cinematic 3D layer added** (owner: "cinematic 3D animation in the hero and across the site, on scroll and hover"). Real WebGL honeycomb (three.js) in the hero, statement scene, process, CTA banner and inner-page headers; plus cursor ring, page-transition wipe, card tilt with shine, button glint. Full notes: `docs/cinematic-3d.md`. Reduced motion, Data Saver and no-WebGL keep the previous photo design; phones get a lite scene.
- **Keep three.js out of the main bundle:** only `SceneHost.tsx` is imported by pages (it holds no three.js); `SceneCanvas.tsx` is loaded with `React.lazy`. Importing `@react-three/fiber` anywhere else would pull about 290 kB gzip into the first load.
- **Glow on a transparent canvas works** (premultiplied alpha adds the bloom as light over the photo). Do not switch the canvas to a solid background.
- **Shell pitfall:** never run `pkill -f "<words that appear in your own command>"`; it kills the shell running it. Use a PID.

## 2026-10-15

- **Scope discipline:** when the owner asks to improve the *text* on a card, change only the text area. A first pass also changed the card shell (shadow, lift, radius, overlay) and the owner rejected it. Home service cards: original card shell; text sits centred on a frosted panel (gold pill badge, title, short gold rule, description).

- **SEO audit done** (see `docs/architecture.md` "SEO"). Never hardcode the domain again: use `SITE_URL` / `__SITE_URL__` / `%SITE_URL%`. Structured data must stay facts-only: no fake address, ratings or placeholder social links.

- **Test narrow widths with a mouse too, not only touch.** The owner checks phone layouts by narrowing a laptop browser, where hover-only effects stay on. `Magnetic` added an `inline-flex` wrapper that stopped the hero's gold button stretching, so the two hero buttons had different widths. `Magnetic` now takes a `className`; full-width buttons pass `flex w-full sm:w-auto` and the link gets `w-full`.
- **Industry tiles and why-us points are centred on phones** (left-aligned from `sm` / `md` where they sit in columns).

- **Third review pass (owner's "analyse first, add only what is missing")**: almost everything in the brief already existed. Added only: hero buttons rise in just after the instant text; three motion tiers (`useTravel`: phone 16px, tablet 24px, desktop 32px); `ImageReveal` is a plain fade on phones (clip-path wipe from 768px). Tested `content-visibility: auto` on home sections: gain was within noise (mobile 78-82 vs 79-82) and it risks scrollbar jumps with Lenis, so it was reverted. Do not re-add it without a clear measured win.

- **Measure before and after, and repeat:** Lighthouse's first run after starting a server is a cold-start outlier (about 45 on mobile); judge on the 2nd and 3rd runs. A JavaScript `requestAnimationFrame` ticker looked like a regression on a throttled phone, so touch devices use the CSS ticker and only hover-pointer devices use the velocity one.
- **Effects catalogue was reviewed** (82 items); only those that fit were added. See the table in `docs/design.md`.

- **Process steps are centred on phones** (home preview and the Process page timeline): hexagon, title and description stacked and centred below 640px. The timeline's connecting line is hidden on phones because a centred line would run through the text; the hexagons still light gold on scroll. From 640px up it is the original left-aligned layout.

- **Motion system added** (see `docs/design.md` "Motion system"). Owner's brief: analyse first, keep what works, animate only where it helps. Fonts were reviewed and kept (Clash Display, Satoshi, Fraunces); no new fonts. Audit tool: `scratchpad/tools/stuck.mjs` scrolls every page and reports any element left invisible (must be 0) plus sideways overflow (must be 0).
- **Pitfall found:** in a Python `re.sub` replacement a `'\1'` inside a normal string can become a control character; use raw strings or lambdas and grep for `` after scripted edits.

## 2026-10-14

- **No "Back to top" button** (owner removed it). Footer bottom bar: tagline and copyright only.
- **`SectionHeader` has no button.** Below 1024px it is heading then intro, centred; from 1024px the heading is left and the serif intro right, vertically centred so they share one horizontal line. A section's button is placed by the section itself, centred under its content (`mt-14 flex justify-center`), never inside the header. Use `prettier --single-quote --print-width 120` if reformatting (the project uses single quotes).

- **Home "why us" is a simple 2-column list**, not a two-panel comparison (the panel layout had huge gaps and read as messy). Each item: the usual problem struck through in serif italic, then the answer and its description. The `usual` lines in `content.ts` are written by the assistant for the owner to confirm.
- **Industries are eight equal tiles** (4 columns on desktop, 2 on tablet, 1 on phone), no hover-only content.

- **Footer is centred below 1024px and three-part above it** (copyright + privacy | tagline | back to top, in a 3-column grid so the arrow can never overlap text). Link columns are two-up on phones and tablets.
- **Centre on small screens:** headings, buttons and CTA boxes are centred below `md`/`lg`; lists and checklists stay left-aligned for readability. `FilterRail` pills start at the left edge so the row can be swiped.
- **Packages intro** keeps its exact words ("Not sure which to choose? ...") but is set as a serif statement with three growing hexagons, matching the plan-level hexagons on the cards.
- **Fonts:** all fonts are self-hosted. Google Fonts can be added the same way (npm `@fontsource/<name>` or `@fontsource-variable/<name>`): ask the owner for the font name.

- **Never put a `position: fixed` panel inside an element with `backdrop-filter`/`transform`:** it is sized to that element, not the screen. The mobile menu is rendered next to `<header>`, not inside it (this caused a broken mobile menu).
- **No breadcrumbs.** Owner asked to remove the "Home / Page" line from every page; do not bring it back.
- **Packages cards say "Everything in <previous plan>, plus ..."** and are computed from `PRICING_PACKAGES`, with one plain-English line per feature (`PLAIN` map in `PackageTiers.tsx`). Add a line to `PLAIN` when adding a feature. Level is shown with 1 to 3 filled hexagons.
- **Portrait (phone) crops need their own focal point**: landscape-to-portrait crops can cut off the subject; always check the 900/1400 files visually.

- **No duplicate photos (owner rule).** Inner-page headers use their own photos in `/images/pages`, not the home hero set. Home service cards and the Services page rows share `/images/services` (same service, different pages); everything else is unique. Unsplash search is blocked for automated browsers (bot protection), so photos were chosen from direct image-CDN IDs; do not try to bypass the protection.
- **Header text sits low on small screens** so the photo is visible above it (`justify-end` + large top padding below `lg`).

- **Measured, not guessed:** font preloads were the biggest mobile slowdown (mobile score 55 to 82 after removing them). Splitting the home page into a lazy chunk gave no gain and was reverted. Re-measure with Lighthouse before adding any performance trick.
- **Privacy page is a draft** with bracketed owner items; do not remove the "[Owner: ...]" notes until the owner supplies the real details.
- **Contrast floor:** body text on dark is at least `text-white/60`, on cream at least `text-ink/65`; `gold-dark` is `#7A5600` so gold text on cream passes 4.5:1.

- **Section images must match their content.** Work cards: Café = café sign, Reels = video-editing timeline, Ads = analytics laptop, Websites = skyscrapers, Branding = architecture, Fitness = barbell. Check this whenever a photo is swapped.
- **Text alignment and overlay switch together at `lg`:** centred text with a vertical scrim below 1024px, left-aligned text with a left-to-right scrim from 1024px. Never mix them (centred text on a left scrim looked unreadable at 768px).
- **`FilterRail` must be `relative`**: its scroll-into-view uses `offsetLeft`, which is measured from the nearest positioned ancestor.

- **Photos must stay visible.** Owner said the hero/header photos looked too dark and washed out. Rule: use bright, sharp subject photos (no near-black stock), and one shared scrim (`.scrim-hero`) that is strong only behind the text and nearly clear on the photo side; phones get a stronger vertical scrim. Do not stack extra dark overlays on photos. Hero images were replaced with brighter ones; the old set is backed up in `_backup/2026-10-14-hero-images/`.
- **Hero images:** `social` phone with app folder, `design` graphics tablet and swatches, `video` clapperboard, `web` monitor with app designs, `ads` laptop analytics, `growth` team at a whiteboard. All Unsplash (free licence), stored locally in 6 sizes each.

- **Contact form must never fake success.** The old form waited 0.9s and showed "sent" without sending anything. `ContactPanel` posts to `VITE_FORM_ENDPOINT` when set, otherwise opens a pre-filled email/WhatsApp message and says so.
- **Work page shows no results/metrics.** The numbers in `PORTFOLIO_ITEMS.stats` were invented demo values; they are kept in data but not displayed. Cards say "Concept project".
- **Pill rows slide or swipe, never wrap:** `PillMarquee` (page headers) and `FilterRail` (Work filters).
- **Home = teasers, inner pages = full content.** About facts + 6-step overview live on Home; the About story, the scroll timeline and first-month plan live on their own pages. Do not repeat a section on two pages.
- **Disk space:** the screenshot script once filled the C: drive with temp browser profiles; it now reuses one profile folder. Deleted 61 temp folders with approval (`audit-log.md`).

- **No generic icon badges or decorative numbering.** Owner rejected icons in gold circles and "01 / PHASE 01" style numbers as AI-looking. Use real things instead: official platform logos (`PlatformLogos`, from simple-icons; LinkedIn path is hand-defined because simple-icons dropped it), hexagon markers for sequences, plain check/cross glyphs in comparisons.
- **Service cards are equal size** (owner disliked the mixed-width bento).
- **Hero uses `min-h-svh`, not a fixed height**, and the headline size also scales with viewport height, so the gold ticker is never clipped on short laptop screens (1366×768).

- **Brand spelling is "Viral Bee".** Confirmed by the owner. `vyralbee.com` in links/email is a placeholder, not the spelling.
- **Hero shows one slide per service** (owner's request) with no numbers, no pause button and no slide indicators (owner asked to remove them). Autoplay still pauses on hover/focus, hidden tab, or when scrolled away; swipe works on touch.
- **The gold ticker under the hero is intentional**, modelled on akirafresh.com at the owner's request. It reuses on every inner page via `PageHeader`.
- **Images must look HD/4K.** Hero photos ship up to 3840px wide but through `srcset`, so phones download ~60–240 KB portrait crops. Do not replace `srcset` with a single large `src`.
- **Crossfade without dark dip:** outgoing hero photo stays at full opacity under the incoming one. Fading both at once caused the "glitch" the owner noticed.
- **No fade-up on every section.** `Reveal` is now a plain wrapper on purpose (scattered entrance animations read as generated). Motion lives in the hero, parallax, count-up, process line, and Lenis.
- **Footer has no closing headline** because it duplicated the gold CTA panel right above it.
- **Fonts:** Clash Display + Satoshi from Fontshare (free for commercial use under the ITF Free Font License), self-hosted in `public/fonts`. Earlier fonts (Bricolage, Inter Tight, Instrument Serif) were dropped.
- **Stock photos** are free Unsplash images without third-party brand logos (a Netflix and a Starbucks photo were rejected for that reason). Replace with the owner's real work when available.
- **Stats on About are factual descriptions** ("6 services", "8+ industries"), not invented performance numbers.
- **Vite cache lives outside OneDrive** (`cacheDir` in `vite.config.ts`) because OneDrive file locks caused `EPERM` on `npm run dev`.
- **Safety backups** go in `_backup/<date>/` (git-ignored); every approved destructive change is logged in `audit-log.md`.
# Memory

Decisions and context that are not obvious from the code. Newest first. Add an entry when you make a choice someone might otherwise undo.

## 2026-10-14

- **No "Back to top" button** (owner removed it). Footer bottom bar: tagline and copyright only.
- **`SectionHeader` is centred below 1024px and split from 1024px up** (heading left; serif intro and button together at the right edge, centred under each other) so laptop screens use the full width instead of a narrow centred column with empty gutters. All sections that use it follow this; do not special-case one section.

- **Home "why us" is a simple 2-column list**, not a two-panel comparison (the panel layout had huge gaps and read as messy). Each item: the usual problem struck through in serif italic, then the answer and its description. The `usual` lines in `content.ts` are written by the assistant for the owner to confirm.
- **Industries are eight equal tiles** (4 columns on desktop, 2 on tablet, 1 on phone), no hover-only content.

- **Footer is centred below 1024px and three-part above it** (copyright + privacy | tagline | back to top, in a 3-column grid so the arrow can never overlap text). Link columns are two-up on phones and tablets.
- **Centre on small screens:** headings, buttons and CTA boxes are centred below `md`/`lg`; lists and checklists stay left-aligned for readability. `FilterRail` pills start at the left edge so the row can be swiped.
- **Packages intro** keeps its exact words ("Not sure which to choose? ...") but is set as a serif statement with three growing hexagons, matching the plan-level hexagons on the cards.
- **Fonts:** all fonts are self-hosted. Google Fonts can be added the same way (npm `@fontsource/<name>` or `@fontsource-variable/<name>`): ask the owner for the font name.

- **Never put a `position: fixed` panel inside an element with `backdrop-filter`/`transform`:** it is sized to that element, not the screen. The mobile menu is rendered next to `<header>`, not inside it (this caused a broken mobile menu).
- **No breadcrumbs.** Owner asked to remove the "Home / Page" line from every page; do not bring it back.
- **Packages cards say "Everything in <previous plan>, plus ..."** and are computed from `PRICING_PACKAGES`, with one plain-English line per feature (`PLAIN` map in `PackageTiers.tsx`). Add a line to `PLAIN` when adding a feature. Level is shown with 1 to 3 filled hexagons.
- **Portrait (phone) crops need their own focal point**: landscape-to-portrait crops can cut off the subject; always check the 900/1400 files visually.

- **No duplicate photos (owner rule).** Inner-page headers use their own photos in `/images/pages`, not the home hero set. Home service cards and the Services page rows share `/images/services` (same service, different pages); everything else is unique. Unsplash search is blocked for automated browsers (bot protection), so photos were chosen from direct image-CDN IDs; do not try to bypass the protection.
- **Header text sits low on small screens** so the photo is visible above it (`justify-end` + large top padding below `lg`).

- **Measured, not guessed:** font preloads were the biggest mobile slowdown (mobile score 55 to 82 after removing them). Splitting the home page into a lazy chunk gave no gain and was reverted. Re-measure with Lighthouse before adding any performance trick.
- **Privacy page is a draft** with bracketed owner items; do not remove the "[Owner: ...]" notes until the owner supplies the real details.
- **Contrast floor:** body text on dark is at least `text-white/60`, on cream at least `text-ink/65`; `gold-dark` is `#7A5600` so gold text on cream passes 4.5:1.

- **Section images must match their content.** Work cards: Café = café sign, Reels = video-editing timeline, Ads = analytics laptop, Websites = skyscrapers, Branding = architecture, Fitness = barbell. Check this whenever a photo is swapped.
- **Text alignment and overlay switch together at `lg`:** centred text with a vertical scrim below 1024px, left-aligned text with a left-to-right scrim from 1024px. Never mix them (centred text on a left scrim looked unreadable at 768px).
- **`FilterRail` must be `relative`**: its scroll-into-view uses `offsetLeft`, which is measured from the nearest positioned ancestor.

- **Photos must stay visible.** Owner said the hero/header photos looked too dark and washed out. Rule: use bright, sharp subject photos (no near-black stock), and one shared scrim (`.scrim-hero`) that is strong only behind the text and nearly clear on the photo side; phones get a stronger vertical scrim. Do not stack extra dark overlays on photos. Hero images were replaced with brighter ones; the old set is backed up in `_backup/2026-10-14-hero-images/`.
- **Hero images:** `social` phone with app folder, `design` graphics tablet and swatches, `video` clapperboard, `web` monitor with app designs, `ads` laptop analytics, `growth` team at a whiteboard. All Unsplash (free licence), stored locally in 6 sizes each.

- **Contact form must never fake success.** The old form waited 0.9s and showed "sent" without sending anything. `ContactPanel` posts to `VITE_FORM_ENDPOINT` when set, otherwise opens a pre-filled email/WhatsApp message and says so.
- **Work page shows no results/metrics.** The numbers in `PORTFOLIO_ITEMS.stats` were invented demo values; they are kept in data but not displayed. Cards say "Concept project".
- **Pill rows slide or swipe, never wrap:** `PillMarquee` (page headers) and `FilterRail` (Work filters).
- **Home = teasers, inner pages = full content.** About facts + 6-step overview live on Home; the About story, the scroll timeline and first-month plan live on their own pages. Do not repeat a section on two pages.
- **Disk space:** the screenshot script once filled the C: drive with temp browser profiles; it now reuses one profile folder. Deleted 61 temp folders with approval (`audit-log.md`).

- **No generic icon badges or decorative numbering.** Owner rejected icons in gold circles and "01 / PHASE 01" style numbers as AI-looking. Use real things instead: official platform logos (`PlatformLogos`, from simple-icons; LinkedIn path is hand-defined because simple-icons dropped it), hexagon markers for sequences, plain check/cross glyphs in comparisons.
- **Service cards are equal size** (owner disliked the mixed-width bento).
- **Hero uses `min-h-svh`, not a fixed height**, and the headline size also scales with viewport height, so the gold ticker is never clipped on short laptop screens (1366×768).

- **Brand spelling is "Viral Bee".** Confirmed by the owner. `vyralbee.com` in links/email is a placeholder, not the spelling.
- **Hero shows one slide per service** (owner's request) with no numbers, no pause button and no slide indicators (owner asked to remove them). Autoplay still pauses on hover/focus, hidden tab, or when scrolled away; swipe works on touch.
- **The gold ticker under the hero is intentional**, modelled on akirafresh.com at the owner's request. It reuses on every inner page via `PageHeader`.
- **Images must look HD/4K.** Hero photos ship up to 3840px wide but through `srcset`, so phones download ~60–240 KB portrait crops. Do not replace `srcset` with a single large `src`.
- **Crossfade without dark dip:** outgoing hero photo stays at full opacity under the incoming one. Fading both at once caused the "glitch" the owner noticed.
- **No fade-up on every section.** `Reveal` is now a plain wrapper on purpose (scattered entrance animations read as generated). Motion lives in the hero, parallax, count-up, process line, and Lenis.
- **Footer has no closing headline** because it duplicated the gold CTA panel right above it.
- **Fonts:** Clash Display + Satoshi from Fontshare (free for commercial use under the ITF Free Font License), self-hosted in `public/fonts`. Earlier fonts (Bricolage, Inter Tight, Instrument Serif) were dropped.
- **Stock photos** are free Unsplash images without third-party brand logos (a Netflix and a Starbucks photo were rejected for that reason). Replace with the owner's real work when available.
- **Stats on About are factual descriptions** ("6 services", "8+ industries"), not invented performance numbers.
- **Vite cache lives outside OneDrive** (`cacheDir` in `vite.config.ts`) because OneDrive file locks caused `EPERM` on `npm run dev`.
- **Safety backups** go in `_backup/<date>/` (git-ignored); every approved destructive change is logged in `audit-log.md`.
