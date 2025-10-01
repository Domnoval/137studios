import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { emailService } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      );
    }

    const { orderNumber, trackingNumber, carrier, estimatedDelivery } = await request.json();

    // Validation
    if (!orderNumber || !trackingNumber || !carrier) {
      return NextResponse.json(
        { error: 'Order number, tracking number, and carrier are required' },
        { status: 400 }
      );
    }

    // Find the order
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { user: true }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order with shipping information
    await prisma.order.update({
      where: { orderNumber },
      data: {
        status: 'SHIPPED',
        trackingNumber,
        carrier,
        shippedAt: new Date()
      }
    });

    // Generate tracking URL based on carrier
    const trackingUrl = generateTrackingUrl(carrier, trackingNumber);

    // Send shipping notification email
    const emailSent = await emailService.sendShippingNotification({
      email: order.user.email,
      orderNumber,
      trackingNumber,
      carrier,
      estimatedDelivery: estimatedDelivery || 'Within 7-14 business days',
      trackingUrl
    });

    console.log(`📦 Shipping notification sent for order ${orderNumber}. Email sent: ${emailSent}`);

    return NextResponse.json({
      success: true,
      message: 'Shipping notification sent successfully',
      orderNumber,
      trackingNumber,
      emailSent
    });

  } catch (error) {
    console.error('Shipping notification error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send shipping notification',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET endpoint to retrieve order shipping status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      );
    }

    // Find the order (users can only see their own orders, admins can see all)
    const whereClause = session.user?.role === 'admin'
      ? { orderNumber }
      : { orderNumber, userId: session.user?.id };

    const order = await prisma.order.findUnique({
      where: whereClause,
      select: {
        orderNumber: true,
        status: true,
        trackingNumber: true,
        carrier: true,
        shippedAt: true,
        totalAmount: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          select: {
            type: true,
            quantity: true,
            price: true,
            productDetails: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Add tracking URL if available
    const trackingUrl = order.trackingNumber && order.carrier
      ? generateTrackingUrl(order.carrier, order.trackingNumber)
      : null;

    return NextResponse.json({
      ...order,
      trackingUrl
    });

  } catch (error) {
    console.error('Get shipping status error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve shipping status' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function generateTrackingUrl(carrier: string, trackingNumber: string): string {
  const urls: Record<string, string> = {
    'ups': `https://www.ups.com/track?tracknum=${trackingNumber}`,
    'fedex': `https://www.fedex.com/fedextrack/?tracknumber=${trackingNumber}`,
    'usps': `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${trackingNumber}`,
    'dhl': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
    'printful': `https://www.printful.com/tracking/${trackingNumber}`,
    'printify': `https://printify.com/tracking/${trackingNumber}`
  };

  const normalizedCarrier = carrier.toLowerCase().replace(/\s+/g, '');
  return urls[normalizedCarrier] || `https://www.google.com/search?q=track+package+${trackingNumber}`;
}