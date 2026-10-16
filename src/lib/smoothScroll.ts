import type Lenis from 'lenis';

// One Lenis instance for the whole app. Lenis smooths wheel/trackpad input but keeps native scroll underneath,
// so framer-motion's useScroll, position: sticky, keyboard and assistive-tech scrolling all keep working.
// It is loaded on demand and skipped on touch screens and for reduced motion, which keeps phones fast.
let lenis: Lenis | null = null;
let frame = 0;
let session = 0;

export async function startSmoothScroll() {
  if (lenis || typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const mine = ++session;
  const [{ default: LenisCtor }] = await Promise.all([import('lenis'), import('lenis/dist/lenis.css')]);
  if (mine !== session || lenis) return; // stopped (or restarted) while loading

  lenis = new LenisCtor({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
  const raf = (time: number) => {
    lenis?.raf(time);
    frame = requestAnimationFrame(raf);
  };
  frame = requestAnimationFrame(raf);
}

export function stopSmoothScroll() {
  session++;
  cancelAnimationFrame(frame);
  lenis?.destroy();
  lenis = null;
}

/** Jump to the top without animation (route changes) */
export function resetScroll() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
}

/** Freeze or release page scrolling, e.g. while the mobile menu is open */
export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.body.style.overflow = locked ? 'hidden' : '';
}
