import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, VIEWPORT } from '../../lib/motion.ts';

/**
 * Headline entrance: each word rises from behind a mask, one after another. Screen readers get the plain sentence.
 * Only plain-text headings are split; anything else is rendered as given.
 */
export const RevealWords: React.FC<{
  text: string;
  className?: string;
  delay?: number;
  /** Optional class on each word, e.g. a gradient fill that must sit on the moving element itself */
  wordClassName?: string;
}> = ({ text, className, delay = 0, wordClassName = '' }) => {
  const reduce = useReducedMotion();
  if (reduce) return <span className={`${className ?? ''} ${wordClassName}`}>{text}</span>;
  const words = text.split(' ');
  return (
    <motion.span
      className={className}
      initial="hide"
      whileInView="show"
      viewport={VIEWPORT}
      transition={{ staggerChildren: 0.05, delayChildren: delay }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i} className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
            <motion.span
              className={`inline-block ${wordClassName}`}
              variants={{ hide: { y: '110%' }, show: { y: '0%', transition: { duration: 0.85, ease: EASE } } }}
            >
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </span>
    </motion.span>
  );
};
