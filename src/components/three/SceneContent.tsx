import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

/*
 * The cinematic honeycomb scene. One file, four looks (see Variant):
 *   hero      big gold + chrome + glass cluster on the right, glow, pollen, light rays; reacts to pointer, scroll, slides
 *   statement the cluster assembles out of scattered cells while the positioning line is read (scroll-linked)
 *   cta       black glossy cells on the gold banner
 *   page      small cluster + pollen for inner-page headers
 * Everything is procedural (no model, texture or HDR downloads), so the scene costs only the JS chunk itself.
 */

export type Variant = 'hero' | 'statement' | 'cta' | 'page';

/** Live inputs written by the host (React side) and read every frame here (no re-renders). */
export interface SceneInputs {
  /** pointer across the host, -0.5 … 0.5 */
  px: number;
  py: number;
  /** scroll progress of the host section, 0 … 1 */
  progress: number;
  /** counts up each time the hero slide changes */
  kick: number;
}

export interface SceneProps {
  variant: Variant;
  inputs: MutableRefObject<SceneInputs>;
  lite: boolean;
}

const GOLD = '#F2A516';
const SQRT3 = Math.sqrt(3);
const CELL_GAP = 1.13; // spacing multiplier: 1 = cells touch (bevels included)

const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Small deterministic random generator, so the layout is identical on every visit and render */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A beveled hexagonal slab, point-up, facing the camera */
function makeHexGeometry(depth = 0.5, bevel = 0.07) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 2 + (i * Math.PI) / 3;
    const x = Math.cos(a);
    const y = Math.sin(a);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 1,
  });
  geo.translate(0, 0, -depth / 2);
  geo.computeVertexNormals();
  return geo;
}

type Kind = 'hero' | 'gold' | 'chrome' | 'glass';
interface Cell {
  x: number;
  y: number;
  z: number;
  /** unit-ish direction the cell flies along when the cluster scatters */
  dir: THREE.Vector3;
  amount: number;
  tiltX: number;
  tiltY: number;
  spin: number;
  phase: number;
  speed: number;
  kind: Kind;
  scale: number;
}

function buildCells(rings: number, variant: Variant): Cell[] {
  const rand = seeded(variant === 'cta' ? 7 : 20261016);
  const out: Cell[] = [];
  for (let q = -rings; q <= rings; q++) {
    for (let r = Math.max(-rings, -q - rings); r <= Math.min(rings, -q + rings); r++) {
      const ring = Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r));
      const x = SQRT3 * CELL_GAP * (q + r / 2);
      const y = -1.5 * CELL_GAP * r;
      const outward = new THREE.Vector3(x, y, 0);
      if (outward.lengthSq() < 1e-4) outward.set(0, 0, 1);
      outward.normalize();
      outward.z += (rand() - 0.2) * 0.9;
      let kind: Kind;
      if (ring === 0) kind = 'hero';
      else {
        const roll = rand();
        kind = roll < 0.42 ? 'chrome' : roll < 0.8 ? 'gold' : 'glass';
      }
      out.push({
        x,
        y,
        z: (rand() - 0.5) * (ring === 0 ? 0 : 0.7),
        dir: outward,
        amount: 0.7 + rand() * 0.9,
        tiltX: (rand() - 0.5) * 0.5,
        tiltY: (rand() - 0.5) * 0.5,
        spin: (rand() - 0.5) * 2.4,
        phase: rand() * Math.PI * 2,
        speed: 0.5 + rand() * 0.6,
        kind,
        scale: kind === 'hero' ? 1.06 : 0.9 + rand() * 0.1,
      });
    }
  }
  return out;
}

/** Soft round sprite for pollen */
function makeDotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,0.65)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Vertical shaft of light, bright in the middle of its width and fading to nothing at every edge */
function makeRayTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 256;
  const g = c.getContext('2d')!;
  const h = g.createLinearGradient(0, 0, 64, 0);
  h.addColorStop(0, 'rgba(255,255,255,0)');
  h.addColorStop(0.5, 'rgba(255,255,255,1)');
  h.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = h;
  g.fillRect(0, 0, 64, 256);
  g.globalCompositeOperation = 'destination-in';
  const v = g.createLinearGradient(0, 0, 0, 256);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(0.3, 'rgba(0,0,0,1)');
  v.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = v;
  g.fillRect(0, 0, 64, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Studio lighting for the reflections: a few bright panels around a dark room (rendered once into a cube map) */
const Studio: React.FC<{ variant: Variant }> = ({ variant }) => {
  const warm = variant === 'cta' ? '#ffffff' : '#ffd9a0';
  return (
    <Environment frames={1} resolution={256} environmentIntensity={variant === 'cta' ? 1.1 : 1}>
      <color attach="background" args={['#050506']} />
      <Lightformer form="rect" intensity={5} color={warm} position={[0, 6, 2]} scale={[12, 3, 1]} rotation-x={Math.PI / 2} />
      <Lightformer form="rect" intensity={3.2} color="#ffffff" position={[-7, 1, 3]} scale={[1.6, 9, 1]} rotation-y={Math.PI / 2} />
      <Lightformer form="rect" intensity={2.6} color={GOLD} position={[7, -1, 2]} scale={[1.4, 8, 1]} rotation-y={-Math.PI / 2} />
      <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[-4, 3, 9]} scale={[5, 1.2, 1]} rotation={[0, 0, 0.5]} />
      <Lightformer form="rect" intensity={1.6} color="#ffe3b0" position={[5, -3, 9]} scale={[6, 1, 1]} rotation={[0, 0, -0.4]} />
      <Lightformer form="circle" intensity={1.4} color="#fff4de" position={[0, 0, 10]} scale={3} />
      <Lightformer form="ring" intensity={1.4} color="#ffffff" position={[0, 1, -6]} scale={6} />
    </Environment>
  );
};

const Cluster: React.FC<SceneProps> = ({ variant, inputs, lite }) => {
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);

  const rings = variant === 'cta' || variant === 'page' || lite ? 1 : 2;
  const radius = rings * SQRT3 * CELL_GAP + 1.15;
  const cells = useMemo(() => buildCells(rings, variant), [rings, variant]);
  const geometry = useMemo(() => makeHexGeometry(), []);

  const mats = useMemo(() => {
    // The CTA banner is gold, so its cells are tone-on-tone (lighter and darker golds, pearl and glass): an embossed
    // 3D honeycomb that catches light without fighting the dark text on top of it.
    const tone = variant === 'cta';
    const gold = new THREE.MeshPhysicalMaterial({
      color: tone ? '#ffd47f' : GOLD,
      metalness: tone ? 0.85 : 1,
      roughness: tone ? 0.3 : 0.24,
      clearcoat: 0.7,
      clearcoatRoughness: 0.18,
      emissive: new THREE.Color(tone ? '#000000' : '#7a3d00'),
      emissiveIntensity: 0.25,
      envMapIntensity: tone ? 1.1 : 1.5,
    });
    const hero = new THREE.MeshPhysicalMaterial({
      color: tone ? '#fff3d8' : '#ffb21e',
      metalness: tone ? 0.25 : 1,
      roughness: 0.14,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      emissive: new THREE.Color(tone ? '#000000' : '#ff8a00'),
      emissiveIntensity: tone ? 0 : 0.45,
      envMapIntensity: tone ? 1.3 : 1.8,
    });
    const chrome = new THREE.MeshPhysicalMaterial({
      color: tone ? '#f7c862' : '#383840',
      metalness: tone ? 0.75 : 0.92,
      roughness: tone ? 0.32 : 0.27,
      envMapIntensity: tone ? 1.1 : 1.9,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: tone ? '#fff0c8' : '#ffe9bd',
      metalness: 0,
      roughness: 0.06,
      transparent: true,
      opacity: tone ? 0.38 : 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 2.4,
      depthWrite: false,
    });
    return { gold, hero, chrome, glass } as Record<Kind, THREE.MeshPhysicalMaterial>;
  }, [variant]);

  useEffect(
    () => () => {
      geometry.dispose();
      Object.values(mats).forEach((m) => m.dispose());
    },
    [geometry, mats],
  );

  // Smoothed copies of the inputs, so nothing ever jumps
  const sm = useRef({ px: 0, py: 0, p: 0, kick: 0, spinZ: 0, energy: 0, pulse: 0 });
  const lastKick = useRef(0);

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const inp = inputs.current;
    const s = sm.current;

    s.px = THREE.MathUtils.damp(s.px, inp.px, 3.2, dt);
    s.py = THREE.MathUtils.damp(s.py, inp.py, 3.2, dt);
    s.p = THREE.MathUtils.damp(s.p, inp.progress, 4, dt);

    if (inp.kick !== lastKick.current) {
      lastKick.current = inp.kick;
      s.kick += 1; // one more 60° turn: a hexagon looks the same after each, so the loop is seamless
      s.pulse = 1;
    }
    s.spinZ = THREE.MathUtils.damp(s.spinZ, s.kick * (Math.PI / 3), 2.6, dt);
    s.pulse = THREE.MathUtils.damp(s.pulse, 0, 2.4, dt);

    // Where the cluster sits in the frame
    const wide = viewport.width / viewport.height > 1.05 && size.width >= 900;
    let cx = 0;
    let cy = 0;
    let fit = 0.36;
    if (variant === 'hero') {
      if (wide) {
        cx = viewport.width * 0.23;
        fit = lite ? 0.27 : 0.3;
      } else {
        // Narrow / portrait: a small cluster in the empty band above the headline
        cy = viewport.height * 0.3;
        fit = 0.105;
      }
    } else if (variant === 'statement') {
      fit = wide ? 0.5 : 0.38;
    } else if (variant === 'cta') {
      // Big and bleeding off the right edge of the banner, behind the text
      cx = viewport.width * 0.38;
      fit = 0.56;
    } else {
      fit = 0.4;
    }
    // Fit inside the canvas in both directions, so a narrow canvas (page headers) never crops the cluster
    const baseScale = Math.min(viewport.height * fit, viewport.width * (variant === 'hero' ? 0.3 : variant === 'cta' ? 0.5 : 0.42)) / radius;

    // Hover energy: how close the pointer is to the cluster's centre (mouse devices; 0 on touch)
    const ndcX = viewport.width ? cx / (viewport.width / 2) : 0;
    const ndcY = viewport.height ? cy / (viewport.height / 2) : 0;
    const dist = Math.hypot(s.px * 2 - ndcX, -s.py * 2 - ndcY);
    const near = inp.px === 0 && inp.py === 0 ? 0 : 1 - smooth(0.15, 0.75, dist);
    s.energy = THREE.MathUtils.damp(s.energy, near, 3, dt);

    // Scatter: intro fly-in for everyone, then the variant's scroll behaviour
    const intro = 1 - ease(t / (variant === 'statement' ? 0.6 : 2.1));
    let scatter = intro * 1.7;
    if (variant === 'hero') scatter += smooth(0, 1, s.p) * 1.9;
    if (variant === 'statement') scatter += (1 - smooth(0.04, 0.5, s.p)) * 2.6;

    g.position.set(cx + s.px * 0.35, cy - s.py * 0.25, 0);
    g.scale.setScalar(baseScale * (1 + s.energy * 0.05 + (variant === 'hero' ? s.p * 0.45 : 0) + (variant === 'statement' ? smooth(0.5, 1, s.p) * 0.12 : 0)));
    g.rotation.y = s.px * 0.9 + Math.sin(t * 0.25) * 0.1;
    g.rotation.x = -s.py * 0.6 + Math.sin(t * 0.21 + 1) * 0.05;
    g.rotation.z = s.spinZ + (variant === 'hero' ? s.p * 0.5 : 0) + (variant === 'statement' ? s.p * 0.8 : 0) + Math.sin(t * 0.15) * 0.04;

    mats.hero.emissiveIntensity = (variant === 'cta' ? 0 : 0.45) + s.energy * 0.6 + s.pulse * 1.1;
    mats.gold.emissiveIntensity = 0.25 + s.energy * 0.35 + s.pulse * 0.4;

    for (let i = 0; i < cells.length; i++) {
      const m = meshes.current[i];
      if (!m) continue;
      const c = cells[i];
      const d = scatter * c.amount * 2.6;
      const bob = Math.sin(t * c.speed + c.phase) * 0.07;
      m.position.set(
        c.x + c.dir.x * d,
        c.y + c.dir.y * d + bob,
        c.z + c.dir.z * d + (c.kind === 'hero' ? s.energy * 0.5 : 0) + Math.cos(t * c.speed * 0.8 + c.phase) * 0.05,
      );
      m.rotation.set(c.tiltX + scatter * c.spin * 0.6, c.tiltY + scatter * c.spin * 0.4, scatter * c.spin * 0.5);
      m.scale.setScalar(Math.max(0.001, c.scale * (1 - Math.min(0.5, scatter * 0.12))));
    }
  });

  return (
    <group ref={group}>
      {cells.map((c, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          geometry={geometry}
          material={mats[c.kind]}
          renderOrder={c.kind === 'glass' ? 2 : 1}
        />
      ))}
    </group>
  );
};

/** Gold pollen drifting through the frame. Nearer the camera = larger and faster, so the field has depth. */
const Pollen: React.FC<SceneProps> = ({ variant, inputs, lite }) => {
  const ref = useRef<THREE.Points>(null);
  const count = lite ? 70 : variant === 'page' ? 110 : 240;
  const tex = useMemo(() => makeDotTexture(), []);
  const data = useMemo(() => {
    const rand = seeded(99);
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 16;
      pos[i * 3 + 1] = (rand() - 0.5) * 9;
      pos[i * 3 + 2] = (rand() - 0.5) * 9 - 1;
      seed[i * 2] = 0.12 + rand() * 0.3;
      seed[i * 2 + 1] = rand() * Math.PI * 2;
    }
    return { pos, seed };
  }, [count]);

  useEffect(() => () => tex.dispose(), [tex]);

  const smooth2 = useRef({ px: 0, py: 0, p: 0 });
  useFrame((state, dtRaw) => {
    const pts = ref.current;
    if (!pts) return;
    const dt = Math.min(dtRaw, 0.05);
    const t = state.clock.elapsedTime;
    const s = smooth2.current;
    s.px = THREE.MathUtils.damp(s.px, inputs.current.px, 2.4, dt);
    s.py = THREE.MathUtils.damp(s.py, inputs.current.py, 2.4, dt);
    s.p = THREE.MathUtils.damp(s.p, inputs.current.progress, 3, dt);
    const attr = pts.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const sp = data.seed[i * 2];
      let y = arr[i * 3 + 1] + sp * dt * (1 + s.p * 3);
      if (y > 4.6) y = -4.6;
      arr[i * 3 + 1] = y;
      arr[i * 3] += Math.sin(t * 0.4 + data.seed[i * 2 + 1]) * dt * 0.08;
    }
    attr.needsUpdate = true;
    pts.position.set(-s.px * 1.4, s.py * 0.9, s.p * (variant === 'hero' ? 4 : 1.5));
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        size={variant === 'cta' ? 0.09 : 0.12}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={variant === 'cta' ? '#fff6dd' : '#ffcf6a'}
        opacity={variant === 'cta' ? 0.8 : 0.95}
      />
    </points>
  );
};

/** Slow shafts of light behind the cluster, the "projector beam" look of a film title */
const Rays: React.FC<{ inputs: MutableRefObject<SceneInputs> }> = ({ inputs }) => {
  const group = useRef<THREE.Group>(null);
  const tex = useMemo(() => makeRayTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);
  const rays = useMemo(
    () => [
      { x: -2.5, rot: -0.52, w: 1.5, o: 0.1, sp: 0.3 },
      { x: 1.2, rot: -0.46, w: 2.6, o: 0.075, sp: 0.22 },
      { x: 4.2, rot: -0.58, w: 1.2, o: 0.1, sp: 0.38 },
    ],
    [],
  );
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = rays[i].o * (0.65 + 0.35 * Math.sin(t * rays[i].sp + i * 2));
    });
    g.position.x = inputs.current.px * 1.2;
  });
  return (
    <group ref={group} position={[0, 0, -4]}>
      {rays.map((r, i) => (
        <mesh key={i} position={[r.x, 0, i * -0.2]} rotation={[0, 0, r.rot]} scale={[r.w, 16, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={tex} transparent opacity={r.o} depthWrite={false} blending={THREE.AdditiveBlending} color="#ffc15a" />
        </mesh>
      ))}
    </group>
  );
};

/** Thin gold orbit rings that tilt slowly around the cluster */
const Orbits: React.FC<{ variant: Variant; inputs: MutableRefObject<SceneInputs> }> = ({ variant, inputs }) => {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const viewport = useThree((s) => s.viewport);
  const size = useThree((s) => s.size);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const wide = viewport.width / viewport.height > 1.05 && size.width >= 900;
    const shift = variant === 'hero' ? (wide ? viewport.width * 0.23 : 0) : 0;
    const lift = variant === 'hero' && !wide ? viewport.height * 0.3 : 0;
    const scale = Math.min(viewport.height * (variant === 'hero' ? (wide ? 0.37 : 0.26) : variant === 'statement' ? 0.62 : 0.46), viewport.width * 0.47);
    const p = inputs.current.progress;
    [a.current, b.current].forEach((m, i) => {
      if (!m) return;
      m.position.set(shift + inputs.current.px * 0.5, lift - inputs.current.py * 0.3, -0.6);
      m.scale.setScalar(scale * (1 + p * 0.5) * (i ? 1.18 : 1));
      m.rotation.set(1.05 + Math.sin(t * 0.2 + i) * 0.12 - inputs.current.py * 0.4, inputs.current.px * 0.6, t * (i ? -0.12 : 0.1));
    });
  });
  return (
    <>
      <mesh ref={a}>
        <torusGeometry args={[1, 0.006, 6, 160]} />
        <meshBasicMaterial color="#ffc15a" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={b}>
        <torusGeometry args={[1, 0.004, 6, 160]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  );
};

/** Camera: leans with the pointer and pushes in as the section scrolls, always looking at the cluster */
const Rig: React.FC<SceneProps> = ({ variant, inputs }) => {
  const sm = useRef({ x: 0, y: 0, p: 0 });
  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const s = sm.current;
    s.x = THREE.MathUtils.damp(s.x, inputs.current.px, 2.6, dt);
    s.y = THREE.MathUtils.damp(s.y, inputs.current.py, 2.6, dt);
    s.p = THREE.MathUtils.damp(s.p, inputs.current.progress, 3, dt);
    const push = variant === 'hero' ? 2.6 : variant === 'statement' ? 1.4 : 0;
    const cam = state.camera;
    cam.position.set(s.x * 0.9, -s.y * 0.6, 11 - s.p * push);
    cam.lookAt(0, 0, 0);
  });
  return null;
};

export default function SceneContent(props: SceneProps) {
  const { variant, lite } = props;
  const setDpr = useThree((s) => s.setDpr);
  const glow = !lite && variant !== 'cta';
  const lights = variant === 'cta' ? 0.5 : 0.35;

  return (
    <>
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(Math.min(window.devicePixelRatio || 1, lite ? 1.25 : 1.75))}
        flipflops={2}
      />
      <Studio variant={variant} />
      <ambientLight intensity={lights} />
      <directionalLight position={[4, 6, 6]} intensity={variant === 'cta' ? 1.4 : 2} color="#fff1d6" />
      <pointLight position={[-6, -2, 4]} intensity={variant === 'cta' ? 20 : 45} color={GOLD} distance={22} />

      {(variant === 'hero' || variant === 'statement') && <Rays inputs={props.inputs} />}
      {variant !== 'cta' && !lite && <Orbits variant={variant} inputs={props.inputs} />}
      <Cluster {...props} />
      <Pollen {...props} />
      <Rig {...props} />

      {glow && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={variant === 'statement' ? 0.55 : 0.85} luminanceThreshold={0.72} luminanceSmoothing={0.25} radius={0.7} />
        </EffectComposer>
      )}
    </>
  );
}
