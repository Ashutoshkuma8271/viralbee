# Tasks

Status as of 2026-10-14. Update this file as work lands.

## Done

- [x] Cinematic 3D hero and site-wide 3D motion (2026-10-16; see `docs/cinematic-3d.md`)
- [x] Dev server EPERM fix (Vite cache moved out of OneDrive via `cacheDir`)
- [x] Design system: honey palette, Clash Display + Satoshi (self-hosted), `.shell` container
- [x] Navbar: full width, larger logo and links, gold "Let's talk"
- [x] Hero: service slider, 4K responsive images, smooth crossfade, word-reveal headline, gold ticker, parallax
- [x] Home sections: bento services, about with count-up, industries list, scroll-linked process timeline, why-us grid, gold CTA, footer wordmark
- [x] Services page: page header, service cards, four detail rows
- [x] Lenis smooth scrolling
- [x] Removed unused 3D hero and font packages (approved; see `audit-log.md`)
- [x] Brand spelling changed to "Viral Bee" (text, metadata, logo artwork)
- [x] Project docs (`docs/`)

## Next (in order)

- [x] Social share image (`public/og-image.png`, 1200×630; source in `design/og/`)
- [x] About page (page header, story, first-month onboarding, principles; owner to confirm the first-month steps)
- [x] Home responsive pass (2026-10-14): hero never clips the ticker (min-height + height-aware headline), equal service cards with official platform logos, About stats no-wrap, numberless hexagon process markers, "usual way vs Viral Bee" comparison
- [x] Process page rebuilt (header, scroll timeline, first month); Services page rebuilt (6 services with what's included); About page rebuilt (story + pillars); duplicates between Home/About/Services/Process removed
- [x] Visual re-check at 1920 and 390px done for Home, About, Process, Services, Work, Packages, Contact
- [x] Brighter hero/header photos and lighter scrim (desktop and phone checked)
- [x] 768px and 1366px checked on every page (no horizontal scroll); 404 page redesigned; fixed: hero overlay at tablet width, Work filter row position, CTA button wrapping, Reels photo
- [x] Freed disk space: 61 temp `cdp-*` folders deleted with approval (see `audit-log.md`)
- [x] Work page rebuilt: local images, filter row, every card labelled "Concept project", no invented results shown
- [x] Packages page rebuilt: three tiers from original data, "Custom quote" until prices are confirmed
- [x] Contact page rebuilt: validation, honeypot, honest status messages, WhatsApp. Sends only when `VITE_FORM_ENDPOINT` is set (see `.env.example`); otherwise opens a pre-filled email
- [x] Contact form: country-code phone picker for every country (`PhoneField.tsx`, `libphonenumber-js`, flags in `public/flags/`, MIT) and optional website field
- [ ] Final pass: accessibility audit, Lighthouse, mobile at 390px for every page

## Mobile and packages fixes (2026-10-14)

- [x] Mobile menu fixed (was squashed into the 80px header); breadcrumbs removed; Packages banner replaced and cropped for phones
- [x] Packages page redesigned (plain-language "everything in X, plus", level hexagons, how-to-start strip); Services rows centred on phones

## Photos (2026-10-14)

- [x] Unique header photos for About, Services, Process, Packages, Work, Contact (not from the hero); six new service photos; verified no repeats per page
- [ ] Owner approval needed to delete 6 now-unused files: `public/images/hero/{social,design,video,web,ads,growth}-card.webp`
- [ ] Replace stock photos with the owner's real team, office and work when available

## Added in the final audit (2026-10-14)

- [x] Per-page titles, descriptions, canonical and social tags (`usePageMeta`); 404 is `noindex`
- [x] `robots.txt`, `sitemap.xml` (domain is a placeholder), skip-to-content link, `<main>` landmark
- [x] Draft privacy page at `/privacy`, linked from the footer (owner/lawyer must review before launch)
- [x] Home gets a "work" preview section; page loader redesigned
- [x] Lighthouse (production build): home mobile 82 / desktop 94; contact mobile 75 / desktop 97; services mobile 76 / desktop 98; accessibility, best practices and SEO 100 everywhere tested
- [ ] Re-run Lighthouse after real photos and any analytics are added, and on the live domain
- [ ] Social share preview (WhatsApp/LinkedIn) only reads `index.html`, so it shows the home-page image on every page; per-page previews need pre-rendering

## SEO (2026-10-15)

- [x] Audit: every route has one H1, no heading skips, alt text everywhere, no broken internal links, unique titles and descriptions
- [x] One `SITE_URL` setting drives canonical, Open Graph, JSON-LD, robots.txt and sitemap.xml (generated at build with lastmod)
- [x] Static `<head>` matches the home page; titles shortened to <= 60 characters; Twitter tags use `name=`; obsolete `keywords` / `meta title` removed
- [x] Organization + WebSite JSON-LD; PNG favicon, Apple touch icon, 512px logo
- [x] `trailingSlash: false` on Vercel
- [ ] **Set the real domain** in `SITE_URL` before launch (currently `https://vyralbee.com`, a placeholder)
- [ ] Owner decision: prerender pages (per-page link previews, faster first paint — would lift phone LCP from ~4 s; the site is client-rendered, so nothing shows until JavaScript runs) and real 404 status for unknown URLs
- [ ] Owner review: FAQ answers in `src/constants/faqs.ts` (written only from facts already on the site; add prices, contract terms or timings once confirmed)
- [ ] After launch: verify the domain in Google Search Console, submit `/sitemap.xml`, check Rich Results Test and PageSpeed Insights field data
- [ ] Optional: deep-link home service cards to `/services#<service>` (needs a small scroll-to-hash fix)

## Needed from the owner before launch

- [ ] Real phone number, WhatsApp number, email address
- [ ] Domain (is it `viralbee.com`, `vyralbee.com`, or another?)
- [ ] Instagram, Facebook, LinkedIn URLs (and any others)
- [ ] Client logos (SVG or high-res PNG) and permission to show them
- [ ] 3–6 testimonials: quote, name, role, company (and photo if possible)
- [ ] Real portfolio projects: images, short description, results you can stand behind
- [ ] Team photo(s) to replace the stock image in About
- [ ] Office address or service area, business hours
- [ ] Package prices (or confirm "price on request")
- [ ] Confirm the platforms/tools shown on each service card (e.g. Figma, Google Analytics, Search Console) and the "usual way" comparison lines
- [ ] Where contact-form submissions should go (email address or a form service such as Formspree/Web3Forms)
- [ ] Privacy policy text (required if the form collects personal data)
- [ ] Final logo files if `public/logo.svg` is not the latest version
