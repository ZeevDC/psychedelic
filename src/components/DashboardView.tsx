import React from 'react';
import { KPIStats, Sale, Product } from '../types';
import { formatCurrency } from '../utils/export';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Receipt, 
  Wallet, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface DashboardViewProps {
  kpis: KPIStats;
  sales: Sale[];
  products: Product[];
  onNavigateTab: (tab: 'products' | 'expenses' | 'sales' | 'payroll') => void;
  onOpenNewSale: () => void;
}

const COLORS = ['#7C3AED', '#A855F7', '#C084FC', '#E879F9', '#818CF8', '#38BDF8'];

export const DashboardView: React.FC<DashboardViewProps> = ({
  kpis,
  sales,
  products,
  onNavigateTab,
  onOpenNewSale
}) => {
  // Low stock items
  const lowStockProducts = products.filter(p => p.status === 'active' && p.stockQuantity <= p.minStockLevel);

  // Category sales breakdown (defaults to 0%)
  const categoryData = React.useMemo(() => {
    if (products.length === 0) {
      return [{ name: 'Empty Catalog', value: 0 }];
    }
    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    const total = products.length;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100)
    }));
  }, [products]);

  // Top products stock/sales volume
  const topProductsData = products.slice(0, 5).map(p => ({
    name: p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name,
    stock: p.stockQuantity,
    price: p.retailPrice
  }));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-700 p-4 sm:p-8 text-white shadow-xl shadow-purple-900/20">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 backdrop-blur-3xl transform skew-x-12 hidden lg:block pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] sm:text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>Lilac Dream Executive Hub</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold sm:font-bold tracking-tight">
              Business Performance Overview
            </h2>
            <p className="text-xs sm:text-sm text-purple-100/80 mt-1 max-w-xl">
              Track revenue, profit margins, stock reorder thresholds, and staff sales logs in real-time.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onOpenNewSale}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white text-purple-900 font-bold text-xs sm:text-sm hover:bg-purple-50 shadow-md active:scale-95 transition-all"
            >
              + POS New Sale
            </button>
            <button
              onClick={() => onNavigateTab('products')}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-purple-900/60 hover:bg-purple-900/80 text-purple-100 font-semibold text-xs sm:text-sm border border-purple-400/30 transition-all"
            >
              Manage Inventory
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm shadow-purple-950/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-purple-600 dark:text-purple-400">
              Total Revenue
            </span>
            <div className="p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="text-lg sm:text-2xl font-bold text-purple-950 dark:text-purple-100 truncate">
              {formatCurrency(kpis.totalRevenue)}
            </div>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 sm:mt-1 font-medium">
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>+18.4% vs last month</span>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm shadow-purple-950/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-purple-600 dark:text-purple-400">
              Net Profit ({kpis.profitMargin}%)
            </span>
            <div className="p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="text-lg sm:text-2xl font-bold text-purple-950 dark:text-purple-100 truncate">
              {formatCurrency(kpis.netProfit)}
            </div>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 sm:mt-1 font-medium">
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>High efficiency</span>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div 
          onClick={() => onNavigateTab('products')}
          className="bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm shadow-purple-950/5 cursor-pointer hover:border-amber-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-purple-600 dark:text-purple-400">
              Low Stock Reorders
            </span>
            <div className="p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="text-lg sm:text-2xl font-bold text-purple-950 dark:text-purple-100 truncate">
              {kpis.lowStockItemsCount} Products
            </div>
            <div className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 mt-0.5 sm:mt-1 font-medium flex items-center gap-1">
              <span>Restock needed</span>
            </div>
          </div>
        </div>

        {/* Pending Payroll & Transfers */}
        <div 
          onClick={() => onNavigateTab('payroll')}
          className="bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm shadow-purple-950/5 cursor-pointer hover:border-purple-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-purple-600 dark:text-purple-400">
              Pending Payroll
            </span>
            <div className="p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="text-lg sm:text-2xl font-bold text-purple-950 dark:text-purple-100 truncate">
              {kpis.pendingPayrollCount} Unreleased
            </div>
            <div className="text-[10px] sm:text-xs text-indigo-600 dark:text-indigo-400 mt-0.5 sm:mt-1 font-medium">
              View salary logs
            </div>
          </div>
        </div>

      </div>

      {/* Product Category Share Chart Section */}
      <div className="bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md p-6 rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-purple-950 dark:text-purple-100">
              Product Category Share
            </h3>
            <p className="text-xs text-purple-500 dark:text-purple-400">
              Catalog distribution ratio (Starts at 0% when empty)
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
            {products.length} Products Logged
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-48 w-full flex items-center justify-center">
            {products.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A112E', borderColor: '#6D28D9', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    formatter={(val: any) => [`${val}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-xs text-purple-500 dark:text-purple-400">
                <div className="text-2xl font-bold text-purple-400/80 mb-1">0%</div>
                <div>No product categories logged yet.</div>
                <div>Add items in Price Catalog to view share distribution.</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100/80 dark:border-purple-900/40">
            {categoryData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center gap-2 text-xs font-medium text-purple-900 dark:text-purple-200 p-1.5 rounded-xl bg-white/60 dark:bg-[#20133A]/60">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="truncate">{cat.name}</span>
                <span className="ml-auto font-bold">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Low Stock Alerts Banner & Recent Sales Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Low Stock Reorder List */}
        <div className="bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md p-6 rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-purple-950 dark:text-purple-100">
                Low Stock Reorder Alerts
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
            >
              View All Products &rarr;
            </button>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="p-8 text-center text-xs text-purple-500 bg-purple-50/50 dark:bg-purple-950/20 rounded-2xl">
              ✨ All products have healthy inventory levels above minimum thresholds.
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map(p => (
                <div 
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <div className="text-xs font-bold text-purple-950 dark:text-purple-100">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-purple-500 dark:text-purple-400">
                        SKU: {p.sku} | Supplier: {p.supplierName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block">
                      {p.stockQuantity} left (Min: {p.minStockLevel})
                    </span>
                    <button
                      onClick={() => onNavigateTab('products')}
                      className="text-[11px] font-semibold text-purple-600 hover:underline"
                    >
                      Restock Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Sales Activity Stream */}
        <div className="bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md p-6 rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-purple-950 dark:text-purple-100">
                Recent Sales Transactions
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('sales')}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
            >
              Sales Log &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {sales.slice(0, 4).map(s => (
              <div 
                key={s.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-950 dark:text-purple-100">
                      {s.saleNumber}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 font-semibold">
                      {s.paymentMethod}
                    </span>
                  </div>
                  <div className="text-[11px] text-purple-500 dark:text-purple-400 mt-0.5">
                    Customer: {s.customerName} | Logged by {s.loggedByName}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-purple-950 dark:text-purple-100">
                    {formatCurrency(s.totalAmount)}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    +${s.profit.toFixed(2)} Profit
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
