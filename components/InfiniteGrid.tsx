'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function GridPlane() {
  const gridRef = useRef<THREE.GridHelper>(null);
  const grid2Ref = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Animate the grids slowly for depth effect
    if (gridRef.current) {
      gridRef.current.position.z = (time * 2) % 20;
    }
    if (grid2Ref.current) {
      grid2Ref.current.position.z = ((time * 2) % 20) - 20;
    }
  });

  return (
    <>
      {/* Main infinite grid */}
      <gridHelper
        ref={gridRef}
        args={[200, 50, '#9333ea', '#1a0033']}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      />

      {/* Second grid for seamless loop */}
      <gridHelper
        ref={grid2Ref}
        args={[200, 50, '#9333ea', '#1a0033']}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, -20]}
      />

      {/* Fog for infinite depth illusion */}
      <fog attach="fog" args={['#0a0a0a', 10, 80]} />

      {/* Ambient purple glow */}
      <ambientLight intensity={0.3} color="#9333ea" />
      <pointLight position={[0, 10, -20]} intensity={0.5} color="#fbbf24" distance={100} />
    </>
  );
}

export default function InfiniteGrid() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 75, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#0a0a0a' }}
      >
        <GridPlane />
      </Canvas>
    </div>
  );
}
