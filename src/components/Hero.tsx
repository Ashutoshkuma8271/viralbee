import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';
import { HERO_SLIDES, MARQUEE_ITEMS } from '../constants/content.ts';
import { heroMobileSrcSet, heroSrc, heroSrcSet } from '../lib/images.ts';
import { Marquee } from './Marquee.tsx';
import { Magnetic } from './common/Magnetic.tsx';
import { useMediaQuery, useRamp } from '../lib/motion.ts';

const SLIDE_MS = 5500;
const FADE_MS = 1000;
const MIN_GAP_MS = 900; // ignore taps/swipes that would start a new change before the last one settles
const EASE = [0.16, 1, 0.3, 1] as const;

// Outgoing copy fades as a block; incoming copy reveals eyebrow -> headline words -> subheadline
const copyVariants: Variants = {
  show: { opacity: 1, transition: { duration: 0 } },
  hide: { opacity: 0, transition: { duration: 0.35, ease: EASE } },
};
const eyebrowVariants: Variants = {
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
  hide: { opacity: 0, y: 12, transition: { duration: 0.25, ease: EASE } },
};
const headlineVariants: Variants = {
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.35,
    },
  },
  hide: {
    transition: { duration: 0.2 },
  },
};
const riseVariants: Variants = {
  show: { y: '0%', transition: { duration: 0.75, ease: EASE } },
  hide: { y: '110%', transition: { duration: 0, delay: 0.25 } },
};
const subheadVariants: Variants = {
  show: { opacity: 1, y: 0, transition: { duration: 0.65, delay: 0.65, ease: EASE } },
  hide: { opacity: 0, y: 12, transition: { duration: 0.25, ease: EASE } },
};

export const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);
  const lastChange = useRef(0);
  const count = HERO_SLIDES.length;

  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  // Images are requested only for slides in `mounted`: the current one, plus the next once the current is ready.
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0]));
  const [ready, setReady] = useState<Set<number>>(() => new Set());

  const reduceMotion = useReducedMotion();
  const inView = useInView(sectionRef, { amount: 0.35 });
  const autoplay = !reduceMotion;
  const paused = hoverPaused || tabHidden || !inView;
  const nextIdx = (active + 1) % count;

  const activeRef = useRef(0);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const changeTo = useCallback(
    (i: number, force = false) => {
      const now = performance.now();
      if (!force && now - lastChange.current < MIN_GAP_MS) return;
      const target = ((i % count) + count) % count;
      if (target === activeRef.current) return;
      lastChange.current = now;
      setPrev(activeRef.current);
      setActive(target);
    },
    [count],
  );

  // Mark an image ready only after it has been decoded, so the fade never stutters
  const markReady = useCallback((i: number, img: HTMLImageElement | null) => {
    const done = () => setReady((s) => (s.has(i) ? s : new Set(s).add(i)));
    if (img && typeof img.decode === 'function') img.decode().then(done, done);
    else done();
  }, []);

  useEffect(() => {
    setMounted((s) => {
      const want = [active];
      if (ready.has(active)) want.push(nextIdx);
      if (want.every((i) => s.has(i))) return s;
      const nextSet = new Set(s);
      want.forEach((i) => nextSet.add(i));
      return nextSet;
    });
  }, [active, ready, nextIdx]);

  // Autoplay: wait SLIDE_MS, and never advance to an image that isn't decoded yet
  useEffect(() => {
    if (!autoplay || paused || !ready.has(nextIdx)) return;
    const timer = window.setTimeout(() => changeTo(nextIdx, true), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [active, autoplay, paused, ready, nextIdx, changeTo]);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  /*
   * Cinematic scroll. The section is taller than the screen and its stage stays pinned (sticky) while you scroll
   * through that extra length, playing like the end of a film shot: the frame tilts back in 3D and shrinks into a
   * rounded screen, the photo keeps pushing in, the copy drifts up and fades, letterbox bars close in and the picture
   * dims. Reduced motion: no extra length and no movement.
   */
  const cinematic = !reduceMotion;
  const phone = useMediaQuery('(max-width: 767px)');
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const frameScale = useTransform(scrollYProgress, [0, 1], [1, cinematic ? (phone ? 0.9 : 0.82) : 1]);
  const frameRotate = useTransform(scrollYProgress, [0, 1], [0, cinematic ? (phone ? 6 : 12) : 0]);
  const frameRadius = useRamp(scrollYProgress, [0, 0.3], [0, cinematic ? 32 : 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, cinematic ? 1.22 : 1]);
  const contentY = useTransform(scrollYProgress, (v) => `${cinematic ? -(phone ? 12 : 30) * v : 0}%`);
  // Written as a formula so it stays at 0 once faded, however far past the end the scroll goes
  const contentOpacity = useTransform(scrollYProgress, (v) => (cinematic ? Math.max(0, 1 - v / 0.65) : 1));
  const barVh = useRamp(scrollYProgress, [0.15, 1], [0, cinematic ? 5 : 0]);
  const barHeight = useTransform(barVh, (v) => `${v}vh`);
  const shade = useRamp(scrollYProgress, [0.3, 1], [0, cinematic ? 0.35 : 0]);

  // Pointer depth (mouse devices only): the photo shifts a few pixels against the pointer, the honeycomb turns toward it
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  // Heavier film effects (grain, opening blur, honeycomb) only on laptop-size screens; phones stay light and fast
  const large = useMediaQuery('(min-width: 1024px)');
  const rich = cinematic && large;
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.6 });
  const py = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.6 });
  const photoX = useTransform(px, (v) => v * -24);
  const photoY = useTransform(py, (v) => v * -16);
  const onPointerMove = (e: React.PointerEvent) => {
    if (!cinematic || !finePointer || e.pointerType !== 'mouse') return;
    const box = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - box.left) / box.width - 0.5);
    rawY.set((e.clientY - box.top) / Math.min(box.height, window.innerHeight) - 0.5);
  };

  const slide = HERO_SLIDES[active];

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-roledescription="carousel"
      aria-label="Vyral Bee services"
      className={`relative -mt-20 overflow-x-clip bg-ink text-white lg:-mt-23 ${cinematic ? 'h-[135svh] lg:h-[150svh]' : ''}`}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > 50) changeTo(dx < 0 ? active + 1 : active - 1);
      }}
    >
      {/* Pinned stage with depth */}
      <div className={`${cinematic ? 'sticky top-0 h-svh' : 'relative min-h-svh'} overflow-hidden [perspective:1400px]`}>
      <motion.div
        style={{ scale: frameScale, rotateX: frameRotate, borderRadius: frameRadius }}
        className={`relative flex flex-col overflow-hidden bg-ink will-change-transform ${cinematic ? 'h-full' : 'min-h-svh'}`}
      >
      {/* Photo layer. The incoming photo fades in above the outgoing one, which stays fully visible beneath. */}
      <motion.div
        style={{ scale: imageScale, x: photoX, y: photoY }}
        // Laptop: the photo comes into focus. Phones: shown at full strength from the first frame, so it counts as
        // the main picture straight away (the letterbox opening still plays over it)
        initial={rich ? { opacity: 0.4, filter: 'blur(6px)' } : false}
        animate={rich ? { opacity: 1, filter: 'blur(0px)' } : undefined}
        transition={{ duration: 1.6, ease: EASE }}
        className="absolute inset-0 will-change-transform"
      >
        {!ready.has(active) && prev === null && <div className="skeleton absolute inset-0" aria-hidden="true" />}
        {HERO_SLIDES.map((s, i) => {
          if (!mounted.has(i)) return null;
          const isActive = i === active;
          const isPrev = i === prev;
          const shown = (isActive && ready.has(i)) || isPrev;
          return (
            <picture key={s.id}>
              <source media="(max-width: 767px)" srcSet={heroMobileSrcSet(s.image)} sizes="100vw" type="image/webp" />
              <img
                ref={(el) => {
                  if (el?.complete && el.naturalWidth) markReady(i, el);
                }}
                src={heroSrc(s.image)}
                srcSet={heroSrcSet(s.image)}
                sizes="100vw"
                alt={isActive ? s.alt : ''}
                aria-hidden={!isActive}
                fetchPriority={i === 0 ? 'high' : 'low'}
                decoding="async"
                onLoad={(e) => markReady(i, e.currentTarget)}
                onError={() => markReady(i, null)}
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  objectPosition: 'position' in s ? s.position : undefined,
                  zIndex: isActive ? 2 : isPrev ? 1 : 0,
                  opacity: shown ? 1 : 0,
                  transform: isActive || isPrev || reduceMotion ? 'scale(1)' : 'scale(1.08)',
                  transitionProperty: 'opacity, transform',
                  transitionDuration: isActive ? `${FADE_MS}ms, ${SLIDE_MS + FADE_MS}ms` : '0ms, 0ms',
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1), cubic-bezier(0.25, 0.1, 0.25, 1)',
                }}
              />
            </picture>
          );
        })}
      </motion.div>

      {/* Legibility: one scrim, strong behind the text and almost clear on the photo side, plus a light fade under the navbar */}
      <div className="scrim-hero absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/65 to-transparent" />
      {/* Film look: soft vignette and fine grain */}
      <div className="hero-vignette pointer-events-none absolute inset-0" aria-hidden="true" />
      {rich && <div className="film-grain pointer-events-none absolute" aria-hidden="true" />}
      {/* Cinematic light: a slow warm sweep across the frame, like a projector beam */}
      {cinematic && <div className="hero-sweep pointer-events-none absolute inset-0 z-[4]" aria-hidden="true" />}

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="shell relative z-10 flex flex-1 flex-col items-center justify-center pb-10 pt-28 text-center lg:items-start lg:pb-12 lg:pt-32 lg:text-left"
      >
        <h1 className="sr-only">
          Vyral Bee, a digital marketing agency for social media, design, video, websites and ads
        </h1>

        {/* All slides share one grid cell, so the block is as tall as the longest slide and nothing below jumps */}
        <div className="grid w-full" aria-live={paused ? 'polite' : 'off'}>
          {HERO_SLIDES.map((s, i) => {
            const isActive = i === active;
            const leadWords = s.lead ? s.lead.trim().split(/\s+/) : [];
            const accentWords = s.accent ? s.accent.trim().split(/\s+/) : [];
            const tailWords = s.tail ? s.tail.trim().split(/\s+/) : [];

            const tokens = [
              ...leadWords.map((word) => ({ word, isAccent: false })),
              ...accentWords.map((word) => ({ word, isAccent: true })),
              ...tailWords.map((word) => ({ word, isAccent: false })),
            ];
            const fullHeadline = tokens.map((t) => t.word).join(' ');

            return (
              <motion.div
                key={s.id}
                aria-hidden={!isActive}
                variants={reduceMotion ? undefined : copyVariants}
                initial={reduceMotion || i === 0 ? false : 'hide'}
                animate={isActive ? 'show' : 'hide'}
                style={reduceMotion ? { opacity: isActive ? 1 : 0 } : undefined}
                className={`col-start-1 row-start-1 self-start ${isActive ? '' : 'pointer-events-none'}`}
              >
                <motion.p
                  variants={reduceMotion ? undefined : eyebrowVariants}
                  className="font-sans text-base font-medium tracking-normal text-gold lg:text-lg"
                >
                  {s.label}
                </motion.p>
                <p className="text-on-photo mx-auto mt-4 max-w-[15ch] font-display text-fluid-hero font-semibold text-white sm:max-w-[16ch] lg:mx-0">
                  <span className="sr-only">{fullHeadline}</span>
                  <motion.span
                    variants={reduceMotion ? undefined : headlineVariants}
                    aria-hidden="true"
                    className="inline-block"
                  >
                    {tokens.map((token, w) => (
                      <span
                        key={w}
                        className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom"
                      >
                        <motion.span
                          variants={reduceMotion ? undefined : riseVariants}
                          className={`inline-block ${
                            token.isAccent
                              ? 'font-serif-display font-normal italic text-gold'
                              : 'font-display font-semibold text-white'
                          }`}
                        >
                          {token.word}
                          {w < tokens.length - 1 ? '\u00A0' : ''}
                        </motion.span>
                      </span>
                    ))}
                  </motion.span>
                </p>
                <motion.p
                  variants={reduceMotion ? undefined : subheadVariants}
                  className="mx-auto mt-6 max-w-xl font-sans text-base font-normal leading-relaxed text-white/75 sm:text-lg lg:mx-0 lg:mt-8 lg:text-xl lg:leading-relaxed"
                >
                  {s.description}
                </motion.p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          className="mt-9 flex w-full flex-col items-center gap-3.5 sm:w-auto sm:items-start lg:mt-12"
        >
          <div
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
            onMouseEnter={() => setHoverPaused(true)}
            onMouseLeave={() => setHoverPaused(false)}
            onFocus={() => setHoverPaused(true)}
            onBlur={() => setHoverPaused(false)}
          >
            <Magnetic className="flex w-full sm:w-auto">
              <Link
                to="/contact"
                className="group inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-gold px-8 font-sans text-base font-semibold text-ink transition-colors hover:bg-gold-light sm:w-[21rem]"
              >
                Get a free strategy call
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
            <Link
              to="/services"
              className="group inline-flex h-14 items-center justify-center gap-2.5 overflow-hidden rounded-full border border-white/35 bg-white/[0.06] px-8 font-sans text-base font-semibold text-white backdrop-blur-md transition-colors hover:border-white hover:bg-white hover:text-ink sm:w-[21rem]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={slide.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="truncate"
                >
                  Explore {slide.label}
                </motion.span>
              </AnimatePresence>
              <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <p className="font-sans text-sm font-medium text-white/60">
            Strategy, content and ads from one team in New Delhi.
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll cue (laptop and up), fades with the copy */}
      {cinematic && (
        <motion.div
          style={{ opacity: contentOpacity }}
          className="pointer-events-none absolute bottom-24 right-8 z-10 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 lg:flex xl:right-12"
          aria-hidden="true"
        >
          Scroll
          <span className="relative block h-px w-14 overflow-hidden bg-white/25">
            <span className="scroll-cue absolute inset-y-0 left-0 w-1/2 bg-gold" />
          </span>
        </motion.div>
      )}

      {/* Gold service ticker */}
      <Marquee items={MARQUEE_ITEMS} className="relative z-10 shrink-0 bg-gold py-4 text-ink lg:py-5" />

      {/* End of the shot: the picture dims and letterbox bars close in as you scroll on */}
      {cinematic && (
        <>
          <motion.div style={{ opacity: shade }} className="pointer-events-none absolute inset-0 z-20 bg-ink" aria-hidden="true" />
          <motion.div style={{ height: barHeight }} className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-black" aria-hidden="true" />
          <motion.div style={{ height: barHeight }} className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-black" aria-hidden="true" />
          {/* Opening shot: letterbox bars slide away once on load */}
          <motion.div
            initial={{ height: '12vh' }}
            animate={{ height: '0vh' }}
            transition={{ duration: 1.4, delay: 0.15, ease: EASE }}
            className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-black"
            aria-hidden="true"
          />
          <motion.div
            initial={{ height: '12vh' }}
            animate={{ height: '0vh' }}
            transition={{ duration: 1.4, delay: 0.15, ease: EASE }}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-black"
            aria-hidden="true"
          />
        </>
      )}
      </motion.div>
      </div>
    </section>
  );
};

export default Hero;
