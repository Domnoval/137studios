'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment, useTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Ornate Artifact - Similar to the cubes in your screenshot
function OrnateArtifact() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle idle animation
      groupRef.current.rotation.y += 0.002;
    }
  });

  // Create ornate cube with decorative elements
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Main cube - Dark/Blue side */}
        <mesh position={[-0.6, 0, 0]} castShadow>
          <boxGeometry args={[1, 1.2, 0.15]} />
          <meshPhysicalMaterial
            color="#1a2744"
            metalness={0.9}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Decorative frame on dark cube */}
        <mesh position={[-0.6, 0, 0.08]} castShadow>
          <torusGeometry args={[0.35, 0.03, 16, 32]} />
          <meshStandardMaterial
            color="#4a9eff"
            metalness={1}
            roughness={0.2}
            emissive="#4a9eff"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Glowing center orb - dark cube */}
        <mesh position={[-0.6, 0, 0.15]} castShadow>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial
            color="#00d9ff"
            emissive="#00d9ff"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        {/* Main cube - Light/Pink side */}
        <mesh position={[0.6, 0, 0]} castShadow>
          <boxGeometry args={[1, 1.2, 0.15]} />
          <meshPhysicalMaterial
            color="#d4a5c4"
            metalness={0.8}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Decorative frame on light cube */}
        <mesh position={[0.6, 0, 0.08]} castShadow>
          <torusGeometry args={[0.35, 0.03, 16, 32]} />
          <meshStandardMaterial
            color="#ff69b4"
            metalness={1}
            roughness={0.2}
            emissive="#ff69b4"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Glowing center orb - light cube */}
        <mesh position={[0.6, 0, 0.15]} castShadow>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial
            color="#ff1493"
            emissive="#ff1493"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        {/* Ornate corner decorations */}
        {[
          [-0.6, 0.5, 0.1],
          [-0.6, -0.5, 0.1],
          [0.6, 0.5, 0.1],
          [0.6, -0.5, 0.1],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <octahedronGeometry args={[0.08, 0]} />
            <meshStandardMaterial
              color={i < 2 ? "#4a9eff" : "#ff69b4"}
              metalness={1}
              roughness={0.1}
              emissive={i < 2 ? "#4a9eff" : "#ff69b4"}
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Holographic Platform
function HolographicPlatform() {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={[0, -1.5, 0]}>
      {/* Main platform disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.05, 64]} />
        <meshPhysicalMaterial
          color="#00d9ff"
          transparent
          opacity={0.2}
          metalness={0.9}
          roughness={0.1}
          emissive="#00d9ff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Rotating holographic rings */}
      <group ref={ringsRef}>
        {[1.2, 1.5, 1.8].map((radius, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.02, 16, 64]} />
            <meshStandardMaterial
              color="#00d9ff"
              emissive="#00d9ff"
              emissiveIntensity={1.5 - i * 0.3}
              transparent
              opacity={0.6 - i * 0.15}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* Grid lines */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 1.5,
              0.03,
              Math.sin(angle) * 1.5
            ]}
            rotation={[-Math.PI / 2, 0, angle]}
          >
            <planeGeometry args={[0.02, 3]} />
            <meshBasicMaterial
              color="#00d9ff"
              transparent
              opacity={0.3}
              toneMapped={false}
            />
          </mesh>
        );
      })}

      {/* Particle effects */}
      {Array.from({ length: 30 }, (_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const radius = 1 + Math.random() * 0.8;
        return (
          <mesh
            key={`particle-${i}`}
            position={[
              Math.cos(angle) * radius,
              Math.random() * 0.3,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial
              color="#00d9ff"
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Floating data particles
function DataParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const radius = 3 + Math.random() * 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 1;
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4a9eff"
        transparent
        opacity={0.6}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

// 3D Scene Component
function Scene() {
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

      {/* Lights */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4a9eff" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        color="#00d9ff"
        castShadow
      />

      {/* Main Artifact */}
      <OrnateArtifact />

      {/* Holographic Platform */}
      <HolographicPlatform />

      {/* Data Particles */}
      <DataParticles />

      {/* Environment */}
      <Environment preset="night" />

      {/* Orbit Controls - enables mouse rotation and zoom */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Main Component with UI
export default function InteractiveArtifactViewer() {
  const [autoRotate, setAutoRotate] = useState(false);
  const [zoom, setZoom] = useState(5);
  const [isMounted, setIsMounted] = useState(false);

  // Generate stable pixel grid pattern (prevents hydration mismatch)
  const pixelGrid = useMemo(() => {
    return Array.from({ length: 64 }, (_, i) => ({
      color: Math.random() > 0.5 ? 'bg-pink-500' : 'bg-cyan-500',
      opacity: Math.random() * 0.8 + 0.2
    }));
  }, []);

  // Only render random pixel grid on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      {/* 3D Canvas */}
      <Canvas shadows className="w-full h-full">
        <Scene />
      </Canvas>

      {/* UI Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top HUD */}
        <div className="absolute top-8 left-8 space-y-2 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-lg px-4 py-2 font-mono text-xs text-cyan-400"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span>EO X57</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-lg px-4 py-2 font-mono text-xs text-cyan-400"
          >
            <div>ɸ: 1m 830.10¢£/ñ</div>
          </motion.div>
        </div>

        {/* Right side info */}
        <div className="absolute top-8 right-8 space-y-2 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/40 backdrop-blur-md border border-pink-500/30 rounded-lg px-4 py-2 font-mono text-xs text-pink-400"
          >
            <div className="flex items-center gap-2">
              <span>⬡ 1₹ 738</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-md border border-pink-500/30 rounded-lg px-4 py-2 font-mono text-xs text-pink-400"
          >
            <div>3/4 536 : £:17</div>
          </motion.div>

          {/* Pixel grid preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-md border border-pink-500/30 rounded-lg p-2"
          >
            <div className="grid grid-cols-8 gap-[2px] w-20 h-20">
              {isMounted ? pixelGrid.map((pixel, i) => (
                <div
                  key={i}
                  className={`w-full h-full ${pixel.color}`}
                  style={{ opacity: pixel.opacity }}
                />
              )) : Array.from({ length: 64 }, (_, i) => (
                <div
                  key={i}
                  className="w-full h-full bg-cyan-500"
                  style={{ opacity: 0.5 }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 items-center bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-full px-6 py-3"
          >
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-4 py-2 rounded-full font-mono text-xs transition-all ${
                autoRotate
                  ? 'bg-cyan-500 text-black'
                  : 'bg-transparent text-cyan-400 border border-cyan-500/50'
              }`}
            >
              {autoRotate ? 'AUTO ON' : 'AUTO OFF'}
            </button>

            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
              <span>ZOOM</span>
              <input
                type="range"
                min="3"
                max="10"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-32"
              />
            </div>

            <div className="text-cyan-400 font-mono text-xs border-l border-cyan-500/30 pl-4">
              DRAG TO ROTATE
            </div>
          </motion.div>
        </div>

        {/* Bottom left technical data */}
        <div className="absolute bottom-8 left-8 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1 font-mono text-[10px] text-cyan-400/60"
          >
            <div>7₃1 : 86.₁8-9 : 7₄12</div>
            <div>0/₁ CC13.38 : 7 ∂</div>
          </motion.div>
        </div>
      </div>

      {/* Scan lines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#00d9ff_2px,#00d9ff_4px)]" />
      </div>
    </div>
  );
}
