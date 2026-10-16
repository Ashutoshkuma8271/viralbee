import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { BRAND, STATS } from '../constants/content.ts';
import { CountUp } from './common/CountUp.tsx';
import { Reveal } from './common/Reveal.tsx';
import { RevealWords } from './common/RevealWords.tsx';
import { TiltCard } from './common/TiltCard.tsx';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, VIEWPORT } from '../lib/motion.ts';

/** Home teaser: one statement and four facts. The full story lives on /about. */
export const About: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section id="about" className="relative bg-ink py-24 sm:py-32">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
          <Reveal direction="left" className="text-center lg:col-span-7 lg:text-left">
            <h2 className="mx-auto max-w-[18ch] text-balance text-fluid-h2 font-display font-semibold text-white lg:mx-0">
              <RevealWords text="One team for your social, website and ads." />{' '}
              <span className="glow-gold font-serif-display font-normal italic text-gold">
                Working as yours.
              </span>
            </h2>
            <p className="mx-auto mt-8 max-w-xl font-sans text-lg leading-relaxed text-white/75 lg:mx-0">{BRAND.aboutCopy}</p>
          </Reveal>

          {/* Facts: 2x2 panel with fine dividers and 3D TiltCard */}
          <Reveal direction="right" delay={0.1} className="lg:col-span-5">
            <TiltCard radius="rounded-3xl" max={4} glare={true}>
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10">
                {STATS.map((stat, i) => (
                  <div key={stat.label} className="relative bg-ink p-6 sm:p-8">
                    <motion.span
                      initial={reduce ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={VIEWPORT}
                      transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: EASE }}
                      className="absolute inset-x-0 top-0 h-px origin-left bg-gold shadow-[0_0_12px_rgba(242,165,22,0.4)]"
                      aria-hidden="true"
                    />
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block whitespace-nowrap font-serif-display text-5xl tabular-nums text-white sm:text-6xl">
                        <CountUp value={stat.value} />
                      </span>
                      <span className="mt-4 block font-sans text-base font-semibold text-white">{stat.label}</span>
                      <span className="mt-1 block font-sans text-sm leading-snug text-white/60">{stat.detail}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </TiltCard>
          </Reveal>
        </div>

        <div className="mt-14 flex justify-center sm:mt-16">
          <Link
            to="/about"
            className="btn-glint group inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 font-sans text-[15px] font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
          >
            More about us
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
