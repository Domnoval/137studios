'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const installations = [
  {
    title: "Sensor Paintings",
    description: "Paintings that evolve based on viewer proximity, heartbeat, and environmental data. Each interaction creates a unique visual experience.",
    tech: "Arduino, Pressure Sensors, Reactive LEDs",
  },
  {
    title: "Digital Consciousness",
    description: "AI-powered installations that respond to collective audience emotion, creating evolving abstract landscapes.",
    tech: "Machine Learning, Emotion Recognition, Projection Mapping",
  },
  {
    title: "Quantum Canvas",
    description: "Large-scale acrylic prints that shift between dimensions using lenticular technology and embedded electronics.",
    tech: "Lenticular Printing, Embedded Systems, Holographic Film",
  },
];

export default function InstallationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ['-100%', '100%']);

  return (
    <section ref={containerRef} className="relative z-10 py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl font-bold text-center mb-4"
        >
          <span className="bg-gradient-to-r from-cosmic-aura to-cosmic-plasma bg-clip-text text-transparent">
            Interactive Installations
          </span>
        </motion.h2>
        <p className="text-cosmic-light text-center mb-16">Where art becomes alive</p>

        <div className="space-y-24">
          {installations.map((installation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className={`flex flex-col lg:flex-row gap-8 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Content */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-3xl font-bold text-cosmic-glow">
                    {installation.title}
                  </h3>
                  <p className="text-cosmic-light text-lg leading-relaxed">
                    {installation.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-mystic-gold">✦</span>
                    <p className="text-sm text-cosmic-aura font-mono">
                      {installation.tech}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 border border-cosmic-plasma text-cosmic-light rounded-full hover:bg-cosmic-plasma hover:bg-opacity-20 transition-all"
                  >
                    View Documentation
                  </motion.button>
                </div>

                {/* Visual Placeholder */}
                <div className="flex-1">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative aspect-video bg-gradient-to-br from-cosmic-nebula to-cosmic-void rounded-lg overflow-hidden"
                  >
                    {/* Animated particles */}
                    <div className="absolute inset-0">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            x: [0, Math.random() * 200 - 100],
                            y: [0, Math.random() * 200 - 100],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                          }}
                          className="absolute w-1 h-1 bg-cosmic-light rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="text-6xl opacity-30"
                      >
                        {index === 0 && "👁️"}
                        {index === 1 && "🧠"}
                        {index === 2 && "✨"}
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Decorative element */}
              <motion.div
                style={{ x }}
                className="absolute -bottom-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cosmic-aura to-transparent opacity-30"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}