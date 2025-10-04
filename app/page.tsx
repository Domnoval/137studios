'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import SacredGeometry from '@/components/SacredGeometry';
import HeroSection from '@/components/HeroSection';
import NewGallery from '@/components/NewGallery';
import Navigation from '@/components/Navigation';
// Removed CursorTrail for better UX
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
      <AIOracle />
      <TrancePrompt />

      {/* Cosmic Grid Background Image - VISIBLE */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/cosmic-grid-bg.jpg"
          alt="Cosmic perspective grid background"
          fill
          className="object-cover opacity-40"
          quality={85}
          priority
        />
      </div>

      {/* Sacred Geometry Background */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ y: backgroundY, opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.2, 0.1]) }}
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

        {/* Installations Section */}
        <section id="installations" className="relative min-h-screen py-24 px-8">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-bold text-center mb-16 bg-gradient-to-r from-cosmic-plasma via-cosmic-aura to-mystic-gold bg-clip-text text-transparent"
            >
              Immersive Installations
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center max-w-3xl mx-auto"
            >
              <p className="text-cosmic-light text-lg mb-8 leading-relaxed">
                Transform spaces into portals of consciousness. Our installations merge digital art with physical environments, creating multidimensional experiences that dissolve the boundaries between observer and observed.
              </p>
              <p className="text-cosmic-light/70 text-base">
                From intimate gallery spaces to large-scale public works, each installation is custom-designed to channel the unique energy of its environment. Combining projection mapping, interactive sensors, and generative AI, these living artworks evolve with their audience.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-12 px-8 py-4 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-bold text-lg"
                onClick={() => {
                  const contactSection = document.querySelector('#contact');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Commission an Installation
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="relative min-h-screen py-24 px-8">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-bold text-center mb-16 bg-gradient-to-r from-cosmic-plasma via-cosmic-aura to-mystic-gold bg-clip-text text-transparent"
            >
              The Creative Process
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Channel",
                  icon: "✨",
                  description: "Tuning into frequencies beyond the visible spectrum, each piece begins as pure energy waiting to be translated into form."
                },
                {
                  title: "Synthesize",
                  icon: "🌀",
                  description: "AI and human consciousness collaborate, merging technical precision with intuitive flow to birth new visual realities."
                },
                {
                  title: "Manifest",
                  icon: "🎨",
                  description: "Digital creation meets physical form through prints, installations, and immersive experiences that transcend traditional art."
                }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="text-center p-8 rounded-lg bg-cosmic-astral/30 backdrop-blur-sm border border-cosmic-aura/20"
                >
                  <div className="text-6xl mb-4">{step.icon}</div>
                  <h3 className="text-2xl font-bold text-cosmic-glow mb-4">{step.title}</h3>
                  <p className="text-cosmic-light/80 leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="relative min-h-screen py-24 px-8 flex items-center justify-center">
          <div className="max-w-2xl mx-auto w-full">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-bold text-center mb-16 bg-gradient-to-r from-cosmic-plasma via-cosmic-aura to-mystic-gold bg-clip-text text-transparent"
            >
              Connect
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-cosmic-astral/30 backdrop-blur-sm border border-cosmic-aura/20 rounded-2xl p-8"
            >
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-cosmic-light mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 bg-cosmic-void/50 border border-cosmic-aura/30 rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-cosmic-light mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-cosmic-void/50 border border-cosmic-aura/30 rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-cosmic-light mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-3 bg-cosmic-void/50 border border-cosmic-aura/30 rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma transition-colors resize-none"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-bold text-lg"
                >
                  Send Message
                </motion.button>
              </form>
              <div className="mt-8 pt-8 border-t border-cosmic-aura/20 text-center">
                <p className="text-cosmic-light mb-4">Or reach out directly:</p>
                <a href="mailto:contact@137studios.com" className="text-cosmic-plasma hover:text-cosmic-glow transition-colors">
                  contact@137studios.com
                </a>
              </div>
            </motion.div>
          </div>
        </section>
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