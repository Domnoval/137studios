'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { TransformState, OverlayType } from '@/types/artwork';

interface ArtworkStageProps {
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
    blurDataURL?: string;
  };
  overlay?: OverlayType;
  onTransformChange?: (transform: TransformState) => void;
}

export default function ArtworkStage({
  image,
  overlay = 'none',
  onTransformChange,
}: ArtworkStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });

  // Smooth spring animations
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const scaleMotion = useSpring(useMotionValue(1), { stiffness: 300, damping: 30 });

  // Calculate fit scale - MORE CONSERVATIVE
  const getFitScale = useCallback(() => {
    if (!containerRef.current) return 0.5;
    const container = containerRef.current.getBoundingClientRect();
    const scaleX = (container.width * 0.7) / image.width;
    const scaleY = (container.height * 0.7) / image.height;
    return Math.min(scaleX, scaleY, 0.8);
  }, [image.width, image.height]);

  // Calculate fill scale
  const getFillScale = useCallback(() => {
    if (!containerRef.current) return 1;
    const container = containerRef.current.getBoundingClientRect();
    const scaleX = container.width / image.width;
    const scaleY = container.height / image.height;
    return Math.max(scaleX, scaleY);
  }, [image.width, image.height]);

  // Update container size on mount/resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Initialize to fit
  useEffect(() => {
    const fitScale = getFitScale();
    setScale(fitScale);
    scaleMotion.set(fitScale);
    setPosition({ x: 0, y: 0 });
    x.set(0);
    y.set(0);
  }, [image.src, getFitScale, scaleMotion, x, y]);

  // Notify parent of transform changes
  useEffect(() => {
    if (onTransformChange) {
      onTransformChange({ scale, tx: position.x, ty: position.y });
    }
  }, [scale, position.x, position.y, onTransformChange]);

  // Zoom handler
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY;
      const zoomFactor = e.ctrlKey || e.metaKey ? 0.002 : 0.005;
      const newScale = Math.max(0.1, Math.min(5, scale + delta * zoomFactor));
      setScale(newScale);
      scaleMotion.set(newScale);
    },
    [scale, scaleMotion]
  );

  // Mouse drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      px: position.x,
      py: position.y,
    };
  }, [position]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const newPos = {
        x: dragStart.current.px + dx,
        y: dragStart.current.py + dy,
      };
      setPosition(newPos);
      x.set(newPos.x);
      y.set(newPos.y);
    },
    [isDragging, x, y]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Double-click to toggle fit/fill
  const handleDoubleClick = useCallback(() => {
    const fitScale = getFitScale();
    const fillScale = getFillScale();
    const newScale = Math.abs(scale - fitScale) < 0.01 ? fillScale : fitScale;
    setScale(newScale);
    scaleMotion.set(newScale);
    setPosition({ x: 0, y: 0 });
    x.set(0);
    y.set(0);
  }, [scale, getFitScale, getFillScale, scaleMotion, x, y]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          const zoomInScale = Math.min(5, scale * 1.2);
          setScale(zoomInScale);
          scaleMotion.set(zoomInScale);
          break;
        case '-':
        case '_':
          e.preventDefault();
          const zoomOutScale = Math.max(0.1, scale / 1.2);
          setScale(zoomOutScale);
          scaleMotion.set(zoomOutScale);
          break;
        case '0':
          e.preventDefault();
          const fitScale = getFitScale();
          setScale(fitScale);
          scaleMotion.set(fitScale);
          setPosition({ x: 0, y: 0 });
          x.set(0);
          y.set(0);
          break;
        case '1':
          e.preventDefault();
          setScale(1);
          scaleMotion.set(1);
          setPosition({ x: 0, y: 0 });
          x.set(0);
          y.set(0);
          break;
        case '2':
          e.preventDefault();
          const fillScale = getFillScale();
          setScale(fillScale);
          scaleMotion.set(fillScale);
          setPosition({ x: 0, y: 0 });
          x.set(0);
          y.set(0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scale, getFitScale, getFillScale, scaleMotion, x, y]);

  // Wheel listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Mouse listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[var(--bg)] to-[var(--bg-2)] select-none"
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Artwork Image */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          x,
          y,
          scale: scaleMotion,
        }}
      >
        <div className="relative">
          {/* Glow halo */}
          <div
            className="absolute inset-0 -z-10 opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(125,211,252,0.4) 0%, transparent 70%)',
              mixBlendMode: 'screen',
            }}
          />

          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
            placeholder={image.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={image.blurDataURL}
            className="max-w-none"
            priority
            quality={95}
            sizes="100vw"
          />
        </div>
      </motion.div>

      {/* Overlays */}
      {overlay !== 'none' && (
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{
            width: containerSize.width,
            height: containerSize.height,
          }}
        >
          {overlay === 'grid' && <GridOverlay width={containerSize.width} height={containerSize.height} />}
          {overlay === 'ratio' && <GoldenRatioOverlay width={containerSize.width} height={containerSize.height} />}
          {overlay === 'geo' && <SacredGeometryOverlay width={containerSize.width} height={containerSize.height} />}
        </svg>
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 px-3 py-1 bg-[var(--glass)] backdrop-blur-sm rounded-full text-xs text-[var(--muted)] pointer-events-none">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
}

// Grid Overlay
function GridOverlay({ width, height }: { width: number; height: number }) {
  const lines = [];
  const gridSize = 50;

  for (let i = 0; i <= width; i += gridSize) {
    lines.push(
      <line
        key={`v${i}`}
        x1={i}
        y1={0}
        x2={i}
        y2={height}
        stroke="var(--accent)"
        strokeWidth="0.5"
        opacity="0.2"
      />
    );
  }

  for (let i = 0; i <= height; i += gridSize) {
    lines.push(
      <line
        key={`h${i}`}
        x1={0}
        y1={i}
        x2={width}
        y2={i}
        stroke="var(--accent)"
        strokeWidth="0.5"
        opacity="0.2"
      />
    );
  }

  return <>{lines}</>;
}

// Golden Ratio Overlay
function GoldenRatioOverlay({ width, height }: { width: number; height: number }) {
  const phi = 1.618;
  const w1 = width / phi;
  const h1 = height / phi;

  return (
    <>
      <line x1={w1} y1={0} x2={w1} y2={height} stroke="var(--accent)" strokeWidth="1" opacity="0.4" />
      <line x1={0} y1={h1} x2={width} y2={h1} stroke="var(--accent)" strokeWidth="1" opacity="0.4" />
      <rect
        x={0}
        y={0}
        width={w1}
        height={h1}
        stroke="var(--accent)"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
    </>
  );
}

// Sacred Geometry Overlay
function SacredGeometryOverlay({ width, height }: { width: number; height: number }) {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 3;

  return (
    <>
      <circle cx={cx} cy={cy} r={r} stroke="var(--accent)" strokeWidth="1" fill="none" opacity="0.3" />
      <circle cx={cx} cy={cy} r={r / 2} stroke="var(--accent)" strokeWidth="1" fill="none" opacity="0.3" />
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x = cx + r * Math.cos(rad);
        const y = cy + r * Math.sin(rad);
        return (
          <line
            key={angle}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="var(--accent)"
            strokeWidth="0.5"
            opacity="0.25"
          />
        );
      })}
    </>
  );
}
