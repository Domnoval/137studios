'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TranceContextType {
  isTranceMode: boolean;
  enableTranceMode: () => void;
  disableTranceMode: () => void;
  showTrancePrompt: boolean;
  dismissTrancePrompt: () => void;
}

const TranceContext = createContext<TranceContextType | undefined>(undefined);

export function TranceProvider({ children }: { children: ReactNode }) {
  const [isTranceMode, setIsTranceMode] = useState(false);
  const [showTrancePrompt, setShowTrancePrompt] = useState(false);
  const [engagementScore, setEngagementScore] = useState(0);

  useEffect(() => {
    // Check for saved preference
    const saved = localStorage.getItem('trance-mode');

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && saved !== 'true') {
      // Don't auto-enable trance mode for users who prefer reduced motion
      return;
    }

    if (saved === 'true') {
      setIsTranceMode(true);
      document.documentElement.classList.add('trance-mode');
    }

    // Track engagement (scroll, time on page)
    let scrollCount = 0;
    const handleScroll = () => {
      scrollCount++;
      setEngagementScore(prev => prev + 1);
    };

    window.addEventListener('scroll', handleScroll);

    // Show prompt after some engagement (20 scroll events or 30 seconds)
    const timer = setTimeout(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!isTranceMode && scrollCount > 10 && !prefersReducedMotion) {
        setShowTrancePrompt(true);
      }
    }, 30000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [isTranceMode]);

  // Also show prompt after significant scrolling
  useEffect(() => {
    if (engagementScore > 20 && !isTranceMode && !showTrancePrompt) {
      setShowTrancePrompt(true);
    }
  }, [engagementScore, isTranceMode, showTrancePrompt]);

  const enableTranceMode = () => {
    setIsTranceMode(true);
    setShowTrancePrompt(false);
    localStorage.setItem('trance-mode', 'true');
    document.documentElement.classList.add('trance-mode');
  };

  const disableTranceMode = () => {
    setIsTranceMode(false);
    localStorage.setItem('trance-mode', 'false');
    document.documentElement.classList.remove('trance-mode');
  };

  const dismissTrancePrompt = () => {
    setShowTrancePrompt(false);
    sessionStorage.setItem('trance-prompt-dismissed', 'true');
  };

  // Listen for Escape key to exit trance mode
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTranceMode) {
        disableTranceMode();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isTranceMode]);

  return (
    <TranceContext.Provider
      value={{
        isTranceMode,
        enableTranceMode,
        disableTranceMode,
        showTrancePrompt,
        dismissTrancePrompt,
      }}
    >
      {children}
    </TranceContext.Provider>
  );
}

export function useTrance() {
  const context = useContext(TranceContext);
  if (context === undefined) {
    throw new Error('useTrance must be used within a TranceProvider');
  }
  return context;
}
