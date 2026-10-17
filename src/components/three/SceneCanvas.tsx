import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import SceneContent, { type SceneInputs, type Variant } from './SceneContent.tsx';

interface SceneCanvasProps {
  variant: Variant;
  inputs: React.MutableRefObject<SceneInputs>;
  lite: boolean;
  /** false pauses rendering completely (off screen) */
  running: boolean;
  onReady: () => void;
}

/**
 * Compiles the scene's shaders in the background (KHR_parallel_shader_compile via three's compileAsync) before the
 * first frame is drawn. Without it, the first frame compiled everything at once and froze scrolling for about a second.
 * Runs after the scene's meshes are mounted (effects run after children), then lets the frame loop start.
 */
function ShaderWarmup({ onDone }: { onDone: () => void }) {
  const { gl, scene, camera } = useThree();
  const finish = useRef(onDone);
  finish.current = onDone;
  useEffect(() => {
    let alive = true;
    const done = () => {
      if (alive) finish.current();
    };
    gl.compileAsync(scene, camera).then(done, done);
    // Safety net: never leave the scene waiting if a device stalls on background compiling
    const fallback = window.setTimeout(done, 1500);
    return () => {
      alive = false;
      window.clearTimeout(fallback);
    };
  }, [gl, scene, camera]);
  return null;
}

/** The heavy part (three.js + react-three-fiber + scene): only ever loaded through React.lazy from SceneHost. */
export default function SceneCanvas({ variant, inputs, lite, running, onReady }: SceneCanvasProps) {
  const [compiled, setCompiled] = useState(false);
  // Fade in only once shaders are compiled and the first real frame can be drawn
  useEffect(() => {
    if (compiled) requestAnimationFrame(onReady);
  }, [compiled, onReady]);

  return (
    <Canvas
      dpr={[1, lite ? 1.25 : 1.75]}
      frameloop={running && compiled ? 'always' : 'never'}
      camera={{ fov: 35, position: [0, 0, 11], near: 0.1, far: 60 }}
      gl={{ alpha: true, antialias: !lite, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping; // the soft highlight roll-off of film
        gl.toneMappingExposure = 1.05;
        // Checking every shader for errors makes the browser wait for each compile to finish (a long freeze on the
        // first frame). Useful while developing only; the live site lets compiles finish in the background.
        gl.debug.checkShaderErrors = import.meta.env.DEV;
      }}
      style={{ pointerEvents: 'none' }}
    >
      <SceneContent variant={variant} inputs={inputs} lite={lite} />
      {!compiled && <ShaderWarmup onDone={() => setCompiled(true)} />}
    </Canvas>
  );
}
