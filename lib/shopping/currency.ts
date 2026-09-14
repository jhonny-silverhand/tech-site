/**
 * Currency Conversion & Exchange Rate Utilities
 * 
 * Handles INR conversion, exchange rate fetching, and price formatting
 * Supports multiple exchange rate providers with fallback
 */

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: string;
  source: string;
}

export interface ConversionResult {
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  targetCurrency: string;
  rate: number;
  rateTimestamp: string;
  source: string;
  isApproximate: boolean;
}

export interface ExchangeRateProvider {
  name: string;
  getRate(from: string, to: string): Promise<number | null>;
  getSupportedCurrencies(): string[];
  isEnabled(): boolean;
}

/**
 * Exchange Rate Providers
 */

// ExchangeRate-API (free tier: 1500 requests/month)
class ExchangeRateAPIProvider {
  private baseUrl = 'https://v6.exchangerate-api.com/v6';
  private apiKey: string;
  private cache: Map<string, { rate: number; timestamp: number }> = new Map();
  private cacheTTL = 1000 * 60 * 60; // 1 hour cache

  constructor() {
    this.apiKey = process.env.EXCHANGE_RATE_API_KEY || '';
  }

  getName(): string {
    return 'ExchangeRate-API';
  }

  isEnabled(): boolean {
    return !!process.env.EXCHANGE_RATE_API_KEY;
  }

  async getRate(from: string, to: string): Promise<number | null> {
    if (!this.isEnabled()) return null;

    const cacheKey = `${from}_${to}`;
    const cached = this.cache.get(`${from}_${to}`);
    
    if (cached && Date.now() - cached.timestamp < 1000 * 60 * 60) { // 1 hour cache
      return cached.rate;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/${this.apiKey}/pair/${from}/${to}`,
        { headers: { 'Accept': 'application/json' } }
      );

      if (!response.ok) return null;

      const data = await response.json();
      
      if (data.result === 'success' && data.conversion_rate) {
        const rate = data.conversion_rate;
        this.cache.set(`${from}_${to}`, { rate, timestamp: Date.now() });
        return rate;
      }
      
      return null;
    } catch (error) {
      console.error('[Currency] ExchangeRate-API error:', error);
      return null;
    }
  }

  getSupportedCurrencies(): string[] {
    return ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'CNY', 'SGD', 'AUD', 'CAD', 'AED'];
  }
}

// Fallback: Fixed rates (for development/fallback)
class FixedRateProvider {
  // Approximate rates as of 2024 - should be updated regularly
  private static readonly FIXED_RATES: Record<string, number> = {
    'USD_INR': 83.5,
    'EUR_INR': 90.5,
    'GBP_INR': 104.2,
    'JPY_INR': 0.56,
    'CNY_INR': 11.6,
    'SGD_INR': 62.3,
    'AUD_INR': 54.8,
    'CAD_INR': 61.2,
    'AED_INR': 22.7,
    'USD_EUR': 0.92,
    'USD_GBP': 0.79,
    'USD_JPY': 149.5,
    'USD_CNY': 7.24,
    'USD_SGD': 1.34,
    'USD_AUD': 1.52,
    'USD_CAD': 1.36,
    'USD_AED': 3.67,
  };

  getName(): string {
    return 'Fixed Rates (Fallback)';
  }

  isEnabled(): boolean {
    return true; // Always enabled as fallback
  }

  async getRate(from: string, to: string): Promise<number | null> {
    const key = `${from}_${to}`;
    const reverseKey = `${to}_${from}`;
    
    if (FixedRateProvider.FIXED_RATES[key]) {
      return FixedRateProvider.FIXED_RATES[key];
    }
    
    if (FixedRateProvider.FIXED_RATES[reverseKey]) {
      return 1 / FixedRateProvider.FIXED_RATES[reverseKey];
    }
    
    // Try USD as intermediate
    if (FixedRateProvider.FIXED_RATES[`USD_${to}`] && FixedRateProvider.FIXED_RATES[`USD_${from}`]) {
      return FixedRateProvider.FIXED_RATES[`USD_${to}`] / FixedRateProvider.FIXED_RATES[`USD_${from}`];
    }
    
    return null;
  }

  getSupportedCurrencies(): string[] {
    const currencies = new Set<string>();
    for (const key of Object.keys(FixedRateProvider.FIXED_RATES)) {
      const [from, to] = key.split('_');
      currencies.add(from);
      currencies.add(to);
    }
    return Array.from(currencies);
  }
}

// Currency Converter Main Class
export class CurrencyConverter {
  private providers: Array<{ provider: any; priority: number }> = [];
  private defaultCurrency = 'INR';
  private rateCache: Map<string, { rate: number; timestamp: number }> = new Map();
  private cacheTTL = 1000 * 60 * 30; // 30 minutes
  
  // Price history tracking (in-memory cache, for production use Redis/DB)
  private priceHistory: Map<string, Array<{ 
    productId: string;
    retailerId: string;
    price: number; 
    currency: string;
    timestamp: string;
  }>> = new Map();
  private maxHistoryEntries = 10000;
  private historyTTL = 1000 * 60 * 60 * 24 * 30; // 30 days

  constructor() {
    // Register providers in priority order
    // ExchangeRate-API (if configured)
    if (process.env.EXCHANGE_RATE_API_KEY) {
      this.providers.push({
        provider: new ExchangeRateAPIProvider(),
        priority: 1,
      });
    }
    
    // Fixed rate fallback (always available)
    this.providers.push({
      provider: new FixedRateProvider(),
      priority: 99,
    });
  }

  /**
   * Convert amount from one currency to another
   */
  async convert(
    amount: number,
    fromCurrency: string,
    toCurrency: string = 'INR'
  ): Promise<{
    originalAmount: number;
    originalCurrency: string;
    convertedAmount: number;
    targetCurrency: string;
    rate: number;
    rateTimestamp: string;
    source: string;
    isApproximate: boolean;
  }> {
    if (fromCurrency === toCurrency) {
      return {
        originalAmount: amount,
        originalCurrency: fromCurrency,
        convertedAmount: amount,
        targetCurrency: toCurrency,
        rate: 1,
        rateTimestamp: new Date().toISOString(),
        source: 'identity',
        isApproximate: false,
      };
    }

    // Try providers in priority order
    for (const { provider } of this.providers.sort((a, b) => a.priority - b.priority)) {
      if (!provider.isEnabled()) continue;

      try {
        const rate = await provider.getRate(fromCurrency, toCurrency);
        if (rate !== null) {
          const convertedAmount = amount * rate;
          return {
            originalAmount: amount,
            originalCurrency: fromCurrency,
            convertedAmount: Math.round(convertedAmount * 100) / 100,
            targetCurrency: toCurrency,
            rate,
            rateTimestamp: new Date().toISOString(),
            source: provider.getName(),
            isApproximate: false,
          };
        }
      } catch (error) {
        console.error(`[Currency] Provider ${provider.getName()} failed:`, error);
      }
    }

    // Fallback: return original amount with flag
    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      convertedAmount: amount,
      targetCurrency: toCurrency,
      rate: 1,
      rateTimestamp: new Date().toISOString(),
      source: 'none',
      isApproximate: true,
    };
  }

  /**
   * Get exchange rate between two currencies
   */
  async getRate(fromCurrency: string, toCurrency: string): Promise<number | null> {
    for (const { provider } of this.providers.sort((a, b) => a.priority - b.priority)) {
      if (!provider.isEnabled()) continue;
      
      try {
        const rate = await provider.getRate(fromCurrency, toCurrency);
        if (rate !== null) return rate;
      } catch (error) {
        console.error(`[Currency] Provider ${provider.getName()} failed:`, error);
      }
    }
    return null;
  }

  /**
   * Convert multiple amounts
   */
  async convertMultiple(
    amounts: Array<{ amount: number; from: string; to?: string }>
  ): Promise<Array<{
    originalAmount: number;
    originalCurrency: string;
    convertedAmount: number;
    targetCurrency: string;
    rate: number;
    rateTimestamp: string;
    source: string;
    isApproximate: boolean;
  }>> {
    return Promise.all(
      amounts.map(({ amount, from, to = 'INR' }) => 
        this.convert(amount, from, to)
      )
    );
  }

  /**
   * Record a price point for a product at a specific retailer
   * Used for price history tracking
   */
  recordPricePoint(
    productId: string,
    retailerId: string,
    price: number,
    currency: string = 'INR'
  ): void {
    const key = `${productId}:${retailerId}`;
    const entry = {
      productId,
      retailerId,
      price,
      currency,
      timestamp: new Date().toISOString(),
    };

    if (!this.priceHistory.has(key)) {
      this.priceHistory.set(key, []);
    }
    
    const history = this.priceHistory.get(key)!;
    history.push(entry);
    
    // Trim history if it exceeds max entries
    if (this.priceHistory.size > this.maxHistoryEntries) {
      const firstKey = this.priceHistory.keys().next().value;
      if (firstKey) this.priceHistory.delete(firstKey);
    }
    
    // Remove old entries from this product's history
    const now = Date.now();
    const filtered = history.filter(e => now - new Date(e.timestamp).getTime() < this.historyTTL);
    this.priceHistory.set(key, filtered);
  }

  /**
   * Get price history for a product at a specific retailer
   */
  getPriceHistory(productId: string, retailerId?: string): Array<{
    productId: string;
    retailerId: string;
    price: number;
    currency: string;
    timestamp: string;
  }> {
    if (retailerId) {
      const key = `${productId}:${retailerId}`;
      return this.priceHistory.get(key) || [];
    }
    
    // Return all history for this product across all retailers
    const allHistory: Array<{
      productId: string;
      retailerId: string;
      price: number;
      currency: string;
      timestamp: string;
    }> = [];
    
    for (const [key, history] of this.priceHistory.entries()) {
      if (key.startsWith(`${productId}:`)) {
        allHistory.push(...history);
      }
    }
    
    return allHistory.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  /**
   * Get price statistics for a product across all retailers
   */
  getPriceStats(productId: string): {
    currentPrice: number | null;
    lowestPrice: number | null;
    highestPrice: number | null;
    averagePrice: number | null;
    priceDrop: number;
    priceDropPercent: number;
    lastUpdated: string | null;
    retailerCount: number;
  } | null {
    const history = this.getPriceHistory(productId);
    
    if (history.length === 0) return null;
    
    // Group by retailer and get latest price for each
    const retailerLatest = new Map<string, typeof history[0]>();
    for (const entry of history) {
      const existing = retailerLatest.get(entry.retailerId);
      if (!existing || new Date(entry.timestamp) > new Date(existing.timestamp)) {
        retailerLatest.set(entry.retailerId, entry);
      }
    }
    
    const latestPrices = Array.from(retailerLatest.values()).map(e => e.price);
    if (latestPrices.length === 0) return null;
    
    const currentPrice = Math.min(...latestPrices);
    const lowestPrice = Math.min(...history.map(e => e.price));
    const highestPrice = Math.max(...latestPrices);
    const averagePrice = latestPrices.reduce((a, b) => a + b, 0) / latestPrices.length;
    
    // Find historical lowest
    const historicalLowest = Math.min(...history.map(e => e.price));
    const priceDrop = currentPrice - historicalLowest;
    const priceDropPercent = historicalLowest > 0 ? (priceDrop / historicalLowest) * 100 : 0;
    
    const lastUpdated = history.length > 0 
      ? history[history.length - 1].timestamp 
      : null;
    
    return {
      currentPrice,
      lowestPrice: historicalLowest,
      highestPrice,
      averagePrice: Math.round(averagePrice),
      priceDrop: Math.round(priceDrop),
      priceDropPercent: Math.round(priceDropPercent),
      lastUpdated,
      retailerCount: retailerLatest.size,
    };
  }

  /**
   * Get price freshness label
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
   * Format price with proper Indian numbering (lakhs/crores)
   */
  static formatPrice(amount: number, currency: string = 'INR', options: { compact?: boolean; showSymbol?: boolean } = {}): string {
    const { compact = false, showSymbol = true } = options;
    const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency + ' ';
    
    if (compact) {
      if (amount >= 10000000) { // 1 crore
        return `${symbol}${(amount / 10000000).toFixed(2)} Cr`;
      }
      if (amount >= 100000) { // 1 lakh
        return `${symbol}${(amount / 100000).toFixed(2)} L`;
      }
      if (amount >= 1000) {
        return `${symbol}${(amount / 1000).toFixed(1)} K`;
      }
    }
    
    return showSymbol ? `${symbol}${amount.toLocaleString('en-IN')}` : amount.toLocaleString('en-IN');
  }

  /**
   * Format price range
   */
  static formatPriceRange(min: number, max: number, currency = 'INR'): string {
    if (min === max) return CurrencyConverter.formatPrice(min, currency);
    return `${CurrencyConverter.formatPrice(min, currency)} – ${CurrencyConverter.formatPrice(max, currency)}`;
  }

  /**
   * Parse price string to number (handles INR format)
   */
  static parsePrice(priceString: string): number {
    if (!priceString) return 0;
    
    // Remove currency symbols, commas, spaces
    const cleaned = priceString
      .replace(/[₹$,,\s]/g, '')
      .replace(/[^\d.]/g, '')
      .trim();
    
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Check if price is stale
   */
  static isPriceStale(lastChecked: string, maxAgeHours = 24): boolean {
    const lastCheckedTime = new Date(lastChecked).getTime();
    const now = Date.now();
    const ageHours = (now - lastCheckedTime) / (1000 * 60 * 60);
    return ageHours > maxAgeHours;
  }

  /**
   * Get price freshness label
   */
  /**
   * Compare prices across retailers
   */
  static comparePrices(
    retailers: Array<{
      name: string;
      price: number;
      currency: string;
      availability: string;
      url: string;
      isOfficial?: boolean;
    }>,
    baseCurrency = 'INR'
  ): {
    cheapest: typeof retailers[0] | null;
    mostExpensive: typeof retailers[0] | null;
    averagePrice: number;
    priceRange: { min: number; max: number };
    savings: number;
    savingsPercent: number;
    allPrices: Array<{ name: string; price: number; currency: string; availability: string }>;
  } {
    const validRetailers = retailers
      .filter(r => r.price !== null && r.availability !== 'out_of_stock')
      .sort((a, b) => a.price - b.price);

    if (validRetailers.length === 0) {
      return {
        cheapest: null,
        mostExpensive: null,
        averagePrice: 0,
        priceRange: { min: 0, max: 0 },
        savings: 0,
        savingsPercent: 0,
        allPrices: [],
      };
    }

    const cheapest = validRetailers[0];
    const mostExpensive = validRetailers[validRetailers.length - 1];
    const prices = validRetailers.map(r => r.price);
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const savings = mostExpensive.price - cheapest.price;
    const savingsPercent = ((savings / mostExpensive.price) * 100);

    return {
      cheapest,
      mostExpensive,
      averagePrice: Math.round(averagePrice),
      priceRange: { min: cheapest.price, max: mostExpensive.price },
      savings: Math.round(savings),
      savingsPercent: Math.round(savingsPercent),
      allPrices: validRetailers.map(r => ({
        name: r.name,
        price: r.price,
        currency: r.currency,
        availability: r.availability,
      })),
    };
  }
}

/**
 * Exchange rate utilities
 */
export async function fetchExchangeRate(
  from: string,
  to: string
): Promise<number | null> {
  const converter = new CurrencyConverter();
  return converter.getRate(from, to);
}

export function formatINR(amount: number, options: { compact?: boolean; showSymbol?: boolean } = {}): string {
  return CurrencyConverter.formatPrice(amount, 'INR', options);
}

export function formatPriceRange(min: number, max: number): string {
  return CurrencyConverter.formatPriceRange(min, max);
}

export function parsePrice(priceString: string): number {
  return CurrencyConverter.parsePrice(priceString);
}

export function isPriceStale(lastChecked: string, maxAgeHours = 24): boolean {
  return CurrencyConverter.isPriceStale(lastChecked, maxAgeHours);
}

export function getPriceFreshnessLabel(lastChecked: string): string {
  return CurrencyConverter.getPriceFreshnessLabel(lastChecked);
}

export function compareRetailerPrices(
  retailers: Array<{
    name: string;
    price: number;
    currency: string;
    availability: string;
    url: string;
    isOfficial?: boolean;
  }>
) {
  return CurrencyConverter.comparePrices(retailers);
}

/**
 * Convert USD price to INR with proper formatting
 */
export async function usdToInr(usdAmount: number): Promise<{
  inr: number;
  formatted: string;
  rate: number;
  timestamp: string;
}> {
  const converter = new CurrencyConverter();
  const result = await converter.convert(usdAmount, 'USD', 'INR');
  
  return {
    inr: result.convertedAmount,
    formatted: `₹${result.convertedAmount.toLocaleString('en-IN')}`,
    rate: result.rate,
    timestamp: result.rateTimestamp,
  };
}

/**
 * Format price with proper Indian numbering (lakhs/crores)
 */
export function formatIndianPrice(amount: number): string {
  if (amount >= 10000000) { // 1 crore
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) { // 1 lakh
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)} K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Convert and format price with proper INR formatting
 */
export async function convertAndFormat(
  amount: number,
  fromCurrency: string,
  toCurrency: string = 'INR'
): Promise<{
  original: string;
  converted: string;
  rate: number;
  isApproximate: boolean;
}> {
  const converter = new CurrencyConverter();
  const result = await converter.convert(amount, fromCurrency, toCurrency);
  
  return {
    original: formatIndianPrice(amount),
    converted: formatIndianPrice(result.convertedAmount),
    rate: result.rate,
    isApproximate: result.isApproximate,
  };
}

export function formatPriceWithFreshness(
  price: number,
  currency: string,
  lastChecked: string
): string {
  const freshness = CurrencyConverter.getPriceFreshnessLabel(lastChecked);
  const formatted = CurrencyConverter.formatPrice(price, currency);
  return `${formatted} <span class="text-muted text-[11px]">(${freshness})</span>`;
}

