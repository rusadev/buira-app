-- ==============================================================================
-- BUIRA ENTERPRISE SAAS - SCALABLE PREFIXED MODULE DATABASE SCHEMA
-- Project: Buira Multi-Business Platform (F&B, Apotek, Properti, SaaS Core)
-- Supabase URL: https://muxjnzfyrorvxgmbtdvx.supabase.co
-- ==============================================================================

-- ==============================================================================
-- 1. CORE MODULE (`core_*`) - Platform Multi-Tenant & Centralized User Auth
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.core_tenants (
    id TEXT PRIMARY KEY,
    business_type TEXT NOT NULL CHECK (business_type IN ('F&B', 'Apotek', 'Properti', 'Retail')),
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

CREATE TABLE IF NOT EXISTS public.core_users (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.core_tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('SuperAdmin', 'Owner', 'Manager', 'Kasir', 'Apoteker', 'Agent')),
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. FOOD & BEVERAGE MODULE (`fnb_*`) - Resto, Cafe, Coffee Shop, Geprek
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.fnb_categories (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.core_tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon_name TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.fnb_products (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.core_tenants(id) ON DELETE CASCADE,
    category_id TEXT REFERENCES public.fnb_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS public.fnb_tables (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.core_tenants(id) ON DELETE CASCADE,
    table_number TEXT NOT NULL,
    capacity INT DEFAULT 4,
    status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Occupied', 'Reserved')),
    current_order_id TEXT,
    customer_name TEXT
);

CREATE TABLE IF NOT EXISTS public.fnb_orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    tenant_id TEXT REFERENCES public.core_tenants(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS public.fnb_order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES public.fnb_orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.fnb_products(id) ON DELETE SET NULL,
    quantity INT NOT NULL DEFAULT 1,
    selected_variants JSONB DEFAULT '[]'::jsonb,
    unit_price NUMERIC(12,2) NOT NULL,
    total_price NUMERIC(12,2) NOT NULL,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS public.fnb_inventory (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.core_tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    stock NUMERIC(10,2) DEFAULT 0,
    unit TEXT NOT NULL,
    min_stock NUMERIC(10,2) DEFAULT 5,
    cost_per_unit NUMERIC(12,2) DEFAULT 0,
    last_restocked DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS public.fnb_stock_movements (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.core_tenants(id) ON DELETE CASCADE,
    inventory_item_id TEXT REFERENCES public.fnb_inventory(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('IN', 'OUT')),
    quantity NUMERIC(10,2) NOT NULL,
    reason TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.fnb_shifts (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.core_tenants(id) ON DELETE CASCADE,
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
-- 3. PHARMACY MODULE (`pharmacy_*`) - Apotek, Obat & Resep (Roadmap Scale)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.pharmacy_medicines (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.core_tenants(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    drug_class TEXT CHECK (drug_class IN ('Bebas', 'Bebas Terbatas', 'Obat Keras', 'Narkotika', 'Alkes')),
    unit TEXT NOT NULL, -- Tablet, Strip, Botol, Tube
    cost_price NUMERIC(12,2) DEFAULT 0,
    selling_price NUMERIC(12,2) NOT NULL,
    stock INT DEFAULT 0,
    min_stock INT DEFAULT 10,
    is_prescription_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pharmacy_batches (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.core_tenants(id) ON DELETE CASCADE,
    medicine_id TEXT REFERENCES public.pharmacy_medicines(id) ON DELETE CASCADE,
    batch_number TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. PROPERTY MODULE (`property_*`) - Real Estate, Ruko, Apartemen (Roadmap Scale)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.property_units (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.core_tenants(id) ON DELETE CASCADE,
    unit_code TEXT UNIQUE NOT NULL,
    unit_type TEXT CHECK (unit_type IN ('Rumah', 'Ruko', 'Kavling', 'Apartemen')),
    location_block TEXT NOT NULL,
    building_size NUMERIC(8,2), -- m2
    land_size NUMERIC(8,2),     -- m2
    price NUMERIC(15,2) NOT NULL,
    status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Booked', 'Sold', 'Rented')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.property_contracts (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.core_tenants(id) ON DELETE CASCADE,
    unit_id TEXT REFERENCES public.property_units(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    contract_type TEXT CHECK (contract_type IN ('KPR', 'Cicilan Bertahap', 'Sewa Tahunan')),
    total_amount NUMERIC(15,2) NOT NULL,
    down_payment NUMERIC(15,2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Terminated')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INITIAL SEED DATA FOR CORE & FNB MODULES
-- ==============================================================================

INSERT INTO public.core_tenants (id, business_type, name, tagline, logo, primary_color, accent_color, address, phone, tax_rate, service_rate)
VALUES 
  ('coffee_shop', 'F&B', 'Kopi Senja Utama', 'Artisan Coffee & Fresh Bakery', '☕', 'from-amber-700 to-amber-900', 'amber-500', 'Jl. Senopati No. 88, Jakarta Selatan', '0812-3456-7890', 0.10, 0.05),
  ('ayam_geprek', 'F&B', 'Geprek Mercon Pedas', 'Kuliner Ayam Geprek Pedas Mantap', '🍗', 'from-rose-600 to-red-900', 'rose-500', 'Jl. Margonda Raya No. 123, Depok', '0857-9876-5432', 0.10, 0.00),
  ('apotek_buira', 'Apotek', 'Apotek Sehat Bu Ira', 'Apotek & Mitra Kesehatan Keluarga', '💊', 'from-emerald-600 to-teal-900', 'emerald-500', 'Jl. Raya Pajajaran No. 45, Bogor', '0811-2233-4455', 0.00, 0.00),
  ('properti_buira', 'Properti', 'Bu Ira Residence & Commercial', 'Hunian Asri & Kawasan Komersial', '🏢', 'from-blue-700 to-indigo-900', 'blue-500', 'Jl. CBD Utama No. 1, Tangerang', '0813-9988-7766', 0.00, 0.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.core_users (id, tenant_id, name, email, role, avatar)
VALUES
  ('user_cs_1', 'coffee_shop', 'Budi Barista', 'barista@kopisenja.id', 'Owner', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
  ('user_ag_1', 'ayam_geprek', 'Siti Kasir', 'kasir@geprekmercon.id', 'Manager', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'),
  ('user_apt_1', 'apotek_buira', 'Apt. Rina S.Farm', 'apoteker@sehatbuira.id', 'Apoteker', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'),
  ('user_prp_1', 'properti_buira', 'Hendra Sales', 'sales@buiraresidence.id', 'Agent', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.fnb_categories (id, tenant_id, name, icon_name, color)
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
