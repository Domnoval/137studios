import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { rateLimit } from '@/lib/rate-limit';

const prisma = new PrismaClient();

// Rate limiting for comments
const commentLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Apply rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    try {
      await commentLimiter.check(3, ip); // 3 comments per minute
    } catch {
      return NextResponse.json(
        { error: 'Too many comments. Please wait a moment.' },
        { status: 429 }
      );
    }

    const resolvedParams = await params;
    const artworkId = resolvedParams.id;
    const { content } = await request.json();

    // Validation
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length < 1 || trimmedContent.length > 500) {
      return NextResponse.json(
        { error: 'Comment must be between 1 and 500 characters' },
        { status: 400 }
      );
    }

    // Basic content moderation (can be enhanced)
    const bannedWords = ['spam', 'scam', 'fake'];
    const containsBannedWords = bannedWords.some(word =>
      trimmedContent.toLowerCase().includes(word)
    );

    if (containsBannedWords) {
      return NextResponse.json(
        { error: 'Comment contains inappropriate content' },
        { status: 400 }
      );
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: trimmedContent,
        userId: session.user.id,
        artworkId
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // Format response
    const formattedComment = {
      id: comment.id,
      user: {
        name: comment.user.name,
        email: comment.user.email
      },
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      likes: 0,
      isLiked: false
    };

    return NextResponse.json({
      success: true,
      comment: formattedComment
    });

  } catch (error) {
    console.error('Comment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}