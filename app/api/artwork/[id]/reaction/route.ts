import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    const resolvedParams = await params;
    const artworkId = resolvedParams.id;
    const { type } = await request.json();

    // Validate reaction type
    const validTypes = ['love', 'mind_blown', 'cosmic', 'transcendent', 'mystical'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid reaction type' },
        { status: 400 }
      );
    }

    // Check if user already reacted with this type
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        userId_artworkId_type: {
          userId: session.user.id,
          artworkId,
          type
        }
      }
    });

    let isSelected: boolean;
    let count: number;

    if (existingReaction) {
      // Remove reaction (toggle off)
      await prisma.reaction.delete({
        where: { id: existingReaction.id }
      });
      isSelected = false;
    } else {
      // Add reaction
      await prisma.reaction.create({
        data: {
          userId: session.user.id,
          artworkId,
          type
        }
      });
      isSelected = true;
    }

    // Get updated count
    count = await prisma.reaction.count({
      where: {
        artworkId,
        type
      }
    });

    return NextResponse.json({
      success: true,
      type,
      count,
      isSelected
    });

  } catch (error) {
    console.error('Reaction error:', error);
    return NextResponse.json(
      { error: 'Failed to update reaction' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}