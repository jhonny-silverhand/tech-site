-- Wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);

-- RLS policies
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Users can read their own wishlists
CREATE POLICY "Users can view own wishlists" ON wishlists
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert into their own wishlists
CREATE POLICY "Users can add to own wishlists" ON wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete from their own wishlists
CREATE POLICY "Users can remove from own wishlists" ON wishlists
  FOR DELETE USING (auth.uid() = user_id);
