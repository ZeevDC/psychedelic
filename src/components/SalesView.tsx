import React, { useState } from 'react';
import { Sale, Product, User, SalesPerformance } from '../types';
import { formatCurrency, formatDate, exportToCSV } from '../utils/export';
import { 
  TrendingUp, 
  ShoppingBag, 
  Plus, 
  Search, 
  Calendar, 
  Download, 
  Award, 
  Trash2, 
  Check, 
  X, 
  Percent, 
  DollarSign, 
  User as UserIcon,
  Sparkles,
  Trophy
} from 'lucide-react';

interface SalesViewProps {
  sales: Sale[];
  products: Product[];
  users: User[];
  currentUser: User | null;
  onAddSale: (saleData: any) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({
  sales,
  products,
  users,
  currentUser,
  onAddSale
}) => {
  const [subTab, setSubTab] = useState<'saleslog' | 'performance'>('saleslog');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'All' | 'Today' | 'Week' | 'Month'>('Month');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('All');
  const [selectedStaff, setSelectedStaff] = useState<string>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Extract payment methods and staff lists
  const paymentMethodsList = ['All', 'Credit Card', 'GCash', 'Maya', 'Bank Transfer', 'Shopee/Lazada', 'Petty Cash'];
  const staffList = Array.from(new Set(sales.map(s => s.loggedByName))).filter(Boolean);

  // New POS Sale Modal State
  const [isPOSOpen, setIsPOSOpen] = useState(false);
  const [customerName, setCustomerName] = useState('Walk-in Client');
  const [paymentMethod, setPaymentMethod] = useState<any>('GCash');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Cart items
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([]);

  // Filter Sales
  const filteredSales = sales.filter(s => {
    const matchesSearch = s.saleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.loggedByName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    const matchesPay = selectedPaymentMethod === 'All' || s.paymentMethod === selectedPaymentMethod;
    const matchesStaff = selectedStaff === 'All' || s.loggedByName === selectedStaff;

    if (!matchesPay || !matchesStaff) return false;

    let matchesAmount = true;
    if (minAmount && s.totalAmount < parseFloat(minAmount)) matchesAmount = false;
    if (maxAmount && s.totalAmount > parseFloat(maxAmount)) matchesAmount = false;
    if (!matchesAmount) return false;

    if (startDate && s.date < startDate) return false;
    if (endDate && s.date > endDate) return false;

    if (dateFilter === 'Today') {
      const today = new Date().toISOString().split('T')[0];
      return s.date === today;
    } else if (dateFilter === 'Week') {
      const saleDate = new Date(s.date);
      const now = new Date();
      const diffDays = (now.getTime() - saleDate.getTime()) / (1000 * 3600 * 24);
      return diffDays <= 7;
    } else if (dateFilter === 'Month') {
      const saleDate = new Date(s.date);
      const now = new Date();
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const totalFilteredRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalFilteredProfit = filteredSales.reduce((sum, s) => sum + s.profit, 0);

  // Calculate Leaderboard Performance
  const staffPerformance: SalesPerformance[] = users.map(user => {
    const userSales = sales.filter(s => s.loggedByUserId === user.id);
    const totalRevenue = userSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const dealsClosed = userSales.length;
    const avgDealValue = dealsClosed > 0 ? totalRevenue / dealsClosed : 0;

    return {
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      totalSalesVolume: totalRevenue,
      totalRevenue,
      dealsClosed,
      avgDealValue
    };
  }).sort((a, b) => b.totalRevenue - a.totalRevenue);

  // Cart Helper functions
  const addToCart = (product: Product) => {
    const existingIndex = cartItems.findIndex(ci => ci.product.id === product.id);
    if (existingIndex !== -1) {
      const updated = [...cartItems];
      if (updated[existingIndex].quantity < product.stockQuantity) {
        updated[existingIndex].quantity += 1;
        setCartItems(updated);
      }
    } else {
      if (product.stockQuantity > 0) {
        setCartItems([...cartItems, { product, quantity: 1 }]);
      }
    }
  };

  const updateCartQty = (productId: string, delta: number) => {
    const updated = cartItems.map(ci => {
      if (ci.product.id === productId) {
        const newQty = Math.max(1, Math.min(ci.product.stockQuantity, ci.quantity + delta));
        return { ...ci, quantity: newQty };
      }
      return ci;
    });
    setCartItems(updated);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(ci => ci.product.id !== productId));
  };

  const cartSubtotal = cartItems.reduce((sum, ci) => sum + (ci.product.retailPrice * ci.quantity), 0);
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  const handlePOSCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Please add at least one item to the cart.');
      return;
    }

    const items = cartItems.map(ci => ({
      productId: ci.product.id,
      productName: ci.product.name,
      sku: ci.product.sku,
      quantity: ci.quantity,
      unitPrice: ci.product.retailPrice
    }));

    onAddSale({
      customerName,
      items,
      discount: discountAmount,
      paymentMethod,
      loggedByUserId: currentUser ? currentUser.id : 'usr_staff1',
      loggedByName: currentUser ? currentUser.name : 'Sofia Rose',
      notes
    });

    setIsPOSOpen(false);
    setCartItems([]);
    setDiscountAmount(0);
    setNotes('');
  };

  const handleExportCSV = () => {
    exportToCSV(filteredSales, 'Sales_Log', [
      { key: 'saleNumber', label: 'Sale Order #' },
      { key: 'date', label: 'Date' },
      { key: 'customerName', label: 'Customer' },
      { key: 'subtotal', label: 'Subtotal ($)' },
      { key: 'discount', label: 'Discount ($)' },
      { key: 'totalAmount', label: 'Total Paid ($)' },
      { key: 'profit', label: 'Net Profit ($)' },
      { key: 'paymentMethod', label: 'Payment Method' },
      { key: 'loggedByName', label: 'Logged By' }
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg sm:text-xl font-extrabold sm:font-bold text-purple-950 dark:text-purple-100">
              Sales Logging & Staff Analytics
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-purple-600/70 dark:text-purple-400/70 mt-0.5">
            Log point-of-sale transactions, view revenue metrics, and evaluate team sales leaderboards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Subtabs */}
          <div className="flex bg-purple-50 dark:bg-purple-950/60 p-1 rounded-xl sm:rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
            <button
              onClick={() => setSubTab('saleslog')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
                subTab === 'saleslog' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-700 dark:text-purple-300'
              }`}
            >
              Sales Log
            </button>
            <button
              onClick={() => setSubTab('performance')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
                subTab === 'performance' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-700 dark:text-purple-300'
              }`}
            >
              Staff Performance
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 hover:bg-purple-200 text-xs font-semibold transition-all"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => setIsPOSOpen(true)}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 font-semibold text-[11px] sm:text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>+ POS New Sale</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: Sales Log */}
      {subTab === 'saleslog' && (
        <div className="space-y-4">
          
          {/* Summary Box & Date Range Selector */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/60 dark:bg-[#1A112E]/60 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/40">
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-purple-600 dark:text-purple-400 font-medium">Revenue Total: </span>
                <span className="font-bold text-purple-950 dark:text-purple-100 text-sm font-mono">
                  {formatCurrency(totalFilteredRevenue)}
                </span>
              </div>
              <div className="border-l border-purple-200 pl-4">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Profit Earned: </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm font-mono">
                  +{formatCurrency(totalFilteredProfit)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Date Filters */}
              <div className="flex bg-purple-100 dark:bg-purple-900/60 p-1 rounded-xl text-xs font-semibold">
                {(['All', 'Today', 'Week', 'Month'] as const).map(df => (
                  <button
                    key={df}
                    onClick={() => setDateFilter(df)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      dateFilter === df ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-800 dark:text-purple-200'
                    }`}
                  >
                    {df}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search order # or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-xs text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sales Table */}
          <div className="bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-purple-50/80 dark:bg-purple-950/60 border-b border-purple-100 dark:border-purple-900/40 text-purple-900 dark:text-purple-200 font-bold">
                  <tr>
                    <th className="p-4">Sale # & Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items Purchased</th>
                    <th className="p-4">Total Paid</th>
                    <th className="p-4">Net Profit</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Logged By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100/60 dark:divide-purple-900/30 text-purple-900 dark:text-purple-200">
                  {filteredSales.map(s => (
                    <tr key={s.id} className="hover:bg-purple-50/40 dark:hover:bg-purple-900/20">
                      <td className="p-4">
                        <div className="font-bold text-purple-950 dark:text-purple-100">{s.saleNumber}</div>
                        <div className="text-[10px] text-purple-500 font-mono">{formatDate(s.date)}</div>
                      </td>

                      <td className="p-4 font-semibold text-purple-900 dark:text-purple-200">
                        {s.customerName}
                      </td>

                      <td className="p-4">
                        <div className="space-y-0.5">
                          {s.items.map((item, i) => (
                            <div key={i} className="text-[11px]">
                              • <span className="font-medium">{item.productName}</span> x{item.quantity} ({formatCurrency(item.unitPrice)})
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-4 font-bold text-purple-950 dark:text-purple-100 font-mono text-sm">
                        {formatCurrency(s.totalAmount)}
                      </td>

                      <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        +{formatCurrency(s.profit)}
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 font-semibold text-[11px]">
                          {s.paymentMethod}
                        </span>
                      </td>

                      <td className="p-4 text-purple-600 dark:text-purple-400 font-medium">
                        {s.loggedByName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 2: Staff Sales Performance Leaderboard */}
      {subTab === 'performance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {staffPerformance.map((staff, index) => (
              <div 
                key={staff.userId}
                className="bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md p-6 rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm relative overflow-hidden"
              >
                {index === 0 && (
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px] flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" /> #1 Top Seller
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center ring-2 ring-purple-300 shrink-0">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-purple-950 dark:text-purple-100">
                      {staff.userName}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 capitalize font-semibold">
                      {staff.userRole}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-100 dark:border-purple-900/40 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-[10px] text-purple-500 font-medium">Total Sales Revenue</div>
                    <div className="font-bold text-purple-950 dark:text-purple-100 font-mono text-sm">
                      {formatCurrency(staff.totalRevenue)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-purple-500 font-medium">Deals Closed</div>
                    <div className="font-bold text-purple-950 dark:text-purple-100 font-mono text-sm">
                      {staff.dealsClosed} orders
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-purple-500 font-medium">Avg Deal Size</div>
                    <div className="font-semibold text-purple-800 dark:text-purple-200 font-mono">
                      {formatCurrency(staff.avgDealValue)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-purple-500 font-medium">Est. Commission (5%)</div>
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatCurrency(staff.totalRevenue * 0.05)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Point of Sale (POS) New Sale Logger */}
      {isPOSOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/50 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white dark:bg-[#1A112E] rounded-3xl border border-purple-100 dark:border-purple-800 shadow-2xl p-6 max-h-[90vh] flex flex-col lg:flex-row gap-6 overflow-hidden">
            
            <button
              onClick={() => setIsPOSOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-purple-100 text-purple-500 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Product Selection Grid */}
            <div className="flex-1 flex flex-col min-h-0">
              <h3 className="text-base font-bold text-purple-950 dark:text-purple-100 mb-2 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-purple-600" /> Select Products for Order
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto pr-1 flex-1 min-h-[240px]">
                {products.filter(p => p.status === 'active').map(p => (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p)}
                    disabled={p.stockQuantity <= 0}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      p.stockQuantity <= 0 
                        ? 'opacity-50 border-gray-200 bg-gray-50 cursor-not-allowed'
                        : 'border-purple-100 dark:border-purple-900 bg-purple-50/40 dark:bg-purple-950/30 hover:border-purple-400 hover:bg-purple-100/50'
                    }`}
                  >
                    <div>
                      <img src={p.imageUrl} alt={p.name} className="w-full h-20 rounded-xl object-cover mb-2" />
                      <div className="font-bold text-xs text-purple-950 dark:text-purple-100 line-clamp-1">{p.name}</div>
                      <div className="text-[10px] text-purple-500 font-mono">Stock: {p.stockQuantity}</div>
                    </div>
                    <div className="font-bold text-xs text-purple-700 dark:text-purple-300 mt-2 font-mono">
                      {formatCurrency(p.retailPrice)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Order Checkout Cart */}
            <div className="w-full lg:w-80 bg-purple-50/80 dark:bg-[#120B24] p-4 rounded-2xl border border-purple-200/60 dark:border-purple-800/60 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-xs text-purple-950 dark:text-purple-100 mb-3 border-b border-purple-200 dark:border-purple-900 pb-2">
                  Order Items ({cartItems.length})
                </h4>

                {/* Cart list */}
                <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                  {cartItems.length === 0 ? (
                    <div className="text-center text-xs text-purple-400 py-8">
                      Cart is empty. Click products on the left to add.
                    </div>
                  ) : (
                    cartItems.map(ci => (
                      <div key={ci.product.id} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#1A112E] text-xs">
                        <div className="flex-1 truncate mr-2">
                          <div className="font-bold text-purple-950 dark:text-purple-100 truncate">{ci.product.name}</div>
                          <div className="text-[10px] text-purple-500 font-mono">{formatCurrency(ci.product.retailPrice)} ea</div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button onClick={() => updateCartQty(ci.product.id, -1)} className="w-5 h-5 rounded bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center">-</button>
                          <span className="font-bold px-1">{ci.quantity}</span>
                          <button onClick={() => updateCartQty(ci.product.id, 1)} className="w-5 h-5 rounded bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center">+</button>
                          <button onClick={() => removeFromCart(ci.product.id)} className="ml-1 text-rose-500"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handlePOSCheckout} className="space-y-2 text-xs border-t border-purple-200 dark:border-purple-900 pt-3">
                  <div>
                    <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-0.5">Customer Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-purple-200 bg-white dark:bg-[#1A112E] text-purple-950 dark:text-purple-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-0.5">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-purple-200 bg-white dark:bg-[#1A112E] text-purple-950 dark:text-purple-100 outline-none"
                    >
                      <option value="Credit Card">Credit Card</option>
                      <option value="GCash">GCash Business</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Petty Cash">Cash</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-0.5">Discount ($)</label>
                    <input
                      type="number"
                      step="1"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-purple-200 bg-white dark:bg-[#1A112E] text-purple-950 dark:text-purple-100 outline-none font-mono"
                    />
                  </div>

                  <div className="pt-2 text-xs space-y-1">
                    <div className="flex justify-between text-purple-600">
                      <span>Subtotal:</span>
                      <span className="font-mono">{formatCurrency(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between text-rose-600">
                      <span>Discount:</span>
                      <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-purple-950 dark:text-purple-100 border-t border-purple-200 pt-1">
                      <span>Total Payable:</span>
                      <span className="font-mono text-purple-700 dark:text-purple-300">{formatCurrency(cartTotal)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={cartItems.length === 0}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-bold text-xs shadow-md transition-all mt-2"
                  >
                    Complete POS Order
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
