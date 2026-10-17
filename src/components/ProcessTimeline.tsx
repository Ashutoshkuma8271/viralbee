import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { PROCESS_STEPS } from '../constants/content.ts';
import { RevealWords } from './common/RevealWords.tsx';
import { EASE, VIEWPORT } from '../lib/motion.ts';

/** Process page: the six steps as one timeline whose gold line fills, and hexagons light up, as you scroll. */
export const ProcessTimeline: React.FC = () => {
  const listRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 70%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const [reached, setReached] = useState(reduceMotion ? PROCESS_STEPS.length : 0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduceMotion) return;
    setReached(Math.min(PROCESS_STEPS.length, Math.floor(v * PROCESS_STEPS.length + 0.35)));
  });

  return (
    <section id="process" className="relative bg-ink py-24 sm:py-32">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="text-center lg:col-span-5 lg:text-left">
          <div className="lg:sticky lg:top-36">
            <h2 className="mx-auto max-w-[13ch] text-balance text-fluid-h2 font-display font-semibold text-white lg:mx-0">
              <RevealWords text="Six steps, repeated" />{' '}
              <span className="glow-gold font-serif-display font-normal italic text-gold">
                every month.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-md font-sans text-lg leading-relaxed text-white/75 lg:mx-0">
              No guesswork and no black box. You always know what we're doing, why, and what it delivered.
            </p>
          </div>
        </div>

        <ol ref={listRef} className="relative lg:col-span-7">
          <span className="absolute bottom-6 left-[23px] top-6 hidden w-px bg-white/12 sm:block" aria-hidden="true" />
          <motion.span
            className="absolute bottom-6 left-[23px] top-6 hidden w-px origin-top bg-gold sm:block"
            style={{ scaleY: reduceMotion ? 1 : fill }}
            aria-hidden="true"
          />

          {PROCESS_STEPS.map((step, idx) => {
            const isReached = idx < reached;
            return (
              <li key={step.step} className="group relative flex flex-col items-center gap-4 pb-16 text-center last:pb-0 sm:flex-row sm:items-start sm:gap-8 sm:text-left">
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center bg-ink" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-110">
                    <path
                      d="M12 2 20.66 7v10L12 22l-8.66-5V7z"
                      className={`transition-colors duration-500 ${isReached ? 'fill-gold stroke-gold' : 'fill-ink stroke-white/30'}`}
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
                <div className="sm:pt-1.5">
                  {/* Title rises out of a mask as the step scrolls in; on hover it slides a little right */}
                  <h3 className="font-display text-3xl font-semibold text-white lg:text-4xl">
                    <span className="block overflow-hidden pb-[0.08em]">
                      {/* Outer: the scroll rise (framer-motion). Inner: the hover slide (CSS), kept apart so they never fight */}
                      <motion.span
                        className="block"
                        initial={reduceMotion ? false : { y: '105%' }}
                        whileInView={{ y: '0%' }}
                        viewport={VIEWPORT}
                        transition={{ duration: 0.85, ease: EASE }}
                      >
                        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-1.5">
                          {step.title}
                        </span>
                      </motion.span>
                    </span>
                  </h3>
                  <motion.p
                    className="mx-auto mt-3 max-w-[36ch] text-base leading-relaxed text-white/70 sm:mx-0 sm:max-w-[48ch] lg:text-lg"
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
                  >
                    {step.description}
                  </motion.p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
