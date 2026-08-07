export type EntityType = 'coffee_shop' | 'ayam_geprek';

export interface BusinessEntity {
  id: EntityType;
  name: string;
  tagline: string;
  logo: string;
  primaryColor: string;
  accentColor: string;
  address: string;
  phone: string;
  taxRate: number; // e.g. 0.10 for 10%
  serviceRate: number; // e.g. 0.05 for 5%
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Manager' | 'Kasir';
  tenantId: EntityType;
  avatar: string;
}

export interface VariantOption {
  id: string;
  name: string;
  priceModifier: number;
}

export interface VariantGroup {
  id: string;
  name: string;
  required: boolean;
  options: VariantOption[];
}

export interface Category {
  id: string;
  entityId: EntityType;
  name: string;
  iconName: string;
  color: string;
}

export interface Product {
  id: string;
  entityId: EntityType;
  name: string;
  categoryId: string;
  sku: string;
  barcode?: string;
  costPrice: number;
  price: number;
  stock: number;
  minStockAlert: number;
  image: string;
  description?: string;
  variantGroups?: VariantGroup[];
  isActive: boolean;
}

export interface SelectedVariant {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  priceModifier: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariants: SelectedVariant[];
  notes?: string;
  unitPrice: number;
  totalPrice: number;
}

export type OrderType = 'Dine-In' | 'Takeaway' | 'Online-Gofood' | 'Online-Grabfood' | 'Online-Shopee';

export type PaymentMethod = 'Cash' | 'QRIS' | 'Debit' | 'Credit' | 'E-Wallet';

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Served' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  entityId: EntityType;
  customerName: string;
  orderType: OrderType;
  tableNumber?: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  discountPercentage: number;
  taxAmount: number;
  serviceAmount: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentAmount: number;
  changeAmount: number;
  status: OrderStatus;
  createdAt: string;
  cashierName: string;
  notes?: string;
}

export interface Table {
  id: string;
  entityId: EntityType;
  tableNumber: string;
  capacity: number;
  status: 'Available' | 'Occupied' | 'Reserved';
  currentOrderId?: string;
  customerName?: string;
}

export interface InventoryItem {
  id: string;
  entityId: EntityType;
  name: string;
  category: string;
  stock: number;
  unit: string;
  minStock: number;
  costPerUnit: number;
  lastRestocked: string;
}

export interface StockMovement {
  id: string;
  entityId: EntityType;
  inventoryItemId: string;
  itemName: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  createdAt: string;
  createdBy: string;
}

export interface Shift {
  id: string;
  entityId: EntityType;
  cashierName: string;
  startTime: string;
  endTime?: string;
  startingCash: number;
  expectedEndingCash: number;
  actualEndingCash?: number;
  cashDifference?: number;
  status: 'OPEN' | 'CLOSED';
  totalTransactionsCount: number;
  totalCashSales: number;
  totalQrisSales: number;
  totalCardSales: number;
}
