import type { Product, Category, Order, Table, InventoryItem, Shift, StockMovement } from '../types/pos';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_TABLES, INITIAL_INVENTORY } from '../data/seedData';

const PREFIX = 'majoo_pos_';

export const getStoredProducts = (): Product[] => {
  const data = localStorage.getItem(`${PREFIX}products`);
  if (!data) {
    localStorage.setItem(`${PREFIX}products`, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PRODUCTS;
  }
};

export const saveStoredProducts = (products: Product[]) => {
  localStorage.setItem(`${PREFIX}products`, JSON.stringify(products));
};

export const getStoredCategories = (): Category[] => {
  const data = localStorage.getItem(`${PREFIX}categories`);
  if (!data) {
    localStorage.setItem(`${PREFIX}categories`, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_CATEGORIES;
  }
};

export const saveStoredCategories = (categories: Category[]) => {
  localStorage.setItem(`${PREFIX}categories`, JSON.stringify(categories));
};

export const getStoredOrders = (): Order[] => {
  const data = localStorage.getItem(`${PREFIX}orders`);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveStoredOrders = (orders: Order[]) => {
  localStorage.setItem(`${PREFIX}orders`, JSON.stringify(orders));
};

export const getStoredTables = (): Table[] => {
  const data = localStorage.getItem(`${PREFIX}tables`);
  if (!data) {
    localStorage.setItem(`${PREFIX}tables`, JSON.stringify(INITIAL_TABLES));
    return INITIAL_TABLES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_TABLES;
  }
};

export const saveStoredTables = (tables: Table[]) => {
  localStorage.setItem(`${PREFIX}tables`, JSON.stringify(tables));
};

export const getStoredInventory = (): InventoryItem[] => {
  const data = localStorage.getItem(`${PREFIX}inventory`);
  if (!data) {
    localStorage.setItem(`${PREFIX}inventory`, JSON.stringify(INITIAL_INVENTORY));
    return INITIAL_INVENTORY;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_INVENTORY;
  }
};

export const saveStoredInventory = (inventory: InventoryItem[]) => {
  localStorage.setItem(`${PREFIX}inventory`, JSON.stringify(inventory));
};

export const getStoredShifts = (): Shift[] => {
  const data = localStorage.getItem(`${PREFIX}shifts`);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveStoredShifts = (shifts: Shift[]) => {
  localStorage.setItem(`${PREFIX}shifts`, JSON.stringify(shifts));
};

export const getStoredStockMovements = (): StockMovement[] => {
  const data = localStorage.getItem(`${PREFIX}stock_movements`);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveStoredStockMovements = (movements: StockMovement[]) => {
  localStorage.setItem(`${PREFIX}stock_movements`, JSON.stringify(movements));
};
