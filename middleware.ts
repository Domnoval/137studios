import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis for rate limiting (use in-memory fallback for development)
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : undefined;

// Rate limiting configurations
const createRateLimit = (requests: number, window: "1 m" | "1 h") => {
  if (!redis) {
    // In-memory fallback for development
    const memory = new Map();
    return {
      limit: async (identifier: string) => {
        const key = `${identifier}_${window}`;
        const now = Date.now();
        const windowMs = window === '1 m' ? 60000 : window === '1 h' ? 3600000 : 60000;

        if (!memory.has(key)) {
          memory.set(key, []);
        }

        const timestamps = memory.get(key).filter((time: number) => now - time < windowMs);

        if (timestamps.length >= requests) {
          return { success: false, limit: requests, remaining: 0, reset: now + windowMs };
        }

        timestamps.push(now);
        memory.set(key, timestamps);

        return { success: true, limit: requests, remaining: requests - timestamps.length, reset: now + windowMs };
      }
    };
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
  });
};

// Different rate limits for different routes
const apiRateLimit = createRateLimit(50, '1 m'); // 50 requests per minute for general API
const uploadRateLimit = createRateLimit(5, '1 m'); // 5 uploads per minute
const authRateLimit = createRateLimit(10, '1 m'); // 10 auth attempts per minute
const remixRateLimit = createRateLimit(20, '1 m'); // 20 remix requests per minute

// Get client identifier (IP address with fallbacks)
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = forwarded?.split(',')[0].trim() || realIP || 'unknown';
  return clientIP;
}

// Security headers
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy - less strict in development
  const isDev = process.env.NODE_ENV === 'development';

  const cspDirectives = isDev
    ? // Development: Allow unsafe-inline for Next.js
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: blob: https://*.vercel-storage.com; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https://api.openai.com https://*.vercel-storage.com https://vitals.vercel-insights.com ws://localhost:* ws://10.255.255.254:*; " +
      "media-src 'self' blob:; " +
      "object-src 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self';"
    : // Production: Strict CSP
      "default-src 'self'; " +
      "script-src 'self' https://vercel.live https://va.vercel-scripts.com; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: blob: https://*.vercel-storage.com; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https://api.openai.com https://*.vercel-storage.com https://vitals.vercel-insights.com; " +
      "media-src 'self' blob:; " +
      "object-src 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self';";

  response.headers.set('Content-Security-Policy', cspDirectives);

  // Other security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);

  if (pathname.startsWith('/api/upload')) {
    console.log('=== MIDDLEWARE: Upload request ===', {
      pathname,
      clientIP,
      method: request.method,
    });
  }

  // Apply rate limiting based on route
  let rateLimit;
  let rateLimitKey = clientIP;

  if (pathname.startsWith('/api/upload')) {
    rateLimit = uploadRateLimit;
    rateLimitKey = `upload_${clientIP}`;
  } else if (pathname.startsWith('/api/auth')) {
    rateLimit = authRateLimit;
    rateLimitKey = `auth_${clientIP}`;
  } else if (pathname.includes('remix') || pathname.includes('ai-describe')) {
    rateLimit = remixRateLimit;
    rateLimitKey = `remix_${clientIP}`;
  } else if (pathname.startsWith('/api/')) {
    rateLimit = apiRateLimit;
    rateLimitKey = `api_${clientIP}`;
  }

  // Apply rate limiting
  if (rateLimit) {
    try {
      if (pathname.startsWith('/api/upload')) {
        console.log('MIDDLEWARE: Checking rate limit for upload...');
      }

      const result = await rateLimit.limit(rateLimitKey);

      if (pathname.startsWith('/api/upload')) {
        console.log('MIDDLEWARE: Rate limit result:', result);
      }

      if (!result.success) {
        console.log('MIDDLEWARE: Rate limit exceeded - returning 429');
        return new NextResponse(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please wait before trying again.',
            limit: result.limit,
            remaining: result.remaining,
            reset: new Date(result.reset).toISOString(),
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': result.limit.toString(),
              'X-RateLimit-Remaining': result.remaining.toString(),
              'X-RateLimit-Reset': result.reset.toString(),
              'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
            },
          }
        );
      }

      // Add rate limit headers to successful responses
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', result.limit.toString());
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      response.headers.set('X-RateLimit-Reset', result.reset.toString());

      if (pathname.startsWith('/api/upload')) {
        console.log('MIDDLEWARE: Rate limit passed, forwarding to upload route');
      }

      return addSecurityHeaders(response);
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Continue without rate limiting if service is down
    }
  }

  // Admin route protection
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Add authentication check here if needed
    // For now, let NextAuth handle it
  }

  // Apply security headers to all responses
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match admin routes
    '/admin/:path*',
    // Skip static files and images
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};