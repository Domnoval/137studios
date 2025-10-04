import type { Artwork } from '@/lib/CollectionContext';

/**
 * Artwork Data Layer
 *
 * Currently returns static placeholder data.
 * Future: Fetch from Vercel Blob storage or Supabase database.
 *
 * When ready to integrate real images:
 * 1. Upload images to Vercel Blob
 * 2. Store metadata in Supabase
 * 3. Replace getArtworks() implementation to fetch from API
 */

// Real artworks - Update titles, descriptions, and metadata as needed
const PLACEHOLDER_ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: "Purple Dreamscape",
    category: "digital",
    size: "24 x 36 inches",
    medium: "Digital Photography",
    year: 2024,
    price: "$299",
    description: "A mystical journey through violet dimensions. Captured with cosmic intention, this piece channels the frequency of transformation and spiritual awakening.",
    color: "#9333ea",
    imageUrl: "/artwork/art-1.png.jpg"
  },
  {
    id: 2,
    title: "Cyan Consciousness",
    category: "digital",
    size: "18 x 24 inches",
    medium: "Digital Art",
    year: 2024,
    price: "$249",
    description: "Electric turquoise energy flows through ethereal planes. A visual meditation on clarity, communication, and the infinite now.",
    color: "#00ffff",
    imageUrl: "/artwork/art-2.png.jpg"
  },
  {
    id: 3,
    title: "Void Symphony",
    category: "digital",
    size: "30 x 40 inches",
    medium: "Digital Composite",
    year: 2024,
    price: "$399",
    description: "In the darkness between stars, creation whispers. This deep cosmic exploration invites you to dance with the unknown and embrace the mystery.",
    color: "#1a0033",
    imageUrl: "/artwork/art-3.png.jpg"
  },
  {
    id: 4,
    title: "Golden Frequency",
    category: "digital",
    size: "20 x 30 inches",
    medium: "Digital Photography",
    year: 2024,
    price: "$329",
    description: "Radiant amber light channels the frequency of abundance and divine timing. A sacred geometry of warmth, wisdom, and celestial alignment.",
    color: "#fbbf24",
    imageUrl: "/artwork/art-4.png.jpg"
  },
  {
    id: 5,
    title: "Amethyst Portal",
    category: "digital",
    size: "16 x 20 inches",
    medium: "Digital Art",
    year: 2024,
    price: "$199",
    description: "A gateway woven from violet threads of consciousness. Step through the crystalline veil and explore dimensions beyond the ordinary.",
    color: "#6b46c1",
    imageUrl: "/artwork/art-5.png.png"
  },
  {
    id: 6,
    title: "Artwork 6",
    category: "digital",
    size: "TBD",
    medium: "Digital Art",
    year: 2024,
    price: "Contact",
    description: "Update this description with details about your artwork.",
    color: "#e9d5ff",
    imageUrl: "/artwork/art-6.png.jpg"
  },
  {
    id: 7,
    title: "Artwork 7",
    category: "digital",
    size: "TBD",
    medium: "Digital Art",
    year: 2024,
    price: "Contact",
    description: "Update this description with details about your artwork.",
    color: "#ec4899",
    imageUrl: "/artwork/art-7.png.jpg"
  },
  {
    id: 8,
    title: "Artwork 8",
    category: "digital",
    size: "TBD",
    medium: "Digital Art",
    year: 2024,
    price: "Contact",
    description: "Update this description with details about your artwork.",
    color: "#14b8a6",
    imageUrl: "/artwork/art-8.png.png"
  },
  {
    id: 9,
    title: "Artwork 9",
    category: "digital",
    size: "TBD",
    medium: "Digital Art",
    year: 2024,
    price: "Contact",
    description: "Update this description with details about your artwork.",
    color: "#f59e0b",
    imageUrl: "/artwork/art-9.png.png"
  },
  {
    id: 10,
    title: "Artwork 10",
    category: "digital",
    size: "TBD",
    medium: "Digital Art",
    year: 2024,
    price: "Contact",
    description: "Update this description with details about your artwork.",
    color: "#8b5cf6",
    imageUrl: "/artwork/art-10.png.png"
  },
  {
    id: 11,
    title: "Artwork 11",
    category: "digital",
    size: "TBD",
    medium: "Digital Art",
    year: 2024,
    price: "Contact",
    description: "Update this description with details about your artwork.",
    color: "#3b82f6",
    imageUrl: "/artwork/art-11.png.png"
  },
  {
    id: 12,
    title: "Artwork 12",
    category: "digital",
    size: "TBD",
    medium: "Digital Art",
    year: 2024,
    price: "Contact",
    description: "Update this description with details about your artwork.",
    color: "#ef4444",
    imageUrl: "/artwork/art-12.png.jpg"
  }
];

/**
 * Get all artworks
 *
 * @returns Promise<Artwork[]> - Array of artwork objects
 *
 * Future implementation:
 * ```typescript
 * export async function getArtworks(): Promise<Artwork[]> {
 *   const response = await fetch('/api/artworks');
 *   const data = await response.json();
 *   return data.artworks;
 * }
 * ```
 */
export async function getArtworks(): Promise<Artwork[]> {
  // Simulate network delay (remove in production)
  await new Promise(resolve => setTimeout(resolve, 100));

  return PLACEHOLDER_ARTWORKS;
}

/**
 * Get single artwork by ID
 *
 * @param id - Artwork ID
 * @returns Promise<Artwork | null>
 */
export async function getArtworkById(id: number): Promise<Artwork | null> {
  const artworks = await getArtworks();
  return artworks.find(a => a.id === id) || null;
}

/**
 * Get artworks by category
 *
 * @param category - Artwork category
 * @returns Promise<Artwork[]>
 */
export async function getArtworksByCategory(
  category: Artwork['category']
): Promise<Artwork[]> {
  const artworks = await getArtworks();
  return artworks.filter(a => a.category === category);
}
