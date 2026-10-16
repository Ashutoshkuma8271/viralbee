import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Logo } from './Logo.tsx';
import { FooterWordmark } from './FooterWordmark.tsx';
import { BRANDS } from './common/PlatformLogos.tsx';
import { BRAND, NAV_LINKS, SERVICES } from '../constants/content.ts';
import { EASE } from '../lib/motion.ts';

const SOCIALS = [
  { key: 'instagram', label: 'Instagram', href: BRAND.socials.instagram },
  { key: 'facebook', label: 'Facebook', href: BRAND.socials.facebook },
  { key: 'linkedin', label: 'LinkedIn', href: BRAND.socials.linkedin },
  { key: 'whatsapp', label: 'WhatsApp', href: BRAND.contact.whatsapp },
];

// The site's easing (lib/motion EASE) for every hover in the footer
const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

// Fine monochrome grain, static (no blend mode, no animation), so the black never looks flat
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Underline that draws in from the left (and retracts) in the link's current colour */
const drawLine = `bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1px] bg-[position:0_100%] pb-0.5 transition-[background-size,transform] duration-[350ms] ${ease}`;

interface FooterLinkProps {
  to?: string;
  href?: string;
  children: React.ReactNode;
  /** Brighter resting colour (email) */
  bright?: boolean;
  /** Slide right on hover (navigation links); contact links only change colour and underline */
  slide?: boolean;
  className?: string;
}

/**
 * Footer link: muted at rest; on hover or keyboard focus it turns amber, the underline draws in from the left and
 * (for navigation links) the text slides a few pixels right. At least 44px tall for touch.
 */
const FooterLink: React.FC<FooterLinkProps> = ({ to, href, children, bright, slide = true, className = '' }) => {
  const outer = `group/l inline-flex min-h-11 items-center font-sans text-[15px] font-medium leading-snug transition-colors duration-300 ${ease} hover:text-gold focus-visible:text-gold ${
    bright ? 'text-white' : 'text-white/75'
  } ${className}`;
  const inner = `inline-block ${drawLine} group-hover/l:bg-[length:100%_1px] group-focus-visible/l:bg-[length:100%_1px] ${
    slide ? 'motion-safe:group-hover/l:translate-x-1.5 motion-safe:group-focus-visible/l:translate-x-1.5' : ''
  }`;
  const content = <span className={inner}>{children}</span>;
  return to ? (
    <Link to={to} className={outer}>
      {content}
    </Link>
  ) : (
    <a href={href} className={outer}>
      {content}
    </a>
  );
};

/** Column heading: small uppercase label with a tiny amber dot */
const Heading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="flex items-center gap-2.5 font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55">
    <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
    {children}
  </h2>
);

/** Each column fades and rises 20px when the footer comes into view, one after another, once */
const Column: React.FC<{ index: number; className?: string; children: React.ReactNode }> = ({ index, className, children }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};

const contactRow = 'flex items-start gap-3';
const contactIcon = 'h-4 w-4 shrink-0 text-white/45';

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      {/* Atmosphere: amber hairline on top, two faint amber glows, fine grain */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(242,165,22,0.55)_50%,transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-48 -top-48 h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(242,165,22,0.10),transparent)] sm:-left-32 sm:-top-40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-40 top-24 hidden h-[460px] w-[460px] rounded-full bg-[radial-gradient(closest-side,rgba(242,165,22,0.07),transparent)] lg:block"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: GRAIN }} aria-hidden="true" />

      <div className="shell relative z-10 grid gap-12 pb-14 pt-16 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:pt-24">
        {/* Brand */}
        <Column index={0} className="flex flex-col items-start lg:col-span-4">
          <Link
            to="/"
            aria-label="Vyral Bee home"
            className={`inline-block origin-left transition-[transform,filter] duration-500 ${ease} hover:brightness-110 motion-safe:hover:scale-[1.03]`}
          >
            <Logo size="lg" />
          </Link>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-white/70 lg:max-w-xs">
            Social media, design, video, websites and ads, planned by one team so your brand gets seen and chosen.
          </p>
          <ul className="mt-8 flex gap-3">
            {SOCIALS.map(({ key, label, href }) => {
              const brand = BRANDS[key];
              return (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`group/s flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-[transform,background-color,border-color,box-shadow] duration-300 ${ease} hover:border-gold hover:bg-gold hover:shadow-[0_10px_28px_-8px_rgba(242,165,22,0.6)] focus-visible:border-gold focus-visible:bg-gold motion-safe:hover:-translate-y-[3px]`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className={`h-[18px] w-[18px] fill-white/70 transition-[fill,transform] duration-300 ${ease} group-hover/s:fill-ink group-focus-visible/s:fill-ink motion-safe:group-hover/s:scale-110`}
                      aria-hidden="true"
                    >
                      <path d={brand.path} />
                    </svg>
                  </a>
                </li>
              );
            })}
          </ul>
        </Column>

        {/* Link columns */}
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-x-8 gap-y-12 border-t border-white/10 pt-12 lg:col-span-8 lg:grid-cols-8 lg:border-t-0 lg:pl-8 lg:pt-0"
        >
          <Column index={1} className="lg:col-span-2">
            <Heading>Explore</Heading>
            <ul className="mt-4">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink to={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </Column>

          <Column index={2} className="lg:col-span-3">
            <Heading>Services</Heading>
            <ul className="mt-4">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <FooterLink to="/services">{service.title}</FooterLink>
                </li>
              ))}
            </ul>
          </Column>

          <Column index={3} className="col-span-2 lg:col-span-3">
            <Heading>Get in touch</Heading>
            <ul className="mt-4 text-[15px] leading-snug">
              <li className={contactRow}>
                <Mail className={`${contactIcon} mt-[14px]`} aria-hidden="true" />
                <FooterLink href={`mailto:${BRAND.contact.email}`} bright slide={false} className="break-all">
                  {BRAND.contact.email}
                </FooterLink>
              </li>
              <li className={contactRow}>
                <Phone className={`${contactIcon} mt-[14px]`} aria-hidden="true" />
                <FooterLink href={`tel:${BRAND.contact.phone.replace(/[^+\d]/g, '')}`} slide={false}>
                  {BRAND.contact.phone}
                </FooterLink>
              </li>
              <li className={`${contactRow} py-2.5 text-white/65`}>
                <Clock className={`${contactIcon} mt-[3px]`} aria-hidden="true" />
                {BRAND.contact.hours}
              </li>
              <li className={`${contactRow} py-2.5 text-white/65`}>
                <MapPin className={`${contactIcon} mt-[3px]`} aria-hidden="true" />
                <address className="not-italic leading-relaxed">
                  {BRAND.contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
            </ul>
            <Link
              to="/contact"
              className={`group/cta mt-7 inline-flex h-11 items-center gap-2 rounded-full border border-gold/40 px-5 text-[15px] font-semibold text-gold transition-[border-color,box-shadow] duration-300 ${ease} hover:border-gold hover:shadow-[0_0_34px_-6px_rgba(242,165,22,0.5)] focus-visible:border-gold focus-visible:shadow-[0_0_34px_-6px_rgba(242,165,22,0.5)]`}
            >
              <span className={`${drawLine} group-hover/cta:bg-[length:100%_1px] group-focus-visible/cta:bg-[length:100%_1px]`}>
                Book a strategy call
              </span>
              <ArrowUpRight
                className={`h-4 w-4 transition-transform duration-300 ${ease} motion-safe:group-hover/cta:-translate-y-1 motion-safe:group-hover/cta:translate-x-1 motion-safe:group-focus-visible/cta:-translate-y-1 motion-safe:group-focus-visible/cta:translate-x-1`}
                aria-hidden="true"
              />
            </Link>
          </Column>
        </nav>
      </div>

      {/* Sign-off: the brand name, edge to edge */}
      <FooterWordmark />

      {/* Bottom bar: copyright and privacy on the left, tagline on the right (stacked, left-aligned on phones) */}
      <div className="relative z-10 border-t border-white/10">
        <div className="shell flex flex-col items-start gap-3 py-7 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-white/75 sm:order-2">We make brands visible.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 sm:order-1">
            <p>© {new Date().getFullYear()} Vyral Bee. All rights reserved.</p>
            <Link
              to="/privacy"
              className={`group/p inline-flex min-h-11 items-center transition-colors duration-300 ${ease} hover:text-gold focus-visible:text-gold`}
            >
              <span className={`${drawLine} group-hover/p:bg-[length:100%_1px] group-focus-visible/p:bg-[length:100%_1px]`}>Privacy policy</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
