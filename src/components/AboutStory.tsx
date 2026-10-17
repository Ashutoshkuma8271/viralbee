import React, { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ABOUT_PILLARS, BRAND } from '../constants/content.ts';
import { LazyImage } from './common/LazyImage.tsx';
import { teamSrcSet } from '../lib/images.ts';
import { Reveal } from './common/Reveal.tsx';
import { ImageReveal } from './common/ImageReveal.tsx';
import { TiltCard } from './common/TiltCard.tsx';
import { Spotlight } from './common/Spotlight.tsx';
import { HexLattice } from './common/HexLattice.tsx';
import { EASE, VIEWPORT, useMediaQuery, useRamp } from '../lib/motion.ts';

const HEX = 'M12 2 20.66 7v10L12 22l-8.66-5V7z';

/** One word of the quote: dim until the scroll reaches it, then fully lit (same pattern as the statement scene) */
const Word: React.FC<{ word: string; progress: MotionValue<number>; range: [number, number] }> = ({ word, progress, range }) => {
  // 0.4, not lower: even unread words stay above 3:1 for large text
  const opacity = useRamp(progress, range, [0.4, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {word}{' '}
    </motion.span>
  );
};

/**
 * About page: the story in the agency's own words. The team photo sits in depth (it turns flat as the section scrolls
 * in, pushes in slowly, tilts with the pointer), with a large gold hexagon behind it and a small cluster in front, each
 * moving at its own speed. The quote lights up word by word as you read; the three pillars rise in and react on hover.
 * Phones: no 3D turn, tilt or cluster parallax. Reduced motion: static, fully lit.
 */
export const AboutStory: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const reduce = !!useReducedMotion();
  const tablet = useMediaQuery('(min-width: 768px)');
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const depth = tablet && !reduce;
  const dimRows = depth && finePointer;
  const [hovered, setHovered] = useState<number | null>(null);

  // Photo turns flat as the section scrolls in (light spring)
  const { scrollYProgress: inP } = useScroll({ target: sectionRef, offset: ['start 85%', 'start 25%'] });
  const enter = useSpring(useRamp(inP, [0, 1], [0, 1]), { stiffness: 90, damping: 24, mass: 0.6 });
  const rotateY = useTransform(enter, (v) => (1 - v) * -16);
  const rotateX = useTransform(enter, (v) => (1 - v) * 8);
  const scale = useTransform(enter, (v) => 0.9 + v * 0.1);
  const y = useTransform(enter, (v) => (1 - v) * 60);

  // Push-in inside the photo over its own scroll range
  const { scrollYProgress: photoP } = useScroll({ target: photoRef, offset: ['start end', 'end start'] });
  const pushScale = useRamp(photoP, [0, 1], [1.18, 1.04]);
  const pushYNum = useRamp(photoP, [0, 1], [-5, 5]);
  const pushY = useTransform(pushYNum, (v) => `${v}%`);

  // Depth layers over the whole section
  const { scrollYProgress: secP } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const smooth = useSpring(secP, { stiffness: 80, damping: 26, mass: 0.5 });
  const backHexY = useRamp(smooth, [0, 1], [40, -40]);
  const clusterY = useRamp(smooth, [0, 1], [70, -70]);
  const clusterRotate = useRamp(smooth, [0, 1], [0, 20]);
  const latticeY = useRamp(smooth, [0, 1], [30, -30]);
  const markY = useRamp(smooth, [0, 1], [24, -24]);

  // Quote read-along
  const { scrollYProgress: quoteP } = useScroll({ target: quoteRef, offset: ['start 80%', 'end 50%'] });
  const words = BRAND.aboutCopy.split(' ');
  const step = 1 / words.length;

  return (
    <section ref={sectionRef} className="relative overflow-x-clip bg-ink py-24 sm:py-32">
      {/* Atmosphere (decorative) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(242,165,22,0.4)_50%,transparent)]" />
        <motion.div
          className={`lattice-fade-left absolute inset-y-0 right-0 w-[70%] md:w-[55%] ${depth ? 'will-change-transform' : ''}`}
          style={depth ? { y: latticeY } : undefined}
        >
          <HexLattice cols={tablet ? 16 : 8} rows={tablet ? 14 : 10} r={34} gold={[[9, 3], [12, 7], [6, 10]]} className="h-full w-full" />
        </motion.div>
      </div>

      <div className="shell relative grid gap-14 lg:grid-cols-12 lg:gap-20">
        {/* Left: the photo as an object in depth (hugs the photo, centred against the text, so the layers sit on it) */}
        <div className="relative self-start lg:col-span-5 lg:self-center">
          {/* Warm gold glow behind the photo */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(242,165,22,0.10),transparent)]"
            aria-hidden="true"
          />
          {/* Behind: a large gold hexagon outline peeking from the top-left corner, drifting against the photo */}
          <motion.svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute -left-10 -top-12 h-48 w-48 sm:-left-14 sm:-top-16 sm:h-64 sm:w-64"
            style={depth ? { y: backHexY } : undefined}
            aria-hidden="true"
          >
            <motion.path
              d={HEX}
              fill="none"
              stroke="rgba(242,165,22,0.4)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              initial={reduce ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 1.6, ease: EASE }}
            />
          </motion.svg>

          <div className="relative" style={depth ? { perspective: 1600 } : undefined}>
            {/* Scroll-linked turn on this outer wrapper; pointer tilt (TiltCard) on the inner one, so they never fight */}
            <motion.div className="origin-left" style={depth ? { rotateY, rotateX, scale, y } : undefined}>
              <ImageReveal from="left">
                <TiltCard radius="rounded-3xl" max={4} glare>
                  <div ref={photoRef} className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                    {/* Push-in on tablets and laptops; phones hold the settled zoom (their processors are the weakest) */}
                    <motion.div className="absolute inset-0" style={depth ? { scale: pushScale, y: pushY } : tablet || reduce ? undefined : { scale: 1.04 }}>
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
                    {/* Colour: warm gold soft light, a touch of ink at the bottom, a fine inner edge */}
                    {/* Plain tint, no blend mode: a blend made the browser re-blend the whole photo on every scrolled frame */}
                    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(242,165,22,0.12),transparent_55%)]" aria-hidden="true" />
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" aria-hidden="true" />
                    <span className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" aria-hidden="true" />
                  </div>
                </TiltCard>
              </ImageReveal>
            </motion.div>
          </div>

          {/* In front: a small cluster of hexagons over the bottom-right corner, moving faster than the photo */}
          <motion.svg
            viewBox="0 0 80 72"
            className="pointer-events-none absolute -bottom-8 -right-3 h-24 w-28 sm:-bottom-10 sm:-right-8 sm:h-32 sm:w-36"
            style={depth ? { y: clusterY, rotate: clusterRotate } : undefined}
            aria-hidden="true"
          >
            <path d="M24 4 41.3 14v20L24 44 6.7 34V14z" fill="#F2A516" />
            <path d="M52 24 69.3 34v20L52 64 34.7 54V34z" fill="none" stroke="#F2A516" strokeWidth="2" />
            <path d="M58 2 67.5 7.5v11L58 24 48.5 18.5v-11z" fill="rgba(255,255,255,0.10)" />
          </motion.svg>
        </div>

        {/* Right: the quote, the paragraph and the three pillars */}
        <div className="flex flex-col justify-center lg:col-span-7">
          <motion.span
            className="-mb-4 block select-none font-serif-display text-[clamp(6rem,10vw,11rem)] leading-[0.8] text-gold/25 sm:-mb-6"
            style={depth ? { y: markY } : undefined}
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1, ease: EASE }}
            aria-hidden="true"
          >
            “
          </motion.span>
          <blockquote>
            <p ref={quoteRef} className="font-serif-display text-[clamp(1.9rem,2.2vw+1rem,3.4rem)] leading-[1.12] text-white">
              {reduce ? (
                BRAND.aboutCopy
              ) : (
                <>
                  <span className="sr-only">{BRAND.aboutCopy}</span>
                  <span aria-hidden="true">
                    {words.map((word, i) => (
                      <Word key={i} word={word} progress={quoteP} range={[i * step, Math.min(1, (i + 1.5) * step)]} />
                    ))}
                  </span>
                </>
              )}
            </p>
          </blockquote>

          <Reveal delay={0.1}>
            <p className="mt-10 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">{BRAND.aboutStoryCopy}</p>
          </Reveal>

          <h2 className="sr-only">How we work</h2>
          <ul className="mt-12" onMouseLeave={() => setHovered(null)}>
            {ABOUT_PILLARS.map((pillar, i) => {
              const dimmed = dimRows && hovered !== null && hovered !== i;
              return (
                <motion.li
                  key={pillar.title}
                  className="relative"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                >
                  {/* Row divider draws in from the left */}
                  <motion.span
                    className="absolute inset-x-0 top-0 h-px origin-left bg-white/12"
                    initial={reduce ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 1.1, delay: 0.1 + i * 0.1, ease: EASE }}
                    aria-hidden="true"
                  />
                  <div
                    onMouseEnter={() => setHovered(i)}
                    className={`group relative flex items-start gap-4 overflow-hidden py-7 transition-opacity duration-500 sm:gap-6 ${dimmed ? 'opacity-40' : 'opacity-100'}`}
                  >
                    <Spotlight size={260} />
                    {/* Hexagon bullet draws itself, then fills gold on hover */}
                    <svg viewBox="0 0 24 24" className="relative mt-1 h-6 w-6 shrink-0" aria-hidden="true">
                      <motion.path
                        d={HEX}
                        stroke="#F2A516"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        className="fill-gold/0 transition-[fill] duration-500 group-hover:fill-gold"
                        initial={reduce ? false : { pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={VIEWPORT}
                        transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: EASE }}
                      />
                    </svg>
                    <div className="relative flex flex-1 flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-8">
                      <h3 className="font-display text-[clamp(1.4rem,1.5vw+0.8rem,2rem)] font-semibold leading-tight text-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-2 sm:w-[19rem] sm:shrink-0">
                        {pillar.title}
                      </h3>
                      <p className="text-base text-white/70 transition-colors duration-300 group-hover:text-white sm:text-[17px]">{pillar.text}</p>
                    </div>
                    {/* Gold hairline draws under the row on hover */}
                    <span
                      className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                      aria-hidden="true"
                    />
                  </div>
                  {i === ABOUT_PILLARS.length - 1 && <span className="absolute inset-x-0 bottom-0 h-px bg-white/12" aria-hidden="true" />}
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
