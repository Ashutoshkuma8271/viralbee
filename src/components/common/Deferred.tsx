import React, { useEffect, useRef, useState } from 'react';

interface DeferredProps {
  children: React.ReactNode;
  /** Space reserved until the section is built, so the page length stays close to final */
  minHeight?: string;
}

/**
 * Builds a below-the-fold section only when the visitor scrolls within about two screens of it (or straight away in
 * browsers without IntersectionObserver). The first screen then appears much sooner on phones, because the browser
 * does not have to build the whole long page before showing anything. Placeholders sit off-screen, so nothing visible
 * shifts when a section is built.
 */
export const Deferred: React.FC<DeferredProps> = ({ children, minHeight = '100svh' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: '200% 0px 200% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  if (show) return <>{children}</>;
  return <div ref={ref} style={{ minHeight }} aria-hidden="true" />;
};
