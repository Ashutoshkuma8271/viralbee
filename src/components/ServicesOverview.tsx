import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { SERVICES } from '../constants/content.ts';
import { PlatformLogos } from './common/PlatformLogos.tsx';
import { SectionHeader } from './common/SectionHeader.tsx';
import { serviceSrc, serviceSrcSet } from '../lib/images.ts';
import { EASE, VIEWPORT, useMediaQuery } from '../lib/motion.ts';

interface ServicesOverviewProps {
  /** Show the "all services" link and row links to /services (off on the Services page itself) */
  linked?: boolean;
}

/**
 * Home: the six services as an editorial index. Oversized titles in a numbered list; on laptops a photo of the
 * hovered service follows the mouse and the other rows step back. On phones and touch screens every row carries its
 * own small photo instead. Each row opens that service on the Services page.
 */
export const ServicesOverview: React.FC<ServicesOverviewProps> = ({ linked = true }) => {
  const reduce = useReducedMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const follow = finePointer && !reduce;
  const [hovered, setHovered] = useState<number | null>(null);
  const lastHovered = useRef(0);
  if (hovered !== null) lastHovered.current = hovered;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.5 });
  const y = useSpring(my, { stiffness: 180, damping: 22, mass: 0.5 });
  const vx = useVelocity(x);
  const vy = useVelocity(y);
  const lean = useSpring(
    useTransform(vx, (v) => Math.max(-8, Math.min(8, v * 0.01))),
    { stiffness: 120, damping: 20 },
  );
  const rotY = useSpring(useTransform(vx, [-1200, 1200], [-10, 10]), { stiffness: 140, damping: 22 });
  const rotX = useSpring(useTransform(vy, [-1200, 1200], [10, -10]), { stiffness: 140, damping: 22 });

  return (
    <section
      id="services"
      className="relative bg-wax py-24 text-ink sm:py-32"
      onPointerMove={(e) => {
        if (!follow) return;
        mx.set(e.clientX);
        my.set(e.clientY);
      }}
    >
      <div className="shell">
        <SectionHeader
          tone="light"
          title="Everything your brand needs to be seen, in one place."
          intro="Six services, one plan. Start with what you need now and add the rest as you grow."
        />

        <ul className="mt-14 border-t border-ink/12 sm:mt-20" onMouseLeave={() => setHovered(null)}>
          {SERVICES.map((service, idx) => {
            const dimmed = follow && hovered !== null && hovered !== idx;
            const row = (
              <div
                className={`grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 py-7 transition-opacity duration-500 sm:gap-x-8 sm:py-9 lg:grid-cols-12 lg:gap-x-8 lg:py-10 ${
                  dimmed ? 'opacity-30' : 'opacity-100'
                }`}
              >
                {/* Title: rises out of a mask as the row scrolls in, slides right on hover */}
                <div className="min-w-0 lg:col-span-7">
                  <span className="block overflow-hidden pb-[0.08em]">
                    <motion.span
                      variants={{ hidden: { y: '105%' }, show: { y: '0%', transition: { duration: 0.9, ease: EASE } } }}
                      className="block"
                    >
                      <h3 className="text-balance font-display text-[clamp(1.75rem,4.4vw,4.4rem)] font-semibold leading-[1.02] tracking-tight transition-transform duration-500 ease-out group-hover:translate-x-4 lg:group-hover:translate-x-5">
                        {service.title}
                      </h3>
                    </motion.span>
                  </span>
                  <span className="mt-2 block text-sm font-semibold text-gold-dark lg:hidden">{service.badge}</span>
                </div>

                {/* Below laptop size the photo travels with the row */}
                <span className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-ink sm:h-24 sm:w-24 lg:hidden">
                  <img
                    src={serviceSrc(service.image).replace('-1200', '-800')}
                    alt=""
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </span>

                {/* Description, badge and platforms */}
                <div className="col-span-2 lg:col-span-4">
                  <p className="max-w-[46ch] text-base leading-relaxed text-ink/70">{service.description}</p>
                  <div className="mt-4 hidden items-center gap-4 lg:flex">
                    <PlatformLogos platforms={service.platforms} />
                    <span className="text-sm font-semibold text-gold-dark">{service.badge}</span>
                  </div>
                </div>

                {/* Arrow */}
                {linked && (
                  <span className="hidden h-14 w-14 items-center justify-center justify-self-end rounded-full border border-ink/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold lg:col-span-1 lg:flex">
                    <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                )}
              </div>
            );

            return (
              <motion.li
                key={service.id}
                className="relative border-b border-ink/12"
                onMouseEnter={() => setHovered(idx)}
                onFocus={() => setHovered(idx)}
                // The row (always measurable) triggers the title and divider animations inside it
                initial={reduce ? false : 'hidden'}
                whileInView="show"
                viewport={VIEWPORT}
              >
                {/* The divider draws itself in as the row arrives */}
                <motion.span
                  variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.1, ease: EASE } } }}
                  className="absolute inset-x-0 -bottom-px h-px origin-left bg-ink/40"
                  aria-hidden="true"
                />
                {linked ? (
                  <Link
                    to={`/services#${service.id}`}
                    className="group block rounded-xl outline-offset-4"
                  >
                    {row}
                  </Link>
                ) : (
                  <div className="group">{row}</div>
                )}
              </motion.li>
            );
          })}
        </ul>

        {linked && (
          <div className="mt-14 flex justify-center sm:mt-16">
            <Link
              to="/services"
              className="btn-glint inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-wax transition-colors hover:bg-black"
            >
              View all services
            </Link>
          </div>
        )}
      </div>

      {/* Laptop hover preview: follows mouse, leans and tilts with 3D cursor velocity, glass shine highlight */}
      {follow && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block"
          style={{ x, y, rotate: lean, rotateX: rotX, rotateY: rotY, transformPerspective: 1100 }}
          aria-hidden="true"
        >
          <motion.div
            initial={false}
            animate={{ scale: hovered !== null ? 1 : 0, opacity: hovered !== null ? 1 : 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative -ml-[150px] -mt-[190px] h-[380px] w-[300px] overflow-hidden rounded-3xl bg-ink shadow-[0_30px_80px_-24px_rgba(0,0,0,0.5)] border border-white/15"
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={SERVICES[lastHovered.current].id}
                src={serviceSrc(SERVICES[lastHovered.current].image)}
                srcSet={serviceSrcSet(SERVICES[lastHovered.current].image)}
                sizes="300px"
                alt=""
                initial={{ clipPath: 'inset(100% 0 0 0)', scale: 1.15 }}
                animate={{ clipPath: 'inset(0% 0 0 0)', scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.25 } }}
                transition={{ duration: 0.6, ease: EASE }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>

            {/* Subtle glass shine reflex */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/15 mix-blend-overlay" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};
