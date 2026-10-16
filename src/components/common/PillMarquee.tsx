import React from 'react';

interface PillMarqueeProps {
  items: { label: string; href: string }[];
  /** Seconds for one full loop */
  duration?: number;
  className?: string;
}

/**
 * Endless sliding row of link pills (same motion as the gold ticker). Pauses on hover, touch and keyboard focus so the
 * links are easy to hit; the edges fade out; with reduced motion it becomes a normal swipeable row.
 */
export const PillMarquee: React.FC<PillMarqueeProps> = ({ items, duration = 36, className = '' }) => {
  const row = (copy: number) => (
    <ul className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={copy > 0 || undefined}>
      {items.map((item) => (
        <li key={`${copy}-${item.href}`}>
          <a
            href={item.href}
            tabIndex={copy > 0 ? -1 : undefined}
            className="inline-flex h-11 items-center whitespace-nowrap rounded-full border border-white/25 bg-white/[0.07] px-5 text-[15px] font-medium text-white backdrop-blur-md transition-colors hover:border-gold hover:bg-gold hover:text-ink focus-visible:border-gold focus-visible:bg-gold focus-visible:text-ink"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <nav
      aria-label="Jump to a section"
      className={`marquee marquee-pills overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] ${className}`}
    >
      <div className="marquee-track" style={{ ['--marquee-duration' as string]: `${duration}s` }}>
        {row(0)}
        {row(1)}
      </div>
    </nav>
  );
};
