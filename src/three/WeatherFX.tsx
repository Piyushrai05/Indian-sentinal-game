import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

export const WeatherFX: React.FC = () => {
  const warState = useGameStore(s => s.warState);
  const mapLayers = useGameStore(s => s.mapLayers);

  const isPrecipitating =
    mapLayers.weather &&
    (warState.weather === 'COLD_RAIN' || warState.weather === 'MOUNTAIN_BLIZZARD');

  const count = warState.weather === 'MOUNTAIN_BLIZZARD' ? 400 : 250;

  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = Math.random() * 6 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return { positions: pos };
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame(() => {
    if (pointsRef.current && isPrecipitating) {
      const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        let y = pos.getY(i);
        let x = pos.getX(i);
        y -= warState.weather === 'MOUNTAIN_BLIZZARD' ? 0.04 : 0.08;
        if (warState.weather === 'MOUNTAIN_BLIZZARD') {
          x += (Math.random() - 0.5) * 0.01;
        }
        if (y < 0.2) y = 6.0;
        pos.setY(i, y);
        pos.setX(i, x);
      }
      pos.needsUpdate = true;
    }
  });

  if (!isPrecipitating) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={warState.weather === 'MOUNTAIN_BLIZZARD' ? 0.08 : 0.04}
        color={warState.weather === 'MOUNTAIN_BLIZZARD' ? '#ffffff' : '#90cdf4'}
        transparent
        opacity={0.65}
      />
    </points>
  );
};
