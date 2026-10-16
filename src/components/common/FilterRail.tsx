import React, { useEffect, useRef } from 'react';

interface FilterRailProps {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

/** One-line filter pills. Wide screens show them all; narrow screens swipe sideways with faded edges. */
export const FilterRail: React.FC<FilterRailProps> = ({ options, value, onChange, label, className = '' }) => {
  const railRef = useRef<HTMLDivElement>(null);

  // Keep the selected pill in view when the rail is scrollable
  useEffect(() => {
    const rail = railRef.current;
    const active = rail?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!rail || !active || rail.scrollWidth <= rail.clientWidth) return;
    rail.scrollTo({ left: active.offsetLeft - (rail.clientWidth - active.clientWidth) / 2, behavior: 'smooth' });
  }, [value]);

  return (
    <div
      ref={railRef}
      role="group"
      aria-label={label}
      data-lenis-prevent-touch
      className={`relative -mx-5 flex snap-x self-stretch md:self-auto gap-2 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*:first-child]:ml-auto [&>*:last-child]:mr-auto md:[&>*:first-child]:ml-0 md:[&>*:last-child]:mr-0 sm:mx-0 sm:px-0 ${className}`}
    >
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={`h-11 shrink-0 snap-start cursor-pointer whitespace-nowrap rounded-full border px-5 text-[15px] font-medium transition-colors ${
              active
                ? 'border-gold bg-gold text-ink'
                : 'border-white/20 bg-white/[0.04] text-white/75 hover:border-white/50 hover:text-white'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};
