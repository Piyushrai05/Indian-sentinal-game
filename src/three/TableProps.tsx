import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const TableProps = React.memo(() => {
  const lanternLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (lanternLightRef.current) {
      const t = clock.getElapsedTime();
      const flicker = Math.sin(t * 8.5) * 0.15 + Math.cos(t * 14.2) * 0.1;
      lanternLightRef.current.intensity = 2.4 + flicker;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ─────────────────────────────────────────────────────────────
          1. VINTAGE KEROSENE STORM LANTERN (Top-Left corner)
          ───────────────────────────────────────────────────────────── */}
      <group position={[-5.8, 0.4, -4.2]}>
        {/* Brass Base Fuel Tank */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.55, 0.4, 24]} />
          <meshStandardMaterial color="#946c2d" roughness={0.35} metalness={0.7} />
        </mesh>

        {/* Glass Chimney / Globe */}
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.3, 0.38, 0.6, 24]} />
          <meshStandardMaterial
            color="#fff0d0"
            transparent
            opacity={0.45}
            roughness={0.1}
          />
        </mesh>

        {/* Glowing Flame / Core */}
        <mesh position={[0, 0.62, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#ffc15e" />
        </mesh>

        {/* Dynamic Warm Lantern Point Light */}
        <pointLight
          ref={lanternLightRef}
          color="#ffb356"
          intensity={2.5}
          distance={20}
          decay={1.8}
          castShadow
          shadow-bias={-0.0005}
        />

        {/* Brass Cap & Vented Hood */}
        <mesh position={[0, 1.05, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.25, 0.25, 24]} />
          <meshStandardMaterial color="#825c21" roughness={0.38} metalness={0.72} />
        </mesh>

        {/* Brass Wire Frame Cage & Handle */}
        <mesh position={[0, 0.65, 0]}>
          <torusGeometry args={[0.42, 0.02, 12, 24]} />
          <meshStandardMaterial color="#7a5720" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          2. BRASS NAVIGATIONAL DIVIDER / COMPASS (Bottom-Right corner)
          ───────────────────────────────────────────────────────────── */}
      <group position={[5.4, 0.28, 4.2]} rotation={[0, -0.4, 0]}>
        <mesh position={[0, 0.08, 0]} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#c09a5b" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[-0.3, 0.04, 0.4]} rotation={[0, 0.35, 0.1]} castShadow>
          <cylinderGeometry args={[0.02, 0.005, 1.2, 12]} />
          <meshStandardMaterial color="#c09a5b" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0.3, 0.04, 0.4]} rotation={[0, -0.35, -0.1]} castShadow>
          <cylinderGeometry args={[0.02, 0.005, 1.2, 12]} />
          <meshStandardMaterial color="#c09a5b" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          3. FIELD NOTEBOOK & LEATHER DISPATCH CASE (Top-Right)
          ───────────────────────────────────────────────────────────── */}
      <group position={[5.6, 0.25, -3.8]} rotation={[0, -0.25, 0]}>
        <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.08, 1.9]} />
          <meshStandardMaterial color="#2d1c12" roughness={0.85} metalness={0.05} />
        </mesh>
        <mesh position={[0.02, 0.09, 0]}>
          <boxGeometry args={[1.3, 0.04, 1.8]} />
          <meshStandardMaterial color="#d4c39f" roughness={0.92} metalness={0.02} />
        </mesh>
        <mesh position={[0.1, 0.12, 0.2]} rotation={[0, 0.15, 0]}>
          <boxGeometry args={[0.12, 0.01, 1.6]} />
          <meshStandardMaterial color="#88221b" roughness={0.6} />
        </mesh>
        <mesh position={[-0.85, 0.04, 0.1]} rotation={[0, 0.08, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.5, 12]} />
          <meshStandardMaterial color="#916c3b" roughness={0.6} metalness={0.1} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          4. ROLLED DAKOTA FLIGHT CHARTS (Bottom-Left)
          ───────────────────────────────────────────────────────────── */}
      <group position={[-5.6, 0.25, 3.8]} rotation={[0, 0.45, 0]}>
        <mesh position={[0, 0.08, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 2.2, 20]} />
          <meshStandardMaterial color="#948467" roughness={0.85} metalness={0.05} />
        </mesh>
        <mesh position={[0.15, 0.08, 0.28]} rotation={[0, 0.2, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.11, 0.11, 1.9, 20]} />
          <meshStandardMaterial color="#b5a585" roughness={0.88} metalness={0.05} />
        </mesh>
      </group>

      {/* ─────────────────────────────────────────────────────────────
          5. BRASS MAGNIFYING GLASS
          ───────────────────────────────────────────────────────────── */}
      <group position={[-4.5, 0.25, 4.6]} rotation={[0, -0.3, 0]}>
        <mesh position={[0, 0.04, 0.6]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.025, 0.8, 16]} />
          <meshStandardMaterial color="#2a1a0e" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.35, 0.03, 16, 32]} />
          <meshStandardMaterial color="#c09a5b" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.02, 32]} />
          <meshStandardMaterial
            color="#e0f2fe"
            transparent
            opacity={0.35}
            roughness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
});
