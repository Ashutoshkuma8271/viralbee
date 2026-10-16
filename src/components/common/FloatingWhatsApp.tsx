import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { siWhatsapp } from 'simple-icons';
import { BRAND } from '../../constants/content.ts';

/**
 * Floating WhatsApp shortcut, bottom-right. Appears once the visitor scrolls past the first screen, pulses a few
 * times to be noticed, then stays still; hides while the footer is on screen. Sits under the navbar and mobile menu (z-30).
 */
export const FloatingWhatsApp: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    // Appears once the home hero (a longer, pinned scene) has played out; elsewhere after 60% of a screen
    const onScroll = () => {
      const hero = document.getElementById('hero');
      setScrolled(
        hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.5 : window.scrollY > window.innerHeight * 0.6,
      );
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    // The footer already offers WhatsApp, and the button would cover its last line
    const footer = document.querySelector('footer');
    const observer = footer ? new IntersectionObserver(([entry]) => setFooterInView(entry.isIntersecting)) : null;
    if (footer && observer) observer.observe(footer);
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer?.disconnect();
    };
  }, []);

  const visible = scrolled && !footerInView;

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          key="wa"
          href={BRAND.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Vyral Bee on WhatsApp"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 16 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="group fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] sm:bottom-7 sm:right-7"
        >
          {!reduce && (
            <span
              className="absolute inset-0 rounded-full bg-[#25D366] animate-[wa-pulse_2.2s_ease-out_3]"
              aria-hidden="true"
            />
          )}
          <svg viewBox="0 0 24 24" className="relative h-7 w-7 fill-current" aria-hidden="true">
            <path d={siWhatsapp.path} />
          </svg>
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink px-4 py-2 text-sm font-medium text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 lg:block">
            Chat on WhatsApp
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
};
