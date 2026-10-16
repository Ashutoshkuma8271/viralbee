import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useMediaQuery } from '../../lib/motion.ts';

/**
 * A soft gold glow that follows the cursor inside its parent card. Place it as the card's first child; the parent
 * needs `relative overflow-hidden`. Hover pointers only; nothing is rendered on touch screens or for reduced motion.
 */
export const Spotlight: React.FC<{ size?: number }> = ({ size = 320 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');

  useEffect(() => {
    const glow = ref.current;
    const card = glow?.parentElement;
    if (!glow || !card) return;
    const move = (e: PointerEvent) => {
      const box = card.getBoundingClientRect();
      glow.style.setProperty('--sx', `${e.clientX - box.left}px`);
      glow.style.setProperty('--sy', `${e.clientY - box.top}px`);
      glow.style.opacity = '1';
    };
    const leave = () => (glow.style.opacity = '0');
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerleave', leave);
    return () => {
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerleave', leave);
    };
  }, [canHover, reduce]);

  if (reduce || !canHover) return null;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
      style={{
        background: `radial-gradient(${size}px circle at var(--sx, 50%) var(--sy, 50%), rgba(242,165,22,0.16), transparent 70%)`,
      }}
    />
  );
};
