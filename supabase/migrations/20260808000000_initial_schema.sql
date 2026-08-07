-- Migration: 20260808000000_initial_schema
-- Description: Initial legacy table structure for Point of Sale

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

CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Owner', 'Manager', 'Kasir')),
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon_name TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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
    cashierName TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
