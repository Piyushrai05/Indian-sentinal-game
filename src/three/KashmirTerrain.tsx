import React, { useMemo, useRef } from 'react';
import { useFrame, extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { SatelliteViewMode } from '../types/game';

// ══════════════════════════════════════════════════════════════════
// PREMIUM CUSTOM GLSL TERRAIN SHADER
// Elevation-based color + micro-normal noise + emissive snow glow
// ══════════════════════════════════════════════════════════════════
class TerrainShaderMaterial extends THREE.ShaderMaterial {
  constructor(options: {
    colors: { river: string; valley: string; slope: string; rock: string; highCrag: string; snow: string };
    emissiveSnow: boolean;
    wireOpacity?: number;
  }) {
    const c = options.colors;
    super({
      uniforms: {
        uTime: { value: 0 },
        uRiverColor: { value: new THREE.Color(c.river) },
        uValleyColor: { value: new THREE.Color(c.valley) },
        uSlopeColor: { value: new THREE.Color(c.slope) },
        uRockColor: { value: new THREE.Color(c.rock) },
        uHighCragColor: { value: new THREE.Color(c.highCrag) },
        uSnowColor: { value: new THREE.Color(c.snow) },
        uEmissiveSnow: { value: options.emissiveSnow ? 1.0 : 0.0 },
        uFogColor: { value: new THREE.Color('#02050b') },
        uFogDensity: { value: 0.012 },
      },
      vertexShader: `
        varying float vElevation;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main() {
          vElevation = position.y;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uRiverColor;
        uniform vec3 uValleyColor;
        uniform vec3 uSlopeColor;
        uniform vec3 uRockColor;
        uniform vec3 uHighCragColor;
        uniform vec3 uSnowColor;
        uniform float uEmissiveSnow;

        varying float vElevation;
        varying vec3 vNormal;
        varying vec3 vWorldPos;

        // Micro noise for surface texture variation
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1,0));
          float c = hash(i + vec2(0,1));
          float d = hash(i + vec2(1,1));
          return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
        }

        vec3 elevationColor() {
          float e = vElevation;
          if (e < 0.28) {
            float t = clamp(e / 0.28, 0.0, 1.0);
            return mix(uRiverColor, uValleyColor, t);
          } else if (e < 0.48) {
            float t = (e - 0.28) / 0.20;
            return mix(uValleyColor, uSlopeColor, t);
          } else if (e < 0.72) {
            float t = (e - 0.48) / 0.24;
            return mix(uSlopeColor, uRockColor, t);
          } else if (e < 0.92) {
            float t = (e - 0.72) / 0.20;
            return mix(uRockColor, uHighCragColor, t);
          } else {
            float t = clamp((e - 0.92) / 0.28, 0.0, 1.0);
            return mix(uHighCragColor, uSnowColor, t);
          }
        }

        void main() {
          vec3 baseColor = elevationColor();

          // Micro-surface noise variation
          float n1 = noise(vWorldPos.xz * 18.0) * 0.045;
          float n2 = noise(vWorldPos.xz * 42.0) * 0.018;
          baseColor += vec3(n1 + n2 - 0.03);

          // Diffuse lighting (approximate)
          vec3 lightDir = normalize(vec3(0.6, 1.0, 0.4));
          float diff = max(dot(vNormal, lightDir), 0.0) * 0.65 + 0.35;
          baseColor *= diff;

          // Snow emissive glow (for NVG mode)
          if (uEmissiveSnow > 0.5 && vElevation > 0.85) {
            float glowFactor = (vElevation - 0.85) / 0.25;
            baseColor += uSnowColor * glowFactor * 0.35;
          }

          gl_FragColor = vec4(baseColor, 1.0);
        }
      `,
      vertexColors: false,
    });
  }
}

// ══════════════════════════════════════════════════════════════════
// ANIMATED CLOUD LAYER (Himalayan valley mist & stratus)
// ══════════════════════════════════════════════════════════════════
const AnimatedClouds: React.FC = React.memo(() => {
  const groupRef = useRef<THREE.Group>(null);
  const isSatelliteView = useGameStore(s => s.isSatelliteView);

  const cloudData = useMemo(() => {
    const clouds: Array<{ x: number; y: number; z: number; sx: number; sz: number; speed: number; opacity: number }> = [];
    const placements = [
      // Kashmir valley mist
      { x: 0, z: -0.1, y: 0.92, sx: 3.8, sz: 2.2, speed: 0.012, opacity: 0.28 },
      { x: 0.5, z: 0.3, y: 0.95, sx: 2.6, sz: 1.6, speed: 0.009, opacity: 0.22 },
      // Jhelum gorge fog
      { x: -1.5, z: -0.3, y: 0.78, sx: 2.2, sz: 0.7, speed: 0.018, opacity: 0.35 },
      { x: -2.2, z: -0.5, y: 0.74, sx: 1.8, sz: 0.6, speed: 0.015, opacity: 0.30 },
      // Himalayan high-altitude cirrus
      { x: 1.5, z: -2.0, y: 2.2, sx: 4.5, sz: 1.5, speed: 0.025, opacity: 0.18 },
      { x: 2.5, z: -1.5, y: 2.4, sx: 3.2, sz: 1.2, speed: 0.020, opacity: 0.14 },
      // Pir Panjal clouds
      { x: -1.0, z: 1.0, y: 1.2, sx: 2.8, sz: 0.9, speed: 0.010, opacity: 0.26 },
      { x: 0.2, z: 1.8, y: 1.1, sx: 2.0, sz: 0.8, speed: 0.013, opacity: 0.22 },
      // Jammu plains haze
      { x: 0.8, z: 3.5, y: 0.60, sx: 5.0, sz: 2.5, speed: 0.007, opacity: 0.18 },
    ];
    return placements.map((p, i) => ({ ...p, phaseOffset: i * 0.7 }));
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const data = cloudData[i];
      if (data) {
        child.position.x = data.x + Math.sin(t * data.speed + (data as any).phaseOffset) * 0.5;
        child.position.z = data.z + Math.cos(t * data.speed * 0.7 + (data as any).phaseOffset) * 0.3;
      }
    });
  });

  if (isSatelliteView) return null;

  return (
    <group ref={groupRef}>
      {cloudData.map((cloud, i) => (
        <mesh
          key={i}
          position={[cloud.x, cloud.y, cloud.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[cloud.sx, cloud.sz]} />
          <meshBasicMaterial
            color="#c8d8e8"
            transparent
            opacity={cloud.opacity}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
});

// ══════════════════════════════════════════════════════════════════
// HIMALAYAN SNOW PARTICLE SYSTEM (High-altitude blizzard)
// ══════════════════════════════════════════════════════════════════
const HimalayanSnowParticles: React.FC = React.memo(() => {
  const snowRef = useRef<THREE.Points>(null);
  const isSatelliteView = useGameStore(s => s.isSatelliteView);

  const { geometry, velocities } = useMemo(() => {
    const count = 2200;
    const positions = new Float32Array(count * 3);
    const vels: number[] = [];

    let seed = 8421;
    const rnd = () => { const x = Math.sin(seed++) * 10000; return x - Math.floor(x); };

    for (let i = 0; i < count; i++) {
      // Concentrate snow in high-altitude Himalayan zones (x > 0.5, z < 0)
      const inHighAlt = rnd() < 0.7;
      positions[i * 3 + 0] = inHighAlt ? (rnd() * 5.0 + 0.2) : (rnd() * 14 - 7);
      positions[i * 3 + 1] = 0.9 + rnd() * 2.8;
      positions[i * 3 + 2] = inHighAlt ? (rnd() * 4.0 - 3.5) : (rnd() * 11 - 5.5);
      vels.push((rnd() - 0.5) * 0.006, -(0.004 + rnd() * 0.006), (rnd() - 0.5) * 0.004);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, velocities: vels };
  }, []);

  useFrame(() => {
    if (!snowRef.current) return;
    const positions = snowRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];
      if (positions[i * 3 + 1] < 0.35) {
        positions[i * 3 + 1] = 0.9 + Math.random() * 2.8;
        positions[i * 3] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 11;
      }
    }
    snowRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (isSatelliteView) return null;

  return (
    <points ref={snowRef} geometry={geometry}>
      <pointsMaterial
        color="#e8f4ff"
        size={0.022}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
});

// ══════════════════════════════════════════════════════════════════
// CAMPFIRE POINT LIGHTS (Battle positions at night)
// ══════════════════════════════════════════════════════════════════
const BattlefieldCampfires: React.FC = React.memo(() => {
  const isSatelliteView = useGameStore(s => s.isSatelliteView);
  const fireRefs = useRef<Array<THREE.PointLight | null>>([]);

  // 10 campfire positions matching the 10 historical battlefields
  const campfires = useMemo(() => [
    { pos: [0, 0.52, 0.05], color: '#ff7c2a', name: 'Srinagar' },
    { pos: [-1.55, 0.56, -0.65], color: '#ff6b1a', name: 'Baramulla' },
    { pos: [-2.85, 0.68, -0.70], color: '#ff8833', name: 'Uri' },
    { pos: [-2.60, 0.85, 0.85], color: '#ff7722', name: 'Poonch' },
    { pos: [-1.55, 0.45, 2.30], color: '#ff5500', name: 'Naushera' },
    { pos: [-0.75, 0.38, 2.60], color: '#ff6633', name: 'Jhangar' },
    { pos: [0.85, 0.36, 3.65], color: '#ff8844', name: 'Jammu' },
    { pos: [0.85, 1.45, -1.95], color: '#ff4411', name: 'Zoji La' },
    { pos: [1.55, 1.85, -2.65], color: '#ff3300', name: 'Kargil' },
    { pos: [3.20, 2.35, -3.40], color: '#ff2200', name: 'Leh' },
  ], []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    fireRefs.current.forEach((light, i) => {
      if (light) {
        // Flicker effect
        light.intensity = 0.6 + Math.sin(t * 8.3 + i * 1.7) * 0.2 + Math.sin(t * 13.1 + i) * 0.1;
      }
    });
  });

  if (isSatelliteView) return null;

  return (
    <group>
      {campfires.map((fire, i) => (
        <pointLight
          key={i}
          ref={el => { fireRefs.current[i] = el; }}
          position={fire.pos as [number, number, number]}
          color={fire.color}
          intensity={0.7}
          distance={1.8}
          decay={2}
          castShadow={false}
        />
      ))}
    </group>
  );
});

// ══════════════════════════════════════════════════════════════════
// ULTRA-DETAILED GLACIAL WATERWAYS (Jhelum + Dal Lake + tributaries)
// ══════════════════════════════════════════════════════════════════
const PremiumGlacialWaters: React.FC = () => {
  const waterRef = useRef<THREE.Mesh>(null);
  const dalRef = useRef<THREE.Mesh>(null);
  const wularRef = useRef<THREE.Mesh>(null);
  const woollarGlowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (waterRef.current) {
      const mat = waterRef.current.material as THREE.MeshStandardMaterial;
      mat.roughness = 0.06 + Math.sin(t * 1.8) * 0.04;
      mat.metalness = 0.92 + Math.sin(t * 2.1) * 0.05;
      mat.emissiveIntensity = 0.06 + Math.sin(t * 1.5) * 0.02;
    }
    if (dalRef.current) {
      const mat = dalRef.current.material as THREE.MeshStandardMaterial;
      mat.roughness = 0.05 + Math.sin(t * 1.2) * 0.02;
      mat.emissiveIntensity = 0.08 + Math.sin(t * 0.9) * 0.03;
    }
    if (wularRef.current) {
      const mat = wularRef.current.material as THREE.MeshStandardMaterial;
      mat.roughness = 0.08 + Math.sin(t * 0.7) * 0.02;
    }
  });

  return (
    <group position={[0, 0.365, 0]}>
      {/* Jhelum River Main Gorge */}
      <mesh ref={waterRef} position={[-1.2, 0.022, -0.35]} rotation={[-Math.PI / 2, 0, 0.22]} receiveShadow>
        <planeGeometry args={[5.2, 0.36, 64, 8]} />
        <meshStandardMaterial
          color="#0c3d5c"
          emissive="#0a2a40"
          emissiveIntensity={0.07}
          roughness={0.06}
          metalness={0.94}
          transparent
          opacity={0.97}
        />
      </mesh>

      {/* Dal Lake (Srinagar) — teardrop-shaped */}
      <mesh ref={dalRef} position={[0.42, 0.046, -0.28]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.44, 48]} />
        <meshStandardMaterial
          color="#105878"
          emissive="#0a3d55"
          emissiveIntensity={0.10}
          roughness={0.05}
          metalness={0.96}
          transparent
          opacity={0.98}
        />
      </mesh>

      {/* Dal Lake Reflective Glow */}
      <mesh position={[0.42, 0.055, -0.28]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.52, 32]} />
        <meshBasicMaterial color="#1a6fa0" transparent opacity={0.08} depthWrite={false} />
      </mesh>

      {/* Wular Lake (North of Baramulla) */}
      <mesh ref={wularRef} position={[-0.8, 0.038, -1.2]} rotation={[-Math.PI / 2, 0, 0.1]} receiveShadow>
        <circleGeometry args={[0.28, 32]} />
        <meshStandardMaterial
          color="#0d3c58"
          roughness={0.10}
          metalness={0.90}
          transparent
          opacity={0.96}
        />
      </mesh>

      {/* Chenab River (Jammu plains) */}
      <mesh position={[0.2, 0.020, 2.8]} rotation={[-Math.PI / 2, 0, -0.15]} receiveShadow>
        <planeGeometry args={[3.8, 0.22, 32, 4]} />
        <meshStandardMaterial
          color="#0e4466"
          roughness={0.14}
          metalness={0.88}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Kishanganga River (north Baramulla) */}
      <mesh position={[-1.4, 0.018, -1.6]} rotation={[-Math.PI / 2, 0, 0.45]} receiveShadow>
        <planeGeometry args={[2.4, 0.16, 24, 3]} />
        <meshStandardMaterial
          color="#0b3855"
          roughness={0.16}
          metalness={0.86}
          transparent
          opacity={0.90}
        />
      </mesh>
    </group>
  );
};

// ══════════════════════════════════════════════════════════════════
// PREMIUM ORGANIC PINE & DEODAR FOREST (Instanced, Clustered)
// ══════════════════════════════════════════════════════════════════
const PremiumPineForest: React.FC<{ count?: number }> = React.memo(({ count = 280 }) => {
  const foliage1Ref = useRef<THREE.InstancedMesh>(null);
  const foliage2Ref = useRef<THREE.InstancedMesh>(null);
  const foliage3Ref = useRef<THREE.InstancedMesh>(null);
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const snowCapRef = useRef<THREE.InstancedMesh>(null);

  const matrices = useMemo(() => {
    const f1: THREE.Matrix4[] = [], f2: THREE.Matrix4[] = [], f3: THREE.Matrix4[] = [];
    const t: THREE.Matrix4[] = [], snow: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();

    const clusters = [
      { cx: 0, cz: 0.1, spread: 0.90, baseY: 0.445, isAlpine: false },
      { cx: -1.6, cz: -0.6, spread: 0.68, baseY: 0.51, isAlpine: false },
      { cx: -2.85, cz: -0.7, spread: 0.58, baseY: 0.66, isAlpine: true },
      { cx: -2.60, cz: 0.85, spread: 0.62, baseY: 0.72, isAlpine: true },
      { cx: -1.55, cz: 2.30, spread: 0.68, baseY: 0.36, isAlpine: false },
      { cx: 0.85, cz: 3.65, spread: 0.90, baseY: 0.25, isAlpine: false },
      { cx: 1.45, cz: -0.90, spread: 0.58, baseY: 0.82, isAlpine: true },
      { cx: 0.5, cz: -1.4, spread: 0.48, baseY: 0.96, isAlpine: true },
      { cx: 2.2, cz: -1.5, spread: 0.52, baseY: 1.10, isAlpine: true },
    ];

    let seed = 5318;
    const rnd = () => { const x = Math.sin(seed++) * 10000; return x - Math.floor(x); };

    for (let i = 0; i < count; i++) {
      const cluster = clusters[i % clusters.length];
      const angle = rnd() * Math.PI * 2;
      const radius = rnd() * cluster.spread;
      const x = cluster.cx + Math.cos(angle) * radius;
      const z = cluster.cz + Math.sin(angle) * radius;
      const scale = cluster.isAlpine ? (0.038 + rnd() * 0.028) : (0.052 + rnd() * 0.042);
      const rot = rnd() * Math.PI * 2;
      const lean = (rnd() - 0.5) * 0.08;

      const baseY = cluster.baseY + rnd() * 0.02;

      // Lower foliage tier
      dummy.position.set(x, baseY + 0.06, z);
      dummy.scale.set(scale * 1.2, scale * 1.3, scale * 1.2);
      dummy.rotation.set(lean * 0.5, rot, lean);
      dummy.updateMatrix();
      f1.push(dummy.matrix.clone());

      // Mid foliage tier
      dummy.position.set(x, baseY + 0.13, z);
      dummy.scale.set(scale * 0.90, scale * 1.10, scale * 0.90);
      dummy.rotation.set(lean * 0.3, rot + 0.5, lean * 0.5);
      dummy.updateMatrix();
      f2.push(dummy.matrix.clone());

      // Top foliage tier
      dummy.position.set(x, baseY + 0.19, z);
      dummy.scale.set(scale * 0.60, scale * 0.85, scale * 0.60);
      dummy.rotation.set(lean * 0.1, rot + 1.0, lean * 0.2);
      dummy.updateMatrix();
      f3.push(dummy.matrix.clone());

      // Trunk
      dummy.position.set(x, baseY + 0.02, z);
      dummy.scale.set(scale * 0.20, scale * 0.82, scale * 0.20);
      dummy.rotation.set(lean, rot, lean);
      dummy.updateMatrix();
      t.push(dummy.matrix.clone());

      // Snow cap (only alpine trees)
      if (cluster.isAlpine) {
        dummy.position.set(x, baseY + 0.20, z);
        dummy.scale.set(scale * 0.52, scale * 0.28, scale * 0.52);
        dummy.rotation.set(0, rot, 0);
        dummy.updateMatrix();
        snow.push(dummy.matrix.clone());
      } else {
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        snow.push(dummy.matrix.clone());
      }
    }

    return { f1, f2, f3, t, snow };
  }, [count]);

  useMemo(() => {
    const applyMatrices = (mesh: THREE.InstancedMesh | null, mats: THREE.Matrix4[]) => {
      if (!mesh) return;
      mats.forEach((m, i) => mesh.setMatrixAt(i, m));
      mesh.instanceMatrix.needsUpdate = true;
    };
    applyMatrices(foliage1Ref.current, matrices.f1);
    applyMatrices(foliage2Ref.current, matrices.f2);
    applyMatrices(foliage3Ref.current, matrices.f3);
    applyMatrices(trunkRef.current, matrices.t);
    applyMatrices(snowCapRef.current, matrices.snow);
  }, [matrices]);

  return (
    <group>
      <instancedMesh ref={foliage1Ref} args={[undefined, undefined, count]} castShadow receiveShadow>
        <coneGeometry args={[0.55, 1.25, 6]} />
        <meshStandardMaterial color="#1a3820" roughness={0.85} metalness={0.04} />
      </instancedMesh>
      <instancedMesh ref={foliage2Ref} args={[undefined, undefined, count]} castShadow receiveShadow>
        <coneGeometry args={[0.42, 1.05, 6]} />
        <meshStandardMaterial color="#244827" roughness={0.82} metalness={0.05} />
      </instancedMesh>
      <instancedMesh ref={foliage3Ref} args={[undefined, undefined, count]} castShadow receiveShadow>
        <coneGeometry args={[0.30, 0.85, 6]} />
        <meshStandardMaterial color="#2d5530" roughness={0.78} metalness={0.06} />
      </instancedMesh>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, count]} castShadow>
        <cylinderGeometry args={[0.09, 0.14, 0.55, 5]} />
        <meshStandardMaterial color="#38261a" roughness={0.94} />
      </instancedMesh>
      <instancedMesh ref={snowCapRef} args={[undefined, undefined, count]}>
        <coneGeometry args={[0.42, 0.22, 6]} />
        <meshStandardMaterial color="#e8f4fc" roughness={0.32} metalness={0.05} />
      </instancedMesh>
    </group>
  );
});

// ══════════════════════════════════════════════════════════════════
// STARLIGHT NVG RADAR SWEEP + RANGE RINGS
// ══════════════════════════════════════════════════════════════════
const StarlightRadarSweep: React.FC = () => {
  const sweepRef = useRef<THREE.Group>(null);
  const isSatelliteView = useGameStore(s => s.isSatelliteView);
  const satelliteViewMode = useGameStore(s => s.satelliteViewMode);
  const isNVG = isSatelliteView && (satelliteViewMode === 'STARLIGHT_NVG' || satelliteViewMode === 'THERMAL' || satelliteViewMode === 'TOPOGRAPHIC');

  useFrame(({ clock }) => {
    if (sweepRef.current) sweepRef.current.rotation.y = -clock.getElapsedTime() * 0.9;
  });

  if (!isNVG) return null;

  const ringColor = satelliteViewMode === 'THERMAL' ? '#ff4400' : satelliteViewMode === 'TOPOGRAPHIC' ? '#00e5ff' : '#00ff66';
  const sweepColor = satelliteViewMode === 'THERMAL' ? '#ff6600' : satelliteViewMode === 'TOPOGRAPHIC' ? '#00ccff' : '#33ff88';

  return (
    <group position={[0, 0.52, 0]}>
      {[1.2, 2.5, 3.8, 5.2].map((r, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r - 0.015, r + 0.015, 80]} />
          <meshBasicMaterial color={ringColor} transparent opacity={0.15 + (4 - i) * 0.05} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Crosshair lines */}
      {[0, Math.PI / 2, Math.PI, 3 * Math.PI / 2].map((angle, i) => (
        <mesh key={`line-${i}`} rotation={[-Math.PI / 2, 0, angle]}>
          <planeGeometry args={[5.4, 0.01]} />
          <meshBasicMaterial color={ringColor} transparent opacity={0.12} />
        </mesh>
      ))}
      <group ref={sweepRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.05, 5.4, 48, 1, 0, Math.PI / 5]} />
          <meshBasicMaterial color={sweepColor} transparent opacity={0.32} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
          <planeGeometry args={[5.4, 0.025]} />
          <meshBasicMaterial color={sweepColor} transparent opacity={0.85} />
        </mesh>
      </group>
    </group>
  );
};

// ══════════════════════════════════════════════════════════════════
// ATMOSPHERIC HAZE PLANES (Valley mist depth layering)
// ══════════════════════════════════════════════════════════════════
const AtmosphericHaze: React.FC = React.memo(() => {
  const isSatelliteView = useGameStore(s => s.isSatelliteView);
  const hazePlanes = useMemo(() => [
    { y: 0.46, opacity: 0.055, color: '#a8c0d0' },
    { y: 0.58, opacity: 0.038, color: '#b0c8d8' },
    { y: 0.72, opacity: 0.028, color: '#9ab8cc' },
    { y: 0.90, opacity: 0.020, color: '#c8d8e8' },
    { y: 1.20, opacity: 0.015, color: '#d8e8f0' },
  ], []);

  if (isSatelliteView) return null;

  return (
    <group>
      {hazePlanes.map((plane, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, plane.y, 0]}>
          <planeGeometry args={[16, 13]} />
          <meshBasicMaterial
            color={plane.color}
            transparent
            opacity={plane.opacity}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
});

// ══════════════════════════════════════════════════════════════════
// CONTOUR LINE OVERLAY (Tactical topographic grid)
// ══════════════════════════════════════════════════════════════════
const ContourOverlay: React.FC<{ geometry: THREE.BufferGeometry; isSatellite: boolean; mode: SatelliteViewMode }> = React.memo(
  ({ geometry, isSatellite, mode }) => {
    const color = isSatellite
      ? (mode === 'STARLIGHT_NVG' ? '#00ff66' : mode === 'THERMAL' ? '#ff4400' : '#00e5ff')
      : '#d4a855';
    const opacity = isSatellite
      ? (mode === 'STARLIGHT_NVG' ? 0.55 : 0.32)
      : 0.08;

    return (
      <mesh geometry={geometry} position={[0, 0.004, 0]}>
        <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
      </mesh>
    );
  }
);

// ══════════════════════════════════════════════════════════════════
// MAIN KASHMIR TERRAIN COMPONENT
// ══════════════════════════════════════════════════════════════════
export const KashmirTerrainComponent: React.FC = () => {
  const isSatelliteView = useGameStore(s => s.isSatelliteView);
  const satelliteViewMode = useGameStore(s => s.satelliteViewMode);
  const terrainRef = useRef<THREE.Mesh>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  // Ultra-high resolution terrain geometry
  const { baseGeo } = useMemo(() => {
    const width = 14.0;
    const depth = 11.0;
    const wSegs = 280;
    const dSegs = 220;

    const geo = new THREE.PlaneGeometry(width, depth, wSegs, dSegs);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const uvs = geo.attributes.uv;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      let elevation = 0.38;

      // ─── 1. Trans-Himalayan / Karakoram / Great Himalaya (NE sector) ───
      if (x > -0.5 && z < 0.5) {
        const neAxis = x * 0.55 - z * 0.58;
        elevation += Math.max(0, neAxis * 1.05);
        elevation += Math.sin(x * 3.5) * Math.cos(z * 3.1) * 0.42;
        elevation += Math.sin(x * 8.5 + z * 6.8) * 0.19;
        elevation += Math.cos(x * 16.5 - z * 13.5) * 0.058;
        elevation += Math.sin(x * 33.0 + z * 28.5) * 0.022;
        elevation += Math.cos(x * 65.0 - z * 55.0) * 0.010; // micro-rocky detail
      }

      // ─── 2. Pir Panjal Mountain Wall ───
      if (x < 1.0 && z > -1.0 && z < 2.4) {
        const pirDist = Math.abs(z - (0.38 * x + 0.75));
        if (pirDist < 1.5) {
          const ridge = (1.5 - pirDist) * 0.50;
          elevation += ridge;
        }
        elevation += Math.cos(x * 3.6 + 1.2) * Math.sin(z * 3.9) * 0.26;
        elevation += Math.sin(x * 7.4 - z * 5.4) * 0.12;
        elevation += Math.cos(x * 29.0 - z * 23.0) * 0.019;
      }

      // ─── 3. Zanskar Range (west Ladakh) ───
      if (x > 1.5 && x < 4.5 && z < -0.5 && z > -4.5) {
        elevation += Math.sin(x * 2.8) * Math.cos(z * 2.4) * 0.35;
        elevation += Math.sin(x * 6.5 - z * 5.0) * 0.15;
        elevation += Math.cos(x * 22.0 + z * 18.0) * 0.035;
      }

      // ─── 4. Central Kashmir Valley Basin ───
      const distToValley = Math.sqrt(Math.pow(x / 1.85, 2) + Math.pow((z - 0.1) / 1.45, 2));
      if (distToValley < 1.0) {
        const valleyFloor = 0.43 + Math.sin(x * 3.2) * Math.cos(z * 3.0) * 0.022;
        elevation = THREE.MathUtils.lerp(valleyFloor, elevation, Math.pow(distToValley, 2.4));
      }

      // ─── 5. Jhelum River Canyon carving ───
      if (x < 0.3 && x > -3.8 && z > -1.3 && z < 0.25) {
        const riverZ = 0.20 * x - 0.33;
        const distToRiver = Math.abs(z - riverZ);
        if (distToRiver < 0.52) {
          elevation -= (0.52 - distToRiver) * 0.50;
        }
      }

      // ─── 6. Kishanganga gorge (NW) ───
      if (x < -0.8 && x > -3.2 && z < -0.5 && z > -2.5) {
        const kgZ = -0.28 * x - 1.6;
        const distKG = Math.abs(z - kgZ);
        if (distKG < 0.28) {
          elevation -= (0.28 - distKG) * 0.32;
        }
      }

      // ─── 7. Jammu Shiwalik Plains ───
      if (z > 2.5) {
        const sProg = (z - 2.5) / 2.5;
        elevation = THREE.MathUtils.lerp(elevation, 0.20 + Math.sin(x * 4.2) * 0.030, Math.min(1, sProg * 1.2));
      }

      // ─── 8. Leh-Ladakh high plateau ───
      if (x > 2.5 && z < -2.0) {
        const plateauBase = 2.1 + Math.sin(x * 2.0) * Math.cos(z * 1.8) * 0.25;
        elevation = Math.max(elevation, plateauBase * Math.min(1, (x - 2.5) / 1.0));
      }

      // ─── 9. Border edge falloff ───
      const edgeX = Math.abs(x) / (width / 2);
      const edgeZ = Math.abs(z) / (depth / 2);
      const edgeDist = Math.max(edgeX, edgeZ);
      if (edgeDist > 0.80) {
        const falloff = Math.pow((1.0 - edgeDist) / 0.20, 1.5);
        elevation = Math.max(0.08, elevation * Math.max(0, falloff));
      }

      pos.setY(i, Math.max(0.08, elevation));
    }

    geo.computeVertexNormals();
    return { baseGeo: geo };
  }, []);

  // Color-assigned geometry based on view mode
  const coloredGeometry = useMemo(() => {
    const geo = baseGeo.clone();
    const colors: number[] = [];
    const activeMode: SatelliteViewMode = isSatelliteView ? satelliteViewMode : 'STANDARD';

    let cRiver: string, cValley: string, cSlope: string, cRock: string, cHighCrag: string, cSnow: string;

    if (activeMode === 'STARLIGHT_NVG') {
      cRiver = '#000f08'; cValley = '#002810'; cSlope = '#004820'; cRock = '#007230'; cHighCrag = '#00a845'; cSnow = '#00ff66';
    } else if (activeMode === 'THERMAL') {
      cRiver = '#00082a'; cValley = '#18002e'; cSlope = '#5a0058'; cRock = '#c41e00'; cHighCrag = '#ff7a00'; cSnow = '#ffff44';
    } else if (activeMode === 'OPTICAL') {
      cRiver = '#0a3552'; cValley = '#2a5524'; cSlope = '#887250'; cRock = '#5a3e30'; cHighCrag = '#787878'; cSnow = '#fafafa';
    } else if (activeMode === 'TOPOGRAPHIC') {
      cRiver = '#002244'; cValley = '#005522'; cSlope = '#886600'; cRock = '#8b4513'; cHighCrag = '#a0522d'; cSnow = '#f5f5ff';
    } else {
      // PHOTOREALISTIC HIMALAYAN (default war-room)
      cRiver = '#0b3450'; cValley = '#2e5028'; cSlope = '#44502d'; cRock = '#524438'; cHighCrag = '#706050'; cSnow = '#f6f8fa';
    }

    const R = new THREE.Color(cRiver), V = new THREE.Color(cValley), S = new THREE.Color(cSlope);
    const K = new THREE.Color(cRock), H = new THREE.Color(cHighCrag), W = new THREE.Color(cSnow);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const c = new THREE.Color();
      if (y < 0.28) {
        c.copy(R).lerp(V, Math.max(0, Math.min(1, y / 0.28)));
      } else if (y < 0.50) {
        c.copy(V).lerp(S, (y - 0.28) / 0.22);
      } else if (y < 0.78) {
        c.copy(S).lerp(K, (y - 0.50) / 0.28);
      } else if (y < 1.05) {
        c.copy(K).lerp(H, (y - 0.78) / 0.27);
      } else {
        c.copy(H).lerp(W, Math.min(1, (y - 1.05) / 0.45));
      }
      colors.push(c.r, c.g, c.b);
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, [baseGeo, isSatelliteView, satelliteViewMode]);

  return (
    <group position={[0, 0, 0]}>
      {/* ── MAIN TERRAIN SURFACE ── */}
      <mesh geometry={coloredGeometry} receiveShadow castShadow ref={terrainRef}>
        <meshStandardMaterial
          vertexColors
          roughness={0.68}
          metalness={0.12}
          flatShading={false}
          envMapIntensity={0.4}
        />
      </mesh>

      {/* ── TOPOGRAPHIC CONTOUR WIREFRAME ── */}
      <ContourOverlay
        geometry={baseGeo}
        isSatellite={isSatelliteView}
        mode={satelliteViewMode}
      />

      {/* ── WATERWAYS ── */}
      <PremiumGlacialWaters />

      {/* ── PINE & DEODAR FORESTS ── */}
      <PremiumPineForest count={280} />

      {/* ── ATMOSPHERIC VALLEY HAZE ── */}
      <AtmosphericHaze />

      {/* ── HIMALAYAN SNOW PARTICLES ── */}
      <HimalayanSnowParticles />

      {/* ── CLOUD LAYER ── */}
      <AnimatedClouds />

      {/* ── CAMPFIRE POINT LIGHTS ── */}
      <BattlefieldCampfires />

      {/* ── STARLIGHT NVG RADAR ── */}
      <StarlightRadarSweep />
    </group>
  );
};

export const KashmirTerrain = KashmirTerrainComponent;
