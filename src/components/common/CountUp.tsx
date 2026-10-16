import React, { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/** Counts the leading number of `value` up from zero once visible, keeping any suffix ("8+", "6-step"). */
export const CountUp: React.FC<{ value: string; duration?: number }> = ({ value, duration = 1.4 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();

  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const isNumeric = Boolean(match);
  const [current, setCurrent] = useState(match && !reduceMotion ? 0 : target);

  useEffect(() => {
    if (!isNumeric || !inView || reduceMotion) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setCurrent(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, target, duration, isNumeric]);

  if (!isNumeric) return <span>{value}</span>;
  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">
        {current}
        {suffix}
      </span>
    </span>
  );
};
