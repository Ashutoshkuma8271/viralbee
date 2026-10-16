import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, VIEWPORT, useTravel } from '../../lib/motion.ts';

export type Direction = 'up' | 'down' | 'left' | 'right';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Where the element comes from */
  direction?: Direction;
  /** Seconds before it starts; use small multiples (0.08 per item) for staggered groups */
  delay?: number;
  as?: 'div' | 'li' | 'article' | 'p' | 'section';
}

/** Scroll entrance: fades in while travelling a short distance from `direction`. Instant for reduced motion. */
export const Reveal: React.FC<RevealProps> = ({ children, className, direction = 'up', delay = 0, as = 'div' }) => {
  const reduce = useReducedMotion();
  const travel = useTravel();
  const Component = motion[as];
  if (reduce) return React.createElement(as, { className }, children);

  // A little depth on every entrance: things tilt up into place, or turn in from the side
  const offset = {
    up: { y: travel, rotateX: 14 },
    down: { y: -travel, rotateX: -14 },
    left: { x: -travel, rotateY: 10 },
    right: { x: travel, rotateY: -10 },
  }[direction];

  return (
    <Component
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, delay: Math.min(delay, 0.5), ease: EASE }}
      style={{ transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </Component>
  );
};
