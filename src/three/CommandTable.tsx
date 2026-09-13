import React from 'react';

export const CommandTable = React.memo(() => {
  return (
    <group position={[0, -0.4, 0]}>
      {/* 1. Heavy Aged Dark Oak War Table Top */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[14.2, 0.5, 11.2]} />
        <meshStandardMaterial
          color="#18130e"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* 2. Beveled Dark Wood Table Rim */}
      <mesh position={[0, 0.26, 0]} receiveShadow>
        <boxGeometry args={[13.2, 0.08, 10.2]} />
        <meshStandardMaterial
          color="#221b14"
          roughness={0.85}
          metalness={0.08}
        />
      </mesh>

      {/* 3. Aged Parchment Map Border Margin */}
      <mesh position={[0, 0.31, 0]} receiveShadow>
        <planeGeometry args={[12.4, 9.4]} />
        <meshStandardMaterial
          color="#ab9b7d"
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {/* 4. Table Legs (Heavy Wooden Pillars) */}
      {[
        [-6.2, -3.0, -4.8],
        [6.2, -3.0, -4.8],
        [-6.2, -3.0, 4.8],
        [6.2, -3.0, 4.8],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 6.0, 0.9]} />
          <meshStandardMaterial
            color="#120e0a"
            roughness={0.85}
            metalness={0.08}
          />
        </mesh>
      ))}

      {/* 5. Aged Brass Table Corner Caps */}
      {[
        [-6.8, 0.22, -5.3],
        [6.8, 0.22, -5.3],
        [-6.8, 0.22, 5.3],
        [6.8, 0.22, 5.3],
      ].map((pos, idx) => (
        <mesh key={`brass-${idx}`} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.25, 0.8]} />
          <meshStandardMaterial
            color="#b38a43"
            roughness={0.35}
            metalness={0.75}
          />
        </mesh>
      ))}
    </group>
  );
});
