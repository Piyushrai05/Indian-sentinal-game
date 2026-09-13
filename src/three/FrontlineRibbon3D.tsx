import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { LocationData } from '../types/game';

interface FrontlineRibbon3DProps {
  locations: LocationData[];
}

export const FrontlineRibbon3D: React.FC<FrontlineRibbon3DProps> = ({ locations }) => {
  const frontlinePoints = useMemo(() => {
    // Collect frontline sectors and build a jagged military demarcation line
    const frontlineSectors = locations.filter(
      l => l.control === 'CONTESTED' || l.status === 'CRITICAL' || l.status === 'FRONTLINE'
    );

    if (frontlineSectors.length < 2) {
      // Default Kashmir 1947 Ceasefire/Frontline axis
      return [
        [-3.2, 0.72, -1.2],
        [-2.8, 0.68, -0.7],
        [-2.4, 0.52, 0.2],
        [-2.6, 0.45, 1.2],
        [-2.3, 0.38, 2.8],
        [-1.8, 0.32, 3.4]
      ] as [number, number, number][];
    }

    const pts = frontlineSectors.map(s => [s.gridPosition[0], s.gridPosition[1] + 0.06, s.gridPosition[2]] as [number, number, number]);
    return pts;
  }, [locations]);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Frontline Line */}
      <Line
        points={frontlinePoints}
        color="#e53e3e"
        lineWidth={3.0}
        dashed
        dashScale={2.5}
        dashSize={0.4}
        gapSize={0.2}
        transparent
        opacity={0.85}
      />

      {/* 2. Tactical Contact Dots along the Front */}
      {frontlinePoints.map((pt, idx) => (
        <mesh key={idx} position={pt}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#e53e3e" />
        </mesh>
      ))}
    </group>
  );
};
