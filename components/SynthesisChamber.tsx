'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection } from '@/lib/CollectionContext';

interface SynthesisChamberProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SynthesisChamber({ isOpen, onClose }: SynthesisChamberProps) {
  const { collectedArtworks, clearCollection } = useCollection();
  const [percentages, setPercentages] = useState<Record<number, number>>({});
  const [userPrompt, setUserPrompt] = useState('');
  const [style, setStyle] = useState<'psychedelic' | 'quantum' | 'cosmic' | 'transcendent'>('cosmic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize percentages evenly
  useEffect(() => {
    if (collectedArtworks.length > 0) {
      const evenPercentage = Math.floor(100 / collectedArtworks.length);
      const initial: Record<number, number> = {};
      collectedArtworks.forEach((artwork, index) => {
        if (index === 0) {
          // Give first artwork the remainder
          initial[artwork.id] = 100 - (evenPercentage * (collectedArtworks.length - 1));
        } else {
          initial[artwork.id] = evenPercentage;
        }
      });
      setPercentages(initial);
    }
  }, [collectedArtworks]);

  // Calculate total percentage
  const totalPercentage = Object.values(percentages).reduce((sum, val) => sum + val, 0);

  const handlePercentageChange = (artworkId: number, value: number) => {
    setPercentages(prev => ({ ...prev, [artworkId]: value }));
  };

  const normalizePercentages = () => {
    if (totalPercentage === 0) return;

    const normalized: Record<number, number> = {};
    Object.keys(percentages).forEach(key => {
      const id = parseInt(key);
      normalized[id] = Math.round((percentages[id] / totalPercentage) * 100);
    });

    // Adjust first item to ensure sum is exactly 100
    const sum = Object.values(normalized).reduce((a, b) => a + b, 0);
    if (sum !== 100) {
      const firstId = Object.keys(normalized)[0];
      normalized[parseInt(firstId)] += (100 - sum);
    }

    setPercentages(normalized);
  };

  const handleGenerate = async () => {
    // Normalize percentages to 100%
    normalizePercentages();

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Construct prompt from collected artworks
      const artworkPrompts = collectedArtworks.map(artwork => {
        const percentage = percentages[artwork.id] || 0;
        return `${percentage}% of "${artwork.title}": ${artwork.description}`;
      });

      const fullPrompt = `Create a mystical artwork that synthesizes these pieces:

${artworkPrompts.join('\n')}

Additional vision: ${userPrompt || 'A harmonious blend of cosmic energies'}

Style: ${style} abstract expressionism with sacred geometry and ethereal lighting. High detail, vibrant colors, consciousness art.`;

      console.log('Generating with prompt:', fullPrompt);

      const response = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          artworks: collectedArtworks.map(a => ({
            id: a.id,
            title: a.title,
            description: a.description,
            percentage: percentages[a.id],
          })),
          style,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setGeneratedImage(data.imageUrl);
    } catch (err: any) {
      console.error('Synthesis error:', err);
      setError(err.message || 'Failed to synthesize artwork');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `synthesis-${Date.now()}.png`;
    link.click();
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setUserPrompt('');
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-cosmic-void/95 backdrop-blur-sm z-50 overflow-y-auto"
      >
        <div className="min-h-screen p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <motion.h1
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-4xl md:text-5xl font-bold"
              >
                <span className="bg-gradient-to-r from-cosmic-plasma via-mystic-gold to-cosmic-aura bg-clip-text text-transparent">
                  Synthesis Chamber
                </span>
              </motion.h1>
              <button
                onClick={onClose}
                className="text-cosmic-light hover:text-cosmic-glow text-3xl"
                aria-label="Close synthesis chamber"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Collected Artworks */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-cosmic-glow mb-4">
                  Channeled Pieces ({collectedArtworks.length})
                </h2>

                {collectedArtworks.map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-gradient-to-br from-cosmic-nebula to-cosmic-astral p-4 rounded-lg border border-cosmic-aura"
                  >
                    <div className="flex gap-4 mb-3">
                      <div
                        className="w-20 h-20 rounded-lg flex-shrink-0"
                        style={{
                          backgroundColor: artwork.color,
                          boxShadow: `0 0 20px ${artwork.color}`,
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-cosmic-glow">{artwork.title}</h3>
                        <p className="text-xs text-cosmic-light">{artwork.medium}</p>
                      </div>
                    </div>

                    {/* Percentage slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-cosmic-light">Influence</span>
                        <span className="text-mystic-gold font-mono">{percentages[artwork.id] || 0}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={percentages[artwork.id] || 0}
                        onChange={(e) => handlePercentageChange(artwork.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-cosmic-void rounded-lg appearance-none cursor-pointer accent-cosmic-plasma"
                      />
                    </div>

                    {/* Description (collapsible) */}
                    <details className="mt-3">
                      <summary className="text-xs text-cosmic-light cursor-pointer hover:text-cosmic-glow">
                        View description
                      </summary>
                      <p className="text-xs text-cosmic-light mt-2 leading-relaxed">
                        {artwork.description}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(artwork.description);
                        }}
                        className="text-xs text-mystic-gold hover:underline mt-1"
                      >
                        Copy to clipboard
                      </button>
                    </details>
                  </motion.div>
                ))}

                {/* Total percentage indicator */}
                <div className={`p-3 rounded-lg text-center font-mono ${
                  totalPercentage === 100 ? 'bg-cosmic-astral/50 text-mystic-gold' : 'bg-red-900/30 text-red-400'
                }`}>
                  Total: {totalPercentage}%
                  {totalPercentage !== 100 && (
                    <button
                      onClick={normalizePercentages}
                      className="block w-full mt-2 text-xs underline"
                    >
                      Auto-normalize to 100%
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Center: Preview & Result */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 space-y-6"
              >
                {/* Preview/Result Canvas */}
                <div className="aspect-square bg-gradient-to-br from-cosmic-nebula to-cosmic-astral rounded-2xl border border-cosmic-aura overflow-hidden relative">
                  {generatedImage ? (
                    <img
                      src={generatedImage}
                      alt="Generated synthesis"
                      className="w-full h-full object-cover"
                    />
                  ) : isGenerating ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-20 h-20 mx-auto mb-4"
                        >
                          <div className="w-full h-full border-4 border-cosmic-plasma border-t-transparent rounded-full" />
                        </motion.div>
                        <p className="text-cosmic-light">Channeling cosmic energies...</p>
                        <p className="text-sm text-cosmic-light/60 mt-2">This may take 15-30 seconds</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-cosmic-light">
                        <div className="text-6xl mb-4 opacity-30">✦</div>
                        <p>Your synthesis will appear here</p>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 text-red-200">
                    <p className="font-semibold">Synthesis Error</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                )}

                {/* User prompt */}
                <div>
                  <label className="block text-cosmic-light mb-2">
                    Your Vision <span className="text-sm opacity-60">(optional)</span>
                  </label>
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Add your creative vision... (e.g., 'make it more cyberpunk with neon colors')"
                    rows={3}
                    className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow placeholder-cosmic-light/50 focus:outline-none focus:border-cosmic-plasma resize-none"
                  />
                  <p className="text-xs text-cosmic-light/60 mt-1">
                    {userPrompt.length}/500 characters
                  </p>
                </div>

                {/* Style selector */}
                <div>
                  <label className="block text-cosmic-light mb-2">Synthesis Style</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(['psychedelic', 'quantum', 'cosmic', 'transcendent'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStyle(s)}
                        className={`py-2 px-4 rounded-lg border transition-all ${
                          style === s
                            ? 'bg-cosmic-plasma border-cosmic-plasma text-white'
                            : 'bg-cosmic-void/50 border-cosmic-aura/50 text-cosmic-light hover:border-cosmic-aura'
                        }`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4">
                  {generatedImage ? (
                    <>
                      <button
                        onClick={handleDownload}
                        className="flex-1 py-4 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-bold"
                      >
                        💾 Download
                      </button>
                      <button
                        onClick={handleReset}
                        className="flex-1 py-4 border border-cosmic-aura rounded-full text-cosmic-light hover:bg-cosmic-aura/10"
                      >
                        🔄 Synthesize Again
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || totalPercentage !== 100}
                      className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
                        isGenerating || totalPercentage !== 100
                          ? 'bg-cosmic-void/50 text-cosmic-light/30 cursor-not-allowed'
                          : 'bg-gradient-to-r from-cosmic-plasma via-mystic-gold to-cosmic-aura text-white hover:scale-105'
                      }`}
                    >
                      {isGenerating ? '⚡ Manifesting...' : '✨ Manifest Synthesis'}
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
