'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HotkeyGuide() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const shortcuts = [
    { category: 'Zoom', items: [
      { keys: ['+', '='], description: 'Zoom in' },
      { keys: ['-'], description: 'Zoom out' },
      { keys: ['0'], description: 'Fit to screen' },
      { keys: ['1'], description: '100% zoom' },
      { keys: ['2'], description: 'Fill screen' },
      { keys: ['Scroll'], description: 'Zoom (Ctrl for fine control)' },
    ]},
    { category: 'Pan', items: [
      { keys: ['Drag'], description: 'Pan around image' },
      { keys: ['Double-click'], description: 'Toggle fit/fill' },
    ]},
    { category: 'Overlays', items: [
      { keys: ['N'], description: 'No overlay' },
      { keys: ['G'], description: 'Grid overlay' },
      { keys: ['R'], description: 'Golden ratio overlay' },
      { keys: ['S'], description: 'Sacred geometry overlay' },
    ]},
    { category: 'Navigation', items: [
      { keys: ['←', '→'], description: 'Navigate related works' },
      { keys: ['Esc'], description: 'Close panels/dialogs' },
    ]},
    { category: 'Help', items: [
      { keys: ['?'], description: 'Toggle this help' },
    ]},
  ];

  return (
    <>
      {/* Help button trigger */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[var(--glass)] backdrop-blur-sm rounded-full text-[var(--fg)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] transition-colors flex items-center justify-center font-bold text-lg z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Keyboard shortcuts (press ?)"
      >
        ?
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              aria-hidden="true"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-8 z-50 shadow-2xl"
              role="dialog"
              aria-labelledby="hotkey-title"
              aria-modal="true"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 id="hotkey-title" className="text-2xl font-bold text-[var(--fg)]">
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-2)] rounded-lg transition-colors"
                  aria-label="Close (press Escape)"
                >
                  ✕
                </button>
              </div>

              {/* Shortcuts grid */}
              <div className="space-y-6">
                {shortcuts.map((section) => (
                  <div key={section.category}>
                    <h3 className="text-xs uppercase tracking-wide text-[var(--muted)] mb-3">
                      {section.category}
                    </h3>
                    <div className="space-y-2">
                      {section.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 px-3 hover:bg-[var(--bg-2)] rounded-lg transition-colors"
                        >
                          <span className="text-sm text-[var(--fg)]">
                            {item.description}
                          </span>
                          <div className="flex gap-1">
                            {item.keys.map((key, j) => (
                              <kbd
                                key={j}
                                className="px-2 py-1 bg-[var(--bg-2)] border border-[var(--border)] rounded text-xs font-mono text-[var(--fg)]"
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-[var(--border)] text-center text-xs text-[var(--muted)]">
                Press <kbd className="px-1.5 py-0.5 bg-[var(--bg-2)] border border-[var(--border)] rounded text-xs font-mono">?</kbd> or <kbd className="px-1.5 py-0.5 bg-[var(--bg-2)] border border-[var(--border)] rounded text-xs font-mono">Esc</kbd> to close
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
