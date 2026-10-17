import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import type { FaqItem } from '../constants/faqs.ts';
import { Reveal } from './common/Reveal.tsx';
import { RevealWords } from './common/RevealWords.tsx';

interface FaqProps {
  items: FaqItem[];
  title?: string;
  intro?: string;
}

/**
 * Questions and answers on a white section. Laptop and up: heading and a contact prompt on the left, the questions on
 * the right. Phones and tablets: one centred column. One answer is open at a time; the first starts open.
 */
export const Faq: React.FC<FaqProps> = ({
  items,
  title = 'Questions, answered.',
  intro = 'The things people usually ask before we start working together.',
}) => {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section className="relative bg-wax py-24 text-ink sm:py-32">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="text-center lg:col-span-5 lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-dark">FAQ</p>
          <h2 className="mt-4 text-balance font-display text-fluid-h2 font-semibold">
            <RevealWords text={title} />
          </h2>
          <p className="mx-auto mt-5 max-w-md font-sans text-lg font-medium leading-relaxed text-ink/70 sm:text-xl lg:mx-0">{intro}</p>
          <Link
            to="/contact"
            className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-white transition-colors hover:bg-black"
          >
            Ask us anything
            <ArrowRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="border-t border-ink/12 lg:col-span-7">
          {items.map((item, idx) => {
            const isOpen = open === idx;
            const panelId = `${baseId}-panel-${idx}`;
            const buttonId = `${baseId}-button-${idx}`;
            return (
              <Reveal as="li" key={item.q} delay={idx * 0.05} className="border-b border-ink/12">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : idx)}
                    className="group flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display text-lg font-semibold leading-snug transition-colors duration-300 group-hover:text-gold-dark sm:text-xl">{item.q}</span>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen ? 'rotate-45 bg-gold text-ink' : 'bg-ink/[0.06] text-ink group-hover:bg-ink/10'
                      }`}
                    >
                      <Plus className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </button>
                </h3>
                {/* Height animates through the grid-rows trick, so no measuring is needed */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-400 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <p className="max-w-[60ch] pb-6 pr-14 text-base leading-relaxed text-ink/70">{item.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
