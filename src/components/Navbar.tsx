import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo.tsx';
import { NAV_LINKS, BRAND } from '../constants/content.ts';
import { lockScroll } from '../lib/smoothScroll.ts';
import { Magnetic } from './common/Magnetic.tsx';
import { EASE } from '../lib/motion.ts';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const lastY = useRef(0);
  const location = useLocation();

  // Solid after a little scroll; slides away while scrolling down, comes back as soon as you scroll up.
  // Never hidden near the top, or while keyboard focus is inside the header.
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 24);
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) {
        const focusInside = headerRef.current?.contains(document.activeElement);
        setHidden(delta > 0 && y > 160 && !focusInside);
        lastY.current = y;
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    lockScroll(mobileMenuOpen);
    return () => lockScroll(false);
  }, [mobileMenuOpen]);

  const solid = isScrolled || mobileMenuOpen;
  const tucked = hidden && !mobileMenuOpen && !reduceMotion;

  return (
    <>
      <header
        ref={headerRef}
        onFocus={() => setHidden(false)}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          solid ? 'border-b border-white/10 bg-ink/90 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
        } ${tucked ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div
          className={`shell flex h-20 items-center justify-between transition-[height] duration-300 ease-out ${
            isScrolled ? 'lg:h-18' : 'lg:h-23'
          }`}
        >
          <Link to="/" className="shrink-0" aria-label="Vyral Bee home">
            <Logo size="md" />
          </Link>

          <nav className="hidden items-center gap-9 lg:flex xl:gap-12" aria-label="Main" onMouseLeave={() => setHoveredHref(null)}>
            {NAV_LINKS.filter((link) => link.href !== '/contact').map((link) => {
              const current = link.href === '/' ? location.pathname === '/' : location.pathname.startsWith(link.href);
              const marked = hoveredHref ? hoveredHref === link.href : current;
              return (
                <NavLink
                  key={link.label}
                  to={link.href}
                  end={link.href === '/'}
                  onMouseEnter={() => setHoveredHref(link.href)}
                  onFocus={() => setHoveredHref(link.href)}
                  onBlur={() => setHoveredHref(null)}
                  className={({ isActive }) =>
                    `relative py-2 text-[15px] font-medium transition-colors xl:text-base ${
                      isActive || marked ? 'text-white' : 'text-white/70 hover:text-white'
                    }`
                  }
                >
                  {link.label}
                  {marked && (
                    <motion.span
                      layoutId="nav-indicator"
                      transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 38 }}
                      className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gold"
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Magnetic>
              <Link
                to="/contact"
                className="group hidden items-center gap-3 rounded-full bg-gold py-2 pl-6 pr-2 text-[15px] font-semibold text-ink transition-colors hover:bg-gold-light sm:inline-flex"
              >
                Let's talk
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-gold transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </Magnetic>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/50 lg:hidden"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside <header>: the header's backdrop blur would otherwise trap this fixed panel inside the 80px bar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={reduceMotion ? false : { clipPath: 'circle(0% at calc(100% - 42px) -40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 42px) -40px)' }}
            exit={reduceMotion ? { opacity: 0 } : { clipPath: 'circle(0% at calc(100% - 42px) -40px)' }}
            transition={{ duration: 0.7, ease: EASE }}
            data-lenis-prevent
            className="fixed inset-x-0 bottom-0 top-20 z-40 flex flex-col justify-between overflow-y-auto bg-ink px-5 pb-8 pt-4 sm:px-8 lg:hidden"
          >
            <nav className="flex flex-col" aria-label="Mobile">
              {NAV_LINKS.map((link, i) => (
                <div key={link.label} className="overflow-hidden border-b border-white/10">
                  <motion.div
                    initial={reduceMotion ? false : { y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.6, delay: 0.18 + i * 0.05, ease: EASE }}
                  >
                    <NavLink
                      to={link.href}
                      end={link.href === '/'}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `group/m flex items-center gap-4 py-4 font-display text-3xl font-medium transition-colors sm:text-4xl ${
                          isActive ? 'text-gold' : 'text-white hover:text-gold'
                        }`
                      }
                    >
                      <span className="flex-1">{link.label}</span>
                      <ArrowUpRight className="h-5 w-5 text-white/60 transition-[transform,color] duration-300 group-hover/m:text-gold motion-safe:group-hover/m:-translate-y-0.5 motion-safe:group-hover/m:translate-x-0.5" aria-hidden="true" />
                    </NavLink>
                  </motion.div>
                </div>
              ))}
            </nav>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
              className="flex flex-col gap-4 pt-8"
            >
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-glint w-full rounded-full bg-gold py-4 text-center text-base font-semibold text-ink transition-colors hover:bg-gold-light"
              >
                Get a free strategy call
              </Link>
              <a href={`mailto:${BRAND.contact.email}`} className="text-center text-sm text-white/60 transition-colors hover:text-gold">
                {BRAND.contact.email}
              </a>
              <a href={`tel:${BRAND.contact.phone.replace(/[^+\d]/g, '')}`} className="-mt-2 text-center text-sm text-white/60 transition-colors hover:text-gold">
                {BRAND.contact.phone}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
