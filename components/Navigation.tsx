'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import EnhancedArtistAdmin from './EnhancedArtistAdmin';
import MobileMenu from './MobileMenu';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(10, 10, 10, 0)', 'rgba(10, 10, 10, 0.8)']
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Gallery', href: '#gallery' },
    { name: 'Installations', href: '#installations' },
    { name: 'Process', href: '#process' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <motion.nav
      role="navigation"
      aria-label="Main navigation"
      style={{ backgroundColor }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        isScrolled ? 'backdrop-blur-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-cosmic-aura rounded"
            aria-label="137studios home - scroll to top"
          >
            <span className="bg-gradient-to-r from-cosmic-plasma to-mystic-gold bg-clip-text text-transparent">
              137
            </span>
          </motion.button>

          {/* Navigation Items - Desktop */}
          <nav className="hidden md:flex gap-8" role="menubar" aria-label="Desktop navigation menu">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                whileHover={{ scale: 1.05 }}
                className="text-cosmic-light hover:text-cosmic-glow transition-colors focus:outline-none focus:ring-2 focus:ring-cosmic-aura rounded px-2 py-1"
                role="menuitem"
                aria-label={`Navigate to ${item.name} section`}
              >
                {item.name}
              </motion.button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden w-10 h-10 rounded-full bg-cosmic-astral/50 flex flex-col items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-cosmic-aura"
            aria-label="Open mobile navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="w-5 h-0.5 bg-cosmic-glow rounded-full" aria-hidden="true"></span>
            <span className="w-5 h-0.5 bg-cosmic-glow rounded-full" aria-hidden="true"></span>
            <span className="w-5 h-0.5 bg-cosmic-glow rounded-full" aria-hidden="true"></span>
          </motion.button>

          {/* Oracle Button - secure admin access */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Redirect to secure login page
              window.location.href = '/admin/login';
            }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-cosmic-astral to-cosmic-aura flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cosmic-aura"
            aria-label="Access admin portal (Oracle entrance)"
          >
            <span className="text-white text-xl" aria-hidden="true">☉</span>
          </motion.button>
        </div>
      </div>

      {/* Hidden Admin Panel */}
      {showAdmin && <EnhancedArtistAdmin />}

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </motion.nav>
  );
}