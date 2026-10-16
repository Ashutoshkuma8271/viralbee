import React, { useMemo } from 'react';

interface HexLatticeProps {
  /** Number of hexagons across and down */
  cols: number;
  rows: number;
  /** Corner radius of one cell in SVG units; the viewBox grows with it */
  r?: number;
  /** Outline colour of the plain cells */
  stroke?: string;
  /** Outline colour of the highlighted cells */
  goldStroke?: string;
  /** Which cells are highlighted, as [col, row] pairs */
  gold?: Array<[number, number]>;
  strokeWidth?: number;
  className?: string;
}

/** Pointy-top hexagon around (cx, cy) as one closed sub-path */
const hex = (cx: number, cy: number, r: number) => {
  const w = 0.866 * r;
  const p = (x: number, y: number) => `${(cx + x).toFixed(1)} ${(cy + y).toFixed(1)}`;
  return `M${p(0, -r)}L${p(w, -r / 2)}L${p(w, r / 2)}L${p(0, r)}L${p(-w, r / 2)}L${p(-w, -r / 2)}Z`;
};

/**
 * Flat honeycomb of hexagon outlines, drawn as two SVG paths (plain cells and highlighted cells) so even a large
 * lattice costs two elements. Strokes stay hairline at any size. Purely decorative.
 */
export const HexLattice: React.FC<HexLatticeProps> = ({
  cols,
  rows,
  r = 24,
  stroke = 'rgba(255,255,255,0.06)',
  goldStroke = 'rgba(242,165,22,0.14)',
  gold = [],
  strokeWidth = 1,
  className,
}) => {
  const { plain, lit, width, height } = useMemo(() => {
    const dx = 1.732 * r;
    const dy = 1.5 * r;
    const goldSet = new Set(gold.map(([c, rr]) => `${c},${rr}`));
    let plainD = '';
    let litD = '';
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cx = dx / 2 + col * dx + (row % 2 ? dx / 2 : 0);
        const cy = r + row * dy;
        const d = hex(cx, cy, r);
        if (goldSet.has(`${col},${row}`)) litD += d;
        else plainD += d;
      }
    }
    return { plain: plainD, lit: litD, width: cols * dx + dx / 2, height: rows * dy + r / 2 };
  }, [cols, rows, r, gold]);

  return (
    <svg
      viewBox={`0 0 ${width.toFixed(0)} ${height.toFixed(0)}`}
      className={className}
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <path d={plain} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      {lit && <path d={lit} stroke={goldStroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />}
    </svg>
  );
};
