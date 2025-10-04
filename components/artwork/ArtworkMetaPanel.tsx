'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Artwork } from '@/types/artwork';

interface ArtworkMetaPanelProps {
  artwork: Artwork;
  onColorFilter?: (hex: string | null) => void;
  onTagClick?: (tag: string) => void;
  onSeriesClick?: (slug: string) => void;
  onRelatedClick?: (slug: string) => void;
}

export default function ArtworkMetaPanel({
  artwork,
  onColorFilter,
  onTagClick,
  onSeriesClick,
}: ArtworkMetaPanelProps) {
  const [descExpanded, setDescExpanded] = useState(true);
  const [provenanceExpanded, setProvenanceExpanded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleColorClick = (hex: string) => {
    const newColor = selectedColor === hex ? null : hex;
    setSelectedColor(newColor);
    onColorFilter?.(newColor);
  };

  return (
    <aside
      className="h-full overflow-y-auto bg-[var(--bg)] border-l border-[var(--border)] px-6 py-8"
      role="complementary"
      aria-label="Artwork details"
    >
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--fg)] mb-2">
          {artwork.title}
        </h1>
        <div className="text-sm text-[var(--muted)] space-y-1">
          {artwork.year && <p>{artwork.year}</p>}
          {artwork.media && <p>{artwork.media}</p>}
          {artwork.size && <p>{artwork.size}</p>}
        </div>
      </header>

      {/* Series Chip */}
      {artwork.series && (
        <button
          onClick={() => onSeriesClick?.(artwork.series!.slug)}
          className="mb-6 px-3 py-1 bg-[var(--accent)] text-[var(--accent-fg)] rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
          aria-label={`View series: ${artwork.series.name}`}
        >
          {artwork.series.name}
        </button>
      )}

      {/* Color Palette */}
      {artwork.palette && artwork.palette.length > 0 && (
        <section className="mb-6" aria-label="Color palette">
          <h2 className="text-xs uppercase tracking-wide text-[var(--muted)] mb-3">
            Palette
          </h2>
          <div className="flex flex-wrap gap-2">
            {artwork.palette.map((color, i) => (
              <button
                key={i}
                onClick={() => handleColorClick(color.hex)}
                className={`group relative w-12 h-12 rounded-lg transition-transform hover:scale-110 ${
                  selectedColor === color.hex ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg)]' : ''
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name || color.hex}
                aria-pressed={selectedColor === color.hex}
              >
                <span className="sr-only">
                  {color.name || color.hex}
                  {selectedColor === color.hex ? ' (selected)' : ''}
                </span>
                {/* Tooltip */}
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-[var(--glass)] backdrop-blur-sm rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {color.name || color.hex}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      {artwork.tags && artwork.tags.length > 0 && (
        <section className="mb-6" aria-label="Tags">
          <h2 className="text-xs uppercase tracking-wide text-[var(--muted)] mb-3">
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {artwork.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick?.(tag)}
                className="px-3 py-1 bg-[var(--bg-2)] text-[var(--fg)] rounded-full text-xs hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] transition-colors"
                aria-label={`Search for ${tag}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Description */}
      {artwork.description && (
        <section className="mb-6">
          <button
            onClick={() => setDescExpanded(!descExpanded)}
            className="w-full flex items-center justify-between text-xs uppercase tracking-wide text-[var(--muted)] mb-3 hover:text-[var(--fg)] transition-colors"
            aria-expanded={descExpanded}
            aria-controls="description-content"
          >
            <span>Description</span>
            <motion.span
              animate={{ rotate: descExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {descExpanded && (
              <motion.div
                id="description-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  {artwork.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* Edition Info */}
      {artwork.edition && (
        <section className="mb-6 p-4 bg-[var(--bg-2)] rounded-lg">
          <h2 className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">
            Edition
          </h2>
          <div className="text-sm text-[var(--fg)]">
            <p className="capitalize">{artwork.edition.type}</p>
            {artwork.edition.number && <p>{artwork.edition.number}</p>}
            {artwork.edition.size && <p>Edition of {artwork.edition.size}</p>}
            {artwork.edition.notes && (
              <p className="text-xs text-[var(--muted)] mt-2">{artwork.edition.notes}</p>
            )}
          </div>
        </section>
      )}

      {/* Provenance */}
      {artwork.provenance && artwork.provenance.length > 0 && (
        <section className="mb-6">
          <button
            onClick={() => setProvenanceExpanded(!provenanceExpanded)}
            className="w-full flex items-center justify-between text-xs uppercase tracking-wide text-[var(--muted)] mb-3 hover:text-[var(--fg)] transition-colors"
            aria-expanded={provenanceExpanded}
            aria-controls="provenance-content"
          >
            <span>Provenance</span>
            <motion.span
              animate={{ rotate: provenanceExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {provenanceExpanded && (
              <motion.div
                id="provenance-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <ul className="space-y-2 text-sm text-[var(--muted)]">
                  {artwork.provenance.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[var(--accent)] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* CTA Buttons */}
      <div className="sticky bottom-0 pt-6 pb-4 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)] to-transparent">
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-[var(--accent)] text-[var(--accent-fg)] rounded-lg font-medium hover:opacity-90 transition-opacity"
            aria-label="Inquire about this artwork"
          >
            Inquire
          </motion.button>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-2 bg-[var(--bg-2)] text-[var(--fg)] rounded-lg text-sm hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] transition-colors"
              aria-label="Purchase options"
            >
              Buy
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-2 bg-[var(--bg-2)] text-[var(--fg)] rounded-lg text-sm hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] transition-colors"
              aria-label="Share this artwork"
            >
              Share
            </motion.button>
          </div>
        </div>
      </div>
    </aside>
  );
}
