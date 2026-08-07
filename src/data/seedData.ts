import type { BusinessEntity, Category, Product, Table, InventoryItem, UserAccount, CustomRole } from '../types/pos';

export const INITIAL_CUSTOM_ROLES: CustomRole[] = [
  // COFFEE SHOP ROLES
  {
    id: 'role_cs_owner',
    entityId: 'coffee_shop',
    name: 'Owner F&B (Full Access)',
    description: 'Pemilik outlet dengan akses penuh ke seluruh fitur dan pengaturan.',
    isSystemRole: true,
    permissions: {
      canAccessPOS: true,
      canManageCatalog: true,
      canAccessKDS: true,
      canManageTables: true,
      canManageInventory: true,
      canManageStaff: true,
      canViewReports: true,
      canVoidOrders: true,
      canManageSettings: true
    }
  },
  {
    id: 'role_cs_manager',
    entityId: 'coffee_shop',
    name: 'Manager Cafe',
    description: 'Mengelola operasional harian, staf, stok bahan, dan laporan toko.',
    isSystemRole: true,
    permissions: {
      canAccessPOS: true,
      canManageCatalog: true,
      canAccessKDS: true,
      canManageTables: true,
      canManageInventory: true,
      canManageStaff: true,
      canViewReports: true,
      canVoidOrders: true,
      canManageSettings: false
    }
  },
  {
    id: 'role_cs_kasir',
    entityId: 'coffee_shop',
    name: 'Kasir Operasional POS',
    description: 'Petugas kasir untuk melayani pesanan, pembayaran, dan pencetakan struk.',
    isSystemRole: true,
    permissions: {
      canAccessPOS: true,
      canManageCatalog: false,
      canAccessKDS: false,
      canManageTables: true,
      canManageInventory: false,
      canManageStaff: false,
      canViewReports: false,
      canVoidOrders: false,
      canManageSettings: false
    }
  },

  // AYAM GEPREK ROLES
  {
    id: 'role_ag_owner',
    entityId: 'ayam_geprek',
    name: 'Owner Resto (Full Access)',
    description: 'Pemilik resto geprek dengan hak akses lengkap.',
    isSystemRole: true,
    permissions: {
      canAccessPOS: true,
      canManageCatalog: true,
      canAccessKDS: true,
      canManageTables: true,
      canManageInventory: true,
      canManageStaff: true,
      canViewReports: true,
      canVoidOrders: true,
      canManageSettings: true
    }
  },
  {
    id: 'role_ag_kasir',
    entityId: 'ayam_geprek',
    name: 'Kasir Resto',
    description: 'Melayani pembayaran transaksi kasir & pesanan meja.',
    isSystemRole: true,
    permissions: {
      canAccessPOS: true,
      canManageCatalog: false,
      canAccessKDS: false,
      canManageTables: true,
      canManageInventory: false,
      canManageStaff: false,
      canViewReports: false,
      canVoidOrders: false,
      canManageSettings: false
    }
  }
];

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'user_superadmin_1',
    name: 'Bu Ira (SuperAdmin SaaS)',
    email: 'superadmin@buira.id',
    password: '123',
    role: 'SuperAdmin',
    tenantId: 'coffee_shop',
    allowedTenantIds: ['coffee_shop', 'ayam_geprek', 'apotek_buira', 'properti_buira'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_cs_1',
    name: 'Budi (Barista / Owner)',
    email: 'barista@kopisenja.id',
    password: '123',
    role: 'Owner F&B (Full Access)',
    customRoleId: 'role_cs_owner',
    tenantId: 'coffee_shop',
    allowedTenantIds: ['coffee_shop', 'ayam_geprek'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_ag_1',
    name: 'Siti (Kasir Geprek)',
    email: 'kasir@geprekmercon.id',
    password: '123',
    role: 'Kasir Resto',
    customRoleId: 'role_ag_kasir',
    tenantId: 'ayam_geprek',
    allowedTenantIds: ['ayam_geprek'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_BUSINESS_ENTITIES: BusinessEntity[] = [
  {
    id: 'coffee_shop',
    ownerId: 'user_cs_1',
    businessType: 'F&B',
    name: 'Kopi Senja Utama',
    tagline: 'Artisan Coffee & Fresh Bakery',
    logo: 'K',
    primaryColor: 'from-red-600 to-red-800',
    accentColor: 'red-600',
    address: 'Jl. Senopati No. 88, Jakarta Selatan',
    phone: '0812-3456-7890',
    taxRate: 0.10,
    serviceRate: 0.05
  },
  {
    id: 'ayam_geprek',
    ownerId: 'user_cs_1',
    businessType: 'F&B',
    name: 'Geprek Mercon Pedas',
    tagline: 'Kuliner Ayam Geprek Pedas Mantap',
    logo: 'G',
    primaryColor: 'from-red-600 to-red-800',
    accentColor: 'red-600',
    address: 'Jl. Margonda Raya No. 123, Depok',
    phone: '0857-9876-5432',
    taxRate: 0.10,
    serviceRate: 0.00
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_espresso', entityId: 'coffee_shop', name: 'Espresso Based', iconName: 'Coffee', color: 'bg-red-600' },
  { id: 'cat_manual_brew', entityId: 'coffee_shop', name: 'Manual Brew', iconName: 'Flame', color: 'bg-red-700' },
  { id: 'cat_non_coffee', entityId: 'coffee_shop', name: 'Non-Coffee', iconName: 'CupSoda', color: 'bg-slate-700' },
  { id: 'cat_pastry', entityId: 'coffee_shop', name: 'Pastry & Cake', iconName: 'Cake', color: 'bg-red-600' },
  { id: 'cat_geprek_paket', entityId: 'ayam_geprek', name: 'Paket Geprek', iconName: 'Drumstick', color: 'bg-red-600' },
  { id: 'cat_geprek_ala_carte', entityId: 'ayam_geprek', name: 'Ayam Ala Carte', iconName: 'Utensils', color: 'bg-red-700' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_kopi_susu_aren',
    entityId: 'coffee_shop',
    name: 'Kopi Susu Gula Aren',
    categoryId: 'cat_espresso',
    sku: 'CS-ESP-001',
    barcode: '8991001001',
    costPrice: 8000,
    price: 22000,
    stock: 85,
    minStockAlert: 15,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60',
    description: 'Espresso house blend dipadu susu segar dan gula aren organik khas Senja.',
    isActive: true
  },
  {
    id: 'prod_paket_geprek_mercon',
    entityId: 'ayam_geprek',
    name: 'Paket Geprek Sambal Bawang Mercon',
    categoryId: 'cat_geprek_paket',
    sku: 'AG-PKT-001',
    barcode: '8992002001',
    costPrice: 11000,
    price: 24000,
    stock: 95,
    minStockAlert: 15,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60',
    description: 'Nasi hangat + Ayam Crispy Geprek Sambal Bawang Rawit Mercon + Lalapan Segar.',
    isActive: true
  }
];

export const INITIAL_TABLES: Table[] = [
  { id: 'tbl_cs_1', entityId: 'coffee_shop', tableNumber: 'Meja 01 (Indoor)', capacity: 2, status: 'Available' },
  { id: 'tbl_ag_1', entityId: 'ayam_geprek', tableNumber: 'Meja A1', capacity: 4, status: 'Available' }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv_cs_1', entityId: 'coffee_shop', name: 'Biji Kopi Espresso Blend (Arabica/Robusta)', category: 'Bahan Baku Utama', stock: 12.5, unit: 'Kg', minStock: 3.0, costPerUnit: 180000, lastRestocked: '2026-08-01' },
  { id: 'inv_ag_1', entityId: 'ayam_geprek', name: 'Daging Ayam Potong Segar', category: 'Bahan Utama', stock: 35, unit: 'Kg', minStock: 10, costPerUnit: 38000, lastRestocked: '2026-08-07' }
];
