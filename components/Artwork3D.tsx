'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, GradientTexture, Environment } from '@react-three/drei';
import * as THREE from 'three';

function PaintingMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.5}>
        <boxGeometry args={[2, 2.5, 0.1]} />
        <MeshDistortMaterial
          color="#9333ea"
          roughness={0.1}
          metalness={0.8}
          distort={0.3}
          speed={2}
        >
          <GradientTexture
            stops={[0, 0.5, 1]}
            colors={['#6b46c1', '#9333ea', '#c084fc']}
          />
        </MeshDistortMaterial>
      </mesh>
    </Float>
  );
}

function DigitalSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const points = useMemo(() => {
    const p = new Array(1000).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: (Math.random() - 0.5) * 2,
    }));
    return p;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color="#00ffff"
          roughness={0}
          metalness={1}
          clearcoat={1}
          clearcoatRoughness={0}
          wireframe
        />
      </mesh>
      {points.map((point, i) => (
        <mesh key={i} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[0.01, 4, 4]} />
          <meshBasicMaterial color="#c084fc" />
        </mesh>
      ))}
    </group>
  );
}

function PrintFrame() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Float speed={3} floatIntensity={1}>
      <group ref={groupRef}>
        {/* Frame */}
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[2.2, 2.7, 0.1]} />
          <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.2} />
        </mesh>
        {/* Canvas */}
        <mesh>
          <planeGeometry args={[1.8, 2.3]} />
          <MeshDistortMaterial
            color="#2d1b69"
            roughness={0.4}
            distort={0.2}
            speed={3}
          />
        </mesh>
      </group>
    </Float>
  );
}

function InstallationCrystal() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={2}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color="#e9d5ff"
          roughness={0}
          metalness={0.5}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0}
          transmission={0.8}
          thickness={0.5}
          ior={2.5}
        />
      </mesh>
      {/* Orbiting particles */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      ))}
    </Float>
  );
}

interface Artwork3DProps {
  type: 'painting' | 'digital' | 'print' | 'installation';
}

export default function Artwork3D({ type }: Artwork3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9333ea" />

        {type === 'painting' && <PaintingMesh />}
        {type === 'digital' && <DigitalSphere />}
        {type === 'print' && <PrintFrame />}
        {type === 'installation' && <InstallationCrystal />}

        <Environment preset="night" />
      </Canvas>
    </div>
  );
}