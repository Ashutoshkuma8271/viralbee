import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { BRAND } from '../constants/content.ts';
import { Scene3D } from './common/Scene3D.tsx';
import { Magnetic } from './common/Magnetic.tsx';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, VIEWPORT } from '../lib/motion.ts';
import { SceneHost } from './three/SceneHost.tsx';
import { usePointerDepth } from '../lib/usePointerDepth.ts';
import { useScene3D } from '../lib/scene3d.ts';

const HEX = 'M12 2 20.66 7v10L12 22l-8.66-5V7z';
const LINES = ['Ready to make your', 'brand more visible?'];

export const CtaBanner: React.FC = () => {
  const reduce = useReducedMotion();
  const { enabled } = useScene3D();
  const { ref, px, py } = usePointerDepth<HTMLDivElement>();
  return (
    <section className="relative bg-ink py-20 sm:py-28">
      <Scene3D className="shell" tilt={20}>
        <div ref={ref} className="relative overflow-hidden rounded-[2rem] bg-gold px-6 py-14 text-ink sm:px-12 sm:py-20 lg:px-20 lg:py-24">
          {/* Real-time 3D: glossy black honeycomb that follows the pointer (laptops and tablets). Phones keep the drawn outline. */}
          <SceneHost
            variant="cta"
            px={px}
            py={py}
            className="inset-0 hidden md:block"
          />
          {/* Honeycomb outline drawing itself in the corner */}
          <svg
            viewBox="2.5 1.5 19 21"
            className={`pointer-events-none absolute -right-16 -top-20 h-[22rem] w-[22rem] text-ink/[0.12] sm:-right-10 lg:h-[30rem] lg:w-[30rem] ${enabled ? 'md:hidden' : ''}`}
            aria-hidden="true"
          >
            {[1, 0.72, 0.44].map((k, i) => (
              <motion.path
                key={k}
                d={HEX}
                fill="none"
                stroke="currentColor"
                strokeWidth={0.18 / k}
                style={{ scale: k, transformOrigin: '12px 12px' }}
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 1.6, delay: 0.2 + i * 0.2, ease: EASE }}
              />
            ))}
          </svg>
          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
            <motion.h2
              className="max-w-[16ch] text-fluid-h2 font-display font-semibold text-ink lg:col-span-7"
              initial={reduce ? false : 'hidden'}
              whileInView="show"
              viewport={VIEWPORT}
            >
              {LINES.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block"
                    variants={{
                      hidden: { y: '105%' },
                      show: { y: '0%', transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: EASE } },
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h2>

            <div className="lg:col-span-5">
              <p className="max-w-md font-sans text-lg leading-relaxed text-ink/80">
                Tell us where you are and where you want to be. We'll come back within one working day with a plan.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Magnetic className="flex w-full sm:w-auto">
                  <Link
                    to="/contact"
                    className="btn-glint group inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-ink px-8 font-sans text-base font-semibold text-wax transition-colors hover:bg-black"
                  >
                    Book a free consultation
                    <ArrowRight className="h-5 w-5 text-gold transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Magnetic>
                <a
                  href={BRAND.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glint inline-flex h-14 items-center justify-center gap-2.5 whitespace-nowrap rounded-full border border-ink/50 px-8 font-sans text-base font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-wax"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp us
                </a>
              </div>
            </div>
          </div>
        </div>
      </Scene3D>
    </section>
  );
};
