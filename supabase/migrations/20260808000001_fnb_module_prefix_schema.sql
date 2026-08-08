-- ====================================================================
-- F&B MODULE PREFIXED MULTI-TENANT DATABASE SCHEMA (`fnb_` PREFIX)
-- Application: Buira & Gongja POS SaaS (F&B Vertical Scalability)
-- ====================================================================

-- 1. F&B TENANTS TABLE
CREATE TABLE IF NOT EXISTS fnb_tenants (
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

-- 2. F&B USERS TABLE
CREATE TABLE IF NOT EXISTS fnb_users (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES fnb_tenants(id) ON DELETE CASCADE,
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

-- 3. F&B CUSTOM ROLES TABLE
CREATE TABLE IF NOT EXISTS fnb_custom_roles (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES fnb_tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT FALSE,
  permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. F&B CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS fnb_categories (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES fnb_tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. F&B PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS fnb_products (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES fnb_tenants(id) ON DELETE CASCADE,
  category_id VARCHAR(50) REFERENCES fnb_categories(id) ON DELETE SET NULL,
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

-- 6. F&B TABLES TABLE (Dine-In Management)
CREATE TABLE IF NOT EXISTS fnb_tables (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES fnb_tenants(id) ON DELETE CASCADE,
  number VARCHAR(20) NOT NULL,
  area VARCHAR(50) NOT NULL DEFAULT 'Indoor Utama',
  capacity INT DEFAULT 4,
  status VARCHAR(20) DEFAULT 'AVAILABLE',
  current_order_id VARCHAR(50),
  customer_name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. F&B ORDERS TABLE (Transactions)
CREATE TABLE IF NOT EXISTS fnb_orders (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES fnb_tenants(id) ON DELETE CASCADE,
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

-- 8. F&B INVENTORY ITEMS TABLE
CREATE TABLE IF NOT EXISTS fnb_inventory_items (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES fnb_tenants(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  sku VARCHAR(50),
  unit VARCHAR(20) DEFAULT 'pcs',
  current_stock NUMERIC(10, 2) DEFAULT 0,
  min_stock_alert NUMERIC(10, 2) DEFAULT 10,
  cost_per_unit NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. F&B STOCK MOVEMENTS TABLE
CREATE TABLE IF NOT EXISTS fnb_stock_movements (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES fnb_tenants(id) ON DELETE CASCADE,
  item_id VARCHAR(50) REFERENCES fnb_inventory_items(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  reason TEXT,
  created_by VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. F&B SHIFTS TABLE
CREATE TABLE IF NOT EXISTS fnb_shifts (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES fnb_tenants(id) ON DELETE CASCADE,
  cashier_name VARCHAR(100) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  starting_cash NUMERIC(12, 2) NOT NULL DEFAULT 0,
  ending_cash NUMERIC(12, 2) DEFAULT 0,
  actual_ending_cash NUMERIC(12, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. F&B CUSTOMER MEMBERS TABLE
CREATE TABLE IF NOT EXISTS fnb_customer_members (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES fnb_tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(150),
  tier VARCHAR(20) DEFAULT 'Silver',
  points INT DEFAULT 0,
  total_spent NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. F&B PROMO CODES TABLE
CREATE TABLE IF NOT EXISTS fnb_promo_codes (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES fnb_tenants(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  discount_type VARCHAR(20) DEFAULT 'PERCENTAGE',
  value NUMERIC(12, 2) NOT NULL DEFAULT 0,
  min_spend NUMERIC(12, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- F&B ISOLATED PERFORMANCE INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_fnb_users_tenant ON fnb_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fnb_categories_tenant ON fnb_categories(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fnb_products_tenant ON fnb_products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fnb_products_category ON fnb_products(category_id);
CREATE INDEX IF NOT EXISTS idx_fnb_tables_tenant ON fnb_tables(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fnb_orders_tenant ON fnb_orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fnb_orders_created ON fnb_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fnb_inventory_tenant ON fnb_inventory_items(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fnb_shifts_tenant ON fnb_shifts(tenant_id);
