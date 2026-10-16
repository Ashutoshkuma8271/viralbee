import React, { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'framer-motion';
import { useScene3D } from '../../lib/scene3d.ts';
import type { SceneInputs, Variant } from './SceneContent.tsx'; // types only: erased at build, no three.js here

// The three.js code is a separate download: it only starts loading once a scene is about to be needed
const SceneCanvas = lazy(() => import('./SceneCanvas.tsx'));

/** If WebGL fails after all (driver crash, context lost for good), the scene quietly disappears and the page stays as it was. */
class SceneBoundary extends Component<{ onFail: () => void; children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.warn('3D scene disabled:', error.message);
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface SceneHostProps {
  variant: Variant;
  /** Pointer position over the section, -0.5 … 0.5 (from usePointerDepth) */
  px?: MotionValue<number>;
  py?: MotionValue<number>;
  /** Scroll progress of the section, 0 … 1 */
  progress?: MotionValue<number>;
  /** Change this number to trigger a "kick" (hero: the cluster turns one step when the slide changes) */
  kick?: number;
  className?: string;
  /** Wait this many ms after the page is idle before the first download (keeps the first paint fast) */
  deferMs?: number;
  /** Shown when 3D is off (reduced motion, Data Saver, no WebGL) or fails */
  fallback?: React.ReactNode;
}

/**
 * Mounts one real-time 3D scene in a transparent, click-through layer. It only costs anything while it is near the
 * screen: the canvas is created shortly before it scrolls into view, paused when it is not actually visible, and
 * destroyed again when it is far away (browsers only allow a handful of WebGL contexts at once).
 */
export const SceneHost: React.FC<SceneHostProps> = ({ variant, px, py, progress, kick = 0, className = '', deferMs = 0, fallback = null }) => {
  const { enabled, lite } = useScene3D();
  const box = useRef<HTMLDivElement>(null);
  const inputs = useRef<SceneInputs>({ px: 0, py: 0, progress: 0, kick: 0 });
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [released, setReleased] = useState(deferMs === 0);

  inputs.current.kick = kick;

  // Feed the live values (springs, scroll) into the scene without re-rendering React
  useEffect(() => {
    const subs: Array<() => void> = [];
    const link = (mv: MotionValue<number> | undefined, key: 'px' | 'py' | 'progress') => {
      if (!mv) return;
      inputs.current[key] = mv.get();
      subs.push(mv.on('change', (v) => (inputs.current[key] = v)));
    };
    link(px, 'px');
    link(py, 'py');
    link(progress, 'progress');
    return () => subs.forEach((off) => off());
  }, [px, py, progress]);

  // Optional delay so the hero photo and text paint before the 3D download starts
  useEffect(() => {
    if (deferMs === 0 || !enabled) return;
    let id = 0;
    const start = () => {
      id = window.setTimeout(() => setReleased(true), deferMs);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      window.removeEventListener('load', start);
      window.clearTimeout(id);
    };
  }, [deferMs, enabled]);

  useEffect(() => {
    const el = box.current;
    if (!el || !enabled) return;
    const nearObs = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '60% 0px 60% 0px' });
    const visObs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '0px' });
    nearObs.observe(el);
    visObs.observe(el);
    return () => {
      nearObs.disconnect();
      visObs.disconnect();
    };
  }, [enabled]);

  useEffect(() => {
    if (!near) setReady(false);
  }, [near]);

  if (!enabled || failed) return <>{fallback}</>;

  return (
    <div ref={box} className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      {near && released && (
        <div
          className="h-full w-full transition-[opacity,transform] duration-[1600ms] ease-out"
          style={{ opacity: ready ? 1 : 0, transform: ready ? 'scale(1)' : 'scale(0.94)' }}
        >
          <SceneBoundary onFail={() => setFailed(true)}>
            <Suspense fallback={null}>
              <SceneCanvas variant={variant} inputs={inputs} lite={lite} running={visible} onReady={() => setReady(true)} />
            </Suspense>
          </SceneBoundary>
        </div>
      )}
    </div>
  );
};

export default SceneHost;
