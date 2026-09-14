/**
 * Request Deduplication for Shopping Queries
 * 
 * Prevents duplicate concurrent requests to the same providers
 * by sharing results between identical in-flight requests
 */

interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

export class RequestDeduplicator {
  private pending: Map<string, PendingRequest<any>> = new Map();
  private cache: Map<string, { result: any; timestamp: number }> = new Map();
  private cacheTTL = 1000 * 60 * 5; // 5 minutes
  private maxCacheSize = 1000;

  /**
   * Create a deduplication key from request parameters
   */
  private createKey(params: Record<string, any>): string {
    return JSON.stringify(params, Object.keys(params).sort());
  }

  /**
   * Execute a function with deduplication
   * If an identical request is in-flight, returns the same promise
   * If a recent result exists in cache, returns cached result
   */
  async execute<T>(
    key: string,
    fn: () => Promise<T>,
    options: {
      useCache?: boolean;
      cacheTTL?: number;
    } = {}
  ): Promise<T> {
    const { useCache = true, cacheTTL = this.cacheTTL } = options;

    // Check cache first
    if (useCache) {
      const cached = this.cache.get(key);
      if (cached && Date.now() - cached.timestamp < cacheTTL) {
        return cached.result as T;
      }
    }

    // Check if request is already in-flight
    const pending = this.pending.get(key);
    if (pending) {
      return pending.promise as Promise<T>;
    }

    // Execute new request
    const promise = fn()
      .then(result => {
        // Store in cache
        if (useCache) {
          this.cache.set(key, { result, timestamp: Date.now() });
          this.trimCache();
        }
        return result;
      })
      .finally(() => {
        // Remove from pending
        this.pending.delete(key);
      });

    this.pending.set(key, {
      promise,
      timestamp: Date.now(),
    });

    return promise;
  }

  /**
   * Execute a function with deduplication using a structured key
   */
  async executeWithParams<T>(
    params: Record<string, any>,
    fn: () => Promise<T>,
    options: {
      useCache?: boolean;
      cacheTTL?: number;
    } = {}
  ): Promise<T> {
    const key = this.createKey(params);
    return this.execute(key, fn, options);
  }

  /**
   * Check if a request is currently in-flight
   */
  isPending(key: string): boolean {
    return this.pending.has(key);
  }

  /**
   * Get number of pending requests
   */
  getPendingCount(): number {
    return this.pending.size;
  }

  /**
   * Get number of cached results
   */
  getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear pending requests
   */
  clearPending(): void {
    this.pending.clear();
  }

  /**
   * Trim cache to max size
   */
  private trimCache(): void {
    if (this.cache.size > this.maxCacheSize) {
      // Remove oldest entries
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, entries.length - this.maxCacheSize);
      for (const [key] of toRemove) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clean up stale entries
   */
  cleanup(maxAgeMs: number = 300000): number {
    const now = Date.now();
    let removed = 0;

    // Clean pending requests that are too old
    for (const [key, request] of this.pending.entries()) {
      if (now - request.timestamp > maxAgeMs) {
        this.pending.delete(key);
        removed++;
      }
    }

    // Clean cache entries that are too old
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > maxAgeMs) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }
}

// Export singleton instance
export const requestDeduplicator = new RequestDeduplicator();

/**
 * Deduplication key builders for common shopping operations
 */
export const DeduplicationKeys = {
  /**
   * Key for product search
   */
  search: (params: {
    query: string;
    categorySlug?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    sortBy?: string;
    limit?: number;
  }) => `search:${JSON.stringify(params)}`,

  /**
   * Key for product detail
   */
  productDetail: (slug: string) => `product:${slug}`,

  /**
   * Key for category products
   */
  categoryProducts: (categorySlug: string, limit: number) => 
    `category:${categorySlug}:${limit}`,

  /**
   * Key for recommendations
   */
  recommendations: (params: {
    categorySlug: string;
    budgetCents?: number;
    priorities: string[];
    useCases: string[];
    preferredBrands?: string[];
  }) => `recommendations:${JSON.stringify(params)}`,

  /**
   * Key for price comparison
   */
  priceComparison: (productSlugs: string[]) => 
    `compare:${productSlugs.sort().join(':')}`,

  /**
   * Key for currency conversion
   */
  currencyConversion: (amount: number, from: string, to: string) => 
    `currency:${amount}:${from}:${to}`,
};
