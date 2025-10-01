// Rate limiting utility for 137studios API endpoints
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Redis client for rate limiting
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max unique tokens per interval
}

// Create rate limiter factory
export function rateLimit(config: RateLimitConfig) {
  if (!redis) {
    // In development or when Redis is not available, return a mock limiter
    return {
      check: async (limit: number, token: string) => {
        // Allow all requests in development
        return Promise.resolve()
      }
    }
  }

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.uniqueTokenPerInterval, `${config.interval}ms`),
    analytics: true,
  })

  return {
    check: async (limit: number, token: string) => {
      const result = await limiter.limit(token)
      if (!result.success) {
        throw new Error('Rate limit exceeded')
      }
      return result
    }
  }
}

// Pre-configured rate limiters for common use cases
export const authLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 10, // 10 attempts per IP
})

export const apiLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100, // 100 requests per minute
})

export const commentLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 5, // 5 comments per minute
})

export const uploadLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 10, // 10 uploads per minute
})