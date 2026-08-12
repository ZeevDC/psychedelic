import React, { useState, useMemo } from 'react';
import { Sale, Expense, Product, PayrollRecord, User } from '../types';
import { formatCurrency, formatDate, exportToCSV } from '../utils/export';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  FileSpreadsheet, 
  Filter, 
  Download, 
  Printer, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  PieChart as PieIcon, 
  Tag, 
  CreditCard, 
  RefreshCw, 
  Sparkles,
  Layers,
  Check,
  X,
  FileText
} from 'lucide-react';

interface CustomReportsViewProps {
  sales: Sale[];
  expenses: Expense[];
  products: Product[];
  payrollRecords: PayrollRecord[];
  users: User[];
}

const COLORS = ['#8B5CF6', '#A855F7', '#C084FC', '#E879F9', '#F472B6', '#38BDF8', '#34D399', '#FBBF24'];

export const CustomReportsView: React.FC<CustomReportsViewProps> = ({
  sales,
  expenses,
  products,
  payrollRecords,
  users
}) => {
  // Filter States
  const [dateRangePreset, setDateRangePreset] = useState<'all' | 'today' | '7days' | 'thisMonth' | 'lastMonth' | 'custom'>('thisMonth');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedExpenseType, setSelectedExpenseType] = useState<string>('All');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('All');
  const [selectedStaff, setSelectedStaff] = useState<string>('All');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');

  // Print Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const expenseCategories = useMemo(() => {
    const cats = new Set(expenses.map(e => e.category));
    return ['All', ...Array.from(cats)];
  }, [expenses]);

  const paymentMethods = ['All', 'GCash', 'Maya', 'Bank Transfer', 'Credit Card', 'Petty Cash', 'Shopee/Lazada'];

  // Reset Filters
  const handleResetFilters = () => {
    setDateRangePreset('all');
    setStartDate('');
    setEndDate('');
    setSelectedCategory('All');
    setSelectedExpenseType('All');
    setSelectedPaymentMethod('All');
    setSelectedStaff('All');
    setMinAmount('');
    setMaxAmount('');
  };

  // Helper date checker
  const isDateInRange = (dateStr: string) => {
    if (dateRangePreset === 'all') return true;
    
    const d = new Date(dateStr);
    const now = new Date();

    if (dateRangePreset === 'today') {
      const todayStr = now.toISOString().split('T')[0];
      return dateStr === todayStr;
    }
    if (dateRangePreset === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return d >= sevenDaysAgo;
    }
    if (dateRangePreset === 'thisMonth') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    if (dateRangePreset === 'lastMonth') {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
    }
    if (dateRangePreset === 'custom') {
      if (startDate && d < new Date(startDate)) return false;
      if (endDate && d > new Date(endDate + 'T23:59:59')) return false;
      return true;
    }
    return true;
  };

  // Filter Sales
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      if (!isDateInRange(s.date)) return false;
      if (selectedPaymentMethod !== 'All' && s.paymentMethod !== selectedPaymentMethod) return false;
      if (selectedStaff !== 'All' && s.loggedByUserId !== selectedStaff) return false;
      if (minAmount && s.totalAmount < parseFloat(minAmount)) return false;
      if (maxAmount && s.totalAmount > parseFloat(maxAmount)) return false;

      // Category filter check inside sale items
      if (selectedCategory !== 'All') {
        const hasMatchingCategory = s.items.some(item => {
          const prod = products.find(p => p.id === item.productId);
          return prod && prod.category === selectedCategory;
        });
        if (!hasMatchingCategory) return false;
      }

      return true;
    });
  }, [sales, products, dateRangePreset, startDate, endDate, selectedPaymentMethod, selectedStaff, minAmount, maxAmount, selectedCategory]);

  // Filter Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      if (!isDateInRange(e.date)) return false;
      if (selectedExpenseType !== 'All' && e.category !== selectedExpenseType) return false;
      if (selectedPaymentMethod !== 'All' && e.paymentMethod !== selectedPaymentMethod) return false;
      if (minAmount && e.amount < parseFloat(minAmount)) return false;
      if (maxAmount && e.amount > parseFloat(maxAmount)) return false;
      return true;
    });
  }, [expenses, dateRangePreset, startDate, endDate, selectedExpenseType, selectedPaymentMethod, minAmount, maxAmount]);

  // Filter Payroll
  const filteredPayroll = useMemo(() => {
    return payrollRecords.filter(p => {
      if (selectedStaff !== 'All' && p.userId !== selectedStaff) return false;
      return true;
    });
  }, [payrollRecords, selectedStaff]);

  // Financial Calculations
  const totalFilteredRevenue = useMemo(() => {
    return filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
  }, [filteredSales]);

  const totalFilteredCostOfGoods = useMemo(() => {
    return filteredSales.reduce((sum, s) => {
      const cogs = s.items.reduce((itemSum, item) => {
        const prod = products.find(p => p.id === item.productId);
        const baseCost = prod ? prod.basePrice : item.unitPrice * 0.4;
        return itemSum + (baseCost * item.quantity);
      }, 0);
      return sum + cogs;
    }, 0);
  }, [filteredSales, products]);

  const totalFilteredExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const totalFilteredPayrollReleased = useMemo(() => {
    return filteredPayroll
      .filter(p => p.status === 'Released')
      .reduce((sum, p) => sum + p.netSalary, 0);
  }, [filteredPayroll]);

  const grossProfit = totalFilteredRevenue - totalFilteredCostOfGoods;
  const netOperatingProfit = grossProfit - totalFilteredExpenses - totalFilteredPayrollReleased;
  const netProfitMargin = totalFilteredRevenue > 0 ? (netOperatingProfit / totalFilteredRevenue) * 100 : 0;
  const averageOrderValue = filteredSales.length > 0 ? totalFilteredRevenue / filteredSales.length : 0;

  // Chart Data Preparation: Payment Methods
  const paymentMethodPieData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredSales.forEach(s => {
      map[s.paymentMethod] = (map[s.paymentMethod] || 0) + s.totalAmount;
    });
    return Object.keys(map).map(pm => ({ name: pm, value: map[pm] }));
  }, [filteredSales]);

  // Chart Data Preparation: Category Sales
  const categorySalesPieData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredSales.forEach(s => {
      s.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        const cat = prod ? prod.category : 'General';
        map[cat] = (map[cat] || 0) + item.totalPrice;
      });
    });
    return Object.keys(map).map(cat => ({ name: cat, value: map[cat] }));
  }, [filteredSales, products]);

  // Expense Breakdown Pie Data
  const expenseCategoryPieData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredExpenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.keys(map).map(cat => ({ name: cat, value: map[cat] }));
  }, [filteredExpenses]);

  // Export Custom Report
  const handleExportCSV = () => {
    const combinedData = [
      ...filteredSales.map(s => ({
        Type: 'Sales Order',
        Reference: s.saleNumber,
        Date: s.date,
        Category_Channel: s.paymentMethod,
        Amount_PHP: s.totalAmount,
        Profit_PHP: s.profit,
        Logged_By: s.loggedByName,
        Notes: s.customerName
      })),
      ...filteredExpenses.map(e => ({
        Type: 'Expense',
        Reference: e.title,
        Date: e.date,
        Category_Channel: e.category,
        Amount_PHP: -e.amount,
        Profit_PHP: -e.amount,
        Logged_By: e.recordedBy,
        Notes: e.notes || ''
      }))
    ];

    exportToCSV(combinedData, `Lilac_Dream_Custom_Report_${new Date().toISOString().split('T')[0]}`, [
      { key: 'Type', label: 'Record Type' },
      { key: 'Reference', label: 'Reference / Title' },
      { key: 'Date', label: 'Date' },
      { key: 'Category_Channel', label: 'Category / Channel' },
      { key: 'Amount_PHP', label: 'Amount (PHP)' },
      { key: 'Profit_PHP', label: 'Profit / Cost (PHP)' },
      { key: 'Logged_By', label: 'Recorded By' },
      { key: 'Notes', label: 'Notes' }
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md p-5 rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold text-purple-950 dark:text-purple-100">
              Dynamic Sales & Financials Reporting Engine
            </h2>
          </div>
          <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-0.5">
            Filter multi-dimensional revenue, product categories, expense channels, and payment gateways in Philippine settings (PHP ₱).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-3 py-2 rounded-2xl bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 text-purple-800 dark:text-purple-200 font-semibold text-xs flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Executive PDF</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 font-semibold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Report (CSV)</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC FILTER BAR PANEL */}
      <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md border border-purple-100 dark:border-purple-900/50 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/40 pb-3">
          <div className="flex items-center gap-2 font-bold text-xs text-purple-950 dark:text-purple-100">
            <Filter className="w-4 h-4 text-purple-600" />
            <span>Multi-Criteria Filtering Toolbar</span>
          </div>

          <button
            onClick={handleResetFilters}
            className="text-[11px] font-semibold text-purple-600 hover:text-purple-800 dark:text-purple-400 flex items-center gap-1 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          
          {/* Date Presets */}
          <div>
            <label className="block text-[11px] font-semibold text-purple-900 dark:text-purple-200 mb-1">
              Date Period
            </label>
            <select
              value={dateRangePreset}
              onChange={(e: any) => setDateRangePreset(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 outline-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {/* Product Category */}
          <div>
            <label className="block text-[11px] font-semibold text-purple-900 dark:text-purple-200 mb-1">
              Product Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 outline-none"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Expense Type */}
          <div>
            <label className="block text-[11px] font-semibold text-purple-900 dark:text-purple-200 mb-1">
              Expense Type
            </label>
            <select
              value={selectedExpenseType}
              onChange={(e) => setSelectedExpenseType(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 outline-none"
            >
              {expenseCategories.map(ec => (
                <option key={ec} value={ec}>{ec}</option>
              ))}
            </select>
          </div>

          {/* Payment Method / Channel */}
          <div>
            <label className="block text-[11px] font-semibold text-purple-900 dark:text-purple-200 mb-1">
              Payment Gateway
            </label>
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 outline-none"
            >
              {paymentMethods.map(pm => (
                <option key={pm} value={pm}>{pm}</option>
              ))}
            </select>
          </div>

          {/* Staff Member */}
          <div>
            <label className="block text-[11px] font-semibold text-purple-900 dark:text-purple-200 mb-1">
              Sales Staff / User
            </label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 outline-none"
            >
              <option value="All">All Staff Members</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* Amount Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-purple-900 dark:text-purple-200 mb-1">
              Amount Range (₱)
            </label>
            <div className="flex gap-1">
              <input
                type="number"
                placeholder="Min ₱"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="w-1/2 px-2 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 text-[11px] outline-none"
              />
              <input
                type="number"
                placeholder="Max ₱"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="w-1/2 px-2 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 text-[11px] outline-none"
              />
            </div>
          </div>

        </div>

        {/* Custom Start / End Date Pickers if selected */}
        {dateRangePreset === 'custom' && (
          <div className="flex items-center gap-3 pt-2 border-t border-purple-100 dark:border-purple-900/30 text-xs">
            <span className="font-semibold text-purple-900 dark:text-purple-200">Custom Date Span:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 outline-none"
            />
            <span className="text-purple-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 outline-none"
            />
          </div>
        )}
      </div>

      {/* FINANCIAL SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-3xl bg-purple-600 text-white shadow-lg shadow-purple-500/20 space-y-1">
          <span className="text-[11px] font-semibold text-purple-100 uppercase tracking-wider block">Filtered Gross Revenue</span>
          <div className="text-2xl font-black font-mono">
            {formatCurrency(totalFilteredRevenue)}
          </div>
          <p className="text-[10px] text-purple-200">{filteredSales.length} Transactions Matched</p>
        </div>

        <div className="p-4 rounded-3xl bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md border border-purple-100 dark:border-purple-900/50 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">Cost of Goods Sold (COGS)</span>
          <div className="text-2xl font-black font-mono text-purple-950 dark:text-purple-100">
            {formatCurrency(totalFilteredCostOfGoods)}
          </div>
          <p className="text-[10px] text-purple-500">Gross Margin: {formatCurrency(grossProfit)}</p>
        </div>

        <div className="p-4 rounded-3xl bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md border border-purple-100 dark:border-purple-900/50 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">OpEx + Released Payroll</span>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
            {formatCurrency(totalFilteredExpenses + totalFilteredPayrollReleased)}
          </div>
          <p className="text-[10px] text-rose-500">{filteredExpenses.length} Expense Logs</p>
        </div>

        <div className="p-4 rounded-3xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 space-y-1">
          <span className="text-[11px] font-semibold text-emerald-100 uppercase tracking-wider block">Net Operating Profit</span>
          <div className="text-2xl font-black font-mono">
            {formatCurrency(netOperatingProfit)}
          </div>
          <p className="text-[10px] text-emerald-100">Net Profit Margin: {netProfitMargin.toFixed(1)}%</p>
        </div>

      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Revenue Distribution */}
        <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md border border-purple-100 dark:border-purple-900/50 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-purple-950 dark:text-purple-100 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-purple-600" />
            Revenue Share by Product Category (PHP ₱)
          </h3>
          <div className="h-64">
            {categorySalesPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySalesPieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  >
                    {categorySalesPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-purple-400">
                No revenue data matching selected criteria.
              </div>
            )}
          </div>
        </div>

        {/* Expense Category Distribution */}
        <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md border border-purple-100 dark:border-purple-900/50 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-purple-950 dark:text-purple-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            Expense Allocation by Type (PHP ₱)
          </h3>
          <div className="h-64">
            {expenseCategoryPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategoryPieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  >
                    {expenseCategoryPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-purple-400">
                No expense logs matching selected criteria.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* DETAILED FILTERED TRANSACTIONS LOG TABLE */}
      <div className="bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
          <h3 className="text-xs font-bold text-purple-950 dark:text-purple-100">
            Filtered Sales Transactions Breakdown ({filteredSales.length})
          </h3>
          <span className="text-[11px] text-purple-500 font-mono">
            Avg Basket Value: {formatCurrency(averageOrderValue)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-purple-50/80 dark:bg-purple-950/60 border-b border-purple-100 dark:border-purple-900/40 text-purple-900 dark:text-purple-200 font-bold">
              <tr>
                <th className="p-3.5">Order No</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5">Items Summary</th>
                <th className="p-3.5">Amount (PHP)</th>
                <th className="p-3.5">Net Profit (PHP)</th>
                <th className="p-3.5">Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100/60 dark:divide-purple-900/30 text-purple-900 dark:text-purple-200">
              {filteredSales.map(s => (
                <tr key={s.id} className="hover:bg-purple-50/40 dark:hover:bg-purple-900/20">
                  <td className="p-3.5 font-bold font-mono text-purple-950 dark:text-purple-100">
                    {s.saleNumber}
                  </td>
                  <td className="p-3.5 text-purple-800 dark:text-purple-200 font-medium">
                    {s.customerName}
                  </td>
                  <td className="p-3.5 font-mono text-purple-500">
                    {s.date}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 font-semibold text-[10px]">
                      {s.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3.5 text-[11px] max-w-xs truncate text-purple-600 dark:text-purple-400">
                    {s.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                  </td>
                  <td className="p-3.5 font-bold font-mono text-purple-950 dark:text-purple-100">
                    {formatCurrency(s.totalAmount)}
                  </td>
                  <td className="p-3.5 font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(s.profit)}
                  </td>
                  <td className="p-3.5 text-purple-500">
                    {s.loggedByName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINTABLE PDF REPORT MODAL */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/50 backdrop-blur-md animate-fade-in print:p-0 print:bg-white">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#1A112E] rounded-3xl border border-purple-100 dark:border-purple-800 shadow-2xl p-6 md:p-8 overflow-hidden print:border-none print:shadow-none print:w-full">
            
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/60 pb-3 mb-4 print:hidden">
              <h3 className="text-sm font-bold text-purple-950 dark:text-purple-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Executive PDF Report Preview
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" /> Print / Export PDF
                </button>
                <button onClick={() => setIsPrintModalOpen(false)} className="p-1 text-purple-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Report Content */}
            <div className="space-y-4 text-xs">
              <div className="border-b border-purple-200 pb-3 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black text-purple-950 tracking-tight">LILAC DREAM ESSENTIALS</h2>
                  <p className="text-purple-600 font-medium">Custom Sales & Financial Performance Report</p>
                  <p className="text-[10px] text-purple-400 mt-1">Generated: {new Date().toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
                    CURRENCY: PHILIPPINE PESO (PHP ₱)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-purple-50 rounded-xl">
                <div>
                  <span className="text-[10px] text-purple-500 font-bold uppercase">Report Period:</span>
                  <div className="font-bold text-purple-900 capitalize">{dateRangePreset} ({startDate || 'Start'} to {endDate || 'End'})</div>
                </div>
                <div>
                  <span className="text-[10px] text-purple-500 font-bold uppercase">Active Filters:</span>
                  <div className="font-bold text-purple-900">
                    Category: {selectedCategory} | Payment: {selectedPaymentMethod}
                  </div>
                </div>
              </div>

              {/* Table Metrics */}
              <table className="w-full text-left border-collapse border border-purple-200">
                <thead>
                  <tr className="bg-purple-100 text-purple-900 font-bold">
                    <th className="p-2 border border-purple-200">Financial Metric</th>
                    <th className="p-2 border border-purple-200 text-right">Value (PHP ₱)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-purple-200 font-medium">Gross Revenue (Sales)</td>
                    <td className="p-2 border border-purple-200 text-right font-mono font-bold text-purple-950">{formatCurrency(totalFilteredRevenue)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-purple-200 font-medium">Cost of Goods Sold (COGS)</td>
                    <td className="p-2 border border-purple-200 text-right font-mono">{formatCurrency(totalFilteredCostOfGoods)}</td>
                  </tr>
                  <tr className="bg-purple-50">
                    <td className="p-2 border border-purple-200 font-bold text-purple-900">Gross Margin</td>
                    <td className="p-2 border border-purple-200 text-right font-mono font-bold text-purple-900">{formatCurrency(grossProfit)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-purple-200 font-medium">Operating Expenses (OpEx)</td>
                    <td className="p-2 border border-purple-200 text-right font-mono text-rose-600">-{formatCurrency(totalFilteredExpenses)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-purple-200 font-medium">Disbursed Staff Payroll</td>
                    <td className="p-2 border border-purple-200 text-right font-mono text-rose-600">-{formatCurrency(totalFilteredPayrollReleased)}</td>
                  </tr>
                  <tr className="bg-emerald-100 text-emerald-950">
                    <td className="p-2 border border-purple-200 font-black">NET OPERATING PROFIT</td>
                    <td className="p-2 border border-purple-200 text-right font-mono font-black text-sm">{formatCurrency(netOperatingProfit)}</td>
                  </tr>
                </tbody>
              </table>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
