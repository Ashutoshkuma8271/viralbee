import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { WHY_CHOOSE_US } from '../constants/content.ts';
import { Reveal } from './common/Reveal.tsx';
import { RevealWords } from './common/RevealWords.tsx';
import { TiltCard } from './common/TiltCard.tsx';
import { EASE, VIEWPORT, useMediaQuery, useRamp, useTravel } from '../lib/motion.ts';

const STRIKE = 'linear-gradient(rgba(180,83,60,0.8),rgba(180,83,60,0.8))';

/** Ink hexagon with a gold tick: "this is how we do it". Inside a card, the hexagon turns 60° on hover. */
const CheckHex: React.FC<{ className?: string }> = ({ className = 'h-[34px] w-[34px]' }) => (
  <svg viewBox="0 0 34 34" className={`shrink-0 overflow-visible ${className}`} aria-hidden="true">
    <path
      d="M17 1.5 30.4 9.25v15.5L17 32.5 3.6 24.75V9.25z"
      className="origin-center fill-ink transition-transform duration-500 ease-out [transform-box:fill-box] motion-safe:group-hover:rotate-[60deg]"
    />
    <path d="m11.5 17.4 3.7 3.6 7.4-7.6" fill="none" stroke="#F2A516" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Distance of a card's centre from the middle of the screen: 0 in the middle, 1 at about a third of the screen away */
const useAway = (progress: MotionValue<number>) => useTransform(progress, (v) => Math.min(1, Math.abs(v - 0.5) / 0.3));

interface CardProps {
  item: (typeof WHY_CHOOSE_US)[number];
  idx: number;
  /** Laptop and up with motion allowed: focus glow and hover tilt (no dimming: it pushed the struck text under 4.5:1) */
  depth: boolean;
}

const WhyCard: React.FC<CardProps> = ({ item, idx, depth }) => {
  const reduce = useReducedMotion();
  const travel = useTravel();
  const phone = !useMediaQuery('(min-width: 768px)');
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const away = useAway(scrollYProgress);
  const glow = useRamp(away, [0.2, 0.5], [1, 0]); // the card nearest the middle glows; neighbours cross-fade

  const card = (
    <article className="group relative flex h-full flex-col rounded-3xl border border-ink/8 bg-white p-6 shadow-[0_1px_2px_rgba(11,11,12,0.04),0_12px_32px_-16px_rgba(11,11,12,0.12)] sm:p-8">
      {/* The usual way, crossed out. The line is a background, so it crosses every line when the text wraps, and it
          draws across once the card is in view. */}
      <p className="inline-flex max-w-full items-center gap-2.5 self-start rounded-[18px] border border-ink/8 bg-wax-deep py-1 pl-1 pr-4 font-sans text-[15px] font-medium leading-snug text-ink/60">
        <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#B4533C]/12 text-[#B4533C]" aria-hidden="true">
          <X className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
        <span>
          <span className="sr-only">Instead of: </span>
          {reduce ? (
            <span
              className="bg-no-repeat [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
              style={{ backgroundImage: STRIKE, backgroundSize: '100% 1.5px', backgroundPosition: '0 58%' }}
            >
              {item.usual}
            </span>
          ) : (
            <motion.span
              className="bg-no-repeat [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
              style={{ backgroundImage: STRIKE, backgroundPosition: '0 58%' }}
              initial={{ backgroundSize: '0% 1.5px' }}
              whileInView={{ backgroundSize: '100% 1.5px' }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            >
              {item.usual}
            </motion.span>
          )}
        </span>
      </p>

      {/* "becomes" */}
      <span className="ml-[16px] block h-5 w-px bg-gradient-to-b from-[#B4533C]/45 to-ink/35" aria-hidden="true" />

      <h3 className="flex items-start gap-3 font-display text-2xl font-semibold leading-tight text-ink sm:text-[26px]">
        <CheckHex />
        <span className="pt-0.5 transition-transform duration-500 ease-out motion-safe:group-hover:translate-x-1.5">
          <span className="sr-only">With Vyral Bee: </span>
          {item.title}
        </span>
      </h3>
      <p className="mt-3 max-w-[52ch] font-sans text-base leading-relaxed text-ink/70 sm:pl-[46px]">{item.description}</p>

    </article>
  );

  return (
    <motion.li
      className="w-[84%] shrink-0 snap-center sm:w-[60%] md:w-auto"
      initial={reduce ? false : { opacity: 0, y: travel, rotateX: phone ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, delay: phone ? Math.min(idx, 2) * 0.08 : (idx % 2) * 0.08, ease: EASE }}
      style={{ transformPerspective: 1000 }}
    >
      {/* No scroll-linked scale on purpose: shrinking the card while scrolling made its text render blurry */}
      <div ref={ref} className="relative h-full">
        {/* The card in the middle of the screen lifts: deeper neutral shadow and a thin gold edge (opacity only, so
            scrolling stays smooth; no gold haze, which tinted the white cards cream) */}
        {depth && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-3xl shadow-[0_24px_60px_-24px_rgba(11,11,12,0.22)] ring-1 ring-gold/45"
            style={{ opacity: glow }}
            aria-hidden="true"
          />
        )}
        {depth ? (
          <TiltCard className="h-full" radius="rounded-3xl" max={4} glare={false}>
            {card}
          </TiltCard>
        ) : (
          card
        )}
      </div>
    </motion.li>
  );
};

/** Three large faint hexagon outlines drifting behind the section, each scrolling at its own speed (laptop only) */
const BackdropHexes: React.FC<{ target: React.RefObject<HTMLElement | null> }> = ({ target }) => {
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] });
  const y1 = useRamp(scrollYProgress, [0, 1], [140, -140]);
  const y2 = useRamp(scrollYProgress, [0, 1], [60, -260]);
  const y3 = useRamp(scrollYProgress, [0, 1], [-60, 180]);
  const hex = 'M50 2 91.6 26v48L50 98 8.4 74V26z';
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <motion.div className="absolute -left-40 top-[12%] w-[520px]" style={{ y: y1 }}>
        <svg viewBox="0 0 100 100" className="drift-slow w-full">
          <path d={hex} fill="none" stroke="rgba(11,11,12,0.06)" strokeWidth="0.35" />
        </svg>
      </motion.div>
      <motion.div className="absolute -right-24 top-[38%] w-[420px]" style={{ y: y2 }}>
        <svg viewBox="0 0 100 100" className="drift-slow w-full [animation-delay:-6s]">
          <path d={hex} fill="none" stroke="rgba(11,11,12,0.07)" strokeWidth="0.4" />
        </svg>
      </motion.div>
      <motion.div className="absolute bottom-[-6%] left-[30%] w-[300px]" style={{ y: y3 }}>
        <svg viewBox="0 0 100 100" className="drift-slow w-full [animation-delay:-11s]">
          <path d={hex} fill="none" stroke="rgba(11,11,12,0.06)" strokeWidth="0.5" />
        </svg>
      </motion.div>
    </div>
  );
};

/**
 * Home: why work with us. Laptop and up: heading, intro and button on the left (sticky while the list scrolls), the
 * eight points as cards on the right, with scroll-linked depth, a focus glow and hover tilt. Tablet: heading on top,
 * cards in two columns. Phones: a swipe row with a counter and light entrances only. Reduced motion: all static.
 */
export const WhyChooseUs: React.FC = () => {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);
  const [lit, setLit] = useState(false);
  const reduce = useReducedMotion();
  const laptop = useMediaQuery('(min-width: 1024px)');
  const depth = laptop && !reduce;

  // Phones only (the list scrolls sideways there): which card is in view
  const onRailScroll = () => {
    const el = rail.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const step = first.offsetWidth + 16;
    setCurrent(Math.min(WHY_CHOOSE_US.length - 1, Math.max(0, Math.round(el.scrollLeft / step))));
  };

  return (
    // overflow-clip (not hidden) keeps the drifting shapes inside without breaking the sticky column
    <section ref={section} className="relative overflow-clip bg-wax py-24 text-ink sm:py-32">
      {depth && <BackdropHexes target={section} />}

      <div className="shell relative grid gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-24">
        {/* Left: stays in view while the cards scroll past */}
        <div className="min-w-0 text-center md:text-left lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal as="p" className="font-sans text-[13px] font-semibold uppercase tracking-[0.18em] text-gold-dark">
              Why Vyral Bee
            </Reveal>
            {/* Light sweeps across "More results." once the words have risen, then every 8 seconds */}
            <motion.h2
              className="mt-5 text-balance font-display text-fluid-h2 font-semibold leading-[1.02] text-ink"
              onViewportEnter={() => window.setTimeout(() => setLit(true), 900)}
              viewport={{ once: true }}
            >
              <RevealWords text="Less agency friction." />{' '}
              <RevealWords text="More results." delay={0.15} wordClassName={`text-gold-ink ${lit && !reduce ? 'text-gold-sweep' : ''}`} />
            </motion.h2>
            <Reveal
              as="p"
              delay={0.2}
              className="mx-auto mt-6 max-w-[34ch] font-sans text-lg font-medium leading-relaxed text-ink/70 sm:text-xl md:mx-0"
            >
              What working with Vyral Bee looks like, compared with what most businesses put up with.
            </Reveal>

            {/* Key to the cards: struck chip = the usual way, ink hexagon = our way */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:justify-start" aria-hidden="true">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-ink/60">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B4533C]/12 text-[#B4533C]">
                  <X className="h-3 w-3" strokeWidth={3} />
                </span>
                The usual
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-ink/80">
                <CheckHex className="h-5 w-5" />
                With Vyral Bee
              </span>
            </div>
          </div>
        </div>

        {/* Right: the eight points */}
        <div className="min-w-0 lg:col-span-7">
          <ul
            ref={rail}
            onScroll={onRailScroll}
            className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-1 [&::-webkit-scrollbar]:hidden"
          >
            {WHY_CHOOSE_US.map((item, idx) => (
              <WhyCard key={item.title} item={item} idx={idx} depth={depth} />
            ))}
          </ul>

          {/* Phones: a progress line shows where you are in the row (no numbers) */}
          <div className="mt-6 flex justify-center md:hidden" aria-hidden="true">
            <span className="relative h-[3px] w-32 overflow-hidden rounded-full bg-ink/10">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-gold-dark transition-[width] duration-300"
                style={{ width: `${((current + 1) / WHY_CHOOSE_US.length) * 100}%` }}
              />
            </span>
          </div>
        </div>
      </div>

      {/* Centred at the bottom of the section on every screen, like the other sections' buttons */}
      <div className="shell relative mt-14 flex justify-center sm:mt-16">
        <Link
          to="/contact"
          className="btn-glint group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 font-sans text-[15px] font-semibold text-wax transition-colors hover:bg-black"
        >
          Start a conversation
          <ArrowRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
};
