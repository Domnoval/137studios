import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrintManager } from '@/lib/print-providers';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      );
    }

    const { artworkUrl, productTypes, artworkTitle, artworkId } = await request.json();

    // Validation
    if (!artworkUrl || !productTypes || !artworkTitle || !artworkId) {
      return NextResponse.json(
        { error: 'Missing required fields: artworkUrl, productTypes, artworkTitle, artworkId' },
        { status: 400 }
      );
    }

    if (!Array.isArray(productTypes) || productTypes.length === 0) {
      return NextResponse.json(
        { error: 'productTypes must be a non-empty array' },
        { status: 400 }
      );
    }

    const printManager = new PrintManager();
    const results = [];

    // Create products for each selected type
    for (const productType of productTypes) {
      try {
        console.log(`Creating ${productType} for artwork: ${artworkTitle}`);

        const productIds = await printManager.createProductOnAllPlatforms(
          artworkUrl,
          productType,
          artworkTitle
        );

        results.push({
          productType,
          success: true,
          printful: productIds.printful,
          printify: productIds.printify,
        });

        console.log(`Successfully created ${productType}:`, productIds);
      } catch (error) {
        console.error(`Failed to create ${productType}:`, error);
        results.push({
          productType,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // TODO: Save product IDs to database
    // await prisma.artwork.update({
    //   where: { id: artworkId },
    //   data: {
    //     printProducts: results.filter(r => r.success)
    //   }
    // });

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return NextResponse.json({
      success: successCount > 0,
      message: `Created ${successCount}/${totalCount} print products successfully`,
      results,
      artworkId,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount,
      },
    });

  } catch (error) {
    console.error('Print product creation error:', error);

    return NextResponse.json(
      {
        error: 'Failed to create print products',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}

// Get available print product types
export async function GET() {
  try {
    const productTypes = [
      {
        type: 'canvas',
        name: 'Canvas Print',
        basePrice: 89,
        description: 'Premium canvas print with wooden frame',
        sizes: ['16x20', '20x24', '24x36'],
        recommended: true,
      },
      {
        type: 'poster',
        name: 'Art Poster',
        basePrice: 25,
        description: 'High-quality paper poster',
        sizes: ['18x24', '24x36', '36x48'],
        recommended: true,
      },
      {
        type: 'shirt',
        name: 'Art T-Shirt',
        basePrice: 35,
        description: 'Soft cotton t-shirt with artwork',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        recommended: false,
      },
      {
        type: 'mug',
        name: 'Art Mug',
        basePrice: 18,
        description: 'Ceramic mug with mystical artwork',
        sizes: ['11oz', '15oz'],
        recommended: false,
      },
      {
        type: 'phone-case',
        name: 'Phone Case',
        basePrice: 22,
        description: 'Protective case with artwork',
        sizes: ['iPhone', 'Samsung'],
        recommended: false,
      },
      {
        type: 'sticker',
        name: 'Sticker Pack',
        basePrice: 8,
        description: 'Vinyl stickers perfect for laptops',
        sizes: ['3x3', '4x4', '6x6'],
        recommended: true,
      },
    ];

    return NextResponse.json({
      productTypes,
      totalTypes: productTypes.length,
      recommended: productTypes.filter(p => p.recommended),
    });

  } catch (error) {
    console.error('Failed to get product types:', error);

    return NextResponse.json(
      { error: 'Failed to fetch product types' },
      { status: 500 }
    );
  }
}