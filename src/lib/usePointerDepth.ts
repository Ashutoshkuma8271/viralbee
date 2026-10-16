import { useEffect, useRef } from 'react';
import { useMotionValue, useReducedMotion, useSpring, type MotionValue } from 'framer-motion';
import { useMediaQuery } from './motion.ts';

/**
 * Smoothed pointer position over an element, as two springs from -0.5 … 0.5 (0 = centre). Mouse devices only:
 * touch screens and reduced motion keep both at 0, so scenes that read them simply stay still.
 */
export function usePointerDepth<T extends HTMLElement>(): {
  ref: React.RefObject<T | null>;
  px: MotionValue<number>;
  py: MotionValue<number>;
} {
  const ref = useRef<T>(null);
  const reduce = useReducedMotion();
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.6 });
  const py = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !fine) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const box = el.getBoundingClientRect();
      rawX.set((e.clientX - box.left) / box.width - 0.5);
      rawY.set((e.clientY - box.top) / Math.min(box.height, window.innerHeight) - 0.5);
    };
    const leave = () => {
      rawX.set(0);
      rawY.set(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [reduce, fine, rawX, rawY]);

  return { ref, px, py };
}
