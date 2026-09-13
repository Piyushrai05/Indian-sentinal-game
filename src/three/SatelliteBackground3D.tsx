import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

// ─────────────────────────────────────────────────────────────
// 1. DETAILED 3D RECONNAISSANCE SATELLITE MODEL IN LOW EARTH ORBIT
// ─────────────────────────────────────────────────────────────
const ReconSatelliteModel: React.FC = () => {
  const satGroupRef = useRef<THREE.Group>(null);
  const solarWingsRef = useRef<THREE.Group>(null);
  const dishRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.PointLight>(null);
  const scanConeRef = useRef<THREE.Mesh>(null);

  const isSatelliteView = useGameStore(s => s.isSatelliteView);
  const satelliteViewMode = useGameStore(s => s.satelliteViewMode);

  const beamColor =
    satelliteViewMode === 'THERMAL'
      ? '#ff5722'
      : satelliteViewMode === 'TOPOGRAPHIC'
      ? '#00e5ff'
      : '#38bdf8';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (satGroupRef.current) {
      // Gentle orbital drift and attitude stabilization
      satGroupRef.current.position.y = 5.2 + Math.sin(t * 0.4) * 0.15;
      satGroupRef.current.position.x = 4.6 + Math.cos(t * 0.25) * 0.35;
      satGroupRef.current.position.z = -3.2 + Math.sin(t * 0.3) * 0.25;

      // Subtle gyro wobble
      satGroupRef.current.rotation.z = Math.sin(t * 0.3) * 0.04;
      satGroupRef.current.rotation.x = -0.45 + Math.cos(t * 0.2) * 0.03;
    }

    if (solarWingsRef.current) {
      // Slow solar tracking adjustment
      solarWingsRef.current.rotation.y = Math.sin(t * 0.1) * 0.15;
    }

    if (dishRef.current) {
      // Steerable dish telemetry tracking
      dishRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
    }

    if (beaconRef.current) {
      // 1 Hz tactical beacon pulse
      beaconRef.current.intensity = Math.sin(t * 6) > 0.3 ? 2.5 : 0.2;
    }

    if (scanConeRef.current) {
      const mat = scanConeRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = (isSatelliteView ? 0.18 : 0.08) + Math.sin(t * 3) * 0.04;
      }
    }
  });

  return (
    <group ref={satGroupRef} position={[4.6, 5.2, -3.2]} scale={[0.85, 0.85, 0.85]}>
      {/* Central Satellite Main Bus Chassis (Gold MLI Foil & Avionics) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.7, 1.1, 0.6]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.88}
          roughness={0.25}
          bumpScale={0.05}
        />
      </mesh>

      {/* Equipment Bay Top / Bottom Cap */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.3, 0.32, 0.08, 16]} />
        <meshStandardMaterial color="#2a2e33" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.58, 0]}>
        <cylinderGeometry args={[0.32, 0.3, 0.08, 16]} />
        <meshStandardMaterial color="#2a2e33" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Optical Reconnaissance Telescope Barrel (Pointed at Earth/Theater) */}
      <group position={[0, -0.65, 0]} rotation={[0.45, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.45, 16]} />
          <meshStandardMaterial color="#1a1d20" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Optical Glass Objective Lens (Glowing Cyan/Blue Sensor) */}
        <mesh position={[0, -0.23, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.02, 16]} />
          <meshBasicMaterial color="#00e5ff" />
        </mesh>
      </group>

      {/* Volumetric Reconnaissance Scanning Sensor Cone down to Ground */}
      <mesh
        ref={scanConeRef}
        position={[-1.8, -3.2, 1.4]}
        rotation={[0.35, 0, 0.42]}
      >
        <coneGeometry args={[2.8, 6.5, 32, 1, true]} />
        <meshBasicMaterial
          color={beamColor}
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Bilateral Solar Panel Wings (Port & Starboard) */}
      <group ref={solarWingsRef}>
        {/* Port Solar Wing */}
        <group position={[-1.3, 0, 0]}>
          {/* Support Boom */}
          <mesh position={[0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
            <meshStandardMaterial color="#718096" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Solar Panel Array 1 */}
          <mesh position={[-0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.85, 0.52, 0.03]} />
            <meshStandardMaterial
              color="#0d2b45"
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          {/* Solar Panel Array 2 */}
          <mesh position={[-1.05, 0, 0]} castShadow>
            <boxGeometry args={[0.8, 0.52, 0.03]} />
            <meshStandardMaterial
              color="#0d2b45"
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          {/* Gold Solar Panel Trim Frame */}
          <mesh position={[-0.6, 0, -0.018]}>
            <boxGeometry args={[1.72, 0.54, 0.008]} />
            <meshStandardMaterial color="#b38a43" metalness={0.85} roughness={0.3} />
          </mesh>
        </group>

        {/* Starboard Solar Wing */}
        <group position={[1.3, 0, 0]}>
          {/* Support Boom */}
          <mesh position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
            <meshStandardMaterial color="#718096" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Solar Panel Array 1 */}
          <mesh position={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.85, 0.52, 0.03]} />
            <meshStandardMaterial
              color="#0d2b45"
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          {/* Solar Panel Array 2 */}
          <mesh position={[1.05, 0, 0]} castShadow>
            <boxGeometry args={[0.8, 0.52, 0.03]} />
            <meshStandardMaterial
              color="#0d2b45"
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          {/* Gold Solar Panel Trim Frame */}
          <mesh position={[0.6, 0, -0.018]}>
            <boxGeometry args={[1.72, 0.54, 0.008]} />
            <meshStandardMaterial color="#b38a43" metalness={0.85} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* Steerable High-Gain Parabolic Telemetry Dish */}
      <group ref={dishRef} position={[0, 0.45, 0.42]} rotation={[-0.6, 0.4, 0]}>
        {/* Mount Strut */}
        <mesh position={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#4a5568" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Parabolic Reflector Dish */}
        <mesh castShadow>
          <sphereGeometry args={[0.32, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.92}
            roughness={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Subreflector Feed Horn */}
        <mesh position={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.015, 0.04, 0.15, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Magnetometer & Star Tracker Sensor Booms */}
      <mesh position={[0.25, -0.4, -0.3]} rotation={[0.8, 0.4, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.6, 6]} />
        <meshStandardMaterial color="#a0aec0" metalness={0.9} />
      </mesh>
      <mesh position={[-0.25, -0.4, -0.3]} rotation={[0.8, -0.4, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.6, 6]} />
        <meshStandardMaterial color="#a0aec0" metalness={0.9} />
      </mesh>

      {/* 4x Attitude Control Thruster Pods */}
      {[
        [-0.36, 0.45, -0.3],
        [0.36, 0.45, -0.3],
        [-0.36, -0.45, -0.3],
        [0.36, -0.45, -0.3],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]}>
          <coneGeometry args={[0.035, 0.08, 8]} />
          <meshStandardMaterial color="#2d3748" metalness={0.95} />
        </mesh>
      ))}

      {/* Pulsing Telemetry Status Beacon Lights */}
      <pointLight ref={beaconRef} color="#10b981" distance={3.5} intensity={2.0} />
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>
      <mesh position={[0.35, -0.55, 0.3]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-0.35, -0.55, 0.3]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 2. CURVED EARTH HORIZON & ATMOSPHERIC LIMB GLOW
// ─────────────────────────────────────────────────────────────
const EarthAtmosphereHorizon: React.FC = () => {
  return (
    <group position={[0, -22, -18]}>
      {/* Huge Curved Earth Horizon Sphere */}
      <mesh rotation={[0.1, 0, 0]} receiveShadow>
        <sphereGeometry args={[24, 64, 48]} />
        <meshStandardMaterial
          color="#040d1a"
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>

      {/* Stratospheric Ozone Blue Glow Atmosphere Shell */}
      <mesh rotation={[0.1, 0, 0]}>
        <sphereGeometry args={[24.4, 64, 48]} />
        <meshBasicMaterial
          color="#0284c7"
          transparent
          opacity={0.32}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer Cyan Atmospheric Limb Aurora Ring */}
      <mesh rotation={[0.1, 0, 0]}>
        <sphereGeometry args={[24.8, 64, 48]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 3. HIGH-ALTITUDE STRATOSPHERIC CLOUD FORMATIONS
// ─────────────────────────────────────────────────────────────
const StratosphericClouds: React.FC = () => {
  const cloudsRef = useRef<THREE.Group>(null);

  const cloudClusters = useMemo(() => {
    return [
      { x: -3.5, y: 1.6, z: -2.2, rx: 2.8, rz: 1.8, opacity: 0.28 },
      { x: 2.2, y: 1.8, z: -1.5, rx: 3.2, rz: 2.0, opacity: 0.24 },
      { x: -1.0, y: 1.5, z: 2.4, rx: 2.5, rz: 1.6, opacity: 0.22 },
      { x: 3.8, y: 1.9, z: 1.8, rx: 2.4, rz: 1.7, opacity: 0.26 },
      { x: -4.2, y: 1.7, z: 1.2, rx: 2.6, rz: 1.5, opacity: 0.25 },
    ];
  }, []);

  useFrame(({ clock }) => {
    if (cloudsRef.current) {
      const t = clock.getElapsedTime() * 0.04;
      cloudsRef.current.position.x = Math.sin(t) * 0.6;
      cloudsRef.current.position.z = Math.cos(t * 0.8) * 0.4;
    }
  });

  return (
    <group ref={cloudsRef}>
      {cloudClusters.map((c, idx) => (
        <group key={idx} position={[c.x, c.y, c.z]}>
          {/* Cloud Core Puff */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[c.rx, c.rz]} />
            <meshBasicMaterial
              color="#d9e6f2"
              transparent
              opacity={c.opacity}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* High Wisps */}
          <mesh position={[0.3, 0.08, -0.2]} rotation={[-Math.PI / 2, 0, 0.4]}>
            <planeGeometry args={[c.rx * 0.75, c.rz * 0.7]} />
            <meshBasicMaterial
              color="#eaf2f8"
              transparent
              opacity={c.opacity * 0.7}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// 4. COSMIC STARFIELD & ORBITAL GRID LATTICE
// ─────────────────────────────────────────────────────────────
const CosmicStarfield: React.FC = () => {
  const starsRef = useRef<THREE.Points>(null);

  const { starPositions, starCount } = useMemo(() => {
    const count = 750;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Semi-sphere dome in background
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 28 + Math.random() * 12;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = Math.max(0.5, r * Math.sin(phi) * Math.sin(theta));
      const z = -Math.abs(r * Math.cos(phi)) - 2;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return { starPositions: pos, starCount: count };
  }, []);

  useFrame(({ clock }) => {
    if (starsRef.current) {
      const t = clock.getElapsedTime() * 0.008;
      starsRef.current.rotation.y = t;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starCount}
          array={starPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#e0f2fe"
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
};

// ─────────────────────────────────────────────────────────────
// 5. ORBITAL GROUND TRACK TRAJECTORY & LAT/LONG RINGS
// ─────────────────────────────────────────────────────────────
const OrbitalGroundTrack: React.FC = () => {
  const orbitCurve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const count = 80;
    for (let i = 0; i <= count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const x = Math.cos(theta) * 7.8;
      const z = Math.sin(theta) * 6.2;
      const y = 3.5 + Math.sin(theta * 2) * 1.8;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, []);

  const orbitGeo = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(orbitCurve);
  }, [orbitCurve]);

  const lineObj = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color: '#0284c7', transparent: true, opacity: 0.35 });
    return new THREE.Line(orbitGeo, mat);
  }, [orbitGeo]);

  return (
    <group>
      {/* LEO Satellite Orbital Path Ribbon */}
      <primitive object={lineObj} />

      {/* Geospatial Coordinate Rings (Outer Matrix Rim) */}
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.2, 7.26, 64]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.8, 8.84, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN SATELLITE BACKGROUND 3D CONTAINER
// ─────────────────────────────────────────────────────────────
export const SatelliteBackground3D: React.FC = React.memo(() => {
  return (
    <group>
      {/* Deep Space Cosmic Starfield */}
      <CosmicStarfield />

      {/* Earth Horizon Curvature & Blue Stratosphere Glow */}
      <EarthAtmosphereHorizon />

      {/* Orbital Ground Tracks & Geospatial Coordinate Rings */}
      <OrbitalGroundTrack />

      {/* High-Altitude Stratospheric Mountain Cloud Formations */}
      <StratosphericClouds />

      {/* 3D Reconnaissance Satellite Model in Orbit */}
      <ReconSatelliteModel />
    </group>
  );
});
