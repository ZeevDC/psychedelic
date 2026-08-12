import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { 
  initialUsers, 
  initialProducts, 
  initialInventoryLogs, 
  initialExpenses, 
  initialFundTransfers, 
  initialSales, 
  initialPayroll 
} from './src/data/mockData';
import { User, Role, Product, InventoryLog, Expense, FundTransfer, Sale, PayrollRecord } from './src/types';

// In-memory persistent database store during application lifecycle (starts from zero as requested)
let usersStore: User[] = [initialUsers[0]]; // Admin user preserved for login
let productsStore: Product[] = [];
let inventoryLogsStore: InventoryLog[] = [];
let expensesStore: Expense[] = [];
let fundTransfersStore: FundTransfer[] = [];
let salesStore: Sale[] = [];
let payrollStore: PayrollRecord[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper calculation for KPIs
  const calculateKPIs = () => {
    const totalRevenue = salesStore.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalExpenses = expensesStore.reduce((sum, e) => sum + e.amount, 0);
    const totalCostOfGoods = salesStore.reduce((sum, s) => {
      const saleCost = s.items.reduce((itemSum, item) => {
        const prod = productsStore.find(p => p.id === item.productId);
        const basePrice = prod ? prod.basePrice : item.unitPrice * 0.4;
        return itemSum + (basePrice * item.quantity);
      }, 0);
      return sum + saleCost;
    }, 0);

    const netProfit = totalRevenue - totalCostOfGoods - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    const lowStockItemsCount = productsStore.filter(p => p.status === 'active' && p.stockQuantity <= p.minStockLevel).length;
    const pendingPayrollCount = payrollStore.filter(p => p.status === 'Unreleased').length;
    const pendingTransfersCount = fundTransfersStore.filter(t => t.status === 'Pending').length;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin: Math.round(profitMargin * 10) / 10,
      totalSalesCount: salesStore.length,
      lowStockItemsCount,
      pendingPayrollCount,
      pendingTransfersCount
    };
  };

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Reset Data API
  app.post('/api/reset', (req, res) => {
    const { mode } = req.body || {};
    if (mode === 'sample') {
      usersStore = [...initialUsers];
      productsStore = [...initialProducts];
      inventoryLogsStore = [...initialInventoryLogs];
      expensesStore = [...initialExpenses];
      fundTransfersStore = [...initialFundTransfers];
      salesStore = [...initialSales];
      payrollStore = [...initialPayroll];
      return res.json({ message: 'Loaded demo sample data successfully.' });
    } else {
      // mode === 'zero' or default
      usersStore = [initialUsers[0]];
      productsStore = [];
      inventoryLogsStore = [];
      expensesStore = [];
      fundTransfersStore = [];
      salesStore = [];
      payrollStore = [];
      return res.json({ message: 'All database records reset to zero (clean slate).' });
    }
  });

  // KPI Dashboard Stats
  app.get('/api/kpi', (_req, res) => {
    res.json(calculateKPIs());
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email } = req.body || {};
      
      if (!email) {
        return res.status(400).json({ error: 'Email address is required.' });
      }

      const user = usersStore.find(u => u.email.toLowerCase() === (email || '').trim().toLowerCase());
      
      if (!user) {
        // If user doesn't exist in store, create a dynamic active user account so registration/login works seamlessly
        const newUser: User = {
          id: `usr_${Date.now()}`,
          name: email.split('@')[0] || 'User',
          email: email.trim(),
          role: 'admin',
          phone: '',
          department: 'Operations',
          status: 'active',
          createdAt: new Date().toISOString(),
          salesVolume: 0,
          dealsClosed: 0
        };
        usersStore.push(newUser);
        return res.json({
          token: `jwt_token_${newUser.id}_${Date.now()}`,
          user: newUser
        });
      }

      if (user.status === 'suspended') {
        return res.status(403).json({ error: 'This account has been suspended by an Administrator.' });
      }

      // Automatically activate pending status if user is logging in
      if (user.status === 'pending') {
        user.status = 'active';
      }

      res.json({
        token: `jwt_token_${user.id}_${Date.now()}`,
        user
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Internal server login error.' });
    }
  });

  // Auth: Register
  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, email, role, phone, department } = req.body || {};

      if (!name || !email) {
        return res.status(400).json({ error: 'Full name and email address are required.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const existing = usersStore.find(u => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        // Update existing user or return existing
        existing.status = 'active';
        if (name) existing.name = name;
        if (phone) existing.phone = phone;
        if (department) existing.department = department;
        if (role) existing.role = role as Role;
        return res.json({
          message: 'Account updated and logged in successfully.',
          user: existing
        });
      }

      const userRole: Role = role === 'staff' ? 'staff' : (role === 'owner' ? 'owner' : 'admin');

      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        role: userRole,
        phone: phone || '',
        department: department || 'General Operations',
        status: 'active', // Active immediately
        createdAt: new Date().toISOString(),
        salesVolume: 0,
        dealsClosed: 0
      };

      usersStore.push(newUser);
      res.status(201).json({
        message: 'Account created successfully! Welcome to Psychedelic Hub.',
        user: newUser
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Internal server registration error.' });
    }
  });

  // Auth: Forgot Password (Simulates sending reset email via Nodemailer / Resend)
  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const user = usersStore.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Security best practice: don't reveal email non-existence, or give clear feedback for demo
      return res.json({ 
        message: `If an account with ${email} exists, a secure password reset link has been dispatched.` 
      });
    }

    const resetToken = `reset_${Math.random().toString(36).substring(2, 10)}`;
    console.log(`[SMTP Email Dispatcher] Password reset link sent to ${email}: https://lilacdream.app/reset-password?token=${resetToken}`);

    res.json({
      message: `Password reset link successfully sent to ${email}! Please check your inbox or spam folder.`,
      resetTokenSimulated: resetToken
    });
  });

  // Users API
  app.get('/api/users', (_req, res) => {
    res.json(usersStore);
  });

  app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const index = usersStore.findIndex(u => u.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    usersStore[index] = { ...usersStore[index], ...req.body };
    res.json(usersStore[index]);
  });

  // Products API
  app.get('/api/products', (_req, res) => {
    res.json(productsStore);
  });

  app.post('/api/products', (req, res) => {
    const { name, category, basePrice, retailPrice, stockQuantity, minStockLevel, supplierName, supplierContact, imageUrl, tags, variants } = req.body;

    if (!name || !category || basePrice === undefined || retailPrice === undefined) {
      return res.status(400).json({ error: 'Name, category, base price, and retail price are required.' });
    }

    const skuPrefix = category.slice(0, 3).toUpperCase();
    const skuNum = String(productsStore.length + 1).padStart(3, '0');
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      sku: `LD-${skuPrefix}-${skuNum}`,
      name,
      category,
      basePrice: Number(basePrice),
      retailPrice: Number(retailPrice),
      stockQuantity: Number(stockQuantity || 0),
      minStockLevel: Number(minStockLevel || 10),
      supplierName: supplierName || 'General Supplier',
      supplierContact: supplierContact || '',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80',
      tags: tags || [],
      variants: variants || [],
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    productsStore.push(newProduct);

    // Initial inventory log
    if (newProduct.stockQuantity > 0) {
      inventoryLogsStore.unshift({
        id: `inv_log_${Date.now()}`,
        productId: newProduct.id,
        productName: newProduct.name,
        sku: newProduct.sku,
        changeQuantity: newProduct.stockQuantity,
        previousQuantity: 0,
        newQuantity: newProduct.stockQuantity,
        reason: 'Restock',
        performedBy: 'System / Added Product',
        timestamp: new Date().toISOString(),
        notes: 'Initial stock entry upon creation'
      });
    }

    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const index = productsStore.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const oldProduct = productsStore[index];
    const updatedProduct = { ...oldProduct, ...req.body };
    productsStore[index] = updatedProduct;

    // Log stock change if stockQuantity explicitly altered
    if (req.body.stockQuantity !== undefined && req.body.stockQuantity !== oldProduct.stockQuantity) {
      const diff = Number(req.body.stockQuantity) - oldProduct.stockQuantity;
      inventoryLogsStore.unshift({
        id: `inv_log_${Date.now()}`,
        productId: updatedProduct.id,
        productName: updatedProduct.name,
        sku: updatedProduct.sku,
        changeQuantity: diff,
        previousQuantity: oldProduct.stockQuantity,
        newQuantity: updatedProduct.stockQuantity,
        reason: req.body.adjustmentReason || 'Audit Adjustment',
        performedBy: req.body.performedBy || 'Admin',
        timestamp: new Date().toISOString(),
        notes: req.body.adjustmentNotes || 'Manual inventory update'
      });
    }

    res.json(updatedProduct);
  });

  // Inventory Logs API
  app.get('/api/inventory/logs', (_req, res) => {
    res.json(inventoryLogsStore);
  });

  app.post('/api/inventory/adjust', (req, res) => {
    const { productId, changeQuantity, reason, performedBy, notes } = req.body;
    const productIndex = productsStore.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const product = productsStore[productIndex];
    const qtyChange = Number(changeQuantity);
    const newQty = Math.max(0, product.stockQuantity + qtyChange);

    productsStore[productIndex].stockQuantity = newQty;

    const log: InventoryLog = {
      id: `inv_log_${Date.now()}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      changeQuantity: qtyChange,
      previousQuantity: product.stockQuantity,
      newQuantity: newQty,
      reason: reason || 'Audit Adjustment',
      performedBy: performedBy || 'Staff',
      timestamp: new Date().toISOString(),
      notes: notes || ''
    };

    inventoryLogsStore.unshift(log);
    res.status(201).json({ log, product: productsStore[productIndex] });
  });

  // Expenses API
  app.get('/api/expenses', (_req, res) => {
    res.json(expensesStore);
  });

  app.post('/api/expenses', (req, res) => {
    const { title, category, amount, paymentMethod, date, recordedBy, receiptUrl, notes } = req.body;

    if (!title || !category || !amount || !paymentMethod) {
      return res.status(400).json({ error: 'Title, category, amount, and payment method are required.' });
    }

    const newExpense: Expense = {
      id: `exp_${Date.now()}`,
      title,
      category,
      amount: Number(amount),
      paymentMethod,
      date: date || new Date().toISOString().split('T')[0],
      recordedBy: recordedBy || 'Staff',
      receiptUrl: receiptUrl || '',
      notes: notes || ''
    };

    expensesStore.unshift(newExpense);
    res.status(201).json(newExpense);
  });

  // Fund Transfers API
  app.get('/api/transfers', (_req, res) => {
    res.json(fundTransfersStore);
  });

  app.post('/api/transfers', (req, res) => {
    const { fromAccount, toAccount, amount, initiatedBy, notes } = req.body;

    if (!fromAccount || !toAccount || !amount) {
      return res.status(400).json({ error: 'Source account, destination account, and amount are required.' });
    }

    if (fromAccount === toAccount) {
      return res.status(400).json({ error: 'Source and destination accounts must be different.' });
    }

    const newTransfer: FundTransfer = {
      id: `ft_${Date.now()}`,
      referenceNo: `TRF-${new Date().getFullYear()}-${String(fundTransfersStore.length + 1).padStart(3, '0')}`,
      fromAccount,
      toAccount,
      amount: Number(amount),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      initiatedBy: initiatedBy || 'Staff',
      notes: notes || ''
    };

    fundTransfersStore.unshift(newTransfer);
    res.status(201).json(newTransfer);
  });

  app.put('/api/transfers/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const index = fundTransfersStore.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Transfer record not found.' });
    }

    fundTransfersStore[index].status = status;
    res.json(fundTransfersStore[index]);
  });

  // Sales API
  app.get('/api/sales', (_req, res) => {
    res.json(salesStore);
  });

  app.post('/api/sales', (req, res) => {
    const { customerName, items, discount, paymentMethod, loggedByUserId, loggedByName, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Sales items are required.' });
    }

    let subtotal = 0;
    let totalProfit = 0;

    const validatedItems = items.map((item: any) => {
      const prod = productsStore.find(p => p.id === item.productId);
      const unitPrice = item.unitPrice || (prod ? prod.retailPrice : 0);
      const baseCost = prod ? prod.basePrice : unitPrice * 0.4;
      const qty = Number(item.quantity || 1);
      const itemTotal = unitPrice * qty;
      
      subtotal += itemTotal;
      totalProfit += (unitPrice - baseCost) * qty;

      // Auto-deduct inventory stock if product found
      if (prod) {
        const prodIdx = productsStore.findIndex(p => p.id === prod.id);
        const oldQty = productsStore[prodIdx].stockQuantity;
        const newQty = Math.max(0, oldQty - qty);
        productsStore[prodIdx].stockQuantity = newQty;

        // Log movement
        inventoryLogsStore.unshift({
          id: `inv_log_${Date.now()}_${prod.id}`,
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          changeQuantity: -qty,
          previousQuantity: oldQty,
          newQuantity: newQty,
          reason: 'Sale',
          performedBy: loggedByName || 'Staff',
          timestamp: new Date().toISOString(),
          notes: `Sales Order #${salesStore.length + 1021}`
        });
      }

      return {
        productId: item.productId,
        productName: item.productName || (prod ? prod.name : 'Custom Item'),
        sku: item.sku || (prod ? prod.sku : 'CUSTOM'),
        quantity: qty,
        unitPrice,
        totalPrice: itemTotal
      };
    });

    const disc = Number(discount || 0);
    const totalAmount = Math.max(0, subtotal - disc);
    const profit = Math.max(0, totalProfit - disc);

    const saleNum = `SAL-${salesStore.length + 1021}`;
    const newSale: Sale = {
      id: `sal_${Date.now()}`,
      saleNumber: saleNum,
      customerName: customerName || 'Walk-in Customer',
      items: validatedItems,
      subtotal,
      discount: disc,
      totalAmount,
      profit,
      paymentMethod: paymentMethod || 'Credit Card',
      loggedByUserId: loggedByUserId || 'usr_staff1',
      loggedByName: loggedByName || 'Sofia Rose',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      notes: notes || ''
    };

    salesStore.unshift(newSale);

    // Update logged user sales metrics
    const userIdx = usersStore.findIndex(u => u.id === newSale.loggedByUserId);
    if (userIdx !== -1) {
      usersStore[userIdx].salesVolume = (usersStore[userIdx].salesVolume || 0) + totalAmount;
      usersStore[userIdx].dealsClosed = (usersStore[userIdx].dealsClosed || 0) + 1;
    }

    res.status(201).json(newSale);
  });

  // Payroll API
  app.get('/api/payroll', (_req, res) => {
    res.json(payrollStore);
  });

  app.post('/api/payroll', (req, res) => {
    const { userId, payPeriod, baseSalary, bonuses, deductions, notes } = req.body;
    const user = usersStore.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const base = Number(baseSalary || 0);
    const bon = Number(bonuses || 0);
    const ded = Number(deductions || 0);
    const net = Math.max(0, base + bon - ded);

    const newPayroll: PayrollRecord = {
      id: `pay_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      payPeriod: payPeriod || 'Current Period',
      baseSalary: base,
      bonuses: bon,
      deductions: ded,
      netSalary: net,
      status: 'Unreleased',
      notes: notes || ''
    };

    payrollStore.unshift(newPayroll);
    res.status(201).json(newPayroll);
  });

  app.put('/api/payroll/:id/release', (req, res) => {
    const { id } = req.params;
    const { releasedBy } = req.body;
    const index = payrollStore.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Payroll record not found.' });
    }

    payrollStore[index].status = 'Released';
    payrollStore[index].releasedDate = new Date().toISOString().split('T')[0];
    payrollStore[index].releasedBy = releasedBy || 'Admin';

    res.json(payrollStore[index]);
  });


  // --- VITE / SERVING SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Lilac Dream Server] Server active at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to boot application server:', err);
});
