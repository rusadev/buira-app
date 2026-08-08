export type EntityType = 'tenant_gongja' | 'coffee_shop' | 'ayam_geprek' | 'apotek_buira' | 'properti_buira';

export type BusinessVertical = 'F&B' | 'Apotek' | 'Properti' | 'Retail';

export interface AdditionalFee {
  id: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  isActive: boolean;
  appliesTo: 'ALL' | 'Dine-In' | 'Takeaway' | 'Delivery';
}

export interface CustomerMember {
  id: string;
  entityId: EntityType;
  name: string;
  phone: string;
  email?: string;
  tier: 'Silver' | 'Gold' | 'Platinum';
  points: number;
  totalSpent: number;
  createdAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  value: number;
  minSpend: number;
  isActive: boolean;
}

export interface BusinessEntity {
  id: EntityType;
  ownerId?: string;
  businessType: BusinessVertical;
  name: string;
  tagline: string;
  logo: string;
  primaryColor: string;
  accentColor: string;
  address: string;
  phone: string;
  taxRate: number; // e.g. 0.10 for 10%
  serviceRate: number; // e.g. 0.05 for 5%
  receiptFooterNote?: string;
  printerPaperWidth?: '58mm' | '80mm';
  additionalFees?: AdditionalFee[];
}

export interface RolePermission {
  canAccessPOS: boolean;
  canManageCatalog: boolean;
  canAccessKDS: boolean;
  canManageTables: boolean;
  canManageInventory: boolean;
  canManageStaff: boolean;
  canViewReports: boolean;
  canVoidOrders: boolean;
  canManageSettings: boolean;
}

export interface CustomRole {
  id: string;
  entityId: EntityType;
  name: string;
  description: string;
  permissions: RolePermission;
  isSystemRole?: boolean;
}

export type UserRole = 
  | 'SuperAdmin' 
  | 'Owner' 
  | 'Manager' 
  | 'Kasir' 
  | 'Barista' 
  | 'Kitchen' 
  | string;

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  pinCode?: string; // 4-Digit Security PIN for Shift Open/Close & Void operations
  role: UserRole;
  customRoleId?: string;
  tenantId: EntityType;
  allowedTenantIds: EntityType[];
  avatar: string;
}

export interface AuditLog {
  id: string;
  entityId: EntityType;
  timestamp: string;
  action: 'OPEN_SHIFT' | 'CLOSE_SHIFT' | 'CREATE_ORDER' | 'VOID_ORDER' | 'SETTINGS_UPDATE' | 'LOGIN' | 'LOGOUT';
  actorName: string;
  actorRole: string;
  details: string;
  severity?: 'INFO' | 'WARNING' | 'CRITICAL';
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
  discountPercentage?: number; // e.g. 10 = 10% off
  promoTag?: string; // e.g. 'BUY 1 GET 1', 'FLASH SALE', 'PROMO SPESIAL'
  isPromoActive?: boolean;
  isBestSeller?: boolean;
  isRecommended?: boolean;
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

export type PaymentMethod = 'Cash' | 'QRIS' | 'Transfer' | 'Debit' | 'Credit' | 'E-Wallet';

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
  voidReason?: string;
  voidedAt?: string;
  voidedBy?: string;
}

export interface Table {
  id: string;
  entityId: EntityType;
  tableNumber: string;
  capacity: number;
  area?: string; // e.g. 'Indoor Utama', 'VIP Room', 'Outdoor Terrace', 'Lantai 2'
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
