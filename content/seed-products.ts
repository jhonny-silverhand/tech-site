import type { Product, ProductSpec, Retailer, ProductRetailer, ProductCategory } from '@/lib/types';

/**
 * Local demo product data — used when Supabase isn't configured.
 * Swap or delete once real product data exists in Supabase.
 */
const SEED_PRODUCTS: Array<{
  id: string;
  category_slug: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  manufacturer: string;
  model: string;
  release_date: string;
  status: 'active' | 'discontinued' | 'draft';
  specs: Array<{ spec_key: string; spec_value: string; unit?: string; display_order: number }>;
  retailers: Array<{
    name: string;
    slug: string;
    price_cents: number;
    currency: string;
    availability: 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited' | 'unknown';
    url: string;
    affiliate_url: string | null;
    logo_url: string | null;
    is_official: boolean;
  }>;
}> = [
  // Laptops
  {
    id: 'seed-laptop-macbook-air-m2',
    category_slug: 'laptop',
    name: 'MacBook Air (M2, 2022)',
    slug: 'macbook-air-m2-2022',
    description: 'Apple\'s fanless ultraportable with the M2 chip — exceptional battery life, silent operation, and enough power for most workflows.',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
    manufacturer: 'Apple',
    model: 'MacBook Air 13" (M2)',
    release_date: '2022-07-15',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Apple M2', display_order: 1 },
      { spec_key: 'gpu', spec_value: 'Apple M2 8-core', display_order: 2 },
      { spec_key: 'ram', spec_value: '8', unit: 'GB', display_order: 3 },
      { spec_key: 'storage', spec_value: '256', unit: 'GB', display_order: 4 },
      { spec_key: 'display', spec_value: '13.6', unit: 'inches', display_order: 5 },
      { spec_key: 'resolution', spec_value: '2560x1664', display_order: 6 },
      { spec_key: 'battery_life', spec_value: '18', unit: 'hours', display_order: 7 },
      { spec_key: 'weight', spec_value: '1.24', unit: 'kg', display_order: 8 },
      { spec_key: 'refresh_rate', spec_value: '60', unit: 'Hz', display_order: 9 },
    ],
    retailers: [
      { name: 'Apple', slug: 'apple', price_cents: 9990000, currency: 'INR', availability: 'in_stock', url: 'https://apple.com/in/shop/buy-mac/macbook-air', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=64&h=64&fit=crop', is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 9490000, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/dp/B0B3CJZL6H', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=64&h=64&fit=crop', is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 9290000, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/apple-macbook-air-m2/p/itm...', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9a3?w=64&h=64&fit=crop', is_official: false },
      { name: 'Croma', slug: 'croma', price_cents: 9790000, currency: 'INR', availability: 'in_stock', url: 'https://croma.com/apple-macbook-air-m2', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1556637640-2c80d3f43b49?w=64&h=64&fit=crop', is_official: false },
    ],
  },
  {
    id: 'seed-laptop-dell-xps-13',
    category_slug: 'laptop',
    name: 'Dell XPS 13 (2023)',
    slug: 'dell-xps-13-2023',
    description: 'Ultra-compact Windows ultraportable with 12th/13th Gen Intel chips, stunning display options, and premium build.',
    image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=600&fit=crop',
    manufacturer: 'Dell',
    model: 'XPS 13 9320',
    release_date: '2023-02-01',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Intel Core i7-1260P', display_order: 1 },
      { spec_key: 'ram', spec_value: '16', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '512', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '13.4', unit: 'inches', display_order: 4 },
      { spec_key: 'resolution', spec_value: '1920x1200', display_order: 5 },
      { spec_key: 'battery_life', spec_value: '12', unit: 'hours', display_order: 6 },
      { spec_key: 'weight', spec_value: '1.17', unit: 'kg', display_order: 7 },
      { spec_key: 'refresh_rate', spec_value: '60', unit: 'Hz', display_order: 8 },
    ],
    retailers: [
      { name: 'Dell', slug: 'dell', price_cents: 11490000, currency: 'INR', availability: 'in_stock', url: 'https://dell.com/en-in/shop/laptops/xps-13', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=64&h=64&fit=crop', is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 10890000, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/dp/B0BN...', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=64&h=64&fit=crop', is_official: false },
    ],
  },
  {
    id: 'seed-laptop-lenovo-thinkpad-x1-carbon',
    category_slug: 'laptop',
    name: 'Lenovo ThinkPad X1 Carbon Gen 11',
    slug: 'thinkpad-x1-carbon-gen11',
    description: 'Business ultraportable benchmark — legendary keyboard, MIL-STD durability, and Intel vPro manageability.',
    image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f155592?w=800&h=600&fit=crop',
    manufacturer: 'Lenovo',
    model: 'ThinkPad X1 Carbon Gen 11',
    release_date: '2023-03-01',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Intel Core i7-1365U', display_order: 1 },
      { spec_key: 'ram', spec_value: '16', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '512', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '14', unit: 'inches', display_order: 4 },
      { spec_key: 'resolution', spec_value: '2880x1800', display_order: 5 },
      { spec_key: 'battery_life', spec_value: '15', unit: 'hours', display_order: 5 },
      { spec_key: 'weight', spec_value: '1.12', unit: 'kg', display_order: 6 },
    ],
    retailers: [
      { name: 'Lenovo', slug: 'lenovo', price_cents: 13990000, currency: 'INR', availability: 'in_stock', url: 'https://lenovo.com/in/en/p/laptops/thinkpad/thinkpad-x1', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=64&h=64&fit=crop', is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 12990000, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/dp/B0B...', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=64&h=64&fit=crop', is_official: false },
    ],
  },
  // Budget laptops
  {
    id: 'seed-laptop-aspire-lite',
    category_slug: 'laptop',
    name: 'Acer Aspire Lite',
    slug: 'acer-aspire-lite',
    description: 'Budget laptop with reliable AMD performance for students and everyday computing — no frills, just works.',
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
    manufacturer: 'Acer',
    model: 'Aspire Lite AL15-51',
    release_date: '2023-06-01',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'AMD Ryzen 3 5300U', display_order: 1 },
      { spec_key: 'ram', spec_value: '8', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '512', unit: 'GB SSD', display_order: 3 },
      { spec_key: 'display', spec_value: '15.6', unit: 'inches', display_order: 4 },
      { spec_key: 'battery_life', spec_value: '8', unit: 'hours', display_order: 5 },
      { spec_key: 'weight', spec_value: '1.7', unit: 'kg', display_order: 6 },
    ],
    retailers: [
      { name: 'Amazon', slug: 'amazon', price_cents: 2499900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Acer+Aspire+Lite', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 2449900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Acer+Aspire+Lite', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-laptop-vivobook-15',
    category_slug: 'laptop',
    name: 'ASUS Vivobook 15',
    slug: 'asus-vivobook-15',
    description: 'Thin and light student laptop with OLED display option and decent everyday performance.',
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
    manufacturer: 'ASUS',
    model: 'Vivobook 15 X1504ZA',
    release_date: '2023-08-01',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Intel Core i5-1235U', display_order: 1 },
      { spec_key: 'ram', spec_value: '8', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '512', unit: 'GB SSD', display_order: 3 },
      { spec_key: 'display', spec_value: '15.6', unit: 'inches', display_order: 4 },
      { spec_key: 'battery_life', spec_value: '7', unit: 'hours', display_order: 5 },
      { spec_key: 'weight', spec_value: '1.7', unit: 'kg', display_order: 6 },
    ],
    retailers: [
      { name: 'Amazon', slug: 'amazon', price_cents: 3999900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=ASUS+Vivobook+15', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 3899900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=ASUS+Vivobook+15', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-laptop-ideapad-slim',
    category_slug: 'laptop',
    name: 'Lenovo IdeaPad Slim 3',
    slug: 'lenovo-ideapad-slim-3',
    description: 'Solid mid-range laptop with fast charging and Dolby Audio — great for productivity and media.',
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
    manufacturer: 'Lenovo',
    model: 'IdeaPad Slim 3 15IRU8',
    release_date: '2023-09-01',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Intel Core i5-1335U', display_order: 1 },
      { spec_key: 'ram', spec_value: '16', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '512', unit: 'GB SSD', display_order: 3 },
      { spec_key: 'display', spec_value: '15.6', unit: 'inches', display_order: 4 },
      { spec_key: 'battery_life', spec_value: '10', unit: 'hours', display_order: 5 },
      { spec_key: 'weight', spec_value: '1.62', unit: 'kg', display_order: 6 },
    ],
    retailers: [
      { name: 'Lenovo', slug: 'lenovo', price_cents: 5499900, currency: 'INR', availability: 'in_stock', url: 'https://lenovo.com/in/en/laptops/ideapad/ideapad-slim-3', affiliate_url: null, logo_url: null, is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 5299900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Lenovo+IdeaPad+Slim+3', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-laptop-acer-nitro',
    category_slug: 'laptop',
    name: 'Acer Nitro V 15',
    slug: 'acer-nitro-v-15',
    description: 'Budget gaming laptop with RTX power and 144Hz display — entry-level AAA gaming without breaking the bank.',
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
    manufacturer: 'Acer',
    model: 'Nitro V 15 ANV15-41',
    release_date: '2024-01-15',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'AMD Ryzen 5 7535HS', display_order: 1 },
      { spec_key: 'gpu', spec_value: 'NVIDIA RTX 4050 6GB', display_order: 2 },
      { spec_key: 'ram', spec_value: '16', unit: 'GB', display_order: 3 },
      { spec_key: 'storage', spec_value: '512', unit: 'GB SSD', display_order: 4 },
      { spec_key: 'display', spec_value: '15.6', unit: 'inches', display_order: 5 },
      { spec_key: 'refresh_rate', spec_value: '144', unit: 'Hz', display_order: 6 },
    ],
    retailers: [
      { name: 'Amazon', slug: 'amazon', price_cents: 6499900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Acer+Nitro+V+15', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 6399900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Acer+Nitro+V+15', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  // Smartphones
  {
    id: 'seed-phone-iphone-15',
    category_slug: 'smartphone',
    name: 'iPhone 15',
    slug: 'iphone-15',
    description: 'Apple\'s mainstream iPhone with Dynamic Island, USB-C, and the A16 Bionic — great all-rounder for most people.',
    image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop',
    manufacturer: 'Apple',
    model: 'iPhone 15',
    release_date: '2023-09-22',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Apple A16 Bionic', display_order: 1 },
      { spec_key: 'ram', spec_value: '6', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '128', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '6.1', unit: 'inches', display_order: 4 },
      { spec_key: 'camera', spec_value: '48', unit: 'MP', display_order: 5 },
      { spec_key: 'battery', spec_value: '20', unit: 'hours', display_order: 6 },
      { spec_key: 'weight', spec_value: '171', unit: 'g', display_order: 7 },
    ],
    retailers: [
      { name: 'Apple', slug: 'apple', price_cents: 7990000, currency: 'INR', availability: 'in_stock', url: 'https://apple.com/in/shop/buy-iphone/iphone-15', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=64&h=64&fit=crop', is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 7190000, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/dp/B0CH...', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=64&h=64&fit=crop', is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 6990000, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/apple-iphone-15/p/itm...', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9a3?w=64&h=64&fit=crop', is_official: false },
    ],
  },
  {
    id: 'seed-phone-samsung-s24',
    category_slug: 'smartphone',
    name: 'Samsung Galaxy S24',
    slug: 'galaxy-s24',
    description: 'Compact flagship with 7 years of updates, excellent cameras, and Galaxy AI features — the Android flagship to beat.',
    image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop',
    manufacturer: 'Samsung',
    model: 'Galaxy S24',
    release_date: '2024-01-31',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Exynos 2400 / Snapdragon 8 Gen 3', display_order: 1 },
      { spec_key: 'ram', spec_value: '8', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '128', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '6.2', unit: 'inches', display_order: 4 },
      { spec_key: 'camera', spec_value: '50', unit: 'MP', display_order: 5 },
      { spec_key: 'battery', spec_value: '24', unit: 'hours', display_order: 6 },
    ],
    retailers: [
      { name: 'Samsung', slug: 'samsung', price_cents: 7999900, currency: 'INR', availability: 'in_stock', url: 'https://samsung.com/in/smartphones/galaxy-s24', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=64&h=64&fit=crop', is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 7299900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/dp/B0C...', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=64&h=64&fit=crop', is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 6999900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/samsung-galaxy-s24/p/itm...', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9a3?w=64&h=64&fit=crop', is_official: false },
    ],
  },
  {
    id: 'seed-phone-pixel-8',
    category_slug: 'smartphone',
    name: 'Google Pixel 8',
    slug: 'pixel-8',
    description: 'Google\'s AI-first phone with 7 years of updates, best-in-class computational photography, and clean Android.',
    image_url: 'https://images.unsplash.com/photo-1681966971132-7b7c2f6b67a8?w=800&h=600&fit=crop',
    manufacturer: 'Google',
    model: 'Pixel 8',
    release_date: '2023-10-12',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Google Tensor G3', display_order: 1 },
      { spec_key: 'ram', spec_value: '8', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '128', unit: 'GB', display_order: 3 },
      { spec_key: 'camera', spec_value: '50', unit: 'MP', display_order: 4 },
      { spec_key: 'battery', spec_value: '24', unit: 'hours', display_order: 5 },
    ],
    retailers: [
      { name: 'Google', slug: 'google', price_cents: 7599900, currency: 'INR', availability: 'in_stock', url: 'https://store.google.com/in/product/pixel_8', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1610945265064-0e34e55e72d2?w=64&h=64&fit=crop', is_official: true },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 6799900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/google-pixel-8/p/itm...', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9a3?w=64&h=64&fit=crop', is_official: false },
    ],
  },
  // Headphones
  {
    id: 'seed-headphones-sony-wh1000xm5',
    category_slug: 'headphones',
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh1000xm5',
    description: 'Industry-leading ANC, exceptional comfort, and 30-hour battery — the benchmark for wireless noise-cancelling headphones.',
    image_url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=600&fit=crop',
    manufacturer: 'Sony',
    model: 'WH-1000XM5',
    release_date: '2022-05-12',
    status: 'active',
    specs: [
      { spec_key: 'anc', spec_value: 'Industry-leading', display_order: 1 },
      { spec_key: 'driver', spec_value: '30', unit: 'mm', display_order: 2 },
      { spec_key: 'battery', spec_value: '30', unit: 'hours', display_order: 3 },
      { spec_key: 'weight', spec_value: '250', unit: 'g', display_order: 4 },
      { spec_key: 'codec', spec_value: 'LDAC, AAC, SBC', display_order: 5 },
    ],
    retailers: [
      { name: 'Sony', slug: 'sony', price_cents: 2999000, currency: 'INR', availability: 'in_stock', url: 'https://sony.co.in/electronics/headphones/wh-1000xm5', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=64&h=64&fit=crop', is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 2699000, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/dp/B09...', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=64&h=64&fit=crop', is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 2599000, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/sony-wh-1000xm5/p/itm...', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9a3?w=64&h=64&fit=crop', is_official: false },
    ],
  },
  {
    id: 'seed-headphones-bose-qc45',
    category_slug: 'headphones',
    name: 'Bose QuietComfort 45',
    slug: 'bose-qc45',
    description: 'Lightweight, superb comfort, and excellent ANC — Bose\'s answer to long-haul travel and daily commutes.',
    image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=600&fit=crop',
    manufacturer: 'Bose',
    model: 'QuietComfort 45',
    release_date: '2021-09-23',
    status: 'active',
    specs: [
      { spec_key: 'anc', spec_value: 'Excellent', display_order: 1 },
      { spec_key: 'driver', spec_value: '32', unit: 'mm', display_order: 2 },
      { spec_key: 'battery', spec_value: '24', unit: 'hours', display_order: 3 },
      { spec_key: 'weight', spec_value: '240', unit: 'g', display_order: 4 },
    ],
    retailers: [
      { name: 'Bose', slug: 'bose', price_cents: 2690000, currency: 'INR', availability: 'in_stock', url: 'https://bose.com/en_in/products/headphones/quietcomfort-45', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=64&h=64&fit=crop', is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 2390000, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/dp/B09...', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=64&h=64&fit=crop', is_official: false },
    ],
  },
  {
    id: 'seed-headphones-apple-airpods-max',
    category_slug: 'headphones',
    name: 'Apple AirPods Max',
    slug: 'airpods-max',
    description: 'Premium over-ear with computational audio, spatial audio, and seamless Apple ecosystem integration.',
    image_url: 'https://images.unsplash.com/photo-1605464315542-bda3e2f5e365?w=800&h=600&fit=crop',
    manufacturer: 'Apple',
    model: 'AirPods Max',
    release_date: '2020-12-15',
    status: 'active',
    specs: [
      { spec_key: 'anc', spec_value: 'Excellent', display_order: 1 },
      { spec_key: 'driver', spec_value: '40', unit: 'mm', display_order: 2 },
      { spec_key: 'battery', spec_value: '20', unit: 'hours', display_order: 3 },
      { spec_key: 'weight', spec_value: '384', unit: 'g', display_order: 4 },
      { spec_key: 'codec', spec_value: 'AAC', display_order: 5 },
    ],
    retailers: [
      { name: 'Apple', slug: 'apple', price_cents: 5990000, currency: 'INR', availability: 'in_stock', url: 'https://apple.com/in/shop/buy-airpods/airpods-max', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=64&h=64&fit=crop', is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 4990000, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/dp/B08...', affiliate_url: null, logo_url: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=64&h=64&fit=crop', is_official: false },
    ],
  },
  // Budget headphones
  {
    id: 'seed-headphones-boat-rockerz-450',
    category_slug: 'headphones',
    name: 'boAt Rockerz 450',
    slug: 'boat-rockerz-450',
    description: 'Budget wireless headphones with 40mm drivers and 15-hour battery — the go-to pick under ₹1,500.',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
    manufacturer: 'boAt',
    model: 'Rockerz 450',
    release_date: '2022-06-01',
    status: 'active',
    specs: [
      { spec_key: 'anc', spec_value: 'No', display_order: 1 },
      { spec_key: 'driver', spec_value: '40', unit: 'mm', display_order: 2 },
      { spec_key: 'battery', spec_value: '15', unit: 'hours', display_order: 3 },
      { spec_key: 'codec', spec_value: 'SBC', display_order: 4 },
      { spec_key: 'weight', spec_value: '230', unit: 'g', display_order: 5 },
    ],
    retailers: [
      { name: 'Amazon', slug: 'amazon', price_cents: 109900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=boAt+Rockerz+450', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 99900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=boAt+Rockerz+450', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-headphones-sony-wh-ch520',
    category_slug: 'headphones',
    name: 'Sony WH-CH520',
    slug: 'sony-wh-ch520',
    description: 'Lightweight Sony wireless with 50-hour battery and DSEE — quality sound at a mid-range price.',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
    manufacturer: 'Sony',
    model: 'WH-CH520',
    release_date: '2023-01-15',
    status: 'active',
    specs: [
      { spec_key: 'anc', spec_value: 'No', display_order: 1 },
      { spec_key: 'driver', spec_value: '30', unit: 'mm', display_order: 2 },
      { spec_key: 'battery', spec_value: '50', unit: 'hours', display_order: 3 },
      { spec_key: 'codec', spec_value: 'SBC/AAC', display_order: 4 },
      { spec_key: 'weight', spec_value: '147', unit: 'g', display_order: 5 },
    ],
    retailers: [
      { name: 'Sony', slug: 'sony', price_cents: 469900, currency: 'INR', availability: 'in_stock', url: 'https://sony.co.in/electronics/headband-headphones/wh-ch520', affiliate_url: null, logo_url: null, is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 399900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Sony+WH-CH520', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 399900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Sony+WH-CH520', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-headphones-jbl-tune-770nc',
    category_slug: 'headphones',
    name: 'JBL Tune 770NC',
    slug: 'jbl-tune-770nc',
    description: 'JBL signature sound with adaptive ANC and 44-hour battery — best ANC headphones under ₹5,000.',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
    manufacturer: 'JBL',
    model: 'Tune 770NC',
    release_date: '2023-09-01',
    status: 'active',
    specs: [
      { spec_key: 'anc', spec_value: 'Adaptive', display_order: 1 },
      { spec_key: 'driver', spec_value: '40', unit: 'mm', display_order: 2 },
      { spec_key: 'battery', spec_value: '44', unit: 'hours', display_order: 3 },
      { spec_key: 'codec', spec_value: 'SBC/AAC', display_order: 4 },
      { spec_key: 'weight', spec_value: '252', unit: 'g', display_order: 5 },
    ],
    retailers: [
      { name: 'Amazon', slug: 'amazon', price_cents: 499900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=JBL+Tune+770NC', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 479900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=JBL+Tune+770NC', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  // Budget smartphones
  {
    id: 'seed-phone-redmi-a3',
    category_slug: 'smartphone',
    name: 'Redmi A3',
    slug: 'redmi-a3',
    description: 'Entry-level smartphone with large display and massive battery — essentials done right at an unbeatable price.',
    image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=600&fit=crop',
    manufacturer: 'Xiaomi',
    model: 'Redmi A3',
    release_date: '2024-02-15',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'MediaTek Helio G36', display_order: 1 },
      { spec_key: 'ram', spec_value: '4', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '64', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '6.71', unit: 'inches', display_order: 4 },
      { spec_key: 'camera', spec_value: '8', unit: 'MP', display_order: 5 },
      { spec_key: 'battery', spec_value: '5000', unit: 'mAh', display_order: 6 },
    ],
    retailers: [
      { name: 'Amazon', slug: 'amazon', price_cents: 449900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Redmi+A3', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 439900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Redmi+A3', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-phone-galaxy-a06',
    category_slug: 'smartphone',
    name: 'Samsung Galaxy A06',
    slug: 'galaxy-a06',
    description: 'Reliable budget Samsung with long software support and a big battery — a safe pick for first-time smartphone buyers.',
    image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop',
    manufacturer: 'Samsung',
    model: 'Galaxy A06',
    release_date: '2024-06-01',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'MediaTek Helio G85', display_order: 1 },
      { spec_key: 'ram', spec_value: '4', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '64', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '6.7', unit: 'inches', display_order: 4 },
      { spec_key: 'camera', spec_value: '50', unit: 'MP', display_order: 5 },
      { spec_key: 'battery', spec_value: '5000', unit: 'mAh', display_order: 6 },
    ],
    retailers: [
      { name: 'Amazon', slug: 'amazon', price_cents: 499900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Galaxy+A06', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 489900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Galaxy+A06', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-phone-redmi-13-5g',
    category_slug: 'smartphone',
    name: 'Redmi 13 5G',
    slug: 'redmi-13-5g',
    description: '5G connectivity at an entry price — Snapdragon performance with a smooth 120Hz display for everyday use.',
    image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=600&fit=crop',
    manufacturer: 'Xiaomi',
    model: 'Redmi 13 5G',
    release_date: '2024-03-15',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Snapdragon 4 Gen 2', display_order: 1 },
      { spec_key: 'ram', spec_value: '6', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '128', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '6.67', unit: 'inches', display_order: 4 },
      { spec_key: 'camera', spec_value: '108', unit: 'MP', display_order: 5 },
      { spec_key: 'battery', spec_value: '5030', unit: 'mAh', display_order: 6 },
    ],
    retailers: [
      { name: 'Amazon', slug: 'amazon', price_cents: 999900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Redmi+13+5G', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 979900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Redmi+13+5G', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-phone-galaxy-m15',
    category_slug: 'smartphone',
    name: 'Samsung Galaxy M15 5G',
    slug: 'galaxy-m15-5g',
    description: 'Monster battery life with AMOLED display and 5G — Samsung\'s best value proposition for heavy users.',
    image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop',
    manufacturer: 'Samsung',
    model: 'Galaxy M15 5G',
    release_date: '2024-02-01',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Dimensity 6100+', display_order: 1 },
      { spec_key: 'ram', spec_value: '4', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '128', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '6.5', unit: 'inches', display_order: 4 },
      { spec_key: 'camera', spec_value: '50', unit: 'MP', display_order: 5 },
      { spec_key: 'battery', spec_value: '6000', unit: 'mAh', display_order: 6 },
    ],
    retailers: [
      { name: 'Amazon', slug: 'amazon', price_cents: 999900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Galaxy+M15', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 989900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Galaxy+M15', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-phone-poco-m6-pro',
    category_slug: 'smartphone',
    name: 'Poco M6 Pro 5G',
    slug: 'poco-m6-pro',
    description: 'AMOLED display and 5G at a mid-range price — solid performance for media consumption and daily tasks.',
    image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=600&fit=crop',
    manufacturer: 'Poco',
    model: 'M6 Pro 5G',
    release_date: '2024-01-20',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Snapdragon 4 Gen 2', display_order: 1 },
      { spec_key: 'ram', spec_value: '6', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '128', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '6.67', unit: 'inches', display_order: 4 },
      { spec_key: 'camera', spec_value: '50', unit: 'MP', display_order: 5 },
      { spec_key: 'battery', spec_value: '5000', unit: 'mAh', display_order: 6 },
    ],
    retailers: [
      { name: 'Amazon', slug: 'amazon', price_cents: 1199900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Poco+M6+Pro', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 1179900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Poco+M6+Pro', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-phone-galaxy-a16',
    category_slug: 'smartphone',
    name: 'Samsung Galaxy A16 5G',
    slug: 'galaxy-a16-5g',
    description: 'Samsung quality with long update commitment — AMOLED, 5G, and IP54 water resistance at a competitive price.',
    image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop',
    manufacturer: 'Samsung',
    model: 'Galaxy A16 5G',
    release_date: '2024-04-01',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Dimensity 6300', display_order: 1 },
      { spec_key: 'ram', spec_value: '6', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '128', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '6.7', unit: 'inches', display_order: 4 },
      { spec_key: 'camera', spec_value: '50', unit: 'MP', display_order: 5 },
      { spec_key: 'battery', spec_value: '5000', unit: 'mAh', display_order: 6 },
    ],
    retailers: [
      { name: 'Amazon', slug: 'amazon', price_cents: 1399900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Galaxy+A16', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 1379900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Galaxy+A16', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-phone-nothing-2a',
    category_slug: 'smartphone',
    name: 'Nothing Phone 2a',
    slug: 'nothing-phone-2a',
    description: 'Glyph interface meets mid-range muscle — clean Nothing OS, solid Dimensity performance, and a distinctive design.',
    image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=600&fit=crop',
    manufacturer: 'Nothing',
    model: 'Phone 2a',
    release_date: '2024-03-05',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Dimensity 7200 Pro', display_order: 1 },
      { spec_key: 'ram', spec_value: '8', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '128', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '6.7', unit: 'inches', display_order: 4 },
      { spec_key: 'camera', spec_value: '50', unit: 'MP', display_order: 5 },
      { spec_key: 'battery', spec_value: '5000', unit: 'mAh', display_order: 6 },
    ],
    retailers: [
      { name: 'Amazon', slug: 'amazon', price_cents: 1799900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Nothing+Phone+2a', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 1799900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Nothing+Phone+2a', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-phone-galaxy-a35',
    category_slug: 'smartphone',
    name: 'Samsung Galaxy A35 5G',
    slug: 'galaxy-a35-5g',
    description: 'Premium mid-range with IP67 water resistance, optical stabilization, and Samsung\'s long update runway.',
    image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop',
    manufacturer: 'Samsung',
    model: 'Galaxy A35 5G',
    release_date: '2024-03-10',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Exynos 1380', display_order: 1 },
      { spec_key: 'ram', spec_value: '8', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '128', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '6.6', unit: 'inches', display_order: 4 },
      { spec_key: 'camera', spec_value: '50', unit: 'MP', display_order: 5 },
      { spec_key: 'battery', spec_value: '5000', unit: 'mAh', display_order: 6 },
    ],
    retailers: [
      { name: 'Amazon', slug: 'amazon', price_cents: 1899900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Galaxy+A35', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 1879900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Galaxy+A35', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-phone-galaxy-a55',
    category_slug: 'smartphone',
    name: 'Samsung Galaxy A55 5G',
    slug: 'galaxy-a55-5g',
    description: 'Upper mid-range with flagship-grade display, metal frame, and 4 years of updates — the sensible premium pick.',
    image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop',
    manufacturer: 'Samsung',
    model: 'Galaxy A55 5G',
    release_date: '2024-03-10',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Exynos 1480', display_order: 1 },
      { spec_key: 'ram', spec_value: '8', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '128', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '6.6', unit: 'inches', display_order: 4 },
      { spec_key: 'camera', spec_value: '50', unit: 'MP', display_order: 5 },
      { spec_key: 'battery', spec_value: '5000', unit: 'mAh', display_order: 6 },
    ],
    retailers: [
      { name: 'Samsung', slug: 'samsung', price_cents: 2699900, currency: 'INR', availability: 'in_stock', url: 'https://samsung.com/in/smartphones/galaxy-a55', affiliate_url: null, logo_url: null, is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 2699900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Galaxy+A55', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 2679900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Galaxy+A55', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-phone-nothing-2',
    category_slug: 'smartphone',
    name: 'Nothing Phone 2',
    slug: 'nothing-phone-2',
    description: 'Snapdragon 8+ Gen 1 power with Nothing\'s unique Glyph interface — flagship performance at a flagship-killing price.',
    image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=600&fit=crop',
    manufacturer: 'Nothing',
    model: 'Phone 2',
    release_date: '2023-07-11',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Snapdragon 8+ Gen 1', display_order: 1 },
      { spec_key: 'ram', spec_value: '8', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '128', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '6.7', unit: 'inches', display_order: 4 },
      { spec_key: 'camera', spec_value: '50', unit: 'MP', display_order: 5 },
      { spec_key: 'battery', spec_value: '4700', unit: 'mAh', display_order: 6 },
    ],
    retailers: [
      { name: 'Nothing', slug: 'nothing', price_cents: 2799900, currency: 'INR', availability: 'in_stock', url: 'https://nothing.tech/products/phone-2', affiliate_url: null, logo_url: null, is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 2799900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Nothing+Phone+2', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 2799900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Nothing+Phone+2', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-phone-oneplus-12r',
    category_slug: 'smartphone',
    name: 'OnePlus 12R',
    slug: 'oneplus-12r',
    description: 'Flagship Snapdragon chip at mid-premium pricing — fast charging, great display, and OxygenOS smoothness.',
    image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=600&fit=crop',
    manufacturer: 'OnePlus',
    model: '12R',
    release_date: '2024-01-23',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Snapdragon 8 Gen 2', display_order: 1 },
      { spec_key: 'ram', spec_value: '8', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '256', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '6.78', unit: 'inches', display_order: 4 },
      { spec_key: 'camera', spec_value: '50', unit: 'MP', display_order: 5 },
      { spec_key: 'battery', spec_value: '5500', unit: 'mAh', display_order: 6 },
    ],
    retailers: [
      { name: 'OnePlus', slug: 'oneplus', price_cents: 3999900, currency: 'INR', availability: 'in_stock', url: 'https://oneplus.in/12r', affiliate_url: null, logo_url: null, is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 3999900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=OnePlus+12R', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-phone-pixel-8a',
    category_slug: 'smartphone',
    name: 'Google Pixel 8a',
    slug: 'pixel-8a',
    description: 'Pure Android with 7 years of updates and flagship-tier Tensor chip — the best camera phone under 40k.',
    image_url: 'https://images.unsplash.com/photo-1681966971132-7b7c2f6b67a8?w=800&h=600&fit=crop',
    manufacturer: 'Google',
    model: 'Pixel 8a',
    release_date: '2024-05-14',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Tensor G3', display_order: 1 },
      { spec_key: 'ram', spec_value: '8', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '128', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '6.1', unit: 'inches', display_order: 4 },
      { spec_key: 'camera', spec_value: '64', unit: 'MP', display_order: 5 },
      { spec_key: 'battery', spec_value: '4492', unit: 'mAh', display_order: 6 },
    ],
    retailers: [
      { name: 'Google', slug: 'google', price_cents: 3999900, currency: 'INR', availability: 'in_stock', url: 'https://store.google.com/in/product/pixel_8a', affiliate_url: null, logo_url: null, is_official: true },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 3999900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Pixel+8a', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  // Earbuds
  {
    id: 'seed-earbuds-realme-buds-t110',
    category_slug: 'earbuds',
    name: 'Realme Buds T110',
    slug: 'realme-buds-t110',
    description: 'Budget TWS with AI ENC and low latency — surprisingly good sound at an entry price.',
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&h=600&fit=crop',
    manufacturer: 'Realme',
    model: 'Buds T110',
    release_date: '2024-01-15',
    status: 'active',
    specs: [
      { spec_key: 'driver', spec_value: '10', unit: 'mm', display_order: 1 },
      { spec_key: 'anc', spec_value: 'No', display_order: 2 },
      { spec_key: 'battery', spec_value: '32', unit: 'hours total', display_order: 3 },
      { spec_key: 'codec', spec_value: 'SBC', display_order: 4 },
      { spec_key: 'latency', spec_value: '88', unit: 'ms', display_order: 5 },
      { spec_key: 'waterproof', spec_value: 'IPX4', display_order: 6 },
    ],
    retailers: [
      { name: 'Amazon', slug: 'amazon', price_cents: 59900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Realme+Buds+T110', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 54900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Realme+Buds+T110', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-earbuds-nothing-ear-a',
    category_slug: 'earbuds',
    name: 'Nothing Ear (a)',
    slug: 'nothing-ear-a',
    description: 'Unique transparent design with ANC and Nothing OS integration — style and substance at mid-range.',
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&h=600&fit=crop',
    manufacturer: 'Nothing',
    model: 'Ear (a)',
    release_date: '2024-03-18',
    status: 'active',
    specs: [
      { spec_key: 'driver', spec_value: '12.6', unit: 'mm', display_order: 1 },
      { spec_key: 'anc', spec_value: '45dB', display_order: 2 },
      { spec_key: 'battery', spec_value: '42', unit: 'hours total', display_order: 3 },
      { spec_key: 'codec', spec_value: 'LDAC', display_order: 4 },
      { spec_key: 'latency', spec_value: '50', unit: 'ms', display_order: 5 },
      { spec_key: 'waterproof', spec_value: 'IP54', display_order: 6 },
    ],
    retailers: [
      { name: 'Nothing', slug: 'nothing', price_cents: 199900, currency: 'INR', availability: 'in_stock', url: 'https://nothing.tech/products/ear-a', affiliate_url: null, logo_url: null, is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 199900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Nothing+Ear+a', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 199900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Nothing+Ear+a', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-earbuds-samsung-galaxy-buds-fe',
    category_slug: 'earbuds',
    name: 'Samsung Galaxy Buds FE',
    slug: 'galaxy-buds-fe',
    description: 'Samsung quality ANC at an accessible price — seamless Galaxy integration and solid sound.',
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&h=600&fit=crop',
    manufacturer: 'Samsung',
    model: 'Galaxy Buds FE',
    release_date: '2023-10-01',
    status: 'active',
    specs: [
      { spec_key: 'driver', spec_value: '1-way', display_order: 1 },
      { spec_key: 'anc', spec_value: '35dB', display_order: 2 },
      { spec_key: 'battery', spec_value: '30', unit: 'hours total', display_order: 3 },
      { spec_key: 'codec', spec_value: 'Samsung Scalable', display_order: 4 },
      { spec_key: 'latency', spec_value: '60', unit: 'ms', display_order: 5 },
      { spec_key: 'waterproof', spec_value: 'IPX2', display_order: 6 },
    ],
    retailers: [
      { name: 'Samsung', slug: 'samsung', price_cents: 599900, currency: 'INR', availability: 'in_stock', url: 'https://samsung.com/in/audio/galaxy-buds-fe', affiliate_url: null, logo_url: null, is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 549900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Galaxy+Buds+FE', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 549900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Galaxy+Buds+FE', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-earbuds-sony-wf-c700n',
    category_slug: 'earbuds',
    name: 'Sony WF-C700N',
    slug: 'sony-wf-c700n',
    description: 'Sony ANC earbuds at a mid-range price — DSEE upscaling and 15h battery with charging case.',
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&h=600&fit=crop',
    manufacturer: 'Sony',
    model: 'WF-C700N',
    release_date: '2023-04-01',
    status: 'active',
    specs: [
      { spec_key: 'driver', spec_value: '5.8', unit: 'mm', display_order: 1 },
      { spec_key: 'anc', spec_value: 'Yes', display_order: 2 },
      { spec_key: 'battery', spec_value: '15', unit: 'hours', display_order: 3 },
      { spec_key: 'codec', spec_value: 'SBC/AAC', display_order: 4 },
      { spec_key: 'waterproof', spec_value: 'IPX4', display_order: 5 },
    ],
    retailers: [
      { name: 'Sony', slug: 'sony', price_cents: 899900, currency: 'INR', availability: 'in_stock', url: 'https://sony.co.in/electronics/true-wireless/wf-c700n', affiliate_url: null, logo_url: null, is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 799900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Sony+WF-C700N', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 799900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Sony+WF-C700N', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  // Tablets
  {
    id: 'seed-tablet-ipad-10th-gen',
    category_slug: 'tablet',
    name: 'Apple iPad (10th Gen)',
    slug: 'ipad-10th-gen',
    description: 'The everyday iPad — A14 Bionic, 10.9" display, and USB-C. Perfect for students and casual use.',
    image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop',
    manufacturer: 'Apple',
    model: 'iPad 10th Gen',
    release_date: '2022-10-18',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Apple A14 Bionic', display_order: 1 },
      { spec_key: 'ram', spec_value: '4', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '64', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '10.9', unit: 'inches', display_order: 4 },
      { spec_key: 'battery', spec_value: '10', unit: 'hours', display_order: 5 },
      { spec_key: 'weight', spec_value: '477', unit: 'g', display_order: 6 },
    ],
    retailers: [
      { name: 'Apple', slug: 'apple', price_cents: 4490000, currency: 'INR', availability: 'in_stock', url: 'https://apple.com/in/shop/buy-ipad', affiliate_url: null, logo_url: null, is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 4099900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=iPad+10th+Gen', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 4099900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=iPad+10th+Gen', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-tablet-samsung-galaxy-tab-a9',
    category_slug: 'tablet',
    name: 'Samsung Galaxy Tab A9+',
    slug: 'galaxy-tab-a9-plus',
    description: 'Budget Android tablet with 90Hz display and quad speakers — great for media consumption.',
    image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop',
    manufacturer: 'Samsung',
    model: 'Galaxy Tab A9+',
    release_date: '2023-10-01',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Snapdragon 695', display_order: 1 },
      { spec_key: 'ram', spec_value: '4', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '64', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '11', unit: 'inches', display_order: 4 },
      { spec_key: 'battery', spec_value: '7040', unit: 'mAh', display_order: 5 },
      { spec_key: 'weight', spec_value: '521', unit: 'g', display_order: 6 },
    ],
    retailers: [
      { name: 'Samsung', slug: 'samsung', price_cents: 2299900, currency: 'INR', availability: 'in_stock', url: 'https://samsung.com/in/tablets/galaxy-tab-a9', affiliate_url: null, logo_url: null, is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 2099900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Galaxy+Tab+A9+', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 2099900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Galaxy+Tab+A9+', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-tablet-oneplus-pad',
    category_slug: 'tablet',
    name: 'OnePlus Pad',
    slug: 'oneplus-pad',
    description: 'Premium Android tablet with Dimensity 9000, 144Hz display, and 67W fast charging.',
    image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop',
    manufacturer: 'OnePlus',
    model: 'OnePlus Pad',
    release_date: '2023-04-28',
    status: 'active',
    specs: [
      { spec_key: 'cpu', spec_value: 'Dimensity 9000', display_order: 1 },
      { spec_key: 'ram', spec_value: '8', unit: 'GB', display_order: 2 },
      { spec_key: 'storage', spec_value: '128', unit: 'GB', display_order: 3 },
      { spec_key: 'display', spec_value: '11.61', unit: 'inches', display_order: 4 },
      { spec_key: 'battery', spec_value: '9510', unit: 'mAh', display_order: 5 },
      { spec_key: 'weight', spec_value: '552', unit: 'g', display_order: 6 },
    ],
    retailers: [
      { name: 'OnePlus', slug: 'oneplus', price_cents: 3799900, currency: 'INR', availability: 'in_stock', url: 'https://oneplus.in/oneplus-pad', affiliate_url: null, logo_url: null, is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 3699900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=OnePlus+Pad', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 3699900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=OnePlus+Pad', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  // Monitors
  {
    id: 'seed-monitor-dell-24-monitor',
    category_slug: 'monitor',
    name: 'Dell 24 Monitor (S2421HN)',
    slug: 'dell-s2421hn',
    description: 'Reliable 24" FHD IPS monitor with slim bezels — perfect for office and everyday use.',
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=600&fit=crop',
    manufacturer: 'Dell',
    model: 'S2421HN',
    release_date: '2021-06-01',
    status: 'active',
    specs: [
      { spec_key: 'display', spec_value: '23.8', unit: 'inches', display_order: 1 },
      { spec_key: 'resolution', spec_value: '1920x1080', display_order: 2 },
      { spec_key: 'panel', spec_value: 'IPS', display_order: 3 },
      { spec_key: 'refresh_rate', spec_value: '75', unit: 'Hz', display_order: 4 },
      { spec_key: 'ports', spec_value: 'HDMI x2', display_order: 5 },
    ],
    retailers: [
      { name: 'Dell', slug: 'dell', price_cents: 1199900, currency: 'INR', availability: 'in_stock', url: 'https://dell.com/in/en/dk/monitor/dell-s2421hn', affiliate_url: null, logo_url: null, is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 1049900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Dell+S2421HN', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 1049900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Dell+S2421HN', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-monitor-lg-27-gaming',
    category_slug: 'monitor',
    name: 'LG UltraGear 27GS60F',
    slug: 'lg-ultragear-27gs60f',
    description: '27" FHD IPS gaming monitor with 180Hz refresh rate and 1ms response — entry-level gaming perfection.',
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=600&fit=crop',
    manufacturer: 'LG',
    model: '27GS60F',
    release_date: '2024-01-15',
    status: 'active',
    specs: [
      { spec_key: 'display', spec_value: '27', unit: 'inches', display_order: 1 },
      { spec_key: 'resolution', spec_value: '1920x1080', display_order: 2 },
      { spec_key: 'panel', spec_value: 'IPS', display_order: 3 },
      { spec_key: 'refresh_rate', spec_value: '180', unit: 'Hz', display_order: 4 },
      { spec_key: 'response_time', spec_value: '1', unit: 'ms', display_order: 5 },
      { spec_key: 'ports', spec_value: 'HDMI, DisplayPort', display_order: 6 },
    ],
    retailers: [
      { name: 'LG', slug: 'lg', price_cents: 1699900, currency: 'INR', availability: 'in_stock', url: 'https://lg.com/in/monitors/gaming-monitors/27gs60f', affiliate_url: null, logo_url: null, is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 1499900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=LG+UltraGear+27GS60F', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 1499900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=LG+UltraGear+27GS60F', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
  {
    id: 'seed-monitor-samsung-odyssey-g5',
    category_slug: 'monitor',
    name: 'Samsung Odyssey G5 32"',
    slug: 'samsung-odyssey-g5-32',
    description: '32" WQHD curved gaming monitor with 165Hz and HDR10 — immersive gaming at a mid-range price.',
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=600&fit=crop',
    manufacturer: 'Samsung',
    model: 'Odyssey G5 LC32G55T',
    release_date: '2023-08-01',
    status: 'active',
    specs: [
      { spec_key: 'display', spec_value: '32', unit: 'inches', display_order: 1 },
      { spec_key: 'resolution', spec_value: '2560x1440', display_order: 2 },
      { spec_key: 'panel', spec_value: 'VA', display_order: 3 },
      { spec_key: 'refresh_rate', spec_value: '165', unit: 'Hz', display_order: 4 },
      { spec_key: 'response_time', spec_value: '1', unit: 'ms', display_order: 5 },
      { spec_key: 'curved', spec_value: '1000R', display_order: 6 },
    ],
    retailers: [
      { name: 'Samsung', slug: 'samsung', price_cents: 2699900, currency: 'INR', availability: 'in_stock', url: 'https://samsung.com/in/monitors/gaming/odyssey-g5', affiliate_url: null, logo_url: null, is_official: true },
      { name: 'Amazon', slug: 'amazon', price_cents: 2399900, currency: 'INR', availability: 'in_stock', url: 'https://amazon.in/s?k=Samsung+Odyssey+G5+32', affiliate_url: null, logo_url: null, is_official: false },
      { name: 'Flipkart', slug: 'flipkart', price_cents: 2399900, currency: 'INR', availability: 'in_stock', url: 'https://flipkart.com/search?q=Samsung+Odyssey+G5+32', affiliate_url: null, logo_url: null, is_official: false },
    ],
  },
];

let localProductCache: typeof SEED_PRODUCTS | null = null;
let localRetailerCache: typeof SEED_PRODUCTS[0]['retailers'] | null = null;

export function getSeedProducts(): typeof SEED_PRODUCTS {
  if (!localProductCache) {
    localProductCache = SEED_PRODUCTS.map(p => ({
      ...p,
      retailers: p.retailers.map(r => ({
        ...r,
        retailer: {
          id: `seed-retailer-${r.slug}`,
          name: r.name,
          slug: r.slug,
          website: r.url,
          logo_url: r.logo_url,
          is_official: r.is_official,
          affiliate_base_url: null,
          created_at: new Date().toISOString(),
        },
      })),
    }));
  }
  return localProductCache;
}

export function getSeedProductBySlug(slug: string) {
  return getSeedProducts().find(p => p.slug === slug) ?? null;
}

export function getSeedProductsByCategory(categorySlug: string, limit = 50) {
  return getSeedProducts()
    .filter(p => p.category_slug === categorySlug && p.status === 'active')
    .slice(0, limit);
}

export function getSeedRetailers() {
  if (!localRetailerCache) {
    const retailers = new Map();
    const products = getSeedProducts();
    products.forEach(p => {
      p.retailers.forEach(r => {
        if (!retailers.has(r.slug)) {
          retailers.set(r.slug, (r as any).retailer);
        }
      });
    });
    localRetailerCache = Array.from(retailers.values());
  }
  return localRetailerCache;
}

export function getSeedProductWithRetailers(slug: string) {
  const product = getSeedProducts().find(p => p.slug === slug);
  if (!product) return null;

  // Transform to match ProductWithRetailers interface
  return {
    id: product.id,
    category_slug: product.category_slug,
    name: product.name,
    slug: product.slug,
    description: product.description,
    image_url: product.image_url,
    manufacturer: product.manufacturer,
    model: product.model,
    release_date: product.release_date,
    status: product.status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    specs: product.specs.map(s => ({
      id: `seed-spec-${product.slug}-${s.spec_key}`,
      product_id: product.id,
      spec_key: s.spec_key,
      spec_value: s.spec_value,
      unit: s.unit || null,
      display_order: s.display_order,
    })),
    retailers: product.retailers.map(r => ({
      id: `seed-pr-${product.slug}-${r.slug}`,
      product_id: product.id,
      retailer_id: `seed-retailer-${r.slug}`,
      url: r.url,
      price_cents: r.price_cents,
      currency: r.currency,
      availability: r.availability,
      affiliate_url: r.affiliate_url,
      last_checked: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      retailer: {
        id: `seed-retailer-${r.slug}`,
        name: r.name,
        slug: r.slug,
        website: r.url,
        logo_url: r.logo_url,
        is_official: r.is_official,
        affiliate_base_url: null,
        created_at: new Date().toISOString(),
      },
    })),
  };
}

export function getSeedBuyingGuides() {
  return [
    // ============ SMARTPHONE GUIDES ============
    {
      id: 'seed-guide-phones-under-5000',
      title: 'Best Phones Under ₹5,000 in 2026',
      slug: 'best-phones-under-5000-2026',
      excerpt: 'Entry-level smartphones for basic calling, WhatsApp, and UPI payments.',
      content: '',
      category_slug: 'smartphone',
      cover_image_url: 'https://picsum.photos/seed/phones-5k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Phones Under ₹5,000 (2026)',
      seo_description: 'Top budget phones under 5000 for calling, WhatsApp, and UPI.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-phones-under-8000',
      title: 'Best Phones Under ₹8,000 in 2026',
      slug: 'best-phones-under-8000-2026',
      excerpt: 'Reliable daily drivers with decent cameras and all-day battery.',
      content: '',
      category_slug: 'smartphone',
      cover_image_url: 'https://picsum.photos/seed/phones-8k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Phones Under ₹8,000 (2026)',
      seo_description: 'Budget smartphones under 8000 with good cameras and battery.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-phones-under-10000',
      title: 'Best Phones Under ₹10,000 in 2026',
      slug: 'best-phones-under-10000-2026',
      excerpt: 'The sweet spot for first-time smartphone buyers — decent specs without breaking the bank.',
      content: '',
      category_slug: 'smartphone',
      cover_image_url: 'https://picsum.photos/seed/phones-10k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Phones Under ₹10,000 (2026)',
      seo_description: 'Top budget phones under 10000 with good performance and cameras.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-phones-under-15000',
      title: 'Best Phones Under ₹15,000 in 2026',
      slug: 'best-phones-under-15000-2026',
      excerpt: 'Mid-range performers with 5G, good cameras, and smooth displays.',
      content: '',
      category_slug: 'smartphone',
      cover_image_url: 'https://picsum.photos/seed/phones-15k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Phones Under ₹15,000 (2026)',
      seo_description: 'Best 5G phones under 15000 with AMOLED displays and fast charging.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-phones-under-20000',
      title: 'Best Phones Under ₹20,000 in 2026',
      slug: 'best-phones-under-20000-2026',
      excerpt: 'Upper mid-range with flagship-grade cameras, 120Hz displays, and fast charging.',
      content: '',
      category_slug: 'smartphone',
      cover_image_url: 'https://picsum.photos/seed/phones-20k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Phones Under ₹20,000 (2026)',
      seo_description: 'Top phones under 20000 with 120Hz AMOLED, 50MP cameras, fast charging.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-phones-under-25000',
      title: 'Best Phones Under ₹25,000 in 2026',
      slug: 'best-phones-under-25000-2026',
      excerpt: 'Premium mid-range — near-flagship performance at half the price.',
      content: '',
      category_slug: 'smartphone',
      cover_image_url: 'https://picsum.photos/seed/phones-25k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Phones Under ₹25,000 (2026)',
      seo_description: 'Best phones under 25000 with flagship processors and premium builds.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-phones-under-30000',
      title: 'Best Phones Under ₹30,000 in 2026',
      slug: 'best-phones-under-30000-2026',
      excerpt: 'Flagship killers — top-tier specs, premium builds, and excellent cameras.',
      content: '',
      category_slug: 'smartphone',
      cover_image_url: 'https://picsum.photos/seed/phones-30k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Phones Under ₹30,000 (2026)',
      seo_description: 'Best flagship killer phones under 30000 with Snapdragon 8 series.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-phones-under-40000',
      title: 'Best Phones Under ₹40,000 in 2026',
      slug: 'best-phones-under-40000-2026',
      excerpt: 'Premium flagships with top cameras, IP ratings, and wireless charging.',
      content: '',
      category_slug: 'smartphone',
      cover_image_url: 'https://picsum.photos/seed/phones-40k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Phones Under ₹40,000 (2026)',
      seo_description: 'Premium phones under 40000 with flagship cameras and IP68.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-phones-under-50000',
      title: 'Best Phones Under ₹50,000 in 2026',
      slug: 'best-phones-under-50000-2026',
      excerpt: 'Near-perfect flagships — iPhone, Galaxy S, Pixel at their best.',
      content: '',
      category_slug: 'smartphone',
      cover_image_url: 'https://picsum.photos/seed/phones-50k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Phones Under ₹50,000 (2026)',
      seo_description: 'Best flagship phones under 50000 — iPhone 15, Galaxy S24, Pixel 8.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-phones-under-100000',
      title: 'Best Phones Under ₹1,00,000 in 2026',
      slug: 'best-phones-under-100000-2026',
      excerpt: 'No compromises — the absolute best smartphones money can buy in India.',
      content: '',
      category_slug: 'smartphone',
      cover_image_url: 'https://picsum.photos/seed/phones-1l/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Phones Under ₹1,00,000 (2026)',
      seo_description: 'Best premium phones under 1 lakh — iPhone Pro, Galaxy Ultra, Pixel Pro.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    // ============ PHONE USE CASE GUIDES ============
    {
      id: 'seed-guide-phones-for-camera',
      title: 'Best Phones for Photography in 2026',
      slug: 'best-phones-for-photography-2026',
      excerpt: 'From night mode to RAW editing — phones that replace dedicated cameras.',
      content: '',
      category_slug: 'smartphone',
      cover_image_url: 'https://picsum.photos/seed/phones-camera/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Camera Phones (2026)',
      seo_description: 'Top camera phones for photography with night mode, zoom, and RAW support.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-phones-for-gaming',
      title: 'Best Phones for Gaming in 2026',
      slug: 'best-phones-for-gaming-2026',
      excerpt: 'Snapdragon 8 Gen 3, vapor cooling, and 120Hz — built for BGMI and Genshin.',
      content: '',
      category_slug: 'smartphone',
      cover_image_url: 'https://picsum.photos/seed/phones-gaming/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Gaming Phones (2026)',
      seo_description: 'Best phones for BGMI, Genshin Impact with Snapdragon 8 Gen 3 and cooling.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-phones-for-battery',
      title: 'Best Phones for Battery Life in 2026',
      slug: 'best-phones-for-battery-life-2026',
      excerpt: '6000mAh+ batteries and efficient chips — phones that last 2 days.',
      content: '',
      category_slug: 'smartphone',
      cover_image_url: 'https://picsum.photos/seed/phones-battery/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Battery Phones (2026)',
      seo_description: 'Best phones with 6000mAh battery and 2-day battery life.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    // ============ LAPTOP GUIDES ============
    {
      id: 'seed-guide-laptops-under-25000',
      title: 'Best Laptops Under ₹25,000 in 2026',
      slug: 'best-laptops-under-25000-2026',
      excerpt: 'Chromebooks and entry-level Windows laptops for basic browsing and office work.',
      content: '',
      category_slug: 'laptop',
      cover_image_url: 'https://picsum.photos/seed/laptops-25k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Laptops Under ₹25,000 (2026)',
      seo_description: 'Budget laptops under 25000 for students and basic office work.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-laptops-under-40000',
      title: 'Best Laptops Under ₹40,000 in 2026',
      slug: 'best-laptops-under-40000-2026',
      excerpt: 'Ryzen 5 / Core i5 laptops for students, coding, and everyday productivity.',
      content: '',
      category_slug: 'laptop',
      cover_image_url: 'https://picsum.photos/seed/laptops-40k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Laptops Under ₹40,000 (2026)',
      seo_description: 'Best laptops under 40000 with Ryzen 5 and Core i5 for coding and productivity.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-laptops-under-50000',
      title: 'Best Laptops Under ₹50,000 in 2026',
      slug: 'best-laptops-under-50000-2026',
      excerpt: 'Performance laptops with dedicated GPUs for light gaming and content creation.',
      content: '',
      category_slug: 'laptop',
      cover_image_url: 'https://picsum.photos/seed/laptops-50k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Laptops Under ₹50,000 (2026)',
      seo_description: 'Best laptops under 50000 with GPU for gaming and video editing.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-laptops-under-60000',
      title: 'Best Laptops Under ₹60,000 in 2026',
      slug: 'best-laptops-under-60000-2026',
      excerpt: 'Thin-and-light performance machines with premium builds and all-day battery.',
      content: '',
      category_slug: 'laptop',
      cover_image_url: 'https://picsum.photos/seed/laptops-60k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Laptops Under ₹60,000 (2026)',
      seo_description: 'Premium laptops under 60000 with thin designs and strong performance.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-laptops-under-100000',
      title: 'Best Laptops Under ₹1,00,000 in 2026',
      slug: 'best-laptops-under-100000-2026',
      excerpt: 'MacBook Air M2, Dell XPS, ThinkPad — premium ultrabooks that do it all.',
      content: '',
      category_slug: 'laptop',
      cover_image_url: 'https://picsum.photos/seed/laptops-1l/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Laptops Under ₹1,00,000 (2026)',
      seo_description: 'Best premium laptops under 1 lakh — MacBook, Dell XPS, ThinkPad.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-laptops-for-students',
      title: 'Best Laptops for College Students in 2026',
      slug: 'best-laptops-for-students-2026',
      excerpt: 'Lightweight, long battery, and affordable — laptops that survive campus life.',
      content: '',
      category_slug: 'laptop',
      cover_image_url: 'https://picsum.photos/seed/laptops-student/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Laptops for Students (2026)',
      seo_description: 'Best laptops for college students under 50000 with long battery life.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-laptops-for-programming',
      title: 'Best Laptops for Programming in 2026',
      slug: 'best-laptops-for-programming-2026',
      excerpt: 'RAM, CPU cores, and keyboard quality — what actually matters for developers.',
      content: '',
      category_slug: 'laptop',
      cover_image_url: 'https://picsum.photos/seed/laptops-code/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Laptops for Programming (2026)',
      seo_description: 'Best laptops for coding with 16GB RAM, fast SSDs, and good keyboards.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-laptops-for-gaming',
      title: 'Best Gaming Laptops in 2026',
      slug: 'best-gaming-laptops-2026',
      excerpt: 'RTX 4060, 144Hz displays, and vapor chambers — portable gaming sorted.',
      content: '',
      category_slug: 'laptop',
      cover_image_url: 'https://picsum.photos/seed/laptops-gaming/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Gaming Laptops (2026)',
      seo_description: 'Best gaming laptops with RTX 4060, 144Hz displays under 1 lakh.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    // ============ HEADPHONES / EARBUDS GUIDES ============
    {
      id: 'seed-guide-earbuds-under-1000',
      title: 'Best Earbuds Under ₹1,000 in 2026',
      slug: 'best-earbuds-under-1000-2026',
      excerpt: 'TWS earbuds that actually sound good — no branded junk, just value.',
      content: '',
      category_slug: 'earbuds',
      cover_image_url: 'https://picsum.photos/seed/earbuds-1k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Earbuds Under ₹1,000 (2026)',
      seo_description: 'Best TWS earbuds under 1000 with good sound and low latency.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-earbuds-under-2000',
      title: 'Best Earbuds Under ₹2,000 in 2026',
      slug: 'best-earbuds-under-2000-2026',
      excerpt: 'ANC, low latency gaming modes, and 30h+ battery at budget prices.',
      content: '',
      category_slug: 'earbuds',
      cover_image_url: 'https://picsum.photos/seed/earbuds-2k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Earbuds Under ₹2,000 (2026)',
      seo_description: 'Best earbuds under 2000 with ANC and gaming mode.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-earbuds-under-5000',
      title: 'Best Earbuds Under ₹5,000 in 2026',
      slug: 'best-earbuds-under-5000-2026',
      excerpt: 'Premium sound quality with adaptive ANC — Sony, JBL, Samsung at their best.',
      content: '',
      category_slug: 'earbuds',
      cover_image_url: 'https://picsum.photos/seed/earbuds-5k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Earbuds Under ₹5,000 (2026)',
      seo_description: 'Best premium earbuds under 5000 — Sony, JBL, Samsung, Nothing.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-headphones-under-2000',
      title: 'Best Headphones Under ₹2,000 in 2026',
      slug: 'best-headphones-under-2000-2026',
      excerpt: 'Over-ear comfort at budget prices — wired and wireless options.',
      content: '',
      category_slug: 'headphones',
      cover_image_url: 'https://picsum.photos/seed/hp-2k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Headphones Under ₹2,000 (2026)',
      seo_description: 'Best over-ear headphones under 2000 for music and calls.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-headphones-under-5000',
      title: 'Best Headphones Under ₹5,000 in 2026',
      slug: 'best-headphones-under-5000-2026',
      excerpt: 'ANC headphones with 30h+ battery — Sony, JBL, Anker at mid-range prices.',
      content: '',
      category_slug: 'headphones',
      cover_image_url: 'https://picsum.photos/seed/hp-5k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Headphones Under ₹5,000 (2026)',
      seo_description: 'Best ANC headphones under 5000 with long battery life.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-headphones-under-10000',
      title: 'Best Headphones Under ₹10,000 in 2026',
      slug: 'best-headphones-under-10000-2026',
      excerpt: 'Premium ANC headphones — Sony WH-1000XM4, Bose QC45 territory.',
      content: '',
      category_slug: 'headphones',
      cover_image_url: 'https://picsum.photos/seed/hp-10k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Headphones Under ₹10,000 (2026)',
      seo_description: 'Best premium ANC headphones under 10000 — Sony, Bose, Sennheiser.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    // ============ TABLET GUIDES ============
    {
      id: 'seed-guide-tablets-under-15000',
      title: 'Best Tablets Under ₹15,000 in 2026',
      slug: 'best-tablets-under-15000-2026',
      excerpt: 'Budget tablets for entertainment, reading, and light productivity.',
      content: '',
      category_slug: 'tablet',
      cover_image_url: 'https://picsum.photos/seed/tablets-15k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Tablets Under ₹15,000 (2026)',
      seo_description: 'Best budget tablets under 15000 for entertainment and reading.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-tablets-under-30000',
      title: 'Best Tablets Under ₹30,000 in 2026',
      slug: 'best-tablets-under-30000-2026',
      excerpt: 'iPad, Samsung Tab S, and OnePlus Pad — tablets that replace laptops.',
      content: '',
      category_slug: 'tablet',
      cover_image_url: 'https://picsum.photos/seed/tablets-30k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Tablets Under ₹30,000 (2026)',
      seo_description: 'Best tablets under 30000 with stylus and keyboard support.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    // ============ MONITOR GUIDES ============
    {
      id: 'seed-guide-monitors-under-10000',
      title: 'Best Monitors Under ₹10,000 in 2026',
      slug: 'best-monitors-under-10000-2026',
      excerpt: '24-inch FHD monitors for work-from-home and casual gaming.',
      content: '',
      category_slug: 'monitor',
      cover_image_url: 'https://picsum.photos/seed/monitors-10k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Monitors Under ₹10,000 (2026)',
      seo_description: 'Best 24-inch FHD monitors under 10000 for WFH and gaming.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-monitors-under-20000',
      title: 'Best Monitors Under ₹20,000 in 2026',
      slug: 'best-monitors-under-20000-2026',
      excerpt: '27-inch QHD and 144Hz gaming monitors — the sweet spot for most users.',
      content: '',
      category_slug: 'monitor',
      cover_image_url: 'https://picsum.photos/seed/monitors-20k/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best Monitors Under ₹20,000 (2026)',
      seo_description: 'Best 27-inch QHD and 144Hz gaming monitors under 20000.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    // ============ USE CASE / COMPARISON GUIDES ============
    {
      id: 'seed-guide-best-phones-under-300',
      title: 'Best Phones Under ₹30,000: What to Actually Check',
      slug: 'best-phones-under-300-2026',
      excerpt: 'Skip the spec sheet marketing — update policy, real RAM behavior, and network bands matter more at this price.',
      content: '',
      category_slug: 'smartphone',
      cover_image_url: 'https://picsum.photos/seed/guide-phones/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Admin',
      is_ai_assisted: true,
      seo_title: 'Best Phones Under ₹30,000 (2026): What to Actually Check',
      seo_description: 'A buyer checklist for budget phones: update commitment, RAM behavior, refresh rate, battery, and network bands.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-best-laptops-under-80k',
      title: 'Best Laptops Under ₹80,000 in 2026',
      slug: 'best-laptops-under-80000-2026',
      excerpt: 'Balancing performance, battery, and build quality in the mid-range laptop segment.',
      content: '',
      category_slug: 'laptop',
      cover_image_url: 'https://picsum.photos/seed/guide-laptops/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Admin',
      is_ai_assisted: false,
      seo_title: 'Best Laptops Under ₹80,000 (2026)',
      seo_description: 'Top laptop picks under ₹80,000 for programming, gaming, and everyday use.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-best-headphones-anc',
      title: 'Best Noise-Cancelling Headphones in 2026',
      slug: 'best-headphones-anc-2026',
      excerpt: 'ANC performance, comfort, and battery life compared across price tiers.',
      content: '',
      category_slug: 'headphones',
      cover_image_url: 'https://picsum.photos/seed/guide-headphones/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Admin',
      is_ai_assisted: true,
      seo_title: 'Best Noise-Cancelling Headphones (2026)',
      seo_description: 'Top ANC headphone picks for travel, office, and audiophiles.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-ipad-vs-android',
      title: 'iPad vs Android Tablets in 2026',
      slug: 'ipad-vs-android-tablets-2026',
      excerpt: 'Which ecosystem makes sense for your use case — and your wallet.',
      content: '',
      category_slug: 'tablet',
      cover_image_url: 'https://picsum.photos/seed/ipad-vs-android/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'iPad vs Android Tablets (2026)',
      seo_description: 'iPad vs Samsung Tab vs OnePlus Pad — which tablet ecosystem is better.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    {
      id: 'seed-guide-wfh-monitor-guide',
      title: 'Best WFH Monitor Setup in 2026',
      slug: 'best-wfh-monitor-setup-2026',
      excerpt: 'Dual monitors, ultrawides, or ultrasharps — what actually boosts productivity.',
      content: '',
      category_slug: 'monitor',
      cover_image_url: 'https://picsum.photos/seed/wfh-monitor/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Best WFH Monitor Setup (2026)',
      seo_description: 'Best monitors for work-from-home with USB-C, dual input, and height adjustment.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
    // ============ PC BUILDING GUIDE ============
    {
      id: 'seed-guide-pc-building-2026',
      title: 'The Complete PC Building Guide for India — 2026',
      slug: 'complete-pc-building-guide-india-2026',
      excerpt: 'From choosing parts to your first boot — everything you need to build a PC in India, with Indian pricing, vendor tips, and compatibility checklists.',
      content: `## Why Build a PC in 2026?

Building your own PC gives you **better performance per rupee**, full control over component quality, and the satisfaction of assembling something yourself. In India, where pre-built desktops often carry 20–40% markup over component cost, building saves real money — especially in the ₹40,000–₹1,50,000 range.

### Who Should Build?

- You want a machine tuned to your exact workload (gaming, video editing, software development, 3D rendering)
- You're comfortable following a step-by-step process and troubleshooting
- You want upgradeable parts instead of a sealed box

### Who Should Buy Pre-Built?

- You need a working system today with zero downtime
- You don't want to deal with RMA or compatibility issues
- Corporate/enterprise procurement requires vendor warranties

---

## Understanding PC Components

Every PC has **eight core components**. Here's what each does and why it matters:

### 1. CPU (Processor)

The brain of your PC. Determines how many tasks you can run simultaneously and how fast each task completes.

**What to look for:**
- **Cores/Threads** — More cores = better multitasking. 6-core is the sweet spot for most users; 8–12 cores for video editing and streaming.
- **Clock Speed (GHz)** — Higher = faster single-threaded performance (games, light tasks).
- **TDP** — Thermal Design Power. Higher TDP means you need better cooling.
- **Integrated Graphics (iGPU)** — Some CPUs have built-in graphics (Intel UHD, AMD Radeon Graphics). Useful if you don't plan to buy a GPU immediately.

**2026 Recommendations:**

| Budget | CPU | Cores/Threads | TDP | Price Range (India) |
|--------|-----|---------------|-----|---------------------|
| Entry | AMD Ryzen 5 7500F | 6/12 | 65W | ₹13,000–15,000 |
| Mid | AMD Ryzen 5 7600X | 6/12 | 105W | ₹18,000–21,000 |
| Mid-High | AMD Ryzen 7 7700X | 8/16 | 105W | ₹27,000–32,000 |
| High | AMD Ryzen 9 7900X | 12/24 | 170W | ₹38,000–45,000 |
| Intel Budget | Intel Core i5-14400F | 10/16 | 148W | ₹16,000–19,000 |
| Intel Mid | Intel Core i7-14700K | 20/28 | 253W | ₹33,000–38,000 |

> **Tip:** For pure gaming, the Ryzen 5 7600X or i5-14400F is the best value. For mixed workloads (gaming + streaming + editing), the Ryzen 7 7700X offers the best balance.

---

### 2. GPU (Graphics Card)

Handles all visual output — games, video playback, 3D rendering, and GPU-accelerated AI tasks.

**What to look for:**
- **VRAM** — 8GB is minimum for 1080p gaming; 12GB for 1440p; 16GB+ for 4K
- **TDP** — Determines PSU and cooling requirements
- **DLSS/FSR support** — Upscaling tech that boosts frame rates
- **Ray tracing** — Hardware-accelerated lighting (more important in 2026 games)

**2026 Recommendations:**

| Budget | GPU | VRAM | Price Range (India) |
|--------|-----|------|---------------------|
| Entry | NVIDIA RTX 4060 | 8GB | ₹28,000–32,000 |
| Mid | NVIDIA RTX 4060 Ti | 8GB | ₹38,000–44,000 |
| High | NVIDIA RTX 4070 Ti Super | 16GB | ₹65,000–75,000 |
| Enthusiast | NVIDIA RTX 4080 Super | 16GB | ₹1,00,000–1,15,000 |
| AMD Entry | RX 7600 | 8GB | ₹25,000–28,000 |
| AMD Mid | RX 7700 XT | 12GB | ₹38,000–42,000 |
| AMD High | RX 7900 XT | 20GB | ₹75,000–85,000 |

> **Tip:** For 1080p gaming at 60fps, an RTX 4060 is enough. For 1440p at 144fps, get an RTX 4060 Ti or RX 7700 XT. For 4K, you need RTX 4070 Ti Super or better.

---

### 3. Motherboard

The backbone that connects all components. **Your motherboard must be compatible with your CPU.**

**What to look for:**
- **Socket** — AMD AM5 or Intel LGA 1700/1851. Must match your CPU.
- **Chipset** — B650/B760 for budget; X670/Z790 for overclocking
- **RAM slots** — 4 slots minimum for future upgrades
- **M.2 slots** — For NVMe SSDs. 2+ slots recommended
- **WiFi** — Built-in WiFi 6E saves you buying a separate card

**Recommended Motherboards:**

| Category | Model | Socket | Price (India) |
|----------|-------|--------|---------------|
| Budget AMD | MSI B650M-A WiFi | AM5 | ₹12,000–14,000 |
| Mid AMD | ASUS TUF Gaming B650-Plus WiFi | AM5 | ₹18,000–21,000 |
| High AMD | MSI X670E Tomahawk WiFi | AM5 | ₹28,000–32,000 |
| Budget Intel | Gigabyte B760M DS3H AX | LGA 1700 | ₹11,000–13,000 |
| Mid Intel | MSI MAG Z790 Tomahawk WiFi | LGA 1700 | ₹24,000–28,000 |

> **Tip:** For most builds, a B650 (AMD) or B760 (Intel) board is enough. Only go X670/Z790 if you plan to overclock or need extra PCIe lanes.

---

### 4. RAM (Memory)

Temporary workspace for active programs. More RAM = more apps open simultaneously without slowdown.

**What to look for:**
- **Capacity** — 16GB is the minimum for 2026. 32GB for video editing/heavy multitasking. 64GB for professional 3D/AI workloads.
- **Speed** — DDR5-5600 is the sweet spot for AMD; DDR5-6000 for Intel
- **Latency** — CL30 or lower is ideal
- **Configuration** — Always buy in pairs (2×8GB, 2×16GB) for dual-channel performance

**2026 Recommendations:**

| Use Case | Config | Price Range (India) |
|----------|--------|---------------------|
| Gaming | 2×8GB DDR5-5600 | ₹5,000–6,500 |
| Gaming + Productivity | 2×16GB DDR5-5600 | ₹9,000–12,000 |
| Video Editing | 2×16GB DDR5-6000 | ₹11,000–14,000 |
| Professional Workstation | 2×32GB DDR5-6000 | ₹20,000–26,000 |

> **Tip:** Don't mix different RAM kits. Buy a single kit (e.g., 2×16GB) rather than two separate 16GB sticks — they're tested to work together.

---

### 5. Storage

Where your OS, games, and files live permanently.

**What to look for:**
- **NVMe SSD** — 5–7× faster than SATA SSD. Get at least 500GB for your OS + main apps.
- **SATA SSD** — Good for game storage and bulk files. Much cheaper per GB.
- **HDD** — Only for archival/backup. Too slow for modern games.

**Recommended Configuration:**

| Budget | Boot Drive | Game/Extra Storage | Total Cost (India) |
|--------|-----------|-------------------|-------------------|
| Entry | 500GB NVMe | — | ₹3,500–4,500 |
| Mid | 1TB NVMe | 1TB SATA SSD | ₹8,000–11,000 |
| High | 2TB NVMe | 2TB SATA SSD | ₹16,000–20,000 |
| Professional | 2TB Gen5 NVMe | 4TB NVMe | ₹35,000–45,000 |

**Popular SSDs in India (2026):**

- WD Blue SN580 1TB — ₹5,500–6,500 (great all-rounder)
- Samsung 980 Pro 1TB — ₹8,000–9,500 (high endurance)
- Crucial P3 Plus 1TB — ₹4,500–5,500 (budget NVMe)
- Kingston NV2 2TB — ₹9,000–11,000 (best value per GB)

---

### 6. PSU (Power Supply Unit)

Powers everything. **Never cheap out on the PSU** — a bad one can fry your entire system.

**What to look for:**
- **Wattage** — Add up TDP of CPU + GPU, then add 150–200W headroom
- **Efficiency rating** — 80+ Bronze minimum; 80+ Gold recommended
- **Modularity** — Fully modular = cleaner cable management
- **ATX 3.0** — New standard with native 12VHPWR connector for modern GPUs

**Wattage Guide by Build Type:**

| Build Type | CPU TDP | GPU TDP | Recommended PSU |
|------------|---------|---------|-----------------|
| Entry Gaming | 65W | 115W | 550W 80+ Bronze |
| Mid Gaming | 105W | 160W | 650W 80+ Gold |
| High Gaming | 170W | 250W | 850W 80+ Gold |
| Enthusiast | 253W | 320W | 1000W 80+ Gold |

**Recommended PSUs:**

| Budget | Model | Wattage | Price (India) |
|--------|-------|---------|---------------|
| Entry | Corsair CX550 | 550W | ₹4,500–5,500 |
| Mid | Corsair RM650e | 650W | ₹7,000–8,500 |
| High | Corsair RM850e | 850W | ₹10,000–12,000 |
| Enthusiast | Corsair HX1000 | 1000W | ₹15,000–18,000 |

> **Tip:** For NVIDIA RTX 4070 Ti and above, get an ATX 3.0 PSU with native 12VHPWR cable to avoid adapter issues.

---

### 7. Cabinet (Case)

Houses all components. Affects airflow, noise, and ease of building.

**What to look for:**
- **Airflow** — Mesh front panels > solid front panels
- **Size** — ATX mid-tower is standard; mATX for compact builds
- **Cable management** — Back panel space for routing cables
- **GPU clearance** — Check max GPU length supported
- **Fan mounts** — More = better cooling potential

**Recommended Cases:**

| Budget | Model | Type | Price (India) |
|--------|-------|------|---------------|
| Entry | Deepcool MATREXX 40 | mATX | ₹3,500–4,500 |
| Mid | Lian Li Lancool 216 | ATX | ₹7,000–8,500 |
| High | Fractal Design North | ATX | ₹12,000–14,000 |
| Premium | Lian Li O11 Dynamic EVO | ATX | ₹15,000–18,000 |

> **Tip:** A ₹5,000 case with good airflow often beats a ₹15,000 case with RGB and poor ventilation.

---

### 8. CPU Cooler

Keeps your processor cool. Stock coolers work for entry builds; aftermarket is better for mid-range and above.

**Types:**
- **Stock cooler** — Free with CPU. Noisy under load.
- **Tower air cooler** — Quiet, reliable, great value (₹2,000–5,000)
- **AIO liquid cooler** — Better for high-TDP CPUs, cleaner look (₹8,000–18,000)
- **Custom loop** — Enthusiast only. ₹30,000+

**Recommended Coolers:**

| Budget | Model | Type | Price (India) |
|--------|-------|------|---------------|
| Entry | AMD Wraith Prism | Stock | Free with Ryzen 7 |
| Mid | Deepcool AK400 | Tower Air | ₹2,500–3,500 |
| Mid-High | Deepcool AK620 | Dual Tower | ₹4,500–5,500 |
| High | Corsair H150i Elite | 360mm AIO | ₹12,000–15,000 |

> **Tip:** For a Ryzen 5 7600X or i5-14400F, a ₹3,000 tower cooler is enough. For Ryzen 7/9 or i7/i9, consider a 240mm+ AIO.

---

## Build Configurations by Budget

Here are **four tested configurations** at different price points, with Indian pricing:

### Budget Build — ₹50,000 (1080p Gaming)

| Component | Model | Price (India) |
|-----------|-------|---------------|
| CPU | AMD Ryzen 5 7500F | ₹14,000 |
| GPU | RX 7600 8GB | ₹26,000 |
| Motherboard | MSI B650M-A WiFi | ₹12,000 |
| RAM | 2×8GB DDR5-5600 | ₹5,500 |
| Storage | 500GB NVMe SSD | ₹3,800 |
| PSU | 550W 80+ Bronze | ₹4,800 |
| Cabinet | Deepcool MATREXX 40 | ₹3,800 |
| Cooler | AMD Wraith Prism | Free |
| **Total** | | **₹70,700** |

> Runs Cyberpunk 2077 at 1080p High @ 60fps. Great for students and casual gamers.

### Mid-Range Build — ₹85,000 (1440p Gaming)

| Component | Model | Price (India) |
|-----------|-------|---------------|
| CPU | AMD Ryzen 5 7600X | ₹20,000 |
| GPU | RTX 4060 Ti 8GB | ₹40,000 |
| Motherboard | ASUS TUF B650-Plus WiFi | ₹19,000 |
| RAM | 2×16GB DDR5-5600 | ₹10,000 |
| Storage | 1TB NVMe SSD | ₹6,000 |
| PSU | 650W 80+ Gold | ₹7,500 |
| Cabinet | Lian Li Lancool 216 | ₹7,500 |
| Cooler | Deepcool AK400 | ₹3,000 |
| **Total** | | **₹1,13,000** |

> Runs most games at 1440p High @ 100+ fps. Handles video editing and streaming comfortably.

### High-End Build — ₹1,40,000 (1440p/4K Gaming)

| Component | Model | Price (India) |
|-----------|-------|---------------|
| CPU | AMD Ryzen 7 7700X | ₹30,000 |
| GPU | RTX 4070 Ti Super 16GB | ₹70,000 |
| Motherboard | MSI X670E Tomahawk WiFi | ₹30,000 |
| RAM | 2×16GB DDR5-6000 | ₹12,000 |
| Storage | 1TB Gen4 NVMe | ₹8,000 |
| PSU | 850W 80+ Gold | ₹11,000 |
| Cabinet | Fractal Design North | ₹13,000 |
| Cooler | Corsair H150i Elite | ₹13,000 |
| **Total** | | **₹1,87,000** |

> 4K gaming at 60fps, 1440p at 144fps. Excellent for professional video editing and 3D work.

### Enthusiast Build — ₹2,50,000+ (No Compromises)

| Component | Model | Price (India) |
|-----------|-------|---------------|
| CPU | AMD Ryzen 9 7900X | ₹42,000 |
| GPU | RTX 4080 Super 16GB | ₹1,10,000 |
| Motherboard | ASUS ROG STRIX X670E-F | ₹38,000 |
| RAM | 2×32GB DDR5-6000 | ₹22,000 |
| Storage | 2TB Gen4 NVMe | ₹14,000 |
| PSU | 1000W 80+ Gold | ₹16,000 |
| Cabinet | Lian Li O11 Dynamic EVO | ₹16,000 |
| Cooler | Corsair H150i Elite | ₹13,000 |
| **Total** | | **₹2,71,000** |

> 4K gaming at max settings, professional-grade workstation for 8K video editing and AI workloads.

---

## The Assembly Process

### Tools You Need

- Phillips #2 screwdriver (magnetic tip preferred)
- Anti-static wrist strap (optional but recommended)
- Cable ties/velcro straps
- Good lighting
- Patience

### Step-by-Step Assembly

#### Step 1: Prepare the Case
1. Remove both side panels
2. Install motherboard standoffs (pre-installed in most ATX cases)
3. Install the I/O shield (if not pre-mounted)
4. Plan cable routing paths

#### Step 2: Install CPU on Motherboard
1. Open the CPU socket lever
2. Align the CPU (golden triangle on AMD, notches on Intel)
3. Gently place — **do not force**
4. Close the lever

> **Critical:** Bending pins ruins the CPU. Drop it in; don't press.

#### Step 3: Install RAM
1. Open RAM slot clips
2. Align RAM notch with slot key
3. Press firmly until clips snap shut
4. Use slots A2 and B2 (check motherboard manual for priority slots)

#### Step 4: Install M.2 SSD
1. Remove M.2 heatsink (if present)
2. Insert SSD at 30° angle
3. Screw down (tiny screw — don't lose it)
4. Replace heatsink

#### Step 5: Install CPU Cooler
1. Apply thermal pea-sized dot of thermal paste (if not pre-applied)
2. Mount cooler bracket
3. Screw down evenly (cross pattern)
4. Connect fan to CPU_FAN header

#### Step 6: Install Motherboard in Case
1. Lower motherboard onto standoffs
2. Screw down all 9 screws (ATX) — don't overtighten
3. Connect front panel headers (power switch, USB, audio)

#### Step 7: Install GPU
1. Remove PCIe slot covers from case
2. Open PCIe slot clip on motherboard
3. Insert GPU firmly into top x16 slot
4. Screw GPU bracket to case
5. Connect PCIe power cables from PSU

#### Step 8: Install Storage Drives
1. Mount 2.5" SSDs in drive bay or behind motherboard tray
2. Mount 3.5" HDDs in drive cage
3. Connect SATA data and power cables

#### Step 9: Cable Management
1. Route cables behind motherboard tray
2. Use cable ties to bundle
3. Connect 24-pin ATX, 8-pin CPU, PCIe power
4. Connect SATA power to drives

#### Step 10: First Boot
1. Double-check all connections
2. Connect monitor to GPU (not motherboard)
3. Power on — enter BIOS (DEL or F2)
4. Enable XMP/EXPO for RAM speed
5. Install Windows/Linux from USB
6. Install GPU drivers

---

## Where to Buy PC Components in India (2026)

### Online Retailers

| Retailer | Website | Notes |
|----------|---------|-------|
| **MD Computers** | mdcomputers.in | Best prices, wide stock |
| **PCStudio** | pcstudio.in | Good prices, reliable shipping |
| **Vedant Computers** | vedantcomputers.in | Competitive pricing |
| **Amazon India** | amazon.in | Easy returns, Prime delivery |
| **Flipkart** | flipkart.com | Sales offer great deals |
| **PrimeABGB** | primeabgb.in | Mumbai-based, good service |

### Offline / Local

- **Nehru Place, Delhi** — India's largest PC market. Best for bargaining.
- **SP Road, Bangalore** — Great for components and repairs.
- **Lamington Road, Mumbai** — Historic tech market.
- **Local computer shops** — Often match online prices; instant availability.

### Price Comparison Tips

1. **Check multiple sites** — Prices vary by ₹1,000–5,000 between retailers
2. **Wait for sales** — Republic Day, Independence Day, Diwali sales offer 10–25% off
3. **Use price trackers** — Keepa (Amazon), PriceHistory.in
4. **Buy in bundles** — Combo deals (CPU + Motherboard + RAM) often save ₹3,000–5,000
5. **EMI options** — Most retailers offer no-cost EMI on credit cards

---

## Common Mistakes to Avoid

1. **Bottlenecking** — Pairing a ₹50,000 GPU with a ₹10,000 CPU wastes GPU potential
2. **Cheap PSU** — A ₹3,000 PSU can destroy ₹1,50,000 worth of components
3. **Not checking compatibility** — CPU socket must match motherboard; RAM generation must match
4. **Overspending on RGB** — ₹5,000 in RGB fans doesn't improve performance
5. **Ignoring airflow** — A beautiful case with solid panels runs hot and noisy
6. **Forgetting the OS budget** — Windows 11 license costs ₹10,000+ (or use Linux for free)
7. **Not planning for upgrades** — Get a motherboard with extra RAM slots and M.2 slots

---

## Compatibility Checklist

Before you buy, verify:

- [ ] CPU socket matches motherboard (AM5 for AMD, LGA 1700/1851 for Intel)
- [ ] RAM type matches motherboard (DDR4 or DDR5)
- [ ] PSU wattage covers CPU + GPU TDP + 150W headroom
- [ ] Case supports motherboard form factor (ATX, mATX, ITX)
- [ ] Case supports GPU length
- [ ] CPU cooler fits case height clearance
- [ ] M.2 SSD is compatible with motherboard slot (NVMe vs SATA)

---

## Post-Build: What to Do Next

1. **Update BIOS** — Check manufacturer website for latest version
2. **Install chipset drivers** — From AMD/Intel website
3. **Install GPU drivers** — From NVIDIA/AMD website (not Windows Update)
4. **Run stress tests** — AIDA64 for CPU, FurMark for GPU, MemTest86 for RAM
5. **Monitor temperatures** — HWMonitor or Core Temp. CPU should stay under 85°C under load
6. **Set up fan curves** — In BIOS, configure fan speeds for noise vs cooling balance
7. **Enable Resizable BAR** — In BIOS, for GPU performance boost
8. **Create system image** — Backup your clean install before installing lots of software

---

## Upgrade Paths

### CPU Upgrade
- **AM5 platform** — Currently supports Ryzen 7000/8000/9000 series. AMD has committed to AM5 through 2027+
- **Intel LGA 1700** — Supports 12th–14th gen. Newer CPUs may need new motherboard.

### GPU Upgrade
- Most GPUs are drop-in replacements. Just check PSU wattage for the new card.

### RAM Upgrade
- Buy matching sticks for dual-channel. DDR5 kits are getting cheaper.

### Storage Upgrade
- Add more NVMe or SATA SSDs as needed. Motherboard slots are your limit.

---

## Warranty and RMA in India

- **CPU** — 3-year warranty (AMD/Intel)
- **GPU** — 3-year warranty (varies by brand: ASUS, MSI, Zotac, Gigabyte)
- **Motherboard** — 3-year warranty
- **RAM** — Lifetime warranty (Corsair, G.Skill) or 3-year (Kingston)
- **SSD** — 3–5 year warranty (Samsung, WD, Crucial)
- **PSU** — 5–10 year warranty (Corsair, Seasonic, EVGA)

**RMA Tips:**
- Keep all bills and warranty cards
- Register products online when possible
- Contact retailer first; they handle RMA process
- Ship in original packaging
- Take photos before shipping (in case of transit damage)

---

## Glossary

| Term | Meaning |
|------|---------|
| **ATX** | Standard motherboard/case size (305×244mm) |
| **mATX** | Smaller motherboard (244×244mm) |
| **ITX** | Compact motherboard (170×170mm) |
| **NVMe** | Fast SSD interface (up to 7,000 MB/s) |
| **SATA** | Slower SSD/HDD interface (up to 600 MB/s) |
| **XMP/EXPO** | One-click RAM overclocking profiles |
| **DLSS** | NVIDIA AI upscaling for better frame rates |
| **FSR** | AMD's answer to DLSS |
| **Resizable BAR** | Technology for CPU to access full GPU VRAM |
| **80+ Rating** | PSU efficiency certification (Bronze < Gold < Platinum) |
| **TDP** | Thermal Design Power — heat output of a component |
| **AIO** | All-In-One liquid cooler (pre-filled, no maintenance) |

---

*Last updated: September 2026. Prices are approximate and based on Indian retail. Always verify current pricing before purchasing.*`,
      category_slug: 'components',
      cover_image_url: 'https://picsum.photos/seed/pc-building/1200/675',
      status: 'published',
      author_id: null,
      author_name: 'Editorial Team',
      is_ai_assisted: false,
      seo_title: 'Complete PC Building Guide for India (2026) — Components, Pricing & Assembly',
      seo_description: 'Step-by-step PC building guide with Indian pricing, component recommendations from ₹50K to ₹2.5L, compatibility checklists, and where to buy.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    },
  ];
}