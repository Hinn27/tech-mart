-- SQL Migration: Tạo bảng products cho TechElite
-- Chạy trong Supabase Dashboard > SQL Editor
-- Sau đó chạy: node scripts/seed-products.mjs

-- Xóa bảng cũ nếu tồn tại
DROP TABLE IF EXISTS products CASCADE;

-- Tạo bảng products với đầy đủ cột
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  discount INTEGER DEFAULT 0,
  image TEXT,
  images TEXT[],
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  sold_count INTEGER DEFAULT 0,
  badge TEXT,
  in_stock BOOLEAN DEFAULT true,
  description TEXT,
  specs JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index để tìm kiếm nhanh
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_price ON products(price);

--RLS (Row Level Security) - Cho phép đọc công khai
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  USING (auth.role() = 'authenticated');
