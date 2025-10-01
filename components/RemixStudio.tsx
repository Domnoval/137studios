'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Sphere, Box, MeshDistortMaterial, Float } from '@react-three/drei';
import html2canvas from 'html2canvas';

interface Artwork {
  id: number;
  title: string;
  baseColor: string;
  energy: number;
}

const sourceArtworks: Artwork[] = [
  { id: 1, title: "Cosmic Birth", baseColor: "#9333ea", energy: 0.8 },
  { id: 2, title: "Digital Ayahuasca", baseColor: "#00ffff", energy: 1.0 },
  { id: 3, title: "Void Walker", baseColor: "#1a0033", energy: 0.3 },
  { id: 4, title: "Sacred Circuitry", baseColor: "#fbbf24", energy: 0.6 },
  { id: 5, title: "Astral Projection", baseColor: "#6b46c1", energy: 0.7 },
  { id: 6, title: "Quantum Dreams", baseColor: "#e9d5ff", energy: 0.9 },
];

export default function RemixStudio() {
  const [selectedArtworks, setSelectedArtworks] = useState<number[]>([]);
  const [blendMode, setBlendMode] = useState<'psychedelic' | 'quantum' | 'cosmic' | 'chaos'>('psychedelic');
  const [intensity, setIntensity] = useState(50);
  const [distortion, setDistortion] = useState(0.5);
  const [rotation, setRotation] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [mysticalProps, setMysticalProps] = useState<any>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const toggleArtwork = (id: number) => {
    setSelectedArtworks(prev =>
      prev.includes(id)
        ? prev.filter(a => a !== id)
        : [...prev, id].slice(-3) // Max 3 artworks
    );
  };

  const generateTitle = () => {
    const prefixes = ['Quantum', 'Cosmic', 'Neural', 'Astral', 'Digital', 'Sacred'];
    const suffixes = ['Dreams', 'Visions', 'Consciousness', 'Portal', 'Dimension', 'Reality'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${prefix} ${suffix} #${Math.floor(Math.random() * 999)}`;
  };

  const handleGenerate = async () => {
    if (selectedArtworks.length < 2) {
      alert('Select at least 2 of my artworks to remix!');
      return;
    }

    setIsGenerating(true);
    const newTitle = generateTitle();
    setGeneratedTitle(newTitle);

    try {
      // Get AI description
      const selectedArtworkData = sourceArtworks.filter(a => selectedArtworks.includes(a.id));
      const response = await fetch('/api/ai-describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artworkTitles: selectedArtworkData.map(a => a.title),
          blendMode,
          intensity
        })
      });

      const aiData = await response.json();
      // Store AI description for display
      setGeneratedDescription(aiData.description);
      setMysticalProps(aiData.mysticalProperties);

    } catch (error) {
      console.error('AI failed:', error);
    }

    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const handleSaveRemix = async () => {
    if (!canvasRef.current) return;

    const canvas = await html2canvas(canvasRef.current);
    const dataUrl = canvas.toDataURL('image/png');

    // Create download link
    const link = document.createElement('a');
    link.download = `remix-${generatedTitle}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleOrderPrint = async () => {
    if (!generatedTitle) {
      alert('Please generate a remix first!');
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artworkId: `remix-${Date.now()}`,
          artworkTitle: generatedTitle,
          remixData: {
            selectedArtworks,
            blendMode,
            intensity,
            distortion,
            rotation
          },
          printSize: 'standard',
        })
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to process order. Please try again.');
    }
  };

  const selectedArtworkData = sourceArtworks.filter(a => selectedArtworks.includes(a.id));
  const blendedColor = selectedArtworkData.length > 0
    ? `#${Math.floor(
        selectedArtworkData.reduce((acc, art) => {
          const color = parseInt(art.baseColor.slice(1), 16);
          return acc + color;
        }, 0) / selectedArtworkData.length
      ).toString(16).padStart(6, '0')}`
    : '#9333ea';

  return (
    <section id="remix" className="relative z-10 min-h-screen py-24 px-8" aria-labelledby="remix-heading">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          id="remix-heading"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-center mb-4"
        >
          <span className="bg-gradient-to-r from-cosmic-plasma via-mystic-gold to-cosmic-aura bg-clip-text text-transparent">
            AI Remix Studio
          </span>
        </motion.h2>
        <p className="text-cosmic-light text-center mb-12">
          Blend artworks • Create new dimensions • Own your vision
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Control Panel */}
          <div className="space-y-8">
            {/* Artwork Selector */}
            <div>
              <h3 className="text-xl font-bold text-cosmic-glow mb-4">Select MY Artworks to Remix</h3>
              <p className="text-cosmic-light text-sm mb-4">Choose from the 137studios collection to create your unique blend</p>
              <div className="grid grid-cols-3 gap-4">
                {sourceArtworks.map(artwork => (
                  <motion.div
                    key={artwork.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleArtwork(artwork.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedArtworks.includes(artwork.id)
                        ? 'bg-gradient-to-br from-cosmic-astral to-cosmic-aura border-2 border-cosmic-plasma'
                        : 'bg-cosmic-void/50 border border-cosmic-astral hover:border-cosmic-aura'
                    }`}
                  >
                    <div
                      className="w-full h-20 rounded mb-2"
                      style={{ backgroundColor: artwork.baseColor }}
                    />
                    {selectedArtworks.includes(artwork.id) && (
                      <div className="absolute inset-0 bg-cosmic-plasma/20 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-lg">✓</span>
                      </div>
                    )}
                    <p className="text-xs text-cosmic-light text-center">{artwork.title}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Blend Controls */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-cosmic-glow">Remix Controls</h3>

              {/* Blend Mode */}
              <div>
                <label className="text-sm text-cosmic-light mb-2 block">AI Mode</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['psychedelic', 'quantum', 'cosmic', 'chaos'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setBlendMode(mode)}
                      className={`px-3 py-2 rounded-full text-sm transition-all ${
                        blendMode === mode
                          ? 'bg-gradient-to-r from-cosmic-plasma to-cosmic-aura text-white'
                          : 'border border-cosmic-aura text-cosmic-light hover:bg-cosmic-aura/20'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity Slider */}
              <div>
                <label className="text-sm text-cosmic-light mb-2 block">
                  Intensity: {intensity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full accent-cosmic-plasma"
                />
              </div>

              {/* Distortion Slider */}
              <div>
                <label className="text-sm text-cosmic-light mb-2 block">
                  Distortion: {(distortion * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={distortion * 100}
                  onChange={(e) => setDistortion(Number(e.target.value) / 100)}
                  className="w-full accent-cosmic-aura"
                />
              </div>

              {/* Rotation */}
              <div>
                <label className="text-sm text-cosmic-light mb-2 block">
                  Dimensional Rotation: {rotation}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full accent-mystic-gold"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={selectedArtworks.length < 2 || isGenerating}
                className="w-full py-4 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-bold disabled:opacity-50"
              >
                {isGenerating ? 'Manifesting...' : 'Generate Remix'}
              </motion.button>

              {generatedTitle && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-cosmic-void/50 rounded-lg border border-cosmic-aura space-y-3">
                    <div>
                      <p className="text-sm text-cosmic-light mb-1">Your Remix:</p>
                      <p className="text-xl font-bold text-cosmic-glow">{generatedTitle}</p>
                    </div>

                    {generatedDescription && (
                      <div>
                        <p className="text-sm text-cosmic-light mb-1">AI Oracle Says:</p>
                        <p className="text-sm text-cosmic-glow italic">{generatedDescription}</p>
                      </div>
                    )}

                    {mysticalProps && (
                      <div className="text-xs text-cosmic-aura space-y-1">
                        <div>🔮 Vibrational Frequency: {mysticalProps.vibrationalFreq}</div>
                        <div>🌌 Dimensional Depth: {mysticalProps.dimensionalDepth}</div>
                        <div>⚡ Sacred Geometry: {mysticalProps.sacredGeometry}</div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleSaveRemix}
                      className="py-3 border border-cosmic-light rounded-full text-cosmic-light hover:bg-cosmic-light/10"
                    >
                      Save Image
                    </button>
                    <button
                      onClick={handleOrderPrint}
                      className="py-3 bg-mystic-gold text-cosmic-void rounded-full font-bold hover:bg-mystic-gold/90"
                    >
                      Order Print $137
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Preview Canvas */}
          <div className="sticky top-24">
            <div
              ref={canvasRef}
              className="aspect-square bg-cosmic-void rounded-lg overflow-hidden border border-cosmic-astral"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={intensity / 100} />

                <Float speed={2} rotationIntensity={intensity / 50}>
                  {blendMode === 'psychedelic' && (
                    <Sphere args={[2, 64, 64]}>
                      <MeshDistortMaterial
                        color={blendedColor}
                        distort={distortion}
                        speed={2}
                        roughness={0.2}
                        metalness={0.8}
                      />
                    </Sphere>
                  )}

                  {blendMode === 'quantum' && (
                    <Box args={[2, 2, 2]}>
                      <MeshDistortMaterial
                        color={blendedColor}
                        distort={distortion * 0.5}
                        speed={3}
                        wireframe
                      />
                    </Box>
                  )}

                  {blendMode === 'cosmic' && (
                    <group>
                      {selectedArtworkData.map((art, i) => (
                        <Sphere key={art.id} args={[1, 32, 32]} position={[i - 1, 0, 0]}>
                          <meshPhysicalMaterial
                            color={art.baseColor}
                            transmission={0.9}
                            thickness={0.5}
                            roughness={0}
                          />
                        </Sphere>
                      ))}
                    </group>
                  )}

                  {blendMode === 'chaos' && (
                    <group>
                      {[...Array(10)].map((_, i) => (
                        <Box key={i} args={[0.5, 0.5, 0.5]} position={[
                          Math.sin(i) * 2,
                          Math.cos(i) * 2,
                          Math.sin(i * 2)
                        ]}>
                          <meshBasicMaterial color={blendedColor} />
                        </Box>
                      ))}
                    </group>
                  )}
                </Float>
              </Canvas>

              {/* Overlay Effects */}
              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-cosmic-void/80"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 border-4 border-cosmic-plasma border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-cosmic-glow">AI is dreaming...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}