import React from 'react';

export const CommandRoom = React.memo(() => {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Dark War Room Floor */}
      <mesh position={[0, -3.4, 0]} receiveShadow>
        <planeGeometry args={[36, 36]} />
        <meshStandardMaterial
          color="#0c0a08" // Deep dark floorboards
          roughness={0.92}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Back Wall (Dark Wood & Stucco) */}
      <mesh position={[0, 4.0, -14]} receiveShadow>
        <planeGeometry args={[36, 16]} />
        <meshStandardMaterial
          color="#100e0b"
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      {/* 3. Left Wall */}
      <mesh position={[-16, 4.0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[36, 16]} />
        <meshStandardMaterial
          color="#0e0c0a"
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      {/* 4. Right Wall */}
      <mesh position={[16, 4.0, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[36, 16]} />
        <meshStandardMaterial
          color="#0e0c0a"
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      {/* 5. Overhead Hanging Lantern Wire / Chain */}
      <mesh position={[0, 5.2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 3.5, 8]} />
        <meshStandardMaterial color="#2d251a" metalness={0.8} roughness={0.4} />
      </mesh>
    </group>
  );
});
