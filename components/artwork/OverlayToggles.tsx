'use client';

import { motion } from 'framer-motion';
import type { OverlayType } from '@/types/artwork';

interface OverlayTogglesProps {
  current: OverlayType;
  onChange: (overlay: OverlayType) => void;
}

const overlays = [
  { type: 'none' as OverlayType, label: 'None', key: 'N' },
  { type: 'grid' as OverlayType, label: 'Grid', key: 'G' },
  { type: 'ratio' as OverlayType, label: 'Golden Ratio', key: 'R' },
  { type: 'geo' as OverlayType, label: 'Sacred Geometry', key: 'S' },
];

export default function OverlayToggles({ current, onChange }: OverlayTogglesProps) {
  return (
    <div
      className="flex gap-2 bg-[var(--glass)] backdrop-blur-sm rounded-full p-2"
      role="toolbar"
      aria-label="Overlay options"
    >
      {overlays.map((overlay) => {
        const isActive = current === overlay.type;

        return (
          <motion.button
            key={overlay.type}
            onClick={() => onChange(overlay.type)}
            className={`relative px-4 py-2 rounded-full text-xs font-medium transition-colors ${
              isActive
                ? 'text-[var(--accent-fg)]'
                : 'text-[var(--muted)] hover:text-[var(--fg)]'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-pressed={isActive}
            aria-label={`${overlay.label} overlay (${overlay.key} key)`}
          >
            {isActive && (
              <motion.div
                layoutId="overlay-bg"
                className="absolute inset-0 bg-[var(--accent)] rounded-full"
                initial={false}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {overlay.label}
              <span className="ml-1 opacity-60 text-[0.65rem]">{overlay.key}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
