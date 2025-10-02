'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { Text, OrbitControls } from '@react-three/drei';
import type { Mesh } from 'three';
import { TextureLoader } from 'three';
import { useCollection, type Artwork } from '@/lib/CollectionContext';
import { getArtworks } from '@/lib/artworkData';
import {
  CHANNELING_GOLD,
  COSMIC_PURPLE,
  ASTRAL_PINK,
  GALLERY_RADIUS,
  FLOATING_AMPLITUDE,
  ROTATION_SPEED,
} from '@/lib/theme';

function FloatingArtwork({ artwork, position, index, onClick, isSelected, isChanneled }: {
  artwork: Artwork;
  position: [number, number, number];
  index: number;
  onClick: () => void;
  isSelected: boolean;
  isChanneled: boolean;
}) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Load texture - using non-null assertion since all artworks in gallery have images
  const texture = useLoader(TextureLoader, artwork.imageUrl!);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation with theme constant
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * FLOATING_AMPLITUDE;
      // Gentle rotation with theme constant
      meshRef.current.rotation.y += ROTATION_SPEED;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2, 2.5, 0.1]} />
        <meshStandardMaterial
          map={texture}
          color={isChanneled ? CHANNELING_GOLD : "#ffffff"}
          emissive={isChanneled ? CHANNELING_GOLD : artwork.color}
          emissiveIntensity={hovered || isSelected ? 0.3 : isChanneled ? 0.2 : 0.1}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Title text above artwork */}
      <Text
        position={[0, 1.5, 0.1]}
        fontSize={0.2}
        color={ASTRAL_PINK}
        anchorX="center"
        anchorY="middle"
      >
        {artwork.title}
      </Text>

      {/* Channel indicator - Golden ring */}
      {isChanneled && (
        <mesh position={[0, 0, 0.2]}>
          <torusGeometry args={[1.2, 0.05, 16, 100]} />
          <meshBasicMaterial color={CHANNELING_GOLD} />
        </mesh>
      )}
    </group>
  );
}

interface NewGalleryProps {
  onArtworkSelect?: (artwork: Artwork) => void;
}

export default function NewGallery({ onArtworkSelect }: NewGalleryProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const { channelArtwork, isChanneled } = useCollection();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Load artworks on mount
  useEffect(() => {
    getArtworks().then((data) => {
      setArtworks(data);
      setLoading(false);
    });
  }, []);

  // Keyboard navigation for accessibility
  useEffect(() => {
    if (!selectedArtwork || artworks.length === 0) return;

    const handleKeyboard = (e: KeyboardEvent) => {
      const currentIndex = artworks.findIndex(a => a.id === selectedArtwork?.id);

      if (e.key === 'ArrowRight') {
        // Next artwork
        const nextIndex = (currentIndex + 1) % artworks.length;
        setSelectedArtwork(artworks[nextIndex]);
      } else if (e.key === 'ArrowLeft') {
        // Previous artwork
        const prevIndex = (currentIndex - 1 + artworks.length) % artworks.length;
        setSelectedArtwork(artworks[prevIndex]);
      } else if (e.key === 'Escape') {
        // Close details panel
        setSelectedArtwork(null);
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [selectedArtwork, artworks]);

  // Auto-focus close button when panel opens (accessibility)
  useEffect(() => {
    if (selectedArtwork && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [selectedArtwork]);

  // Arrange artworks in a circle with vertical wave and depth variation
  const getArtworkPosition = (index: number): [number, number, number] => {
    const angle = (index / artworks.length) * Math.PI * 2;
    const x = Math.cos(angle) * GALLERY_RADIUS;
    const y = Math.sin(angle) * GALLERY_RADIUS * 0.5; // Vertical compression for ellipse effect
    const z = Math.sin(index) * 2; // Depth variation
    return [x, y, z];
  };

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    onArtworkSelect?.(artwork);
  };

  const handleChannelArtwork = () => {
    if (selectedArtwork) {
      channelArtwork(selectedArtwork);
      // Optional: close details after channeling
      // setSelectedArtwork(null);
    }
  };

  return (
    <section id="gallery" className="relative min-h-screen py-24" aria-label="Ethereal Gallery - Interactive 3D artwork collection">
      <div className="absolute inset-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin text-6xl mb-4">✦</div>
              <p className="text-cosmic-light">Loading gallery...</p>
            </div>
          </div>
        ) : (
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin text-6xl mb-4">✦</div>
                <p className="text-cosmic-light">Initializing 3D space...</p>
              </div>
            </div>
          }>
            <Canvas
              camera={{ position: [0, 0, 15], fov: 75 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.4} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} color={COSMIC_PURPLE} />
              <pointLight position={[-5, -5, -5]} intensity={0.5} color={CHANNELING_GOLD} />

              {/* OrbitControls - drag to rotate, auto-rotates when no artwork selected */}
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={!selectedArtwork}
                autoRotateSpeed={0.3}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 2.5}
              />

              {artworks.map((artwork, index) => (
                <Suspense key={artwork.id} fallback={null}>
                  <FloatingArtwork
                    artwork={artwork}
                    position={getArtworkPosition(index)}
                    index={index}
                    onClick={() => handleArtworkClick(artwork)}
                    isSelected={selectedArtwork?.id === artwork.id}
                    isChanneled={isChanneled(artwork.id)}
                  />
                </Suspense>
              ))}

              <fog attach="fog" args={['#0a0a0a', 10, 30]} />
            </Canvas>
          </Suspense>
        )}
      </div>

      {/* Artwork Details Panel */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 bottom-0 w-full md:max-w-md bg-gradient-to-br from-cosmic-nebula/95 to-cosmic-astral/95 backdrop-blur-md border-l border-cosmic-aura z-30 overflow-y-auto"
          >
            <div className="p-8">
              {/* Close button - auto-focused for accessibility */}
              <button
                ref={closeButtonRef}
                onClick={() => setSelectedArtwork(null)}
                className="absolute top-4 right-4 text-cosmic-light hover:text-cosmic-glow text-2xl focus:outline-none focus:ring-2 focus:ring-cosmic-aura rounded"
                aria-label="Close details (press Escape)"
              >
                ✕
              </button>

              {/* Artwork preview */}
              <div
                className="w-full h-64 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative"
                style={{
                  backgroundColor: selectedArtwork.color,
                  boxShadow: `0 0 40px ${selectedArtwork.color}`,
                }}
              >
                {selectedArtwork.imageUrl ? (
                  <img
                    src={selectedArtwork.imageUrl}
                    alt={selectedArtwork.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-6xl opacity-50">✦</div>
                )}
              </div>

              {/* Details */}
              <h2 className="text-3xl font-bold text-cosmic-glow mb-2">
                {selectedArtwork.title}
              </h2>

              <div className="text-sm text-cosmic-light mb-4 space-y-1">
                <p>{selectedArtwork.medium}</p>
                <p>{selectedArtwork.size} • {selectedArtwork.year}</p>
                <p className="text-mystic-gold font-semibold">{selectedArtwork.price}</p>
              </div>

              <p className="text-cosmic-light mb-6 leading-relaxed">
                {selectedArtwork.description}
              </p>

              {/* Channel button */}
              {isChanneled(selectedArtwork.id) ? (
                <div className="flex items-center gap-2 text-mystic-gold">
                  <span className="text-2xl">✨</span>
                  <span className="font-semibold">Channeled to your collection</span>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleChannelArtwork}
                  className="w-full py-4 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-bold text-lg"
                >
                  ✨ Channel This Piece
                </motion.button>
              )}

              {/* Additional actions */}
              <div className="mt-4 flex gap-2">
                <button className="flex-1 py-2 border border-cosmic-aura/50 rounded-full text-cosmic-light text-sm hover:bg-cosmic-aura/10 transition-colors">
                  View Full Size
                </button>
                <button className="flex-1 py-2 border border-cosmic-aura/50 rounded-full text-cosmic-light text-sm hover:bg-cosmic-aura/10 transition-colors">
                  Order Print
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions overlay */}
      {!loading && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-cosmic-light text-sm"
          >
            Click artworks to explore • Drag to rotate • Arrow keys to navigate
          </motion.p>
        </div>
      )}
    </section>
  );
}
