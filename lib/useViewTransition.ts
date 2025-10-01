'use client';

import { useCallback } from 'react';

export function useViewTransition() {
  const startViewTransition = useCallback((callback: () => void) => {
    // Check if View Transitions API is supported
    if ('startViewTransition' in document) {
      (document as any).startViewTransition(callback);
    } else {
      // Fallback for browsers that don't support it
      callback();
    }
  }, []);

  return startViewTransition;
}

// Utility for smooth section navigation with view transitions
export function navigateToSection(sectionId: string) {
  const element = document.querySelector(sectionId);
  if (!element) return;

  if ('startViewTransition' in document) {
    (document as any).startViewTransition(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  } else {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
