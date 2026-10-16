import React, { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useVelocity,
} from 'framer-motion';
import { useMediaQuery } from '../lib/motion.ts';

interface MarqueeProps {
  items: string[];
  /** Seconds for one full loop at rest */
  duration?: number;
  className?: string;
}

const Hexagon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 lg:h-3.5 lg:w-3.5" aria-hidden="true">
    <path d="M12 1.5 21.1 6.75v10.5L12 22.5 2.9 17.25V6.75z" fill="currentColor" />
  </svg>
);

/**
 * Endless horizontal ticker. It drifts at a steady pace, speeds up while the page is being scrolled quickly, and
 * pauses on hover. Items render twice so the loop is seamless. Static for reduced motion; idle while off screen.
 */
const VelocityMarquee: React.FC<MarqueeProps> = ({ items, duration = 38, className = '' }) => {
  const box = useRef<HTMLDivElement>(null);
  const firstRow = useRef<HTMLUListElement>(null);
  const hovering = useRef(false);
  const reduce = useReducedMotion();
  const visible = useInView(box);
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });

  useAnimationFrame((_, delta) => {
    const width = firstRow.current?.offsetWidth ?? 0;
    if (reduce || !visible || hovering.current || !width) return;
    const boost = 1 + Math.min(Math.abs(velocity.get()) / 500, 6); // 1x at rest, up to 7x when flicking the page
    let next = x.get() - (width / duration) * (delta / 1000) * boost;
    if (next <= -width) next += width;
    x.set(next);
  });

  const row = (copy: number) => (
    <ul
      ref={copy === 0 ? firstRow : undefined}
      className="flex shrink-0 items-center"
      aria-hidden={copy > 0 || undefined}
    >
      {items.map((item) => (
        <li key={`${copy}-${item}`} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-base font-semibold uppercase tracking-[0.06em] lg:px-9 lg:text-xl">
            {item}
          </span>
          <Hexagon />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      ref={box}
      className={`overflow-hidden ${className}`}
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => (hovering.current = false)}
    >
      <motion.div className="flex w-max" style={{ x }}>
        {row(0)}
        {row(1)}
      </motion.div>
    </div>
  );
};

/** Phones and tablets: the lightweight CSS ticker (runs on the compositor, no JavaScript per frame). */
const SimpleMarquee: React.FC<MarqueeProps> = ({ items, duration = 38, className = '' }) => {
  const row = (copy: number) => (
    <ul className="flex shrink-0 items-center" aria-hidden={copy > 0 || undefined}>
      {items.map((item) => (
        <li key={`${copy}-${item}`} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-base font-semibold uppercase tracking-[0.06em] lg:px-9 lg:text-xl">
            {item}
          </span>
          <Hexagon />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`marquee overflow-hidden ${className}`}>
      <div className="marquee-track" style={{ ['--marquee-duration' as string]: `${duration}s` }}>
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
};

/** Chooses the ticker by device: scroll-speed boost where there is a mouse or trackpad, plain CSS on touch screens. */
export const Marquee: React.FC<MarqueeProps> = (props) => {
  const precise = useMediaQuery('(hover: hover) and (pointer: fine)');
  return precise ? <VelocityMarquee {...props} /> : <SimpleMarquee {...props} />;
};
