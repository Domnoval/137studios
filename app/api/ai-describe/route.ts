import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { artworkTitles, blendMode, intensity } = await request.json();

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      // Fallback to mystical descriptions without API
      const mysticalDescriptions = [
        `A fusion of ${artworkTitles.join(' and ')}, where cosmic energies dance in ${blendMode} harmony`,
        `The consciousness streams of ${artworkTitles.join(', ')} merge into a singular vision of interdimensional beauty`,
        `Through ${blendMode} alchemy, ${artworkTitles.join(' & ')} transcend physical form to become pure expression`,
        `In this ${intensity}% intensity blend, ${artworkTitles.join(' meets ')} to birth new realities`,
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
          content: `Create a mystical description for a ${blendMode} blend of these artworks: ${artworkTitles.join(', ')} at ${intensity}% intensity.`
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