import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

const HEX = 'M12 2 20.66 7v10L12 22l-8.66-5V7z';

/**
 * Scene change between pages: a gold panel and a black panel sweep up over the screen, a hexagon draws itself in the
 * middle while the next page is swapped in underneath, then the panels lift away. Plays on every navigation except
 * the first load; click-through (never blocks input); off for reduced motion.
 */
export const RouteCurtain: React.FC = () => {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const first = useRef(true);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setRun((n) => n + 1);
  }, [pathname]);

  if (reduce || run === 0) return null;

  const ease = [0.76, 0, 0.24, 1] as const;
  return (
    <div key={run} className="pointer-events-none fixed inset-0 z-[85] overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute inset-0 bg-gold"
        initial={{ clipPath: 'inset(100% 0 0 0)' }}
        animate={{ clipPath: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)', 'inset(0% 0 0 0)', 'inset(0 0 100% 0)'] }}
        transition={{ duration: 1.25, times: [0, 0.32, 0.62, 1], ease }}
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-ink"
        initial={{ clipPath: 'inset(100% 0 0 0)' }}
        animate={{ clipPath: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)', 'inset(0% 0 0 0)', 'inset(0 0 100% 0)'] }}
        transition={{ duration: 1.25, delay: 0.07, times: [0, 0.32, 0.62, 1], ease }}
      >
        <svg viewBox="2.5 1.5 19 21" className="h-20 w-20 text-gold">
          <motion.path
            d={HEX}
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={0.8}
            strokeLinejoin="round"
            initial={{ pathLength: 0, fillOpacity: 0 }}
            animate={{ pathLength: [0, 1, 1], fillOpacity: [0, 0, 1] }}
            transition={{ duration: 0.9, delay: 0.3, times: [0, 0.6, 1], ease: 'easeOut' }}
          />
        </svg>
      </motion.div>
    </div>
  );
};
