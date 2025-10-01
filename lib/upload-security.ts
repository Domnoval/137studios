// 137studios - Secure File Upload System
// Server-side validation and security measures

import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import crypto from 'crypto';
import { STUDIO_CONFIG } from './config';

// Security configuration
const SECURITY_CONFIG = {
  maxFileSize: 50 * 1024 * 1024, // 50MB (reduced from 5GB for security)
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  maxDimensions: {
    width: 8192,
    height: 8192,
  },
  minDimensions: {
    width: 100,
    height: 100,
  },
  scanTimeout: 10000, // 10 seconds for malware scanning
};

// Comprehensive file validation
export class FileValidator {
  static async validateFile(buffer: Buffer, originalName: string): Promise<{
    isValid: boolean;
    error?: string;
    metadata?: any;
  }> {
    try {
      // 1. Size validation
      if (buffer.length > SECURITY_CONFIG.maxFileSize) {
        return {
          isValid: false,
          error: `File too large. Maximum size: ${SECURITY_CONFIG.maxFileSize / (1024 * 1024)}MB`,
        };
      }

      // 2. File type validation using magic bytes
      const fileType = await fileTypeFromBuffer(buffer);
      if (!fileType || !SECURITY_CONFIG.allowedMimeTypes.includes(fileType.mime)) {
        return {
          isValid: false,
          error: 'Invalid file type. Only images are allowed.',
        };
      }

      // 3. Extension validation
      const extension = originalName.toLowerCase().substring(originalName.lastIndexOf('.'));
      if (!SECURITY_CONFIG.allowedExtensions.includes(extension)) {
        return {
          isValid: false,
          error: 'Invalid file extension.',
        };
      }

      // 4. Image metadata validation
      let imageMetadata;
      try {
        imageMetadata = await sharp(buffer).metadata();
      } catch (error) {
        return {
          isValid: false,
          error: 'Invalid or corrupted image file.',
        };
      }

      // 5. Dimension validation
      if (
        !imageMetadata.width ||
        !imageMetadata.height ||
        imageMetadata.width < SECURITY_CONFIG.minDimensions.width ||
        imageMetadata.height < SECURITY_CONFIG.minDimensions.height ||
        imageMetadata.width > SECURITY_CONFIG.maxDimensions.width ||
        imageMetadata.height > SECURITY_CONFIG.maxDimensions.height
      ) {
        return {
          isValid: false,
          error: `Image dimensions must be between ${SECURITY_CONFIG.minDimensions.width}x${SECURITY_CONFIG.minDimensions.height} and ${SECURITY_CONFIG.maxDimensions.width}x${SECURITY_CONFIG.maxDimensions.height}`,
        };
      }

      // 6. Security scanning for embedded threats
      const securityCheck = await this.securityScan(buffer);
      if (!securityCheck.safe) {
        return {
          isValid: false,
          error: 'File failed security scan.',
        };
      }

      return {
        isValid: true,
        metadata: {
          ...imageMetadata,
          originalName,
          fileType: fileType.mime,
          size: buffer.length,
          hash: this.generateFileHash(buffer),
        },
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'File validation failed.',
      };
    }
  }

  // Security scanning for malicious content
  private static async securityScan(buffer: Buffer): Promise<{ safe: boolean; threats?: string[] }> {
    const threats: string[] = [];

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /(<script.*?>.*?<\/script>)/gi, // JavaScript injection
      /(eval\s*\()/gi, // Eval functions
      /(document\.cookie)/gi, // Cookie access
      /(window\.location)/gi, // Location manipulation
      /(\x00)/g, // Null bytes
    ];

    const bufferString = buffer.toString('utf8');

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(bufferString)) {
        threats.push(`Suspicious pattern detected: ${pattern.source}`);
      }
    }

    // Check for embedded files (zip, executable headers)
    const dangerousHeaders = [
      Buffer.from([0x50, 0x4B]), // ZIP file header
      Buffer.from([0x4D, 0x5A]), // PE executable header
      Buffer.from([0x7F, 0x45, 0x4C, 0x46]), // ELF executable
    ];

    for (const header of dangerousHeaders) {
      if (buffer.indexOf(header) !== -1) {
        threats.push('Embedded executable content detected');
      }
    }

    return {
      safe: threats.length === 0,
      threats: threats.length > 0 ? threats : undefined,
    };
  }

  // Generate secure file hash
  private static generateFileHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  // Sanitize filename
  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars
      .replace(/_{2,}/g, '_') // Remove multiple underscores
      .substring(0, 100); // Limit length
  }

  // Generate secure filename
  static generateSecureFilename(originalName: string, hash: string): string {
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const timestamp = Date.now();
    const randomSuffix = crypto.randomBytes(4).toString('hex');

    return `artwork_${timestamp}_${hash.substring(0, 8)}_${randomSuffix}${extension}`;
  }
}

// Image processing and optimization
export class ImageProcessor {
  static async processAndOptimize(buffer: Buffer, options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}): Promise<{
    optimized: Buffer;
    thumbnail: Buffer;
    metadata: any;
  }> {
    const {
      maxWidth = 2048,
      maxHeight = 2048,
      quality = 85,
      format = 'webp',
    } = options;

    try {
      // Create optimized version
      const optimized = await sharp(buffer)
        .resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFormat(format, { quality })
        .toBuffer();

      // Create thumbnail
      const thumbnail = await sharp(buffer)
        .resize(400, 400, {
          fit: 'cover',
          position: 'center',
        })
        .toFormat('webp', { quality: 75 })
        .toBuffer();

      // Get final metadata
      const metadata = await sharp(optimized).metadata();

      return {
        optimized,
        thumbnail,
        metadata,
      };
    } catch (error) {
      throw new Error('Image processing failed');
    }
  }

  // Extract color palette from image
  static async extractColors(buffer: Buffer): Promise<string[]> {
    try {
      const { data } = await sharp(buffer)
        .resize(50, 50)
        .raw()
        .toBuffer({ resolveWithObject: true });

      // Simple dominant color extraction (would use more sophisticated algorithm in production)
      const r = data[0];
      const g = data[1];
      const b = data[2];

      return [`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`];
    } catch (error) {
      return ['#9333ea']; // Fallback to cosmic purple
    }
  }
}

// Rate limiting for uploads
export class UploadRateLimit {
  private static uploads: Map<string, number[]> = new Map();

  static checkRateLimit(clientId: string, maxUploads = 5, windowMs = 60000): boolean {
    const now = Date.now();
    const uploads = this.uploads.get(clientId) || [];

    // Remove old uploads outside the window
    const recentUploads = uploads.filter(time => now - time < windowMs);

    if (recentUploads.length >= maxUploads) {
      return false; // Rate limit exceeded
    }

    // Add current upload
    recentUploads.push(now);
    this.uploads.set(clientId, recentUploads);

    return true;
  }

  static getRemainingUploads(clientId: string, maxUploads = 5, windowMs = 60000): number {
    const now = Date.now();
    const uploads = this.uploads.get(clientId) || [];
    const recentUploads = uploads.filter(time => now - time < windowMs);

    return Math.max(0, maxUploads - recentUploads.length);
  }
}

export default {
  FileValidator,
  ImageProcessor,
  UploadRateLimit,
  SECURITY_CONFIG,
};