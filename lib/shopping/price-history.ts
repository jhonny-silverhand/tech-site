/**
 * Price History Persistence Layer
 * 
 * Stores and retrieves price history using PostgreSQL
 * Falls back to in-memory storage when database is unavailable
 */

import { createClient } from '@/lib/supabase/server';

export interface PriceHistoryEntry {
  id?: string;
  productId: string;
  retailerId: string;
  price: number;
  currency: string;
  timestamp: string;
}

export interface PriceHistoryStats {
  currentPrice: number | null;
  lowestPrice: number | null;
  highestPrice: number | null;
  averagePrice: number | null;
  priceChange: number;
  priceChangePercent: number;
  lastUpdated: string | null;
  dataPoints: number;
}

export class PriceHistoryService {
  private static instance: PriceHistoryService;
  private inMemoryCache: Map<string, PriceHistoryEntry[]> = new Map();
  private maxCacheSize = 10000;
  private cacheTTL = 1000 * 60 * 60 * 24 * 30; // 30 days

  static getInstance(): PriceHistoryService {
    if (!PriceHistoryService.instance) {
      PriceHistoryService.instance = new PriceHistoryService();
    }
    return PriceHistoryService.instance;
  }

  /**
   * Record a price point for a product
   */
  async recordPrice(
    productId: string,
    retailerId: string,
    price: number,
    currency: string = 'INR'
  ): Promise<boolean> {
    const entry: PriceHistoryEntry = {
      productId,
      retailerId,
      price,
      currency,
      timestamp: new Date().toISOString(),
    };

    // Try to store in database
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('price_history')
        .insert({
          product_id: productId,
          retailer_id: retailerId,
          price_cents: Math.round(price * 100),
          currency,
          recorded_at: entry.timestamp,
        });

      if (error) {
        console.warn('[PriceHistory] Failed to store in database:', error);
        // Fall back to in-memory
        this.recordInMemory(entry);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[PriceHistory] Database unavailable, using in-memory:', err);
      this.recordInMemory(entry);
      return false;
    }
  }

  /**
   * Record price in memory (fallback)
   */
  private recordInMemory(entry: PriceHistoryEntry): void {
    const key = `${entry.productId}:${entry.retailerId}`;
    
    if (!this.inMemoryCache.has(key)) {
      this.inMemoryCache.set(key, []);
    }
    
    const history = this.inMemoryCache.get(key)!;
    history.push(entry);
    
    // Trim old entries
    const now = Date.now();
    const filtered = history.filter(e => 
      now - new Date(e.timestamp).getTime() < this.cacheTTL
    );
    this.inMemoryCache.set(key, filtered);
    
    // Trim cache size
    if (this.inMemoryCache.size > this.maxCacheSize) {
      const firstKey = this.inMemoryCache.keys().next().value;
      if (firstKey) this.inMemoryCache.delete(firstKey);
    }
  }

  /**
   * Get price history for a product
   */
  async getPriceHistory(
    productId: string,
    options: {
      retailerId?: string;
      days?: number;
      limit?: number;
    } = {}
  ): Promise<PriceHistoryEntry[]> {
    const { retailerId, days = 30, limit = 100 } = options;

    // Try database first
    try {
      const supabase = await createClient();
      let query = supabase
        .from('price_history')
        .select('*')
        .eq('product_id', productId)
        .gte('recorded_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false })
        .limit(limit);

      if (retailerId) {
        query = query.eq('retailer_id', retailerId);
      }

      const { data, error } = await query;

      if (error) {
        console.warn('[PriceHistory] Database query failed:', error);
        return this.getFromMemory(productId, retailerId, days, limit);
      }

      return (data || []).map(row => ({
        id: row.id,
        productId: row.product_id,
        retailerId: row.retailer_id,
        price: row.price_cents / 100,
        currency: row.currency,
        timestamp: row.recorded_at,
      }));
    } catch (err) {
      console.warn('[PriceHistory] Database unavailable, using memory:', err);
      return this.getFromMemory(productId, retailerId, days, limit);
    }
  }

  /**
   * Get price history from memory
   */
  private getFromMemory(
    productId: string,
    retailerId?: string,
    days?: number,
    limit?: number
  ): PriceHistoryEntry[] {
    const cutoff = days ? Date.now() - days * 24 * 60 * 60 * 1000 : 0;
    const results: PriceHistoryEntry[] = [];

    for (const [key, history] of this.inMemoryCache.entries()) {
      if (!key.startsWith(`${productId}:`)) continue;
      if (retailerId && !key.endsWith(`:${retailerId}`)) continue;

      for (const entry of history) {
        if (cutoff && new Date(entry.timestamp).getTime() < cutoff) continue;
        results.push(entry);
      }
    }

    return results
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit || 100);
  }

  /**
   * Get price statistics for a product
   */
  async getPriceStats(productId: string): Promise<PriceHistoryStats> {
    const history = await this.getPriceHistory(productId, { days: 90 });

    if (history.length === 0) {
      return {
        currentPrice: null,
        lowestPrice: null,
        highestPrice: null,
        averagePrice: null,
        priceChange: 0,
        priceChangePercent: 0,
        lastUpdated: null,
        dataPoints: 0,
      };
    }

    // Get latest price per retailer
    const retailerLatest = new Map<string, PriceHistoryEntry>();
    for (const entry of history) {
      const existing = retailerLatest.get(entry.retailerId);
      if (!existing || new Date(entry.timestamp) > new Date(existing.timestamp)) {
        retailerLatest.set(entry.retailerId, entry);
      }
    }

    const latestPrices = Array.from(retailerLatest.values()).map(e => e.price);
    const currentPrice = Math.min(...latestPrices);
    const lowestPrice = Math.min(...history.map(e => e.price));
    const highestPrice = Math.max(...history.map(e => e.price));
    const averagePrice = latestPrices.reduce((a, b) => a + b, 0) / latestPrices.length;

    // Calculate price change (compare current to 30 days ago)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const oldPrices = history
      .filter(e => new Date(e.timestamp).getTime() < thirtyDaysAgo)
      .map(e => e.price);
    
    let priceChange = 0;
    let priceChangePercent = 0;
    
    if (oldPrices.length > 0) {
      const oldAvg = oldPrices.reduce((a, b) => a + b, 0) / oldPrices.length;
      priceChange = currentPrice - oldAvg;
      priceChangePercent = oldAvg > 0 ? (priceChange / oldAvg) * 100 : 0;
    }

    return {
      currentPrice,
      lowestPrice,
      highestPrice,
      averagePrice: Math.round(averagePrice),
      priceChange: Math.round(priceChange),
      priceChangePercent: Math.round(priceChangePercent * 100) / 100,
      lastUpdated: history[0]?.timestamp || null,
      dataPoints: history.length,
    };
  }

  /**
   * Check if price is stale (needs refresh)
   */
  isPriceStale(lastChecked: string, maxAgeHours: number = 24): boolean {
    const lastCheckedTime = new Date(lastChecked).getTime();
    const now = Date.now();
    const ageHours = (now - lastCheckedTime) / (1000 * 60 * 60);
    return ageHours > maxAgeHours;
  }

  /**
   * Get freshness label for price
   */
  static getPriceFreshnessLabel(lastChecked: string): string {
    const lastCheckedTime = new Date(lastChecked).getTime();
    const now = Date.now();
    const ageMs = now - lastCheckedTime;
    const ageMinutes = Math.floor(ageMs / (1000 * 60));
    const ageHours = Math.floor(ageMs / (1000 * 60 * 60));
    const ageDays = Math.floor(ageHours / 24);

    if (ageMinutes < 60) return `Updated ${ageMinutes} min ago`;
    if (ageHours < 24) return `Updated ${ageHours}h ago`;
    if (ageDays === 1) return 'Updated yesterday';
    if (ageDays < 7) return `Updated ${ageDays} days ago`;
    return `Updated ${ageDays} days ago (may be stale)`;
  }

  /**
   * Clean up old price history records
   */
  async cleanup(olderThanDays: number = 90): Promise<number> {
    try {
      const supabase = await createClient();
      const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000).toISOString();
      
      const { count, error } = await supabase
        .from('price_history')
        .delete()
        .lt('recorded_at', cutoffDate);

      if (error) {
        console.warn('[PriceHistory] Cleanup failed:', error);
        return 0;
      }

      return count || 0;
    } catch (err) {
      console.warn('[PriceHistory] Cleanup failed:', err);
      return 0;
    }
  }
}

// Export singleton
export const priceHistoryService = PriceHistoryService.getInstance();

// SQL to create the price_history table (for reference)
export const CREATE_PRICE_HISTORY_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  retailer_id UUID NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
  price_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_retailer_id ON price_history(retailer_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON price_history(recorded_at);
CREATE INDEX IF NOT EXISTS idx_price_history_product_retailer ON price_history(product_id, retailer_id);

-- Enable RLS
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users
CREATE POLICY "Allow read access to price history" ON price_history
  FOR SELECT USING (true);

-- Allow insert/update for authenticated users (admin)
CREATE POLICY "Allow insert for authenticated users" ON price_history
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON price_history
  FOR UPDATE USING (auth.role() = 'authenticated');
`;
