import type { Product, Category, Order, Table, InventoryItem, Shift, StockMovement } from '../types/pos';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_TABLES, 
  INITIAL_INVENTORY 
} from '../data/seedData';

const STORAGE_KEYS = {
  PRODUCTS: 'majoo_pos_products_v2',
  CATEGORIES: 'majoo_pos_categories_v2',
  ORDERS: 'majoo_pos_orders_v2',
  TABLES: 'majoo_pos_tables_v2',
  INVENTORY: 'majoo_pos_inventory_v2',
  SHIFTS: 'majoo_pos_shifts_v2',
  STOCK_MOVEMENTS: 'majoo_pos_stock_movements_v2',
};

// Helper: Products
export const getStoredProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!data) {
    saveStoredProducts(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length >= INITIAL_PRODUCTS.length) {
      return parsed;
    }
    // Automatically update local storage with rich initial products
    saveStoredProducts(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  } catch {
    return INITIAL_PRODUCTS;
  }
};

export const saveStoredProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

// Helper: Categories
export const getStoredCategories = (): Category[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (!data) {
    saveStoredCategories(INITIAL_CATEGORIES);
    return INITIAL_CATEGORIES;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CATEGORIES;
  } catch {
    return INITIAL_CATEGORIES;
  }
};

export const saveStoredCategories = (categories: Category[]) => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

// Helper: Orders
export const getStoredOrders = (): Order[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (!data) return [];
  try { return JSON.parse(data); } catch { return []; }
};

export const saveStoredOrders = (orders: Order[]) => {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};

// Helper: Tables
export const getStoredTables = (): Table[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TABLES);
  if (!data) {
    saveStoredTables(INITIAL_TABLES);
    return INITIAL_TABLES;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TABLES;
  } catch {
    return INITIAL_TABLES;
  }
};

export const saveStoredTables = (tables: Table[]) => {
  localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
};

// Helper: Inventory
export const getStoredInventory = (): InventoryItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
  if (!data) {
    saveStoredInventory(INITIAL_INVENTORY);
    return INITIAL_INVENTORY;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_INVENTORY;
  } catch {
    return INITIAL_INVENTORY;
  }
};

export const saveStoredInventory = (inventory: InventoryItem[]) => {
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
};

// Helper: Shifts
export const getStoredShifts = (): Shift[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SHIFTS);
  if (!data) return [];
  try { return JSON.parse(data); } catch { return []; }
};

export const saveStoredShifts = (shifts: Shift[]) => {
  localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
};

// Helper: Stock Movements
export const getStoredStockMovements = (): StockMovement[] => {
  const data = localStorage.getItem(STORAGE_KEYS.STOCK_MOVEMENTS);
  if (!data) return [];
  try { return JSON.parse(data); } catch { return []; }
};

export const saveStoredStockMovements = (movements: StockMovement[]) => {
  localStorage.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, JSON.stringify(movements));
};
