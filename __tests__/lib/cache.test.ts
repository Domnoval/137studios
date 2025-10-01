import { cache, artworkCache, cacheMetrics, CACHE_CONFIG } from '@/lib/cache'

// Mock Upstash Redis
jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    ping: jest.fn(),
  })),
}))

describe('Cache System', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    cacheMetrics.reset()
  })

  describe('Basic Cache Operations', () => {
    it('sets and gets values from memory cache when Redis is not available', async () => {
      // Test in memory fallback mode
      const testKey = 'test:key'
      const testValue = { cosmic: 'data', number: 137 }

      const setResult = await cache.set(testKey, testValue, 3600)
      expect(setResult).toBe(true)

      const getValue = await cache.get(testKey)
      expect(getValue).toEqual(testValue)
    })

    it('returns null for non-existent keys', async () => {
      const value = await cache.get('non-existent-key')
      expect(value).toBeNull()
    })

    it('deletes keys successfully', async () => {
      const testKey = 'test:delete'
      const testValue = 'cosmic-value'

      await cache.set(testKey, testValue)
      const deleteResult = await cache.delete(testKey)
      expect(deleteResult).toBe(true)

      const getValue = await cache.get(testKey)
      expect(getValue).toBeNull()
    })

    it('handles cache expiration in memory mode', async () => {
      jest.useFakeTimers()

      const testKey = 'test:expiry'
      const testValue = 'expires-soon'

      // Set with 1 second expiry
      await cache.set(testKey, testValue, 1)

      // Should exist immediately
      let value = await cache.get(testKey)
      expect(value).toBe(testValue)

      // Fast forward 2 seconds
      jest.advanceTimersByTime(2000)

      // Should be expired
      value = await cache.get(testKey)
      expect(value).toBeNull()

      jest.useRealTimers()
    })
  })

  describe('getOrSet functionality', () => {
    it('fetches and caches data when not in cache', async () => {
      const fetchFunction = jest.fn().mockResolvedValue({ cosmic: 'fresh-data' })

      const result = await cache.getOrSet('test:fetch', fetchFunction, 3600)

      expect(fetchFunction).toHaveBeenCalledTimes(1)
      expect(result).toEqual({ cosmic: 'fresh-data' })

      // Second call should use cache
      const cachedResult = await cache.getOrSet('test:fetch', fetchFunction, 3600)
      expect(fetchFunction).toHaveBeenCalledTimes(1) // Still only called once
      expect(cachedResult).toEqual({ cosmic: 'fresh-data' })
    })

    it('returns fresh data when cache fails', async () => {
      const fetchFunction = jest.fn().mockResolvedValue({ cosmic: 'fallback-data' })

      // Mock cache.get to throw an error
      jest.spyOn(cache, 'get').mockRejectedValue(new Error('Cache failure'))

      const result = await cache.getOrSet('test:error', fetchFunction, 3600)

      expect(result).toEqual({ cosmic: 'fallback-data' })
      expect(fetchFunction).toHaveBeenCalledTimes(1)
    })
  })

  describe('Pattern invalidation', () => {
    it('invalidates keys matching pattern in memory cache', async () => {
      await cache.set('artwork:1', { title: 'Cosmic Birth' })
      await cache.set('artwork:2', { title: 'Digital Ayahuasca' })
      await cache.set('user:1', { name: 'Artist' })

      const deletedCount = await cache.invalidatePattern('artwork:*')

      expect(deletedCount).toBe(2)

      // Artwork keys should be gone
      expect(await cache.get('artwork:1')).toBeNull()
      expect(await cache.get('artwork:2')).toBeNull()

      // User key should remain
      expect(await cache.get('user:1')).toEqual({ name: 'Artist' })
    })
  })

  describe('Artwork Cache', () => {
    it('caches and retrieves artwork data', async () => {
      const artworkData = {
        id: '1',
        title: 'Cosmic Birth',
        category: 'painting',
        price: '$8,888'
      }

      const setResult = await artworkCache.setArtwork('1', artworkData)
      expect(setResult).toBe(true)

      const retrievedArtwork = await artworkCache.getArtwork('1')
      expect(retrievedArtwork).toEqual(artworkData)
    })

    it('invalidates related caches when artwork is updated', async () => {
      // Setup some cached data
      await artworkCache.setArtwork('1', { title: 'Original' })
      await artworkCache.setGallery('all', [{ id: '1' }])

      // Spy on cache methods
      const deleteSpy = jest.spyOn(cache, 'delete')
      const invalidatePatternSpy = jest.spyOn(cache, 'invalidatePattern')

      await artworkCache.invalidateArtwork('1')

      expect(deleteSpy).toHaveBeenCalledWith(`${CACHE_CONFIG.keys.artwork}1`)
      expect(invalidatePatternSpy).toHaveBeenCalledWith(`${CACHE_CONFIG.keys.gallery}*`)
      expect(invalidatePatternSpy).toHaveBeenCalledWith(`${CACHE_CONFIG.keys.search}*`)
    })
  })

  describe('Cache Metrics', () => {
    it('tracks hit and miss rates', () => {
      expect(cacheMetrics.getHitRate()).toBe(0)

      cacheMetrics.recordHit()
      cacheMetrics.recordHit()
      cacheMetrics.recordMiss()

      expect(cacheMetrics.getHitRate()).toBe(66.67) // 2/3 * 100, rounded

      const stats = cacheMetrics.getStats()
      expect(stats).toEqual({
        hits: 2,
        misses: 1,
        hitRate: 66.67,
        total: 3
      })
    })

    it('resets metrics correctly', () => {
      cacheMetrics.recordHit()
      cacheMetrics.recordMiss()
      cacheMetrics.reset()

      expect(cacheMetrics.getStats()).toEqual({
        hits: 0,
        misses: 0,
        hitRate: 0,
        total: 0
      })
    })
  })

  describe('Cache Health Check', () => {
    it('reports health status', async () => {
      await cache.set('test:health', 'healthy')

      const health = await cache.health()

      expect(health).toHaveProperty('redis', false) // Not available in test
      expect(health).toHaveProperty('memory', true)
      expect(health).toHaveProperty('keyCount')
      expect(typeof health.keyCount).toBe('number')
    })
  })

  describe('Error Handling', () => {
    it('handles cache errors gracefully', async () => {
      // Mock console.error to avoid noise in test output
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      // Mock an operation that fails
      jest.spyOn(cache, 'get').mockRejectedValueOnce(new Error('Cache error'))

      const result = await cache.get('error-key')
      expect(result).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith('Cache get error:', expect.any(Error))

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Cache Configuration', () => {
    it('has proper cache durations configured', () => {
      expect(CACHE_CONFIG.durations.artwork).toBe(60 * 60 * 24) // 24 hours
      expect(CACHE_CONFIG.durations.gallery).toBe(60 * 60 * 2) // 2 hours
      expect(CACHE_CONFIG.durations.analytics).toBe(60 * 5) // 5 minutes
      expect(CACHE_CONFIG.durations.static).toBe(60 * 60 * 24 * 7) // 1 week
    })

    it('has proper cache key prefixes', () => {
      expect(CACHE_CONFIG.keys.artwork).toBe('artwork:')
      expect(CACHE_CONFIG.keys.gallery).toBe('gallery:')
      expect(CACHE_CONFIG.keys.analytics).toBe('analytics:')
      expect(CACHE_CONFIG.keys.search).toBe('search:')
    })
  })
})