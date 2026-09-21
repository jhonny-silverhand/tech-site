-- Flipkart scraped products + PC Components tables
-- Run this to add real product data support

-- Real Flipkart products (scraped every 10 minutes)
CREATE TABLE IF NOT EXISTS scraped_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flipkart_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT NOT NULL,
  search_query TEXT,
  price_inr INTEGER, -- in paise (e.g., 99900 = ₹999)
  mrp_inr INTEGER,
  discount_percent INTEGER,
  rating DECIMAL(2,1),
  review_count INTEGER,
  image_url TEXT,
  product_url TEXT NOT NULL,
  is_flipkart_assured BOOLEAN DEFAULT false,
  seller_name TEXT,
  highlights TEXT[], -- array of key features
  specifications JSONB, -- full spec sheet
  last_scraped_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast search
CREATE INDEX IF NOT EXISTS idx_scraped_products_category ON scraped_products(category);
CREATE INDEX IF NOT EXISTS idx_scraped_products_price ON scraped_products(price_inr);
CREATE INDEX IF NOT EXISTS idx_scraped_products_brand ON scraped_products(brand);
CREATE INDEX IF NOT EXISTS idx_scraped_products_search ON scraped_products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_scraped_products_last_scraped ON scraped_products(last_scraped_at);

-- PC Components from iBlessi dataset (open source, CC BY 4.0)
CREATE TABLE IF NOT EXISTS pc_components (
  id TEXT PRIMARY KEY, -- e.g., "cpu-r7-9800x3d"
  category TEXT NOT NULL, -- cpu, gpu, motherboard, ram, storage, psu, case
  vendor TEXT NOT NULL,
  model TEXT NOT NULL,
  specs JSONB NOT NULL, -- category-specific specs (cores, tdp, vram, socket, etc.)
  performance_tier TEXT, -- entry, mid, high, flagship
  use_cases TEXT[],
  notes TEXT,
  source_url TEXT,
  last_verified DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for PC components
CREATE INDEX IF NOT EXISTS idx_pc_components_category ON pc_components(category);
CREATE INDEX IF NOT EXISTS idx_pc_components_tier ON pc_components(performance_tier);
CREATE INDEX IF NOT EXISTS idx_pc_components_vendor ON pc_components(vendor);

-- Compatibility rules (stored as JSON logic for flexibility)
CREATE TABLE IF NOT EXISTS compatibility_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_type TEXT NOT NULL, -- socket_match, chipset_support, ram_type, psu_headroom, case_clearance
  description TEXT NOT NULL,
  from_category TEXT NOT NULL, -- cpu, gpu, motherboard, ram, storage, psu, case
  to_category TEXT NOT NULL,
  rule JSONB NOT NULL, -- validation logic
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert compatibility rules
INSERT INTO compatibility_rules (rule_type, description, from_category, to_category, rule) VALUES
  ('socket_match', 'CPU and motherboard must share socket (AM5, LGA1851, LGA1700)', 'cpu', 'motherboard', '{"type": "field_match", "from": "specs.socket", "to": "specs.socket"}'),
  ('chipset_support', 'Motherboard chipset must be in CPU supported chipsets', 'cpu', 'motherboard', '{"type": "array_contains", "from": "specs.supported_chipsets", "to": "specs.chipset"}'),
  ('ram_type', 'RAM type must match motherboard RAM type (DDR4/DDR5)', 'motherboard', 'ram', '{"type": "field_match", "from": "specs.ram_type", "to": "specs.ram_type"}'),
  ('psu_headroom', 'PSU wattage must exceed CPU TDP + GPU TGP + 150W overhead with 20% margin', 'psu', 'cpu', '{"type": "psu_check", "psu_wattage": "specs.wattage", "cpu_tdp": "specs.tdp_w", "gpu_tgp": "specs.tgp_w", "overhead": 150, "margin": 0.2}'),
  ('case_form_factor', 'Case must accept motherboard form factor', 'motherboard', 'case', '{"type": "form_factor_check", "mb_form": "specs.form_factor", "case_form": "specs.form_factor"}'),
  ('case_gpu_length', 'Case max GPU length must exceed GPU length', 'gpu', 'case', '{"type": "length_check", "gpu_length": "specs.length_mm", "case_max": "specs.max_gpu_length_mm"}')
ON CONFLICT DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for scraped_products (drop if exists to avoid conflicts)
DROP TRIGGER IF EXISTS update_scraped_products_updated_at ON scraped_products;
CREATE TRIGGER update_scraped_products_updated_at
  BEFORE UPDATE ON scraped_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS policies (allow public read, authenticated write)
ALTER TABLE scraped_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pc_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_rules ENABLE ROW LEVEL SECURITY;

-- Public can read
DROP POLICY IF EXISTS "Public can read scraped products" ON scraped_products;
CREATE POLICY "Public can read scraped products" ON scraped_products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read pc components" ON pc_components;
CREATE POLICY "Public can read pc components" ON pc_components
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read compatibility rules" ON compatibility_rules;
CREATE POLICY "Public can read compatibility rules" ON compatibility_rules
  FOR SELECT USING (true);

-- Service role can write (for scraper)
DROP POLICY IF EXISTS "Service role can insert scraped products" ON scraped_products;
CREATE POLICY "Service role can insert scraped products" ON scraped_products
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can update scraped products" ON scraped_products;
CREATE POLICY "Service role can update scraped products" ON scraped_products
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Service role can insert pc components" ON pc_components;
CREATE POLICY "Service role can insert pc components" ON pc_components
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can update pc components" ON pc_components;
CREATE POLICY "Service role can update pc components" ON pc_components
  FOR UPDATE USING (true);
