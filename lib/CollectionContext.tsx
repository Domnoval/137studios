'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Artwork {
  id: number;
  title: string;
  slug?: string; // URL-friendly identifier
  category: 'painting' | 'digital' | 'print' | 'installation';
  size: string;
  medium: string;
  year: number;
  price: string;
  description: string;
  color: string;
  imageUrl?: string; // For AI generation reference
}

interface CollectionContextType {
  collectedArtworks: Artwork[];
  channelArtwork: (artwork: Artwork) => void;
  unchannelArtwork: (artworkId: number) => void;
  isChanneled: (artworkId: number) => boolean;
  clearCollection: () => void;
  canSynthesize: boolean; // True when 2+ artworks collected
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [collectedArtworks, setCollectedArtworks] = useState<Artwork[]>([]);

  const channelArtwork = (artwork: Artwork) => {
    setCollectedArtworks(prev => {
      // Prevent duplicates
      if (prev.find(a => a.id === artwork.id)) {
        return prev;
      }
      // Max 5 artworks
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, artwork];
    });
  };

  const unchannelArtwork = (artworkId: number) => {
    setCollectedArtworks(prev => prev.filter(a => a.id !== artworkId));
  };

  const isChanneled = (artworkId: number) => {
    return collectedArtworks.some(a => a.id === artworkId);
  };

  const clearCollection = () => {
    setCollectedArtworks([]);
  };

  const canSynthesize = collectedArtworks.length >= 2;

  return (
    <CollectionContext.Provider
      value={{
        collectedArtworks,
        channelArtwork,
        unchannelArtwork,
        isChanneled,
        clearCollection,
        canSynthesize,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
}
