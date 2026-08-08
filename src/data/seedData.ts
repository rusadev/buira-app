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
  // 1. OWNER (Pemilik Outlet / Franchise)
  {
    id: 'user_gongja_admin',
    name: 'Gongja (Owner F&B)',
    email: 'gongja@app.com',
    password: '123',
    role: 'Owner',
    tenantId: 'tenant_gongja',
    allowedTenantIds: ['tenant_gongja', 'coffee_shop', 'ayam_geprek'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  // 2. MANAGER (Manager Operasional Outlet)
  {
    id: 'user_manager_1',
    name: 'Budi (Manager Outlet)',
    email: 'manager@kopisenja.id',
    password: '123',
    role: 'Manager',
    customRoleId: 'role_cs_manager',
    tenantId: 'coffee_shop',
    allowedTenantIds: ['coffee_shop'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  // 3. SPV (Supervisor Operasional)
  {
    id: 'user_spv_1',
    name: 'Rudi (Supervisor Shift)',
    email: 'spv@kopisenja.id',
    password: '123',
    role: 'SPV',
    tenantId: 'coffee_shop',
    allowedTenantIds: ['coffee_shop'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  // 4. KASIR (Kasir POS Operasional)
  {
    id: 'user_ag_1',
    name: 'Siti (Kasir Operasional)',
    email: 'kasir@geprekmercon.id',
    password: '123',
    role: 'Kasir',
    customRoleId: 'role_ag_kasir',
    tenantId: 'ayam_geprek',
    allowedTenantIds: ['ayam_geprek'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  // 5. DAPUR (Staf Dapur / KDS Kitchen)
  {
    id: 'user_dapur_1',
    name: 'Chef Agus (Staf Dapur)',
    email: 'dapur@kopisenja.id',
    password: '123',
    role: 'Dapur',
    tenantId: 'coffee_shop',
    allowedTenantIds: ['coffee_shop'],
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80'
  },
  // 6. SUPERADMIN (SaaS Platform Master)
  {
    id: 'user_superadmin_1',
    name: 'Bu Ira (SuperAdmin SaaS)',
    email: 'superadmin@buira.id',
    password: '123',
    role: 'SuperAdmin',
    tenantId: 'tenant_gongja',
    allowedTenantIds: ['tenant_gongja', 'coffee_shop', 'ayam_geprek', 'apotek_buira', 'properti_buira'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_BUSINESS_ENTITIES: BusinessEntity[] = [
  {
    id: 'tenant_gongja',
    ownerId: 'user_gongja_admin',
    businessType: 'F&B',
    name: 'Gongja Coffee Tanray',
    tagline: 'Authentic Specialty Coffee & Eatery',
    logo: '',
    primaryColor: 'from-red-600 to-red-800',
    accentColor: 'red-600',
    address: 'Jl. Tanjung Raya (Tanray), Pontianak',
    phone: '0812-5555-7777',
    taxRate: 0.10,
    serviceRate: 0.05
  },
  {
    id: 'coffee_shop',
    ownerId: 'user_cs_1',
    businessType: 'F&B',
    name: 'Kopi Senja Utama',
    tagline: 'Artisan Coffee & Fresh Bakery',
    logo: '',
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
    logo: '',
    primaryColor: 'from-red-600 to-red-800',
    accentColor: 'red-600',
    address: 'Jl. Margonda Raya No. 123, Depok',
    phone: '0857-9876-5432',
    taxRate: 0.10,
    serviceRate: 0.00
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  // Gongja Coffee Tanray
  { id: 'cat_gongja_coffee', entityId: 'tenant_gongja', name: 'Gongja Coffee & Espresso', iconName: 'Coffee', color: 'bg-red-600' },
  { id: 'cat_gongja_tea', entityId: 'tenant_gongja', name: 'Artisan Tea & Non-Coffee', iconName: 'CupSoda', color: 'bg-slate-700' },
  { id: 'cat_gongja_food', entityId: 'tenant_gongja', name: 'Gongja Heavy Meals & Eatery', iconName: 'Utensils', color: 'bg-red-700' },
  { id: 'cat_gongja_snack', entityId: 'tenant_gongja', name: 'Snacks & Croissants', iconName: 'Cake', color: 'bg-red-600' },

  // Kopi Senja Utama
  { id: 'cat_espresso', entityId: 'coffee_shop', name: 'Espresso Based', iconName: 'Coffee', color: 'bg-red-600' },
  { id: 'cat_manual_brew', entityId: 'coffee_shop', name: 'Manual Brew', iconName: 'Flame', color: 'bg-red-700' },
  { id: 'cat_non_coffee', entityId: 'coffee_shop', name: 'Non-Coffee', iconName: 'CupSoda', color: 'bg-slate-700' },
  { id: 'cat_pastry', entityId: 'coffee_shop', name: 'Pastry & Cake', iconName: 'Cake', color: 'bg-red-600' },
  
  // Ayam Geprek Mercon
  { id: 'cat_geprek_paket', entityId: 'ayam_geprek', name: 'Paket Geprek', iconName: 'Drumstick', color: 'bg-red-600' },
  { id: 'cat_geprek_ala_carte', entityId: 'ayam_geprek', name: 'Ayam Ala Carte', iconName: 'Utensils', color: 'bg-red-700' },
  { id: 'cat_geprek_minuman', entityId: 'ayam_geprek', name: 'Minuman Segar', iconName: 'CupSoda', color: 'bg-slate-700' }
];

export const INITIAL_PRODUCTS: Product[] = [
  // ☕ GONGJA COFFEE TANRAY PRODUCTS
  {
    id: 'prod_gj_1',
    entityId: 'tenant_gongja',
    name: 'Kopi Gongja Tanray',
    categoryId: 'cat_gongja_coffee',
    sku: 'GJ-101',
    barcode: '8992001001',
    costPrice: 7000,
    price: 18000,
    isBestSeller: true,
    stock: 100,
    minStockAlert: 15,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60',
    description: 'Kopi rempah khas Gongja Tanray racikan arabika lokal Pontianak.',
    isActive: true
  },
  {
    id: 'prod_gj_2',
    entityId: 'tenant_gongja',
    name: 'Kopi Susu Aren Gongja',
    categoryId: 'cat_gongja_coffee',
    sku: 'GJ-102',
    barcode: '8992001002',
    costPrice: 8000,
    price: 20000,
    isBestSeller: true,
    stock: 80,
    minStockAlert: 10,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60',
    description: 'Es kopi susu gula aren murni khas Gongja Tanray.',
    isActive: true
  },
  {
    id: 'prod_gj_3',
    entityId: 'tenant_gongja',
    name: 'Nasi Goreng Gongja Special',
    categoryId: 'cat_gongja_food',
    sku: 'GJ-301',
    barcode: '8992001003',
    costPrice: 12000,
    price: 28000,
    isRecommended: true,
    stock: 50,
    minStockAlert: 5,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60',
    description: 'Nasi goreng rempah special telur ceplok dan sosis panggang.',
    isActive: true
  },
  // ☕ COFFEE SHOP PRODUCTS (Kopi Senja Utama)
  {
    id: 'prod_kopi_susu_aren',
    entityId: 'coffee_shop',
    name: 'Kopi Susu Gula Aren',
    categoryId: 'cat_espresso',
    sku: 'CS-ESP-001',
    barcode: '8991001001',
    costPrice: 8000,
    price: 22000,
    isBestSeller: true,
    stock: 120,
    minStockAlert: 15,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60',
    description: 'Espresso house blend dipadu susu segar dan gula aren organik khas Senja.',
    variantGroups: [
      {
        id: 'vg_temp',
        name: 'Suhu (Temperature)',
        required: true,
        options: [
          { id: 'opt_iced', name: 'Iced (Dingin)', priceModifier: 0 },
          { id: 'opt_hot', name: 'Hot (Panas)', priceModifier: 0 }
        ]
      },
      {
        id: 'vg_sugar',
        name: 'Sugar Level',
        required: false,
        options: [
          { id: 'opt_normal_sug', name: 'Normal Sugar (100%)', priceModifier: 0 },
          { id: 'opt_less_sug', name: 'Less Sugar (50%)', priceModifier: 0 }
        ]
      },
      {
        id: 'vg_milk',
        name: 'Pilihan Susu',
        required: false,
        options: [
          { id: 'opt_fresh_milk', name: 'Fresh Milk (Default)', priceModifier: 0 },
          { id: 'opt_oat_milk', name: 'Oat Milk (Plant Based)', priceModifier: 6000 }
        ]
      }
    ],
    isActive: true
  },
  {
    id: 'prod_americano_signature',
    entityId: 'coffee_shop',
    name: 'Americano Signature',
    categoryId: 'cat_espresso',
    sku: 'CS-ESP-002',
    barcode: '8991001002',
    costPrice: 5000,
    price: 18000,
    stock: 95,
    minStockAlert: 10,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60',
    description: 'Double shot espresso murni dengan air mineral jernih.',
    variantGroups: [
      {
        id: 'vg_temp_am',
        name: 'Suhu',
        required: true,
        options: [
          { id: 'opt_iced_am', name: 'Iced', priceModifier: 0 },
          { id: 'opt_hot_am', name: 'Hot', priceModifier: 0 }
        ]
      }
    ],
    isActive: true
  },
  {
    id: 'prod_caffe_latte_velvet',
    entityId: 'coffee_shop',
    name: 'Caffe Latte Velvet',
    categoryId: 'cat_espresso',
    sku: 'CS-ESP-003',
    barcode: '8991001003',
    costPrice: 9000,
    price: 24000,
    discountPercentage: 15,
    promoTag: 'BUY 1 GET 1',
    isPromoActive: true,
    isRecommended: true,
    stock: 80,
    minStockAlert: 10,
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&auto=format&fit=crop&q=60',
    description: 'Espresso lembut dengan microfoam susu yang halus.',
    isActive: true
  },
  {
    id: 'prod_caramel_macchiato',
    entityId: 'coffee_shop',
    name: 'Caramel Macchiato',
    categoryId: 'cat_espresso',
    sku: 'CS-ESP-004',
    barcode: '8991001004',
    costPrice: 10000,
    price: 28000,
    stock: 65,
    minStockAlert: 10,
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&auto=format&fit=crop&q=60',
    description: 'Susu vanila creamy diguyur espresso dan drizzle sirup karamel gurih.',
    isActive: true
  },
  {
    id: 'prod_v60_gayo',
    entityId: 'coffee_shop',
    name: 'V60 Manual Brew Gayo',
    categoryId: 'cat_manual_brew',
    sku: 'CS-MB-001',
    barcode: '8991002001',
    costPrice: 9000,
    price: 25000,
    stock: 50,
    minStockAlert: 5,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60',
    description: 'Seduhan kualitatif kertas saring dengan karakter floral dan fruity.',
    isActive: true
  },
  {
    id: 'prod_japanese_cold_drip',
    entityId: 'coffee_shop',
    name: 'Japanese Cold Drip',
    categoryId: 'cat_manual_brew',
    sku: 'CS-MB-002',
    barcode: '8991002002',
    costPrice: 10000,
    price: 27000,
    stock: 40,
    minStockAlert: 5,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60',
    description: 'Seduhan manual segar yang diekstrak langsung di atas bongkahan es esensial.',
    isActive: true
  },
  {
    id: 'prod_uji_matcha_latte',
    entityId: 'coffee_shop',
    name: 'Uji Matcha Latte',
    categoryId: 'cat_non_coffee',
    sku: 'CS-NON-001',
    barcode: '8991003001',
    costPrice: 11000,
    price: 26000,
    discountPercentage: 10,
    stock: 75,
    minStockAlert: 10,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60',
    description: 'Bubuk matcha murni asal Uji Kyoto dipadu susu segar pilihan.',
    isActive: true
  },
  {
    id: 'prod_chocolate_creamy',
    entityId: 'coffee_shop',
    name: 'Chocolate Creamy Ice',
    categoryId: 'cat_non_coffee',
    sku: 'CS-NON-002',
    barcode: '8991003002',
    costPrice: 9000,
    price: 24000,
    stock: 90,
    minStockAlert: 15,
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&auto=format&fit=crop&q=60',
    description: 'Cokelat belgia kaya rasa dengan kelembutan susu murni.',
    isActive: true
  },
  {
    id: 'prod_butter_croissant',
    entityId: 'coffee_shop',
    name: 'Butter Croissant Artisan',
    categoryId: 'cat_pastry',
    sku: 'CS-PST-001',
    barcode: '8991004001',
    costPrice: 7000,
    price: 18000,
    discountPercentage: 20,
    stock: 30,
    minStockAlert: 5,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60',
    description: 'Pastry prancis berlayer dengan aroma mentega Perancis renyah.',
    isActive: true
  },
  {
    id: 'prod_pain_au_chocolat',
    entityId: 'coffee_shop',
    name: 'Pain Au Chocolat',
    categoryId: 'cat_pastry',
    sku: 'CS-PST-002',
    barcode: '8991004002',
    costPrice: 9000,
    price: 22000,
    discountPercentage: 10,
    stock: 25,
    minStockAlert: 5,
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&auto=format&fit=crop&q=60',
    description: 'Croissant renyah dengan isian batang cokelat meleleh di dalam.',
    isActive: true
  },
  {
    id: 'prod_flat_white',
    entityId: 'coffee_shop',
    name: 'Flat White',
    categoryId: 'cat_espresso',
    sku: 'CS-ESP-005',
    barcode: '8991001005',
    costPrice: 8000,
    price: 26000,
    stock: 70,
    minStockAlert: 10,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&auto=format&fit=crop&q=60',
    description: 'Ristretto shot dengan microfoam susu halus khas Australia.',
    isActive: true
  },
  {
    id: 'prod_cappuccino',
    entityId: 'coffee_shop',
    name: 'Cappuccino Classic',
    categoryId: 'cat_espresso',
    sku: 'CS-ESP-006',
    barcode: '8991001006',
    costPrice: 7500,
    price: 24000,
    stock: 80,
    minStockAlert: 10,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop&q=60',
    description: 'Espresso dengan busa susu tebal dan taburan cokelat bubuk.',
    isActive: true
  },
  {
    id: 'prod_es_kopi_susu',
    entityId: 'coffee_shop',
    name: 'Es Kopi Susu Senja',
    categoryId: 'cat_espresso',
    sku: 'CS-ESP-007',
    barcode: '8991001007',
    costPrice: 7000,
    price: 20000,
    stock: 100,
    minStockAlert: 15,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&auto=format&fit=crop&q=60',
    description: 'Kopi susu segar khas Senja dengan es batu berlimpah.',
    isActive: true
  },
  {
    id: 'prod_aeropress_toraja',
    entityId: 'coffee_shop',
    name: 'Aeropress Toraja',
    categoryId: 'cat_manual_brew',
    sku: 'CS-MB-003',
    barcode: '8991002003',
    costPrice: 11000,
    price: 28000,
    stock: 35,
    minStockAlert: 5,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60',
    description: 'Ekstrak penuh badan dengan karakter earthy dan dark chocolate dari Toraja.',
    isActive: true
  },
  {
    id: 'prod_pourover_flores',
    entityId: 'coffee_shop',
    name: 'Pour Over Flores Bajawa',
    categoryId: 'cat_manual_brew',
    sku: 'CS-MB-004',
    barcode: '8991002004',
    costPrice: 12000,
    price: 30000,
    stock: 28,
    minStockAlert: 5,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60',
    description: 'Single origin Flores dengan profil rasa buah dan karamel ringan.',
    isActive: true
  },
  {
    id: 'prod_teh_tarik',
    entityId: 'coffee_shop',
    name: 'Teh Tarik Premium',
    categoryId: 'cat_non_coffee',
    sku: 'CS-NON-003',
    barcode: '8991003003',
    costPrice: 5000,
    price: 18000,
    stock: 60,
    minStockAlert: 10,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60',
    description: 'Teh susu kental manis khas Malaysia yang creamy dan wangi.',
    isActive: true
  },
  {
    id: 'prod_es_coklat_belgium',
    entityId: 'coffee_shop',
    name: 'Es Coklat Belgium',
    categoryId: 'cat_non_coffee',
    sku: 'CS-NON-004',
    barcode: '8991003004',
    costPrice: 10000,
    price: 26000,
    stock: 50,
    minStockAlert: 8,
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&auto=format&fit=crop&q=60',
    description: 'Dark chocolate Belgium premium, dingin, kaya dan intens.',
    isActive: true
  },
  {
    id: 'prod_strawberry_smoothie',
    entityId: 'coffee_shop',
    name: 'Strawberry Smoothie',
    categoryId: 'cat_non_coffee',
    sku: 'CS-NON-005',
    barcode: '8991003005',
    costPrice: 9000,
    price: 24000,
    stock: 40,
    minStockAlert: 8,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60',
    description: 'Blend strawberry segar dengan yogurt susu lembut dan madu.',
    isActive: true
  },
  {
    id: 'prod_banana_cake',
    entityId: 'coffee_shop',
    name: 'Banana Walnut Cake',
    categoryId: 'cat_pastry',
    sku: 'CS-PST-003',
    barcode: '8991004003',
    costPrice: 8000,
    price: 20000,
    stock: 20,
    minStockAlert: 5,
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&auto=format&fit=crop&q=60',
    description: 'Cake pisang lembut dengan walnut panggang dan glasir madu.',
    isActive: true
  },
  {
    id: 'prod_tiramisu',
    entityId: 'coffee_shop',
    name: 'Tiramisu Classic',
    categoryId: 'cat_pastry',
    sku: 'CS-PST-004',
    barcode: '8991004004',
    costPrice: 13000,
    price: 28000,
    stock: 15,
    minStockAlert: 3,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60',
    description: 'Tiramisu Italia autentik dengan savoiardi, mascarpone dan espresso.',
    isActive: true
  },
  {
    id: 'prod_croffle',
    entityId: 'coffee_shop',
    name: 'Croffle Keju Mozza',
    categoryId: 'cat_pastry',
    sku: 'CS-PST-005',
    barcode: '8991004005',
    costPrice: 10000,
    price: 22000,
    stock: 18,
    minStockAlert: 4,
    image: 'https://images.unsplash.com/photo-1504973960431-1c467e159aa4?w=500&auto=format&fit=crop&q=60',
    description: 'Croissant dipanggang waffle dengan lelehan mozzarella gurih.',
    isActive: true
  },

  // 🍗 GEPREK MERCON PRODUCTS (Geprek Mercon Pedas)
  {
    id: 'prod_paket_geprek_mercon',
    entityId: 'ayam_geprek',
    name: 'Paket Geprek Sambal Bawang Mercon',
    categoryId: 'cat_geprek_paket',
    sku: 'AG-PKT-001',
    barcode: '8992001001',
    costPrice: 11000,
    price: 24000,
    stock: 150,
    minStockAlert: 20,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60',
    description: 'Nasi hangat + Ayam Crispy Geprek Sambal Bawang Rawit Mercon + Lalapan Segar.',
    variantGroups: [
      {
        id: 'vg_level_pedas',
        name: 'Level Pedas',
        required: true,
        options: [
          { id: 'opt_lvl_1', name: 'Level 1 (Sedang)', priceModifier: 0 },
          { id: 'opt_lvl_3', name: 'Level 3 (Pedas)', priceModifier: 0 },
          { id: 'opt_lvl_5', name: 'Level 5 (Super Mercon)', priceModifier: 2000 }
        ]
      },
      {
        id: 'vg_topping',
        name: 'Tambah Topping',
        required: false,
        options: [
          { id: 'opt_top_keju', name: 'Keju Mozzarella Leleh', priceModifier: 5000 },
          { id: 'opt_top_telur', name: 'Telur Ceplok Goreng', priceModifier: 4000 }
        ]
      }
    ],
    isActive: true
  },
  {
    id: 'prod_paket_geprek_matah',
    entityId: 'ayam_geprek',
    name: 'Paket Geprek Sambal Matah Bali',
    categoryId: 'cat_geprek_paket',
    sku: 'AG-PKT-002',
    barcode: '8992001002',
    costPrice: 11500,
    price: 25000,
    stock: 100,
    minStockAlert: 15,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&auto=format&fit=crop&q=60',
    description: 'Nasi hangat + Ayam Crispy Geprek Sambal Matah Serai Wangi + Lalapan.',
    isActive: true
  },
  {
    id: 'prod_paket_geprek_telur_asin',
    entityId: 'ayam_geprek',
    name: 'Paket Geprek Saus Telur Asin',
    categoryId: 'cat_geprek_paket',
    sku: 'AG-PKT-003',
    barcode: '8992001003',
    costPrice: 12500,
    price: 27000,
    stock: 85,
    minStockAlert: 15,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=60',
    description: 'Nasi hangat + Ayam Crispy siram saus salted egg creamy gurih.',
    isActive: true
  },
  {
    id: 'prod_ayam_crispy_dada',
    entityId: 'ayam_geprek',
    name: 'Ayam Crispy Dada Mercon',
    categoryId: 'cat_geprek_ala_carte',
    sku: 'AG-ALC-001',
    barcode: '8992002001',
    costPrice: 8500,
    price: 17000,
    stock: 90,
    minStockAlert: 15,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60',
    description: 'Potongan Dada Ayam Crispy renyah dengan geprekan sambal bawang.',
    isActive: true
  },
  {
    id: 'prod_kulit_crispy_pedas',
    entityId: 'ayam_geprek',
    name: 'Kulit Ayam Crispy Pedas',
    categoryId: 'cat_geprek_ala_carte',
    sku: 'AG-ALC-002',
    barcode: '8992002002',
    costPrice: 6000,
    price: 14000,
    stock: 60,
    minStockAlert: 10,
    image: 'https://images.unsplash.com/photo-1585325701165-351af916e581?w=500&auto=format&fit=crop&q=60',
    description: 'Kulit ayam goreng tepung super renyah dengan taburan bumbu cabai.',
    isActive: true
  },
  {
    id: 'prod_es_teh_manis_jumbo',
    entityId: 'ayam_geprek',
    name: 'Es Teh Manis Jumbo',
    categoryId: 'cat_geprek_minuman',
    sku: 'AG-MIN-001',
    barcode: '8992003001',
    costPrice: 1500,
    price: 6000,
    stock: 200,
    minStockAlert: 30,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60',
    description: 'Teh seduh segar gelas ukuran jumbo manis dingin.',
    isActive: true
  },
  {
    id: 'prod_es_jeruk_peras',
    entityId: 'ayam_geprek',
    name: 'Es Jeruk Peras Murni',
    categoryId: 'cat_geprek_minuman',
    sku: 'AG-MIN-002',
    barcode: '8992003002',
    costPrice: 3000,
    price: 8000,
    stock: 120,
    minStockAlert: 20,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=60',
    description: 'Perasan jeruk segar asli penyegar pedasnya mercon.',
    isActive: true
  }
];

export const INITIAL_TABLES: Table[] = [
  { id: 'tbl_cs_1', entityId: 'coffee_shop', tableNumber: 'Meja 01 (Indoor)', capacity: 2, status: 'Available' },
  { id: 'tbl_cs_2', entityId: 'coffee_shop', tableNumber: 'Meja 02 (Indoor)', capacity: 4, status: 'Available' },
  { id: 'tbl_cs_3', entityId: 'coffee_shop', tableNumber: 'Meja 03 (Outdoor)', capacity: 4, status: 'Available' },
  { id: 'tbl_ag_1', entityId: 'ayam_geprek', tableNumber: 'Meja A1', capacity: 4, status: 'Available' },
  { id: 'tbl_ag_2', entityId: 'ayam_geprek', tableNumber: 'Meja A2', capacity: 4, status: 'Available' }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv_cs_1', entityId: 'coffee_shop', name: 'Biji Kopi Espresso Blend (Arabica/Robusta)', category: 'Bahan Baku Utama', stock: 12.5, unit: 'Kg', minStock: 3.0, costPerUnit: 180000, lastRestocked: '2026-08-01' },
  { id: 'inv_cs_2', entityId: 'coffee_shop', name: 'Susu UHT Fresh Milk Pasteurisasi', category: 'Bahan Minuman', stock: 45, unit: 'Liter', minStock: 10, costPerUnit: 18500, lastRestocked: '2026-08-06' },
  { id: 'inv_ag_1', entityId: 'ayam_geprek', name: 'Daging Ayam Potong Segar', category: 'Bahan Utama', stock: 35, unit: 'Kg', minStock: 10, costPerUnit: 38000, lastRestocked: '2026-08-07' },
  { id: 'inv_ag_2', entityId: 'ayam_geprek', name: 'Cabai Rawit Merak Mercon', category: 'Bumbu & Sambal', stock: 15, unit: 'Kg', minStock: 3, costPerUnit: 45000, lastRestocked: '2026-08-07' }
];
