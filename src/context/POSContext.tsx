import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  EntityType, 
  BusinessEntity, 
  UserAccount,
  CustomRole,
  Product, 
  Category, 
  CartItem, 
  Order, 
  Table, 
  InventoryItem, 
  Shift, 
  StockMovement,
  OrderType,
  OrderStatus
} from '../types/pos';
import { INITIAL_BUSINESS_ENTITIES, INITIAL_USER_ACCOUNTS, INITIAL_CUSTOM_ROLES } from '../data/seedData';
import { 
  getStoredProducts, saveStoredProducts,
  getStoredCategories, saveStoredCategories,
  getStoredOrders, saveStoredOrders,
  getStoredTables, saveStoredTables,
  getStoredInventory, saveStoredInventory,
  getStoredShifts, saveStoredShifts,
  getStoredStockMovements, saveStoredStockMovements
} from '../utils/storage';

export type NavTab = 'cashier' | 'catalog' | 'kds' | 'tables' | 'inventory' | 'roles' | 'users' | 'transactions' | 'reports' | 'settings';

interface POSContextType {
  entities: BusinessEntity[];
  currentEntityId: EntityType;
  currentEntity: BusinessEntity;
  updateStoreEntity: (updatedEntity: BusinessEntity) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  
  // POS Focus Mode & Sidebar Collapse State
  isPOSFocusMode: boolean;
  setIsPOSFocusMode: (val: boolean) => void;
  togglePOSFocusMode: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (val: boolean) => void;
  toggleSidebarCollapse: () => void;

  // User Auth, Roles & Permission Management
  currentUser: UserAccount | null;
  users: UserAccount[];
  customRoles: CustomRole[];
  loginAsUser: (userId: string) => void;
  switchTenant: (tenantId: EntityType) => void;
  logout: () => void;
  addUser: (userData: Omit<UserAccount, 'id'>) => void;
  updateUser: (updatedUser: UserAccount) => void;
  deleteUser: (id: string) => void;
  addCustomRole: (roleData: Omit<CustomRole, 'id'>) => void;
  updateCustomRole: (updatedRole: CustomRole) => void;
  deleteCustomRole: (id: string) => void;
  
  // Mobile Hamburger Sidebar Toggle
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  
  // Products & Categories
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  
  // Cart & Cashier
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  updateCartItem: (cartItemId: string, updatedItem: Partial<CartItem>) => void;
  clearCart: () => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  selectedTableNumber: string;
  setSelectedTableNumber: (tbl: string) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  discountPercentage: number;
  setDiscountPercentage: (discount: number) => void;
  cashierName: string;
  setCashierName: (name: string) => void;
  
  // Orders & KDS
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  voidOrder: (orderId: string, voidReason: string, voidedBy?: string) => void;
  
  // Tables
  tables: Table[];
  updateTableStatus: (tableId: string, status: Table['status'], currentOrderId?: string, customerName?: string) => void;
  
  // Inventory
  inventory: InventoryItem[];
  stockMovements: StockMovement[];
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'createdAt'>) => void;
  
  // Shift
  shifts: Shift[];
  activeShift: Shift | null;
  openShift: (cashierName: string, startingCash: number) => void;
  closeShift: (actualEndingCash: number) => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entities, setEntities] = useState<BusinessEntity[]>(() => {
    const stored = localStorage.getItem('majoo_pos_entities');
    if (stored) {
      try { return JSON.parse(stored); } catch { return INITIAL_BUSINESS_ENTITIES; }
    }
    return INITIAL_BUSINESS_ENTITIES;
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const stored = localStorage.getItem('majoo_pos_users');
    if (stored) {
      try { return JSON.parse(stored); } catch { return INITIAL_USER_ACCOUNTS; }
    }
    return INITIAL_USER_ACCOUNTS;
  });

  const [customRoles, setCustomRoles] = useState<CustomRole[]>(() => {
    const stored = localStorage.getItem('majoo_pos_custom_roles');
    if (stored) {
      try { return JSON.parse(stored); } catch { return INITIAL_CUSTOM_ROLES; }
    }
    return INITIAL_CUSTOM_ROLES;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const storedUser = localStorage.getItem('majoo_pos_current_user');
    if (storedUser) {
      try { return JSON.parse(storedUser); } catch { return null; }
    }
    return INITIAL_USER_ACCOUNTS[0];
  });

  const [currentEntityId, setCurrentEntityId] = useState<EntityType>(currentUser?.tenantId || 'coffee_shop');
  const [activeTab, setActiveTab] = useState<NavTab>('cashier');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  // Focus Mode & Sidebar Collapse State
  const [isPOSFocusMode, setIsPOSFocusMode] = useState<boolean>(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(true);

  const currentEntity = entities.find(e => e.id === currentEntityId) || entities[0];

  const togglePOSFocusMode = () => {
    setIsPOSFocusMode(prev => {
      const next = !prev;
      setIsSidebarCollapsed(next);
      return next;
    });
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  // Persistent States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);

  // Cart & Active Cashier State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('Dine-In');
  const [selectedTableNumber, setSelectedTableNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('Pelanggan Umum');
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [cashierName, setCashierName] = useState<string>(currentUser?.name || 'Kasir Utama');

  // Initial Data Load
  useEffect(() => {
    setProducts(getStoredProducts());
    setCategories(getStoredCategories());
    setOrders(getStoredOrders());
    setTables(getStoredTables());
    setInventory(getStoredInventory());
    setShifts(getStoredShifts());
    setStockMovements(getStoredStockMovements());
  }, []);

  const updateStoreEntity = (updatedEntity: BusinessEntity) => {
    const updated = entities.map(e => e.id === updatedEntity.id ? updatedEntity : e);
    setEntities(updated);
    localStorage.setItem('majoo_pos_entities', JSON.stringify(updated));
  };

  const loginAsUser = (userId: string) => {
    const foundUser = users.find(u => u.id === userId) || users[0];
    setCurrentUser(foundUser);
    setCurrentEntityId(foundUser.tenantId);
    setCashierName(foundUser.name);
    setCart([]);
    setSelectedTableNumber('');
    setActiveTab('cashier');
    setIsPOSFocusMode(true);
    setIsSidebarCollapsed(true);
    localStorage.setItem('majoo_pos_current_user', JSON.stringify(foundUser));
  };

  const switchTenant = (tenantId: EntityType) => {
    if (!currentUser) return;
    if (currentUser.role === 'SuperAdmin' || currentUser.allowedTenantIds.includes(tenantId)) {
      setCurrentEntityId(tenantId);
      setCart([]);
      setSelectedTableNumber('');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('majoo_pos_current_user');
  };

  // Staff CRUD
  const addUser = (userData: Omit<UserAccount, 'id'>) => {
    const newUser: UserAccount = {
      ...userData,
      id: `usr_${Date.now()}`
    };
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('majoo_pos_users', JSON.stringify(updated));
  };

  const updateUser = (updatedUser: UserAccount) => {
    const updated = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updated);
    localStorage.setItem('majoo_pos_users', JSON.stringify(updated));
  };

  const deleteUser = (id: string) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    localStorage.setItem('majoo_pos_users', JSON.stringify(updated));
  };

  // Custom Roles & Permission CRUD
  const addCustomRole = (roleData: Omit<CustomRole, 'id'>) => {
    const newRole: CustomRole = {
      ...roleData,
      id: `role_${Date.now()}`
    };
    const updated = [...customRoles, newRole];
    setCustomRoles(updated);
    localStorage.setItem('majoo_pos_custom_roles', JSON.stringify(updated));
  };

  const updateCustomRole = (updatedRole: CustomRole) => {
    const updated = customRoles.map(r => r.id === updatedRole.id ? updatedRole : r);
    setCustomRoles(updated);
    localStorage.setItem('majoo_pos_custom_roles', JSON.stringify(updated));
  };

  const deleteCustomRole = (id: string) => {
    const updated = customRoles.filter(r => r.id !== id);
    setCustomRoles(updated);
    localStorage.setItem('majoo_pos_custom_roles', JSON.stringify(updated));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    saveStoredProducts(updated);
  };

  const updateProduct = (updatedProd: Product) => {
    const updated = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    setProducts(updated);
    saveStoredProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveStoredProducts(updated);
  };

  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat_${Date.now()}`
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    saveStoredCategories(updated);
  };

  const updateCategory = (updatedCat: Category) => {
    const updated = categories.map(c => c.id === updatedCat.id ? updatedCat : c);
    setCategories(updated);
    saveStoredCategories(updated);
  };

  const deleteCategory = (categoryId: string) => {
    const updated = categories.filter(c => c.id !== categoryId);
    setCategories(updated);
    saveStoredCategories(updated);
  };

  // Cart logic
  const addToCart = (newItem: CartItem) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product.id === newItem.product.id &&
        JSON.stringify(item.selectedVariants) === JSON.stringify(newItem.selectedVariants) &&
        (item.notes || '') === (newItem.notes || '')
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const updatedQty = updated[existingIndex].quantity + newItem.quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updatedQty,
          totalPrice: updated[existingIndex].unitPrice * updatedQty
        };
        return updated;
      }

      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === cartItemId) {
        return {
          ...item,
          quantity,
          totalPrice: item.unitPrice * quantity
        };
      }
      return item;
    }));
  };

  const updateCartItem = (cartItemId: string, updatedItem: Partial<CartItem>) => {
    setCart(prev => prev.map(item => {
      if (item.id === cartItemId) {
        const newItem = { ...item, ...updatedItem };
        return {
          ...newItem,
          totalPrice: newItem.unitPrice * newItem.quantity
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Orders logic
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);

    // Deduct Product Stock
    const updatedProducts = products.map(prod => {
      const cartItemsForProd = newOrder.items.filter(i => i.product.id === prod.id);
      if (cartItemsForProd.length > 0) {
        const totalQtySold = cartItemsForProd.reduce((sum, item) => sum + item.quantity, 0);
        return {
          ...prod,
          stock: Math.max(0, prod.stock - totalQtySold)
        };
      }
      return prod;
    });
    setProducts(updatedProducts);
    saveStoredProducts(updatedProducts);

    // Update Table status if Dine-In
    if (newOrder.orderType === 'Dine-In' && newOrder.tableNumber) {
      const tableToUpdate = tables.find(t => t.tableNumber === newOrder.tableNumber && t.entityId === newOrder.entityId);
      if (tableToUpdate) {
        updateTableStatus(tableToUpdate.id, 'Occupied', newOrder.id, newOrder.customerName);
      }
    }

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status };
      }
      return o;
    });
    setOrders(updated);
    saveStoredOrders(updated);

    if (status === 'Served' || status === 'Completed' || status === 'Cancelled') {
      const order = orders.find(o => o.id === orderId);
      if (order && order.tableNumber) {
        const tableToFree = tables.find(t => t.tableNumber === order.tableNumber && t.entityId === order.entityId);
        if (tableToFree) {
          updateTableStatus(tableToFree.id, 'Available');
        }
      }
    }
  };

  const voidOrder = (orderId: string, voidReason: string, voidedBy?: string) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { 
          ...o, 
          status: 'Cancelled' as OrderStatus,
          voidReason,
          voidedAt: new Date().toISOString(),
          voidedBy: voidedBy || cashierName
        };
      }
      return o;
    });
    setOrders(updated);
    saveStoredOrders(updated);

    // Free table if associated with this order
    const order = orders.find(o => o.id === orderId);
    if (order && order.tableNumber) {
      const tableToFree = tables.find(t => t.tableNumber === order.tableNumber && t.entityId === order.entityId);
      if (tableToFree) {
        updateTableStatus(tableToFree.id, 'Available');
      }
    }
  };

  // Table management
  const updateTableStatus = (tableId: string, status: Table['status'], currentOrderId?: string, customerName?: string) => {
    const updated = tables.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status,
          currentOrderId: status === 'Available' ? undefined : currentOrderId || t.currentOrderId,
          customerName: status === 'Available' ? undefined : customerName || t.customerName
        };
      }
      return t;
    });
    setTables(updated);
    saveStoredTables(updated);
  };

  // Inventory logic
  const addStockMovement = (movementData: Omit<StockMovement, 'id' | 'createdAt'>) => {
    const newMovement: StockMovement = {
      ...movementData,
      id: `mov_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updatedMovements = [newMovement, ...stockMovements];
    setStockMovements(updatedMovements);
    saveStoredStockMovements(updatedMovements);

    const updatedInv = inventory.map(item => {
      if (item.id === movementData.inventoryItemId) {
        const delta = movementData.type === 'IN' ? movementData.quantity : -movementData.quantity;
        return {
          ...item,
          stock: Math.max(0, item.stock + delta),
          lastRestocked: movementData.type === 'IN' ? new Date().toISOString().split('T')[0] : item.lastRestocked
        };
      }
      return item;
    });
    setInventory(updatedInv);
    saveStoredInventory(updatedInv);
  };

  // Shift management
  const activeShift = shifts.find(s => s.entityId === currentEntityId && s.status === 'OPEN') || null;

  const openShift = (cashierNameInput: string, startingCash: number) => {
    const newShift: Shift = {
      id: `shift_${Date.now()}`,
      entityId: currentEntityId,
      cashierName: cashierNameInput,
      startTime: new Date().toISOString(),
      startingCash,
      expectedEndingCash: startingCash,
      status: 'OPEN',
      totalTransactionsCount: 0,
      totalCashSales: 0,
      totalQrisSales: 0,
      totalCardSales: 0
    };
    const updated = [newShift, ...shifts];
    setShifts(updated);
    saveStoredShifts(updated);
    setCashierName(cashierNameInput);
  };

  const closeShift = (actualEndingCash: number) => {
    if (!activeShift) return;

    const shiftOrders = orders.filter(o => 
      o.entityId === currentEntityId && 
      new Date(o.createdAt) >= new Date(activeShift.startTime)
    );

    const totalCashSales = shiftOrders.filter(o => o.paymentMethod === 'Cash').reduce((sum, o) => sum + o.grandTotal, 0);
    const totalQrisSales = shiftOrders.filter(o => o.paymentMethod === 'QRIS' || o.paymentMethod === 'E-Wallet').reduce((sum, o) => sum + o.grandTotal, 0);
    const totalCardSales = shiftOrders.filter(o => o.paymentMethod === 'Debit' || o.paymentMethod === 'Credit').reduce((sum, o) => sum + o.grandTotal, 0);

    const expectedEndingCash = activeShift.startingCash + totalCashSales;
    const cashDifference = actualEndingCash - expectedEndingCash;

    const closedShift: Shift = {
      ...activeShift,
      endTime: new Date().toISOString(),
      expectedEndingCash,
      actualEndingCash,
      cashDifference,
      status: 'CLOSED',
      totalTransactionsCount: shiftOrders.length,
      totalCashSales,
      totalQrisSales,
      totalCardSales
    };

    const updated = shifts.map(s => s.id === activeShift.id ? closedShift : s);
    setShifts(updated);
    saveStoredShifts(updated);
  };

  return (
    <POSContext.Provider value={{
      entities,
      currentEntityId,
      currentEntity,
      updateStoreEntity,
      activeTab,
      setActiveTab,
      
      isPOSFocusMode,
      setIsPOSFocusMode,
      togglePOSFocusMode,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      toggleSidebarCollapse,

      currentUser,
      users,
      customRoles,
      loginAsUser,
      switchTenant,
      logout,
      addUser,
      updateUser,
      deleteUser,
      addCustomRole,
      updateCustomRole,
      deleteCustomRole,
      
      isSidebarOpen,
      setIsSidebarOpen,
      toggleSidebar,
      
      products,
      categories,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      updateCartItem,
      clearCart,
      orderType,
      setOrderType,
      selectedTableNumber,
      setSelectedTableNumber,
      customerName,
      setCustomerName,
      discountPercentage,
      setDiscountPercentage,
      cashierName,
      setCashierName,
      
      orders,
      createOrder,
      updateOrderStatus,
      voidOrder,
      
      tables,
      updateTableStatus,
      
      inventory,
      stockMovements,
      addStockMovement,
      
      shifts,
      activeShift,
      openShift,
      closeShift
    }}>
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) throw new Error('usePOS must be used within a POSProvider');
  return context;
};
