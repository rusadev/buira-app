import type { BusinessEntity, Category, Product, Table, InventoryItem, UserAccount, CustomRole } from '../types/pos';

export const INITIAL_CUSTOM_ROLES: CustomRole[] = [
  {
    id: 'role_gongja_owner',
    entityId: 'tenant_gongja',
    name: 'Owner (Pemilik Outlet)',
    description: 'Pemilik outlet dengan akses penuh ke seluruh fitur, laporan, dan pengaturan.',
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
    id: 'role_gongja_manager',
    entityId: 'tenant_gongja',
    name: 'Manager Outlet',
    description: 'Mengelola operasional harian toko, staf, stok bahan, dan laporan penjualan.',
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
    id: 'role_gongja_spv',
    entityId: 'tenant_gongja',
    name: 'Supervisor (SPV)',
    description: 'Mengawasi jalannya shift kasir, persetujuan Void, dan denah meja.',
    isSystemRole: true,
    permissions: {
      canAccessPOS: true,
      canManageCatalog: false,
      canAccessKDS: true,
      canManageTables: true,
      canManageInventory: true,
      canManageStaff: false,
      canViewReports: true,
      canVoidOrders: true,
      canManageSettings: false
    }
  },
  {
    id: 'role_gongja_kasir',
    entityId: 'tenant_gongja',
    name: 'Kasir Operasional POS',
    description: 'Melayani transaksi kasir, penerimaan pembayaran, dan cetak struk.',
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
  {
    id: 'role_gongja_dapur',
    entityId: 'tenant_gongja',
    name: 'Staf Dapur (KDS Kitchen)',
    description: 'Melihat tiket pesanan di dapur dan menandai status pesanan siap saji.',
    isSystemRole: true,
    permissions: {
      canAccessPOS: false,
      canManageCatalog: false,
      canAccessKDS: true,
      canManageTables: false,
      canManageInventory: false,
      canManageStaff: false,
      canViewReports: false,
      canVoidOrders: false,
      canManageSettings: false
    }
  }
];

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  // 1. OWNER
  {
    id: 'user_gongja_owner',
    name: 'Gongja (Owner)',
    email: 'gongja@app.com',
    password: '123',
    role: 'Owner',
    customRoleId: 'role_gongja_owner',
    tenantId: 'tenant_gongja',
    allowedTenantIds: ['tenant_gongja'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  // 2. MANAGER
  {
    id: 'user_gongja_manager',
    name: 'Budi (Manager Gongja)',
    email: 'manager@gongja.id',
    password: '123',
    role: 'Manager',
    customRoleId: 'role_gongja_manager',
    tenantId: 'tenant_gongja',
    allowedTenantIds: ['tenant_gongja'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  // 3. SPV
  {
    id: 'user_gongja_spv',
    name: 'Rudi (SPV Gongja)',
    email: 'spv@gongja.id',
    password: '123',
    role: 'SPV',
    customRoleId: 'role_gongja_spv',
    tenantId: 'tenant_gongja',
    allowedTenantIds: ['tenant_gongja'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  // 4. KASIR
  {
    id: 'user_gongja_kasir',
    name: 'Siti (Kasir Gongja)',
    email: 'kasir@gongja.id',
    password: '123',
    role: 'Kasir',
    customRoleId: 'role_gongja_kasir',
    tenantId: 'tenant_gongja',
    allowedTenantIds: ['tenant_gongja'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  // 5. DAPUR
  {
    id: 'user_gongja_dapur',
    name: 'Chef Agus (Staf Dapur)',
    email: 'dapur@gongja.id',
    password: '123',
    role: 'Dapur',
    customRoleId: 'role_gongja_dapur',
    tenantId: 'tenant_gongja',
    allowedTenantIds: ['tenant_gongja'],
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80'
  },
  // 6. SUPERADMIN
  {
    id: 'user_superadmin_1',
    name: 'Bu Ira (SuperAdmin SaaS)',
    email: 'superadmin@buira.id',
    password: '123',
    role: 'SuperAdmin',
    tenantId: 'tenant_gongja',
    allowedTenantIds: ['tenant_gongja'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_BUSINESS_ENTITIES: BusinessEntity[] = [
  {
    id: 'tenant_gongja',
    ownerId: 'user_gongja_owner',
    businessType: 'F&B',
    name: 'Kopi Gongja',
    tagline: 'Authentic Specialty Coffee & Eatery',
    logo: '',
    primaryColor: 'from-red-600 to-red-800',
    accentColor: 'red-600',
    address: 'Jl. Tanjung Raya (Tanray), Pontianak',
    phone: '0812-5555-7777',
    taxRate: 0.10,
    serviceRate: 0.05
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_gj_coffee', entityId: 'tenant_gongja', name: 'Kopi & Espresso Gongja', iconName: 'Coffee', color: 'bg-red-600' },
  { id: 'cat_gj_tea', entityId: 'tenant_gongja', name: 'Teh & Non-Coffee Gongja', iconName: 'CupSoda', color: 'bg-slate-700' },
  { id: 'cat_gj_food', entityId: 'tenant_gongja', name: 'Makanan & Eatery Gongja', iconName: 'Utensils', color: 'bg-red-700' },
  { id: 'cat_gj_snack', entityId: 'tenant_gongja', name: 'Snack & Pastry Gongja', iconName: 'Cake', color: 'bg-red-600' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_gj_1',
    entityId: 'tenant_gongja',
    name: 'Kopi Gongja Tanray',
    categoryId: 'cat_gj_coffee',
    sku: 'GJ-101',
    barcode: '8992001001',
    costPrice: 7000,
    price: 18000,
    isBestSeller: true,
    stock: 100,
    minStockAlert: 15,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60',
    description: 'Kopi rempah khas Kopi Gongja racikan arabika lokal Pontianak.',
    isActive: true
  },
  {
    id: 'prod_gj_2',
    entityId: 'tenant_gongja',
    name: 'Kopi Susu Aren Gongja',
    categoryId: 'cat_gj_coffee',
    sku: 'GJ-102',
    barcode: '8992001002',
    costPrice: 8000,
    price: 20000,
    isBestSeller: true,
    stock: 80,
    minStockAlert: 10,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60',
    description: 'Es kopi susu gula aren murni khas Kopi Gongja.',
    isActive: true
  },
  {
    id: 'prod_gj_3',
    entityId: 'tenant_gongja',
    name: 'Matcha Cream Latte',
    categoryId: 'cat_gj_tea',
    sku: 'GJ-201',
    barcode: '8992001003',
    costPrice: 9000,
    price: 22000,
    isBestSeller: false,
    stock: 60,
    minStockAlert: 10,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60',
    description: 'Matcha Uji premium dipadu dengan susu segar manis.',
    isActive: true
  },
  {
    id: 'prod_gj_4',
    entityId: 'tenant_gongja',
    name: 'Nasi Goreng Gongja Special',
    categoryId: 'cat_gj_food',
    sku: 'GJ-301',
    barcode: '8992001004',
    costPrice: 12000,
    price: 28000,
    isRecommended: true,
    stock: 50,
    minStockAlert: 5,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60',
    description: 'Nasi goreng rempah special telur ceplok dan sosis panggang.',
    isActive: true
  },
  {
    id: 'prod_gj_5',
    entityId: 'tenant_gongja',
    name: 'Croissant Butter Flaky',
    categoryId: 'cat_gj_snack',
    sku: 'GJ-401',
    barcode: '8992001005',
    costPrice: 7500,
    price: 18000,
    isRecommended: false,
    stock: 35,
    minStockAlert: 5,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60',
    description: 'Roti butter croissant hangat dan renyah.',
    isActive: true
  }
];

export const INITIAL_TABLES: Table[] = [
  { id: 'tbl_1', entityId: 'tenant_gongja', number: 'Meja 01', area: 'Indoor Utama', capacity: 4, status: 'AVAILABLE' },
  { id: 'tbl_2', entityId: 'tenant_gongja', number: 'Meja 02', area: 'Indoor Utama', capacity: 4, status: 'AVAILABLE' },
  { id: 'tbl_3', entityId: 'tenant_gongja', number: 'Meja 03', area: 'VIP Room', capacity: 6, status: 'AVAILABLE' },
  { id: 'tbl_4', entityId: 'tenant_gongja', number: 'Meja 04', area: 'Outdoor Terrace', capacity: 4, status: 'AVAILABLE' }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv_1', entityId: 'tenant_gongja', name: 'Biji Kopi Arabika Gongja (kg)', sku: 'INV-GJ-01', unit: 'kg', currentStock: 25, minStockAlert: 5, costPerUnit: 150000 },
  { id: 'inv_2', entityId: 'tenant_gongja', name: 'Susu Segar UHT (liter)', sku: 'INV-GJ-02', unit: 'liter', currentStock: 50, minStockAlert: 10, costPerUnit: 18000 },
  { id: 'inv_3', entityId: 'tenant_gongja', name: 'Gula Aren Cair (liter)', sku: 'INV-GJ-03', unit: 'liter', currentStock: 15, minStockAlert: 3, costPerUnit: 35000 }
];
