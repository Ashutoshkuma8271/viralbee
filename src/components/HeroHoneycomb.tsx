import React from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';

const HEX = 'M12 2 20.66 7v10L12 22l-8.66-5V7z';
const EASE = [0.16, 1, 0.3, 1] as const;

type Kind = 'line' | 'gold' | 'glass';
interface Cell {
  /** position inside the motif box, in % */
  x: number;
  y: number;
  /** width in px */
  size: number;
  /** how far "forward" the cell sits: bigger moves more with the pointer and the scroll */
  depth: number;
  kind: Kind;
}

// Loose honeycomb cluster: one solid gold cell (the brand), one frosted cell, the rest fine outlines
const CELLS: Cell[] = [
  { x: 62, y: 0, size: 132, depth: 50, kind: 'line' },
  { x: 82, y: 30, size: 76, depth: 120, kind: 'gold' },
  { x: 40, y: 30, size: 200, depth: 18, kind: 'line' },
  { x: 70, y: 66, size: 68, depth: 170, kind: 'glass' },
  { x: 92, y: 4, size: 44, depth: 210, kind: 'line' },
  { x: 34, y: 74, size: 100, depth: 36, kind: 'line' },
];

interface HeroHoneycombProps {
  /** pointer position across the hero, -0.5 … 0.5 (springs) */
  px: MotionValue<number>;
  py: MotionValue<number>;
  /** hero scroll progress 0 … 1 */
  progress: MotionValue<number>;
}

const HexCell: React.FC<{ cell: Cell; index: number } & HeroHoneycombProps> = ({ cell, index, px, py, progress }) => {
  const x = useTransform(px, (v) => v * cell.depth * 0.35);
  const y = useTransform([py, progress], ([p, s]: number[]) => p * cell.depth * 0.35 - s * cell.depth * 1.6);
  const delay = 0.7 + index * 0.12;

  return (
    <motion.div
      className="absolute"
      style={{ left: `${cell.x}%`, top: `${cell.y}%`, width: cell.size, x, y, translateZ: cell.depth }}
    >
      {/* Slow idle float, each cell on its own rhythm */}
      <div className="hex-float" style={{ animationDelay: `${-index * 1.3}s`, animationDuration: `${7 + index}s` }}>
        {cell.kind === 'glass' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay, ease: EASE }}
            className="aspect-[0.866] w-full bg-white/10 backdrop-blur-md [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]"
          />
        ) : (
          <svg viewBox="2.5 1.5 19 21" className="block w-full overflow-visible">
            <motion.path
              d={HEX}
              fill={cell.kind === 'gold' ? 'var(--color-gold)' : 'none'}
              stroke={cell.kind === 'gold' ? 'var(--color-gold)' : 'rgba(255,255,255,0.42)'}
              strokeWidth={cell.kind === 'gold' ? 1 : 1.25}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, fillOpacity: 0 }}
              animate={{ pathLength: 1, fillOpacity: cell.kind === 'gold' ? 1 : 0 }}
              transition={{ pathLength: { duration: 1.4, delay, ease: EASE }, fillOpacity: { duration: 0.8, delay: delay + 0.9 } }}
            />
          </svg>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Hero brand motif: a loose cluster of honeycomb cells floating in 3D on the photo side. The whole cluster turns
 * gently toward the pointer, nearer cells drift further (parallax), and on scroll the cells rise at different speeds.
 * Laptop and desktop only; decorative, so hidden from screen readers.
 */
export const HeroHoneycomb: React.FC<HeroHoneycombProps> = ({ px, py, progress }) => {
  const rotateY = useTransform(px, (v) => v * 16);
  const rotateX = useTransform(py, (v) => -v * 12);

  return (
    <div
      className="pointer-events-none absolute right-[4%] top-[16%] z-[5] hidden h-[58%] w-[36%] max-w-[560px] lg:block"
      style={{ perspective: 1100 }}
      aria-hidden="true"
    >
      <motion.div className="relative h-full w-full" style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        {CELLS.map((cell, i) => (
          <HexCell key={i} cell={cell} index={i} px={px} py={py} progress={progress} />
        ))}
      </motion.div>
    </div>
  );
};
