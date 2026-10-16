import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { SERVICES, SOCIAL_MEDIA_DEEP_DIVE, WEBSITES_AND_ADS_DEEP_DIVE } from '../constants/content.ts';
import { LazyImage } from './common/LazyImage.tsx';
import { PlatformLogos } from './common/PlatformLogos.tsx';
import { serviceSrc, serviceSrcSet } from '../lib/images.ts';
import { Reveal } from './common/Reveal.tsx';
import { ImageReveal } from './common/ImageReveal.tsx';
import { TiltCard } from './common/TiltCard.tsx';
import { RevealWords } from './common/RevealWords.tsx';
import { motion } from 'framer-motion';

/** What each service includes. Lists come from the original site copy; ids match the quick-jump links in the page header. */
const INCLUDES: Record<string, { cta: string; items: string[] }> = {
  'social-media': { cta: 'Get a sample content calendar', items: SOCIAL_MEDIA_DEEP_DIVE.contentManagement },
  'creative-design': { cta: 'Ask about branding', items: SOCIAL_MEDIA_DEEP_DIVE.brandingCreative },
  'reels-video': {
    cta: 'Plan a video series',
    items: [
      'High-impact Reels & Shorts production',
      'Video scripts and storyboards',
      'Data-backed captions & hashtag research',
      'Scheduled posting & prime-time distribution',
      'Monthly analytics & reporting',
      'Dynamic retargeting with video ads',
    ],
  },
  'website-dev': { cta: 'Discuss a website', items: WEBSITES_AND_ADS_DEEP_DIVE.websites },
  'meta-google-ads': { cta: 'Plan an ad campaign', items: WEBSITES_AND_ADS_DEEP_DIVE.paidAdvertising.features },
  'lead-gen': {
    cta: 'Map your funnel',
    items: [
      'Targeted lead generation & enquiry funnels',
      'Monthly strategic content calendars',
      'Continuous A/B testing & campaign optimization',
      'Transparent cost-per-lead tracking & weekly reports',
      'Monthly analytics, KPI breakdown & reporting',
      'Strategy tied to revenue, not vanity metrics',
    ],
  },
};

export const ServiceDeepDives: React.FC = () => {
  return (
    <section id="deep-dive" className="relative bg-ink py-24 sm:py-32">
      <div className="shell">
        <h2 className="max-w-[18ch] text-fluid-h2 font-display font-semibold text-white">
          <RevealWords text="What's included in each service." />
        </h2>

        <div className="mt-16 flex flex-col gap-24 sm:mt-20 lg:gap-32">
          {SERVICES.map((service, idx) => {
            const detail = INCLUDES[service.id];
            const imageFirst = idx % 2 === 0;
            return (
              <article
                key={service.id}
                id={service.id}
                className="grid scroll-mt-32 gap-10 lg:grid-cols-12 lg:items-center lg:gap-16"
              >
                <ImageReveal
                  from={imageFirst ? 'left' : 'right'}
                  className={`lg:col-span-6 ${imageFirst ? '' : 'lg:order-2'}`}
                >
                  <TiltCard radius="rounded-3xl" max={4} glare={true}>
                    <LazyImage
                      src={serviceSrc(service.image)}
                      srcSet={serviceSrcSet(service.image)}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      alt=""
                      width={1920}
                      height={1200}
                      wrapperClassName="aspect-[4/3] rounded-3xl"
                    />
                  </TiltCard>
                </ImageReveal>

                <Reveal direction={imageFirst ? 'right' : 'left'} className="text-center sm:text-left lg:col-span-6">
                  <PlatformLogos platforms={service.platforms} className="justify-center sm:justify-start" />
                  <h3 className="mt-6 font-display text-fluid-h3 font-semibold text-white lg:text-4xl">
                    {service.title}
                  </h3>
                  <p className="mx-auto mt-4 max-w-lg font-sans text-lg leading-relaxed text-white/75 sm:mx-0">
                    {service.description}
                  </p>

                  <ul className="mx-auto mt-8 grid max-w-sm gap-x-8 gap-y-4 text-left sm:mx-0 sm:max-w-none sm:grid-cols-2">
                    {detail.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 font-sans text-base text-white/70">
                        <motion.span
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                          className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold"
                        >
                          <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                        </motion.span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/contact"
                    className="btn-glint group mt-10 inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 font-sans text-[15px] font-semibold text-white transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                  >
                    {detail.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
