import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useMediaQuery } from './motion.ts';

let webglSupport: boolean | null = null;

/** True when the browser can create a WebGL context (checked once, then remembered). */
export function hasWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    webglSupport = !!gl;
    // Give the context back straight away so it does not count against the browser's limit
    (gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

interface NavigatorHints {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  connection?: { saveData?: boolean };
}

export interface Scene3DMode {
  /** Draw the real-time 3D scenes at all. False for reduced motion, Data Saver, very weak devices, no WebGL. */
  enabled: boolean;
  /** Lighter scene: fewer cells and particles, no glow post-processing, lower resolution. Phones and weak laptops. */
  lite: boolean;
}

/**
 * One place that decides whether the cinematic 3D scenes run, and how heavy they are. Every scene host asks this,
 * so a visitor who prefers reduced motion, has Data Saver on or has no WebGL simply gets the normal photo design.
 */
export function useScene3D(): Scene3DMode {
  const reduce = useReducedMotion();
  const small = useMediaQuery('(max-width: 1023px)');
  return useMemo(() => {
    if (reduce) return { enabled: false, lite: true };
    const nav = (typeof navigator === 'undefined' ? {} : navigator) as NavigatorHints;
    const weak = (nav.deviceMemory !== undefined && nav.deviceMemory < 2) || (nav.hardwareConcurrency ?? 8) < 2;
    if (weak || nav.connection?.saveData || !hasWebGL()) return { enabled: false, lite: true };
    const modest = (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) || (nav.hardwareConcurrency ?? 8) <= 4;
    return { enabled: true, lite: small || modest };
  }, [reduce, small]);
}
