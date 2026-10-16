import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { PORTFOLIO_ITEMS } from '../constants/content.ts';
import { workSrc, workSrcSet } from '../lib/images.ts';
import { SectionHeader } from './common/SectionHeader.tsx';
import { useMediaQuery } from '../lib/motion.ts';
import { TiltCard } from './common/TiltCard.tsx';

type Item = (typeof PORTFOLIO_ITEMS)[number];
/** The row travels faster than the page scrolls, so the pinned scene stays short */
const SPEED = 1.5;

/** One project. `imageX` gives the photo a slow counter-drift inside its frame while the row travels. */
const ProjectPanel: React.FC<{ item: Item; imageX?: ReturnType<typeof useTransform<number, string>> }> = ({ item, imageX }) => (
  <Link to="/work" className="group block">
    <TiltCard radius="rounded-3xl" max={5} glare={true}>
    <div className="relative overflow-hidden rounded-3xl bg-dark-card">
      <div className="aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-[min(58vh,560px)]">
        <motion.img
          src={workSrc(item.image)}
          srcSet={workSrcSet(item.image)}
          sizes="(min-width: 1024px) 56vw, 84vw"
          alt=""
          width={1200}
          height={900}
          loading="lazy"
          decoding="async"
          style={imageX ? { x: imageX } : undefined}
          className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
      <span className="absolute left-5 top-5 rounded-full bg-ink/75 px-3.5 py-1.5 font-sans text-[13px] font-semibold text-white backdrop-blur-md">
        {item.category}
      </span>
      <span className="absolute bottom-5 left-5 rounded-full bg-gold px-3 py-1 font-sans text-xs font-semibold text-ink">
        Concept project
      </span>
      <span className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-lg transition-transform duration-500 ease-out group-hover:rotate-45">
        <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
      </span>
    </div>
    </TiltCard>
    <div className="mt-6">
      <h3 className="font-display text-2xl font-semibold leading-tight text-white transition-colors duration-300 group-hover:text-gold lg:text-[clamp(1.6rem,2.2vw,2.4rem)]">
        {item.title}
      </h3>
    </div>
    <p className="mt-3 max-w-[52ch] font-sans text-base leading-relaxed text-white/70">{item.description}</p>
  </Link>
);

/**
 * Home work showcase. Laptop and desktop: the section pins and vertical scrolling carries a row of large project
 * panels sideways, with a progress bar and counter. Phones, tablets and reduced motion: a swipeable row, no pinning.
 * Items are concept projects (labelled as such); no results are shown until real case studies exist.
 */
export const WorkPreview: React.FC = () => {
  const items = PORTFOLIO_ITEMS;
  const reduce = useReducedMotion();
  const wide = useMediaQuery('(min-width: 1024px)');
  const pinned = wide && !reduce;

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  // How far the row has to travel: its full width minus one screen
  useLayoutEffect(() => {
    if (!pinned) return;
    const measure = () => {
      const track = trackRef.current;
      if (track) setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const x = useTransform(progress, (v) => -v * distance);
  const imageX = useTransform(progress, (v) => `${(v - 0.5) * 10}%`);
  const bar = useTransform(progress, [0, 1], [0, 1]);

  if (!pinned) {
    return (
      <section className="relative bg-ink py-24 text-white sm:py-32">
        <div className="shell">
          <SectionHeader
            title="A look at the work."
            intro="Social, video and ad projects built to get a brand noticed. More case studies are on the way."
          />
        </div>
        <ul className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-16 sm:px-8 [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <li key={item.id} className="w-[84%] shrink-0 snap-center sm:w-[62%] md:w-[48%]">
              <ProjectPanel item={item} />
            </li>
          ))}
        </ul>
        <div className="shell mt-12 flex justify-center">
          <Link
            to="/work"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-gold px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-gold-light"
          >
            See all work
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Selected work"
      className="relative bg-ink text-white"
      style={{ height: `calc(100svh + ${Math.round(distance / SPEED)}px)` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-center gap-[4vw] pl-[6vw] pr-[6vw] will-change-transform">
          {/* Opening panel */}
          <div className="w-[30vw] max-w-[520px] shrink-0">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Selected work</p>
            <h2 className="mt-5 font-display text-[clamp(2.8rem,5vw,5.5rem)] font-semibold leading-[0.98] text-white">
              A look at the work.
            </h2>
            <p className="mt-6 max-w-md font-sans text-lg font-medium leading-relaxed text-white/75 sm:text-xl">
              Social, video and ad projects built to get a brand noticed. More case studies are on the way.
            </p>
            <p className="mt-10 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Scroll
              <span className="relative block h-px w-14 overflow-hidden bg-white/25">
                <span className="scroll-cue absolute inset-y-0 left-0 w-1/2 bg-gold" />
              </span>
            </p>
          </div>

          {items.map((item) => (
            <div key={item.id} className="w-[min(56vw,880px)] shrink-0">
              <ProjectPanel item={item} imageX={imageX} />
            </div>
          ))}

          {/* Closing panel */}
          <div className="flex w-[30vw] max-w-[480px] shrink-0 flex-col items-start">
            <p className="font-display text-[clamp(2.2rem,3.6vw,4rem)] font-semibold leading-[1.02]">
              Want work like this for your brand?
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/work"
                className="inline-flex h-14 items-center gap-2 rounded-full bg-gold px-7 text-base font-semibold text-ink transition-colors hover:bg-gold-light"
              >
                See all work
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-14 items-center gap-2 rounded-full border border-white/30 px-7 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
              >
                Start a project
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Progress: a filling line (no numbers) */}
        <div className="shell absolute inset-x-0 bottom-8 flex items-center" aria-hidden="true">
          <span className="relative h-px flex-1 bg-white/15">
            <motion.span style={{ scaleX: bar }} className="absolute inset-0 origin-left bg-gold" />
          </span>
        </div>
      </div>
    </section>
  );
};
