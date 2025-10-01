'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import SimpleAdmin from './SimpleAdmin';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [clickCount, setClickCount] = useState(0);
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

  return (
    <motion.nav
      style={{ backgroundColor }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        isScrolled ? 'backdrop-blur-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-2xl font-bold"
          >
            <span className="bg-gradient-to-r from-cosmic-plasma to-mystic-gold bg-clip-text text-transparent">
              137
            </span>
          </motion.div>

          {/* Navigation Items */}
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ scale: 1.05 }}
                className="text-cosmic-light hover:text-cosmic-glow transition-colors"
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* Oracle Button - secret admin trigger */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const newCount = clickCount + 1;
              setClickCount(newCount);
              console.log(`Click ${newCount}/7`);

              if (newCount >= 7) {
                console.log('Opening admin!');
                setShowAdmin(true);
                setClickCount(0);
              }

              // Reset counter after 3 seconds
              setTimeout(() => {
                setClickCount(0);
              }, 3000);
            }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-cosmic-astral to-cosmic-aura flex items-center justify-center"
          >
            <span className="text-white text-xl">☉</span>
          </motion.button>
        </div>
      </div>

      {/* Hidden Admin Panel */}
      {showAdmin && <SimpleAdmin />}
    </motion.nav>
  );
}