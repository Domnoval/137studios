'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import MagneticButton from './MagneticButton';
import { navigateToSection } from '@/lib/useViewTransition';

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center" aria-label="Hero - Welcome to 137 Studios">
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 text-center px-8"
      >
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-bold mb-8"
        >
          <span className="bg-gradient-to-r from-cosmic-plasma via-cosmic-aura to-mystic-gold bg-clip-text text-transparent">
            137
          </span>
          <span className="text-cosmic-glow block text-3xl md:text-4xl mt-4 font-light">
            STUDIOS
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg md:text-xl text-cosmic-light max-w-2xl mx-auto mb-12"
        >
          Where consciousness meets canvas. Exploring the liminal spaces between
          the seen and unseen through abstract expressionism, digital alchemy, and interactive installations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <MagneticButton
            onClick={() => navigateToSection('#gallery')}
            className="px-8 py-4 bg-gradient-to-r from-cosmic-astral to-cosmic-aura rounded-full text-white font-medium"
            glowColor="rgba(147, 51, 234, 0.5)"
            ariaLabel="Scroll to gallery section"
          >
            Enter the Gallery
          </MagneticButton>

          <MagneticButton
            onClick={() => {
              const contact = document.querySelector('#contact');
              if (contact) {
                navigateToSection('#contact');
              } else {
                // Fallback to mailto if contact section doesn't exist
                window.location.href = 'mailto:contact@137studios.com?subject=Commission Inquiry';
              }
            }}
            className="px-8 py-4 border border-cosmic-aura rounded-full text-cosmic-light hover:bg-cosmic-aura hover:bg-opacity-10"
            glowColor="rgba(107, 70, 193, 0.5)"
            ariaLabel="Navigate to commission inquiry"
          >
            Commission Work
          </MagneticButton>
        </motion.div>

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none animate-spin-slow"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full opacity-10">
            <path
              d="M 100, 10 L 190, 60 L 160, 160 L 40, 160 L 10, 60 Z"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-mystic-gold"
            />
            <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.3" fill="none" className="text-cosmic-plasma" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.3" fill="none" className="text-cosmic-aura" />
            <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="0.3" fill="none" className="text-cosmic-light" />
          </svg>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-cosmic-light text-sm"
        >
          <div className="w-6 h-10 border border-cosmic-aura rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cosmic-aura rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}