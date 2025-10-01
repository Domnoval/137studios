import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const artworkId = resolvedParams.id;

    // Fetch comments with user info
    const comments = await prisma.comment.findMany({
      where: { artworkId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Fetch reactions aggregated by type
    const reactionData = await prisma.reaction.groupBy({
      by: ['type'],
      where: { artworkId },
      _count: {
        type: true
      }
    });

    // Format reactions with all types
    const allReactionTypes = ['love', 'mind_blown', 'cosmic', 'transcendent', 'mystical'];
    const reactions = allReactionTypes.map(type => {
      const found = reactionData.find((r: any) => r.type === type);
      return {
        type,
        emoji: getReactionEmoji(type),
        label: getReactionLabel(type),
        count: found?._count.type || 0
      };
    });

    // Format comments
    const formattedComments = comments.map((comment: any) => ({
      id: comment.id,
      user: {
        name: comment.user.name,
        email: comment.user.email
      },
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      likes: comment._count.likes
    }));

    return NextResponse.json({
      comments: formattedComments,
      reactions,
      stats: {
        totalComments: comments.length,
        totalReactions: reactionData.reduce((sum: number, r: any) => sum + r._count.type, 0)
      }
    });

  } catch (error) {
    console.error('Community data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function getReactionEmoji(type: string): string {
  const emojis: Record<string, string> = {
    love: '💜',
    mind_blown: '🤯',
    cosmic: '🌌',
    transcendent: '✨',
    mystical: '🔮'
  };
  return emojis[type] || '✨';
}

function getReactionLabel(type: string): string {
  const labels: Record<string, string> = {
    love: 'Love',
    mind_blown: 'Mind Blown',
    cosmic: 'Cosmic',
    transcendent: 'Transcendent',
    mystical: 'Mystical'
  };
  return labels[type] || 'Energy';
}