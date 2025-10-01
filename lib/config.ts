// 137studios - Centralized Configuration & Data Management
// All agents, components, and systems should import from this file

export const STUDIO_CONFIG = {
  // Brand Identity
  brand: {
    name: '137studios',
    artist: 'The Mystic Creator',
    tagline: 'Where consciousness meets creation',
    sacredNumber: 137, // Fine structure constant
    goldenAngle: 137.5, // For deterministic positioning
  },

  // API Configuration
  apis: {
    openai: {
      enabled: process.env.OPENAI_API_KEY ? true : false,
      model: 'gpt-4-vision-preview',
    },
    vercel: {
      blob: {
        enabled: process.env.BLOB_READ_WRITE_TOKEN ? true : false,
      },
    },
    printful: {
      enabled: process.env.PRINTFUL_API_KEY ? true : false,
      baseUrl: 'https://api.printful.com',
    },
    printify: {
      enabled: process.env.PRINTIFY_API_KEY ? true : false,
      baseUrl: 'https://api.printify.com/v1',
    },
  },

  // Admin Access
  admin: {
    secretClickCount: 7,
    resetTimeout: 3000, // 3 seconds
  },

  // Gallery Configuration
  gallery: {
    maxArtworks: 50,
    artworkRadius: 6,
    particleCount: 200,
    floatAnimation: {
      speed: 2,
      intensity: 1,
      rotationIntensity: 0.5,
    },
  },

  // Upload Limits
  upload: {
    maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB in bytes
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    batchLimit: 10,
  },

  // Print Options
  printOptions: {
    types: [
      { type: 'canvas', name: 'Canvas Print', basePrice: 89, recommended: true },
      { type: 'poster', name: 'Art Poster', basePrice: 25, recommended: true },
      { type: 'shirt', name: 'Art Shirt', basePrice: 35, recommended: false },
      { type: 'mug', name: 'Art Mug', basePrice: 18, recommended: false },
      { type: 'phone-case', name: 'Phone Case', basePrice: 22, recommended: false },
      { type: 'sticker', name: 'Sticker Pack', basePrice: 8, recommended: true },
    ],
    limitedEdition: {
      pricingMultipliers: {
        standard: 1.0,
        premium: 1.5,
        collectors: 2.0,
      },
      defaultQuantity: 100,
    },
  },

  // Animation Settings
  animations: {
    pageTransition: { duration: 0.8 },
    modalTransition: { duration: 0.5 },
    hoverScale: 1.05,
    tapScale: 0.95,
  },

  // Color Palette (matches tailwind.config.ts)
  colors: {
    cosmic: {
      void: '#0a0a0a',
      nebula: '#1a0f2e',
      astral: '#2d1b4e',
      aura: '#c084fc',
      plasma: '#8b5cf6',
      light: '#e9d5ff',
      glow: '#ddd6fe',
    },
    mystic: {
      gold: '#fbbf24',
    },
  },
} as const;

// Type Definitions
export interface Artwork {
  id: number;
  title: string;
  category: 'painting' | 'digital' | 'print' | 'installation';
  size: string;
  medium: string;
  year: number;
  price: string;
  description: string;
  color: string;
  files?: string[]; // Blob storage URLs
  tags?: string[];
  limitedEdition?: {
    enabled: boolean;
    quantity: number;
    pricing: 'standard' | 'premium' | 'collectors';
  };
  printOptions?: string[];
  metadata?: {
    createdAt: string;
    updatedAt: string;
    uploadedBy: string;
  };
}

export interface PrintOption {
  type: 'canvas' | 'poster' | 'shirt' | 'mug' | 'phone-case' | 'sticker';
  name: string;
  recommended: boolean;
  basePrice: number;
}

export interface RemixRequest {
  originalArtworkId: number;
  prompt: string;
  styleIntensity: number; // 0-100
  chaosLevel: number; // 0-100
  userId?: string;
  timestamp: string;
}

// Utility Functions
export const generateDeterministicPosition = (
  index: number,
  radius: number = STUDIO_CONFIG.gallery.artworkRadius,
  goldenAngle: number = STUDIO_CONFIG.brand.goldenAngle
): [number, number, number] => {
  const angle = (index * goldenAngle) % 360;
  const x = Math.cos(angle * Math.PI / 180) * radius;
  const y = Math.sin(angle * Math.PI / 180) * radius * 0.7;
  const z = Math.sin(index) * 2;
  return [x, y, z];
};

export const formatPrice = (price: string | number): string => {
  if (typeof price === 'number') {
    return `$${price.toLocaleString()}`;
  }
  return price;
};

export const getCategoryColor = (category: Artwork['category']): string => {
  const colorMap = {
    painting: STUDIO_CONFIG.colors.cosmic.plasma,
    digital: '#00ffff',
    print: STUDIO_CONFIG.colors.mystic.gold,
    installation: STUDIO_CONFIG.colors.cosmic.aura,
  };
  return colorMap[category];
};

// Sample Data (temporary until database integration)
export const SAMPLE_ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: "Cosmic Birth",
    category: "painting",
    size: "72x48",
    medium: "Acrylic on Canvas",
    year: 2024,
    price: "$8,888",
    description: "The universe's first breath, captured in swirling nebulas of consciousness.",
    color: STUDIO_CONFIG.colors.cosmic.plasma,
    tags: ["consciousness", "cosmic", "birth", "universe"],
  },
  {
    id: 2,
    title: "Digital Ayahuasca",
    category: "digital",
    size: "∞x∞",
    medium: "Generative Algorithm",
    year: 2024,
    price: "ETH 1.37",
    description: "Machine dreams meet plant wisdom in this algorithmic vision quest.",
    color: "#00ffff",
    tags: ["psychedelic", "digital", "ayahuasca", "algorithm"],
  },
  {
    id: 3,
    title: "Void Walker",
    category: "painting",
    size: "96x72",
    medium: "Mixed Media",
    year: 2023,
    price: "$13,700",
    description: "A figure traversing the spaces between realities, neither here nor there.",
    color: "#1a0033",
    tags: ["void", "consciousness", "reality", "metaphysical"],
  },
  {
    id: 4,
    title: "Consciousness.exe",
    category: "installation",
    size: "Room Scale",
    medium: "Interactive Projection",
    year: 2024,
    price: "Commission",
    description: "Self-aware code that responds to your thoughts and emotions.",
    color: STUDIO_CONFIG.colors.mystic.gold,
    tags: ["consciousness", "interactive", "technology", "sensors"],
  },
  {
    id: 5,
    title: "Astral Projection #7",
    category: "print",
    size: "36x24",
    medium: "Archival Print",
    year: 2024,
    price: "$777",
    description: "The seventh attempt at leaving the body, documented in light.",
    color: STUDIO_CONFIG.colors.cosmic.aura,
    tags: ["astral", "projection", "consciousness", "spiritual"],
  },
  {
    id: 6,
    title: "Sacred Circuitry",
    category: "digital",
    size: "Variable",
    medium: "AI + Human Collaboration",
    year: 2024,
    price: "$3,333",
    description: "Where ancient symbols meet quantum computing.",
    color: STUDIO_CONFIG.colors.cosmic.light,
    tags: ["sacred geometry", "technology", "quantum", "symbols"],
  },
];

// Environment Validation
export const validateEnvironment = () => {
  const warnings: string[] = [];

  if (!STUDIO_CONFIG.apis.openai.enabled) {
    warnings.push('OpenAI API key not configured - AI features disabled');
  }

  if (!STUDIO_CONFIG.apis.vercel.blob.enabled) {
    warnings.push('Vercel Blob storage not configured - file uploads disabled');
  }

  if (!STUDIO_CONFIG.apis.printful.enabled && !STUDIO_CONFIG.apis.printify.enabled) {
    warnings.push('No print provider configured - print-on-demand disabled');
  }

  return warnings;
};

export default STUDIO_CONFIG;