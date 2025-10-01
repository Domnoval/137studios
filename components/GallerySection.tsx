'use client';

import { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import ArtworkSearch from './ArtworkSearch';

const Artwork3D = dynamic(() => import('./Artwork3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cosmic-plasma border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const artworks = [
  {
    id: 1,
    title: "Cosmic Birth",
    category: "painting" as const,
    size: "72x48",
    medium: "Acrylic on Canvas",
    year: 2024,
    price: "$8,888",
    description: "The universe's first breath, captured in swirling nebulas of consciousness.",
    color: "#9333ea",
    tags: ["nebula", "cosmic", "consciousness", "birth", "universe"]
  },
  {
    id: 2,
    title: "Digital Ayahuasca",
    category: "digital" as const,
    size: "∞x∞",
    medium: "Generative Algorithm",
    year: 2024,
    price: "ETH 1.37",
    description: "Machine dreams meet plant wisdom in this algorithmic vision quest.",
    color: "#00ffff",
    tags: ["ayahuasca", "digital", "psychedelic", "algorithm", "vision", "shamanic"]
  },
  {
    id: 3,
    title: "Void Walker",
    category: "painting" as const,
    size: "96x72",
    medium: "Mixed Media",
    year: 2023,
    price: "$13,700",
    description: "A figure traversing the spaces between realities, neither here nor there.",
    color: "#1a0033",
    tags: ["void", "liminal", "reality", "space", "figure", "traversal"]
  },
  {
    id: 4,
    title: "Consciousness.exe",
    category: "installation" as const,
    size: "Room Scale",
    medium: "Interactive Projection",
    year: 2024,
    price: "Commission",
    description: "Self-aware code that responds to your thoughts and emotions.",
    color: "#fbbf24",
    tags: ["interactive", "consciousness", "code", "projection", "responsive", "AI"]
  },
  {
    id: 5,
    title: "Astral Projection #7",
    category: "print" as const,
    size: "36x24",
    medium: "Archival Print",
    year: 2024,
    price: "$777",
    description: "The seventh attempt at leaving the body, documented in light.",
    color: "#6b46c1",
    tags: ["astral", "projection", "light", "body", "spiritual", "documentation"]
  },
  {
    id: 6,
    title: "Sacred Circuitry",
    category: "digital" as const,
    size: "Variable",
    medium: "AI + Human Collaboration",
    year: 2024,
    price: "$3,333",
    description: "Where ancient symbols meet quantum computing.",
    color: "#e9d5ff",
    tags: ["sacred", "technology", "symbols", "quantum", "collaboration", "ancient"]
  },
];

const categories = ["all", "painting", "digital", "print", "installation"];

export default function GallerySection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [filteredArtworks, setFilteredArtworks] = useState(artworks);

  const handleFilter = (filtered: any[]) => {
    setFilteredArtworks(filtered);
  };

  return (
    <section className="relative z-10 py-24 px-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-5xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-cosmic-plasma to-mystic-gold bg-clip-text text-transparent">
            The Collection
          </span>
        </h2>
        <p className="text-cosmic-light text-center mb-12">Each piece is a portal</p>

        {/* Advanced Search and Filtering */}
        <ArtworkSearch artworks={artworks} onFilter={handleFilter} />

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredArtworks.map((artwork) => (
              <motion.div
                key={artwork.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setHoveredId(artwork.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative group cursor-pointer"
              >
                <div className="aspect-[4/5] bg-gradient-to-br from-cosmic-nebula to-cosmic-astral rounded-lg overflow-hidden">
                  {/* 3D Artwork */}
                  <div className="w-full h-full">
                    <Artwork3D type={artwork.category as 'painting' | 'digital' | 'print' | 'installation'} />
                  </div>

                  {/* Hover Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredId === artwork.id ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-cosmic-void via-cosmic-void/50 to-transparent flex flex-col justify-end p-6"
                  >
                    <h3 className="text-2xl font-bold text-cosmic-glow mb-2">{artwork.title}</h3>
                    <p className="text-cosmic-light text-sm mb-1">{artwork.medium}</p>
                    <p className="text-cosmic-light text-sm mb-1">{artwork.size}</p>
                    <p className="text-mystic-gold font-bold">{artwork.price}</p>
                  </motion.div>
                </div>

                {/* Mystical glow effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === artwork.id ? 1 : 0 }}
                  className="absolute -inset-1 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-lg blur-xl -z-10"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}