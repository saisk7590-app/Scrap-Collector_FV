-- ============================================
-- SCRAP COLLECTOR — DATABASE SCHEMA (REFACTORED)
-- Integer IDs version
-- ============================================

-- 1. USERS
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ROLES
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL DEFAULT 1 REFERENCES roles(id),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  alternate_phone VARCHAR(20),
  profile_image_url TEXT,
  wallet_balance DECIMAL(10,2) DEFAULT 0.00,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role_id ON profiles(role_id);

-- 4. PICKUPS
CREATE TABLE pickups (
  id SERIAL PRIMARY KEY,
  pickup_no SERIAL,
  user_id INTEGER NOT NULL REFERENCES users(id),
  items JSONB,
  total_qty INTEGER DEFAULT 0,
  total_weight DECIMAL(10,2) DEFAULT 0.00,
  alternate_number VARCHAR(20),
  time_slot VARCHAR(50),
  city VARCHAR(100) DEFAULT 'Hyderabad',
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  amount DECIMAL(10,2) DEFAULT 0.00,
  collector_id INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SCRAP REQUESTS
CREATE TABLE scrap_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  items JSONB,
  total_weight DECIMAL(10,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SCRAP CATEGORIES
CREATE TABLE scrap_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  icon_name VARCHAR(50) NOT NULL,
  icon_bg VARCHAR(20) NOT NULL,
  card_bg VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SCRAP ITEMS
CREATE TABLE scrap_items (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES scrap_categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  measurement_type VARCHAR(20) NOT NULL CHECK (measurement_type IN ('weight', 'quantity')),
  base_price DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, name)
);

-- 8. TIME SLOTS
CREATE TABLE time_slots (
  id SERIAL PRIMARY KEY,
  slot_text VARCHAR(100) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. USER ADDRESSES
CREATE TABLE user_addresses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) DEFAULT 'Home',
  house_no VARCHAR(100),
  area VARCHAR(100),
  pincode VARCHAR(10),
  landmark TEXT,
  address TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10A. WALLET TRANSACTIONS
CREATE TABLE wallet_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('CREDIT', 'DEBIT')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO wallet_transactions (user_id, amount, type, description)
SELECT p.user_id, p.wallet_balance, 'CREDIT', 'Initial balance'
FROM profiles p
WHERE p.wallet_balance > 0
  AND NOT EXISTS (
    SELECT 1
    FROM wallet_transactions wt
    WHERE wt.user_id = p.user_id
  );

-- 10. CUSTOMERS
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  profile_id INT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_customer_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  CONSTRAINT fk_customer_profile
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE SET NULL
);

-- 11. COLLECTORS
CREATE TABLE collectors (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  profile_id INT,

  vehicle_number VARCHAR(50),
  license_number VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_collector_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  CONSTRAINT fk_collector_profile
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE SET NULL
);

--12. CORPORATES
CREATE TABLE corporates (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,

  company_name VARCHAR(150) NOT NULL,
  contact_person VARCHAR(100),
  contact_phone VARCHAR(20),
  company_email VARCHAR(150),

  address TEXT,
  gst_number VARCHAR(50),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_corporate_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

--13. GOVERNMENT SECTORS
CREATE TABLE government_sectors (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,

  department_name VARCHAR(150) NOT NULL,
  officer_name VARCHAR(100),
  contact_number VARCHAR(20),

  zone VARCHAR(100),
  address TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_government_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

--14. GATED COMMUNITIES
CREATE TABLE gated_communities (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,

  community_name VARCHAR(150) NOT NULL,
  manager_name VARCHAR(100),
  manager_phone VARCHAR(20),

  total_units INT,
  address TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_gated_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
