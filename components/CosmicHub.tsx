'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection } from '@/lib/CollectionContext';

interface CosmicHubProps {
  onOpenSynthesis: () => void;
}

export default function CosmicHub({ onOpenSynthesis }: CosmicHubProps) {
  const { collectedArtworks, canSynthesize, unchannelArtwork } = useCollection();
  const [isExpanded, setIsExpanded] = useState(false);

  if (collectedArtworks.length === 0) return null;

  return (
    <>
      {/* Cosmic Hub Button - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cosmic-astral to-cosmic-plasma border-2 border-cosmic-aura flex items-center justify-center cursor-pointer"
          aria-label={`Cosmic collection: ${collectedArtworks.length} pieces`}
        >
          {/* Pulsing glow when ready to synthesize */}
          {canSynthesize && (
            <motion.div
              className="absolute inset-0 rounded-full bg-mystic-gold opacity-50 blur-xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {/* Constellation visualization */}
          <div className="relative z-10">
            {collectedArtworks.slice(0, 5).map((artwork, index) => {
              const angle = (index / collectedArtworks.length) * Math.PI * 2;
              const x = Math.cos(angle) * 15;
              const y = Math.sin(angle) * 15;

              return (
                <motion.div
                  key={artwork.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    backgroundColor: artwork.color,
                    boxShadow: `0 0 8px ${artwork.color}`,
                  }}
                />
              );
            })}

            {/* Center count */}
            <div className="text-cosmic-glow font-bold text-lg">
              {collectedArtworks.length}
            </div>
          </div>

          {/* Rotating ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-cosmic-aura"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </motion.button>

        {/* Tooltip */}
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-cosmic-nebula/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-cosmic-aura whitespace-nowrap"
          >
            <p className="text-sm text-cosmic-light">
              {canSynthesize ? '✨ Ready to Synthesize' : `${collectedArtworks.length} piece${collectedArtworks.length > 1 ? 's' : ''} collected`}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Expanded View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-cosmic-void/80 backdrop-blur-sm z-40 flex items-center justify-center"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-cosmic-nebula to-cosmic-astral p-8 rounded-2xl border border-cosmic-aura max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-cosmic-glow">
                  Your Cosmic Collection
                </h2>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-cosmic-light hover:text-cosmic-glow text-2xl"
                  aria-label="Close collection"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {collectedArtworks.map((artwork) => (
                  <motion.div
                    key={artwork.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-4 p-4 bg-cosmic-void/50 rounded-lg border border-cosmic-aura/50"
                  >
                    <div
                      className="w-16 h-16 rounded-lg flex-shrink-0"
                      style={{
                        backgroundColor: artwork.color,
                        boxShadow: `0 0 20px ${artwork.color}`,
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-cosmic-glow">
                        {artwork.title}
                      </h3>
                      <p className="text-sm text-cosmic-light">
                        {artwork.medium} • {artwork.year}
                      </p>
                    </div>
                    <button
                      onClick={() => unchannelArtwork(artwork.id)}
                      className="text-cosmic-light hover:text-red-400 transition-colors"
                      aria-label={`Remove ${artwork.title} from collection`}
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </div>

              {canSynthesize ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsExpanded(false);
                    onOpenSynthesis();
                  }}
                  className="w-full py-4 bg-gradient-to-r from-cosmic-plasma to-mystic-gold rounded-full text-white font-bold text-lg"
                >
                  ✨ Enter Synthesis Chamber
                </motion.button>
              ) : (
                <div className="text-center text-cosmic-light">
                  <p className="text-sm">Collect at least 2 pieces to synthesize</p>
                  <p className="text-xs opacity-60 mt-1">
                    ({2 - collectedArtworks.length} more needed)
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
