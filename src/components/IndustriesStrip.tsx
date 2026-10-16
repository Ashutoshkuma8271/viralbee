import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { INDUSTRIES } from '../constants/content.ts';
import { SectionHeader } from './common/SectionHeader.tsx';
import { Reveal } from './common/Reveal.tsx';
import { Spotlight } from './common/Spotlight.tsx';
import { Scene3D } from './common/Scene3D.tsx';

/** Home: who we work with. Eight equal tiles, each with the sector and what we do there. */
export const IndustriesStrip: React.FC = () => {
  return (
    <section className="relative border-t border-white/10 bg-ink py-24 sm:py-32">
      <div className="shell">
        <SectionHeader
          title="Built for businesses like yours."
          intro="Eight sectors we know well, and the kind of work that moves the needle in each."
        />

        <Scene3D>
          <ul className="mt-14 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-4 lg:grid-cols-4">
            {INDUSTRIES.map((industry, idx) => (
              <Reveal
                as="li"
                key={industry.name}
                delay={(idx % 4) * 0.08}
                className="relative overflow-hidden group flex min-h-36 flex-col justify-between rounded-3xl text-center sm:min-h-44 sm:text-left border border-white/12 bg-dark-card p-4 transition-colors duration-300 hover:border-gold/60 hover:bg-dark-card-hover sm:p-7 hover:-translate-y-1"
              >
                <Spotlight />
                <h3 className="relative font-display text-xl font-medium leading-tight text-white transition-[color,font-weight] duration-500 group-hover:font-bold group-hover:text-gold sm:text-3xl">
                  {industry.name}
                </h3>
                <p className="relative mt-3 text-sm leading-snug text-white/70 sm:mt-6 sm:text-base">{industry.desc}</p>
              </Reveal>
            ))}
          </ul>
        </Scene3D>

        <div className="mt-14 flex justify-center sm:mt-16">
          <Link
            to="/contact"
            className="group inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-[15px] font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
          >
            Talk about your sector
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
