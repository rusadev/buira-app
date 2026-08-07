import type { BusinessEntity, Category, Product, Table, InventoryItem, UserAccount } from '../types/pos';

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'user_cs_1',
    name: 'Budi Barista',
    email: 'barista@kopisenja.id',
    role: 'Owner',
    tenantId: 'coffee_shop',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_ag_1',
    name: 'Siti Kasir',
    email: 'kasir@geprekmercon.id',
    role: 'Manager',
    tenantId: 'ayam_geprek',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_apt_1',
    name: 'Apt. Rina S.Farm',
    email: 'apoteker@sehatbuira.id',
    role: 'Apoteker',
    tenantId: 'apotek_buira',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_prp_1',
    name: 'Hendra Sales',
    email: 'sales@buiraresidence.id',
    role: 'Agent',
    tenantId: 'properti_buira',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_BUSINESS_ENTITIES: BusinessEntity[] = [
  {
    id: 'coffee_shop',
    businessType: 'F&B',
    name: 'Kopi Senja Utama',
    tagline: 'Artisan Coffee & Fresh Bakery',
    logo: '☕',
    primaryColor: 'from-amber-700 to-amber-900',
    accentColor: 'amber-500',
    address: 'Jl. Senopati No. 88, Jakarta Selatan',
    phone: '0812-3456-7890',
    taxRate: 0.10,
    serviceRate: 0.05
  },
  {
    id: 'ayam_geprek',
    businessType: 'F&B',
    name: 'Geprek Mercon Pedas',
    tagline: 'Kuliner Ayam Geprek Pedas Mantap',
    logo: '🍗',
    primaryColor: 'from-rose-600 to-red-900',
    accentColor: 'rose-500',
    address: 'Jl. Margonda Raya No. 123, Depok',
    phone: '0857-9876-5432',
    taxRate: 0.10,
    serviceRate: 0.00
  },
  {
    id: 'apotek_buira',
    businessType: 'Apotek',
    name: 'Apotek Sehat Bu Ira',
    tagline: 'Apotek & Mitra Kesehatan Keluarga',
    logo: '💊',
    primaryColor: 'from-emerald-600 to-teal-900',
    accentColor: 'emerald-500',
    address: 'Jl. Raya Pajajaran No. 45, Bogor',
    phone: '0811-2233-4455',
    taxRate: 0.00,
    serviceRate: 0.00
  },
  {
    id: 'properti_buira',
    businessType: 'Properti',
    name: 'Bu Ira Residence & Commercial',
    tagline: 'Hunian Asri & Kawasan Komersial',
    logo: '🏢',
    primaryColor: 'from-blue-700 to-indigo-900',
    accentColor: 'blue-500',
    address: 'Jl. CBD Utama No. 1, Tangerang',
    phone: '0813-9988-7766',
    taxRate: 0.00,
    serviceRate: 0.00
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  // Coffee Shop Categories
  { id: 'cat_espresso', entityId: 'coffee_shop', name: 'Espresso Based', iconName: 'Coffee', color: 'bg-amber-600' },
  { id: 'cat_manual_brew', entityId: 'coffee_shop', name: 'Manual Brew', iconName: 'Flame', color: 'bg-amber-800' },
  { id: 'cat_non_coffee', entityId: 'coffee_shop', name: 'Non-Coffee', iconName: 'CupSoda', color: 'bg-emerald-600' },
  { id: 'cat_pastry', entityId: 'coffee_shop', name: 'Pastry & Cake', iconName: 'Cake', color: 'bg-amber-500' },
  
  // Ayam Geprek Categories
  { id: 'cat_geprek_paket', entityId: 'ayam_geprek', name: 'Paket Geprek', iconName: 'Drumstick', color: 'bg-rose-600' },
  { id: 'cat_geprek_ala_carte', entityId: 'ayam_geprek', name: 'Ayam Ala Carte', iconName: 'Utensils', color: 'bg-red-600' },
  { id: 'cat_side_dish', entityId: 'ayam_geprek', name: 'Side Dish / Pendamping', iconName: 'Egg', color: 'bg-amber-600' },
  { id: 'cat_minuman_resto', entityId: 'ayam_geprek', name: 'Minuman Segar', iconName: 'GlassWater', color: 'bg-cyan-600' }
];

export const INITIAL_PRODUCTS: Product[] = [
  // COFFEE SHOP PRODUCTS
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
    isActive: true,
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
        required: true,
        options: [
          { id: 'opt_s_normal', name: 'Normal Sugar (100%)', priceModifier: 0 },
          { id: 'opt_s_less', name: 'Less Sugar (50%)', priceModifier: 0 },
          { id: 'opt_s_extra', name: 'Extra Sugar (120%)', priceModifier: 0 },
          { id: 'opt_s_none', name: 'No Sugar (0%)', priceModifier: 0 }
        ]
      },
      {
        id: 'vg_milk',
        name: 'Pilihan Susu',
        required: false,
        options: [
          { id: 'opt_fresh_milk', name: 'Fresh Milk (Default)', priceModifier: 0 },
          { id: 'opt_oat_milk', name: 'Oatside Oat Milk', priceModifier: 7000 },
          { id: 'opt_soy_milk', name: 'Soy Milk', priceModifier: 5000 }
        ]
      }
    ]
  },
  {
    id: 'prod_americano',
    entityId: 'coffee_shop',
    name: 'Americano Signature',
    categoryId: 'cat_espresso',
    sku: 'CS-ESP-002',
    barcode: '8991001002',
    costPrice: 5000,
    price: 18000,
    stock: 120,
    minStockAlert: 20,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60',
    description: 'Double shot espresso dengan air mineral menyegarkan.',
    isActive: true,
    variantGroups: [
      {
        id: 'vg_temp',
        name: 'Suhu (Temperature)',
        required: true,
        options: [
          { id: 'opt_iced', name: 'Iced', priceModifier: 0 },
          { id: 'opt_hot', name: 'Hot', priceModifier: 0 }
        ]
      },
      {
        id: 'vg_beans',
        name: 'Biji Kopi (Beans)',
        required: false,
        options: [
          { id: 'opt_house_blend', name: 'House Blend (Robusta-Arabica)', priceModifier: 0 },
          { id: 'opt_arabica_single', name: 'Single Origin Aceh Gayo', priceModifier: 5000 }
        ]
      }
    ]
  },

  // AYAM GEPREK PRODUCTS
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
    isActive: true,
    variantGroups: [
      {
        id: 'vg_pedas',
        name: 'Level Pedas',
        required: true,
        options: [
          { id: 'opt_lvl_0', name: 'Level 0 (Tanpa Cabai)', priceModifier: 0 },
          { id: 'opt_lvl_1', name: 'Level 1 (Cabai 2)', priceModifier: 0 },
          { id: 'opt_lvl_3', name: 'Level 3 (Cabai 5)', priceModifier: 0 },
          { id: 'opt_lvl_5', name: 'Level 5 (Cabai 10)', priceModifier: 2000 },
          { id: 'opt_lvl_10', name: 'Level 10 Mercon (Cabai 20)', priceModifier: 5000 }
        ]
      }
    ]
  }
];

export const INITIAL_TABLES: Table[] = [
  // Coffee Shop Tables
  { id: 'tbl_cs_1', entityId: 'coffee_shop', tableNumber: 'Meja 01 (Indoor)', capacity: 2, status: 'Available' },
  { id: 'tbl_cs_2', entityId: 'coffee_shop', tableNumber: 'Meja 02 (Indoor)', capacity: 4, status: 'Available' },
  
  // Ayam Geprek Tables
  { id: 'tbl_ag_1', entityId: 'ayam_geprek', tableNumber: 'Meja A1', capacity: 4, status: 'Available' },
  { id: 'tbl_ag_2', entityId: 'ayam_geprek', tableNumber: 'Meja A2', capacity: 4, status: 'Available' }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  // Coffee Shop Inventory
  { id: 'inv_cs_1', entityId: 'coffee_shop', name: 'Biji Kopi Espresso Blend (Arabica/Robusta)', category: 'Bahan Baku Utama', stock: 12.5, unit: 'Kg', minStock: 3.0, costPerUnit: 180000, lastRestocked: '2026-08-01' },
  { id: 'inv_cs_2', entityId: 'coffee_shop', name: 'Susu Fresh Milk Diamond 1L', category: 'Dairy', stock: 24, unit: 'Liter', minStock: 10, costPerUnit: 21000, lastRestocked: '2026-08-05' },

  // Ayam Geprek Inventory
  { id: 'inv_ag_1', entityId: 'ayam_geprek', name: 'Daging Ayam Potong Segar', category: 'Bahan Utama', stock: 35, unit: 'Kg', minStock: 10, costPerUnit: 38000, lastRestocked: '2026-08-07' }
];
