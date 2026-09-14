/**
 * Amazon India Product Scraper
 * Scrapes real product data from Amazon.in search results
 * Uses fetch + HTML parsing (no external dependencies needed)
 * 
 * Usage: node scripts/scrape-amazon.mjs
 * Run every 10 minutes via cron or interval
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';

// Supabase config
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Search queries by category - real Indian search terms
const SEARCH_QUERIES = {
  smartphone: [
    'smartphone under 10000',
    'smartphone under 15000',
    'smartphone under 20000',
    'smartphone under 30000',
    'iphone',
    'samsung galaxy phone',
    'oneplus phone',
    'pixel phone',
    'realme phone',
    'xiaomi phone',
  ],
  laptop: [
    'laptop under 40000',
    'laptop under 60000',
    'gaming laptop',
    'macbook',
    'lenovo thinkpad',
    'hp laptop',
    'dell laptop',
    'asus laptop',
  ],
  headphones: [
    'headphones under 1000',
    'headphones under 2000',
    'wireless earbuds',
    'airpods',
    'sony headphones',
    'boat headphones',
  ],
  tablet: [
    'tablet under 15000',
    'ipad',
    'samsung tablet',
    'lenovo tablet',
  ],
  monitor: [
    'monitor under 10000',
    'gaming monitor',
    '27 inch monitor',
    '4k monitor',
    'lg monitor',
    'samsung monitor',
  ],
  keyboard: [
    'mechanical keyboard',
    'gaming keyboard',
    'wireless keyboard',
    'logitech keyboard',
  ],
  mouse: [
    'gaming mouse',
    'wireless mouse',
    'logitech mouse',
    'mouse under 1000',
  ],
  smartwatch: [
    'smartwatch under 5000',
    'apple watch',
    'samsung watch',
    'noise smartwatch',
    'firebolt smartwatch',
  ],
};

// Headers to mimic a real browser
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
};

// Delay between requests (ms)
const DELAY_BETWEEN_REQUESTS = 2000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Parse Amazon search results from HTML
 */
function parseSearchResults(html, category, searchQuery) {
  const products = [];
  
  // Amazon product cards are in data-asin divs
  const asinRegex = /data-asin="([A-Z0-9]{10})"/gi;
  const seen = new Set();
  
  let asinMatch;
  while ((asinMatch = asinRegex.exec(html)) !== null) {
    const asin = asinMatch[1];
    if (seen.has(asin)) continue;
    seen.add(asin);
    
    // Find surrounding context for this ASIN
    const contextStart = Math.max(0, asinMatch.index - 3000);
    const contextEnd = Math.min(html.length, asinMatch.index + 5000);
    const context = html.substring(contextStart, contextEnd);
    
    // Extract product name
    const nameMatch = context.match(/class="[^"]*a-size[^"]*a-color-normal[^"]*"[^>]*>([^<]+)</i)
      || context.match(/class="[^"]*s-line-clamp[^"]*"[^>]*>([^<]+)</i)
      || context.match(/class="[^"]*a-text-normal[^"]*"[^>]*>([^<]+)</i);
    const name = nameMatch ? nameMatch[1].trim() : '';
    
    // Extract price (₹ symbol followed by numbers)
    const priceMatch = context.match(/₹[\s]*([0-9,]+)/i)
      || context.match(/Rs\.?\s*([0-9,]+)/i);
    const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : null;
    
    // Extract image URL (Amazon CDN pattern)
    const imageMatch = context.match(/https?:\/\/m\.media-amazon\.com\/images\/I\/[^"'\s]+\.jpg/i)
      || context.match(/https?:\/\/images-eu\.ssl-images-amazon\.com\/images\/I\/[^"'\s]+\.jpg/i);
    const imageUrl = imageMatch ? imageMatch[0] : null;
    
    // Extract rating
    const ratingMatch = context.match(/(\d\.?\d?)\s*out of\s*5/i)
      || context.match(/a-icon-alt[^>]*>(\d\.?\d?)\s*out of/i);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
    
    // Extract review count
    const reviewMatch = context.match(/([0-9,]+)\s*(?:ratings?|reviews?)/i)
      || context.match(/a-icon-alt[^>]*>\d\.?\d?\s*out of 5\s*([0-9,]+)/i);
    const reviewCount = reviewMatch ? parseInt(reviewMatch[1].replace(/,/g, '')) : null;
    
    // Extract brand from name (first word usually)
    const brandWords = name.split(' ');
    const brand = brandWords[0] || '';
    
    if (name && name.length > 5 && price) {
      products.push({
        flipkart_id: asin, // We'll use 'flipkart_id' field for compatibility, but store ASIN
        name: name.substring(0, 200),
        brand: brand.substring(0, 50),
        category,
        search_query: searchQuery,
        price_inr: price * 100, // Convert to paise
        mrp_inr: null,
        discount_percent: null,
        rating,
        review_count: reviewCount,
        image_url: imageUrl,
        product_url: `https://www.amazon.in/dp/${asin}`,
        is_flipkart_assured: false,
        seller_name: null,
        highlights: [],
        specifications: { source: 'amazon', asin },
        last_scraped_at: new Date().toISOString(),
      });
    }
    
    if (products.length >= 10) break; // Limit per query
  }
  
  return products;
}

/**
 * Scrape Amazon search results
 */
async function scrapeSearch(query, category) {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://www.amazon.in/s?k=${encodedQuery}&s=review-rank`;
  
  try {
    const response = await fetch(url, { 
      headers: HEADERS,
      redirect: 'follow',
    });
    
    if (!response.ok) {
      console.error(`  HTTP ${response.status} for query: ${query}`);
      return [];
    }
    
    const html = await response.text();
    const products = parseSearchResults(html, category, query);
    
    console.log(`  Found ${products.length} products for "${query}"`);
    return products;
    
  } catch (error) {
    console.error(`  Error scraping "${query}":`, error.message);
    return [];
  }
}

/**
 * Save products to Supabase
 */
async function saveProducts(products) {
  if (products.length === 0) return;
  
  const { data, error } = await supabase
    .from('scraped_products')
    .upsert(products, { 
      onConflict: 'flipkart_id',
      ignoreDuplicates: false 
    });
  
  if (error) {
    console.error('Error saving to Supabase:', error.message);
    return false;
  }
  
  return true;
}

/**
 * Main scrape function
 */
async function main() {
  const startTime = Date.now();
  console.log('=== Amazon India Scraper Starting ===');
  console.log(`Time: ${new Date().toISOString()}`);
  
  let totalProducts = 0;
  let totalSaved = 0;
  
  for (const [category, queries] of Object.entries(SEARCH_QUERIES)) {
    console.log(`\nScraping ${category}...`);
    
    for (const query of queries) {
      const products = await scrapeSearch(query, category);
      totalProducts += products.length;
      
      if (products.length > 0) {
        const saved = await saveProducts(products);
        if (saved) totalSaved += products.length;
      }
      
      // Rate limit
      await sleep(DELAY_BETWEEN_REQUESTS);
    }
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n=== Scrape Complete ===`);
  console.log(`Duration: ${duration}s`);
  console.log(`Products found: ${totalProducts}`);
  console.log(`Products saved: ${totalSaved}`);
  
  // Save scrape metadata
  const metadata = {
    lastScrape: new Date().toISOString(),
    source: 'amazon',
    duration: parseFloat(duration),
    productsFound: totalProducts,
    productsSaved: totalSaved,
  };
  writeFileSync('D:/work/tech-site/data/last-scrape.json', JSON.stringify(metadata, null, 2));
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main as scrapeAmazon };
