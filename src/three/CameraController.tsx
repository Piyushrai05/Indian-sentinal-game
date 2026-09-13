import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const cameraMode = useGameStore(s => s.cameraMode);
  const cameraFocusTarget = useGameStore(s => s.cameraFocusTarget);
  const gameScreen = useGameStore(s => s.gameScreen);
  const isSatelliteView = useGameStore(s => s.isSatelliteView);

  const desiredCamPos = useRef(new THREE.Vector3(0, 8.5, 7.5));
  const desiredLookAt = useRef(new THREE.Vector3(0, 0, 0.5));

  // Determine target positions based on mode
  useEffect(() => {
    const [tx, ty, tz] = cameraFocusTarget;

    if (gameScreen === 'MENU') {
      desiredCamPos.current.set(0.5, 6.5, 8.5);
      desiredLookAt.current.set(0, 0.2, 0);
    } else if (isSatelliteView) {
      // High-Altitude Orbital Reconnaissance Satellite View
      if (cameraMode === 'SECTOR_FOCUS' || cameraMode === 'BATTLE_FOCUS') {
        desiredCamPos.current.set(tx * 0.6, ty + 7.5, tz * 0.6 + 1.2);
        desiredLookAt.current.set(tx, ty + 0.2, tz);
      } else {
        desiredCamPos.current.set(0, 11.8, 1.4);
        desiredLookAt.current.set(0, 0, 0.2);
      }
    } else if (cameraMode === 'BATTLE_FOCUS') {
      desiredCamPos.current.set(tx * 0.7, ty + 2.8, tz * 0.7 + 3.2);
      desiredLookAt.current.set(tx, ty + 0.4, tz);
    } else if (cameraMode === 'SECTOR_FOCUS') {
      desiredCamPos.current.set(tx * 0.65, ty + 4.2, tz * 0.65 + 4.5);
      desiredLookAt.current.set(tx, ty + 0.3, tz);
    } else {
      // OVERVIEW
      desiredCamPos.current.set(0, 8.8, 7.8);
      desiredLookAt.current.set(0, 0, 0.6);
    }
  }, [cameraMode, cameraFocusTarget, gameScreen, isSatelliteView]);

  useFrame(({ clock }, delta) => {
    // 1. Slow cinematic drift for main menu
    if (gameScreen === 'MENU') {
      const t = clock.getElapsedTime() * 0.15;
      desiredCamPos.current.x = Math.sin(t) * 2.2;
      desiredCamPos.current.z = 8.5 + Math.cos(t) * 1.0;
    }

    // 2. Smooth exponential damping for camera position & lookAt target
    const damping = Math.min(1, delta * (isSatelliteView ? 4.0 : 3.2));
    camera.position.lerp(desiredCamPos.current, damping);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(desiredLookAt.current, damping);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={2.5}
      maxDistance={18.0}
      maxPolarAngle={Math.PI / 2.1} // Prevent camera going below table
      minPolarAngle={Math.PI / 16}
      enablePan={true}
      panSpeed={0.8}
      rotateSpeed={0.7}
      zoomSpeed={0.8}
    />
  );
};
