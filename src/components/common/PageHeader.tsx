import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { pageSrc, pageSrcSet, pageMobileSrcSet } from '../../lib/images.ts';
import { LazyImage } from './LazyImage.tsx';
import { PillMarquee } from './PillMarquee.tsx';

import { RevealWords } from './RevealWords.tsx';

interface PageHeaderProps {
  title: React.ReactNode;
  intro?: React.ReactNode;
  eyebrow?: string;
  /** Header photo key: about | services | process | packages | work | contact (files in /images/pages) */
  image: string;
  /** Buttons under the intro */
  actions?: React.ReactNode;
  /** Quick-jump links shown as pills under the buttons */
  chips?: { label: string; href: string }[];
}

/** Opening block for inner pages: full-width photo with parallax, breadcrumb, headline, intro and actions. */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, intro, eyebrow, image, actions, chips }) => {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '18%']);

  return (
    <header
      ref={ref}
      className="relative -mt-20 flex min-h-[34rem] flex-col overflow-hidden bg-ink lg:-mt-23 lg:min-h-[40rem]"
    >
      <motion.div style={{ y: imageY }} className="absolute inset-x-0 top-0 h-[118%] will-change-transform">
        <LazyImage
          src={pageSrc(image)}
          srcSet={pageSrcSet(image)}
          sizes="100vw"
          mobileSrcSet={pageMobileSrcSet(image)}
          alt=""
          loading="eager"
          fetchPriority="high"
          wrapperClassName="absolute inset-0"
        />
      </motion.div>
      <div className="scrim-page absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/65 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink to-transparent" />

      <div className="shell relative z-10 flex flex-1 flex-col items-center justify-end pb-12 pt-60 text-center sm:pt-80 lg:items-start lg:justify-center lg:pb-16 lg:pt-40 lg:text-left">
        {eyebrow && (
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-gold"
          >
            {eyebrow}
          </motion.p>
        )}
        <h1 className="text-on-photo max-w-[18ch] font-display text-fluid-hero font-semibold text-white">
          {typeof title === 'string' ? <RevealWords text={title} /> : title}
        </h1>

        {intro && (
          <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-white/75 lg:mt-8 lg:text-xl">
            {intro}
          </p>
        )}

        {actions && <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:mt-10">{actions}</div>}

      </div>

      {chips && <PillMarquee items={chips} className="relative z-10 pb-8 lg:pb-10" />}
    </header>
  );
};
