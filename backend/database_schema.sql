-- ============================================
-- SCRAP COLLECTOR — DATABASE SCHEMA
-- Run this in your PostgreSQL (scrap_collector DB)
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================
-- 1. USERS (Auth)
-- =====================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 2. PROFILES
-- =====================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'collector', 'admin')),
  wallet_balance DECIMAL(10,2) DEFAULT 0.00,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user_id lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- =====================
-- 3. PICKUPS
-- =====================
CREATE TABLE IF NOT EXISTS pickups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_no SERIAL,
  user_id UUID NOT NULL REFERENCES users(id),
  items JSONB,
  total_qty INTEGER DEFAULT 0,
  total_weight DECIMAL(10,2) DEFAULT 0.00,
  alternate_number VARCHAR(20),
  time_slot VARCHAR(50),
  city VARCHAR(100) DEFAULT 'Hyderabad',
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  amount DECIMAL(10,2) DEFAULT 0.00,
  collector_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_pickups_user_id ON pickups(user_id);
CREATE INDEX IF NOT EXISTS idx_pickups_status ON pickups(status);
CREATE INDEX IF NOT EXISTS idx_pickups_created_at ON pickups(created_at);
CREATE INDEX IF NOT EXISTS idx_pickups_collector_id ON pickups(collector_id);

-- =====================
-- 4. SCRAP REQUESTS
-- =====================
CREATE TABLE IF NOT EXISTS scrap_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  items JSONB,
  total_weight DECIMAL(10,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scrap_requests_user_id ON scrap_requests(user_id);

-- =====================
-- 5. SCRAP CATEGORIES
-- =====================
CREATE TABLE IF NOT EXISTS scrap_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  icon_name VARCHAR(50) NOT NULL,
  icon_bg VARCHAR(20) NOT NULL,
  card_bg VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 6. SCRAP ITEMS
-- =====================
CREATE TABLE IF NOT EXISTS scrap_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES scrap_categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  measurement_type VARCHAR(20) NOT NULL CHECK (measurement_type IN ('weight', 'quantity')),
  base_price DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, name)
);

CREATE INDEX IF NOT EXISTS idx_scrap_items_category_id ON scrap_items(category_id);

-- =====================
-- 7. TIME SLOTS
-- =====================
CREATE TABLE IF NOT EXISTS time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_text VARCHAR(100) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 8. USER ADDRESSES
-- =====================
CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) DEFAULT 'Home', -- Home, Office, Other
  house_no VARCHAR(100),
  area VARCHAR(100),
  pincode VARCHAR(10),
  landmark TEXT,
  address TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user_id lookups
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);

-- =====================
-- DONE ✅
-- =====================
-- After running this, start the backend:
--   cd backend
--   npm run dev
