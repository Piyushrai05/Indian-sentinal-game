import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { KashmirTerrain } from './KashmirTerrain';
import { LocationMarker3D } from './LocationMarker3D';
import { SupplyRoutes3D } from './SupplyRoutes3D';
import { MovingUnits3D } from './MovingUnits3D';
import { FrontlineRibbon3D } from './FrontlineRibbon3D';
import { ThreatZones3D } from './ThreatZones3D';
import { WeatherFX } from './WeatherFX';
import { BattlefieldFX } from './BattlefieldFX';
import { CameraController } from './CameraController';
import { LiveWeaponsEngine } from './LiveWeaponsEngine';
import { SatelliteReconOverlay3D } from './SatelliteReconOverlay3D';
import { SatelliteBackground3D } from './SatelliteBackground3D';
import { Landmarks3D } from './Landmarks3D';
import { useGameStore } from '../store/gameStore';

// ──────────────────────────────────────────────────────────────────
// PREMIUM POST-PROCESSING via @react-three/postprocessing
// ──────────────────────────────────────────────────────────────────
let EffectComposer: any = null;
let Bloom: any = null;
let Vignette: any = null;
let ChromaticAberration: any = null;
let ToneMapping: any = null;
let Noise: any = null;

try {
  const pp = require('@react-three/postprocessing');
  EffectComposer = pp.EffectComposer;
  Bloom = pp.Bloom;
  Vignette = pp.Vignette;
  ChromaticAberration = pp.ChromaticAberration;
  ToneMapping = pp.ToneMapping;
  Noise = pp.Noise;
} catch (e) {
  // postprocessing not available, graceful fallback
}

// ──────────────────────────────────────────────────────────────────
// CINEMATIC GOD-RAY SUN SHAFT (Custom volumetric shafts)
// ──────────────────────────────────────────────────────────────────
const GodRaySunShaft: React.FC<{ isSatellite: boolean }> = ({ isSatellite }) => {
  const shafts = useRef<THREE.Mesh[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    shafts.current.forEach((mesh, i) => {
      if (mesh) {
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = (0.025 + Math.sin(t * 0.4 + i * 0.8) * 0.010);
      }
    });
  });

  if (isSatellite) return null;

  const shaftPositions: Array<[number, number, number, number, number]> = [
    [2.5, 2.8, -3.2, 0.38, 5.5],
    [1.2, 3.5, -4.0, 0.28, 7.0],
    [3.5, 2.2, -2.5, 0.45, 4.8],
    [0.8, 4.0, -3.5, 0.22, 8.0],
    [4.0, 2.5, -1.8, 0.32, 4.2],
  ];

  return (
    <group>
      {shaftPositions.map(([x, y, z, radius, height], i) => (
        <mesh
          key={i}
          ref={el => { if (el) shafts.current[i] = el; }}
          position={[x, y - height / 2, z]}
          rotation={[0.18, 0, 0.08 * (i % 2 === 0 ? 1 : -1)]}
        >
          <cylinderGeometry args={[radius * 0.3, radius, height, 8, 1, true]} />
          <meshBasicMaterial
            color="#fff8e8"
            transparent
            opacity={0.028}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

// ──────────────────────────────────────────────────────────────────
// STELLAR STAR FIELD BACKGROUND
// ──────────────────────────────────────────────────────────────────
const StarField: React.FC = () => {
  const starsRef = useRef<THREE.Points>(null);
  const geometry = React.useMemo(() => {
    const count = 3500;
    const pos = new Float32Array(count * 3);
    let seed = 9911;
    const rnd = () => { const x = Math.sin(seed++) * 10000; return x - Math.floor(x); };
    for (let i = 0; i < count; i++) {
      const theta = rnd() * Math.PI * 2;
      const phi = Math.acos(2 * rnd() - 1);
      const r = 60 + rnd() * 40;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.0015;
    }
  });

  return (
    <points ref={starsRef} geometry={geometry}>
      <pointsMaterial color="#d8e8ff" size={0.18} transparent opacity={0.72} sizeAttenuation depthWrite={false} />
    </points>
  );
};

// ──────────────────────────────────────────────────────────────────
// DYNAMIC FOG CONTROLLER (updates fog each frame based on mode)
// ──────────────────────────────────────────────────────────────────
const FogController: React.FC<{ fogColor: string; fogDensity: number }> = ({ fogColor, fogDensity }) => {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2(fogColor, fogDensity);
    return () => { scene.fog = null; };
  }, [scene, fogColor, fogDensity]);
  return null;
};

// ──────────────────────────────────────────────────────────────────
// POST PROCESSING WRAPPER
// ──────────────────────────────────────────────────────────────────
const PremiumPostProcessing: React.FC<{ isSatellite: boolean; mode: string }> = ({ isSatellite, mode }) => {
  if (!EffectComposer || !Bloom) return null;

  const bloomIntensity = isSatellite ? (mode === 'STARLIGHT_NVG' ? 2.5 : mode === 'THERMAL' ? 2.0 : 1.2) : 0.6;
  const bloomThreshold = isSatellite ? 0.3 : 0.55;
  const bloomRadius = isSatellite ? 0.65 : 0.4;
  const vignetteOffset = 0.42;
  const vignetteDarkness = isSatellite ? 0.9 : 0.65;

  return (
    <EffectComposer>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={0.85}
        radius={bloomRadius}
      />
      {Vignette && (
        <Vignette offset={vignetteOffset} darkness={vignetteDarkness} />
      )}
      {ChromaticAberration && isSatellite && (
        <ChromaticAberration offset={[0.0008, 0.0008]} />
      )}
      {Noise && (
        <Noise opacity={0.035} />
      )}
    </EffectComposer>
  );
};

// ──────────────────────────────────────────────────────────────────
// MAIN SCENE CONTAINER
// ──────────────────────────────────────────────────────────────────
export const SceneContainer: React.FC = () => {
  const locations = useGameStore(s => s.locations);
  const supplyRoutes = useGameStore(s => s.supplyRoutes);
  const units = useGameStore(s => s.units);
  const enemyContacts = useGameStore(s => s.enemyContacts);
  const mapLayers = useGameStore(s => s.mapLayers);
  const warRoomLighting = useGameStore(s => s.warRoomLighting);
  const isSatelliteView = useGameStore(s => s.isSatelliteView);
  const satelliteViewMode = useGameStore(s => s.satelliteViewMode);

  // ── Dynamic Lighting Configuration ──────────────────────────────
  const lightConfig = isSatelliteView && satelliteViewMode === 'STARLIGHT_NVG' ? {
    ambientColor: '#002206',
    ambientIntensity: 0.6,
    sunColor: '#004a15',
    sunIntensity: 1.8,
    skyColor: '#001a08',
    earthColor: '#000d04',
    fogColor: '#000a04',
    fogDensity: 0.014,
    exposure: 1.6,
  } : isSatelliteView && satelliteViewMode === 'THERMAL' ? {
    ambientColor: '#1a0b2e',
    ambientIntensity: 0.85,
    sunColor: '#ff7700',
    sunIntensity: 2.4,
    skyColor: '#5c1d8f',
    earthColor: '#0a001a',
    fogColor: '#050008',
    fogDensity: 0.013,
    exposure: 1.4,
  } : isSatelliteView && satelliteViewMode === 'TOPOGRAPHIC' ? {
    ambientColor: '#0c2238',
    ambientIntensity: 1.1,
    sunColor: '#00e5ff',
    sunIntensity: 2.4,
    skyColor: '#0284c7',
    earthColor: '#021020',
    fogColor: '#010c18',
    fogDensity: 0.012,
    exposure: 1.35,
  } : warRoomLighting === 'DAWN_MIST' ? {
    ambientColor: '#3d5268',
    ambientIntensity: 1.2,
    sunColor: '#ffd8a0',
    sunIntensity: 2.8,
    skyColor: '#6a90b8',
    earthColor: '#0d1a26',
    fogColor: '#06101a',
    fogDensity: 0.013,
    exposure: 1.2,
  } : warRoomLighting === 'COLD_BLIZZARD' ? {
    ambientColor: '#2c3e52',
    ambientIntensity: 0.95,
    sunColor: '#c8deff',
    sunIntensity: 2.0,
    skyColor: '#4c6880',
    earthColor: '#0a121e',
    fogColor: '#040810',
    fogDensity: 0.020,
    exposure: 1.05,
  } : {
    // STANDARD — High-Altitude Golden-Hour Himalayan Recon
    ambientColor: '#2a3848',
    ambientIntensity: 1.05,
    sunColor: '#fff0d8',
    sunIntensity: 3.0,
    skyColor: '#3ab4f8',
    earthColor: '#04101e',
    fogColor: '#02060e',
    fogDensity: 0.010,
    exposure: 1.3,
  };

  return (
    <div className="absolute inset-0 w-full h-full z-0" style={{ background: lightConfig.fogColor }}>
      <Canvas
        shadows="soft"
        dpr={[1, 2]}
        camera={{ position: [0, 8.5, 7.5], fov: 45, near: 0.1, far: 160 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: lightConfig.exposure,
          alpha: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(lightConfig.fogColor));
        }}
      >
        <Suspense fallback={null}>

          {/* ── Fog & Background ───────────────────────────────────── */}
          <FogController fogColor={lightConfig.fogColor} fogDensity={lightConfig.fogDensity} />
          <color attach="background" args={[lightConfig.fogColor]} />

          {/* ── Star Field (deep background) ───────────────────────── */}
          <StarField />

          {/* ── LIGHTING RIG ───────────────────────────────────────── */}
          <ambientLight color={lightConfig.ambientColor} intensity={lightConfig.ambientIntensity} />

          {/* PRIMARY SUN — High-altitude direct solar beam with PCF soft shadows */}
          <directionalLight
            position={[9, 16, 7]}
            color={lightConfig.sunColor}
            intensity={lightConfig.sunIntensity}
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-bias={-0.00008}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          {/* HIMALAYAN GOLDEN RIDGE RIM LIGHT (backlit peaks) */}
          <directionalLight
            position={[-12, 6, -8]}
            color="#ffc878"
            intensity={0.90}
          />

          {/* EARTH-SHINE / STRATOSPHERIC BLUE FILL */}
          <directionalLight
            position={[-5, 3, 12]}
            color={lightConfig.skyColor}
            intensity={0.88}
          />

          {/* ZENITH OVERHEAD RECON SPOTLIGHT */}
          <spotLight
            position={[0, 15.0, 0]}
            color="#ffffff"
            intensity={1.6}
            angle={Math.PI / 2.6}
            penumbra={0.80}
            castShadow={false}
          />

          {/* KASHMIR VALLEY WARM FILL (golden hour glow in valley) */}
          <pointLight
            position={[0, 1.2, 0.1]}
            color="#ffb866"
            intensity={1.8}
            distance={6}
            decay={2}
          />

          {/* HIMALAYAN NORTH FACE ICE BLUE */}
          <pointLight
            position={[2.5, 3.5, -3.0]}
            color="#a8d8ff"
            intensity={1.4}
            distance={9}
            decay={2}
          />

          {/* JAMMU PLAINS WARM HAZE */}
          <pointLight
            position={[0.8, 0.8, 3.8]}
            color="#ff9944"
            intensity={1.0}
            distance={5}
            decay={2}
          />

          {/* ── 3D SATELLITE & ORBITAL EARTH BACKGROUND ─────────────── */}
          <SatelliteBackground3D />

          {/* ── GOD RAYS (Himalayan sun shafts) ─────────────────────── */}
          <GodRaySunShaft isSatellite={isSatelliteView} />

          {/* ── MAIN TERRAIN ─────────────────────────────────────────── */}
          {mapLayers.terrain && <KashmirTerrain />}

          {/* ── HISTORICAL LANDMARKS ─────────────────────────────────── */}
          <Landmarks3D />

          {/* ── STRATEGIC LAYERS ─────────────────────────────────────── */}
          {mapLayers.frontline && <FrontlineRibbon3D locations={locations} />}
          {mapLayers.supplyRoutes && <SupplyRoutes3D routes={supplyRoutes} />}
          {mapLayers.enemyIntel && <ThreatZones3D contacts={enemyContacts} />}
          {mapLayers.forces && <MovingUnits3D units={units} />}

          {/* ── LOCATION PINS ─────────────────────────────────────────── */}
          {locations.map(loc => (
            <LocationMarker3D key={loc.id} location={loc} />
          ))}

          {/* ── FX LAYERS ────────────────────────────────────────────── */}
          <BattlefieldFX />
          <WeatherFX />
          <LiveWeaponsEngine />
          <SatelliteReconOverlay3D />

          {/* ── CAMERA ───────────────────────────────────────────────── */}
          <CameraController />

          {/* ── POST-PROCESSING (Bloom + Vignette + Noise) ───────────── */}
          <PremiumPostProcessing isSatellite={isSatelliteView} mode={satelliteViewMode} />

        </Suspense>
      </Canvas>
    </div>
  );
};
