'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SimpleAdmin() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-cosmic-void/95 backdrop-blur-lg z-50 flex items-center justify-center"
    >
      <div className="bg-cosmic-nebula/50 p-8 rounded-2xl border border-cosmic-aura max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-cosmic-glow mb-4 text-center">
          🎨 Artist Portal
        </h2>
        <p className="text-cosmic-light mb-6 text-center">
          Admin panel is working! Here you can upload your artwork.
        </p>

        <div className="space-y-4">
          <input
            type="file"
            multiple
            accept="image/*"
            className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow"
          />

          <input
            type="text"
            placeholder="Artwork Title"
            className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow placeholder-cosmic-light/50"
          />

          <textarea
            placeholder="Description..."
            rows={3}
            className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow placeholder-cosmic-light/50 resize-none"
          />

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-bold"
            >
              Upload Art ✨
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 border border-cosmic-aura rounded-full text-cosmic-light"
            >
              Close
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}