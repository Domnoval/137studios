'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonProps {
  viewState?: {
    scale?: number;
    tx?: number;
    ty?: number;
    overlay?: string;
    relatedIndex?: number;
  };
}

export default function ShareButton({ viewState }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleShare = async () => {
    try {
      // Build URL with current view state
      const url = new URL(window.location.href);

      if (viewState) {
        if (viewState.scale !== undefined) url.searchParams.set('zoom', viewState.scale.toFixed(2));
        if (viewState.tx !== undefined) url.searchParams.set('x', viewState.tx.toFixed(0));
        if (viewState.ty !== undefined) url.searchParams.set('y', viewState.ty.toFixed(0));
        if (viewState.overlay && viewState.overlay !== 'none') {
          url.searchParams.set('overlay', viewState.overlay);
        }
        if (viewState.relatedIndex !== undefined && viewState.relatedIndex > 0) {
          url.searchParams.set('related', viewState.relatedIndex.toString());
        }
      }

      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      className="relative px-4 py-2 bg-[var(--glass)] backdrop-blur-sm rounded-full text-xs font-medium text-[var(--fg)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Share this view"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-1"
          >
            ✓ Copied
          </motion.span>
        ) : (
          <motion.span
            key="share"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-1"
          >
            ↗ Share
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
