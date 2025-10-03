import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { artworks } = body;

    if (!artworks || !Array.isArray(artworks) || artworks.length === 0) {
      return NextResponse.json(
        { error: 'No artworks provided' },
        { status: 400 }
      );
    }

    // 4. Save each artwork to database
    const savedArtworks = [];
    const errors = [];

    for (const artwork of artworks) {
      try {
        const { file, aiSuggestions } = artwork;

        // Validate required fields
        if (!file || !file.urls || !aiSuggestions) {
          errors.push({
            file: file?.originalName || 'unknown',
            error: 'Missing required data',
          });
          continue;
        }

        // Create artwork record
        const created = await prisma.artwork.create({
          data: {
            // Basic info (from AI or defaults)
            title: aiSuggestions.title || `Untitled ${Date.now()}`,
            description: aiSuggestions.description || 'Awaiting description...',
            category: 'DIGITAL', // Default, can be changed later
            medium: aiSuggestions.style || 'Digital Art',
            year: new Date().getFullYear(),
            price: aiSuggestions.price || '$137',
            color: file.colorPalette?.[0] || '#9333ea',

            // File storage
            originalUrl: file.urls.original,
            thumbnailUrl: file.urls.thumbnail,

            // File metadata
            fileSize: file.size,
            optimizedSize: file.optimizedSize,
            width: file.optimizedDimensions?.width,
            height: file.optimizedDimensions?.height,
            format: 'webp',
            fileHash: file.hash,

            // AI suggestions (stored for reference)
            aiSuggestedTitle: aiSuggestions.title,
            aiSuggestedDesc: aiSuggestions.description,
            aiSuggestedTags: aiSuggestions.tags || [],
            aiDetectedStyle: aiSuggestions.style,
            aiDetectedMood: aiSuggestions.mood,
            aiSuggestedPrice: aiSuggestions.price,
            aiConfidence: aiSuggestions.confidence,
            aiProcessedAt: aiSuggestions.processedAt ? new Date(aiSuggestions.processedAt) : new Date(),

            // Color palette
            colorPalette: file.colorPalette || [],

            // Upload tracking
            uploadStatus: 'COMPLETED',
            uploadedAt: file.uploadedAt ? new Date(file.uploadedAt) : new Date(),
            uploadedBy: file.uploadedBy || session.user.id,
            originalFilename: file.originalName,

            // Transformations
            autoStraightened: file.transformations?.autoStraightened || false,
            autoCropped: file.transformations?.autoCropped || false,

            // Relations
            artistId: session.user.id,
          },
        });

        savedArtworks.push(created);

        console.log(`Artwork saved: ${created.title} (${created.id})`);
      } catch (error) {
        console.error('Failed to save artwork:', error);
        errors.push({
          file: artwork.file?.originalName || 'unknown',
          error: error instanceof Error ? error.message : 'Save failed',
        });
      }
    }

    // 4. Return results
    return NextResponse.json({
      success: true,
      saved: savedArtworks.length,
      total: artworks.length,
      artworks: savedArtworks,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Save artworks error:', error);

    return NextResponse.json(
      {
        error: 'Failed to save artworks',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}
