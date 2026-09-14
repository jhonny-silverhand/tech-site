/**
 * Combined Product Scraper
 * Runs both Amazon and Flipkart scrapers
 * 
 * Usage: node scripts/scrape-all.mjs
 * Run every 10 minutes via cron
 */

import * as amazonModule from './scrape-amazon.mjs';
import * as flipkartModule from './scrape-flipkart.mjs';
import { writeFileSync } from 'fs';

const scrapeAmazon = amazonModule.scrapeAmazon;
const scrapeFlipkart = flipkartModule.scrapeFlipkart;

async function main() {
  const startTime = Date.now();
  console.log('=== Combined Product Scraper Starting ===');
  console.log(`Time: ${new Date().toISOString()}`);
  
  // Run both scrapers sequentially to avoid rate limits
  console.log('\n--- Running Amazon Scraper ---');
  try {
    await scrapeAmazon();
  } catch (error) {
    console.error('Amazon scraper failed:', error.message);
  }
  
  console.log('\n--- Running Flipkart Scraper ---');
  try {
    await scrapeFlipkart();
  } catch (error) {
    console.error('Flipkart scraper failed:', error.message);
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n=== Combined Scrape Complete ===`);
  console.log(`Total Duration: ${duration}s`);
  
  // Save metadata
  const metadata = {
    lastScrape: new Date().toISOString(),
    sources: ['amazon', 'flipkart'],
    totalDuration: parseFloat(duration),
  };
  writeFileSync('D:/work/tech-site/data/last-scrape.json', JSON.stringify(metadata, null, 2));
}

main().catch(console.error);
