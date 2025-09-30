'use client';

import { useState, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { Float, Text, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Artwork {
  id: number;
  title: string;
  category: 'painting' | 'digital' | 'print' | 'installation';
  size: string;
  medium: string;
  year: number;
  price: string;
  description: string;
  color: string;
}

const artworks: Artwork[] = [
  { id: 1, title: "Cosmic Birth", category: "painting", size: "72x48", medium: "Acrylic on Canvas", year: 2024, price: "$8,888", description: "The universe's first breath, captured in swirling nebulas of consciousness.", color: "#9333ea" },
  { id: 2, title: "Digital Ayahuasca", category: "digital", size: "∞x∞", medium: "Generative Algorithm", year: 2024, price: "ETH 1.37", description: "Machine dreams meet plant wisdom in this algorithmic vision quest.", color: "#00ffff" },
  { id: 3, title: "Void Walker", category: "painting", size: "96x72", medium: "Mixed Media", year: 2023, price: "$13,700", description: "A figure traversing the spaces between realities, neither here nor there.", color: "#1a0033" },
  { id: 4, title: "Consciousness.exe", category: "installation", size: "Room Scale", medium: "Interactive Projection", year: 2024, price: "Commission", description: "Self-aware code that responds to your thoughts and emotions.", color: "#fbbf24" },
  { id: 5, title: "Astral Projection #7", category: "print", size: "36x24", medium: "Archival Print", year: 2024, price: "$777", description: "The seventh attempt at leaving the body, documented in light.", color: "#6b46c1" },
  { id: 6, title: "Sacred Circuitry", category: "digital", size: "Variable", medium: "AI + Human Collaboration", year: 2024, price: "$3,333", description: "Where ancient symbols meet quantum computing.", color: "#e9d5ff" },
];

function FloatingArtwork({ artwork, position, index, onClick, isSelected }: {
  artwork: Artwork;
  position: [number, number, number];
  index: number;
  onClick: () => void;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (meshRef.current && !isSelected) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.2;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position}>
        {/* Artwork Panel */}
        <mesh
          ref={meshRef}
          onClick={onClick}
          scale={isSelected ? [2, 2, 0.1] : [1.5, 1.8, 0.1]}
        >
          <boxGeometry args={[1, 1, 0.05]} />
          <meshPhysicalMaterial
            color={artwork.color}
            roughness={0.1}
            metalness={0.8}
            clearcoat={1}
            clearcoatRoughness={0}
            transmission={0.1}
            thickness={0.5}
          />
        </mesh>

        {/* Glowing Frame */}
        <mesh position={[0, 0, 0.03]} scale={[1.6, 1.9, 0.02]}>
          <boxGeometry args={[1, 1, 0.02]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.3} />
        </mesh>

        {/* Floating Particles around artwork */}
        {[...Array(5)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.sin(i * 2) * 2,
              Math.cos(i * 2) * 2,
              Math.sin(i) * 0.5
            ]}
          >
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#c084fc" />
          </mesh>
        ))}

        {/* Title Text */}
        <Html position={[0, -1.2, 0]} center>
          <div className="text-center pointer-events-none">
            <p className="text-cosmic-glow text-sm font-bold">{artwork.title}</p>
            <p className="text-cosmic-light text-xs">{artwork.year}</p>
          </div>
        </Html>

        {/* Category Indicator */}
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial
            color={
              artwork.category === 'painting' ? '#9333ea' :
              artwork.category === 'digital' ? '#00ffff' :
              artwork.category === 'print' ? '#fbbf24' : '#6b46c1'
            }
          />
        </mesh>
      </group>
    </Float>
  );
}

function CentralSymbol() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Sacred Triangle */}
      <mesh ref={meshRef}>
        <ringGeometry args={[1, 1.2, 3]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
      </mesh>

      {/* Inner Circle */}
      <mesh>
        <ringGeometry args={[0.3, 0.5, 32]} />
        <meshBasicMaterial color="#9333ea" transparent opacity={0.6} />
      </mesh>

      {/* 137 Text */}
      <Html center>
        <div className="text-4xl font-bold text-mystic-gold pointer-events-none">
          137
        </div>
      </Html>
    </group>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  const particlesCount = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      // Use deterministic positions based on index
      const angle = (i * 137.5) % 360; // Golden angle
      const radius = (i * 0.7) % 25;
      const height = (i * 0.3) % 10 - 5;

      pos[i * 3] = Math.cos(angle * Math.PI / 180) * radius;
      pos[i * 3 + 1] = Math.sin(angle * Math.PI / 180) * radius;
      pos[i * 3 + 2] = height;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#c084fc"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function EtherealGallery() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showRemixOptions, setShowRemixOptions] = useState(false);

  // Arrange artworks in a cosmic formation
  const getArtworkPosition = (index: number): [number, number, number] => {
    const radius = 6;
    const angle = (index / artworks.length) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.7; // Flatten vertically
    const z = Math.sin(index) * 2; // Depth variation
    return [x, y, z];
  };

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(selectedArtwork?.id === artwork.id ? null : artwork);
    setShowRemixOptions(false);
  };

  const handleRemixClick = () => {
    setShowRemixOptions(true);
  };

  return (
    <section className="relative min-h-screen py-24">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#9333ea" />
            <pointLight position={[-10, -10, 10]} intensity={0.5} color="#fbbf24" />

            {/* Particle Field */}
            <ParticleField />

            {/* Central Sacred Symbol */}
            <CentralSymbol />

            {/* Floating Artworks */}
            {artworks.map((artwork, index) => (
              <FloatingArtwork
                key={artwork.id}
                artwork={artwork}
                position={getArtworkPosition(index)}
                index={index}
                onClick={() => handleArtworkClick(artwork)}
                isSelected={selectedArtwork?.id === artwork.id}
              />
            ))}

            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      {/* Expanded Artwork Details */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96 bg-cosmic-void/95 backdrop-blur-lg rounded-2xl border border-cosmic-aura p-6"
          >
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-cosmic-glow">{selectedArtwork.title}</h3>

              <div className="space-y-2 text-sm">
                <p className="text-cosmic-light">{selectedArtwork.description}</p>
                <div className="grid grid-cols-2 gap-2 text-cosmic-aura">
                  <p>Medium: {selectedArtwork.medium}</p>
                  <p>Size: {selectedArtwork.size}</p>
                  <p>Year: {selectedArtwork.year}</p>
                  <p className="text-mystic-gold font-bold">{selectedArtwork.price}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRemixClick}
                  className="flex-1 py-3 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-bold"
                >
                  Remix This Art
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 border border-cosmic-aura rounded-full text-cosmic-light hover:bg-cosmic-aura/20"
                >
                  Commission
                </motion.button>
              </div>

              <button
                onClick={() => setSelectedArtwork(null)}
                className="absolute top-4 right-4 text-cosmic-light hover:text-cosmic-glow"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remix Options Modal */}
      <AnimatePresence>
        {showRemixOptions && selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-cosmic-void/90 backdrop-blur-lg z-60 flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-cosmic-nebula/50 rounded-2xl border border-cosmic-aura p-8 max-w-2xl w-full"
            >
              <h3 className="text-3xl font-bold text-cosmic-glow mb-6 text-center">
                Remix "{selectedArtwork.title}"
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-cosmic-light mb-2">Your Vision Prompt:</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow placeholder-cosmic-light/50 focus:outline-none focus:border-cosmic-plasma resize-none"
                    placeholder="Describe how you want to transform this artwork... (e.g., 'Make it more cyberpunk with neon colors and digital glitch effects')"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cosmic-light mb-2">Style Intensity:</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="70"
                      className="w-full accent-cosmic-plasma"
                    />
                  </div>
                  <div>
                    <label className="block text-cosmic-light mb-2">Chaos Level:</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="30"
                      className="w-full accent-cosmic-aura"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-4 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-bold text-lg"
                  >
                    Generate Remix ✨
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowRemixOptions(false)}
                    className="px-8 py-4 border border-cosmic-aura rounded-full text-cosmic-light hover:bg-cosmic-aura/20"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-cosmic-light text-sm">
          Click any floating artwork to explore • Drag to orbit
        </p>
      </div>
    </section>
  );
}