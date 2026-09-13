import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { UnitData } from '../types/game';
import { useGameStore } from '../store/gameStore';
import { interpolateMarchPosition } from '../engine/movementEngine';

interface MovingUnits3DProps {
  units: UnitData[];
}

// ─────────────────────────────────────────────────────────────
// 1. ULTRA-REALISTIC 3D STUART LIGHT TANK (M3A3/M5) MODEL
// ─────────────────────────────────────────────────────────────
const RealisticStuartTank: React.FC<{ isSelected: boolean }> = ({ isSelected }) => {
  const turretRef = useRef<THREE.Group>(null);
  const barrelRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (turretRef.current) {
      turretRef.current.rotation.y = Math.sin(t * 0.4) * 0.25;
    }
    if (barrelRef.current) {
      barrelRef.current.rotation.z = Math.PI / 2 + Math.sin(t * 0.8) * 0.04;
    }
  });

  const hullColor = isSelected ? '#a8813d' : '#333f2e'; // Olive Drab / Brass selected
  const steelColor = '#1e231c';
  const trackColor = '#151515';

  return (
    <group position={[0, 0.08, 0]}>
      {/* ── Lower & Upper Glacis Hull ── */}
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.54, 0.12, 0.32]} />
        <meshStandardMaterial color={hullColor} metalness={0.55} roughness={0.42} />
      </mesh>
      {/* Front Sloped Glacis Armor Plate */}
      <mesh position={[0.26, 0.08, 0]} rotation={[0, 0, -Math.PI / 5]} castShadow>
        <boxGeometry args={[0.14, 0.08, 0.30]} />
        <meshStandardMaterial color={hullColor} metalness={0.55} roughness={0.42} />
      </mesh>

      {/* ── Dual Track Assemblies (Bogie Wheels & Drive Sprockets) ── */}
      {[-0.17, 0.17].map((zOffset, trackIdx) => (
        <group key={`track-${trackIdx}`} position={[0, 0, zOffset]}>
          {/* Track Tread Band */}
          <mesh position={[0, 0.01, 0]} castShadow>
            <boxGeometry args={[0.58, 0.08, 0.05]} />
            <meshStandardMaterial color={trackColor} roughness={0.92} metalness={0.2} />
          </mesh>
          {/* 4 Road Wheels per side */}
          {[-0.2, -0.07, 0.06, 0.19].map((wx, wIdx) => (
            <mesh key={`wheel-${wIdx}`} position={[wx, 0, 0.005 * (trackIdx === 0 ? -1 : 1)]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.038, 0.038, 0.06, 12]} />
              <meshStandardMaterial color="#2b2d28" metalness={0.7} roughness={0.35} />
            </mesh>
          ))}
          {/* Front Drive Sprocket & Rear Idler Wheel */}
          <mesh position={[0.27, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.042, 0.042, 0.06, 12]} />
            <meshStandardMaterial color="#3d4036" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[-0.27, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.038, 0.038, 0.06, 12]} />
            <meshStandardMaterial color="#3d4036" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* ── Rotating Sloped Turret Assembly ── */}
      <group ref={turretRef} position={[-0.04, 0.14, 0]}>
        {/* Turret Main Cast Body */}
        <mesh position={[0, 0.04, 0]} castShadow>
          <boxGeometry args={[0.26, 0.09, 0.22]} />
          <meshStandardMaterial color={hullColor} metalness={0.58} roughness={0.4} />
        </mesh>
        {/* Sloped Turret Front Cheek Plates */}
        <mesh position={[0.11, 0.04, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
          <boxGeometry args={[0.08, 0.08, 0.20]} />
          <meshStandardMaterial color={hullColor} metalness={0.58} roughness={0.4} />
        </mesh>
        {/* Commander Cupola & Hatch */}
        <mesh position={[-0.04, 0.10, 0.03]} castShadow>
          <cylinderGeometry args={[0.055, 0.06, 0.04, 12]} />
          <meshStandardMaterial color="#283324" metalness={0.7} roughness={0.35} />
        </mesh>
        {/* Vision Periscope Blocks */}
        <mesh position={[-0.04, 0.125, 0.03]}>
          <boxGeometry args={[0.04, 0.02, 0.04]} />
          <meshStandardMaterial color="#00e5ff" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* 37mm M6 Anti-Tank Gun Barrel with Recoil Mantlet */}
        <mesh position={[0.15, 0.04, 0]} castShadow>
          <boxGeometry args={[0.06, 0.05, 0.07]} />
          <meshStandardMaterial color={steelColor} metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh ref={barrelRef} position={[0.32, 0.04, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.012, 0.016, 0.32, 10]} />
          <meshStandardMaterial color={steelColor} metalness={0.88} roughness={0.2} />
        </mesh>
        {/* Muzzle Brake Tip */}
        <mesh position={[0.48, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.03, 8]} />
          <meshStandardMaterial color="#111" metalness={0.9} />
        </mesh>
        {/* Coaxial Browning .30 Machine Gun */}
        <mesh position={[0.22, 0.04, 0.04]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.005, 0.005, 0.12, 6]} />
          <meshStandardMaterial color="#111" metalness={0.95} />
        </mesh>
        {/* Radio Antenna Mast */}
        <mesh position={[-0.11, 0.18, -0.07]}>
          <cylinderGeometry args={[0.003, 0.004, 0.26, 4]} />
          <meshStandardMaterial color="#888" metalness={0.9} />
        </mesh>
      </group>

      {/* ── Rear Engine Louvers & Dual Exhaust Pipes ── */}
      <mesh position={[-0.28, 0.06, 0]} castShadow>
        <boxGeometry args={[0.04, 0.06, 0.18]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>
      {[-0.06, 0.06].map((ey, idx) => (
        <mesh key={`ex-${idx}`} position={[-0.30, 0.04, ey]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.08, 6]} />
          <meshStandardMaterial color="#4a3b2c" roughness={0.9} />
        </mesh>
      ))}

      {/* ── Front White Tactical Chevron / Star Insignia ── */}
      <mesh position={[0.27, 0.09, 0]} rotation={[0, 0, -Math.PI / 5]}>
        <planeGeometry args={[0.06, 0.06]} />
        <meshBasicMaterial color="#ffffff" opacity={0.9} transparent />
      </mesh>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 2. ULTRA-REALISTIC 3D 25-POUNDER FIELD ARTILLERY MODEL
// ─────────────────────────────────────────────────────────────
const RealisticArtilleryGun: React.FC<{ isSelected: boolean }> = ({ isSelected }) => {
  const barrelElevRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (barrelElevRef.current) {
      barrelElevRef.current.rotation.z = Math.sin(t * 0.6) * 0.08;
    }
  });

  const gunColor = isSelected ? '#a8813d' : '#3d4434';
  const steelColor = '#1f241d';

  return (
    <group position={[0, 0.07, 0]}>
      {/* Circular Firing Turntable Platform Base */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.26, 24]} />
        <meshStandardMaterial color="#2d3326" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Split-Trail Box Carriage */}
      <mesh position={[-0.18, 0.04, -0.06]} rotation={[0, 0.25, -0.1]} castShadow>
        <boxGeometry args={[0.38, 0.04, 0.03]} />
        <meshStandardMaterial color={gunColor} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-0.18, 0.04, 0.06]} rotation={[0, -0.25, -0.1]} castShadow>
        <boxGeometry args={[0.38, 0.04, 0.03]} />
        <meshStandardMaterial color={gunColor} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Dual Heavy Rubberized Artillery Wheels */}
      {[-0.15, 0.15].map((wz, idx) => (
        <group key={`art-w-${idx}`} position={[0.02, 0.08, wz]}>
          {/* Wheel Rubber Tire */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.08, 0.025, 12, 24]} />
            <meshStandardMaterial color="#1a1a18" roughness={0.9} />
          </mesh>
          {/* Steel Spoke Hub */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.03, 12]} />
            <meshStandardMaterial color={gunColor} metalness={0.7} roughness={0.35} />
          </mesh>
        </group>
      ))}

      {/* Gunner Armor Gun Shield Plate */}
      <mesh position={[0.04, 0.12, 0]} rotation={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[0.02, 0.18, 0.28]} />
        <meshStandardMaterial color={gunColor} metalness={0.5} roughness={0.45} />
      </mesh>

      {/* Elevating Barrel Assembly */}
      <group ref={barrelElevRef} position={[0.03, 0.11, 0]}>
        {/* Recoil Recuperator Cylinder Shroud on Top */}
        <mesh position={[0.06, 0.03, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.016, 0.018, 0.24, 10]} />
          <meshStandardMaterial color={steelColor} metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Main 87.6mm Ordnance Barrel */}
        <mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.014, 0.022, 0.38, 12]} />
          <meshStandardMaterial color={steelColor} metalness={0.9} roughness={0.18} />
        </mesh>
        {/* Muzzle Brake */}
        <mesh position={[0.38, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.024, 0.02, 0.05, 10]} />
          <meshStandardMaterial color="#0f110e" metalness={0.95} />
        </mesh>
        {/* Elevation Handwheel */}
        <mesh position={[-0.04, 0, -0.06]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.03, 0.006, 8, 16]} />
          <meshStandardMaterial color="#c09a5b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 3. ULTRA-REALISTIC 3D INFANTRY REGIMENTAL MINIATURE
// ─────────────────────────────────────────────────────────────
const RealisticInfantryDiorama: React.FC<{ unit: UnitData; isSelected: boolean }> = ({ unit, isSelected }) => {
  const isSikh = unit.name.includes('Sikh');
  const isPara = unit.name.includes('Para') || unit.name.includes('Kumaon');
  const isGurkha = unit.name.includes('Gurkha') || unit.name.includes('Gorkha');

  const tunicColor = isSelected ? '#7a5a2b' : '#5c5443'; // Khaki drill / Olive
  const headgearColor = isSikh ? '#c2410c' : isPara ? '#831843' : isGurkha ? '#27272a' : '#1e3a1e'; // Turban / Maroon Beret / Slouch Hat / Olive

  return (
    <group position={[0, 0.05, 0]}>
      {/* Heavy Beveled Brass Pedestal Base */}
      <mesh position={[0, 0.02, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.22, 0.25, 0.04, 24]} />
        <meshStandardMaterial color={isSelected ? '#d4af37' : '#2b2318'} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.042, 0]}>
        <cylinderGeometry args={[0.20, 0.20, 0.01, 24]} />
        <meshStandardMaterial color="#1a2e1c" roughness={0.8} />
      </mesh>

      {/* Miniature Figurine 1: Squad Leader / Commander */}
      <group position={[-0.05, 0.05, -0.03]}>
        {/* Legs & Trousers */}
        <mesh position={[-0.025, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.018, 0.08, 6]} />
          <meshStandardMaterial color={tunicColor} roughness={0.8} />
        </mesh>
        <mesh position={[0.025, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.018, 0.08, 6]} />
          <meshStandardMaterial color={tunicColor} roughness={0.8} />
        </mesh>
        {/* Puttees & Field Boots */}
        <mesh position={[-0.025, 0.01, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 0.03, 6]} />
          <meshStandardMaterial color="#2d1c12" roughness={0.9} />
        </mesh>
        <mesh position={[0.025, 0.01, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 0.03, 6]} />
          <meshStandardMaterial color="#2d1c12" roughness={0.9} />
        </mesh>
        {/* Torso & Khaki Field Tunic with Webbing Straps */}
        <mesh position={[0, 0.11, 0]} castShadow>
          <boxGeometry args={[0.08, 0.09, 0.05]} />
          <meshStandardMaterial color={tunicColor} roughness={0.75} />
        </mesh>
        {/* Ammo Pouches & Webbing */}
        <mesh position={[0, 0.09, 0.028]}>
          <boxGeometry args={[0.07, 0.03, 0.02]} />
          <meshStandardMaterial color="#85754e" roughness={0.9} />
        </mesh>
        {/* Head & Neck */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <sphereGeometry args={[0.026, 12, 12]} />
          <meshStandardMaterial color="#c68642" roughness={0.6} />
        </mesh>
        {/* Regimental Headgear (Sikh Turban / Para Beret / Gurkha Hat) */}
        {isSikh ? (
          <mesh position={[0, 0.20, 0]} castShadow>
            <cylinderGeometry args={[0.038, 0.032, 0.04, 12]} />
            <meshStandardMaterial color={headgearColor} roughness={0.8} />
          </mesh>
        ) : (
          <mesh position={[0, 0.20, 0]} castShadow>
            <sphereGeometry args={[0.032, 10, 10]} />
            <meshStandardMaterial color={headgearColor} roughness={0.7} />
          </mesh>
        )}
        {/* Lee-Enfield .303 Rifle with Wood Stock */}
        <group position={[0.05, 0.12, 0.03]} rotation={[0.2, 0, 0.3]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.015, 0.18, 0.015]} />
            <meshStandardMaterial color="#5c3a21" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.10, 0]}>
            <cylinderGeometry args={[0.003, 0.003, 0.06, 6]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Miniature Figurine 2: Bren Gunner Support */}
      <group position={[0.08, 0.05, 0.05]}>
        <mesh position={[0, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.025, 0.08, 6]} />
          <meshStandardMaterial color={tunicColor} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.10, 0]} castShadow>
          <boxGeometry args={[0.07, 0.08, 0.045]} />
          <meshStandardMaterial color={tunicColor} roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <sphereGeometry args={[0.024, 10, 10]} />
          <meshStandardMaterial color="#c68642" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <sphereGeometry args={[0.03, 10, 10]} />
          <meshStandardMaterial color={headgearColor} roughness={0.7} />
        </mesh>
        {/* Bren Gun */}
        <mesh position={[-0.04, 0.11, 0.03]} rotation={[0, 0, Math.PI / 3]}>
          <boxGeometry args={[0.012, 0.16, 0.016]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// REGIMENTAL MARKER CONTAINER
// ─────────────────────────────────────────────────────────────
const RegimentMarker3D: React.FC<{ unit: UnitData }> = React.memo(({ unit }) => {
  const selectedUnitId = useGameStore(s => s.selectedUnitId);
  const selectUnit = useGameStore(s => s.selectUnit);
  const isSelected = selectedUnitId === unit.id;

  const meshRef = useRef<THREE.Group>(null);

  // Compute current position (either interpolated along march spline or base 3D position)
  let currentPos: [number, number, number] = unit.position3D;
  let marchWaypoints: [number, number, number][] = [];

  if (unit.state === 'MOVING' && unit.currentMarch) {
    marchWaypoints = unit.currentMarch.routeWaypoints;
    currentPos = interpolateMarchPosition(marchWaypoints, unit.currentMarch.progress);
  }

  useFrame(({ clock }) => {
    if (meshRef.current) {
      if (unit.state === 'MOVING') {
        const t = clock.getElapsedTime() * 8;
        meshRef.current.position.y = currentPos[1] + Math.abs(Math.sin(t)) * 0.08;
      } else {
        meshRef.current.position.set(...currentPos);
      }
    }
  });

  const stateColors: Record<string, string> = {
    READY: '#70836a',
    DEFENDING: '#556b2f',
    ATTACKING: '#a94c42',
    MOVING: '#d4a45c',
    DEPLOYING: '#d4a45c',
    RETREATING: '#8b3a3a',
    CUT_OFF: '#a94c42',
    LOW_SUPPLY: '#d97736'
  };

  const badgeColor = stateColors[unit.state] || '#556b2f';

  return (
    <group position={currentPos}>
      {/* March Route Spline Line when unit is traveling */}
      {unit.state === 'MOVING' && marchWaypoints.length > 1 && (
        <Line
          points={marchWaypoints}
          color="#d4a45c"
          lineWidth={2.5}
          dashed
          dashScale={3}
          dashSize={0.3}
          gapSize={0.2}
          transparent
          opacity={0.8}
        />
      )}

      {/* Physical 3D Regiment Realistic Model */}
      <group
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          selectUnit(unit.id);
        }}
      >
        {unit.unitType === 'ARMORED_CAR' ? (
          <RealisticStuartTank isSelected={isSelected} />
        ) : unit.unitType === 'ARTILLERY' ? (
          <RealisticArtilleryGun isSelected={isSelected} />
        ) : (
          <RealisticInfantryDiorama unit={unit} isSelected={isSelected} />
        )}

        {/* Tactical HTML Label with Status & ETA */}
        <Html position={[0, 0.45, 0]} center distanceFactor={11}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              selectUnit(unit.id);
            }}
            className={`px-2 py-0.5 rounded border transition-all cursor-pointer shadow-md select-none whitespace-nowrap ${
              isSelected
                ? 'bg-[#181713]/98 border-[#c09a5b] text-[#ffdda0] scale-110 ring-2 ring-[#c09a5b]/40 z-30'
                : 'bg-[#0f0f0d]/90 border-[#3d3425] text-[#eee7da] hover:border-[#c09a5b] z-20'
            }`}
          >
            <div className="flex items-center gap-1 font-mono text-[9px] font-extrabold leading-tight">
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: badgeColor }} />
              <span>{unit.designation}</span>
            </div>

            {unit.state === 'MOVING' && unit.currentMarch ? (
              <div className="text-[8px] font-mono text-[#d4a45c] font-bold mt-0.5">
                MARCHING (ETA {unit.currentMarch.remainingMinutes}M)
              </div>
            ) : (
              <div className="text-[7px] font-mono text-mutedText">
                {unit.state} • {unit.strength}%
              </div>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
});

export const MovingUnits3D: React.FC<MovingUnits3DProps> = React.memo(({ units }) => {
  return (
    <group>
      {units.map(unit => (
        <RegimentMarker3D key={unit.id} unit={unit} />
      ))}
    </group>
  );
});
