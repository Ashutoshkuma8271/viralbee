import React, { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useMediaQuery } from '../../lib/motion.ts';

/**
 * Makes a button lean a few pixels toward the pointer when it is close. Only for devices with a real hover pointer;
 * on touch screens and for reduced motion the children are rendered untouched (no wrapper, so layout never changes).
 */
export const Magnetic: React.FC<{ children: React.ReactNode; strength?: number; className?: string }> = ({
  children,
  strength = 0.22,
  className = 'inline-flex',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  if (reduce || !canHover) return <>{children}</>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={(e) => {
        const box = ref.current?.getBoundingClientRect();
        if (!box) return;
        x.set((e.clientX - (box.left + box.width / 2)) * strength);
        y.set((e.clientY - (box.top + box.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
};
