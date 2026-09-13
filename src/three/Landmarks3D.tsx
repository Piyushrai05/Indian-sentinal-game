import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

// ══════════════════════════════════════════════════════════════════
// PREMIUM LANDMARKS 3D — Historical J&K 1947 Battlefield Structures
// IAF Airfields, Himalayan Forts, Artillery, Armour, Memorials
// ══════════════════════════════════════════════════════════════════

// Shared reusable materials
const BRASS = new THREE.MeshStandardMaterial({ color: '#c09a4a', metalness: 0.88, roughness: 0.22 });
const CONCRETE = new THREE.MeshStandardMaterial({ color: '#4a4438', roughness: 0.88, metalness: 0.12 });
const STONE = new THREE.MeshStandardMaterial({ color: '#6a5c48', roughness: 0.92, metalness: 0.05 });
const DARK_METAL = new THREE.MeshStandardMaterial({ color: '#2e2e2e', metalness: 0.85, roughness: 0.28 });
const IAF_GREEN = new THREE.MeshStandardMaterial({ color: '#445844', metalness: 0.45, roughness: 0.55 });

// ── Glowing beacon mesh ──────────────────────────────────────────
const Beacon: React.FC<{ position: [number, number, number]; color: string; pulseSpeed?: number }> = ({ position, color, pulseSpeed = 2.2 }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.55 + Math.sin(clock.getElapsedTime() * pulseSpeed) * 0.38;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  );
};

// ── Animated rotary spotlight ─────────────────────────────────────
const FortSpotlight: React.FC<{ basePos: [number, number, number]; color?: string }> = ({ basePos, color = '#ffffc0' }) => {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (lightRef.current && targetRef.current) {
      const angle = t * 0.55;
      targetRef.current.position.set(
        basePos[0] + Math.sin(angle) * 1.8,
        basePos[1] - 0.5,
        basePos[2] + Math.cos(angle) * 1.8
      );
      targetRef.current.updateMatrixWorld();
    }
  });

  return (
    <>
      <object3D ref={targetRef} position={[basePos[0], basePos[1] - 0.5, basePos[2]]} />
      <spotLight
        ref={lightRef}
        position={basePos}
        color={color}
        intensity={2.8}
        angle={Math.PI / 14}
        penumbra={0.6}
        distance={8}
        castShadow={false}
        target={targetRef.current!}
      />
    </>
  );
};

// ── Artillery piece ───────────────────────────────────────────────
const ArtilleryPiece: React.FC<{ position: [number, number, number]; angle?: number }> = ({ position, angle = 0 }) => (
  <group position={position} rotation={[0, angle, 0]} scale={[0.8, 0.8, 0.8]}>
    {/* Carriage */}
    <mesh castShadow position={[0, 0.028, 0]} rotation={[0, 0, 0]}>
      <boxGeometry args={[0.09, 0.04, 0.22]} />
      <meshStandardMaterial color="#3c3828" roughness={0.88} metalness={0.2} />
    </mesh>
    {/* Barrel */}
    <mesh castShadow position={[0, 0.06, -0.06]} rotation={[0.22, 0, 0]}>
      <cylinderGeometry args={[0.018, 0.022, 0.22, 8]} />
      <primitive object={DARK_METAL} attach="material" />
    </mesh>
    {/* Wheels */}
    {[-0.055, 0.055].map((x, i) => (
      <mesh key={i} castShadow position={[x, 0.038, 0.04]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.038, 0.038, 0.012, 10]} />
        <meshStandardMaterial color="#2a2010" roughness={0.9} />
      </mesh>
    ))}
  </group>
);

// ── Stuart Light Tank ─────────────────────────────────────────────
const StuartTank: React.FC<{ position: [number, number, number]; rotation?: number }> = ({ position, rotation = 0 }) => (
  <group position={position} rotation={[0, rotation, 0]}>
    {/* Hull */}
    <mesh castShadow position={[0, 0.032, 0]}>
      <boxGeometry args={[0.14, 0.05, 0.24]} />
      <meshStandardMaterial color="#4a5c38" metalness={0.35} roughness={0.65} />
    </mesh>
    {/* Tracks */}
    {[-0.085, 0.085].map((x, i) => (
      <mesh key={i} castShadow position={[x, 0.025, 0]}>
        <boxGeometry args={[0.025, 0.045, 0.26]} />
        <meshStandardMaterial color="#2a2820" roughness={0.9} metalness={0.4} />
      </mesh>
    ))}
    {/* Turret */}
    <mesh castShadow position={[0, 0.075, -0.02]}>
      <cylinderGeometry args={[0.05, 0.06, 0.04, 8]} />
      <meshStandardMaterial color="#3e5030" metalness={0.38} roughness={0.62} />
    </mesh>
    {/* Main Gun */}
    <mesh castShadow position={[0, 0.075, -0.075]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.009, 0.012, 0.12, 6]} />
      <primitive object={DARK_METAL} attach="material" />
    </mesh>
  </group>
);

// ── IAF Dakota C-47 ───────────────────────────────────────────────
const DakotaAircraft: React.FC<{ position: [number, number, number]; rotation?: number }> = ({ position, rotation = 0 }) => (
  <group position={position} rotation={[0, rotation, 0]} scale={[0.12, 0.12, 0.12]}>
    {/* Fuselage */}
    <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.22, 0.28, 2.2, 10]} />
      <primitive object={IAF_GREEN} attach="material" />
    </mesh>
    {/* Wings */}
    <mesh castShadow position={[0, 0, 0.08]}>
      <boxGeometry args={[3.4, 0.06, 0.65]} />
      <meshStandardMaterial color="#3e5040" metalness={0.4} roughness={0.55} />
    </mesh>
    {/* H-stab */}
    <mesh castShadow position={[0, 0.12, -0.95]}>
      <boxGeometry args={[1.2, 0.04, 0.28]} />
      <meshStandardMaterial color="#3e5040" metalness={0.4} roughness={0.55} />
    </mesh>
    {/* V-stab */}
    <mesh castShadow position={[0, 0.38, -0.92]}>
      <boxGeometry args={[0.05, 0.58, 0.28]} />
      <meshStandardMaterial color="#3e5040" metalness={0.4} roughness={0.55} />
    </mesh>
    {/* Left engine */}
    <mesh castShadow position={[-1.1, -0.08, 0.04]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.14, 0.18, 0.38, 8]} />
      <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
    </mesh>
    {/* Right engine */}
    <mesh castShadow position={[1.1, -0.08, 0.04]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.14, 0.18, 0.38, 8]} />
      <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
    </mesh>
  </group>
);

// ══════════════════════════════════════════════════════════════════
// MAIN LANDMARKS COMPONENT
// ══════════════════════════════════════════════════════════════════
export const Landmarks3D: React.FC = () => {
  const gunFlash1Ref = useRef<THREE.Mesh>(null);
  const gunFlash2Ref = useRef<THREE.Mesh>(null);
  const smokeGroupRef = useRef<THREE.Group>(null);
  const isSatelliteView = useGameStore(s => s.isSatelliteView);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // ── Battlefield gun muzzle flashes ──
    if (gunFlash1Ref.current) {
      const flashOn = Math.sin(t * 3.8 + 0.5) > 0.85;
      (gunFlash1Ref.current.material as THREE.MeshBasicMaterial).opacity = flashOn ? 0.88 : 0;
    }
    if (gunFlash2Ref.current) {
      const flashOn = Math.sin(t * 4.4 + 1.8) > 0.88;
      (gunFlash2Ref.current.material as THREE.MeshBasicMaterial).opacity = flashOn ? 0.75 : 0;
    }

    // ── Smoke columns drift ──
    if (smokeGroupRef.current) {
      smokeGroupRef.current.children.forEach((child, i) => {
        child.position.y = 0.02 + ((t * 0.12 + i * 0.18) % 0.4);
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          const phase = (t * 0.12 + i * 0.18) % 0.4;
          mat.opacity = phase < 0.25 ? phase / 0.25 * 0.22 : (0.4 - phase) / 0.15 * 0.22;
        }
      });
    }
  });

  return (
    <group>

      {/* ══════════════════════════════════════════════════════════
          1. SRINAGAR AIRFIELD — IAF Forward Operating Base
          ══════════════════════════════════════════════════════════ */}
      <group position={[0, 0.455, 0.05]}>
        {/* Concrete runway */}
        <mesh rotation={[-Math.PI / 2, 0, 0.28]} receiveShadow>
          <planeGeometry args={[2.0, 0.24, 8, 2]} />
          <primitive object={CONCRETE} attach="material" />
        </mesh>
        {/* Taxiway */}
        <mesh rotation={[-Math.PI / 2, 0, 0.28]} position={[0.14, 0.001, 0.14]}>
          <planeGeometry args={[0.8, 0.10]} />
          <meshStandardMaterial color="#3c3428" roughness={0.9} />
        </mesh>
        {/* Runway centerline */}
        <mesh rotation={[-Math.PI / 2, 0, 0.28]} position={[0, 0.002, 0]}>
          <planeGeometry args={[1.85, 0.018]} />
          <meshBasicMaterial color="#f0e8d0" />
        </mesh>
        {/* Runway edge lights */}
        {[-0.85, -0.42, 0, 0.42, 0.85].map((dx, i) => (
          <Beacon
            key={i}
            position={[dx * Math.cos(0.28) + 0.06 * Math.sin(0.28), 0.01, dx * Math.sin(0.28) - 0.06 * Math.cos(0.28) + 0.05]}
            color="#00ff88"
            pulseSpeed={1.4 + i * 0.1}
          />
        ))}
        {/* Control Tower */}
        <mesh position={[0.5, 0.08, 0.16]} castShadow>
          <boxGeometry args={[0.12, 0.16, 0.12]} />
          <primitive object={CONCRETE} attach="material" />
        </mesh>
        <mesh position={[0.5, 0.20, 0.16]} castShadow>
          <cylinderGeometry args={[0.045, 0.055, 0.075, 8]} />
          <primitive object={BRASS} attach="material" />
        </mesh>
        {/* Radar dish on tower */}
        <mesh position={[0.5, 0.26, 0.16]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.028, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} wireframe />
        </mesh>
        {/* Hangar 1 */}
        <mesh position={[0.3, 0.045, 0.22]} castShadow>
          <boxGeometry args={[0.28, 0.09, 0.18]} />
          <meshStandardMaterial color="#4e4438" roughness={0.85} />
        </mesh>
        {/* Hangar 2 */}
        <mesh position={[0.55, 0.038, 0.30]} castShadow>
          <boxGeometry args={[0.22, 0.075, 0.14]} />
          <meshStandardMaterial color="#464038" roughness={0.85} />
        </mesh>
        {/* Parked C-47 Dakota #1 */}
        <DakotaAircraft position={[-0.28, 0.042, 0]} rotation={0.28} />
        {/* Parked C-47 Dakota #2 */}
        <DakotaAircraft position={[0.02, 0.042, 0.24]} rotation={-0.15} />
        {/* Fuel Depot drums */}
        <mesh position={[0.65, 0.018, 0.05]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.04, 6]} />
          <meshStandardMaterial color="#8b1a00" roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh position={[0.68, 0.018, 0.05]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.04, 6]} />
          <meshStandardMaterial color="#8b1a00" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* Perimeter fence posts */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 1.1, 0.022, Math.sin(angle) * 0.45 + 0.06]} castShadow>
              <cylinderGeometry args={[0.008, 0.008, 0.06, 4]} />
              <meshStandardMaterial color="#5a4030" roughness={0.9} />
            </mesh>
          );
        })}
      </group>

      {/* ══════════════════════════════════════════════════════════
          2. JAMMU — BAHU FORT & TAWI RIVER CITADEL
          ══════════════════════════════════════════════════════════ */}
      <group position={[0.85, 0.245, 3.65]}>
        {/* Main fort wall */}
        <mesh castShadow position={[0, 0.09, 0]}>
          <boxGeometry args={[0.45, 0.18, 0.42]} />
          <primitive object={STONE} attach="material" />
        </mesh>
        {/* Inner keep */}
        <mesh castShadow position={[0, 0.18, 0]}>
          <boxGeometry args={[0.28, 0.10, 0.28]} />
          <meshStandardMaterial color="#7a6a52" roughness={0.9} />
        </mesh>
        {/* Corner bastions x4 */}
        {[[-0.22, -0.21], [0.22, -0.21], [-0.22, 0.21], [0.22, 0.21]].map(([x, z], i) => (
          <mesh key={i} castShadow position={[x, 0.12, z]}>
            <cylinderGeometry args={[0.058, 0.065, 0.24, 8]} />
            <primitive object={STONE} attach="material" />
          </mesh>
        ))}
        {/* Battlements on top */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} castShadow position={[(i - 2.5) * 0.075, 0.195, -0.22]}>
            <boxGeometry args={[0.045, 0.03, 0.022]} />
            <meshStandardMaterial color="#6a5c46" roughness={0.92} />
          </mesh>
        ))}
        {/* Indian tricolor flagpole */}
        <mesh castShadow position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.006, 0.008, 0.28, 6]} />
          <primitive object={BRASS} attach="material" />
        </mesh>
        {/* Flag */}
        <mesh position={[0.04, 0.41, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.10, 0.058]} />
          <meshBasicMaterial color="#ff8800" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.04, 0.377, 0]}>
          <planeGeometry args={[0.10, 0.020]} />
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.04, 0.344, 0]}>
          <planeGeometry args={[0.10, 0.058]} />
          <meshBasicMaterial color="#1a6b3c" side={THREE.DoubleSide} />
        </mesh>
        {/* Spotlights */}
        <FortSpotlight basePos={[0.85 + 0.22, 0.245 + 0.26, 3.65 + 0.21]} color="#ffffc0" />
        {/* Artillery battery */}
        <ArtilleryPiece position={[0.25, 0.04, 0.18]} angle={0.4} />
        <ArtilleryPiece position={[-0.22, 0.04, 0.22]} angle={0.8} />
      </group>

      {/* ══════════════════════════════════════════════════════════
          3. BARAMULLA — STONE BRIDGE CONTESTED CROSSING
          ══════════════════════════════════════════════════════════ */}
      <group position={[-1.55, 0.475, -0.65]}>
        {/* Stone bridge arch */}
        <mesh castShadow rotation={[-Math.PI / 2, 0, 0.18]}>
          <boxGeometry args={[0.78, 0.08, 0.18]} />
          <meshStandardMaterial color="#8a7860" roughness={0.92} />
        </mesh>
        {/* Bridge arch bottom */}
        <mesh castShadow position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0.18]}>
          <cylinderGeometry args={[0.045, 0.042, 0.65, 12, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#7a6850" roughness={0.94} />
        </mesh>
        {/* Bridge parapets */}
        {[-0.095, 0.095].map((x, i) => (
          <mesh key={i} castShadow position={[x * Math.cos(0.18), 0.04, x * -Math.sin(0.18)]}>
            <boxGeometry args={[0.015, 0.04, 0.76]} />
            <meshStandardMaterial color="#9a8870" roughness={0.9} />
          </mesh>
        ))}
        {/* Town buildings near bridge */}
        {[[-0.18, 0.025, 0.15], [0.14, 0.025, 0.12], [-0.10, 0.022, -0.18]].map(([x, y, z], i) => (
          <mesh key={i} castShadow position={[x, y, z]}>
            <boxGeometry args={[0.07 + i * 0.015, 0.05 + i * 0.01, 0.06 + i * 0.01]} />
            <meshStandardMaterial color={['#6a5848', '#624e3c', '#584840'][i]} roughness={0.9} />
          </mesh>
        ))}
        {/* Muzzle flash (contested!) */}
        <mesh ref={gunFlash1Ref} position={[0.32, 0.04, -0.28]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.035, 8]} />
          <meshBasicMaterial color="#ffcc00" transparent opacity={0} depthWrite={false} />
        </mesh>
        {/* Sandbag bunker */}
        <mesh castShadow position={[-0.32, 0.02, 0.28]}>
          <boxGeometry args={[0.12, 0.04, 0.08]} />
          <meshStandardMaterial color="#5a4e38" roughness={0.95} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════════
          4. URI FORTRESS — Jhelum Gorge Choke-Point
          ══════════════════════════════════════════════════════════ */}
      <group position={[-2.85, 0.665, -0.70]}>
        {/* Fortress walls */}
        <mesh castShadow position={[0, 0.11, 0]}>
          <boxGeometry args={[0.38, 0.22, 0.32]} />
          <meshStandardMaterial color="#7a6c5a" roughness={0.88} />
        </mesh>
        {/* Merlons */}
        {[-0.12, -0.04, 0.04, 0.12].map((x, i) => (
          <mesh key={i} castShadow position={[x, 0.24, -0.16]}>
            <boxGeometry args={[0.055, 0.035, 0.025]} />
            <meshStandardMaterial color="#6a5c4a" roughness={0.92} />
          </mesh>
        ))}
        {/* Rotating searchlight */}
        <FortSpotlight basePos={[-2.85 + 0.0, 0.665 + 0.3, -0.70 + 0.0]} color="#ffffd0" />
        {/* Heavy machine gun emplacement */}
        <mesh castShadow position={[0.22, 0.15, -0.06]} rotation={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.02, 6]} />
          <meshStandardMaterial color="#3a3028" roughness={0.85} />
        </mesh>
        <mesh castShadow position={[0.22, 0.165, -0.08]} rotation={[0.25, 0.5, 0]}>
          <cylinderGeometry args={[0.008, 0.010, 0.10, 5]} />
          <primitive object={DARK_METAL} attach="material" />
        </mesh>
        {/* Supply crates */}
        {[[-0.14, 0.12, 0.12], [0.12, 0.12, 0.15]].map(([x, y, z], i) => (
          <mesh key={i} castShadow position={[x, y, z]}>
            <boxGeometry args={[0.04, 0.04, 0.06]} />
            <meshStandardMaterial color="#5a5230" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* ══════════════════════════════════════════════════════════
          5. POONCH — BESIEGED CITADEL (Indian garrison, 1947-48)
          ══════════════════════════════════════════════════════════ */}
      <group position={[-2.60, 0.845, 0.85]}>
        {/* Main citadel */}
        <mesh castShadow position={[0, 0.14, 0]}>
          <boxGeometry args={[0.42, 0.28, 0.38]} />
          <meshStandardMaterial color="#7e7060" roughness={0.86} />
        </mesh>
        {/* 4 corner towers */}
        {[[-0.21, -0.19], [0.21, -0.19], [-0.21, 0.19], [0.21, 0.19]].map(([x, z], i) => (
          <group key={i} position={[x, 0, z]}>
            <mesh castShadow position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.055, 0.065, 0.32, 8]} />
              <meshStandardMaterial color="#7a6c5a" roughness={0.88} />
            </mesh>
            <mesh castShadow position={[0, 0.33, 0]}>
              <coneGeometry args={[0.062, 0.06, 8]} />
              <meshStandardMaterial color="#5a4a3a" roughness={0.85} />
            </mesh>
          </group>
        ))}
        {/* Gate arch */}
        <mesh castShadow position={[0, 0.08, -0.19]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.08, 12, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#6a5c48" roughness={0.9} />
        </mesh>
        {/* Indian flag at Poonch (historical — Poonch never fell) */}
        <mesh castShadow position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.006, 0.008, 0.32, 5]} />
          <primitive object={BRASS} attach="material" />
        </mesh>
        <mesh position={[0.05, 0.56, 0]}>
          <planeGeometry args={[0.12, 0.07]} />
          <meshBasicMaterial color="#ff8800" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.05, 0.526, 0]}>
          <planeGeometry args={[0.12, 0.024]} />
          <meshBasicMaterial color="#fff" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.05, 0.490, 0]}>
          <planeGeometry args={[0.12, 0.07]} />
          <meshBasicMaterial color="#1a6b3c" side={THREE.DoubleSide} />
        </mesh>
        {/* Besieged artillery pointing outward */}
        <ArtilleryPiece position={[-0.18, 0.245, -0.22]} angle={-0.4} />
        <ArtilleryPiece position={[0.18, 0.245, -0.22]} angle={0.4} />
        {/* Muzzle flash 2 */}
        <mesh ref={gunFlash2Ref} position={[0.24, 0.25, -0.30]}>
          <sphereGeometry args={[0.038, 8, 8]} />
          <meshBasicMaterial color="#ff8800" transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════════
          6. NAUSHERA — BRIGADIER USMAN MEMORIAL & DEFENCE LINE
          ══════════════════════════════════════════════════════════ */}
      <group position={[-1.55, 0.375, 2.30]}>
        {/* Memorial obelisk */}
        <mesh castShadow position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.022, 0.035, 0.28, 4]} />
          <meshStandardMaterial color="#e8d8b0" roughness={0.62} metalness={0.1} />
        </mesh>
        <mesh castShadow position={[0, 0.29, 0]}>
          <coneGeometry args={[0.028, 0.055, 4]} />
          <meshStandardMaterial color="#e8d8b0" roughness={0.62} metalness={0.1} />
        </mesh>
        {/* Memorial base */}
        <mesh castShadow position={[0, 0.02, 0]}>
          <boxGeometry args={[0.12, 0.04, 0.12]} />
          <meshStandardMaterial color="#d0c098" roughness={0.7} />
        </mesh>
        {/* Defence line trenches (long boxes) */}
        {[-0.25, 0, 0.25].map((x, i) => (
          <mesh key={i} position={[x, -0.012, 0.22]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.22, 0.06]} />
            <meshStandardMaterial color="#382c1c" roughness={0.97} />
          </mesh>
        ))}
        {/* Machine gun positions */}
        {[-0.25, 0.25].map((x, i) => (
          <mesh key={i} castShadow position={[x, 0.02, 0.22]}>
            <boxGeometry args={[0.06, 0.04, 0.04]} />
            <meshStandardMaterial color="#4a4030" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* ══════════════════════════════════════════════════════════
          7. JHANGAR — PARTISAN OUTPOST & LOGISTICS HUB
          ══════════════════════════════════════════════════════════ */}
      <group position={[-0.75, 0.335, 2.60]}>
        {/* Main outpost blockhouse */}
        <mesh castShadow position={[0, 0.055, 0]}>
          <boxGeometry args={[0.22, 0.11, 0.18]} />
          <meshStandardMaterial color="#6a5c48" roughness={0.9} />
        </mesh>
        {/* Observation post on top */}
        <mesh castShadow position={[0, 0.125, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.05, 8]} />
          <meshStandardMaterial color="#7a6c58" roughness={0.88} />
        </mesh>
        {/* Supply depot tents (organic shape) */}
        {[[-0.18, 0.025, -0.16], [0.16, 0.025, -0.15], [0.18, 0.025, 0.18]].map(([x, y, z], i) => (
          <mesh key={i} castShadow position={[x, y, z]}>
            <coneGeometry args={[0.06, 0.08, 6]} />
            <meshStandardMaterial color={['#556655', '#4e5e46', '#506050'][i]} roughness={0.88} />
          </mesh>
        ))}
        {/* Truck parked */}
        <mesh castShadow position={[0.28, 0.022, 0.05]}>
          <boxGeometry args={[0.12, 0.045, 0.06]} />
          <meshStandardMaterial color="#3e4e38" roughness={0.85} metalness={0.2} />
        </mesh>
        {/* Truck cab */}
        <mesh castShadow position={[0.35, 0.042, 0.05]}>
          <boxGeometry args={[0.05, 0.032, 0.055]} />
          <meshStandardMaterial color="#3e4e38" roughness={0.85} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════════
          8. ZOJI LA PASS — Stuart Tank & Mountain Artillery
          ══════════════════════════════════════════════════════════ */}
      <group position={[0.85, 1.42, -1.95]}>
        {/* Rocky pass geometry */}
        <mesh castShadow position={[0, -0.02, 0]}>
          <boxGeometry args={[0.35, 0.05, 0.22]} />
          <meshStandardMaterial color="#6a6258" roughness={0.95} />
        </mesh>
        {/* Stuart tank on the pass (breakthrough!) */}
        <StuartTank position={[0, 0.058, -0.04]} rotation={0.2} />
        {/* Second Stuart */}
        <StuartTank position={[-0.18, 0.058, 0.08]} rotation={0.5} />
        {/* Mountain gun */}
        <ArtilleryPiece position={[0.22, 0.04, 0.06]} angle={-0.3} />
        {/* Sandbag walls */}
        {[[-0.18, 0.02, -0.14], [0.18, 0.02, -0.14]].map(([x, y, z], i) => (
          <mesh key={i} castShadow position={[x, y, z]}>
            <boxGeometry args={[0.08, 0.04, 0.18]} />
            <meshStandardMaterial color="#5e5040" roughness={0.96} />
          </mesh>
        ))}
        {/* Pass marker stone */}
        <mesh castShadow position={[0, 0.065, 0.14]}>
          <boxGeometry args={[0.05, 0.08, 0.03]} />
          <meshStandardMaterial color="#9a8c78" roughness={0.9} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════════
          9. KARGIL — High-Altitude Frontier Post
          ══════════════════════════════════════════════════════════ */}
      <group position={[1.55, 1.88, -2.65]}>
        {/* Stone watch-tower */}
        <mesh castShadow position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.065, 0.08, 0.36, 8]} />
          <primitive object={STONE} attach="material" />
        </mesh>
        {/* Top battlements */}
        <mesh castShadow position={[0, 0.375, 0]}>
          <cylinderGeometry args={[0.072, 0.070, 0.04, 8]} />
          <meshStandardMaterial color="#8a7c6a" roughness={0.9} />
        </mesh>
        {/* Barracks */}
        <mesh castShadow position={[-0.22, 0.075, 0]}>
          <boxGeometry args={[0.18, 0.15, 0.25]} />
          <meshStandardMaterial color="#6a5e4e" roughness={0.88} />
        </mesh>
        {/* Artillery pointing west */}
        <ArtilleryPiece position={[0.22, 0.04, -0.10]} angle={-1.2} />
        {/* Radio tower */}
        <mesh castShadow position={[0.24, 0.22, 0.18]}>
          <cylinderGeometry args={[0.006, 0.009, 0.28, 4]} />
          <meshStandardMaterial color="#7a6a5a" roughness={0.85} />
        </mesh>
        <mesh castShadow position={[0.24, 0.28, 0.18]}>
          <boxGeometry args={[0.10, 0.008, 0.008]} />
          <primitive object={DARK_METAL} attach="material" />
        </mesh>
        {/* Beacon at top */}
        <Beacon position={[0, 0.42, 0]} color="#ff3300" pulseSpeed={3.5} />
      </group>

      {/* ══════════════════════════════════════════════════════════
          10. LEH — Trans-Himalayan Airstrip & Headquarters
          ══════════════════════════════════════════════════════════ */}
      <group position={[3.20, 2.35, -3.40]}>
        {/* High-altitude airstrip */}
        <mesh rotation={[-Math.PI / 2, 0, 0.15]} receiveShadow>
          <planeGeometry args={[1.6, 0.18]} />
          <meshStandardMaterial color="#3c3830" roughness={0.9} />
        </mesh>
        {/* Runway markings */}
        <mesh rotation={[-Math.PI / 2, 0, 0.15]} position={[0, 0.001, 0]}>
          <planeGeometry args={[1.45, 0.015]} />
          <meshBasicMaterial color="#e8e0c8" />
        </mesh>
        {/* HQ building */}
        <mesh castShadow position={[0.55, 0.058, 0.15]}>
          <boxGeometry args={[0.24, 0.115, 0.18]} />
          <meshStandardMaterial color="#5a5248" roughness={0.88} />
        </mesh>
        {/* Communication antenna */}
        <mesh castShadow position={[0.55, 0.18, 0.15]}>
          <cylinderGeometry args={[0.007, 0.010, 0.20, 5]} />
          <primitive object={BRASS} attach="material" />
        </mesh>
        {/* Flag */}
        <mesh castShadow position={[0.72, 0.16, 0.15]}>
          <cylinderGeometry args={[0.006, 0.008, 0.25, 5]} />
          <primitive object={BRASS} attach="material" />
        </mesh>
        <mesh position={[0.76, 0.24, 0.15]}>
          <planeGeometry args={[0.11, 0.065]} />
          <meshBasicMaterial color="#ff8800" side={THREE.DoubleSide} />
        </mesh>
        {/* Fuel barrels */}
        {[0, 0.05, 0.10].map((x, i) => (
          <mesh key={i} castShadow position={[0.78 + x, 0.02, 0.35]}>
            <cylinderGeometry args={[0.016, 0.016, 0.04, 6]} />
            <meshStandardMaterial color="#7a1800" roughness={0.7} metalness={0.35} />
          </mesh>
        ))}
        {/* Airstrip beacons */}
        {[-0.62, 0, 0.62].map((dx, i) => (
          <Beacon key={i}
            position={[dx * Math.cos(0.15), 0.01, dx * Math.sin(0.15) + 3.40 - 3.40]}
            color="#ffaa00"
            pulseSpeed={1.5 + i * 0.2}
          />
        ))}
      </group>

      {/* ══════════════════════════════════════════════════════════
          SMOKE COLUMNS — Contested battle zones
          ══════════════════════════════════════════════════════════ */}
      <group ref={smokeGroupRef}>
        {[
          [-2.85, 0.72, -0.70],  // Uri
          [-2.60, 0.90, 0.85],   // Poonch
          [0.85, 1.48, -1.95],   // Zoji La
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.08 + i * 0.02, 10]} />
            <meshBasicMaterial color="#556677" transparent opacity={0.18} depthWrite={false} />
          </mesh>
        ))}
      </group>

    </group>
  );
};
