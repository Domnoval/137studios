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
    const commentId = resolvedParams.id;

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Check if user already liked this comment
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: session.user.id,
          commentId
        }
      }
    });

    let isLiked: boolean;
    let likes: number;

    if (existingLike) {
      // Remove like (unlike)
      await prisma.commentLike.delete({
        where: { id: existingLike.id }
      });
      isLiked = false;
    } else {
      // Add like
      await prisma.commentLike.create({
        data: {
          userId: session.user.id,
          commentId
        }
      });
      isLiked = true;
    }

    // Get updated like count
    likes = await prisma.commentLike.count({
      where: { commentId }
    });

    return NextResponse.json({
      success: true,
      likes,
      isLiked
    });

  } catch (error) {
    console.error('Comment like error:', error);
    return NextResponse.json(
      { error: 'Failed to update like' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}