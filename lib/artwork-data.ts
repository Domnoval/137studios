import type { Artwork } from '@/types/artwork';

// Mock data - replace with actual API calls
const MOCK_ARTWORKS: Record<string, Artwork> = {
  'purple-dreamscape': {
    slug: 'purple-dreamscape',
    title: 'Purple Dreamscape',
    year: '2024',
    media: 'Digital Photography',
    size: '24 x 36 inches',
    description: 'A mystical journey through violet dimensions. Captured with cosmic intention, this piece channels the frequency of transformation and spiritual awakening. The interplay of light and shadow creates a portal into the subconscious, inviting viewers to explore the liminal spaces between reality and dream.',
    image: {
      src: '/artwork/art-1.png.webp',
      width: 2000,
      height: 2000,
      alt: 'Purple Dreamscape - abstract violet cosmic artwork',
      blurDataURL: 'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAACwAQCdASoIAAgAAkA4JaQAA3AA/v3j9wAA',
    },
    series: {
      name: 'Cosmic Visions',
      slug: 'cosmic-visions',
    },
    tags: ['abstract', 'cosmic', 'violet', 'spiritual'],
    palette: [
      { hex: '#9333ea', name: 'Cosmic Purple' },
      { hex: '#6b46c1', name: 'Deep Violet' },
      { hex: '#c084fc', name: 'Light Purple' },
      { hex: '#1a0033', name: 'Void Black' },
    ],
    edition: {
      type: 'original',
      number: '1/1',
    },
    provenance: [
      'Created by artist 2024',
      'First exhibition: Digital Dreams Gallery',
    ],
    related: [
      {
        id: '2',
        slug: 'cyan-consciousness',
        title: 'Cyan Consciousness',
        thumb: '/artwork/art-2.png.webp',
        palette: ['#00ffff', '#14b8a6'],
      },
      {
        id: '3',
        slug: 'void-symphony',
        title: 'Void Symphony',
        thumb: '/artwork/art-3.png.webp',
        palette: ['#1a0033', '#9333ea'],
      },
      {
        id: '4',
        slug: 'golden-frequency',
        title: 'Golden Frequency',
        thumb: '/artwork/art-4.png.webp',
        palette: ['#fbbf24', '#f59e0b'],
      },
    ],
  },
  'cyan-consciousness': {
    slug: 'cyan-consciousness',
    title: 'Cyan Consciousness',
    year: '2024',
    media: 'Digital Art',
    size: '18 x 24 inches',
    description: 'Electric turquoise energy flows through ethereal planes. A visual meditation on clarity, communication, and the infinite now.',
    image: {
      src: '/artwork/art-2.png.webp',
      width: 2000,
      height: 2000,
      alt: 'Cyan Consciousness - turquoise abstract artwork',
    },
    tags: ['abstract', 'cyan', 'meditation'],
    palette: [
      { hex: '#00ffff', name: 'Electric Cyan' },
      { hex: '#14b8a6', name: 'Teal' },
    ],
    edition: {
      type: 'print',
      size: 50,
    },
    related: [
      {
        id: '1',
        slug: 'purple-dreamscape',
        title: 'Purple Dreamscape',
        thumb: '/artwork/art-1.png.webp',
        palette: ['#9333ea'],
      },
    ],
  },
};

export async function getArtwork(slug: string): Promise<Artwork | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_ARTWORKS[slug] || null;
}

export async function getAllArtworkSlugs(): Promise<string[]> {
  return Object.keys(MOCK_ARTWORKS);
}
