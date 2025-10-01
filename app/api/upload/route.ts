import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FileValidator, ImageProcessor, UploadRateLimit } from '@/lib/upload-security';
import { put } from '@vercel/blob';

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

    // 2. Rate limiting
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                    request.headers.get('x-real-ip') ||
                    'unknown';
    if (!UploadRateLimit.checkRateLimit(clientIP, 5, 60000)) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please wait before uploading again.',
          remainingUploads: UploadRateLimit.getRemainingUploads(clientIP)
        },
        { status: 429 }
      );
    }

    // 3. Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadata = formData.get('metadata') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // 4. Convert file to buffer for validation
    const buffer = Buffer.from(await file.arrayBuffer());

    // 5. Comprehensive file validation
    const validation = await FileValidator.validateFile(buffer, file.name);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 6. Process and optimize image
    const processed = await ImageProcessor.processAndOptimize(buffer, {
      maxWidth: 2048,
      maxHeight: 2048,
      quality: 85,
      format: 'webp',
    });

    // 7. Extract colors for artwork metadata
    const colors = await ImageProcessor.extractColors(buffer);

    // 8. Generate secure filenames
    const secureFilename = FileValidator.generateSecureFilename(
      file.name,
      validation.metadata!.hash
    );
    const thumbnailFilename = secureFilename.replace('.', '_thumb.');

    // 9. Upload to Vercel Blob (if configured)
    let optimizedUrl = '';
    let thumbnailUrl = '';

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        // Upload optimized image
        const optimizedBlob = await put(
          `artworks/${secureFilename}`,
          processed.optimized,
          {
            access: 'public',
            contentType: 'image/webp',
          }
        );
        optimizedUrl = optimizedBlob.url;

        // Upload thumbnail
        const thumbnailBlob = await put(
          `thumbnails/${thumbnailFilename}`,
          processed.thumbnail,
          {
            access: 'public',
            contentType: 'image/webp',
          }
        );
        thumbnailUrl = thumbnailBlob.url;
      } catch (blobError) {
        console.error('Blob upload failed:', blobError);
        return NextResponse.json(
          { error: 'Storage upload failed' },
          { status: 500 }
        );
      }
    } else {
      // Fallback to local storage (development only)
      optimizedUrl = `/uploads/${secureFilename}`;
      thumbnailUrl = `/uploads/${thumbnailFilename}`;
    }

    // 10. Prepare response with comprehensive metadata
    const response = {
      success: true,
      file: {
        originalName: file.name,
        secureFilename,
        size: buffer.length,
        optimizedSize: processed.optimized.length,
        dimensions: {
          width: validation.metadata!.width,
          height: validation.metadata!.height,
        },
        optimizedDimensions: {
          width: processed.metadata.width,
          height: processed.metadata.height,
        },
        urls: {
          original: optimizedUrl,
          thumbnail: thumbnailUrl,
        },
        colors,
        hash: validation.metadata!.hash,
        uploadedAt: new Date().toISOString(),
        uploadedBy: session.user.id,
      },
      metadata: metadata ? JSON.parse(metadata) : null,
    };

    // 11. Log successful upload (for audit trail)
    console.log(`Artwork uploaded successfully: ${secureFilename} by ${session.user.name}`);

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Upload error:', error);

    return NextResponse.json(
      {
        error: 'Upload failed. Please try again.',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for file uploads.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for file uploads.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for file uploads.' },
    { status: 405 }
  );
}