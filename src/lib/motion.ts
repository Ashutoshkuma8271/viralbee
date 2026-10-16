import { useSyncExternalStore } from 'react';
import { useTransform, type MotionValue } from 'framer-motion';

/**
 * Scroll-linked value that eases from `to[0]` to `to[1]` while `value` goes from `range[0]` to `range[1]`, and holds
 * at the end values outside that range. Written as a function on purpose: framer-motion hands simple array mappings
 * of scroll progress to the browser's scroll timeline, which mis-reads ranges inside pinned (sticky) sections and
 * made transitions run backwards past their end. A function always runs in JavaScript and behaves.
 */
export function useRamp(value: MotionValue<number>, range: [number, number], to: [number, number]): MotionValue<number> {
  return useTransform(value, (v) => {
    const t = Math.min(1, Math.max(0, (v - range[0]) / (range[1] - range[0])));
    return to[0] + (to[1] - to[0]) * t;
  });
}

/** The one easing used for every scroll entrance: quick start, long soft landing. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Fire once, a little before the element is fully in view, so it is settled by the time you read it. */
export const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;

/** Reactive `window.matchMedia` hook (false on the server). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', notify);
      return () => mql.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Travel distance for entrances: full on desktop, moderate on tablets, light on phones. */
export function useTravel(): number {
  const desktop = useMediaQuery('(min-width: 1024px)');
  const tablet = useMediaQuery('(min-width: 768px)');
  return desktop ? 32 : tablet ? 24 : 16;
}
