import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { SupplyRouteData } from '../types/game';
import { useGameStore } from '../store/gameStore';

interface SupplyRoutes3DProps {
  routes: SupplyRouteData[];
}

// 3D Animated Military Supply Convoy Truck
const ConvoyTruck: React.FC<{ spline: THREE.CatmullRomCurve3; speed: number; offset: number; color: string }> = ({
  spline,
  speed,
  offset,
  color,
}) => {
  const truckRef = useRef<THREE.Group>(null);
  const headLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!truckRef.current) return;
    const t = (clock.getElapsedTime() * speed + offset) % 1.0;
    const pos = spline.getPointAt(t);
    const tangent = spline.getTangentAt(t);

    truckRef.current.position.set(pos.x, pos.y + 0.04, pos.z);

    // Align truck rotation with spline tangent
    const angle = Math.atan2(tangent.x, tangent.z);
    truckRef.current.rotation.y = angle;

    // Subtle truck suspension vibration
    truckRef.current.position.y += Math.sin(clock.getElapsedTime() * 18) * 0.003;
  });

  return (
    <group ref={truckRef} scale={[0.8, 0.8, 0.8]}>
      {/* Truck Chassis & Bed */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[0.07, 0.04, 0.16]} />
        <meshStandardMaterial color="#2d3326" roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Truck Canvas Canopy */}
      <mesh position={[0, 0.05, -0.02]} castShadow>
        <boxGeometry args={[0.068, 0.045, 0.09]} />
        <meshStandardMaterial color="#6e624f" roughness={0.9} />
      </mesh>
      {/* Truck Cab */}
      <mesh position={[0, 0.045, 0.05]} castShadow>
        <boxGeometry args={[0.065, 0.04, 0.045]} />
        <meshStandardMaterial color="#2d3326" roughness={0.7} />
      </mesh>
      {/* Front Yellow Headlight Glow */}
      <pointLight ref={headLightRef} position={[0, 0.03, 0.09]} color="#ffd166" distance={0.8} intensity={1.5} />
      <mesh position={[0, 0.03, 0.075]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial color="#ffd166" />
      </mesh>
    </group>
  );
};

const RouteCurveMesh: React.FC<{ route: SupplyRouteData; isSelected: boolean }> = ({ route, isSelected }) => {
  const { points3D, spline } = useMemo(() => {
    const pts = route.pathWaypoints.map(([x, y, z]) => new THREE.Vector3(x, y + 0.06, z));
    const catmull = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.15);
    const sampled = catmull.getPoints(50);
    return {
      points3D: sampled.map(p => [p.x, p.y, p.z] as [number, number, number]),
      spline: catmull,
    };
  }, [route.pathWaypoints]);

  const routeColor = useMemo(() => {
    switch (route.status) {
      case 'ACTIVE': return '#c09a5b';
      case 'THREATENED': return '#fbbf24';
      case 'SEVERED': return '#ef4444';
      case 'SEASONAL': return '#38bdf8';
      default: return '#8a7f6c';
    }
  }, [route.status]);

  return (
    <group>
      {/* 1. Tactical Glowing Route Spline */}
      <Line
        points={points3D}
        color={routeColor}
        lineWidth={isSelected ? 3.8 : 2.2}
        dashed={route.status === 'SEVERED' || route.status === 'SEASONAL'}
        dashScale={2}
        dashSize={0.4}
        gapSize={0.2}
        transparent
        opacity={isSelected ? 0.95 : 0.6}
      />

      {/* 2. Physical Mountain Pass Waypoint Beacons */}
      {points3D.map((pt, i) => {
        if (i % 8 !== 0) return null;
        return (
          <mesh key={i} position={pt}>
            <sphereGeometry args={[isSelected ? 0.045 : 0.03, 8, 8]} />
            <meshStandardMaterial
              color={routeColor}
              emissive={routeColor}
              emissiveIntensity={isSelected ? 0.6 : 0.25}
            />
          </mesh>
        );
      })}

      {/* 3. Moving 3D Convoy Trucks on Active Routes */}
      {route.status === 'ACTIVE' && (
        <>
          <ConvoyTruck spline={spline} speed={0.035} offset={0.1} color={routeColor} />
          <ConvoyTruck spline={spline} speed={0.035} offset={0.55} color={routeColor} />
        </>
      )}

      {route.status === 'THREATENED' && (
        <ConvoyTruck spline={spline} speed={0.02} offset={0.3} color={routeColor} />
      )}
    </group>
  );
};

export const SupplyRoutes3D: React.FC<SupplyRoutes3DProps> = ({ routes }) => {
  const selectedLocationId = useGameStore(s => s.selectedLocationId);

  return (
    <group position={[0, 0, 0]}>
      {routes.map(route => {
        const isConnected = route.fromId === selectedLocationId || route.toId === selectedLocationId;
        return (
          <RouteCurveMesh
            key={route.id}
            route={route}
            isSelected={isConnected}
          />
        );
      })}
    </group>
  );
};
