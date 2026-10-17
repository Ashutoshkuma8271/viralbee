import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { SERVICES, SERVICES_DEEP_DIVE, SERVICE_INCLUDES } from '../constants/content.ts';
import { LazyImage } from './common/LazyImage.tsx';
import { PlatformLogos } from './common/PlatformLogos.tsx';
import { serviceSrc, serviceSrcSet } from '../lib/images.ts';
import { Reveal } from './common/Reveal.tsx';
import { ImageReveal } from './common/ImageReveal.tsx';
import { TiltCard } from './common/TiltCard.tsx';
import { RevealWords } from './common/RevealWords.tsx';
import { Spotlight } from './common/Spotlight.tsx';
import { Magnetic } from './common/Magnetic.tsx';
import { HexLattice } from './common/HexLattice.tsx';
import { EASE, VIEWPORT, useMediaQuery, useRamp } from '../lib/motion.ts';

const HEX = 'M12 2 20.66 7v10L12 22l-8.66-5V7z';

type Service = (typeof SERVICES)[number];

interface Modes {
  /** Tablets and laptops with motion allowed: 3D turn, parallax, drawing */
  depth: boolean;
  /** Mouse devices with motion allowed: row dimming and hover slides */
  hover: boolean;
  reduce: boolean;
}

/** "What's included" list: hairline rows that draw in, hexagon bullets, hover focus on one row */
const IncludedList: React.FC<{ items: string[]; modes: Modes; wide: boolean }> = ({ items, modes, wide }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  // Two columns only for long lists that sit in the wide text column; in the narrow one they would wrap badly
  const twoCols = items.length >= 7 && wide;
  return (
    <div className="relative mt-8 overflow-hidden rounded-2xl" onMouseLeave={() => setHovered(null)}>
      <Spotlight size={300} />
      <ul className={`relative grid text-left ${twoCols ? 'xl:grid-cols-2 xl:gap-x-8' : ''}`}>
        {items.map((item, i) => {
          const dimmed = modes.hover && hovered !== null && hovered !== i;
          const delay = Math.min(i * 0.06, 0.5);
          return (
            <motion.li
              key={item}
              className="relative"
              initial={modes.reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, delay, ease: EASE }}
            >
              {/* Hairline draws in left to right */}
              <motion.span
                className="absolute inset-x-0 top-0 h-px origin-left bg-white/12"
                initial={modes.reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.9, delay, ease: EASE }}
                aria-hidden="true"
              />
              <div
                onMouseEnter={() => setHovered(i)}
                className={`group flex items-start gap-3.5 py-4 transition-opacity duration-500 ${dimmed ? 'opacity-45' : 'opacity-100'}`}
              >
                <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true">
                  <motion.path
                    d={HEX}
                    stroke="#F2A516"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                    className="fill-gold/0 transition-[fill] duration-500 group-hover:fill-gold"
                    initial={modes.reduce ? false : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 0.9, delay: delay + 0.1, ease: EASE }}
                  />
                </svg>
                <span className="font-sans text-base leading-snug text-white/75 transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white motion-safe:group-hover:translate-x-1.5 sm:text-[17px]">
                  {item}
                </span>
              </div>
            </motion.li>
          );
        })}
      </ul>
      <span className="absolute inset-x-0 bottom-0 h-px bg-white/12" aria-hidden="true" />
    </div>
  );
};

/** One service: photo as a 3D object with hex layers, title, list and button */
const ServiceBlock: React.FC<{ service: Service; idx: number; modes: Modes }> = ({ service, idx, modes }) => {
  const detail = SERVICE_INCLUDES[service.id];
  const photoLeft = idx % 2 === 0; // 1, 3, 5: photo left; 2, 4, 6: photo right. Equal halves, so every photo is the same size
  const towardText = photoLeft ? 1 : -1;
  const blockRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const [logosIn, setLogosIn] = useState(modes.reduce);

  // Photo turns flat as the block scrolls in (light spring)
  const { scrollYProgress: inP } = useScroll({ target: blockRef, offset: ['start 90%', 'start 35%'] });
  const enter = useSpring(useRamp(inP, [0, 1], [0, 1]), { stiffness: 90, damping: 24, mass: 0.6 });
  const rotateY = useTransform(enter, (v) => (1 - v) * 14 * towardText);
  const rotateX = useTransform(enter, (v) => (1 - v) * 6);
  const scale = useTransform(enter, (v) => 0.92 + v * 0.08);
  const y = useTransform(enter, (v) => (1 - v) * 50);

  // Push-in inside the photo over its own scroll range
  const { scrollYProgress: photoP } = useScroll({ target: photoRef, offset: ['start end', 'end start'] });
  const pushScale = useRamp(photoP, [0, 1], [1.16, 1.04]);
  const pushYNum = useRamp(photoP, [0, 1], [-4, 4]);
  const pushY = useTransform(pushYNum, (v) => `${v}%`);

  // Depth layers: hex cluster drifts against the scroll; warm glow on the block in view
  const { scrollYProgress: passP } = useScroll({ target: blockRef, offset: ['start end', 'end start'] });
  const pass = useSpring(passP, { stiffness: 80, damping: 26, mass: 0.5 });
  const clusterY = useRamp(pass, [0, 1], [50, -50]);
  const glow = useTransform(pass, (v) => Math.max(0, 1 - Math.abs(v - 0.5) / 0.3));

  return (
    <article
      ref={blockRef}
      id={service.id}
      className="relative grid scroll-mt-32 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14 xl:gap-16"
    >
      {/* Photo column */}
      <div className={`relative lg:col-span-6 ${photoLeft ? '' : 'lg:order-2'}`}>
        {/* Soft warm glow behind the photo of the service in view (about 8%) */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[125%] w-[125%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(242,165,22,0.08),transparent)]"
          style={modes.depth ? { opacity: glow } : undefined}
          aria-hidden="true"
        />
        {/* Behind: gold hexagon outline at the outer top corner, drawn on entry */}
        <svg
          viewBox="0 0 24 24"
          className={`pointer-events-none absolute -top-10 h-36 w-36 sm:-top-14 sm:h-48 sm:w-48 ${photoLeft ? '-left-8 sm:-left-12' : '-right-8 sm:-right-12'}`}
          aria-hidden="true"
        >
          <motion.path
            d={HEX}
            fill="none"
            stroke="rgba(242,165,22,0.4)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            initial={modes.reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.5, ease: EASE }}
          />
        </svg>

        <div className="relative" style={modes.depth ? { perspective: 1600 } : undefined}>
          {/* Scroll-linked turn on this outer wrapper; pointer tilt (TiltCard) inside, so they never fight */}
          <motion.div className={photoLeft ? 'origin-left' : 'origin-right'} style={modes.depth ? { rotateY, rotateX, scale, y } : undefined}>
            <ImageReveal from={photoLeft ? 'left' : 'right'}>
              <TiltCard radius="rounded-3xl" max={4} glare>
                <div ref={photoRef} className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                  <motion.div className="absolute inset-0" style={modes.depth ? { scale: pushScale, y: pushY } : undefined}>
                    <LazyImage
                      src={serviceSrc(service.image)}
                      srcSet={serviceSrcSet(service.image)}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      alt=""
                      width={1920}
                      height={1200}
                      wrapperClassName="h-full w-full"
                    />
                  </motion.div>
                  <span className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" aria-hidden="true" />
                </div>
              </TiltCard>
            </ImageReveal>
          </motion.div>
        </div>

        {/* In front: two small hexagons over the opposite bottom corner, moving faster than the photo */}
        <motion.svg
          viewBox="0 0 64 56"
          className={`pointer-events-none absolute -bottom-7 h-16 w-20 sm:-bottom-9 sm:h-24 sm:w-28 ${photoLeft ? '-right-2 sm:-right-6' : '-left-2 sm:-left-6'}`}
          style={modes.depth ? { y: clusterY } : undefined}
          aria-hidden="true"
        >
          <path d="M20 4 35.6 13v18L20 40 4.4 31V13z" fill="#F2A516" />
          <path d="M44 18 57 25.5v15L44 48 31 40.5v-15z" fill="none" stroke="#F2A516" strokeWidth="2" />
        </motion.svg>
      </div>

      {/* Text column */}
      <Reveal
        direction={photoLeft ? 'right' : 'left'}
        className={`relative text-left lg:col-span-6 ${photoLeft ? '' : 'lg:order-1'}`}
      >
        <motion.div
          className={`logos-stagger relative ${logosIn ? 'is-in' : ''}`}
          style={{ ['--from' as string]: photoLeft ? '24px' : '-24px' }}
          onViewportEnter={() => setLogosIn(true)}
          viewport={VIEWPORT}
        >
          <PlatformLogos platforms={service.platforms} />
        </motion.div>
        <h3 className="relative mt-6 text-balance font-display text-[clamp(2.2rem,3.4vw+0.8rem,4.2rem)] font-semibold leading-[1.02] text-white">
          <RevealWords text={service.title} wordClassName="text-silver" />
        </h3>
        <p className="relative mt-5 max-w-lg font-sans text-lg leading-relaxed text-white/75 sm:text-xl">{service.description}</p>

        <IncludedList items={detail.items} modes={modes} wide={false} />

        {/* Button centred in the text column */}
        <div className="relative mt-10 flex justify-center">
          <Magnetic>
            <Link
              to="/contact"
              className="btn-glint group inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 font-sans text-[15px] font-semibold text-white transition-colors hover:border-gold hover:bg-gold hover:text-ink"
            >
              {detail.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </Magnetic>
        </div>
      </Reveal>
    </article>
  );
};

/** Between two services: a thin line with a gold dot that travels down as you scroll (transform only) */
const Connector: React.FC<{ reduce: boolean }> = ({ reduce }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 25%'] });
  const t = useRamp(scrollYProgress, [0, 1], [0, 1]);
  const dotY = useTransform(t, (v) => `${v * 100}%`);
  return (
    <div ref={ref} className="relative mx-auto flex h-24 w-6 justify-center lg:h-32" aria-hidden="true">
      <span className="absolute inset-y-2 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
      <span className="absolute inset-y-2 left-1/2 w-0">
        <motion.span
          className="absolute -left-[5px] -top-[5px] block h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_14px_rgba(242,165,22,0.6)]"
          style={reduce ? { top: '50%' } : { top: dotY }}
        />
      </span>
    </div>
  );
};

/** Desktop rail: six hexagons joined by a line that fills gold as you scroll; the one in view fills and grows */
const ProgressRail: React.FC<{ progress: MotionValue<number>; active: number; reduce: boolean }> = ({ progress, active, reduce }) => {
  const fill = useSpring(useRamp(progress, [0, 1], [0, 1]), { stiffness: 120, damping: 28, mass: 0.4 });
  return (
    <nav aria-label="Services on this page" className="sticky top-[30svh] hidden lg:block">
      <div className="relative flex flex-col items-center gap-3">
        <span className="absolute bottom-[22px] top-[22px] w-px bg-white/12" aria-hidden="true" />
        <motion.span
          className="absolute bottom-[22px] top-[22px] w-px origin-top bg-gold"
          style={{ scaleY: reduce ? 1 : fill }}
          aria-hidden="true"
        />
        {SERVICES.map((s, i) => {
          const on = i === active;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={on ? 'true' : undefined}
              className="group/rl relative flex h-11 w-11 items-center justify-center rounded-full bg-ink"
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-5 w-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? 'scale-125' : 'scale-100'}`}
                aria-hidden="true"
              >
                <path
                  d={HEX}
                  stroke="#F2A516"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  className={`transition-[fill] duration-500 ${on ? 'fill-gold' : 'fill-ink group-hover/rl:fill-gold/40'}`}
                />
              </svg>
              <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-full bg-ink/90 px-3 py-1 font-sans text-sm text-white opacity-0 transition-opacity duration-300 group-hover/rl:opacity-100 group-focus-visible/rl:opacity-100">
                {s.title}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

/**
 * Services page: what each of the six services includes, as one scrolling journey. Each block has a photo that turns flat in 3D as it arrives (pointer tilt inside, slow push-in, hexagons behind and in
 * front), and its list as drawing hairline rows. A thin line with a travelling gold dot links the blocks, and on
 * laptops a sticky rail on the left shows progress and jumps to each service. The ids stay the header chip targets.
 * Phones: no 3D turn, tilt, rail or parallax. Reduced motion: static and complete.
 */
export const ServiceDeepDives: React.FC = () => {
  const reduce = !!useReducedMotion();
  const tablet = useMediaQuery('(min-width: 768px)');
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const modes: Modes = { depth: tablet && !reduce, hover: tablet && fine && !reduce, reduce };
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Rail progress over the six blocks; the active service is the one around the middle of the screen
  const { scrollYProgress: blocksP } = useScroll({ target: listRef, offset: ['start 50%', 'end 50%'] });
  useMotionValueEvent(blocksP, 'change', (v) => {
    const i = Math.min(SERVICES.length - 1, Math.max(0, Math.floor(v * SERVICES.length)));
    if (i !== active) setActive(i);
  });

  // Backdrop lattice drifts slowly with the section
  const { scrollYProgress: secP } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const latticeY = useRamp(useSpring(secP, { stiffness: 80, damping: 26, mass: 0.5 }), [0, 1], [60, -60]);

  return (
    <section ref={sectionRef} id="deep-dive" className="relative overflow-x-clip bg-ink py-24 sm:py-32">
      {/* Backdrop (decorative) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          className={`lattice-fade-left absolute inset-y-0 right-0 w-[70%] md:w-[50%] ${modes.depth ? 'will-change-transform' : ''}`}
          style={modes.depth ? { y: latticeY } : undefined}
        >
          <HexLattice cols={tablet ? 14 : 8} rows={tablet ? 40 : 30} r={34} gold={[[8, 4], [11, 13], [6, 22], [10, 31]]} className="h-full w-full" />
        </motion.div>
      </div>

      <div className="shell relative">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-14">
          <h2 className="text-balance font-display text-[clamp(2.6rem,4.6vw+0.5rem,5.5rem)] font-semibold leading-[1.0] text-white lg:col-span-7">
            <RevealWords text={SERVICES_DEEP_DIVE.headingLead} wordClassName="text-silver" />{' '}
            <RevealWords text={SERVICES_DEEP_DIVE.headingFollow} delay={0.15} wordClassName="text-gold-lit" />
            <span className="sr-only"> ({SERVICES.length} services)</span>
          </h2>
          <Reveal delay={0.15} className="lg:col-span-5 lg:justify-self-end">
            <p className="max-w-md font-sans text-lg font-medium leading-relaxed text-white/75 sm:text-xl">{SERVICES_DEEP_DIVE.intro}</p>
          </Reveal>
        </div>

        <div className="mt-14 sm:mt-20 lg:mt-24 lg:grid lg:grid-cols-[2.75rem_1fr] lg:gap-10 xl:gap-14">
          <div className="hidden lg:block">
            <ProgressRail progress={blocksP} active={active} reduce={reduce} />
          </div>
          <div ref={listRef} className="flex min-w-0 flex-col">
            {SERVICES.map((service, idx) => (
              <React.Fragment key={service.id}>
                {idx > 0 && <Connector reduce={reduce} />}
                <ServiceBlock service={service} idx={idx} modes={modes} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
