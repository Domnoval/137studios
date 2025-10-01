'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SacredGeometry from '@/components/SacredGeometry';
import HeroSection from '@/components/HeroSection';
import NewGallery from '@/components/NewGallery';
import Navigation from '@/components/Navigation';
import CursorTrail from '@/components/CursorTrail';
import CosmicHub from '@/components/CosmicHub';
import SynthesisChamber from '@/components/SynthesisChamber';
import AIOracle from '@/components/AIOracle';
import TrancePrompt from '@/components/TrancePrompt';
import { useTrance } from '@/lib/TranceContext';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);
  const [isSynthesisOpen, setIsSynthesisOpen] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const { isTranceMode, enableTranceMode, disableTranceMode } = useTrance();

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0.3]);

  useEffect(() => {
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame to throttle updates
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Clear existing timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    // Check if 7 clicks reached
    if (newCount === 7) {
      // Redirect to admin login
      window.location.href = '/admin/login';
      setClickCount(0);
    } else {
      // Reset counter after 3 seconds of no clicks
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 3000);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-cosmic-void text-cosmic-glow overflow-x-hidden">
      <CursorTrail />
      <AIOracle />
      <TrancePrompt />

      {/* Sacred Geometry Background */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{ y: backgroundY, opacity }}
      >
        <SacredGeometry mousePosition={mousePosition} />
      </motion.div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* New Gallery with Collection */}
        <NewGallery />
      </main>

      {/* Cosmic Hub - Floating Collection */}
      <CosmicHub onOpenSynthesis={() => setIsSynthesisOpen(true)} />

      {/* Synthesis Chamber - AI Remix Studio */}
      <SynthesisChamber
        isOpen={isSynthesisOpen}
        onClose={() => setIsSynthesisOpen(false)}
      />

      {/* Oracle Footer */}
      <footer className="relative z-10 py-24 text-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          onClick={handleSecretClick}
          className="inline-block cursor-pointer mb-8"
        >
          <p className="text-cosmic-aura font-mono">✧ 137 ✧</p>
          <p className="text-xs text-cosmic-light opacity-50">The fine structure constant speaks</p>
          {clickCount > 0 && (
            <motion.p
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs text-cosmic-plasma mt-2"
            >
              {clickCount}/7
            </motion.p>
          )}
        </motion.div>

        {/* Trance Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => isTranceMode ? disableTranceMode() : enableTranceMode()}
          className="mb-8 px-6 py-3 border border-cosmic-aura/50 rounded-full text-sm text-cosmic-light hover:bg-cosmic-aura/10 transition-colors"
          aria-label={isTranceMode ? "Exit trance mode" : "Enter trance mode"}
        >
          {isTranceMode ? '🌙 Exit Trance Mode' : '✨ Enter Trance Mode'}
        </motion.button>

        {/* Legal Links */}
        <div className="flex justify-center gap-8 text-sm text-cosmic-light">
          <a href="/privacy" className="hover:text-cosmic-aura transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-cosmic-aura transition-colors">
            Terms of Service
          </a>
          <span className="text-cosmic-light/30">
            © {new Date().getFullYear()} 137studios
          </span>
        </div>
      </footer>
    </div>
  );
}