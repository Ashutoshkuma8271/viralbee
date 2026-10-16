import React, { useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Sources used below 768px wide (e.g. portrait crops) */
  mobileSrcSet?: string;
  mobileSizes?: string;
  /** Classes for the wrapper, which owns size and aspect ratio */
  wrapperClassName?: string;
  /** Placeholder colour to match the section background */
  tone?: 'dark' | 'light';
}

/** Native lazy-loaded responsive image with a skeleton placeholder and a fade-in once decoded. */
export const LazyImage: React.FC<LazyImageProps> = ({
  mobileSrcSet,
  mobileSizes = '100vw',
  wrapperClassName = '',
  className = '',
  alt = '',
  tone = 'dark',
  onLoad,
  ...img
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const placeholder = loaded || failed
    ? tone === 'light'
      ? 'bg-wax-deep'
      : 'bg-dark-card'
    : `skeleton ${tone === 'light' ? 'skeleton-light' : ''}`;

  // Default to `relative`, but let callers position the wrapper themselves (e.g. `absolute inset-0` for background photos)
  const position = /\b(absolute|fixed)\b/.test(wrapperClassName) ? '' : 'relative';

  return (
    <div className={`${position} overflow-hidden ${placeholder} ${wrapperClassName}`}>
      <picture>
        {mobileSrcSet && <source media="(max-width: 767px)" srcSet={mobileSrcSet} sizes={mobileSizes} />}
        <img
          ref={(el) => {
            if (el?.complete && el.naturalWidth) setLoaded(true);
          }}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={(e) => {
            setLoaded(true);
            onLoad?.(e);
          }}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity duration-700 ${loaded && !failed ? 'opacity-100' : 'opacity-0'} ${className}`}
          {...img}
        />
      </picture>
    </div>
  );
};
