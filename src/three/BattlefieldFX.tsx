import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

export const BattlefieldFX: React.FC = () => {
  const isConsequenceOpen = useGameStore(s => s.isConsequenceOpen);
  const selectedLocationId = useGameStore(s => s.selectedLocationId);
  const locations = useGameStore(s => s.locations);

  const targetLoc = locations.find(l => l.id === selectedLocationId);
  const dustParticlesRef = useRef<THREE.Points>(null);
  const smokeGroupRef = useRef<THREE.Group>(null);

  // 1. Atmospheric Ambient Dust Particles in the War Room
  const { dustPositions, dustCount } = useMemo(() => {
    const count = 180;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = Math.random() * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return { dustPositions: positions, dustCount: count };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (dustParticlesRef.current) {
      const pos = dustParticlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < dustCount; i++) {
        let y = pos.getY(i);
        y -= 0.003;
        if (y < 0.1) y = 4.8;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    if (smokeGroupRef.current && isConsequenceOpen) {
      const scale = 1.0 + Math.sin(t * 12) * 0.4;
      smokeGroupRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* War Room Floating Dust Motes */}
      <points ref={dustParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dustCount}
            array={dustPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          color="#ffdda0"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Combat Artillery Shockwave on Consequence View */}
      {isConsequenceOpen && targetLoc && (
        <group
          ref={smokeGroupRef}
          position={[
            targetLoc.gridPosition[0],
            targetLoc.gridPosition[1] + 0.2,
            targetLoc.gridPosition[2],
          ]}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.7, 24]} />
            <meshBasicMaterial
              color="#e66a3b"
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
          <pointLight color="#ff6b35" intensity={4.5} distance={5} decay={2} />
        </group>
      )}
    </group>
  );
};
