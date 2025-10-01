'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTrance } from '@/lib/TranceContext';

export default function TrancePrompt() {
  const { showTrancePrompt, enableTranceMode, dismissTrancePrompt } = useTrance();

  return (
    <AnimatePresence>
      {showTrancePrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-cosmic-void/80 backdrop-blur-sm"
          onClick={dismissTrancePrompt}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative max-w-md mx-4 p-8 bg-gradient-to-br from-cosmic-nebula to-cosmic-astral border border-cosmic-aura rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-4 right-4 text-mystic-gold opacity-30"
            >
              ✧
            </motion.div>

            <h3 className="text-2xl font-bold text-cosmic-glow mb-4">
              Enter Trance Mode?
            </h3>

            <p className="text-cosmic-light mb-6">
              You've been exploring the liminal spaces. Would you like to go deeper?
            </p>

            <div className="text-sm text-cosmic-light/60 mb-6 space-y-2">
              <p>✦ Custom cursor experience</p>
              <p>✦ Enhanced immersion</p>
              <p>✦ Press <kbd className="px-2 py-1 bg-cosmic-astral rounded text-cosmic-aura">ESC</kbd> anytime to return</p>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={enableTranceMode}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-medium"
              >
                Enter the Trance
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={dismissTrancePrompt}
                className="px-6 py-3 border border-cosmic-aura/50 rounded-full text-cosmic-light hover:bg-cosmic-aura/10"
              >
                Not Yet
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
