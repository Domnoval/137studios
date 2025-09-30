'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SacredGeometryProps {
  mousePosition: { x: number; y: number };
}

export default function SacredGeometry({ mousePosition }: SacredGeometryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;
    let animationId: number;

    const drawSacredPattern = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Golden ratio
      const phi = 1.618033988749;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Mouse influence
      const mouseInfluenceX = (mousePosition.x - centerX) * 0.0001;
      const mouseInfluenceY = (mousePosition.y - centerY) * 0.0001;

      // Metatron's Cube inspired pattern
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.1)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < 13; i++) {
        const angle = (Math.PI * 2 / 13) * i + time * 0.001;
        const radius = 200 * (1 + Math.sin(time * 0.001 + i) * 0.2);

        const x = centerX + Math.cos(angle + mouseInfluenceX) * radius;
        const y = centerY + Math.sin(angle + mouseInfluenceY) * radius;

        // Draw connections
        for (let j = i + 1; j < 13; j++) {
          const angle2 = (Math.PI * 2 / 13) * j + time * 0.001;
          const x2 = centerX + Math.cos(angle2 + mouseInfluenceX) * radius;
          const y2 = centerY + Math.sin(angle2 + mouseInfluenceY) * radius;

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        // Draw circles at vertices
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(147, 51, 234, 0.3)';
        ctx.fill();
      }

      // Flower of Life overlay
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.05)';
      for (let ring = 1; ring <= 7; ring++) {
        for (let i = 0; i < 6 * ring; i++) {
          const angle = (Math.PI * 2 / (6 * ring)) * i;
          const ringRadius = 50 * ring;
          const x = centerX + Math.cos(angle + time * 0.0005) * ringRadius;
          const y = centerY + Math.sin(angle + time * 0.0005) * ringRadius;

          ctx.beginPath();
          ctx.arc(x, y, 30, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      time++;
      animationId = requestAnimationFrame(drawSacredPattern);
    };

    drawSacredPattern();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePosition]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Morphing blob elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cosmic-nebula rounded-full blur-3xl opacity-20 animate-morph"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cosmic-astral rounded-full blur-3xl opacity-20 animate-morph"
        />
      </div>
    </>
  );
}