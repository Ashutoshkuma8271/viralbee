import React, { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useMediaQuery } from '../../lib/motion.ts';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Corner radius class of the card inside, so the shine is clipped to its shape (e.g. "rounded-3xl") */
  radius?: string;
  /** Maximum lean in degrees */
  max?: number;
  /** Moving light that follows the pointer across the surface */
  glare?: boolean;
  /** Colour of that light. The default (white, soft-light) suits dark cards; light cards need a tinted one. */
  glareColor?: string;
}

/**
 * 3D tilt that follows the pointer, with a soft moving highlight (like light sliding over glass). Mouse devices only:
 * touch screens and reduced motion get a plain card with no wrapper effects.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className,
  radius = 'rounded-3xl',
  max = 6,
  glare = true,
  glareColor,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const shine = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), { stiffness: 180, damping: 20 });
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), { stiffness: 180, damping: 20 });

  if (reduce || !canHover) return <div className={className}>{children}</div>;

  return (
    <div className={className} style={{ perspective: 1100 }}>
      <motion.div
        ref={ref}
        className={`relative h-full ${radius}`}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onPointerMove={(e) => {
          const box = ref.current?.getBoundingClientRect();
          if (!box) return;
          const nx = (e.clientX - box.left) / box.width;
          const ny = (e.clientY - box.top) / box.height;
          x.set(nx - 0.5);
          y.set(ny - 0.5);
          const el = shine.current;
          if (el) {
            el.style.setProperty('--gx', `${nx * 100}%`);
            el.style.setProperty('--gy', `${ny * 100}%`);
            el.style.opacity = '1';
          }
        }}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
          if (shine.current) shine.current.style.opacity = '0';
        }}
      >
        {children}
        {glare && (
          <div
            ref={shine}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ${glareColor ? '' : 'mix-blend-soft-light'} ${radius}`}
            style={{
              background: `radial-gradient(520px circle at var(--gx, 50%) var(--gy, 50%), ${glareColor ?? 'rgba(255,255,255,0.55)'}, transparent 55%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
