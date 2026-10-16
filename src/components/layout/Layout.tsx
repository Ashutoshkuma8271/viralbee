import React, { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../Navbar.tsx';
import { Footer } from '../Footer.tsx';
import { ScrollToTop } from '../common/ScrollToTop.tsx';
import { PageLoader } from '../common/PageLoader.tsx';
import { ErrorBoundary } from '../common/ErrorBoundary.tsx';
import { startSmoothScroll, stopSmoothScroll } from '../../lib/smoothScroll.ts';
import { ScrollProgress } from '../common/ScrollProgress.tsx';
import { FloatingWhatsApp } from '../common/FloatingWhatsApp.tsx';
import { RouteCurtain } from '../common/RouteCurtain.tsx';

export const Layout: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    startSmoothScroll();
    return stopSmoothScroll;
  }, []);

  return (
    <div className="min-h-screen bg-ink text-white flex flex-col">
      <ScrollToTop />
      <ScrollProgress />
      <FloatingWhatsApp />
      <RouteCurtain />

      {/* Lets keyboard users jump past the navigation */}
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      {/* Persistent Shared Header */}
      <Navbar />

      {/* Main Routed Content with Animated Route Transitions (padding = navbar height) */}
      {/* overflow-x-clip: 3D tilts may briefly reach past the screen edge; clip keeps sticky scenes working (hidden would not) */}
      <main id="main" tabIndex={-1} className="flex-grow overflow-x-clip pt-20 outline-none lg:pt-23">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full flex flex-col"
          >
            <ErrorBoundary key={location.pathname}>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Shared Footer */}
      <Footer />
    </div>
  );
};
