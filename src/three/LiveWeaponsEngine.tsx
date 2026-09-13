import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { ActiveStrikeEntity } from '../types/weapons';
import { soundEngine } from '../engine/audioEngine';

// Single Explosive Impact Ring & Fireball Effect
const ExplosionEffect: React.FC<{
  position: [number, number, number];
  type: string;
  onComplete: () => void;
}> = ({ position, type, onComplete }) => {
  const [x, y, z] = position;
  const fireballRef = useRef<THREE.Mesh>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  const smokeRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const startTime = useRef(Date.now());

  useFrame(() => {
    const elapsed = (Date.now() - startTime.current) / 1000;
    if (elapsed > 1.8) {
      onComplete();
      return;
    }

    // 1. Expanding & Fading Fireball
    if (fireballRef.current) {
      if (elapsed < 0.35) {
        const s = (elapsed / 0.35) * (type === 'TEMPEST_AIR_STRIKE' ? 1.1 : 0.8);
        fireballRef.current.scale.set(s, s, s);
        (fireballRef.current.material as THREE.MeshBasicMaterial).opacity = 1.0 - elapsed * 1.8;
      } else {
        fireballRef.current.scale.set(0.001, 0.001, 0.001);
      }
    }

    // 2. Expanding Shockwave Ring on Ground
    if (shockwaveRef.current) {
      const ringScale = elapsed * (type === 'ROCKET_SALVO' ? 1.8 : 1.4);
      shockwaveRef.current.scale.set(ringScale, ringScale, 1);
      const ringMat = shockwaveRef.current.material as THREE.MeshBasicMaterial;
      ringMat.opacity = Math.max(0, 0.9 - elapsed * 0.7);
    }

    // 3. Dynamic Flash Point Light
    if (lightRef.current) {
      lightRef.current.intensity = Math.max(0, 8.0 * (1.0 - elapsed * 2.5));
    }

    // 4. Rising Smoke Plume
    if (smokeRef.current) {
      smokeRef.current.position.y = y + elapsed * 0.55;
      smokeRef.current.children.forEach((puff, idx) => {
        const mat = (puff as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = Math.max(0, 0.65 - elapsed * 0.35);
        puff.scale.addScalar(0.005);
      });
    }
  });

  return (
    <group position={[x, y, z]}>
      {/* Incendiary Flash Light */}
      <pointLight ref={lightRef} color="#ff6b35" distance={10} decay={2} />

      {/* Central Incendiary Fireball */}
      <mesh ref={fireballRef} position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={type === 'SMOKE_SCREEN' ? '#e2e8f0' : '#ff4500'} transparent opacity={0.95} />
      </mesh>

      {/* Ground Blast Shockwave Ring */}
      <mesh ref={shockwaveRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.42, 24]} />
        <meshBasicMaterial
          color={type === 'SMOKE_SCREEN' ? '#cbd5e0' : '#ffb703'}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rising Volumetric Smoke Clouds */}
      <group ref={smokeRef}>
        {[0, 1, 2, 3, 4].map(i => (
          <mesh key={i} position={[(i % 2 - 0.5) * 0.18, i * 0.1, ((i > 2 ? 1 : 0) - 0.5) * 0.18]}>
            <sphereGeometry args={[0.24 + i * 0.06, 12, 12]} />
            <meshBasicMaterial
              color={type === 'SMOKE_SCREEN' ? '#f8fafc' : '#26211d'}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// ULTRA-REALISTIC 3D HAWKER TEMPEST FIGHTER-BOMBER
// ─────────────────────────────────────────────────────────────
const TempestAircraft: React.FC<{
  progress: number;
  origin: [number, number, number];
  target: [number, number, number];
}> = ({ progress, origin, target }) => {
  const meshRef = useRef<THREE.Group>(null);
  const propRef = useRef<THREE.Group>(null);

  // Compute parabolic dive & swoop flight trajectory
  const currentPos = useMemo(() => {
    const x = THREE.MathUtils.lerp(origin[0] - 5, target[0] + 5, progress);
    const z = THREE.MathUtils.lerp(origin[2] - 4, target[2] + 4, progress);
    const dip = Math.sin(progress * Math.PI);
    const y = 3.8 - dip * 3.0 + target[1];
    return new THREE.Vector3(x, y, z);
  }, [progress, origin, target]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.copy(currentPos);
      const angle = Math.atan2(target[2] - origin[2], target[0] - origin[0]);
      meshRef.current.rotation.y = -angle + Math.PI / 2;
      // Banking roll during dive
      meshRef.current.rotation.z = Math.sin(progress * Math.PI) * 0.5;
      // Pitch down into dive, then pitch up into climb
      meshRef.current.rotation.x = (progress - 0.5) * 0.9;
    }
    if (propRef.current) {
      propRef.current.rotation.z = t * 45;
    }
  });

  return (
    <group ref={meshRef}>
      {/* ── Aerodynamic Camouflage Fuselage ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.035, 0.85, 14]} />
        <meshStandardMaterial color="#2d3f34" roughness={0.4} metalness={0.65} />
      </mesh>

      {/* Sabre Engine Chin Radiator Cowling */}
      <mesh position={[0, -0.06, 0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.22, 10]} />
        <meshStandardMaterial color="#1f2d24" metalness={0.7} roughness={0.35} />
      </mesh>

      {/* Teardrop Glass Cockpit Canopy */}
      <mesh position={[0, 0.07, -0.04]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color="#a0e7e5" transparent opacity={0.65} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* ── Elliptical Laminar-Flow Wings ── */}
      <mesh position={[0, -0.01, 0.06]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[0.02, 1.35, 0.28]} />
        <meshStandardMaterial color="#35493d" roughness={0.42} metalness={0.6} />
      </mesh>

      {/* Wing Roundels (IAF / RAF Roundels) */}
      {[-0.45, 0.45].map((wx, idx) => (
        <group key={`rd-${idx}`} position={[wx, 0.005, 0.06]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.07, 16]} />
          <meshBasicMaterial color="#1e40af" />
          <mesh position={[0, 0, 0.001]}>
            <circleGeometry args={[0.045, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0, 0.002]}>
            <circleGeometry args={[0.022, 16]} />
            <meshBasicMaterial color="#ea580c" />
          </mesh>
        </group>
      ))}

      {/* 4x 20mm Hispano Cannon Barrels */}
      {[-0.28, -0.22, 0.22, 0.28].map((cx, idx) => (
        <mesh key={`can-${idx}`} position={[cx, -0.01, 0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.006, 0.006, 0.12, 6]} />
          <meshStandardMaterial color="#111827" metalness={0.95} />
        </mesh>
      ))}

      {/* Dual Wing-Mounted 500lb Bombs */}
      {progress < 0.55 && (
        <group>
          {[-0.32, 0.32].map((bx, idx) => (
            <mesh key={`bomb-${idx}`} position={[bx, -0.05, 0.06]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.024, 0.015, 0.18, 8]} />
              <meshStandardMaterial color="#854d0e" roughness={0.6} />
            </mesh>
          ))}
        </group>
      )}

      {/* ── Spinning 4-Blade Propeller & Yellow Spinner ── */}
      <group position={[0, 0, 0.44]}>
        {/* Propeller Spinner Cone */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.045, 0.1, 12]} />
          <meshStandardMaterial color="#eab308" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Spinning 4-Blade Assembly */}
        <group ref={propRef}>
          <mesh>
            <boxGeometry args={[0.01, 0.44, 0.01]} />
            <meshBasicMaterial color="#111827" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.01, 0.44, 0.01]} />
            <meshBasicMaterial color="#111827" />
          </mesh>
        </group>
      </group>

      {/* ── Empennage & Tailfin ── */}
      <mesh position={[0, 0.12, -0.36]} castShadow>
        <boxGeometry args={[0.018, 0.22, 0.18]} />
        <meshStandardMaterial color="#2d3f34" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, -0.38]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[0.015, 0.42, 0.14]} />
        <meshStandardMaterial color="#2d3f34" roughness={0.4} />
      </mesh>

      {/* ── 20mm Tracer Fire Stream during Dive ── */}
      {progress > 0.32 && progress < 0.62 && (
        <group position={[0, -0.02, 0.5]}>
          <mesh position={[0.25, 0, 1.0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 1.8, 6]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
          <mesh position={[-0.25, 0, 1.0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 1.8, 6]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// ULTRA-REALISTIC 3D DOUGLAS C-47 DAKOTA TRANSPORT
// ─────────────────────────────────────────────────────────────
const DakotaAircraft: React.FC<{
  progress: number;
  origin: [number, number, number];
  target: [number, number, number];
}> = ({ progress, origin, target }) => {
  const meshRef = useRef<THREE.Group>(null);
  const propRef1 = useRef<THREE.Mesh>(null);
  const propRef2 = useRef<THREE.Mesh>(null);

  const currentPos = useMemo(() => {
    const x = THREE.MathUtils.lerp(origin[0] - 6, target[0] + 6, progress);
    const z = THREE.MathUtils.lerp(origin[2] - 3, target[2] + 3, progress);
    const y = 3.2 + target[1];
    return new THREE.Vector3(x, y, z);
  }, [progress, origin, target]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.copy(currentPos);
      const angle = Math.atan2(target[2] - origin[2], target[0] - origin[0]);
      meshRef.current.rotation.y = -angle + Math.PI / 2;
    }
    if (propRef1.current) propRef1.current.rotation.z = t * 38;
    if (propRef2.current) propRef2.current.rotation.z = t * 38;
  });

  return (
    <group ref={meshRef}>
      {/* ── Fuselage (Aluminum Skin) ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.06, 1.35, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.88} roughness={0.22} />
      </mesh>

      {/* Cockpit Windscreen Glass */}
      <mesh position={[0, 0.08, 0.45]}>
        <boxGeometry args={[0.12, 0.05, 0.14]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.6} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Main Swept Wings with Dihedral */}
      <mesh position={[0, 0.01, 0.15]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[0.03, 1.95, 0.35]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.82} roughness={0.28} />
      </mesh>

      {/* Twin Pratt & Whitney R-1830 Radial Engines */}
      {[-0.42, 0.42].map((ex, idx) => (
        <group key={`eng-${idx}`} position={[ex, -0.03, 0.28]}>
          {/* Nacelle Cowling */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.065, 0.28, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Spinning Propeller Disc */}
          <mesh ref={idx === 0 ? propRef1 : propRef2} position={[0, 0, 0.16]}>
            <boxGeometry args={[0.01, 0.38, 0.01]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
        </group>
      ))}

      {/* ── Empennage & Vertical Tailfin ── */}
      <mesh position={[0, 0.18, -0.58]} castShadow>
        <boxGeometry args={[0.02, 0.28, 0.26]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.02, -0.62]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <boxGeometry args={[0.02, 0.58, 0.18]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 3D PARACHUTE SUPPLY DROP CANISTER
// ─────────────────────────────────────────────────────────────
const ParachuteCanister: React.FC<{
  progress: number;
  target: [number, number, number];
}> = ({ progress, target }) => {
  if (progress < 0.45) return null;
  const dropProgress = (progress - 0.45) / 0.55;
  const currentY = THREE.MathUtils.lerp(3.2 + target[1], target[1] + 0.05, Math.min(1, dropProgress));

  return (
    <group position={[target[0], currentY, target[2]]}>
      {/* White Silk Parachute Canopy */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <sphereGeometry args={[0.26, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} roughness={0.88} />
      </mesh>
      {/* Suspension Cords */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.24, 0.05, 0.42, 6, 1, true]} />
        <meshBasicMaterial color="#94a3b8" wireframe />
      </mesh>
      {/* Wooden Ammo & Medical Supply Crate with Straps */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.14, 0.1, 0.14]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 3D ROCKET / ARTILLERY PROJECTILE MESH
// ─────────────────────────────────────────────────────────────
const RocketProjectile: React.FC<{
  progress: number;
  origin: [number, number, number];
  target: [number, number, number];
  type: string;
  offsetIdx: number;
}> = ({ progress, origin, target, type, offsetIdx }) => {
  const meshRef = useRef<THREE.Group>(null);
  const flameLightRef = useRef<THREE.PointLight>(null);

  const currentPos = useMemo(() => {
    const x = THREE.MathUtils.lerp(origin[0], target[0], progress) + (offsetIdx - 1.5) * 0.08;
    const z = THREE.MathUtils.lerp(origin[2], target[2], progress) + (offsetIdx % 2 - 0.5) * 0.08;
    // Parabolic trajectory
    const arcHeight = type === 'ARTILLERY_BARRAGE' ? 2.8 : 1.9;
    const y = THREE.MathUtils.lerp(origin[1], target[1], progress) + Math.sin(progress * Math.PI) * arcHeight;
    return new THREE.Vector3(x, y, z);
  }, [progress, origin, target, type, offsetIdx]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(currentPos);
      const nextProgress = Math.min(1, progress + 0.02);
      const nextY =
        THREE.MathUtils.lerp(origin[1], target[1], nextProgress) +
        Math.sin(nextProgress * Math.PI) * (type === 'ARTILLERY_BARRAGE' ? 2.8 : 1.9);
      const dy = nextY - currentPos.y;
      const dx = target[0] - origin[0];
      const dz = target[2] - origin[2];
      const horizDist = Math.sqrt(dx * dx + dz * dz) * 0.02;
      meshRef.current.rotation.x = -Math.atan2(dy, horizDist);
      meshRef.current.rotation.y = -Math.atan2(dz, dx) + Math.PI / 2;
    }
    if (flameLightRef.current) {
      flameLightRef.current.intensity = 1.5 + Math.random() * 0.8;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Dynamic Incendiary Thruster Light */}
      <pointLight ref={flameLightRef} color="#ff9800" distance={3} decay={2} />

      {/* Aerodynamic Rocket / Shell Hull with Stabilizing Fins */}
      <mesh castShadow>
        <cylinderGeometry args={[0.022, 0.032, 0.26, 10]} />
        <meshStandardMaterial
          color={type === 'ROCKET_SALVO' ? '#1e293b' : '#c09a5b'}
          metalness={0.88}
          roughness={0.25}
        />
      </mesh>
      {/* Incendiary Thruster Flame Cone */}
      <mesh position={[0, -0.16, 0]}>
        <coneGeometry args={[0.04, 0.18, 8]} />
        <meshBasicMaterial color="#fb923c" />
      </mesh>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN LIVE WEAPONS ENGINE COMPONENT
// ─────────────────────────────────────────────────────────────
export const LiveWeaponsEngine: React.FC = () => {
  const activeStrikes = useGameStore(s => s.activeStrikes || []);
  const removeStrike = useGameStore(s => s.removeStrike);
  const [detonations, setDetonations] = useState<{ id: string; position: [number, number, number]; type: string }[]>([]);

  // Animation frame tick
  const [currentTime, setCurrentTime] = useState(Date.now());
  useFrame(() => {
    setCurrentTime(Date.now());
  });

  const handleDetonate = (strike: ActiveStrikeEntity) => {
    if (strike.type === 'TEMPEST_AIR_STRIKE') {
      soundEngine.playBombWhistle();
      setTimeout(() => soundEngine.playExplosionDetonation(), 250);
    } else if (strike.type === 'ROCKET_SALVO') {
      soundEngine.playExplosionDetonation();
    } else if (strike.type === 'ARTILLERY_BARRAGE') {
      soundEngine.playExplosionDetonation();
    }

    setDetonations(prev => [
      ...prev,
      { id: `det-${strike.id}-${Date.now()}`, position: strike.target, type: strike.type }
    ]);
  };

  return (
    <group>
      {/* 1. In-Flight Strikes */}
      {activeStrikes.map(strike => {
        const elapsed = (currentTime - strike.startTime) / 1000;
        const progress = Math.min(1, elapsed / strike.duration);

        if (progress >= 0.98 && !strike.hasDetonated) {
          handleDetonate(strike);
          strike.hasDetonated = true;
        }

        if (progress >= 1.0) {
          if (!strike.hasDetonated) {
            handleDetonate(strike);
            strike.hasDetonated = true;
          }
          if (removeStrike) removeStrike(strike.id);
          return null;
        }

        if (strike.type === 'TEMPEST_AIR_STRIKE') {
          return (
            <TempestAircraft
              key={strike.id}
              progress={progress}
              origin={strike.origin}
              target={strike.target}
            />
          );
        }

        if (strike.type === 'DAKOTA_SUPPLY_DROP') {
          return (
            <group key={strike.id}>
              <DakotaAircraft
                progress={progress}
                origin={strike.origin}
                target={strike.target}
              />
              <ParachuteCanister
                progress={progress}
                target={strike.target}
              />
            </group>
          );
        }

        // Multi-Rocket Salvo (renders 4 staggered rockets)
        if (strike.type === 'ROCKET_SALVO') {
          return (
            <group key={strike.id}>
              {[0, 1, 2, 3].map(idx => (
                <RocketProjectile
                  key={`${strike.id}-${idx}`}
                  progress={Math.max(0, Math.min(1, progress * 1.15 - idx * 0.04))}
                  origin={strike.origin}
                  target={strike.target}
                  type={strike.type}
                  offsetIdx={idx}
                />
              ))}
            </group>
          );
        }

        // Artillery Shell or Smoke Mortar
        return (
          <RocketProjectile
            key={strike.id}
            progress={progress}
            origin={strike.origin}
            target={strike.target}
            type={strike.type}
            offsetIdx={0}
          />
        );
      })}

      {/* 2. Active Ground Detonations & Explosions */}
      {detonations.map(det => (
        <ExplosionEffect
          key={det.id}
          position={det.position}
          type={det.type}
          onComplete={() => {
            setDetonations(prev => prev.filter(d => d.id !== det.id));
          }}
        />
      ))}
    </group>
  );
};
