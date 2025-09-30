'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SacredGeometry from '@/components/SacredGeometry';
import HeroSection from '@/components/HeroSection';
import GallerySection from '@/components/GallerySection';
import InstallationSection from '@/components/InstallationSection';
import Navigation from '@/components/Navigation';
import CursorTrail from '@/components/CursorTrail';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0.3]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-cosmic-void text-cosmic-glow overflow-x-hidden">
      <CursorTrail />

      {/* Sacred Geometry Background */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{ y: backgroundY, opacity }}
      >
        <SacredGeometry mousePosition={mousePosition} />
      </motion.div>

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Gallery */}
      <GallerySection />

      {/* Interactive Installations */}
      <InstallationSection />

      {/* Oracle Footer */}
      <footer className="relative z-10 py-24 text-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="inline-block cursor-pointer"
        >
          <p className="text-cosmic-aura font-mono">✧ 137 ✧</p>
          <p className="text-xs text-cosmic-light opacity-50">The fine structure constant speaks</p>
        </motion.div>
      </footer>
    </div>
  );
}