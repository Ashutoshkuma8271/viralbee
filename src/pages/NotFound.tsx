import React from 'react';
import { usePageMeta } from '../lib/usePageMeta.ts';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { NAV_LINKS } from '../constants/content.ts';

export const NotFound: React.FC = () => {
  usePageMeta({
    title: "Page not found | Vyral Bee",
    description: "This page could not be found. Head back to the Vyral Bee home page.",
    noindex: true,
  });

  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-ink py-20">
      {/* Faint honeycomb, same motif as the footer and the process timeline */}
      <svg
        className="pointer-events-none absolute -right-24 top-1/2 hidden h-[640px] -translate-y-1/2 text-gold opacity-[0.07] md:block"
        viewBox="0 0 300 330"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path id="nf" d="M50 5 93 30v50L50 105 7 80V30z" />
        <use href="#nf" x="86" /><use href="#nf" x="172" /><use href="#nf" x="43" y="75" /><use href="#nf" x="129" y="75" />
        <use href="#nf" x="215" y="75" /><use href="#nf" y="150" /><use href="#nf" x="86" y="150" /><use href="#nf" x="172" y="150" />
        <use href="#nf" x="43" y="225" /><use href="#nf" x="129" y="225" />
      </svg>

      <div className="shell relative z-10">
        <p className="font-display text-[clamp(6rem,22vw,16rem)] font-semibold leading-none text-gold">404</p>
        <h1 className="mt-4 max-w-[16ch] font-display text-fluid-h2 font-semibold text-white">
          This page has flown the hive.
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
          The link may be old or mistyped. Head back home, or jump straight to what you were looking for.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-gold px-8 text-base font-semibold text-ink transition-colors hover:bg-gold-light"
          >
            Back to home
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex h-14 items-center justify-center rounded-full border border-white/30 px-8 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
          >
            Contact us
          </Link>
        </div>

        <nav aria-label="Popular pages" className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/12 pt-8">
          {NAV_LINKS.filter((l) => l.href !== '/' && l.href !== '/contact').map((link) => (
            <Link key={link.href} to={link.href} className="text-[15px] text-white/70 transition-colors hover:text-gold">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default NotFound;
