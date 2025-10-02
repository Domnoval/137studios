// 137studios - OpenAI Vision API Integration
// AI-powered artwork analysis and metadata generation

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIArtworkAnalysis {
  title: string;
  description: string;
  suggestedTags: string[];
  detectedStyle: string;
  mood: string;
  colorPalette: string[];
  dominantColor: string;
  priceRecommendation: {
    suggested: number;
    min: number;
    max: number;
    factors: PriceFactors;
  };
  confidence: number; // 0-1
}

interface PriceFactors {
  sizeMultiplier: number;
  complexityMultiplier: number;
  colorRichnessMultiplier: number;
  styleMultiplier: number;
}

// Analyze artwork using OpenAI Vision API
export async function analyzeArtwork(
  imageBuffer: Buffer,
  metadata?: {
    width?: number;
    height?: number;
    fileSize?: number;
  }
): Promise<AIArtworkAnalysis> {
  try {
    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // GPT-4o with vision capabilities
      messages: [
        {
          role: 'system',
          content: `You are an expert art curator and analyst for 137studios, a consciousness-focused art gallery.

Analyze the artwork and provide a JSON response with:
1. title: A mystical, evocative title (2-5 words)
2. description: A poetic description (2-3 sentences) that captures the artwork's essence and spiritual resonance
3. suggestedTags: Array of 5-8 relevant tags (lowercase, no #)
4. detectedStyle: Art style (e.g., "Abstract Digital", "Oil Painting", "Mixed Media")
5. mood: Emotional tone (e.g., "Transcendent", "Calm", "Energetic", "Mystical")
6. colorPalette: Array of 3-5 dominant hex colors
7. dominantColor: Primary hex color

Important: Return ONLY valid JSON, no markdown or explanations.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this artwork for our consciousness art gallery:',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: 'high', // High detail for better analysis
              },
            },
          ],
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
      response_format: { type: 'json_object' }, // Enforce JSON response
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse AI response
    const aiData = JSON.parse(content);

    // Calculate price recommendation
    const priceRecommendation = calculatePriceRecommendation(
      metadata?.width,
      metadata?.height,
      metadata?.fileSize,
      aiData.detectedStyle,
      aiData.colorPalette?.length || 0
    );

    // Calculate confidence score based on response completeness
    const confidence = calculateConfidence(aiData);

    return {
      title: aiData.title || 'Untitled Artwork',
      description: aiData.description || 'A captivating piece awaiting description...',
      suggestedTags: Array.isArray(aiData.suggestedTags)
        ? aiData.suggestedTags.slice(0, 8)
        : [],
      detectedStyle: aiData.detectedStyle || 'Digital Art',
      mood: aiData.mood || 'Contemplative',
      colorPalette: Array.isArray(aiData.colorPalette)
        ? aiData.colorPalette.slice(0, 5)
        : ['#9333ea'],
      dominantColor: aiData.dominantColor || aiData.colorPalette?.[0] || '#9333ea',
      priceRecommendation,
      confidence,
    };
  } catch (error) {
    console.error('AI Vision analysis failed:', error);

    // Return fallback analysis
    return getFallbackAnalysis(metadata);
  }
}

// Calculate market value-based price recommendation
function calculatePriceRecommendation(
  width?: number,
  height?: number,
  fileSize?: number,
  style?: string,
  colorCount?: number
): AIArtworkAnalysis['priceRecommendation'] {
  // Base price: $137 (mystical number for 137studios)
  const basePrice = 137;

  // Size multiplier (larger artwork = higher value)
  let sizeMultiplier = 1.0;
  if (width && height) {
    const megapixels = (width * height) / 1_000_000;
    sizeMultiplier = 1 + megapixels / 10; // +10% per megapixel
  }

  // Complexity multiplier (file size as proxy for detail)
  let complexityMultiplier = 1.0;
  if (fileSize) {
    const mbSize = fileSize / (1024 * 1024);
    complexityMultiplier = 1 + mbSize / 20; // +5% per MB
  }

  // Color richness multiplier (more colors = more complex)
  const colorRichnessMultiplier = colorCount ? 1 + colorCount / 20 : 1.0;

  // Style-based multiplier (market demand)
  const styleMultipliers: { [key: string]: number } = {
    'Oil Painting': 1.5,
    'Abstract': 1.3,
    'Impressionist': 1.4,
    'Mixed Media': 1.3,
    'Digital Art': 1.0,
    'Photography': 0.8,
    'Watercolor': 1.2,
    'Acrylic': 1.3,
  };

  const styleMultiplier = styleMultipliers[style || ''] || 1.0;

  // Calculate final price
  const suggestedPrice = Math.round(
    basePrice *
      sizeMultiplier *
      complexityMultiplier *
      colorRichnessMultiplier *
      styleMultiplier
  );

  // Price range: ±30% of suggested
  const min = Math.round(suggestedPrice * 0.7);
  const max = Math.round(suggestedPrice * 1.3);

  return {
    suggested: suggestedPrice,
    min,
    max,
    factors: {
      sizeMultiplier,
      complexityMultiplier,
      colorRichnessMultiplier,
      styleMultiplier,
    },
  };
}

// Calculate confidence score based on response completeness
function calculateConfidence(aiData: any): number {
  let score = 0;

  if (aiData.title && aiData.title.length > 3) score += 0.2;
  if (aiData.description && aiData.description.length > 50) score += 0.25;
  if (Array.isArray(aiData.suggestedTags) && aiData.suggestedTags.length >= 3)
    score += 0.2;
  if (aiData.detectedStyle) score += 0.15;
  if (aiData.mood) score += 0.1;
  if (
    Array.isArray(aiData.colorPalette) &&
    aiData.colorPalette.every((c: string) => /^#[0-9A-Fa-f]{6}$/.test(c))
  )
    score += 0.1;

  return Math.min(1.0, score);
}

// Fallback analysis if AI fails
function getFallbackAnalysis(metadata?: {
  width?: number;
  height?: number;
  fileSize?: number;
}): AIArtworkAnalysis {
  const priceRecommendation = calculatePriceRecommendation(
    metadata?.width,
    metadata?.height,
    metadata?.fileSize,
    'Digital Art',
    3
  );

  return {
    title: `Untitled Artwork ${Date.now()}`,
    description:
      'A captivating piece from the cosmic consciousness realm. Awaiting deeper analysis and description.',
    suggestedTags: ['digital', 'abstract', 'consciousness', 'cosmic'],
    detectedStyle: 'Digital Art',
    mood: 'Contemplative',
    colorPalette: ['#9333ea', '#6b46c1', '#c084fc'],
    dominantColor: '#9333ea',
    priceRecommendation,
    confidence: 0.3, // Low confidence for fallback
  };
}

// Retry logic with exponential backoff
export async function analyzeArtworkWithRetry(
  imageBuffer: Buffer,
  metadata?: {
    width?: number;
    height?: number;
    fileSize?: number;
  },
  maxRetries = 3
): Promise<AIArtworkAnalysis> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await analyzeArtwork(imageBuffer, metadata);

      // If confidence is too low and we have retries left, try again
      if (result.confidence < 0.5 && attempt < maxRetries) {
        console.log(`Low confidence (${result.confidence}), retrying...`);
        await sleep(Math.pow(2, attempt) * 1000); // Exponential backoff
        continue;
      }

      return result;
    } catch (error) {
      console.error(`AI analysis attempt ${attempt} failed:`, error);

      if (attempt === maxRetries) {
        // Final attempt failed, return fallback
        return getFallbackAnalysis(metadata);
      }

      // Wait before retry (exponential backoff: 2s, 4s, 8s)
      await sleep(Math.pow(2, attempt) * 1000);
    }
  }

  // Should never reach here, but TypeScript requires it
  return getFallbackAnalysis(metadata);
}

// Helper: Sleep function
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Batch analysis for multiple artworks
export async function analyzeBatch(
  images: Array<{ buffer: Buffer; metadata?: any }>,
  concurrency = 3
): Promise<AIArtworkAnalysis[]> {
  const results: AIArtworkAnalysis[] = [];

  // Process in batches to avoid rate limits
  for (let i = 0; i < images.length; i += concurrency) {
    const batch = images.slice(i, i + concurrency);

    const batchResults = await Promise.allSettled(
      batch.map((img) => analyzeArtworkWithRetry(img.buffer, img.metadata))
    );

    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.error(`Batch analysis failed for image ${i + index}:`, result.reason);
        results.push(getFallbackAnalysis(batch[index].metadata));
      }
    });

    // Wait between batches to avoid rate limiting
    if (i + concurrency < images.length) {
      await sleep(1000);
    }
  }

  return results;
}
