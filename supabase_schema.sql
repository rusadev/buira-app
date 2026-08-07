-- ==============================================================================
-- BUIRA APP - SUPABASE DATABASE SCHEMA MIGRATION & SEED DATA
-- Project: https://muxjnzfyrorvxgmbtdvx.supabase.co
-- Execute this SQL in Supabase SQL Editor
-- ==============================================================================

-- 1. TENANTS / BUSINESS ENTITIES
CREATE TABLE IF NOT EXISTS public.tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    logo TEXT,
    primary_color TEXT,
    accent_color TEXT,
    address TEXT,
    phone TEXT,
    tax_rate NUMERIC(4,2) DEFAULT 0.10,
    service_rate NUMERIC(4,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS & MERCHANTS
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Owner', 'Manager', 'Kasir')),
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon_name TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS & VARIANTS
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    sku TEXT UNIQUE NOT NULL,
    barcode TEXT,
    cost_price NUMERIC(12,2) DEFAULT 0,
    price NUMERIC(12,2) NOT NULL,
    stock INT DEFAULT 0,
    min_stock_alert INT DEFAULT 10,
    image TEXT,
    description TEXT,
    variant_groups JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
    customer_name TEXT DEFAULT 'Pelanggan Umum',
    order_type TEXT NOT NULL CHECK (order_type IN ('Dine-In', 'Takeaway', 'Online-Gofood', 'Online-Grabfood', 'Online-Shopee')),
    table_number TEXT,
    subtotal NUMERIC(12,2) NOT NULL,
    discount_amount NUMERIC(12,2) DEFAULT 0,
    discount_percentage NUMERIC(5,2) DEFAULT 0,
    tax_amount NUMERIC(12,2) DEFAULT 0,
    service_amount NUMERIC(12,2) DEFAULT 0,
    grand_total NUMERIC(12,2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('Cash', 'QRIS', 'Debit', 'Credit', 'E-Wallet')),
    payment_amount NUMERIC(12,2) NOT NULL,
    change_amount NUMERIC(12,2) DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Preparing', 'Ready', 'Served', 'Completed', 'Cancelled')),
    cashier_name TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INT NOT NULL DEFAULT 1,
    selected_variants JSONB DEFAULT '[]'::jsonb,
    unit_price NUMERIC(12,2) NOT NULL,
    total_price NUMERIC(12,2) NOT NULL,
    notes TEXT
);

-- 7. TABLES (MANAJEMEN MEJA)
CREATE TABLE IF NOT EXISTS public.tables (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
    table_number TEXT NOT NULL,
    capacity INT DEFAULT 4,
    status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Occupied', 'Reserved')),
    current_order_id TEXT,
    customer_name TEXT
);

-- 8. INVENTORY / STOK BAHAN BAKU
CREATE TABLE IF NOT EXISTS public.inventory (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    stock NUMERIC(10,2) DEFAULT 0,
    unit TEXT NOT NULL,
    min_stock NUMERIC(10,2) DEFAULT 5,
    cost_per_unit NUMERIC(12,2) DEFAULT 0,
    last_restocked DATE DEFAULT CURRENT_DATE
);

-- 9. STOCK MOVEMENTS
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
    inventory_item_id TEXT REFERENCES public.inventory(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('IN', 'OUT')),
    quantity NUMERIC(10,2) NOT NULL,
    reason TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SHIFTS KASIR
CREATE TABLE IF NOT EXISTS public.shifts (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
    cashier_name TEXT NOT NULL,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    starting_cash NUMERIC(12,2) NOT NULL,
    expected_ending_cash NUMERIC(12,2),
    actual_ending_cash NUMERIC(12,2),
    cash_difference NUMERIC(12,2),
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED')),
    total_transactions_count INT DEFAULT 0,
    total_cash_sales NUMERIC(12,2) DEFAULT 0,
    total_qris_sales NUMERIC(12,2) DEFAULT 0,
    total_card_sales NUMERIC(12,2) DEFAULT 0
);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Seed Tenants
INSERT INTO public.tenants (id, name, tagline, logo, primary_color, accent_color, address, phone, tax_rate, service_rate)
VALUES 
  ('coffee_shop', 'Kopi Senja Utama', 'Artisan Coffee & Fresh Bakery', '☕', 'from-amber-700 to-amber-900', 'amber-500', 'Jl. Senopati No. 88, Jakarta Selatan', '0812-3456-7890', 0.10, 0.05),
  ('ayam_geprek', 'Geprek Mercon Pedas', 'Kuliner Ayam Geprek Pedas Mantap', '🍗', 'from-rose-600 to-red-900', 'rose-500', 'Jl. Margonda Raya No. 123, Depok', '0857-9876-5432', 0.10, 0.00)
ON CONFLICT (id) DO NOTHING;

-- Seed Users
INSERT INTO public.users (id, name, email, role, tenant_id, avatar)
VALUES
  ('user_cs_1', 'Budi Barista', 'barista@kopisenja.id', 'Owner', 'coffee_shop', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
  ('user_ag_1', 'Siti Kasir', 'kasir@geprekmercon.id', 'Manager', 'ayam_geprek', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- Seed Categories
INSERT INTO public.categories (id, tenant_id, name, icon_name, color)
VALUES
  ('cat_espresso', 'coffee_shop', 'Espresso Based', 'Coffee', 'bg-amber-600'),
  ('cat_manual_brew', 'coffee_shop', 'Manual Brew', 'Flame', 'bg-amber-800'),
  ('cat_non_coffee', 'coffee_shop', 'Non-Coffee', 'CupSoda', 'bg-emerald-600'),
  ('cat_pastry', 'coffee_shop', 'Pastry & Cake', 'Cake', 'bg-amber-500'),
  ('cat_geprek_paket', 'ayam_geprek', 'Paket Geprek', 'Drumstick', 'bg-rose-600'),
  ('cat_geprek_ala_carte', 'ayam_geprek', 'Ayam Ala Carte', 'Utensils', 'bg-red-600'),
  ('cat_side_dish', 'ayam_geprek', 'Side Dish / Pendamping', 'Egg', 'bg-amber-600'),
  ('cat_minuman_resto', 'ayam_geprek', 'Minuman Segar', 'GlassWater', 'bg-cyan-600')
ON CONFLICT (id) DO NOTHING;
