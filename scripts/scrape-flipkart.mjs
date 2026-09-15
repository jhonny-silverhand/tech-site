/**
 * Flipkart Product Scraper
 * Scrapes real product data from Flipkart search results
 * Uses fetch + HTML parsing (no external dependencies needed)
 * 
 * Usage: node scripts/scrape-flipkart.mjs
 * Run every 10 minutes via cron or interval
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync, existsSync } from 'fs';

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
    'samsung galaxy',
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
    'hp pavilion laptop',
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
 * Parse Flipkart search results from HTML
 * Flipkart uses structured data in script tags and specific CSS classes
 */
function parseSearchResults(html, category, searchQuery) {
  const products = [];
  
  // Try to find product data in script tags (Flipkart embeds JSON-LD or data scripts)
  const scriptMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  
  if (scriptMatches) {
    for (const match of scriptMatches) {
      try {
        const jsonStr = match.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
        const data = JSON.parse(jsonStr);
        if (data['@type'] === 'Product' || data.itemListElement) {
          // Process structured data
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }
  
  // Parse product cards from HTML
  // Flipkart uses specific class patterns for product cards
  const productCardRegex = /<div[^>]*data-id="([^"]*)"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi;
  
  // Alternative: Parse from the rendered HTML using common patterns
  // Product links pattern: /product-name/p/itmXXXXXXXXX
  const productLinkRegex = /href="(\/[^"]*\/p\/itm[^"]*)"[^>]*>/gi;
  const priceRegex = /₹[\s]*([0-9,]+)/gi;
  const imageRegex = /https?:\/\/(?:rukmini1|rukminim1|rukminim)\.flixcart\.com\/[^"'\s>]*/gi;
  
  let linkMatch;
  const seen = new Set();
  
  while ((linkMatch = productLinkRegex.exec(html)) !== null) {
    const productUrl = linkMatch[1];
    const productId = productUrl.match(/itm[a-zA-Z0-9]+/)?.[0];
    
    if (!productId || seen.has(productId)) continue;
    seen.add(productId);
    
    // Try to extract price near this product link
    const linkIndex = linkMatch.index;
    const surroundingText = html.substring(Math.max(0, linkIndex - 2000), linkIndex + 2000);
    
    const prices = [];
    let priceMatch;
    while ((priceMatch = priceRegex.exec(surroundingText)) !== null) {
      const price = parseInt(priceMatch[1].replace(/,/g, ''));
      if (price > 100 && price < 100000) { // Valid price range (₹100 to ₹1,00,000)
        prices.push(price);
      }
    }
    
    // Try to extract image - look for img src with flixcart CDN
    let images = surroundingText.match(imageRegex) || [];
    if (images.length === 0) {
      // Try broader pattern for img tags
      const imgTagRegex = /<img[^>]*src="(https?:\/\/[^"]*flixcart\.com[^"]*)"[^>]*/gi;
      let imgMatch;
      while ((imgMatch = imgTagRegex.exec(surroundingText)) !== null) {
        images.push(imgMatch[1]);
      }
    }
    
    // Try to extract rating
    const ratingRegex = /(\d\.?\d?)\s*\/\s*5/gi;
    let rating = null;
    let reviewCount = null;
    const ratingMatch = surroundingText.match(ratingRegex);
    if (ratingMatch) {
      rating = parseFloat(ratingMatch[0]);
    }
    
    // Try to extract review count
    const reviewRegex = /([\d,]+)\s*(?:Reviews?|ratings?)/gi;
    const reviewMatch = surroundingText.match(reviewRegex);
    if (reviewMatch) {
      reviewCount = parseInt(reviewMatch[0].replace(/[^\d]/g, ''));
    }
    
    // Extract product name from URL
    const nameMatch = productUrl.match(/\/([^\/]+)\/p\//);
    const rawName = nameMatch ? nameMatch[1] : '';
    const name = rawName
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
      .replace(/\b(Itm|pid)\b/gi, '');
    
    if (name && name.length > 3 && prices[0]) {
      products.push({
        flipkart_id: productId,
        name: name.trim(),
        brand: name.split(' ')[0],
        category,
        search_query: searchQuery,
        price_inr: prices[0] * 100, // Convert to paise
        mrp_inr: prices[1] ? prices[1] * 100 : null,
        discount_percent: prices[1] ? Math.round((1 - prices[0] / prices[1]) * 100) : null,
        rating,
        review_count: reviewCount,
        image_url: images[0] || null,
        product_url: `https://www.flipkart.com${productUrl}`,
        last_scraped_at: new Date().toISOString(),
      });
    }
    
    if (products.length >= 10) break; // Limit per query
  }
  
  return products;
}

/**
 * Scrape Flipkart search results
 */
async function scrapeSearch(query, category) {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://www.flipkart.com/search?q=${encodedQuery}&sort=popularity_desc`;
  
  try {
    const response = await fetch(url, { headers: HEADERS });
    
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
  console.log('=== Flipkart Scraper Starting ===');
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

export { main as scrapeFlipkart };
