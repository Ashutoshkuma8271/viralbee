import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { BRAND } from '../constants/content.ts';
import { LazyImage } from './common/LazyImage.tsx';
import { teamSrcSet } from '../lib/images.ts';
import { Reveal } from './common/Reveal.tsx';
import { ImageReveal } from './common/ImageReveal.tsx';
import { TiltCard } from './common/TiltCard.tsx';

// From the original About section
const PILLARS = [
  { title: 'Strategic focus', text: 'Everything is aligned to revenue, not to likes.' },
  { title: 'Speed and quality', text: 'Rapid studio execution without cutting corners.' },
  { title: 'A proven stack', text: 'Social, web and ads working as one system.' },
];

/** About page: the story in the agency's own words, with the team photo and the three ways we work. */
export const AboutStory: React.FC = () => {
  const photoRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ['start end', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['-6%', '6%']);

  return (
    <section className="relative bg-ink py-24 sm:py-32">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-20">
        <ImageReveal from="left" className="lg:col-span-5">
          <TiltCard radius="rounded-3xl" max={4} glare={true}>
            <div ref={photoRef} className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <motion.div style={{ y: photoY }} className="absolute -inset-y-[8%] inset-x-0">
                <LazyImage
                  src="/images/sections/team-1200.webp"
                  srcSet={teamSrcSet}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  alt="A marketing team working together on laptops at a shared table"
                  width={1200}
                  height={1500}
                  wrapperClassName="h-full w-full"
                />
              </motion.div>
            </div>
          </TiltCard>
        </ImageReveal>

        <Reveal direction="right" className="flex flex-col justify-center lg:col-span-7">
          <p className="font-display text-[1.7rem] font-medium leading-[1.2] text-white sm:text-[2.1rem] lg:text-[2.35rem]">
            “{BRAND.aboutCopy}”
          </p>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/75">
            Design, video, websites and paid media are planned together, so every post, page and ad looks like the same
            brand and pushes toward the same goal: more enquiries.
          </p>

          <ul className="mt-12 border-t border-white/12">
            {PILLARS.map((pillar) => (
              <li
                key={pillar.title}
                className="flex flex-col gap-1 border-b border-white/12 py-6 sm:flex-row sm:items-baseline sm:gap-8"
              >
                <h2 className="font-display text-xl font-semibold text-white sm:w-56 sm:shrink-0">{pillar.title}</h2>
                <p className="text-base text-white/70">{pillar.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
};
