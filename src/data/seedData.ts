import type { BusinessEntity, Category, Product, Table, InventoryItem } from '../types/pos';

export const INITIAL_BUSINESS_ENTITIES: BusinessEntity[] = [
  {
    id: 'coffee_shop',
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
    name: 'Geprek Mercon Pedas',
    tagline: 'Kuliner Ayam Geprek Pedas Mantap',
    logo: '🍗',
    primaryColor: 'from-rose-600 to-red-900',
    accentColor: 'rose-500',
    address: 'Jl. Margonda Raya No. 123, Depok',
    phone: '0857-9876-5432',
    taxRate: 0.10,
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
  {
    id: 'prod_matcha_latte',
    entityId: 'coffee_shop',
    name: 'Uji Matcha Latte',
    categoryId: 'cat_non_coffee',
    sku: 'CS-NON-001',
    barcode: '8991001003',
    costPrice: 10000,
    price: 28000,
    stock: 40,
    minStockAlert: 10,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60',
    description: 'Matcha otentik khas Uji Jepang dengan perpaduan steam milk gurih.',
    isActive: true,
    variantGroups: [
      {
        id: 'vg_temp',
        name: 'Suhu',
        required: true,
        options: [
          { id: 'opt_iced', name: 'Iced', priceModifier: 0 },
          { id: 'opt_hot', name: 'Hot', priceModifier: 0 }
        ]
      }
    ]
  },
  {
    id: 'prod_croissant_butter',
    entityId: 'coffee_shop',
    name: 'French Butter Croissant',
    categoryId: 'cat_pastry',
    sku: 'CS-PAS-001',
    barcode: '8991001004',
    costPrice: 9000,
    price: 25000,
    stock: 18,
    minStockAlert: 5,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60',
    description: 'Croissant renyah berlapis butter mentega Prancis otentik.',
    isActive: true
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
      },
      {
        id: 'vg_potongan',
        name: 'Potongan Ayam',
        required: true,
        options: [
          { id: 'opt_dada', name: 'Dada Crispy', priceModifier: 0 },
          { id: 'opt_paha_atas', name: 'Paha Atas', priceModifier: 0 },
          { id: 'opt_paha_bawah', name: 'Paha Bawah', priceModifier: 0 },
          { id: 'opt_sayap', name: 'Sayap', priceModifier: -2000 }
        ]
      },
      {
        id: 'vg_sambal',
        name: 'Pilihan Sambal',
        required: true,
        options: [
          { id: 'opt_sambal_bawang', name: 'Sambal Bawang', priceModifier: 0 },
          { id: 'opt_sambal_ijo', name: 'Sambal Ijo Merak', priceModifier: 0 },
          { id: 'opt_sambal_matah', name: 'Sambal Matah Bali', priceModifier: 2000 }
        ]
      }
    ]
  },
  {
    id: 'prod_geprek_mozzarella',
    entityId: 'ayam_geprek',
    name: 'Paket Geprek Keju Mozzarella',
    categoryId: 'cat_geprek_paket',
    sku: 'AG-PKT-002',
    barcode: '8992002002',
    costPrice: 15000,
    price: 32000,
    stock: 50,
    minStockAlert: 10,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=60',
    description: 'Ayam geprek pedas dibalut lelehan keju Mozzarella yang dibakar melted.',
    isActive: true,
    variantGroups: [
      {
        id: 'vg_pedas',
        name: 'Level Pedas',
        required: true,
        options: [
          { id: 'opt_lvl_1', name: 'Level 1', priceModifier: 0 },
          { id: 'opt_lvl_3', name: 'Level 3', priceModifier: 0 },
          { id: 'opt_lvl_5', name: 'Level 5', priceModifier: 2000 }
        ]
      }
    ]
  },
  {
    id: 'prod_kulit_crispy',
    entityId: 'ayam_geprek',
    name: 'Kulit Ayam Crispy Mercon',
    categoryId: 'cat_side_dish',
    sku: 'AG-SID-001',
    barcode: '8992002003',
    costPrice: 6000,
    price: 15000,
    stock: 30,
    minStockAlert: 8,
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&auto=format&fit=crop&q=60',
    description: 'Kulit ayam goreng super renyah gurih disajikan dengan cocolan sambal.',
    isActive: true
  },
  {
    id: 'prod_es_teh_jumbo',
    entityId: 'ayam_geprek',
    name: 'Es Teh Manis Jumbo 500ml',
    categoryId: 'cat_minuman_resto',
    sku: 'AG-DRK-001',
    barcode: '8992002004',
    costPrice: 1500,
    price: 6000,
    stock: 250,
    minStockAlert: 30,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60',
    description: 'Es teh manis segar berukuran jumbo pemadam kelaparan dan rasa pedas.',
    isActive: true
  }
];

export const INITIAL_TABLES: Table[] = [
  // Coffee Shop Tables
  { id: 'tbl_cs_1', entityId: 'coffee_shop', tableNumber: 'Meja 01 (Indoor)', capacity: 2, status: 'Available' },
  { id: 'tbl_cs_2', entityId: 'coffee_shop', tableNumber: 'Meja 02 (Indoor)', capacity: 4, status: 'Available' },
  { id: 'tbl_cs_3', entityId: 'coffee_shop', tableNumber: 'Meja 03 (Sofa)', capacity: 6, status: 'Available' },
  { id: 'tbl_cs_4', entityId: 'coffee_shop', tableNumber: 'Bar 01 (Barista Counter)', capacity: 1, status: 'Available' },
  { id: 'tbl_cs_5', entityId: 'coffee_shop', tableNumber: 'Outdoor 01', capacity: 4, status: 'Available' },

  // Ayam Geprek Tables
  { id: 'tbl_ag_1', entityId: 'ayam_geprek', tableNumber: 'Meja A1', capacity: 4, status: 'Available' },
  { id: 'tbl_ag_2', entityId: 'ayam_geprek', tableNumber: 'Meja A2', capacity: 4, status: 'Available' },
  { id: 'tbl_ag_3', entityId: 'ayam_geprek', tableNumber: 'Meja A3 (Lesehan)', capacity: 6, status: 'Available' },
  { id: 'tbl_ag_4', entityId: 'ayam_geprek', tableNumber: 'Meja B1', capacity: 2, status: 'Available' },
  { id: 'tbl_ag_5', entityId: 'ayam_geprek', tableNumber: 'Meja B2', capacity: 4, status: 'Available' }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  // Coffee Shop Inventory
  { id: 'inv_cs_1', entityId: 'coffee_shop', name: 'Biji Kopi Espresso Blend (Arabica/Robusta)', category: 'Bahan Baku Utu', stock: 12.5, unit: 'Kg', minStock: 3.0, costPerUnit: 180000, lastRestocked: '2026-08-01' },
  { id: 'inv_cs_2', entityId: 'coffee_shop', name: 'Susu Fresh Milk Diamond 1L', category: 'Dairy', stock: 24, unit: 'Liter', minStock: 10, costPerUnit: 21000, lastRestocked: '2026-08-05' },
  { id: 'inv_cs_3', entityId: 'coffee_shop', name: 'Gula Aren Cair Organik 1kg', category: 'Sirup & Pemanis', stock: 8, unit: 'Kg', minStock: 2, costPerUnit: 35000, lastRestocked: '2026-08-03' },
  { id: 'inv_cs_4', entityId: 'coffee_shop', name: 'Paper Cup Cold 16oz + Lid', category: 'Packaging', stock: 450, unit: 'Pcs', minStock: 100, costPerUnit: 1200, lastRestocked: '2026-07-28' },

  // Ayam Geprek Inventory
  { id: 'inv_ag_1', entityId: 'ayam_geprek', name: 'Daging Ayam Potong Segar', category: 'Bahan Utama', stock: 35, unit: 'Kg', minStock: 10, costPerUnit: 38000, lastRestocked: '2026-08-07' },
  { id: 'inv_ag_2', entityId: 'ayam_geprek', name: 'Cabai Rawit Merah Mercon', category: 'Bumbu & Sambal', stock: 6.5, unit: 'Kg', minStock: 2.0, costPerUnit: 65000, lastRestocked: '2026-08-06' },
  { id: 'inv_ag_3', entityId: 'ayam_geprek', name: 'Minyak Goreng Kelapa Sawit 2L', category: 'Minyak & Bumbu', stock: 15, unit: 'Pouch', minStock: 5, costPerUnit: 34000, lastRestocked: '2026-08-02' },
  { id: 'inv_ag_4', entityId: 'ayam_geprek', name: 'Beras Premium Cianjur 25kg', category: 'Bahan Utama', stock: 2, unit: 'Karung', minStock: 1, costPerUnit: 375000, lastRestocked: '2026-07-25' }
];
