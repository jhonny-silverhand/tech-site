-- ============================================================
-- tech//site Seed Data for Shopping Intelligence
-- Run after schema.sql
-- ============================================================

-- ============================================================
-- Product Categories
-- ============================================================

insert into product_categories (slug, name, description, spec_schema) values
  ('laptop', 'Laptops', 'Notebooks, ultrabooks, and gaming laptops', '{"cpu": "string", "gpu": "string", "ram_gb": "number", "storage_gb": "number", "display_inches": "number", "battery_hours": "number", "weight_kg": "number"}'),
  ('smartphone', 'Smartphones', 'Mobile phones and phablets', '{"chipset": "string", "ram_gb": "number", "storage_gb": "number", "camera_mp": "number", "battery_mah": "number", "display_inches": "number"}'),
  ('headphones', 'Headphones', 'Over-ear, on-ear, and earbuds', '{"driver_mm": "number", "anc": "boolean", "battery_hours": "number", "weight_g": "number", "codec": "string"}'),
  ('monitor', 'Monitors', 'Desktop and portable monitors', '{"resolution": "string", "refresh_rate_hz": "number", "panel_type": "string", "size_inches": "number", "hdr": "boolean"}')
on conflict (slug) do nothing;

-- ============================================================
-- Retailers
-- ============================================================

insert into retailers (id, name, slug, website, logo_url, is_official, affiliate_base_url) values
  ('retailer-amazon-india', 'Amazon India', 'amazon-india', 'https://amazon.in', 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=64&h=64&fit=crop', false, 'https://amazon.in'),
  ('retailer-flipkart', 'Flipkart', 'flipkart', 'https://flipkart.com', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9a3?w=64&h=64&fit=crop', false, 'https://flipkart.com'),
  ('retailer-croma', 'Croma', 'croma', 'https://croma.com', 'https://images.unsplash.com/photo-1556637640-2c80d3f43b49?w=64&h=64&fit=crop', false, 'https://croma.com'),
  ('retailer-reliance-digital', 'Reliance Digital', 'reliance-digital', 'https://reliancedigital.in', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=64&h=64&fit=crop', false, 'https://reliancedigital.in'),
  ('retailer-apple', 'Apple Store', 'apple', 'https://apple.com/in', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=64&h=64&fit=crop', true, 'https://apple.com/in/shop'),
  ('retailer-samsung', 'Samsung', 'samsung', 'https://samsung.com/in', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=64&h=64&fit=crop', true, 'https://samsung.com/in')
on conflict (id) do nothing;

-- ============================================================
-- Products - Laptops
-- ============================================================

insert into products (id, category_slug, name, slug, description, image_url, manufacturer, model, release_date, status) values
  ('product-macbook-air-m2', 'laptop', 'MacBook Air (M2, 2022)', 'macbook-air-m2-2022', 'Apple''s fanless ultraportable with the M2 chip — exceptional battery life, silent operation, and enough power for most workflows.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop', 'Apple', 'MacBook Air 13" (M2)', '2022-07-15', 'active'),
  ('product-macbook-air-m3', 'laptop', 'MacBook Air (M3, 2024)', 'macbook-air-m3-2024', 'Latest MacBook Air with M3 chip — faster performance, better GPU, and same incredible battery life.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop', 'Apple', 'MacBook Air 13" (M3)', '2024-03-01', 'active'),
  ('product-dell-xps-13', 'laptop', 'Dell XPS 13 (2023)', 'dell-xps-13-2023', 'Ultra-compact Windows ultraportable with 12th/13th Gen Intel chips, stunning display options, and premium build.', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=600&fit=crop', 'Dell', 'XPS 13 9320', '2023-02-01', 'active'),
  ('product-thinkpad-x1-carbon', 'laptop', 'Lenovo ThinkPad X1 Carbon Gen 11', 'thinkpad-x1-carbon-gen11', 'Business ultraportable benchmark — legendary keyboard, MIL-STD durability, and Intel vPro manageability.', 'https://images.unsplash.com/photo-1588872657578-7efd1f155592?w=800&h=600&fit=crop', 'Lenovo', 'ThinkPad X1 Carbon Gen 11', '2023-03-01', 'active'),
  ('product-asus-zenbook-14', 'laptop', 'ASUS Zenbook 14 (2024)', 'asus-zenbook-14-2024', 'Premium ultrabook with OLED display, Intel Core Ultra processors, and excellent build quality.', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop', 'ASUS', 'Zenbook 14 UX3405', '2024-01-15', 'active'),
  ('product-hp-spectre-x360', 'laptop', 'HP Spectre x360 14', 'hp-spectre-x360-14', 'Premium 2-in-1 convertible with stunning OLED display, excellent build, and versatile form factor.', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=600&fit=crop', 'HP', 'Spectre x360 14', '2023-09-01', 'active')
on conflict (id) do nothing;

-- Products - Smartphones

insert into products (id, category_slug, name, slug, description, image_url, manufacturer, model, release_date, status) values
  ('product-iphone-15', 'smartphone', 'iPhone 15', 'iphone-15', 'Apple''s latest iPhone with Dynamic Island, USB-C, and improved camera system.', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop', 'Apple', 'iPhone 15', '2023-09-22', 'active'),
  ('product-iphone-15-pro', 'smartphone', 'iPhone 15 Pro', 'iphone-15-pro', 'Pro-level iPhone with A17 Pro chip, titanium design, and advanced camera system.', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop', 'Apple', 'iPhone 15 Pro', '2023-09-22', 'active'),
  ('product-galaxy-s24', 'smartphone', 'Samsung Galaxy S24', 'galaxy-s24', 'Samsung''s flagship with AI features, excellent camera, and vibrant display.', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop', 'Samsung', 'Galaxy S24', '2024-01-17', 'active'),
  ('product-galaxy-s24-ultra', 'smartphone', 'Samsung Galaxy S24 Ultra', 'galaxy-s24-ultra', 'Ultimate Samsung flagship with S Pen, titanium frame, and 200MP camera.', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=600&fit=crop', 'Samsung', 'Galaxy S24 Ultra', '2024-01-17', 'active'),
  ('product-pixel-8', 'smartphone', 'Google Pixel 8', 'pixel-8', 'Google''s pure Android experience with best-in-class camera and 7 years of updates.', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=600&fit=crop', 'Google', 'Pixel 8', '2023-10-12', 'active'),
  ('product-oneplus-12', 'smartphone', 'OnePlus 12', 'oneplus-12', 'Flagship killer with Snapdragon 8 Gen 3, fast charging, and Hasselblad camera.', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=600&fit=crop', 'OnePlus', 'OnePlus 12', '2024-01-23', 'active')
on conflict (id) do nothing;

-- Products - Headphones

insert into products (id, category_slug, name, slug, description, image_url, manufacturer, model, release_date, status) values
  ('product-sony-wh1000xm5', 'headphones', 'Sony WH-1000XM5', 'sony-wh-1000xm5', 'Industry-leading noise cancellation with exceptional sound quality and comfort.', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=600&fit=crop', 'Sony', 'WH-1000XM5', '2022-05-20', 'active'),
  ('product-bose-qc45', 'headphones', 'Bose QuietComfort 45', 'bose-qc-45', 'Premium noise-cancelling headphones with legendary Bose comfort and sound.', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=600&fit=crop', 'Bose', 'QuietComfort 45', '2021-09-01', 'active'),
  ('product-airpods-max', 'headphones', 'AirPods Max', 'airpods-max', 'Apple''s premium over-ear headphones with spatial audio and exceptional build quality.', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=600&fit=crop', 'Apple', 'AirPods Max', '2020-12-15', 'active'),
  ('product-sony-wh1000xm4', 'headphones', 'Sony WH-1000XM4', 'sony-wh-1000xm4', 'Previous generation flagship with excellent ANC and 30-hour battery life.', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=600&fit=crop', 'Sony', 'WH-1000XM4', '2020-08-01', 'active')
on conflict (id) do nothing;

-- ============================================================
-- Product Specs
-- ============================================================

-- MacBook Air M2 specs
insert into product_specs (product_id, spec_key, spec_value, unit, display_order) values
  ('product-macbook-air-m2', 'cpu', 'Apple M2', null, 1),
  ('product-macbook-air-m2', 'gpu', 'Apple M2 8-core', null, 2),
  ('product-macbook-air-m2', 'ram', '8', 'GB', 3),
  ('product-macbook-air-m2', 'storage', '256', 'GB', 4),
  ('product-macbook-air-m2', 'display', '13.6', 'inches', 5),
  ('product-macbook-air-m2', 'resolution', '2560x1664', null, 6),
  ('product-macbook-air-m2', 'battery_life', '18', 'hours', 7),
  ('product-macbook-air-m2', 'weight', '1.24', 'kg', 8),
  ('product-macbook-air-m2', 'refresh_rate', '60', 'Hz', 9);

-- MacBook Air M3 specs
insert into product_specs (product_id, spec_key, spec_value, unit, display_order) values
  ('product-macbook-air-m3', 'cpu', 'Apple M3', null, 1),
  ('product-macbook-air-m3', 'gpu', 'Apple M3 10-core', null, 2),
  ('product-macbook-air-m3', 'ram', '8', 'GB', 3),
  ('product-macbook-air-m3', 'storage', '256', 'GB', 4),
  ('product-macbook-air-m3', 'display', '13.6', 'inches', 5),
  ('product-macbook-air-m3', 'resolution', '2560x1664', null, 6),
  ('product-macbook-air-m3', 'battery_life', '18', 'hours', 7),
  ('product-macbook-air-m3', 'weight', '1.24', 'kg', 8),
  ('product-macbook-air-m3', 'refresh_rate', '60', 'Hz', 9);

-- Dell XPS 13 specs
insert into product_specs (product_id, spec_key, spec_value, unit, display_order) values
  ('product-dell-xps-13', 'cpu', 'Intel Core i7-1260P', null, 1),
  ('product-dell-xps-13', 'ram', '16', 'GB', 2),
  ('product-dell-xps-13', 'storage', '512', 'GB', 3),
  ('product-dell-xps-13', 'display', '13.4', 'inches', 4),
  ('product-dell-xps-13', 'resolution', '1920x1200', null, 5),
  ('product-dell-xps-13', 'battery_life', '12', 'hours', 6),
  ('product-dell-xps-13', 'weight', '1.17', 'kg', 7),
  ('product-dell-xps-13', 'refresh_rate', '60', 'Hz', 8);

-- ThinkPad X1 Carbon specs
insert into product_specs (product_id, spec_key, spec_value, unit, display_order) values
  ('product-thinkpad-x1-carbon', 'cpu', 'Intel Core i7-1365U', null, 1),
  ('product-thinkpad-x1-carbon', 'ram', '16', 'GB', 2),
  ('product-thinkpad-x1-carbon', 'storage', '512', 'GB', 3),
  ('product-thinkpad-x1-carbon', 'display', '14', 'inches', 4),
  ('product-thinkpad-x1-carbon', 'resolution', '1920x1200', null, 5),
  ('product-thinkpad-x1-carbon', 'battery_life', '15', 'hours', 6),
  ('product-thinkpad-x1-carbon', 'weight', '1.12', 'kg', 7),
  ('product-thinkpad-x1-carbon', 'refresh_rate', '60', 'Hz', 8);

-- ASUS Zenbook 14 specs
insert into product_specs (product_id, spec_key, spec_value, unit, display_order) values
  ('product-asus-zenbook-14', 'cpu', 'Intel Core Ultra 7 155H', null, 1),
  ('product-asus-zenbook-14', 'ram', '16', 'GB', 2),
  ('product-asus-zenbook-14', 'storage', '512', 'GB', 3),
  ('product-asus-zenbook-14', 'display', '14', 'inches', 4),
  ('product-asus-zenbook-14', 'resolution', '2880x1800', null, 5),
  ('product-asus-zenbook-14', 'battery_life', '14', 'hours', 6),
  ('product-asus-zenbook-14', 'weight', '1.28', 'kg', 7),
  ('product-asus-zenbook-14', 'refresh_rate', '120', 'Hz', 8);

-- HP Spectre x360 specs
insert into product_specs (product_id, spec_key, spec_value, unit, display_order) values
  ('product-hp-spectre-x360', 'cpu', 'Intel Core i7-1355U', null, 1),
  ('product-hp-spectre-x360', 'ram', '16', 'GB', 2),
  ('product-hp-spectre-x360', 'storage', '1', 'TB', 3),
  ('product-hp-spectre-x360', 'display', '13.5', 'inches', 4),
  ('product-hp-spectre-x360', 'resolution', '3000x2000', null, 5),
  ('product-hp-spectre-x360', 'battery_life', '16', 'hours', 6),
  ('product-hp-spectre-x360', 'weight', '1.36', 'kg', 7),
  ('product-hp-spectre-x360', 'refresh_rate', '60', 'Hz', 8);

-- iPhone 15 specs
insert into product_specs (product_id, spec_key, spec_value, unit, display_order) values
  ('product-iphone-15', 'chipset', 'A16 Bionic', null, 1),
  ('product-iphone-15', 'ram', '6', 'GB', 2),
  ('product-iphone-15', 'storage', '128', 'GB', 3),
  ('product-iphone-15', 'camera', '48', 'MP', 4),
  ('product-iphone-15', 'battery', '3349', 'mAh', 5),
  ('product-iphone-15', 'display', '6.1', 'inches', 6),
  ('product-iphone-15', 'resolution', '2556x1179', null, 7),
  ('product-iphone-15', 'refresh_rate', '60', 'Hz', 8);

-- iPhone 15 Pro specs
insert into product_specs (product_id, spec_key, spec_value, unit, display_order) values
  ('product-iphone-15-pro', 'chipset', 'A17 Pro', null, 1),
  ('product-iphone-15-pro', 'ram', '8', 'GB', 2),
  ('product-iphone-15-pro', 'storage', '256', 'GB', 3),
  ('product-iphone-15-pro', 'camera', '48', 'MP', 4),
  ('product-iphone-15-pro', 'battery', '3274', 'mAh', 5),
  ('product-iphone-15-pro', 'display', '6.1', 'inches', 6),
  ('product-iphone-15-pro', 'resolution', '2556x1179', null, 7),
  ('product-iphone-15-pro', 'refresh_rate', '120', 'Hz', 8);

-- Galaxy S24 specs
insert into product_specs (product_id, spec_key, spec_value, unit, display_order) values
  ('product-galaxy-s24', 'chipset', 'Snapdragon 8 Gen 3', null, 1),
  ('product-galaxy-s24', 'ram', '8', 'GB', 2),
  ('product-galaxy-s24', 'storage', '256', 'GB', 3),
  ('product-galaxy-s24', 'camera', '50', 'MP', 4),
  ('product-galaxy-s24', 'battery', '4000', 'mAh', 5),
  ('product-galaxy-s24', 'display', '6.2', 'inches', 6),
  ('product-galaxy-s24', 'resolution', '2340x1080', null, 7),
  ('product-galaxy-s24', 'refresh_rate', '120', 'Hz', 8);

-- Galaxy S24 Ultra specs
insert into product_specs (product_id, spec_key, spec_value, unit, display_order) values
  ('product-galaxy-s24-ultra', 'chipset', 'Snapdragon 8 Gen 3', null, 1),
  ('product-galaxy-s24-ultra', 'ram', '12', 'GB', 2),
  ('product-galaxy-s24-ultra', 'storage', '256', 'GB', 3),
  ('product-galaxy-s24-ultra', 'camera', '200', 'MP', 4),
  ('product-galaxy-s24-ultra', 'battery', '5000', 'mAh', 5),
  ('product-galaxy-s24-ultra', 'display', '6.8', 'inches', 6),
  ('product-galaxy-s24-ultra', 'resolution', '3120x1440', null, 7),
  ('product-galaxy-s24-ultra', 'refresh_rate', '120', 'Hz', 8);

-- Pixel 8 specs
insert into product_specs (product_id, spec_key, spec_value, unit, display_order) values
  ('product-pixel-8', 'chipset', 'Google Tensor G3', null, 1),
  ('product-pixel-8', 'ram', '8', 'GB', 2),
  ('product-pixel-8', 'storage', '128', 'GB', 3),
  ('product-pixel-8', 'camera', '50', 'MP', 4),
  ('product-pixel-8', 'battery', '4575', 'mAh', 5),
  ('product-pixel-8', 'display', '6.2', 'inches', 6),
  ('product-pixel-8', 'resolution', '2400x1080', null, 7),
  ('product-pixel-8', 'refresh_rate', '120', 'Hz', 8);

-- OnePlus 12 specs
insert into product_specs (product_id, spec_key, spec_value, unit, display_order) values
  ('product-oneplus-12', 'chipset', 'Snapdragon 8 Gen 3', null, 1),
  ('product-oneplus-12', 'ram', '12', 'GB', 2),
  ('product-oneplus-12', 'storage', '256', 'GB', 3),
  ('product-oneplus-12', 'camera', '50', 'MP', 4),
  ('product-oneplus-12', 'battery', '5400', 'mAh', 5),
  ('product-oneplus-12', 'display', '6.82', 'inches', 6),
  ('product-oneplus-12', 'resolution', '3168x1440', null, 7),
  ('product-oneplus-12', 'refresh_rate', '120', 'Hz', 8);

-- Sony WH-1000XM5 specs
insert into product_specs (product_id, spec_key, spec_value, unit, display_order) values
  ('product-sony-wh1000xm5', 'driver', '30', 'mm', 1),
  ('product-sony-wh1000xm5', 'anc', 'Industry-leading', null, 2),
  ('product-sony-wh1000xm5', 'battery_life', '30', 'hours', 3),
  ('product-sony-wh1000xm5', 'weight', '250', 'g', 4),
  ('product-sony-wh1000xm5', 'codec', 'LDAC, AAC, SBC', null, 5),
  ('product-sony-wh1000xm5', 'multipoint', 'Yes', null, 6);

-- Bose QC45 specs
insert into product_specs (product_id, spec_key, spec_value, unit, display_order) values
  ('product-bose-qc45', 'driver', '40', 'mm', 1),
  ('product-bose-qc45', 'anc', 'Excellent', null, 2),
  ('product-bose-qc45', 'battery_life', '24', 'hours', 3),
  ('product-bose-qc45', 'weight', '240', 'g', 4),
  ('product-bose-qc45', 'codec', 'AAC, SBC', null, 5),
  ('product-bose-qc45', 'multipoint', 'Yes', null, 6);

-- AirPods Max specs
insert into product_specs (product_id, spec_key, spec_value, unit, display_order) values
  ('product-airpods-max', 'driver', '40', 'mm', 1),
  ('product-airpods-max', 'anc', 'Excellent', null, 2),
  ('product-airpods-max', 'battery_life', '20', 'hours', 3),
  ('product-airpods-max', 'weight', '384', 'g', 4),
  ('product-airpods-max', 'codec', 'AAC, ALAC', null, 5),
  ('product-airpods-max', 'multipoint', 'No', null, 6);

-- Sony WH-1000XM4 specs
insert into product_specs (product_id, spec_key, spec_value, unit, display_order) values
  ('product-sony-wh1000xm4', 'driver', '40', 'mm', 1),
  ('product-sony-wh1000xm4', 'anc', 'Excellent', null, 2),
  ('product-sony-wh1000xm4', 'battery_life', '30', 'hours', 3),
  ('product-sony-wh1000xm4', 'weight', '254', 'g', 4),
  ('product-sony-wh1000xm4', 'codec', 'LDAC, AAC, SBC', null, 5),
  ('product-sony-wh1000xm4', 'multipoint', 'No', null, 6);

-- ============================================================
-- Product Retailers (prices in paise/cents)
-- ============================================================

-- MacBook Air M2 retailers
insert into product_retailers (product_id, retailer_id, url, price_cents, currency, availability, affiliate_url, last_checked) values
  ('product-macbook-air-m2', 'retailer-apple', 'https://apple.com/in/shop/buy-mac/macbook-air', 9990000, 'INR', 'in_stock', null, now()),
  ('product-macbook-air-m2', 'retailer-amazon-india', 'https://amazon.in/dp/B0B3CJZL6H', 9490000, 'INR', 'in_stock', null, now()),
  ('product-macbook-air-m2', 'retailer-flipkart', 'https://flipkart.com/apple-macbook-air-m2/p/itm...', 9290000, 'INR', 'in_stock', null, now()),
  ('product-macbook-air-m2', 'retailer-croma', 'https://croma.com/apple-macbook-air-m2', 9790000, 'INR', 'in_stock', null, now());

-- MacBook Air M3 retailers
insert into product_retailers (product_id, retailer_id, url, price_cents, currency, availability, affiliate_url, last_checked) values
  ('product-macbook-air-m3', 'retailer-apple', 'https://apple.com/in/shop/buy-mac/macbook-air-m3', 11490000, 'INR', 'in_stock', null, now()),
  ('product-macbook-air-m3', 'retailer-amazon-india', 'https://amazon.in/dp/B0CX23V2ZK', 10990000, 'INR', 'in_stock', null, now()),
  ('product-macbook-air-m3', 'retailer-flipkart', 'https://flipkart.com/apple-macbook-air-m3/p/itm...', 10790000, 'INR', 'in_stock', null, now());

-- Dell XPS 13 retailers
insert into product_retailers (product_id, retailer_id, url, price_cents, currency, availability, affiliate_url, last_checked) values
  ('product-dell-xps-13', 'retailer-dell', 'https://dell.com/en-in/shop/laptops/xps-13', 11490000, 'INR', 'in_stock', null, now()),
  ('product-dell-xps-13', 'retailer-amazon-india', 'https://amazon.in/dp/B0BN...', 10890000, 'INR', 'in_stock', null, now());

-- ThinkPad X1 Carbon retailers
insert into product_retailers (product_id, retailer_id, url, price_cents, currency, availability, affiliate_url, last_checked) values
  ('product-thinkpad-x1-carbon', 'retailer-amazon-india', 'https://amazon.in/dp/B0C...', 14990000, 'INR', 'in_stock', null, now()),
  ('product-thinkpad-x1-carbon', 'retailer-flipkart', 'https://flipkart.com/lenovo-thinkpad-x1-carbon/p/itm...', 14490000, 'INR', 'in_stock', null, now());

-- ASUS Zenbook 14 retailers
insert into product_retailers (product_id, retailer_id, url, price_cents, currency, availability, affiliate_url, last_checked) values
  ('product-asus-zenbook-14', 'retailer-amazon-india', 'https://amazon.in/dp/B0CX...', 9999000, 'INR', 'in_stock', null, now()),
  ('product-asus-zenbook-14', 'retailer-flipkart', 'https://flipkart.com/asus-zenbook-14/p/itm...', 9799000, 'INR', 'in_stock', null, now());

-- HP Spectre x360 retailers
insert into product_retailers (product_id, retailer_id, url, price_cents, currency, availability, affiliate_url, last_checked) values
  ('product-hp-spectre-x360', 'retailer-amazon-india', 'https://amazon.in/dp/B0C...', 13990000, 'INR', 'in_stock', null, now()),
  ('product-hp-spectre-x360', 'retailer-flipkart', 'https://flipkart.com/hp-spectre-x360/p/itm...', 13490000, 'INR', 'in_stock', null, now());

-- iPhone 15 retailers
insert into product_retailers (product_id, retailer_id, url, price_cents, currency, availability, affiliate_url, last_checked) values
  ('product-iphone-15', 'retailer-apple', 'https://apple.com/in/shop/buy-iphone/iphone-15', 7990000, 'INR', 'in_stock', null, now()),
  ('product-iphone-15', 'retailer-amazon-india', 'https://amazon.in/dp/B0CHX3QBCH', 7490000, 'INR', 'in_stock', null, now()),
  ('product-iphone-15', 'retailer-flipkart', 'https://flipkart.com/apple-iphone-15/p/itm...', 7390000, 'INR', 'in_stock', null, now());

-- iPhone 15 Pro retailers
insert into product_retailers (product_id, retailer_id, url, price_cents, currency, availability, affiliate_url, last_checked) values
  ('product-iphone-15-pro', 'retailer-apple', 'https://apple.com/in/shop/buy-iphone/iphone-15-pro', 13490000, 'INR', 'in_stock', null, now()),
  ('product-iphone-15-pro', 'retailer-amazon-india', 'https://amazon.in/dp/B0CHW...', 12990000, 'INR', 'in_stock', null, now()),
  ('product-iphone-15-pro', 'retailer-flipkart', 'https://flipkart.com/apple-iphone-15-pro/p/itm...', 12790000, 'INR', 'in_stock', null, now());

-- Galaxy S24 retailers
insert into product_retailers (product_id, retailer_id, url, price_cents, currency, availability, affiliate_url, last_checked) values
  ('product-galaxy-s24', 'retailer-samsung', 'https://samsung.com/in/smartphones/galaxy-s24/', 7499000, 'INR', 'in_stock', null, now()),
  ('product-galaxy-s24', 'retailer-amazon-india', 'https://amazon.in/dp/B0CMD...', 6999000, 'INR', 'in_stock', null, now()),
  ('product-galaxy-s24', 'retailer-flipkart', 'https://flipkart.com/samsung-galaxy-s24/p/itm...', 6899000, 'INR', 'in_stock', null, now());

-- Galaxy S24 Ultra retailers
insert into product_retailers (product_id, retailer_id, url, price_cents, currency, availability, affiliate_url, last_checked) values
  ('product-galaxy-s24-ultra', 'retailer-samsung', 'https://samsung.com/in/smartphones/galaxy-s24-ultra/', 12999000, 'INR', 'in_stock', null, now()),
  ('product-galaxy-s24-ultra', 'retailer-amazon-india', 'https://amazon.in/dp/B0CMD...', 12499000, 'INR', 'in_stock', null, now()),
  ('product-galaxy-s24-ultra', 'retailer-flipkart', 'https://flipkart.com/samsung-galaxy-s24-ultra/p/itm...', 12299000, 'INR', 'in_stock', null, now());

-- Pixel 8 retailers
insert into product_retailers (product_id, retailer_id, url, price_cents, currency, availability, affiliate_url, last_checked) values
  ('product-pixel-8', 'retailer-amazon-india', 'https://amazon.in/dp/B0CJ...', 5999000, 'INR', 'in_stock', null, now()),
  ('product-pixel-8', 'retailer-flipkart', 'https://flipkart.com/google-pixel-8/p/itm...', 5799000, 'INR', 'in_stock', null, now());

-- OnePlus 12 retailers
insert into product_retailers (product_id, retailer_id, url, price_cents, currency, availability, affiliate_url, last_checked) values
  ('product-oneplus-12', 'retailer-amazon-india', 'https://amazon.in/dp/B0C...', 6499900, 'INR', 'in_stock', null, now()),
  ('product-oneplus-12', 'retailer-flipkart', 'https://flipkart.com/oneplus-12/p/itm...', 6299900, 'INR', 'in_stock', null, now());

-- Sony WH-1000XM5 retailers
insert into product_retailers (product_id, retailer_id, url, price_cents, currency, availability, affiliate_url, last_checked) values
  ('product-sony-wh1000xm5', 'retailer-amazon-india', 'https://amazon.in/dp/B09X...', 2699000, 'INR', 'in_stock', null, now()),
  ('product-sony-wh1000xm5', 'retailer-flipkart', 'https://flipkart.com/sony-wh-1000xm5/p/itm...', 2599000, 'INR', 'in_stock', null, now()),
  ('product-sony-wh1000xm5', 'retailer-croma', 'https://croma.com/sony-wh-1000xm5', 2799000, 'INR', 'in_stock', null, now());

-- Bose QC45 retailers
insert into product_retailers (product_id, retailer_id, url, price_cents, currency, availability, affiliate_url, last_checked) values
  ('product-bose-qc45', 'retailer-amazon-india', 'https://amazon.in/dp/B09C...', 2299000, 'INR', 'in_stock', null, now()),
  ('product-bose-qc45', 'retailer-flipkart', 'https://flipkart.com/bose-qc45/p/itm...', 2199000, 'INR', 'in_stock', null, now());

-- AirPods Max retailers
insert into product_retailers (product_id, retailer_id, url, price_cents, currency, availability, affiliate_url, last_checked) values
  ('product-airpods-max', 'retailer-apple', 'https://apple.com/in/shop/buy-airpods/airpods-max', 5990000, 'INR', 'in_stock', null, now()),
  ('product-airpods-max', 'retailer-amazon-india', 'https://amazon.in/dp/B08...', 5490000, 'INR', 'in_stock', null, now());

-- Sony WH-1000XM4 retailers
insert into product_retailers (product_id, retailer_id, url, price_cents, currency, availability, affiliate_url, last_checked) values
  ('product-sony-wh1000xm4', 'retailer-amazon-india', 'https://amazon.in/dp/B08...', 1999000, 'INR', 'in_stock', null, now()),
  ('product-sony-wh1000xm4', 'retailer-flipkart', 'https://flipkart.com/sony-wh-1000xm4/p/itm...', 1899000, 'INR', 'in_stock', null, now());

-- ============================================================
-- Buying Guides
-- ============================================================

insert into buying_guides (id, title, slug, excerpt, content, category_slug, status, author_name, published_at) values
  ('guide-laptops-programming', 'Best Laptops for Programming in 2024', 'best-laptops-programming-2024', 'Our curated list of the best laptops for developers and programmers.', '## Why These Laptops?\n\nWe evaluated each laptop based on CPU performance, RAM, keyboard quality, display, battery life, and value for developers.', 'laptop', 'published', 'Editorial Team', now()),
  ('guide-smartphones-under-30k', 'Best Smartphones Under ₹30,000', 'best-smartphones-under-30000', 'Top picks for the best smartphones under 30k budget.', '## Budget Smartphones That Deliver\n\nFinding a great smartphone under ₹30,000 is easier than ever. Here are our top picks.', 'smartphone', 'published', 'Editorial Team', now()),
  ('guide-headphones-travel', 'Best Headphones for Travel', 'best-headphones-travel', 'Noise-cancelling and comfortable headphones for travelers.', '## Travel-Ready Audio\n\nLong flights and noisy environments demand good noise cancellation and comfort.', 'headphones', 'published', 'Editorial Team', now())
on conflict (id) do nothing;

-- Buying Guide Recommendations
insert into buying_guide_recommendations (guide_id, product_id, label, reason, pros, cons, display_order) values
  ('guide-laptops-programming', 'product-macbook-air-m3', 'Best Overall', 'Excellent performance, battery life, and portability for developers.', ARRAY['Outstanding battery life', 'Silent operation', 'Great display'], ARRAY['Limited ports', 'No upgradeability'], 1),
  ('guide-laptops-programming', 'product-thinkpad-x1-carbon', 'Best for Business', 'Legendary keyboard and enterprise features.', ARRAY['Best-in-class keyboard', 'MIL-STD durability', 'Great port selection'], ARRAY['Expensive', 'Average display'], 2),
  ('guide-laptops-programming', 'product-asus-zenbook-14', 'Best Value', 'Excellent specs at a competitive price.', ARRAY['OLED display option', 'Good performance', 'Competitive price'], ARRAY['Average battery', 'Fan noise under load'], 3),
  ('guide-smartphones-under-30k', 'product-pixel-8', 'Best Camera', 'Best-in-class camera with pure Android experience.', ARRAY['Excellent camera', '7 years of updates', 'Clean software'], ARRAY['Average battery', 'No expandable storage'], 1),
  ('guide-smartphones-under-30k', 'product-galaxy-s24', 'Best Display', 'Vibrant display with AI features.', ARRAY['Bright display', 'Good performance', 'AI features'], ARRAY['Average camera', 'One UI bloat'], 2),
  ('guide-smartphones-under-30k', 'product-oneplus-12', 'Best Performance', 'Flagship performance at a competitive price.', ARRAY['Fast charging', 'Good performance', 'Competitive price'], ARRAY['Average camera', 'No wireless charging'], 3),
  ('guide-headphones-travel', 'product-sony-wh1000xm5', 'Best Overall', 'Industry-leading noise cancellation and comfort.', ARRAY['Best ANC', 'Excellent sound', '30-hour battery'], ARRAY['Expensive', 'No folding'], 1),
  ('guide-headphones-travel', 'product-bose-qc45', 'Best Comfort', 'Legendary Bose comfort for long flights.', ARRAY['Very comfortable', 'Good ANC', '24-hour battery'], ARRAY['Average sound', 'No LDAC'], 2),
  ('guide-headphones-travel', 'product-sony-wh1000xm4', 'Best Value', 'Previous gen with excellent features at a lower price.', ARRAY['Great ANC', '30-hour battery', 'Good sound'], ARRAY['Older model', 'No multipoint'], 3)
on conflict do nothing;
