import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Input validation
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { artworkTitles, blendMode, intensity } = body;

    // Validate required fields
    if (!artworkTitles || !Array.isArray(artworkTitles) || artworkTitles.length === 0) {
      return NextResponse.json(
        { error: 'artworkTitles is required and must be a non-empty array' },
        { status: 400 }
      );
    }

    if (!blendMode || typeof blendMode !== 'string') {
      return NextResponse.json(
        { error: 'blendMode is required and must be a string' },
        { status: 400 }
      );
    }

    if (intensity === undefined || typeof intensity !== 'number' || intensity < 0 || intensity > 100) {
      return NextResponse.json(
        { error: 'intensity is required and must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedTitles = artworkTitles
      .filter(title => typeof title === 'string' && title.trim().length > 0)
      .slice(0, 5) // Limit to 5 artworks max
      .map(title => title.trim().substring(0, 100)); // Limit title length

    const sanitizedBlendMode = blendMode.trim().substring(0, 50);

    if (sanitizedTitles.length === 0) {
      return NextResponse.json(
        { error: 'No valid artwork titles provided' },
        { status: 400 }
      );
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      // Fallback to mystical descriptions without API
      const mysticalDescriptions = [
        `A fusion of ${sanitizedTitles.join(' and ')}, where cosmic energies dance in ${sanitizedBlendMode} harmony`,
        `The consciousness streams of ${sanitizedTitles.join(', ')} merge into a singular vision of interdimensional beauty`,
        `Through ${sanitizedBlendMode} alchemy, ${sanitizedTitles.join(' & ')} transcend physical form to become pure expression`,
        `In this ${intensity}% intensity blend, ${sanitizedTitles.join(' meets ')} to birth new realities`,
      ];

      return NextResponse.json({
        description: mysticalDescriptions[Math.floor(Math.random() * mysticalDescriptions.length)],
        price: `$${137 + Math.floor(Math.random() * 500)}`,
        mysticalProperties: {
          vibrationalFreq: `${432 + Math.floor(Math.random() * 200)}Hz`,
          dimensionalDepth: `${intensity}% conscious awareness`,
          sacredGeometry: blendMode === 'quantum' ? 'Metatron\'s Cube' : 'Flower of Life'
        }
      });
    }

    // If OpenAI key exists, use it for better descriptions
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{
          role: 'system',
          content: `You are a mystical art oracle for 137studios. Create poetic, esoteric descriptions for art remixes. Be creative, use cosmic/psychedelic language, and reference consciousness, sacred geometry, and interdimensional themes.`
        }, {
          role: 'user',
          content: `Create a mystical description for a ${sanitizedBlendMode} blend of these artworks: ${sanitizedTitles.join(', ')} at ${intensity}% intensity.`
        }],
        max_tokens: 150,
        temperature: 0.9,
      }),
    });

    const data = await openaiResponse.json();
    const description = data.choices?.[0]?.message?.content || 'A cosmic fusion beyond words...';

    return NextResponse.json({
      description,
      price: `$${137 + Math.floor(Math.random() * 500)}`,
      mysticalProperties: {
        vibrationalFreq: `${432 + Math.floor(Math.random() * 200)}Hz`,
        dimensionalDepth: `${intensity}% conscious awareness`,
        sacredGeometry: blendMode === 'quantum' ? 'Metatron\'s Cube' : 'Flower of Life'
      }
    });

  } catch (error) {
    console.error('AI description error:', error);
    return NextResponse.json({
      description: 'A mysterious blend that defies description... the universe speaks in colors beyond language.',
      price: '$137',
      mysticalProperties: {
        vibrationalFreq: '528Hz',
        dimensionalDepth: 'Infinite',
        sacredGeometry: 'Golden Ratio'
      }
    });
  }
}

export async function GET() {
  return NextResponse.json({
    message: '137 Studios AI Oracle',
    status: process.env.OPENAI_API_KEY ? 'OpenAI Connected' : 'Fallback Mode',
    endpoints: {
      POST: '/api/ai-describe - Generate mystical artwork descriptions'
    }
  });
}