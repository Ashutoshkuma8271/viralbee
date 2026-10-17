import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { FIRST_MONTH } from '../constants/content.ts';
import { SectionHeader } from './common/SectionHeader.tsx';
import { Reveal } from './common/Reveal.tsx';
import { Scene3D } from './common/Scene3D.tsx';
import { TiltCard } from './common/TiltCard.tsx';

/** About page: the four weeks after a client signs, shown as a connected row of stages. */
export const FirstMonth: React.FC = () => {
  const reduce = useReducedMotion();
  return (
    <section className="relative bg-dark-surface py-24 sm:py-32">
      <div className="shell">
        <SectionHeader
          title="Your first month with us."
          intro="From the kick-off call to the first report, here is what happens after you say yes."
        />

        <Scene3D>
          <ol className="relative mt-14 grid gap-6 sm:mt-20 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
            {/* Connector through the week markers on wide screens */}
            <span className="absolute left-0 right-0 top-[27px] hidden h-px bg-white/12 xl:block" aria-hidden="true" />

            {FIRST_MONTH.map((stage, idx) => (
              <Reveal as="li" key={stage.week} delay={idx * 0.1} className="relative flex flex-col xl:pr-8">
                <span
                  // Same style for every week: they are stages in order, not tabs to pick from
                  className="relative z-10 inline-flex h-14 items-center self-start rounded-full border border-gold/35 bg-dark-surface px-6 font-display text-lg font-semibold text-gold"
                >
                  {stage.week}
                </span>
                {/* flex-1: every card stretches to the tallest in its row, so all four end on the same line */}
                <TiltCard className="mt-6 flex-1 xl:mt-8" max={5}>
                <div className="h-full rounded-3xl border border-white/8 bg-dark-card p-7">
                  <h3 className="font-display text-2xl font-semibold text-white">{stage.title}</h3>
                  <ul className="mt-5 space-y-3">
                    {stage.points.map((point, p) => (
                      <li key={point} className="flex items-start gap-3 text-base leading-snug text-white/70">
                        {/* Ticks pop in one after another, the same spring as the Services and Packages lists */}
                        <motion.span
                          className="mt-0.5 shrink-0"
                          initial={reduce ? false : { scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: 'spring', stiffness: 350, damping: 20, delay: 0.2 + p * 0.06 }}
                        >
                          <Check className="h-4 w-4 text-gold" strokeWidth={2.5} aria-hidden="true" />
                        </motion.span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                </TiltCard>
              </Reveal>
            ))}
          </ol>
        </Scene3D>
      </div>
    </section>
  );
};
