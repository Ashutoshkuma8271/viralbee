import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { PROCESS_STEPS } from '../constants/content.ts';
import { SectionHeader } from './common/SectionHeader.tsx';
import { Reveal } from './common/Reveal.tsx';
import { EASE, useMediaQuery, useRamp } from '../lib/motion.ts';
import { SceneHost } from './three/SceneHost.tsx';

const HEX = 'M12 2 20.66 7v10L12 22l-8.66-5V7z';

const SeeFullProcess: React.FC = () => (
  <Link
    to="/process"
    className="btn-glint group inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 font-sans text-[15px] font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
  >
    See the full process
    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
  </Link>
);

/**
 * Home: the six-step process. Laptop and up: a pinned sequence. Scrolling steps through the stages: the current
 * step's number, title and description fill the left side; on the right, the list of steps fills with a gold line
 * and each hexagon lights up when reached, with "Step 3 of 6" as a progress label.
 * Phones, tablets and reduced motion: the plain list. The full timeline lives on /process.
 */
export const ProcessPreview: React.FC = () => {
  const reduce = useReducedMotion();
  const wide = useMediaQuery('(min-width: 1024px)');
  const pinned = wide && !reduce;
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const count = PROCESS_STEPS.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const fill = useRamp(scrollYProgress, [0.04, 0.96], [0, 1]);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(count - 1, Math.max(0, Math.floor(v * count)));
    if (i !== active) setActive(i);
  });

  if (!pinned) {
    return (
      <section id="process-preview" className="relative bg-dark-surface py-24 sm:py-32">
        <div className="shell">
          <SectionHeader
            title="A clear process, every month."
            intro="No guesswork and no black box. You always know what we're doing, why, and what it delivered."
          />
          <ol className="mt-14 grid gap-x-10 gap-y-2 sm:mt-16 sm:grid-cols-2">
            {PROCESS_STEPS.map((step, idx) => (
              <Reveal as="li" key={step.step} delay={(idx % 2) * 0.08} className="grid grid-cols-[2rem_1fr] gap-x-3 border-t border-white/12 py-5 sm:py-7">
                {/* Small gold hexagon marks each step (no numbers) */}
                <svg viewBox="2.5 1.5 19 21" className="mt-1 h-5 w-5 sm:mt-1.5" aria-hidden="true">
                  <path d={HEX} className="fill-none stroke-gold" strokeWidth="1.6" />
                </svg>
                <div>
                  <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/70 sm:text-base">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <div className="mt-14 flex justify-center sm:mt-16">
            <SeeFullProcess />
          </div>
        </div>
      </section>
    );
  }

  const step = PROCESS_STEPS[active];

  return (
    <section
      ref={ref}
      id="process-preview"
      aria-label="Our process"
      className="relative bg-dark-surface"
      style={{ height: `${100 + count * 28}svh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        {/* Real-time 3D honeycomb behind the steps: it turns one notch with every step and pushes in as you scroll */}
        <div className="absolute inset-0 opacity-40" aria-hidden="true">
          <SceneHost variant="page" progress={fill} kick={active} className="inset-y-0 left-[22%] w-[56%]" />
        </div>
        <div className="shell relative grid w-full grid-cols-12 items-center gap-12">
          {/* Current step, large */}
          <div className="col-span-7">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">A clear process, every month</p>
            <div className="relative mt-6 h-[clamp(15rem,38vh,22rem)]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 60, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -60, rotateX: 20 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  style={{ transformPerspective: 900 }}
                  className="absolute inset-0"
                >
                  <h2 className="font-display text-[clamp(3rem,6vw,6rem)] font-semibold leading-none text-white">
                    {step.title}
                  </h2>
                  <p className="mt-6 max-w-[40ch] text-xl leading-relaxed text-white/75">{step.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* All steps, filling as you scroll */}
          <div className="col-span-5">
            {/* Announced to screen readers as the steps change; not shown on screen (no visible numbering) */}
            <p className="sr-only" aria-live="polite">
              Step {active + 1} of {count}: {step.title}
            </p>
            <ol className="relative">
              <span className="absolute bottom-5 left-[15px] top-5 w-px bg-white/12" aria-hidden="true" />
              <motion.span
                style={{ scaleY: fill }}
                className="absolute bottom-5 left-[15px] top-5 w-px origin-top bg-gold"
                aria-hidden="true"
              />
              {PROCESS_STEPS.map((s, i) => {
                const reached = i <= active;
                return (
                  <li key={s.step} className="relative flex items-center gap-5 py-3.5">
                    <svg viewBox="2.5 1.5 19 21" className="relative h-8 w-8 shrink-0" aria-hidden="true">
                      <path
                        d={HEX}
                        className={`stroke-gold transition-[fill] duration-500 ${reached ? 'fill-gold' : 'fill-dark-surface'}`}
                        strokeWidth="1.4"
                      />
                    </svg>
                    <span
                      className={`font-display text-xl font-semibold transition-all duration-500 xl:text-2xl ${
                        i === active ? 'translate-x-2 text-white' : reached ? 'text-white/70' : 'text-white/45'
                      }`}
                    >
                      {s.title}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
        {/* Centred under both columns, like the other sections' buttons */}
        <div className="relative mt-[clamp(1.5rem,5vh,3.5rem)] flex justify-center">
          <SeeFullProcess />
        </div>
      </div>
    </section>
  );
};
