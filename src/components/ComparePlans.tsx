import React from 'react';
import { Check, Minus } from 'lucide-react';
import { PRICING_PACKAGES } from '../constants/content.ts';
import { SectionHeader } from './common/SectionHeader.tsx';
import { Reveal } from './common/Reveal.tsx';
import { PLAIN } from './PackageTiers.tsx';

/** Packages page: every item against every plan in one table, so the differences are clear at a glance. */
export const ComparePlans: React.FC = () => {
  const rows = PRICING_PACKAGES[0].features.map((f) => f.name);

  return (
    <section className="relative bg-dark-surface py-24 sm:py-32">
      <div className="shell">
        <SectionHeader
          title="Compare the plans side by side."
          intro="Everything that comes with each plan, in one place."
        />

        <Reveal className="mt-14 sm:mt-16">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-ink">
            <table className="w-full table-fixed border-collapse text-left">
              <caption className="sr-only">What each plan includes</caption>
              <colgroup>
                <col className="w-[37%] sm:w-[49%]" />
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr className="border-b border-white/10">
                  <th scope="col" className="p-4 text-sm font-medium text-white/60 sm:p-6">
                    <span className="hidden sm:inline">What you get</span>
                  </th>
                  {PRICING_PACKAGES.map((pkg) => (
                    <th
                      key={pkg.name}
                      scope="col"
                      className={`px-1 py-4 text-center align-bottom sm:p-6 ${pkg.popular ? 'bg-gold/[0.08]' : ''}`}
                    >
                      {pkg.popular && (
                        <span className="mb-2 hidden rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-ink sm:inline-block">
                          {pkg.badge}
                        </span>
                      )}
                      <span className="block font-display text-[13px] font-semibold text-white sm:text-xl">{pkg.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((name, r) => (
                  <tr key={name} className={r < rows.length - 1 ? 'border-b border-white/[0.07]' : ''}>
                    <th scope="row" className="py-4 pl-4 pr-2 font-normal sm:p-6">
                      <span className="block text-sm font-semibold leading-snug text-white sm:text-base">{name}</span>
                      <span className="mt-0.5 hidden text-sm text-white/70 sm:block">{PLAIN[name]}</span>
                    </th>
                    {PRICING_PACKAGES.map((pkg) => {
                      const value = pkg.features.find((f) => f.name === name)?.included;
                      return (
                        <td key={pkg.name} className={`px-1 py-4 text-center sm:p-6 ${pkg.popular ? 'bg-gold/[0.08]' : ''}`}>
                          {value === true ? (
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold text-ink">
                              <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                              <span className="sr-only">Included</span>
                            </span>
                          ) : value === 'Add-on' ? (
                            <span className="inline-flex whitespace-nowrap rounded-full border border-gold/40 px-2 py-1 text-[11px] font-semibold text-gold sm:px-2.5 sm:text-xs">
                              Add-on
                            </span>
                          ) : (
                            <span className="inline-flex text-white/25">
                              <Minus className="h-5 w-5" aria-hidden="true" />
                              <span className="sr-only">Not included</span>
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
