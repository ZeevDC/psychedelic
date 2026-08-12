import React, { useState } from 'react';
import { Product, InventoryLog, Role } from '../types';
import { formatCurrency, formatDate, exportToCSV } from '../utils/export';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Archive, 
  Sliders, 
  AlertTriangle, 
  Download, 
  RefreshCw, 
  X, 
  Check, 
  Tag, 
  Truck,
  PlusCircle,
  MinusCircle,
  History,
  Sparkles
} from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
  inventoryLogs: InventoryLog[];
  currentRole: Role;
  onAddProduct: (productData: any) => void;
  onUpdateProduct: (id: string, productData: any) => void;
  onAdjustStock: (productId: string, changeQty: number, reason: any, notes: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  inventoryLogs,
  currentRole,
  onAddProduct,
  onUpdateProduct,
  onAdjustStock
}) => {
  const [subTab, setSubTab] = useState<'pricelist' | 'tracker' | 'logs'>('pricelist');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockStatusFilter, setStockStatusFilter] = useState<'All' | 'Healthy' | 'Low' | 'Out'>('All');
  const [supplierFilter, setSupplierFilter] = useState<string>('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Extract suppliers list & categories
  const suppliers = Array.from(new Set(products.map(p => p.supplierName))).filter(Boolean);
  const categories = ['All', 'Skincare', 'Fragrance', 'Home Decor', 'Apparel & Home'];

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState<Product | null>(null);
  const [stockAdjustmentQty, setStockAdjustmentQty] = useState<number>(10);
  const [stockAdjustmentReason, setStockAdjustmentReason] = useState<'Restock' | 'Sale' | 'Damaged' | 'Return' | 'Audit Adjustment'>('Restock');
  const [stockAdjustmentNotes, setStockAdjustmentNotes] = useState('');

  // Form Fields for Product Modal
  const [formData, setFormData] = useState({
    name: '',
    category: 'Skincare',
    basePrice: 450.00,
    retailPrice: 1250.00,
    stockQuantity: 20,
    minStockLevel: 10,
    supplierName: 'Aura Botanicals Philippines',
    supplierContact: 'supplier@aurabotanicals.ph',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=80',
    tags: 'Best Seller, Organic',
    variants: 'Standard 50ml'
  });

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSupplier = supplierFilter === 'All' || p.supplierName === supplierFilter;
    
    let matchesStock = true;
    if (stockStatusFilter === 'Healthy') matchesStock = p.stockQuantity > p.minStockLevel;
    if (stockStatusFilter === 'Low') matchesStock = p.stockQuantity <= p.minStockLevel && p.stockQuantity > 0;
    if (stockStatusFilter === 'Out') matchesStock = p.stockQuantity === 0;

    let matchesPrice = true;
    if (minPrice && p.retailPrice < parseFloat(minPrice)) matchesPrice = false;
    if (maxPrice && p.retailPrice > parseFloat(maxPrice)) matchesPrice = false;

    return matchesSearch && matchesCat && matchesSupplier && matchesStock && matchesPrice;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Skincare',
      basePrice: 15.00,
      retailPrice: 38.00,
      stockQuantity: 25,
      minStockLevel: 10,
      supplierName: 'Aura Botanicals Co.',
      supplierContact: 'supplier@aurabotanicals.com',
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=80',
      tags: 'Best Seller, Organic',
      variants: 'Default'
    });
    setIsProductModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      basePrice: product.basePrice,
      retailPrice: product.retailPrice,
      stockQuantity: product.stockQuantity,
      minStockLevel: product.minStockLevel,
      supplierName: product.supplierName,
      supplierContact: product.supplierContact,
      imageUrl: product.imageUrl || '',
      tags: (product.tags || []).join(', '),
      variants: (product.variants || []).join(', ')
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      variants: formData.variants.split(',').map(v => v.trim()).filter(Boolean)
    };

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, payload);
    } else {
      onAddProduct(payload);
    }
    setIsProductModalOpen(false);
  };

  const openAdjustStockModal = (product: Product) => {
    setSelectedProductForStock(product);
    setStockAdjustmentQty(10);
    setStockAdjustmentReason('Restock');
    setStockAdjustmentNotes('');
    setIsStockModalOpen(true);
  };

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForStock) return;

    onAdjustStock(
      selectedProductForStock.id,
      stockAdjustmentQty,
      stockAdjustmentReason,
      stockAdjustmentNotes
    );
    setIsStockModalOpen(false);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredProducts, 'Products_Inventory_PriceList', [
      { key: 'sku', label: 'SKU' },
      { key: 'name', label: 'Product Name' },
      { key: 'category', label: 'Category' },
      { key: 'basePrice', label: 'Cost Price ($)' },
      { key: 'retailPrice', label: 'Retail Price ($)' },
      { key: 'stockQuantity', label: 'Current Stock' },
      { key: 'minStockLevel', label: 'Min Threshold' },
      { key: 'supplierName', label: 'Supplier' }
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header & Sub-navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg sm:text-xl font-extrabold sm:font-bold text-purple-950 dark:text-purple-100">
              Products & Inventory Management
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-purple-600/70 dark:text-purple-400/70 mt-0.5">
            Maintain dynamic price lists, inventory stock tracking, and supplier logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Subtabs */}
          <div className="flex bg-purple-50 dark:bg-purple-950/60 p-1 rounded-xl sm:rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
            <button
              onClick={() => setSubTab('pricelist')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
                subTab === 'pricelist' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-700 dark:text-purple-300'
              }`}
            >
              Price Catalog
            </button>
            <button
              onClick={() => setSubTab('tracker')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
                subTab === 'tracker' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-700 dark:text-purple-300'
              }`}
            >
              Inventory Tracker
            </button>
            <button
              onClick={() => setSubTab('logs')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                subTab === 'logs' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-700 dark:text-purple-300'
              }`}
            >
              Movement Logs
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="p-2 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 hover:bg-purple-200 text-xs font-semibold flex items-center gap-1 transition-all"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={openAddModal}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 font-semibold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter Controls (for Price List & Tracker) */}
      {subTab !== 'logs' && (
        <div className="flex flex-col sm:flex-row gap-3 bg-white/60 dark:bg-[#1A112E]/60 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/40">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-purple-400" />
            <input
              type="text"
              placeholder="Search product name, SKU, or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-xs text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-purple-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-xs text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* SUBTAB 1: Price List & Catalog */}
      {subTab === 'pricelist' && (
        <div className="bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#8E78EB] text-white font-extrabold border-b-2 border-purple-300">
                <tr>
                  <th className="p-4 min-w-[200px]">Service</th>
                  <th className="p-4 min-w-[150px]">Category</th>
                  <th className="p-4 min-w-[120px]">Price</th>
                  <th className="p-4 min-w-[140px]">Slots Available</th>
                  <th className="p-4 text-right min-w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/60 dark:divide-purple-900/30 text-purple-900 dark:text-purple-200 font-medium">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(p => {
                    const isLow = p.stockQuantity <= p.minStockLevel;

                    return (
                      <tr key={p.id} className="hover:bg-purple-50/40 dark:hover:bg-purple-900/20 transition-all">
                        <td className="p-4 font-bold text-purple-950 dark:text-purple-100">
                          <div className="flex items-center gap-3">
                            <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-purple-200 shrink-0" />
                            <div>
                              <div className="text-sm font-extrabold text-purple-950 dark:text-purple-100">
                                {p.name}
                              </div>
                              <div className="text-[10px] text-purple-500 font-mono">
                                SKU: {p.sku}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full bg-[#EADFFF] text-purple-900 dark:bg-purple-950 dark:text-purple-200 font-bold text-xs border border-purple-300/60">
                            {p.category}
                          </span>
                        </td>

                        <td className="p-4 font-mono font-extrabold text-purple-950 dark:text-purple-100 text-sm">
                          {formatCurrency(p.retailPrice)}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-xl font-extrabold text-xs ${
                              p.stockQuantity > 0 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}>
                              {p.stockQuantity} Slots Available
                            </span>
                            {isLow && p.stockQuantity > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-0.5 animate-pulse">
                                <AlertTriangle className="w-3 h-3" /> Low
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-right space-x-1">
                          <button
                            onClick={() => openAdjustStockModal(p)}
                            className="px-2.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 text-purple-900 dark:text-purple-200 font-bold text-xs"
                          >
                            Edit Slots
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-600 dark:text-purple-300"
                            title="Edit Service"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-purple-600/70 font-semibold">
                      No services in catalog. Click "+ Add Service" to add items.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Inventory Tracker */}
      {subTab === 'tracker' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(p => {
            const isLow = p.stockQuantity <= p.minStockLevel;

            return (
              <div 
                key={p.id}
                className="bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md p-5 rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <img src={p.imageUrl} alt={p.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-200 dark:ring-purple-800" />
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      isLow ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isLow ? 'Low Stock Alert' : 'Healthy Stock'}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h3 className="font-bold text-sm text-purple-950 dark:text-purple-100">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-purple-500 font-mono mt-0.5">
                      SKU: {p.sku} | {p.category}
                    </p>
                  </div>

                  <div className="mt-4 p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">Current Stock:</span>
                      <span className="font-bold text-purple-950 dark:text-purple-100">{p.stockQuantity} units</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">Min Threshold:</span>
                      <span className="font-semibold text-purple-700 dark:text-purple-300">{p.minStockLevel} units</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">Supplier:</span>
                      <span className="text-purple-900 dark:text-purple-200 font-medium truncate max-w-[140px]">{p.supplierName}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-100 dark:border-purple-900/40 flex gap-2">
                  <button
                    onClick={() => openAdjustStockModal(p)}
                    className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Adjust Stock</span>
                  </button>
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 hover:bg-purple-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB 3: Stock Movement Logs */}
      {subTab === 'logs' && (
        <div className="bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-purple-100 dark:border-purple-900/40 flex items-center gap-2">
            <History className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-purple-950 dark:text-purple-100">
              Audit Stock Adjustment Logs
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-purple-50/80 dark:bg-purple-950/60 border-b border-purple-100 dark:border-purple-900/40 text-purple-900 dark:text-purple-200 font-bold">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Adjustment</th>
                  <th className="p-4">Prev &rarr; New</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Performed By</th>
                  <th className="p-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/60 dark:divide-purple-900/30 text-purple-900 dark:text-purple-200">
                {inventoryLogs.map(log => (
                  <tr key={log.id} className="hover:bg-purple-50/40 dark:hover:bg-purple-900/20">
                    <td className="p-4 text-[11px] text-purple-500 font-mono">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="p-4 font-bold text-purple-950 dark:text-purple-100">
                      {log.productName} ({log.sku})
                    </td>
                    <td className="p-4">
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                        log.changeQuantity > 0 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {log.changeQuantity > 0 ? `+${log.changeQuantity}` : log.changeQuantity}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px]">
                      {log.previousQuantity} &rarr; <span className="font-bold">{log.newQuantity}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-900/60 text-[10px] font-semibold">
                        {log.reason}
                      </span>
                    </td>
                    <td className="p-4 font-medium">
                      {log.performedBy}
                    </td>
                    <td className="p-4 text-purple-500 italic text-[11px]">
                      {log.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Product Add / Edit Form */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#1A112E] rounded-3xl border border-purple-100 dark:border-purple-800 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/60 pb-3 mb-4">
              <h3 className="text-lg font-bold text-purple-950 dark:text-purple-100">
                {editingProduct ? 'Edit Product Details' : 'Add New Product to Catalog'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1.5 rounded-full hover:bg-purple-100 text-purple-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Base Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Retail Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.retailPrice}
                    onChange={(e) => setFormData({ ...formData, retailPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Min Alert Level</label>
                  <input
                    type="number"
                    required
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Supplier Company Name</label>
                  <input
                    type="text"
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Supplier Contact Email/Phone</label>
                  <input
                    type="text"
                    value={formData.supplierContact}
                    onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Image URL Preview</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Organic, Best Seller..."
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Variants (comma separated)</label>
                  <input
                    type="text"
                    value={formData.variants}
                    onChange={(e) => setFormData({ ...formData, variants: e.target.value })}
                    placeholder="30ml, 50ml, Vanilla..."
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all mt-4"
              >
                {editingProduct ? 'Save Product Updates' : 'Add Product to Catalog'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Adjust Stock Quantity */}
      {isStockModalOpen && selectedProductForStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1A112E] rounded-3xl border border-purple-100 dark:border-purple-800 shadow-2xl p-6">
            
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/60 pb-3 mb-4">
              <h3 className="text-sm font-bold text-purple-950 dark:text-purple-100">
                Adjust Inventory Stock
              </h3>
              <button onClick={() => setIsStockModalOpen(false)} className="p-1 rounded-full text-purple-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 flex items-center gap-3">
              <img src={selectedProductForStock.imageUrl} alt={selectedProductForStock.name} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <div className="font-bold text-xs text-purple-950 dark:text-purple-100">{selectedProductForStock.name}</div>
                <div className="text-[11px] text-purple-500">Current Stock: {selectedProductForStock.stockQuantity} units</div>
              </div>
            </div>

            <form onSubmit={handleStockSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  Quantity Adjustment (+ to add, - to subtract)
                </label>
                <input
                  type="number"
                  required
                  value={stockAdjustmentQty}
                  onChange={(e) => setStockAdjustmentQty(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-bold focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  Adjustment Reason
                </label>
                <select
                  value={stockAdjustmentReason}
                  onChange={(e) => setStockAdjustmentReason(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="Restock">Restock (Received Batch)</option>
                  <option value="Sale">Manual Sale Deduction</option>
                  <option value="Damaged">Damaged / Defective</option>
                  <option value="Return">Customer Return</option>
                  <option value="Audit Adjustment">Audit Adjustment</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  Audit Notes
                </label>
                <input
                  type="text"
                  placeholder="PO # or reason details..."
                  value={stockAdjustmentNotes}
                  onChange={(e) => setStockAdjustmentNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all mt-3"
              >
                Confirm Stock Adjustment
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
