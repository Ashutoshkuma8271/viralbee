import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, VIEWPORT, useMediaQuery } from '../../lib/motion.ts';
import type { Direction } from './Reveal.tsx';

/** Photo entrance: the picture is uncovered from one edge (clip-path), with a slight settle in scale. */
export const ImageReveal: React.FC<{ children: React.ReactNode; className?: string; from?: Direction }> = ({
  children,
  className,
  from = 'left',
}) => {
  const reduce = useReducedMotion();
  const wide = useMediaQuery('(min-width: 768px)');
  if (reduce) return <div className={className}>{children}</div>;
  if (!wide) {
    // Phones: a simple fade costs far less than animating clip-path and scale
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {children}
      </motion.div>
    );
  }

  const hidden = {
    left: 'inset(0 100% 0 0)',
    right: 'inset(0 0 0 100%)',
    up: 'inset(100% 0 0 0)',
    down: 'inset(0 0 100% 0)',
  }[from];

  return (
    <motion.div
      className={className}
      initial={{ clipPath: hidden }}
      whileInView={{ clipPath: 'inset(0 0 0 0)' }}
      viewport={VIEWPORT}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.4, ease: EASE }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
