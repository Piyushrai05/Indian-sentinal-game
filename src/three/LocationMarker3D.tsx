import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { LocationData } from '../types/game';
import { useGameStore } from '../store/gameStore';

interface LocationMarker3DProps {
  location: LocationData;
}

export const LocationMarker3D: React.FC<LocationMarker3DProps> = ({ location }) => {
  const selectedLocationId = useGameStore(s => s.selectedLocationId);
  const selectLocation = useGameStore(s => s.selectLocation);
  const isSatelliteView = useGameStore(s => s.isSatelliteView);
  const satelliteViewMode = useGameStore(s => s.satelliteViewMode);

  const isSelected = selectedLocationId === location.id;
  const isStarlight = isSatelliteView && satelliteViewMode === 'STARLIGHT_NVG';

  const ringRef = useRef<THREE.Mesh>(null);
  const gemRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const statusColors: Record<string, string> = {
    SECURED: '#4ade80',    // Clean Emerald Green
    CONTESTED: '#fbbf24',  // Warm Amber
    CRITICAL: '#ef4444',   // Crimson Red
    UNKNOWN: '#94a3b8',
    THREATENED: '#fbbf24',
    FRONTLINE: '#ef4444',
    'HEAVY ENGAGEMENT': '#ef4444',
    'UNDER SIEGE': '#f87171',
    'ISOLATED HIGH PLAIN': '#4ade80',
    'REAR BASE': '#4ade80',
  };

  const primaryColor = isStarlight
    ? (location.status === 'CRITICAL' || location.status === 'CONTESTED' || location.status === 'UNDER SIEGE' ? '#ff3333' : '#00ff66')
    : (statusColors[location.status] || '#fbbf24');

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      const scale = isSelected ? (1.0 + Math.sin(t * 3.0) * 0.15) : (1.0 + Math.sin(t * 1.5) * 0.06);
      ringRef.current.scale.set(scale, scale, 1);
    }
    if (gemRef.current) {
      gemRef.current.position.y = 0.52 + Math.sin(t * 2.0 + location.lat) * 0.03;
      gemRef.current.rotation.y = t * 0.8;
    }
  });

  const [x, y, z] = location.gridPosition;

  return (
    <group
      ref={groupRef}
      position={[x, y + 0.05, z]}
      onClick={(e) => {
        e.stopPropagation();
        selectLocation(location.id);
      }}
    >
      {/* 1. Tactical Circular Ground Ring Base */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.03, 24]} />
        <meshStandardMaterial
          color={isSelected ? '#c09a5b' : '#14120e'}
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* 2. Pulsing Glow Ring */}
      <mesh
        ref={ringRef}
        position={[0, 0.03, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.26, 0.36, 32]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={isSelected ? 0.9 : 0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Sleek Brass Tactical Pin Stem */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.45, 12]} />
        <meshStandardMaterial color="#c09a5b" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* 4. Glowing Tactical Gem / Orb */}
      <mesh ref={gemRef} position={[0, 0.52, 0]} castShadow>
        <octahedronGeometry args={[0.11]} />
        <meshStandardMaterial
          color={primaryColor}
          roughness={0.2}
          metalness={0.8}
          emissive={primaryColor}
          emissiveIntensity={isSelected ? 0.9 : 0.4}
        />
      </mesh>

      {/* 5. Minimalist High-Visibility Military Label */}
      <Html
        position={[0, 0.72, 0]}
        center
        distanceFactor={14}
        className="pointer-events-none select-none z-10"
      >
        <div className={`flex flex-col items-center transition-all duration-200 ${
          isSelected ? 'scale-115' : 'hover:scale-105'
        }`}>
          <div
            className={`px-2.5 py-1 rounded border shadow-xl flex items-center gap-1.5 backdrop-blur-md font-mono whitespace-nowrap ${
              isSelected
                ? 'bg-[#1a1712]/95 border-[#c09a5b] text-[#f4ecd8] ring-2 ring-[#c09a5b]/40 shadow-[0_0_20px_rgba(192,154,91,0.5)]'
                : 'bg-[#100e0b]/90 border-[#3d3425] text-[#d5c7b0]'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full inline-block animate-pulse shadow-sm"
              style={{ backgroundColor: primaryColor }}
            />
            <span className="font-serif font-extrabold text-xs tracking-wider uppercase drop-shadow">
              {location.name}
            </span>
          </div>

          <div className="text-[9px] font-mono text-[#c09a5b] mt-0.5 bg-black/80 px-1.5 py-0.2 rounded border border-[#c09a5b]/30 shadow-md">
            {isStarlight ? `${location.lat.toFixed(4)}° N, ${location.lng.toFixed(4)}° E` : location.elevation}
          </div>
        </div>
      </Html>
    </group>
  );
};
