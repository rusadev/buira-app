-- ====================================================================
-- MASTER POS F&B MULTI-TENANT DATABASE SCHEMA & MIGRATION SCRIPT
-- Application: Buira & Gongja POS SaaS (F&B Vertical)
-- ====================================================================

-- 1. TENANTS TABLE (Business Entities)
CREATE TABLE IF NOT EXISTS tenants (
  id VARCHAR(50) PRIMARY KEY,
  business_type VARCHAR(50) NOT NULL DEFAULT 'F&B',
  name VARCHAR(150) NOT NULL,
  tagline VARCHAR(255),
  logo TEXT,
  primary_color VARCHAR(50),
  accent_color VARCHAR(50),
  address TEXT,
  phone VARCHAR(50),
  tax_rate NUMERIC(5, 4) DEFAULT 0.10,
  service_rate NUMERIC(5, 4) DEFAULT 0.05,
  owner_id VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS TABLE (User Accounts & Staff)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  username VARCHAR(100),
  password TEXT NOT NULL,
  pin_code VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'Kasir',
  custom_role_id VARCHAR(50),
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CUSTOM ROLES & PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS custom_roles (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT FALSE,
  permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCTS TABLE (Products & Variants)
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE CASCADE,
  category_id VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(150) NOT NULL,
  sku VARCHAR(50),
  barcode VARCHAR(50),
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  cost_price NUMERIC(12, 2) DEFAULT 0,
  stock INT DEFAULT 0,
  min_stock_alert INT DEFAULT 10,
  image TEXT,
  description TEXT,
  promo_tag VARCHAR(50),
  is_promo_active BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_recommended BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  variant_groups JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLES TABLE (Restaurant Table Management)
CREATE TABLE IF NOT EXISTS tables (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE CASCADE,
  number VARCHAR(20) NOT NULL,
  area VARCHAR(50) NOT NULL DEFAULT 'Indoor Utama',
  capacity INT DEFAULT 4,
  status VARCHAR(20) DEFAULT 'AVAILABLE',
  current_order_id VARCHAR(50),
  customer_name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDERS TABLE (Transactions & Sales)
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE CASCADE,
  order_type VARCHAR(20) NOT NULL DEFAULT 'Dine-In',
  table_number VARCHAR(20),
  customer_name VARCHAR(100),
  cashier_name VARCHAR(100),
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12, 2) DEFAULT 0,
  tax_amount NUMERIC(12, 2) DEFAULT 0,
  service_amount NUMERIC(12, 2) DEFAULT 0,
  grand_total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_method VARCHAR(50) DEFAULT 'Cash',
  payment_status VARCHAR(20) DEFAULT 'PAID',
  order_status VARCHAR(20) DEFAULT 'COMPLETED',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  void_reason TEXT,
  voided_by VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INVENTORY ITEMS TABLE (Raw Ingredients / Stock)
CREATE TABLE IF NOT EXISTS inventory_items (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  sku VARCHAR(50),
  unit VARCHAR(20) DEFAULT 'pcs',
  current_stock NUMERIC(10, 2) DEFAULT 0,
  min_stock_alert NUMERIC(10, 2) DEFAULT 10,
  cost_per_unit NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. STOCK MOVEMENTS TABLE
CREATE TABLE IF NOT EXISTS stock_movements (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE CASCADE,
  item_id VARCHAR(50) REFERENCES inventory_items(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  reason TEXT,
  created_by VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SHIFTS TABLE (Cashier Shift Reconciliation)
CREATE TABLE IF NOT EXISTS shifts (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE CASCADE,
  cashier_name VARCHAR(100) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  starting_cash NUMERIC(12, 2) NOT NULL DEFAULT 0,
  ending_cash NUMERIC(12, 2) DEFAULT 0,
  actual_ending_cash NUMERIC(12, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CUSTOMER MEMBERS TABLE
CREATE TABLE IF NOT EXISTS customer_members (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(150),
  tier VARCHAR(20) DEFAULT 'Silver',
  points INT DEFAULT 0,
  total_spent NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PROMO CODES TABLE
CREATE TABLE IF NOT EXISTS promo_codes (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  discount_type VARCHAR(20) DEFAULT 'PERCENTAGE',
  value NUMERIC(12, 2) NOT NULL DEFAULT 0,
  min_spend NUMERIC(12, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE & MULTI-TENANT ISOLATION
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_categories_tenant ON categories(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_tenant ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_tables_tenant ON tables(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant ON orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_tenant ON inventory_items(tenant_id);
CREATE INDEX IF NOT EXISTS idx_shifts_tenant ON shifts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customer_members_tenant ON customer_members(tenant_id);
