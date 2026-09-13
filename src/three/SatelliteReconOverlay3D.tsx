import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

export const SatelliteReconOverlay3D: React.FC = () => {
  const isSatelliteView = useGameStore(s => s.isSatelliteView);
  const satelliteViewMode = useGameStore(s => s.satelliteViewMode);
  const selectedLocationId = useGameStore(s => s.selectedLocationId);
  const locations = useGameStore(s => s.locations);

  const scanBeamRef = useRef<THREE.Mesh>(null);
  const targetRingRef = useRef<THREE.Group>(null);
  const laserBeamRef = useRef<THREE.Mesh>(null);

  const selectedLoc = locations.find(l => l.id === selectedLocationId) || locations[0];
  const [tx, ty, tz] = selectedLoc ? selectedLoc.gridPosition : [0, 0, 0];

  const primaryColor =
    satelliteViewMode === 'THERMAL'
      ? '#ff5722'
      : satelliteViewMode === 'TOPOGRAPHIC'
      ? '#00e5ff'
      : '#00ff88';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 1. Orbital Scanline sweeping from Z = -4.2 to +4.2
    if (scanBeamRef.current && isSatelliteView) {
      const scanZ = ((t * 0.8) % 8.4) - 4.2;
      scanBeamRef.current.position.z = scanZ;
      const mat = scanBeamRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.25 + Math.sin(t * 4) * 0.1;
      }
    }

    // 2. Rotating Target Reticle over selected sector
    if (targetRingRef.current) {
      targetRingRef.current.rotation.y = t * 0.6;
    }

    // 3. Pulsing targeting beam
    if (laserBeamRef.current) {
      const mat = laserBeamRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = 0.35 + Math.sin(t * 6) * 0.15;
      }
    }
  });

  if (!isSatelliteView && !selectedLoc) return null;

  return (
    <group position={[0, 0, 0]}>
      {/* ─────────────────────────────────────────────────────────────
          1. SATELLITE ORBITAL SCAN LINE (SWEEPS ACROSS THE MAP)
          ───────────────────────────────────────────────────────────── */}
      {isSatelliteView && (
        <mesh ref={scanBeamRef} position={[0, 0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[11.6, 0.08]} />
          <meshBasicMaterial
            color={primaryColor}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. SATELLITE TARGET LOCK RETICLE (OVER SELECTED SECTOR)
          ───────────────────────────────────────────────────────────── */}
      {selectedLoc && (
        <group position={[tx, ty + 0.08, tz]}>
          {/* Vertical Orbital Laser Designator Beam */}
          <mesh ref={laserBeamRef} position={[0, 3.5, 0]}>
            <cylinderGeometry args={[0.015, 0.025, 7.0, 8]} />
            <meshBasicMaterial
              color={primaryColor}
              transparent
              opacity={0.4}
            />
          </mesh>

          {/* Rotating Reticle Ring */}
          <group ref={targetRingRef}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.45, 0.48, 32]} />
              <meshBasicMaterial
                color={primaryColor}
                transparent
                opacity={0.85}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* 4 Cardinal Tick Marks */}
            {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => (
              <mesh
                key={idx}
                position={[Math.cos(angle) * 0.55, 0.01, Math.sin(angle) * 0.55]}
                rotation={[-Math.PI / 2, 0, -angle]}
              >
                <planeGeometry args={[0.12, 0.02]} />
                <meshBasicMaterial color={primaryColor} transparent opacity={0.9} />
              </mesh>
            ))}
          </group>

          {/* Concentric Pulse Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.62, 0.64, 32]} />
            <meshBasicMaterial
              color={primaryColor}
              transparent
              opacity={0.45}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* 3D Telemetry HUD Pill hovering above target */}
          <Html position={[0, 0.75, 0]} center distanceFactor={10}>
            <div className="pointer-events-none select-none bg-black/90 border border-[#00ff88]/60 px-2 py-0.5 rounded font-mono text-[9px] shadow-[0_0_12px_rgba(0,255,136,0.3)] backdrop-blur-sm whitespace-nowrap flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-[#00ff88] font-extrabold tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping" />
                <span>GEO-LOCK: {selectedLoc.name.toUpperCase()}</span>
              </div>
              <div className="text-[7px] text-[#00ff88]/80 flex gap-2 mt-0.5">
                <span>LAT: {selectedLoc.lat.toFixed(2)}°N</span>
                <span>LNG: {selectedLoc.lng.toFixed(2)}°E</span>
                <span>ELEV: {selectedLoc.elevation}</span>
              </div>
            </div>
          </Html>
        </group>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. SATELLITE GRATICULE BORDER LABELS (LAT / LONG COORDINATES)
          ───────────────────────────────────────────────────────────── */}
      {isSatelliteView && (
        <group position={[0, 0.08, 0]}>
          {/* North/South Latitudes */}
          {[-5.4, -2.7, 0, 2.7, 5.4].map((x, i) => (
            <mesh key={`grid-x-${i}`} position={[x, 0.02, 4.3]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.02, 0.15]} />
              <meshBasicMaterial color={primaryColor} opacity={0.6} transparent />
            </mesh>
          ))}

          {/* West/East Longitudes */}
          {[-4.0, -2.0, 0, 2.0, 4.0].map((z, i) => (
            <mesh key={`grid-z-${i}`} position={[5.8, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.15, 0.02]} />
              <meshBasicMaterial color={primaryColor} opacity={0.6} transparent />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
