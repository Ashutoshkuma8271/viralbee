import React, { useRef, useState } from 'react';
import { PORTFOLIO_ITEMS } from '../constants/content.ts';
import { FilterRail } from './common/FilterRail.tsx';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { workSrc, workSrcSet } from '../lib/images.ts';
import { Reveal } from './common/Reveal.tsx';
import { useRamp } from '../lib/motion.ts';
import { TiltCard } from './common/TiltCard.tsx';

const CATEGORIES = ['All', 'Social', 'Reels', 'Ads', 'Websites', 'Branding'] as const;

type Item = (typeof PORTFOLIO_ITEMS)[number];

/**
 * One project, magazine style: a large photo that settles from a slight zoom as it scrolls through the screen,
 * beside its category, title and description. Every other row is mirrored.
 */
const EditorialProject: React.FC<{ item: Item; flip: boolean }> = ({ item, flip }) => {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useRamp(scrollYProgress, [0, 0.5], [reduce ? 1 : 1.18, 1]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%']);

  return (
    <li ref={ref} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <Reveal direction={flip ? 'right' : 'left'} className={`lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
        <TiltCard radius="rounded-[28px]" max={5} glare={true}>
        <div className="relative overflow-hidden rounded-[28px] bg-dark-card">
          <div className="aspect-[4/3] overflow-hidden lg:aspect-[16/11]">
            <motion.img
              src={workSrc(item.image)}
              srcSet={workSrcSet(item.image)}
              sizes="(min-width: 1024px) 58vw, 100vw"
              alt=""
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
              style={{ scale, y }}
              className="h-[112%] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          </div>
          <span className="absolute left-5 top-5 rounded-full bg-ink/75 px-3.5 py-1.5 font-sans text-[13px] font-semibold text-white backdrop-blur-md">
            {item.category}
          </span>
          <span className="absolute bottom-5 left-5 rounded-full bg-gold px-3 py-1 font-sans text-xs font-semibold text-ink">
            Concept project
          </span>
        </div>
        </TiltCard>
      </Reveal>

      <Reveal direction="up" delay={0.1} className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{item.category}</p>
        <h3 className="mt-4 text-balance font-display text-3xl font-semibold leading-tight text-white sm:text-4xl xl:text-5xl">
          {item.title}
        </h3>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-white/70">{item.description}</p>
      </Reveal>
    </li>
  );
};

/**
 * Work page gallery. These are concept projects, so each card is labelled as one and no results are shown.
 * Add real results to an item only when the client has agreed to share them.
 */
export const WorkGallery: React.FC = () => {
  const [category, setCategory] = useState<string>('All');
  const items = category === 'All' ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter((item) => item.category === category);

  return (
    <section className="relative bg-ink py-20 sm:py-28">
      <div className="shell">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <h2 className="font-display text-fluid-h3 font-semibold text-white lg:text-4xl">
            {items.length} {items.length === 1 ? 'project' : 'projects'}
          </h2>
          <FilterRail
            label="Filter work by category"
            options={CATEGORIES}
            value={category}
            onChange={setCategory}
            className="md:max-w-[72%]"
          />
        </div>

        {/* Editorial list: big alternating image and text rows; key restarts the entrances when the filter changes */}
        <ul key={category} className="mt-14 space-y-20 sm:mt-20 sm:space-y-28 lg:space-y-36">
          {items.map((item, idx) => (
            <EditorialProject key={item.id} item={item} flip={idx % 2 === 1} />
          ))}
        </ul>
      </div>
    </section>
  );
};
