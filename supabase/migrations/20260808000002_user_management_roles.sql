-- Migration: 20260808000002_user_management_roles
-- Description: Advanced User Management & Role Hierarchy for SuperAdmin, Multi-Tenant Owners, and Staff

-- Add owner_id to core_tenants to support 1 Owner -> Many Tenants
ALTER TABLE public.core_tenants 
ADD COLUMN IF NOT EXISTS owner_id TEXT;

-- Create core_tenant_users table for fine-grained multi-outlet access control
CREATE TABLE IF NOT EXISTS public.core_tenant_users (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.core_users(id) ON DELETE CASCADE,
    tenant_id TEXT REFERENCES public.core_tenants(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('SuperAdmin', 'Owner', 'Manager', 'Kasir', 'Apoteker', 'Agent')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, tenant_id)
);

-- Seed SuperAdmin (Pengendali Penuh Platform SaaS Bu Ira)
INSERT INTO public.core_users (id, tenant_id, name, email, role, avatar)
VALUES
  ('user_superadmin_1', 'coffee_shop', 'Bu Ira (SuperAdmin)', 'superadmin@buira.id', 'SuperAdmin', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO UPDATE SET role = 'SuperAdmin';

-- Link Tenants to Owners (Example: Owner Budi owns Coffee Shop & Ayam Geprek)
UPDATE public.core_tenants SET owner_id = 'user_cs_1' WHERE id IN ('coffee_shop', 'ayam_geprek');
UPDATE public.core_tenants SET owner_id = 'user_apt_1' WHERE id = 'apotek_buira';
UPDATE public.core_tenants SET owner_id = 'user_prp_1' WHERE id = 'properti_buira';

-- Assign User Access Mapping
INSERT INTO public.core_tenant_users (id, user_id, tenant_id, role)
VALUES
  ('tu_sa_1', 'user_superadmin_1', 'coffee_shop', 'SuperAdmin'),
  ('tu_sa_2', 'user_superadmin_1', 'ayam_geprek', 'SuperAdmin'),
  ('tu_sa_3', 'user_superadmin_1', 'apotek_buira', 'SuperAdmin'),
  ('tu_sa_4', 'user_superadmin_1', 'properti_buira', 'SuperAdmin'),
  ('tu_owner_1', 'user_cs_1', 'coffee_shop', 'Owner'),
  ('tu_owner_2', 'user_cs_1', 'ayam_geprek', 'Owner'),
  ('tu_mgr_1', 'user_ag_1', 'ayam_geprek', 'Manager'),
  ('tu_apt_1', 'user_apt_1', 'apotek_buira', 'Apoteker'),
  ('tu_prp_1', 'user_prp_1', 'properti_buira', 'Agent')
ON CONFLICT (user_id, tenant_id) DO NOTHING;
