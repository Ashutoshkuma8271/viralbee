import React from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/** Thin gold line along the top edge that fills as the page is read. Hidden for reduced motion. */
export const ScrollProgress: React.FC = () => {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 32, restDelta: 0.001 });
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gold"
    />
  );
};
