export type Role = 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  department?: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  salesVolume?: number;
  dealsClosed?: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  basePrice: number; // Cost price
  retailPrice: number; // Selling price
  stockQuantity: number;
  minStockLevel: number; // Low stock threshold
  supplierName: string;
  supplierContact: string;
  imageUrl?: string;
  tags: string[];
  variants?: string[];
  status: 'active' | 'archived';
  createdAt: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  changeQuantity: number; // +10 or -5
  previousQuantity: number;
  newQuantity: number;
  reason: 'Restock' | 'Sale' | 'Damaged' | 'Return' | 'Audit Adjustment';
  performedBy: string;
  timestamp: string;
  notes?: string;
}

export type ExpenseCategory = 
  | 'Rent & Utilities'
  | 'Inventory Purchase'
  | 'Marketing & Ads'
  | 'Office Supplies'
  | 'Software & Tech'
  | 'Logistics & Shipping'
  | 'Payroll & Benefits'
  | 'Miscellaneous';

export type PaymentMethod = 'Bank Transfer' | 'Petty Cash' | 'GCash' | 'Maya' | 'Credit Card' | 'Shopee/Lazada';

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
  recordedBy: string;
  receiptUrl?: string;
  notes?: string;
}

export type AccountWallet = 'Main Bank Account' | 'Petty Cash' | 'GCash Business' | 'Reserve Vault';

export interface FundTransfer {
  id: string;
  referenceNo: string;
  fromAccount: AccountWallet;
  toAccount: AccountWallet;
  amount: number;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed';
  initiatedBy: string;
  notes?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  saleNumber: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  profit: number;
  paymentMethod: PaymentMethod;
  loggedByUserId: string;
  loggedByName: string;
  date: string; // YYYY-MM-DD format
  timestamp: string;
  notes?: string;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  payPeriod: string; // e.g. "July 16 - July 31, 2026"
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  status: 'Released' | 'Unreleased';
  releasedDate?: string;
  releasedBy?: string;
  notes?: string;
}

export interface KPIStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  totalSalesCount: number;
  lowStockItemsCount: number;
  pendingPayrollCount: number;
  pendingTransfersCount: number;
}

export interface SalesPerformance {
  userId: string;
  userName: string;
  userRole: Role;
  totalSalesVolume: number;
  totalRevenue: number;
  dealsClosed: number;
  avgDealValue: number;
}

export interface DomainRecord {
  id: string;
  domainName: string;
  expiryDate: string;
  connectedEmail: string;
  premiumsUsed: string; // custom text inserted by user
  registrar?: string;
  autoRenew?: boolean;
  status: 'Active' | 'Expiring Soon' | 'Expired';
  notes?: string;
}

export interface AccountProfileRecord {
  id: string;
  service: 'Netflix' | 'Disney+' | 'HBO Max' | 'Prime Video' | 'Paramount+' | 'Spotify' | string;
  accountEmail: string;
  profileName: string; // e.g. "Profile 1", "Kids", "John"
  pinCode?: string;
  assignedUser?: string;
  renewalDate: string;
  slotsAvailable: number;
  slotsTotal: number;
  status: 'Active' | 'Inactive' | 'Expiring Soon' | 'Full';
  notes?: string;
}
