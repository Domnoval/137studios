'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const navItems = [
    { name: 'Gallery', href: '#gallery', icon: '🎨' },
    { name: 'Installations', href: '#installations', icon: '🌌' },
    { name: 'Process', href: '#process', icon: '⚡' },
    { name: 'Contact', href: '#contact', icon: '✨' },
  ];

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-cosmic-void/95 backdrop-blur-lg z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="fixed top-0 right-0 w-80 h-full bg-cosmic-nebula/90 backdrop-blur-xl border-l border-cosmic-aura z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold">
                    <span className="bg-gradient-to-r from-cosmic-plasma to-mystic-gold bg-clip-text text-transparent">
                      137
                    </span>
                  </h2>
                  <p className="text-cosmic-light text-sm">Mystical Navigation</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-cosmic-astral/50 flex items-center justify-center text-cosmic-light hover:text-cosmic-glow focus:outline-none focus:ring-2 focus:ring-cosmic-aura"
                  aria-label="Close mobile menu"
                >
                  <span aria-hidden="true">✕</span>
                </motion.button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-4" role="menu" aria-label="Mobile navigation menu">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, x: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavClick(item.href)}
                    className="w-full flex items-center gap-4 p-4 rounded-lg bg-cosmic-void/30 hover:bg-cosmic-astral/30 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-cosmic-aura"
                    role="menuitem"
                    aria-label={`Navigate to ${item.name} section`}
                  >
                    <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                    <div>
                      <p className="text-cosmic-glow font-medium">{item.name}</p>
                      <p className="text-cosmic-light text-xs opacity-70">
                        {item.name === 'Gallery' && 'Explore mystical artworks'}
                        {item.name === 'Installations' && 'Interactive experiences'}
                        {item.name === 'Process' && 'Creative methodology'}
                        {item.name === 'Contact' && 'Connect with the artist'}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 space-y-3" role="group" aria-label="Quick actions">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/register'}
                  className="w-full py-3 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-bold focus:outline-none focus:ring-2 focus:ring-cosmic-aura"
                  aria-label="Join the cosmic community - create account"
                >
                  Join the Cosmos ✨
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/admin/login'}
                  className="w-full py-3 border border-cosmic-aura rounded-full text-cosmic-light hover:bg-cosmic-aura/20 focus:outline-none focus:ring-2 focus:ring-cosmic-aura"
                  aria-label="Access admin portal"
                >
                  🔮 Admin Portal
                </motion.button>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-cosmic-aura/30 text-center">
                <p className="text-cosmic-light text-xs opacity-50">
                  © {new Date().getFullYear()} 137studios
                </p>
                <p className="text-cosmic-aura text-xs mt-1">
                  Where consciousness meets creation
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}