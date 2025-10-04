'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Artwork } from '@/types/artwork';

interface RelatedFilmstripProps {
  related: NonNullable<Artwork['related']>;
  onSelect: (slug: string) => void;
  selectedIndex?: number;
}

export default function RelatedFilmstrip({
  related,
  onSelect,
  selectedIndex = 0,
}: RelatedFilmstripProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(selectedIndex);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Scroll to selected item
  const scrollToIndex = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    const item = itemRefs.current[index];
    if (!container || !item) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const scrollLeft = item.offsetLeft - (containerRect.width / 2) + (itemRect.width / 2);

    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth',
    });
  }, []);

  // Auto-scroll to selected index on mount/change
  useEffect(() => {
    scrollToIndex(selectedIndex);
    setFocusedIndex(selectedIndex);
  }, [selectedIndex, scrollToIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.activeElement) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const newIndex = Math.max(0, focusedIndex - 1);
        setFocusedIndex(newIndex);
        scrollToIndex(newIndex);
        itemRefs.current[newIndex]?.focus();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const newIndex = Math.min(related.length - 1, focusedIndex + 1);
        setFocusedIndex(newIndex);
        scrollToIndex(newIndex);
        itemRefs.current[newIndex]?.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(related[focusedIndex].slug);
      }
    };

    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, related, onSelect, scrollToIndex]);

  if (related.length === 0) return null;

  return (
    <nav
      className="w-full bg-[var(--bg)] border-t border-[var(--border)] py-4 px-6"
      aria-label="Related artworks"
    >
      <div className="mb-3">
        <h2 className="text-xs uppercase tracking-wide text-[var(--muted)]">
          Related Works
        </h2>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent"
        role="listbox"
        aria-orientation="horizontal"
        tabIndex={0}
        style={{
          scrollbarWidth: 'thin',
          scrollSnapType: 'x mandatory',
        }}
      >
        {related.map((item, index) => {
          const isSelected = index === selectedIndex;
          const isFocused = index === focusedIndex;

          return (
            <motion.button
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              onClick={() => {
                setFocusedIndex(index);
                onSelect(item.slug);
              }}
              className="relative flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden snap-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              role="option"
              aria-selected={isSelected}
              aria-label={item.title}
              tabIndex={isFocused ? 0 : -1}
            >
              {/* Thumbnail */}
              <div className="relative w-full h-full bg-[var(--bg-2)]">
                <Image
                  src={item.thumb}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="128px"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity" />

                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="selected-indicator"
                    className="absolute inset-0 border-2 border-[var(--accent)]"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </div>

              {/* Title on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-white font-medium opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                {item.title}
              </div>

              {/* Color palette dots */}
              {item.palette && item.palette.length > 0 && (
                <div className="absolute top-2 left-2 flex gap-1">
                  {item.palette.slice(0, 3).map((hex, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full border border-white/30"
                      style={{ backgroundColor: hex }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Navigation hint */}
      <p className="mt-2 text-xs text-[var(--muted)] text-center">
        Use ← → arrow keys to navigate • Click to view
      </p>
    </nav>
  );
}
