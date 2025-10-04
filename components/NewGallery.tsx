'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCollection, type Artwork } from '@/lib/CollectionContext';
import { getArtworks } from '@/lib/artworkData';
import InfiniteGallery from '@/components/InfiniteGallery';

interface NewGalleryProps {
  onArtworkSelect?: (artwork: Artwork) => void;
}

export default function NewGallery({ onArtworkSelect }: NewGalleryProps) {
  const router = useRouter();
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

  const handleChannelArtwork = () => {
    if (selectedArtwork) {
      channelArtwork(selectedArtwork);
      // Optional: close details after channeling
      // setSelectedArtwork(null);
    }
  };

  // Extract image URLs from artworks (only artworks with images)
  const displayedArtworks = artworks.filter(artwork => artwork.imageUrl);
  const galleryImages = displayedArtworks.map(artwork => ({
    src: artwork.imageUrl!,
    alt: artwork.title
  }));

  // Handle artwork click from gallery
  const handleArtworkClick = (imageIndex: number) => {
    const artwork = displayedArtworks[imageIndex];
    if (artwork && artwork.slug) {
      // Navigate to expanded artwork view
      router.push(`/art/${artwork.slug}`);
      if (onArtworkSelect) {
        onArtworkSelect(artwork);
      }
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
          <InfiniteGallery
            images={galleryImages}
            className="h-full w-full"
            speed={0.8}
            visibleCount={12}
            fadeSettings={{
              fadeIn: { start: 0.05, end: 0.25 },
              fadeOut: { start: 0.4, end: 0.43 },
            }}
            blurSettings={{
              blurIn: { start: 0.0, end: 0.1 },
              blurOut: { start: 0.4, end: 0.43 },
              maxBlur: 8.0,
            }}
            onImageClick={handleArtworkClick}
          />
        )}
      </div>

      {/* Artwork Details Panel - ENHANCED */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 bottom-0 w-full md:max-w-2xl bg-gradient-to-br from-cosmic-nebula/95 to-cosmic-astral/95 backdrop-blur-md border-l border-cosmic-aura z-30 overflow-y-auto"
          >
            <div className="p-6 md:p-10">
              {/* Close button - auto-focused for accessibility */}
              <button
                ref={closeButtonRef}
                onClick={() => setSelectedArtwork(null)}
                className="absolute top-6 right-6 text-cosmic-light hover:text-cosmic-glow text-2xl focus:outline-none focus:ring-2 focus:ring-cosmic-aura z-10 bg-cosmic-void/50 w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-sm"
                aria-label="Close details (press Escape)"
              >
                ✕
              </button>

              {/* Artwork preview - BIGGER, CENTERED, FULL DISPLAY */}
              <div
                className="w-full aspect-square rounded-xl mb-8 flex items-center justify-center overflow-hidden relative"
                style={{
                  backgroundColor: selectedArtwork.color,
                  boxShadow: `0 0 80px ${selectedArtwork.color}40`,
                }}
              >
                {selectedArtwork.imageUrl ? (
                  <Image
                    src={selectedArtwork.imageUrl}
                    alt={selectedArtwork.title}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 700px"
                    priority
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
            Scroll or use arrow keys to navigate • Click artwork to view details
          </motion.p>
        </div>
      )}
    </section>
  );
}
