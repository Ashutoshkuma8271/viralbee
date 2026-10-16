import React from 'react';

/** Shown while a page's code loads: a pulsing hexagon, no text, no glow. */
export const PageLoader: React.FC = () => {
  return (
    <div className="flex min-h-svh items-center justify-center" role="status" aria-label="Loading">
      <svg viewBox="0 0 24 24" className="h-12 w-12 animate-pulse text-gold" aria-hidden="true">
        <path d="M12 2 20.66 7v10L12 22l-8.66-5V7z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 7.5 16.6 10v5L12 17.5 7.4 15v-5z" fill="currentColor" />
      </svg>
      <span className="sr-only">Loading</span>
    </div>
  );
};
