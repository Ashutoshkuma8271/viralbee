import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useMediaQuery } from '../lib/motion.ts';

const SERVICES_ROW = ['Social Media', 'Branding', 'Reels & Video', 'Websites', 'Meta Ads', 'Google Ads'];
const TAGLINE_ROW = ['Create', 'Connect', 'Convert'];

const Hex: React.FC = () => (
  <svg viewBox="0 0 24 24" className="mx-6 h-5 w-5 shrink-0 text-gold sm:mx-10 sm:h-7 sm:w-7" aria-hidden="true">
    <path d="M12 1.5 21.1 6.75v10.5L12 22.5 2.9 17.25V6.75z" fill="currentColor" />
  </svg>
);

/** One endless row; words alternate solid and gold-outline. `reverse` runs it the other way. */
const Row: React.FC<{ words: string[]; reverse?: boolean; duration: number; outlineFirst?: boolean }> = ({
  words,
  reverse = false,
  duration,
  outlineFirst = false,
}) => {
  const set = (copy: number) => (
    <span className="flex shrink-0 items-center" key={copy}>
      {words.map((word, i) => {
        const outline = (i % 2 === 0) === outlineFirst;
        return (
          <span key={`${copy}-${word}`} className="flex items-center">
            <span
              className={`whitespace-nowrap font-display text-[clamp(2.75rem,8vw,7.5rem)] font-semibold uppercase leading-none ${
                outline ? 'text-outline-gold' : 'text-white'
              }`}
            >
              {word}
            </span>
            <Hex />
          </span>
        );
      })}
    </span>
  );
  return (
    <div className="marquee overflow-hidden py-2">
      <div
        className="marquee-track"
        style={{ ['--marquee-duration' as string]: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {set(0)}
        {set(1)}
      </div>
    </div>
  );
};

/**
 * Big kinetic typography band: two rows of oversized words drifting in opposite directions. On devices with a mouse
 * the rows also slide against each other as the page scrolls. Decorative: the words repeat content found elsewhere,
 * so screen readers skip it. Static for reduced motion (CSS rule on `.marquee-track`).
 */
export const KineticBand: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const precise = useMediaQuery('(hover: hover) and (pointer: fine)');
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const shiftA = useTransform(scrollYProgress, [0, 1], ['4%', '-8%']);
  const shiftB = useTransform(scrollYProgress, [0, 1], ['-8%', '4%']);
  const scrollLinked = precise && !reduce;
  // The words lean into the direction you scroll, like film footage under a fast pan, and settle when you stop
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 40, stiffness: 300 });
  const skew = useTransform(velocity, (v) => Math.max(-9, Math.min(9, v / -160)));

  return (
    <section
      ref={ref}
      aria-hidden="true"
      className="relative overflow-hidden border-y border-white/10 bg-ink py-14 sm:py-20"
    >
      <motion.div style={scrollLinked ? { x: shiftA, skewX: skew } : undefined}>
        <Row words={SERVICES_ROW} duration={60} />
      </motion.div>
      <motion.div style={scrollLinked ? { x: shiftB, skewX: skew } : undefined} className="mt-2 sm:mt-4">
        <Row words={TAGLINE_ROW} reverse duration={45} outlineFirst />
      </motion.div>
    </section>
  );
};
