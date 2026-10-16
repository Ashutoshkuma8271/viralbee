import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useMediaQuery, useRamp } from '../../lib/motion.ts';

interface Scene3DProps {
  children: React.ReactNode;
  className?: string;
  /** How far back the block starts, in degrees (phones use half) */
  tilt?: number;
}

/**
 * Cinematic "screen lift": while a big block scrolls into view it starts tilted back, slightly smaller and dimmer,
 * and settles flat by the time its top reaches the upper third of the screen. Scroll-linked (it reverses when you
 * scroll back), smoothed with a light spring. Reduced motion: a plain block.
 */
export const Scene3D: React.FC<Scene3DProps> = ({ children, className = '', tilt = 14 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const phone = useMediaQuery('(max-width: 767px)');
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 35%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  const angle = phone ? tilt / 2 : tilt;
  const rotateX = useTransform(progress, [0, 1], [angle, 0]);
  const scale = useTransform(progress, [0, 1], [phone ? 0.96 : 0.9, 1]);
  const y = useTransform(progress, [0, 1], [phone ? 30 : 70, 0]);
  const opacity = useRamp(progress, [0, 0.6], [0.35, 1]);

  if (reduce || phone)
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );

  return (
    <div ref={ref} className={className} style={{ perspective: 1600 }}>
      <motion.div style={{ rotateX, scale, y, opacity, transformOrigin: '50% 0%' }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
};
