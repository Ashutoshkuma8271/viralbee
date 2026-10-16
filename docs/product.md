# Product

## What this is

The marketing website for **Viral Bee**, a digital marketing agency. It is a static single-page app (React + Vite) deployed on Vercel. There is no backend: enquiries go out by email link, WhatsApp link, or the contact form.

Spelling: the brand is **Viral Bee** (two words, "Viral" with an *i*). The domain and email in `src/constants/content.ts` still read `vyralbee.com` as placeholders until the owner supplies the real ones.

## Who it is for

Owners and marketing leads of small and mid-sized businesses (restaurants, retail, manufacturers, real estate, healthcare, education, professional services, startups) who want one team to handle social media, design, video, websites and ads instead of juggling freelancers.

## What the site must do

1. **Make a strong first impression.** The hero shows each service as a full-screen slide so a visitor sees the whole offer in the first few seconds.
2. **Explain the offer plainly.** Six services, a six-step monthly process, and what working together looks like.
3. **Get the enquiry.** Every page ends in a call to action. Primary action: *Get a free strategy call* (goes to `/contact`). Secondary: WhatsApp.
4. **Load fast on phones.** Most visitors arrive from social links on mobile data.

## Services (source of truth: `SERVICES` in `src/constants/content.ts`)

| Service | Hero image key |
|---|---|
| Social Media Management | `social` |
| Creative & Graphic Design | `design` |
| Reels & Video Content | `video` |
| Website Design & Development | `web` |
| Meta & Google Ads | `ads` |
| Digital Marketing & Lead Gen | `growth` |

## Pages

| Route | Purpose |
|---|---|
| `/` | Hero slider, services, about, industries, process, why us, CTA |
| `/about` | Agency story and principles |
| `/services` | Service cards and what each includes |
| `/process` | Six-step timeline and industries |
| `/work` | Portfolio (currently demo projects; see `tasks.md`) |
| `/packages` | Starter / Growth / Premium tiers |
| `/contact` | Enquiry form and contact details |

## Content that is still placeholder

Phone, WhatsApp number, email, social links, portfolio projects and their results, client logos, testimonials, and the team photo (stock). The full list of what the owner needs to supply is in `tasks.md`.
