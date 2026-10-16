import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useMediaQuery } from '../../lib/motion.ts';

// Is the element sitting on a light background? Walks up to the first mostly opaque background colour. Colours are
// read through a 1px canvas so any CSS colour format works; results are cached per element.
const lightCache = new WeakMap<Element, boolean>();
let probe: CanvasRenderingContext2D | null = null;
function onLight(el: Element | null): boolean {
  if (!el) return false;
  const hit = lightCache.get(el);
  if (hit !== undefined) return hit;
  probe ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  let light = false;
  for (let e: Element | null = el; e; e = e.parentElement) {
    const bg = getComputedStyle(e).backgroundColor;
    if (!probe || !bg || bg === 'transparent') continue;
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = 'rgba(0,0,0,0)';
    probe.fillStyle = bg;
    probe.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = probe.getImageData(0, 0, 1, 1).data;
    if (a < 128) continue;
    light = 0.2126 * r + 0.7152 * g + 0.0722 * b > 160;
    break;
  }
  lightCache.set(el, light);
  return light;
}

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary, [data-cursor]';

/**
 * Cinematic cursor for mouse devices: a small gold dot that sticks to the pointer and a larger soft ring that trails it
 * with some weight. Over links and buttons the ring opens up into a lens. Gold on dark sections, neutral ink on light ones. The normal cursor stays visible, so
 * nothing is ever lost; touch screens and reduced motion get nothing.
 */
export const CursorGlow: React.FC = () => {
  const reduce = useReducedMotion();
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const [active, setActive] = useState(false);
  const [shown, setShown] = useState(false);
  const [light, setLight] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 220, damping: 24, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 220, damping: 24, mass: 0.5 });
  const enabled = fine && !reduce;

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      setShown(true);
      const t = e.target as Element | null;
      setActive(!!t?.closest?.(INTERACTIVE));
      setLight(onLight(t));
    };
    const leave = () => setShown(false);
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden="true">
      <motion.div style={{ x: rx, y: ry }} className="absolute left-0 top-0">
        <motion.div
          animate={{ scale: active ? 2.1 : 1, opacity: shown ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          // Gold on dark sections; neutral ink on white ones (a gold glow over white read as cream)
          className={`-ml-[18px] -mt-[18px] h-9 w-9 rounded-full border transition-[border-color,box-shadow,background-color] duration-300 ${
            light ? 'border-ink/35 shadow-none' : 'border-gold/70 shadow-[0_0_30px_rgba(242,165,22,0.35)]'
          }`}
          style={{
            backgroundColor: active ? (light ? 'rgba(11,11,12,0.06)' : 'rgba(242,165,22,0.14)') : 'rgba(0,0,0,0)',
          }}
        />
      </motion.div>
      <motion.div style={{ x, y }} className="absolute left-0 top-0">
        <motion.div
          animate={{ scale: active ? 0 : 1, opacity: shown ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className={`-ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full transition-colors duration-300 ${light ? 'bg-ink' : 'bg-gold'}`}
        />
      </motion.div>
    </div>
  );
};
