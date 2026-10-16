import React from 'react';
import { Canvas } from '@react-three/fiber';
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

/** The heavy part (three.js + react-three-fiber + scene): only ever loaded through React.lazy from SceneHost. */
export default function SceneCanvas({ variant, inputs, lite, running, onReady }: SceneCanvasProps) {
  return (
    <Canvas
      dpr={[1, lite ? 1.25 : 1.75]}
      frameloop={running ? 'always' : 'never'}
      camera={{ fov: 35, position: [0, 0, 11], near: 0.1, far: 60 }}
      gl={{ alpha: true, antialias: !lite, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping; // the soft highlight roll-off of film
        gl.toneMappingExposure = 1.05;
        requestAnimationFrame(onReady); // fade in once the first frame exists
      }}
      style={{ pointerEvents: 'none' }}
    >
      <SceneContent variant={variant} inputs={inputs} lite={lite} />
    </Canvas>
  );
}
