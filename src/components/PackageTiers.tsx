import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { PRICING_PACKAGES } from '../constants/content.ts';
import { Reveal } from './common/Reveal.tsx';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, VIEWPORT } from '../lib/motion.ts';
import { TiltCard } from './common/TiltCard.tsx';
import { Scene3D } from './common/Scene3D.tsx';

// One plain-English line per item, so anyone can see what they are getting.
export const PLAIN: Record<string, string> = {
  'Social Media Management': 'We run your accounts day to day.',
  'Static Posts': 'Designed image and carousel posts.',
  'Content Strategy': 'A plan for what to post, and why.',
  'Reels Production': 'Short videos made to reach new people.',
  'Ads Management': 'We run and improve your Meta and Google ads.',
  Website: 'A modern business website, built for you.',
  'Monthly Reporting': 'A clear report on what worked.',
};

// Facts already stated elsewhere on the site, shown as quick reassurance under the intro
const ASSURANCES = ['Priced to your budget', 'Move up any time', 'Reply within one working day'];

const STEPS = [
  { title: 'Book a free call', text: 'Tell us about your business and goals.' },
  { title: 'Get a plan and quote', text: 'We recommend a package and price it to your budget.' },
  { title: 'Approve and start', text: 'Say yes when you are happy, and we get going.' },
];

const Hexagon: React.FC<{ filled: boolean; dark: boolean }> = ({ filled, dark }) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
    <path
      d="M12 2 20.66 7v10L12 22l-8.66-5V7z"
      className={
        filled
          ? dark
            ? 'fill-ink stroke-ink'
            : 'fill-gold stroke-gold'
          : dark
            ? 'fill-transparent stroke-ink/35'
            : 'fill-transparent stroke-white/30'
      }
      strokeWidth="1.5"
    />
  </svg>
);

/**
 * Packages page. The three plans build on each other, so each card shows "everything in the plan below, plus ..."
 * and only the new items, each with a plain-English line. No prices are shown until the owner confirms them.
 */
export const PackageTiers: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const included = PRICING_PACKAGES.map((pkg) => pkg.features.filter((f) => f.included === true).map((f) => f.name));

  return (
    <section id="plans" className="relative bg-ink py-20 sm:py-28">
      <div className="shell">
        {/* Intro: the growing hexagons echo the plan levels on the cards below */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="flex items-end justify-center gap-2.5" aria-hidden="true">
            {[28, 40, 56].map((size, i) => (
              <svg key={size} viewBox="0 0 24 24" style={{ width: size, height: size }}>
                <motion.path
                  d="M12 2 20.66 7v10L12 22l-8.66-5V7z"
                  fill="#F2A516"
                  stroke="#F2A516"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                  initial={reduceMotion ? false : { pathLength: 0, fillOpacity: 0, strokeOpacity: 0.7 }}
                  whileInView={{ pathLength: 1, fillOpacity: [0, 0.4, 1][i], strokeOpacity: [0.6, 0.7, 1][i] }}
                  viewport={VIEWPORT}
                  transition={{ duration: 1.3, delay: 0.2 + i * 0.25, ease: EASE }}
                />
              </svg>
            ))}
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-gold">Plans & packages</p>
          <h2 className="mt-4 text-balance font-display text-fluid-h2 font-semibold text-white">
            Not sure which <span className="font-serif-display font-normal italic text-gold">to choose?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            Start where you are. Every plan builds on the one before it, so you can move up any time.
          </p>
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-white/70">
            {ASSURANCES.map((text, i) => (
              <li key={text} className="flex items-center gap-5">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-gold" aria-hidden="true" />}
                {text}
              </li>
            ))}
          </ul>
        </Reveal>

        <Scene3D>
          <ul className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-3 lg:items-stretch lg:gap-5 xl:gap-7">
            {PRICING_PACKAGES.map((pkg, tier) => {
              const featured = pkg.popular;
              const previous = tier > 0 ? included[tier - 1] : [];
              const added = included[tier].filter((name) => !previous.includes(name));
              const addOns = pkg.features.filter((f) => f.included === 'Add-on').map((f) => f.name);
              const text = featured ? 'text-ink' : 'text-white';
              const muted = featured ? 'text-ink/75' : 'text-white/70';

              return (
                <Reveal as="li" delay={tier * 0.1} key={pkg.name}>
                  <TiltCard className="h-full" radius="rounded-[28px]" max={4}>
                  <article
                    className={`relative flex h-full flex-col rounded-[28px] p-7 transition-colors duration-300 sm:p-9 ${
                      featured
                        ? 'border border-gold bg-gold text-ink'
                        : 'border border-white/10 bg-dark-card text-white hover:border-white/25'
                    }`}
                  >
                    {/* Level: more filled hexagons = more included */}
                    <div className="flex items-center justify-between gap-4">
                      <div
                        className="flex gap-1"
                        role="img"
                        aria-label={`Plan level ${tier + 1} of ${PRICING_PACKAGES.length}`}
                      >
                        {PRICING_PACKAGES.map((_, i) => (
                          <Hexagon key={i} filled={i <= tier} dark={featured} />
                        ))}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${
                          featured ? 'bg-ink text-gold' : 'bg-white/10 text-white/75'
                        }`}
                      >
                        {pkg.badge}
                      </span>
                    </div>

                    <h2 className={`mt-6 text-center font-display text-4xl font-semibold ${text}`}>{pkg.name}</h2>
                    <p
                      className={`mx-auto mt-2 max-w-[34ch] text-balance text-center text-base leading-relaxed lg:min-h-[3.25rem] ${muted}`}
                    >
                      {pkg.tagline}
                    </p>

                    {/* What this plan is best for */}
                    <p
                      className={`mt-6 rounded-2xl px-4 py-3 font-serif-display text-[17px] italic leading-snug ${
                        featured ? 'bg-ink/[0.07] text-ink/85' : 'bg-white/[0.04] text-white/75'
                      }`}
                    >
                      {pkg.highlight}
                    </p>

                    <div className={`mt-7 border-t pt-6 ${featured ? 'border-ink/15' : 'border-white/10'}`}>
                      <p
                        className={`text-xs font-semibold uppercase tracking-[0.14em] ${featured ? 'text-ink/75' : 'text-gold'}`}
                      >
                        {tier === 0 ? "What's included" : `Everything in ${PRICING_PACKAGES[tier - 1].name}, plus`}
                      </p>

                      <ul className="mt-5 space-y-5">
                        {added.map((name) => (
                          <li key={name} className="flex items-start gap-3.5">
                            <motion.span
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                                featured ? 'bg-ink text-gold' : 'bg-gold text-ink'
                              }`}
                            >
                              <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                            </motion.span>
                            <span>
                              <span className={`block font-sans text-base font-semibold ${text}`}>{name}</span>
                              <span className={`mt-0.5 block font-sans text-base leading-snug ${muted}`}>{PLAIN[name]}</span>
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Earlier plans' items as compact tags instead of a long sentence */}
                      {tier > 0 && (
                        <div className="mt-7">
                          <p className={`font-sans text-sm font-semibold ${featured ? 'text-ink/75' : 'text-white/70'}`}>
                            Already included from {PRICING_PACKAGES[tier - 1].name}
                          </p>
                          <ul className="mt-3 flex flex-wrap gap-2">
                            {previous.map((name) => (
                              <li
                                key={name}
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-[13px] font-medium ${
                                  featured ? 'bg-ink/[0.08] text-ink/80' : 'bg-white/[0.06] text-white/70'
                                }`}
                              >
                                <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                                {name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {addOns.length > 0 && (
                        <p
                          className={`mt-6 flex items-start gap-2.5 rounded-2xl border border-dashed px-4 py-3 font-sans text-base leading-snug ${featured ? 'border-ink/25 text-ink/80' : 'border-white/15 text-white/70'}`}
                        >
                          <Plus className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                          <span>{addOns.join(', ')} can be added to this plan.</span>
                        </p>
                      )}
                    </div>

                    <div className="mt-auto pt-9">
                      <div className={`border-t pt-6 ${featured ? 'border-ink/15' : 'border-white/10'}`}>
                        <p className={`font-serif-display text-3xl ${text}`}>Custom quote</p>
                        <p className={`mt-1 font-sans text-sm ${muted}`}>Priced to your goals and budget.</p>
                      </div>
                      <Link
                        to={`/contact?package=${encodeURIComponent(pkg.name)}`}
                        className={`btn-glint group/btn mt-5 inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full px-8 font-sans text-base font-semibold transition-colors ${
                          featured ? 'bg-ink text-white hover:bg-black' : 'bg-gold text-ink hover:bg-gold-light'
                        }`}
                      >
                        Get a quote for {pkg.name}
                        <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-0.5" />
                      </Link>
                    </div>
                  </article>
                  </TiltCard>
                </Reveal>
              );
            })}
          </ul>
        </Scene3D>

        {/* How choosing works */}
        <div className="mt-20 rounded-3xl border border-white/12 p-8 sm:p-12">
          <h2 className="text-center font-display text-fluid-h3 font-semibold text-white">How to get started</h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, idx) => (
              <Reveal as="li" key={step.title} delay={idx * 0.1} className="flex flex-col items-center text-center">
                <svg viewBox="0 0 24 24" className="h-10 w-10 text-gold" aria-hidden="true">
                  <path d="M12 2 20.66 7v10L12 22l-8.66-5V7z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 7.5 16.6 10v5L12 17.5 7.4 15v-5z" fill="currentColor" />
                </svg>
                <h3 className="mt-5 font-display text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 max-w-[28ch] text-base leading-relaxed text-white/70">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
