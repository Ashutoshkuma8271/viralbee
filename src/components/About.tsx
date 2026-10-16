import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { BRAND, STATS } from '../constants/content.ts';
import { CountUp } from './common/CountUp.tsx';
import { Reveal } from './common/Reveal.tsx';
import { RevealWords } from './common/RevealWords.tsx';
import { TiltCard } from './common/TiltCard.tsx';
import { Spotlight } from './common/Spotlight.tsx';
import { Magnetic } from './common/Magnetic.tsx';
import { HexLattice } from './common/HexLattice.tsx';
import { EASE, VIEWPORT, useMediaQuery, useRamp } from '../lib/motion.ts';
import { usePointerDepth } from '../lib/usePointerDepth.ts';

const HEX = 'M12 2 20.66 7v10L12 22l-8.66-5V7z';
const HEX_INNER = 'M12 7.5 16.6 10v5L12 17.5 7.4 15v-5z';

// A few lit cells in each lattice (fixed, so the pattern never jumps between renders)
const FLOOR_GOLD: Array<[number, number]> = [[14, 3], [19, 5], [11, 7], [22, 9], [16, 11], [25, 4]];
const BACK_GOLD: Array<[number, number]> = [[9, 2], [13, 5], [6, 6]];

/** Smoothed 0 → 1 for one card's own slice of the grid's scroll progress */
const useDeal = (progress: MotionValue<number>, start: number) => {
  const raw = useRamp(progress, [start, Math.min(1, start + 0.5)], [0, 1]);
  return useSpring(raw, { stiffness: 110, damping: 24, mass: 0.6 });
};

interface StatCardProps {
  stat: (typeof STATS)[number];
  index: number;
  progress: MotionValue<number>;
  drift: MotionValue<number>;
  /** Laptop/tablet with motion allowed: scroll-linked 3D deal-in */
  deal: boolean;
  reduce: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index, progress, drift, deal, reduce }) => {
  const t = useDeal(progress, index * 0.12);
  const side = index % 2 === 0 ? -1 : 1; // left column leans one way, right column the other
  const rotateY = useTransform(t, (v) => (1 - v) * 26 * side);
  const rotateX = useTransform(t, (v) => (1 - v) * 12);
  const z = useTransform(t, (v) => (1 - v) * -160);
  const y = useTransform([t, drift], ([v, d]: number[]) => (1 - v) * 60 + d * side);

  const card = (
    <div className="group @container relative h-full overflow-hidden rounded-3xl border border-white/10 bg-dark-card bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_60%)] p-5 sm:p-7 lg:p-8">
      <Spotlight />
      {/* Hexagon draws itself on entry; its core fills gold on hover */}
      <svg viewBox="0 0 24 24" className="relative h-9 w-9" aria-hidden="true">
        <motion.path
          d={HEX}
          fill="none"
          stroke="#F2A516"
          strokeWidth="1.3"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.1, delay: 0.25 + index * 0.12, ease: EASE }}
        />
        <path d={HEX_INNER} className="fill-gold/0 transition-[fill] duration-500 group-hover:fill-gold" />
      </svg>
      {/* Size follows the card's own width (container units), so "6-step" always fits */}
      <span className="relative mt-6 block whitespace-nowrap font-serif-display text-[clamp(2rem,32cqw,6rem)] leading-none tabular-nums text-gold-lit">
        <CountUp value={stat.value} />
      </span>
      <span className="relative mt-5 block font-display text-lg font-semibold leading-snug text-white sm:text-xl">{stat.label}</span>
      <span className="relative mt-1.5 block font-sans text-sm leading-snug text-white/65">{stat.detail}</span>
    </div>
  );

  const inner = (
    <>
      <dt className="sr-only">{stat.label}</dt>
      <dd className="h-full">
        <TiltCard className="h-full" radius="rounded-3xl" max={5} glare>
          {card}
        </TiltCard>
      </dd>
    </>
  );

  if (deal) {
    // Scroll-linked transforms live on this outer wrapper; TiltCard (pointer) works on the inner element
    return (
      <motion.div style={{ rotateY, rotateX, z, y, opacity: t, transformStyle: 'preserve-3d' }} className="h-full">
        {inner}
      </motion.div>
    );
  }
  return (
    <motion.div
      className="h-full"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
    >
      {inner}
    </motion.div>
  );
};

/**
 * Home teaser: one statement and four facts. The full story lives on /about.
 * Behind it: a honeycomb floor on a tilted plane that drifts toward you as you scroll (a larger, fainter lattice
 * moves the other way behind it), a warm gold glow behind the facts, a gold hairline and fine grain. The four facts
 * deal in from depth on laptops and tablets. Phones: flat faint lattice, simple fade-ups. Reduced motion: static.
 */
export const About: React.FC = () => {
  const reduce = !!useReducedMotion();
  const tablet = useMediaQuery('(min-width: 768px)');
  const motionOk = !reduce;
  const deal = tablet && motionOk;
  const { ref, px, py } = usePointerDepth<HTMLElement>();
  const gridRef = useRef<HTMLDListElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);

  // Whole section, for the drifting floor and the column parallax
  const { scrollYProgress: sectionP } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const smooth = useSpring(sectionP, { stiffness: 80, damping: 26, mass: 0.5 });
  const floorY = useRamp(smooth, [0, 1], [-140, 140]);
  const backY = useRamp(smooth, [0, 1], [90, -90]);
  const drift = useRamp(smooth, [0.2, 0.8], [16, -16]);
  // Pointer: the lattice slides about 12px against the pointer, the glow follows it gently
  const floorX = useTransform(px, (v) => v * -24);
  const backX = useTransform(px, (v) => v * 12);
  const glowX = useTransform(px, (v) => v * 60);
  const glowY = useTransform(py, (v) => v * 40);
  const floorShiftY = useTransform([floorY, py], ([a, b]: number[]) => a + b * -16);

  // Fact grid: each card gets its own staggered slice of this
  const { scrollYProgress: gridP } = useScroll({ target: gridRef, offset: ['start end', 'center 55%'] });

  // "Working as yours." brightens from 55% (still above 3:1 for large text) to full as the heading moves up the screen
  const { scrollYProgress: headP } = useScroll({ target: headRef, offset: ['start 85%', 'start 35%'] });
  const followOpacity = useRamp(headP, [0, 1], [0.55, 1]);

  return (
    <section ref={ref} id="about" className="relative overflow-x-clip bg-ink py-24 sm:py-32">
      {/* Atmosphere (decorative) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(242,165,22,0.5)_50%,transparent)]" />

        {tablet ? (
          <div className="floor-mask absolute bottom-0 right-0 h-[88%] w-[78%]" style={{ perspective: 900 }}>
            {/* Back layer: larger cells, fainter, moving the opposite way */}
            <motion.div
              className="absolute inset-[-30%_-20%] origin-bottom"
              style={motionOk ? { rotateX: 58, x: backX, y: backY } : { rotateX: 58 }}
            >
              <HexLattice cols={18} rows={12} r={60} stroke="rgba(255,255,255,0.035)" goldStroke="rgba(242,165,22,0.09)" gold={BACK_GOLD} className="h-full w-full" />
            </motion.div>
            {/* Front layer: the honeycomb floor */}
            <motion.div
              className="absolute inset-[-25%_-15%] origin-bottom"
              style={motionOk ? { rotateX: 58, x: floorX, y: floorShiftY } : { rotateX: 58 }}
            >
              <HexLattice cols={34} rows={16} r={30} gold={FLOOR_GOLD} goldStroke="rgba(242,165,22,0.16)" className="h-full w-full" />
            </motion.div>
          </div>
        ) : (
          // Phones: a flat, static, faint lattice
          <div className="floor-mask absolute inset-x-0 bottom-0 h-1/2 opacity-70">
            <HexLattice cols={12} rows={8} r={24} gold={[[7, 3], [4, 5]]} className="h-full w-full" />
          </div>
        )}

        {/* Warm gold glow behind the facts */}
        <motion.div
          className="absolute right-[-10%] top-[18%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(242,165,22,0.10),transparent)] lg:right-[2%]"
          style={motionOk ? { x: glowX, y: glowY } : undefined}
        />
        <div className="grain-static absolute inset-0 opacity-[0.04]" />
      </div>

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="text-center lg:col-span-7 lg:text-left">
            <h2
              ref={headRef}
              className="mx-auto max-w-[14ch] text-balance font-display text-[clamp(2.6rem,5vw+0.5rem,5.5rem)] font-semibold leading-[1.0] text-white lg:mx-0"
            >
              <RevealWords text={BRAND.aboutHeadline.lead} className="block" wordClassName="text-silver" />
              {/* Same face and size, in the lit gold accent, brightening with scroll */}
              <motion.span className="block" style={motionOk ? { opacity: followOpacity } : undefined}>
                <RevealWords text={BRAND.aboutHeadline.follow} delay={0.2} wordClassName="text-gold-lit" />
              </motion.span>
            </h2>
            <Reveal delay={0.15}>
              <p className="mx-auto mt-8 max-w-xl font-sans text-lg leading-relaxed text-white/75 sm:text-xl lg:mx-0">{BRAND.aboutCopy}</p>
            </Reveal>
          </div>

          {/* Facts: four cards that deal in from depth */}
          <div className="lg:col-span-5">
            <dl ref={gridRef} className="grid grid-cols-2 gap-3 sm:gap-5" style={deal ? { perspective: 1400 } : undefined}>
              {STATS.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} index={i} progress={gridP} drift={drift} deal={deal} reduce={reduce} />
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-14 flex justify-center sm:mt-16">
          <Magnetic>
            <Link
              to="/about"
              className="btn-glint group inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 font-sans text-[15px] font-semibold text-white transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-ink focus-visible:border-gold"
            >
              More about us
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
};
