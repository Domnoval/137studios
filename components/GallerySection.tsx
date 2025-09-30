'use client';

import { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const Artwork3D = dynamic(() => import('./Artwork3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cosmic-plasma border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const artworks = [
  { id: 1, title: "Cosmic Birth", category: "painting", size: "72x48", medium: "Acrylic on Canvas", year: 2024, price: "$8,888" },
  { id: 2, title: "Digital Ayahuasca", category: "digital", size: "∞x∞", medium: "Generative Algorithm", year: 2024, price: "ETH 1.37" },
  { id: 3, title: "Void Walker", category: "painting", size: "96x72", medium: "Mixed Media", year: 2023, price: "$13,700" },
  { id: 4, title: "Consciousness.exe", category: "installation", size: "Room Scale", medium: "Interactive Projection", year: 2024, price: "Commission" },
  { id: 5, title: "Astral Projection #7", category: "print", size: "36x24", medium: "Archival Print", year: 2024, price: "$777" },
  { id: 6, title: "Sacred Circuitry", category: "digital", size: "Variable", medium: "AI + Human Collaboration", year: 2024, price: "$3,333" },
];

const categories = ["all", "painting", "digital", "print", "installation"];

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filteredArtworks = artworks.filter(
    art => selectedCategory === "all" || art.category === selectedCategory
  );

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

        {/* Category Filter */}
        <div className="flex justify-center gap-4 mb-16 flex-wrap">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cosmic-astral to-cosmic-aura text-white'
                  : 'border border-cosmic-aura text-cosmic-light hover:bg-cosmic-aura hover:bg-opacity-10'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </motion.button>
          ))}
        </div>

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