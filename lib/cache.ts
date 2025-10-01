// 137studios Advanced Caching Strategy
// Implements multi-layer caching with Redis and optimized CDN delivery

import { Redis } from '@upstash/redis';

// Cache configuration
const CACHE_CONFIG = {
  // Cache durations in seconds
  durations: {
    artwork: 60 * 60 * 24, // 24 hours for artwork data
    gallery: 60 * 60 * 2, // 2 hours for gallery listings
    analytics: 60 * 5, // 5 minutes for analytics data
    comments: 60 * 15, // 15 minutes for comments
    reactions: 60 * 30, // 30 minutes for reactions
    user: 60 * 60, // 1 hour for user data
    search: 60 * 30, // 30 minutes for search results
    static: 60 * 60 * 24 * 7, // 1 week for static content
  },

  // Cache keys prefixes
  keys: {
    artwork: 'artwork:',
    gallery: 'gallery:',
    analytics: 'analytics:',
    comments: 'comments:',
    reactions: 'reactions:',
    user: 'user:',
    search: 'search:',
    metadata: 'meta:',
  }
};

// Initialize Redis client
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// In-memory cache fallback for development
const memoryCache = new Map<string, { data: any; expires: number }>();

// Cache interface
interface CacheOptions {
  duration?: number;
  tags?: string[];
  skipIfNotFound?: boolean;
}

class CacheManager {
  private isRedisAvailable = !!redis;

  // Generic get method
  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.isRedisAvailable && redis) {
        const data = await redis.get(key);
        return data as T;
      } else {
        // Fallback to memory cache
        const cached = memoryCache.get(key);
        if (cached && cached.expires > Date.now()) {
          return cached.data;
        }
        return null;
      }
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Generic set method
  async set(key: string, value: any, duration: number = 3600): Promise<boolean> {
    try {
      if (this.isRedisAvailable && redis) {
        await redis.setex(key, duration, JSON.stringify(value));
        return true;
      } else {
        // Fallback to memory cache
        memoryCache.set(key, {
          data: value,
          expires: Date.now() + (duration * 1000)
        });
        return true;
      }
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // Delete single key
  async delete(key: string): Promise<boolean> {
    try {
      if (this.isRedisAvailable && redis) {
        await redis.del(key);
        return true;
      } else {
        memoryCache.delete(key);
        return true;
      }
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Invalidate by pattern (Redis only)
  async invalidatePattern(pattern: string): Promise<number> {
    try {
      if (this.isRedisAvailable && redis) {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
        return keys.length;
      } else {
        // Memory cache pattern invalidation
        let deleted = 0;
        for (const key of memoryCache.keys()) {
          if (key.includes(pattern.replace('*', ''))) {
            memoryCache.delete(key);
            deleted++;
          }
        }
        return deleted;
      }
    } catch (error) {
      console.error('Cache pattern invalidation error:', error);
      return 0;
    }
  }

  // Get with automatic setting if not found
  async getOrSet<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    duration: number = 3600
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // Fetch data
      const data = await fetchFunction();

      // Set in cache
      await this.set(key, data, duration);

      return data;
    } catch (error) {
      console.error('Cache getOrSet error:', error);
      // Return fresh data if cache fails
      return await fetchFunction();
    }
  }

  // Health check
  async health(): Promise<{ redis: boolean; memory: boolean; keyCount: number }> {
    let redisHealth = false;
    let keyCount = 0;

    if (this.isRedisAvailable && redis) {
      try {
        await redis.ping();
        redisHealth = true;
        const keys = await redis.keys('*');
        keyCount = keys.length;
      } catch {
        redisHealth = false;
      }
    }

    return {
      redis: redisHealth,
      memory: true,
      keyCount: this.isRedisAvailable ? keyCount : memoryCache.size
    };
  }
}

// Create cache manager instance
export const cache = new CacheManager();

// Specialized cache functions for 137studios

export const artworkCache = {
  // Cache artwork details
  async getArtwork(id: string) {
    return cache.get(`${CACHE_CONFIG.keys.artwork}${id}`);
  },

  async setArtwork(id: string, artwork: any) {
    return cache.set(
      `${CACHE_CONFIG.keys.artwork}${id}`,
      artwork,
      CACHE_CONFIG.durations.artwork
    );
  },

  async invalidateArtwork(id: string) {
    await cache.delete(`${CACHE_CONFIG.keys.artwork}${id}`);
    // Also invalidate related gallery and search caches
    await cache.invalidatePattern(`${CACHE_CONFIG.keys.gallery}*`);
    await cache.invalidatePattern(`${CACHE_CONFIG.keys.search}*`);
  },

  // Cache gallery listings
  async getGallery(cacheKey: string) {
    return cache.get(`${CACHE_CONFIG.keys.gallery}${cacheKey}`);
  },

  async setGallery(cacheKey: string, artworks: any[]) {
    return cache.set(
      `${CACHE_CONFIG.keys.gallery}${cacheKey}`,
      artworks,
      CACHE_CONFIG.durations.gallery
    );
  }
};

export const analyticsCache = {
  // Cache analytics data
  async getAnalytics(timeRange: string) {
    return cache.get(`${CACHE_CONFIG.keys.analytics}${timeRange}`);
  },

  async setAnalytics(timeRange: string, data: any) {
    return cache.set(
      `${CACHE_CONFIG.keys.analytics}${timeRange}`,
      data,
      CACHE_CONFIG.durations.analytics
    );
  },

  async invalidateAnalytics() {
    return cache.invalidatePattern(`${CACHE_CONFIG.keys.analytics}*`);
  }
};

export const communityCache = {
  // Cache comments
  async getComments(artworkId: string) {
    return cache.get(`${CACHE_CONFIG.keys.comments}${artworkId}`);
  },

  async setComments(artworkId: string, comments: any[]) {
    return cache.set(
      `${CACHE_CONFIG.keys.comments}${artworkId}`,
      comments,
      CACHE_CONFIG.durations.comments
    );
  },

  async invalidateComments(artworkId: string) {
    return cache.delete(`${CACHE_CONFIG.keys.comments}${artworkId}`);
  },

  // Cache reactions
  async getReactions(artworkId: string) {
    return cache.get(`${CACHE_CONFIG.keys.reactions}${artworkId}`);
  },

  async setReactions(artworkId: string, reactions: any[]) {
    return cache.set(
      `${CACHE_CONFIG.keys.reactions}${artworkId}`,
      reactions,
      CACHE_CONFIG.durations.reactions
    );
  },

  async invalidateReactions(artworkId: string) {
    return cache.delete(`${CACHE_CONFIG.keys.reactions}${artworkId}`);
  }
};

export const searchCache = {
  // Cache search results
  async getSearchResults(query: string, filters: string) {
    const cacheKey = `${CACHE_CONFIG.keys.search}${Buffer.from(query + filters).toString('base64')}`;
    return cache.get(cacheKey);
  },

  async setSearchResults(query: string, filters: string, results: any[]) {
    const cacheKey = `${CACHE_CONFIG.keys.search}${Buffer.from(query + filters).toString('base64')}`;
    return cache.set(cacheKey, results, CACHE_CONFIG.durations.search);
  },

  async invalidateSearchCache() {
    return cache.invalidatePattern(`${CACHE_CONFIG.keys.search}*`);
  }
};

// CDN optimization helpers
export const cdnHelpers = {
  // Generate optimized image URLs with Vercel Image Optimization
  optimizeImageUrl(originalUrl: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
  } = {}) {
    if (!originalUrl) return '';

    const {
      width = 800,
      height,
      quality = 75,
      format = 'auto'
    } = options;

    // Use Next.js Image Optimization API
    const params = new URLSearchParams({
      url: originalUrl,
      w: width.toString(),
      q: quality.toString(),
      f: format
    });

    if (height) {
      params.set('h', height.toString());
    }

    return `/_next/image?${params.toString()}`;
  },

  // Generate srcset for responsive images
  generateSrcSet(originalUrl: string, sizes: number[] = [400, 800, 1200, 1600]) {
    return sizes
      .map(size => `${this.optimizeImageUrl(originalUrl, { width: size })} ${size}w`)
      .join(', ');
  },

  // Cache headers for static assets
  getStaticCacheHeaders() {
    return {
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
      'CDN-Cache-Control': 'public, max-age=31536000',
    };
  },

  // Cache headers for API responses
  getApiCacheHeaders(duration: number = 3600) {
    return {
      'Cache-Control': `public, max-age=${duration}, s-maxage=${duration}`,
      'CDN-Cache-Control': `public, max-age=${duration}`,
      'Vary': 'Accept-Encoding',
    };
  }
};

// Cache warming for critical data
export const cacheWarming = {
  // Warm up frequently accessed artworks
  async warmArtworkCache(artworkIds: string[]) {
    console.log('🔥 Warming artwork cache...');

    for (const id of artworkIds) {
      try {
        // This would typically fetch from database
        const artwork = await fetch(`/api/artwork/${id}`).then(r => r.json());
        await artworkCache.setArtwork(id, artwork);
      } catch (error) {
        console.error(`Failed to warm cache for artwork ${id}:`, error);
      }
    }

    console.log(`✅ Warmed cache for ${artworkIds.length} artworks`);
  },

  // Warm up gallery cache
  async warmGalleryCache() {
    console.log('🔥 Warming gallery cache...');

    try {
      const categories = ['painting', 'digital', 'print', 'installation'];

      for (const category of categories) {
        const artworks = await fetch(`/api/gallery?category=${category}`).then(r => r.json());
        await artworkCache.setGallery(category, artworks);
      }

      console.log('✅ Gallery cache warmed');
    } catch (error) {
      console.error('Failed to warm gallery cache:', error);
    }
  }
};

// Cache monitoring and metrics
export const cacheMetrics = {
  // Track cache hit/miss rates
  hits: 0,
  misses: 0,

  recordHit() {
    this.hits++;
  },

  recordMiss() {
    this.misses++;
  },

  getHitRate() {
    const total = this.hits + this.misses;
    return total > 0 ? (this.hits / total) * 100 : 0;
  },

  reset() {
    this.hits = 0;
    this.misses = 0;
  },

  getStats() {
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: this.getHitRate(),
      total: this.hits + this.misses
    };
  }
};

export default {
  cache,
  artworkCache,
  analyticsCache,
  communityCache,
  searchCache,
  cdnHelpers,
  cacheWarming,
  cacheMetrics,
  CACHE_CONFIG
};