import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { EnemyIntelContact } from '../types/game';

interface ThreatZones3DProps {
  contacts: EnemyIntelContact[];
}

export const ThreatZones3D: React.FC<ThreatZones3DProps> = ({ contacts }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.children.forEach((child, i) => {
        const ring = child.children[0] as THREE.Mesh;
        if (ring) {
          const s = 1.0 + Math.sin(t * 2.5 + i) * 0.15;
          ring.scale.set(s, s, 1);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {contacts.map(contact => {
        const [x, y, z] = contact.position3D;
        const color = contact.threatLevel === 'EXTREME' ? '#e53e3e' : '#dd6b20';

        return (
          <group key={contact.id} position={[x, y + 0.04, z]}>
            {/* Threat Circle */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.3, 0.42, 24]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.45}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Compact Tactical Hazard Indicator */}
            <Html position={[0, 0.15, 0]} center distanceFactor={12}>
              <div className="bg-[#1f0f0f]/90 border border-[#e53e3e]/70 text-[#feb2b2] text-[8px] font-mono px-1.5 py-0.2 rounded-full shadow-sm whitespace-nowrap flex items-center gap-1 cursor-default pointer-events-none select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
                <span>HOSTILE [{contact.confidencePercent}%]</span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
