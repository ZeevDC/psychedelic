import { User, Product, InventoryLog, Expense, FundTransfer, Sale, PayrollRecord } from '../types';

export const initialUsers: User[] = [
  {
    id: 'usr_admin1',
    name: 'Elena Vance',
    email: 'owner@psychedelic.ph',
    role: 'owner',
    phone: '+63 917 234 5678',
    department: 'Executive Owner',
    status: 'active',
    createdAt: '2026-01-10T08:00:00Z',
    salesVolume: 245000.00,
    dealsClosed: 38
  },
  {
    id: 'usr_staff1',
    name: 'Sofia Rose',
    email: 'admin@psychedelic.ph',
    role: 'admin',
    phone: '+63 918 876 5432',
    department: 'Sales & Retail',
    status: 'active',
    createdAt: '2026-02-15T09:30:00Z',
    salesVolume: 185000.50,
    dealsClosed: 42
  },
  {
    id: 'usr_staff2',
    name: 'Liam Sterling',
    email: 'liam@psychedelic.ph',
    role: 'admin',
    phone: '+63 919 345 6789',
    department: 'Inventory & Support',
    status: 'active',
    createdAt: '2026-03-01T10:00:00Z',
    salesVolume: 142000.00,
    dealsClosed: 26
  },
  {
    id: 'usr_staff3',
    name: 'Chloe Bennett',
    email: 'chloe@psychedelic.ph',
    role: 'admin',
    phone: '+63 920 987 6543',
    department: 'Customer Success',
    status: 'pending',
    createdAt: '2026-07-28T14:20:00Z',
    salesVolume: 0,
    dealsClosed: 0
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod_1',
    sku: 'LD-LAV-001',
    name: 'Velvet Lavender Facial Serum',
    category: 'Skincare',
    basePrice: 450.00,
    retailPrice: 1250.00,
    stockQuantity: 48,
    minStockLevel: 15,
    supplierName: 'Aura Botanicals Philippines',
    supplierContact: 'supply@aurabotanicals.ph',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=80',
    tags: ['Best Seller', 'Organic', 'Hydrating'],
    variants: ['30ml Glass Bottle', '50ml Glass Bottle'],
    status: 'active',
    createdAt: '2026-01-15'
  },
  {
    id: 'prod_2',
    sku: 'LD-PER-002',
    name: 'Lilac Dream Eau De Parfum',
    category: 'Fragrance',
    basePrice: 950.00,
    retailPrice: 2450.00,
    stockQuantity: 8, // Low Stock Alert!
    minStockLevel: 12,
    supplierName: 'Provence Essence Labs MNL',
    supplierContact: 'orders@provenceessences.ph',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&auto=format&fit=crop&q=80',
    tags: ['Luxury', 'Floral', 'Long-lasting'],
    variants: ['50ml Spray', '100ml Spray'],
    status: 'active',
    createdAt: '2026-01-20'
  },
  {
    id: 'prod_3',
    sku: 'LD-CND-003',
    name: 'Amethyst Soy Scented Candle',
    category: 'Home Decor',
    basePrice: 280.00,
    retailPrice: 850.00,
    stockQuantity: 62,
    minStockLevel: 20,
    supplierName: 'Artisan Wick & Glow PH',
    supplierContact: 'hello@artisanwick.ph',
    imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&auto=format&fit=crop&q=80',
    tags: ['Handcrafted', 'Relaxation'],
    variants: ['Lavender & Vanilla', 'Wild Lilac & Sage'],
    status: 'active',
    createdAt: '2026-02-01'
  },
  {
    id: 'prod_4',
    sku: 'LD-SLK-004',
    name: 'Pure Mulberry Silk Pillowcase',
    category: 'Apparel & Home',
    basePrice: 650.00,
    retailPrice: 1850.00,
    stockQuantity: 5, // Low Stock Alert!
    minStockLevel: 10,
    supplierName: 'Serene Silk Textiles PH',
    supplierContact: 'sales@serenesilk.ph',
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&auto=format&fit=crop&q=80',
    tags: ['100% Mulberry Silk', 'Anti-frizz'],
    variants: ['Standard Soft Lilac', 'King Soft Lilac'],
    status: 'active',
    createdAt: '2026-02-10'
  },
  {
    id: 'prod_5',
    sku: 'LD-LIP-005',
    name: 'Lilac Dusk Nourishing Lip Balm',
    category: 'Skincare',
    basePrice: 120.00,
    retailPrice: 450.00,
    stockQuantity: 110,
    minStockLevel: 25,
    supplierName: 'Aura Botanicals Philippines',
    supplierContact: 'supply@aurabotanicals.ph',
    imageUrl: 'https://images.unsplash.com/photo-1625101292020-043e6205728a?w=300&auto=format&fit=crop&q=80',
    tags: ['Vegan', 'Shea Butter'],
    variants: ['Tinted Soft Mauve'],
    status: 'active',
    createdAt: '2026-03-05'
  },
  {
    id: 'prod_6',
    sku: 'LD-MSK-006',
    name: 'Calming Violet Clay Face Mask',
    category: 'Skincare',
    basePrice: 350.00,
    retailPrice: 980.00,
    stockQuantity: 3, // Low Stock Alert!
    minStockLevel: 15,
    supplierName: 'Aura Botanicals Philippines',
    supplierContact: 'supply@aurabotanicals.ph',
    imageUrl: 'https://images.unsplash.com/photo-1567928256504-b96877d343b4?w=300&auto=format&fit=crop&q=80',
    tags: ['Detox', 'French Clay'],
    variants: ['100g Jar'],
    status: 'active',
    createdAt: '2026-03-12'
  }
];

export const initialInventoryLogs: InventoryLog[] = [
  {
    id: 'inv_log_1',
    productId: 'prod_1',
    productName: 'Velvet Lavender Facial Serum',
    sku: 'LD-LAV-001',
    changeQuantity: 30,
    previousQuantity: 18,
    newQuantity: 48,
    reason: 'Restock',
    performedBy: 'Liam Sterling',
    timestamp: '2026-07-28T10:15:00Z',
    notes: 'Received batch #LD-889 from Aura Botanicals PH'
  },
  {
    id: 'inv_log_2',
    productId: 'prod_2',
    productName: 'Lilac Dream Eau De Parfum',
    sku: 'LD-PER-002',
    changeQuantity: -4,
    previousQuantity: 12,
    newQuantity: 8,
    reason: 'Sale',
    performedBy: 'Sofia Rose',
    timestamp: '2026-07-29T14:30:00Z',
    notes: 'In-store POS transaction #SAL-1022'
  },
  {
    id: 'inv_log_3',
    productId: 'prod_6',
    productName: 'Calming Violet Clay Face Mask',
    sku: 'LD-MSK-006',
    changeQuantity: -1,
    previousQuantity: 4,
    newQuantity: 3,
    reason: 'Damaged',
    performedBy: 'Elena Vance',
    timestamp: '2026-07-29T16:00:00Z',
    notes: 'Container damaged during display restocking'
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp_1',
    title: 'Boutique Storefront Lease - BGC Taguig',
    category: 'Rent & Utilities',
    amount: 45000.00,
    paymentMethod: 'Bank Transfer',
    date: '2026-07-01',
    recordedBy: 'Elena Vance',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&auto=format&fit=crop&q=80',
    notes: 'Monthly commercial lease for Lilac Dream BGC flagship store'
  },
  {
    id: 'exp_2',
    title: 'Facebook & TikTok Ad Campaign PH',
    category: 'Marketing & Ads',
    amount: 15500.00,
    paymentMethod: 'Credit Card',
    date: '2026-07-10',
    recordedBy: 'Sofia Rose',
    notes: 'Payday sale promotion campaign'
  },
  {
    id: 'exp_3',
    title: 'Restock Batch - Aura Botanicals PH',
    category: 'Inventory Purchase',
    amount: 28500.00,
    paymentMethod: 'Bank Transfer',
    date: '2026-07-18',
    recordedBy: 'Liam Sterling',
    notes: 'PO #889 for Velvet Serums and Lip Balms'
  },
  {
    id: 'exp_4',
    title: 'Packaging & Custom Eco Boxes',
    category: 'Office Supplies',
    amount: 6800.00,
    paymentMethod: 'GCash',
    date: '2026-07-22',
    recordedBy: 'Sofia Rose',
    notes: '500 custom eco-friendly lilac shipping boxes'
  }
];

export const initialFundTransfers: FundTransfer[] = [
  {
    id: 'ft_1',
    referenceNo: 'TRF-2026-001',
    fromAccount: 'Main Bank Account',
    toAccount: 'Petty Cash',
    amount: 15000.00,
    date: '2026-07-05',
    status: 'Completed',
    initiatedBy: 'Elena Vance',
    notes: 'Monthly petty cash replenishment for store operations'
  },
  {
    id: 'ft_2',
    referenceNo: 'TRF-2026-002',
    fromAccount: 'GCash Business',
    toAccount: 'Main Bank Account',
    amount: 48500.00,
    date: '2026-07-20',
    status: 'Completed',
    initiatedBy: 'Sofia Rose',
    notes: 'Weekly GCash digital sales payout sweep'
  },
  {
    id: 'ft_3',
    referenceNo: 'TRF-2026-003',
    fromAccount: 'Main Bank Account',
    toAccount: 'Reserve Vault',
    amount: 80000.00,
    date: '2026-07-28',
    status: 'Pending',
    initiatedBy: 'Elena Vance',
    notes: 'Quarterly emergency reserve allocation'
  }
];

export const initialSales: Sale[] = [
  {
    id: 'sal_101',
    saleNumber: 'SAL-1020',
    customerName: 'Aria Montgomery',
    items: [
      { productId: 'prod_1', productName: 'Velvet Lavender Facial Serum', sku: 'LD-LAV-001', quantity: 2, unitPrice: 1250.00, totalPrice: 2500.00 },
      { productId: 'prod_3', productName: 'Amethyst Soy Scented Candle', sku: 'LD-CND-003', quantity: 1, unitPrice: 850.00, totalPrice: 850.00 }
    ],
    subtotal: 3350.00,
    discount: 350.00,
    totalAmount: 3000.00,
    profit: 1820.00,
    paymentMethod: 'GCash',
    loggedByUserId: 'usr_staff1',
    loggedByName: 'Sofia Rose',
    date: '2026-07-25',
    timestamp: '2026-07-25T11:20:00Z',
    notes: 'VIP Customer promo discount applied'
  },
  {
    id: 'sal_102',
    saleNumber: 'SAL-1021',
    customerName: 'Marcus Vance',
    items: [
      { productId: 'prod_2', productName: 'Lilac Dream Eau De Parfum', sku: 'LD-PER-002', quantity: 1, unitPrice: 2450.00, totalPrice: 2450.00 },
      { productId: 'prod_4', productName: 'Pure Mulberry Silk Pillowcase', sku: 'LD-SLK-004', quantity: 1, unitPrice: 1850.00, totalPrice: 1850.00 }
    ],
    subtotal: 4300.00,
    discount: 0,
    totalAmount: 4300.00,
    profit: 2700.00,
    paymentMethod: 'Maya',
    loggedByUserId: 'usr_admin1',
    loggedByName: 'Elena Vance',
    date: '2026-07-27',
    timestamp: '2026-07-27T15:45:00Z'
  },
  {
    id: 'sal_103',
    saleNumber: 'SAL-1022',
    customerName: 'Hannah Marin',
    items: [
      { productId: 'prod_1', productName: 'Velvet Lavender Facial Serum', sku: 'LD-LAV-001', quantity: 1, unitPrice: 1250.00, totalPrice: 1250.00 },
      { productId: 'prod_5', productName: 'Lilac Dusk Nourishing Lip Balm', sku: 'LD-LIP-005', quantity: 3, unitPrice: 450.00, totalPrice: 1350.00 }
    ],
    subtotal: 2600.00,
    discount: 100.00,
    totalAmount: 2500.00,
    profit: 1690.00,
    paymentMethod: 'Bank Transfer',
    loggedByUserId: 'usr_staff1',
    loggedByName: 'Sofia Rose',
    date: '2026-07-29',
    timestamp: '2026-07-29T14:10:00Z'
  },
  {
    id: 'sal_104',
    saleNumber: 'SAL-1023',
    customerName: 'Camila Cabello',
    items: [
      { productId: 'prod_3', productName: 'Amethyst Soy Scented Candle', sku: 'LD-CND-003', quantity: 3, unitPrice: 850.00, totalPrice: 2550.00 }
    ],
    subtotal: 2550.00,
    discount: 0,
    totalAmount: 2550.00,
    profit: 1710.00,
    paymentMethod: 'Shopee/Lazada',
    loggedByUserId: 'usr_staff2',
    loggedByName: 'Liam Sterling',
    date: '2026-07-29',
    timestamp: '2026-07-29T16:30:00Z'
  }
];

export const initialPayroll: PayrollRecord[] = [
  {
    id: 'pay_1',
    userId: 'usr_staff1',
    userName: 'Sofia Rose',
    userRole: 'admin',
    payPeriod: 'July 16 - July 31, 2026',
    baseSalary: 25000.00,
    bonuses: 3500.00, // Sales performance bonus
    deductions: 2100.00,
    netSalary: 26400.00,
    status: 'Unreleased',
    notes: 'Top sales performer bonus included (₱3,500)'
  },
  {
    id: 'pay_2',
    userId: 'usr_staff2',
    userName: 'Liam Sterling',
    userRole: 'admin',
    payPeriod: 'July 16 - July 31, 2026',
    baseSalary: 22000.00,
    bonuses: 1800.00,
    deductions: 1900.00,
    netSalary: 21900.00,
    status: 'Unreleased',
    notes: 'Inventory management bonus included (₱1,800)'
  },
  {
    id: 'pay_3',
    userId: 'usr_admin1',
    userName: 'Elena Vance',
    userRole: 'owner',
    payPeriod: 'July 16 - July 31, 2026',
    baseSalary: 45000.00,
    bonuses: 6000.00,
    deductions: 4200.00,
    netSalary: 46800.00,
    status: 'Released',
    releasedDate: '2026-07-28',
    releasedBy: 'Elena Vance (Self)',
    notes: 'Executive salary payout released via Bank Direct Deposit'
  }
];
