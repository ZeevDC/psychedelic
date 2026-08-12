import React, { useState } from 'react';
import { Expense, FundTransfer, ExpenseCategory, PaymentMethod, AccountWallet } from '../types';
import { formatCurrency, formatDate, exportToCSV } from '../utils/export';
import { 
  Receipt, 
  ArrowLeftRight, 
  Plus, 
  Download, 
  Search, 
  Filter, 
  Upload, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Clock, 
  X, 
  Sparkles,
  FileText
} from 'lucide-react';

interface ExpensesViewProps {
  expenses: Expense[];
  transfers: FundTransfer[];
  onAddExpense: (expenseData: any) => void;
  onAddTransfer: (transferData: any) => void;
  onUpdateTransferStatus: (id: string, status: 'Pending' | 'Completed' | 'Failed') => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  transfers,
  onAddExpense,
  onAddTransfer,
  onUpdateTransferStatus
}) => {
  const [subTab, setSubTab] = useState<'expenses' | 'transfers'>('expenses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [viewReceiptUrl, setViewReceiptUrl] = useState<string | null>(null);

  // Expense Form
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Rent & Utilities' as ExpenseCategory,
    amount: 1500.00,
    paymentMethod: 'Bank Transfer' as PaymentMethod,
    date: new Date().toISOString().split('T')[0],
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&auto=format&fit=crop&q=80',
    notes: ''
  });

  // Transfer Form
  const [transferForm, setTransferForm] = useState({
    fromAccount: 'Main Bank Account' as AccountWallet,
    toAccount: 'Petty Cash' as AccountWallet,
    amount: 5000.00,
    notes: ''
  });

  const categories: string[] = [
    'All',
    'Rent & Utilities',
    'Inventory Purchase',
    'Marketing & Ads',
    'Office Supplies',
    'Software & Tech',
    'Logistics & Shipping',
    'Payroll & Benefits',
    'Miscellaneous'
  ];

  const paymentMethodsList = ['All', 'Bank Transfer', 'Petty Cash', 'GCash', 'Maya', 'Credit Card'];

  const accounts: AccountWallet[] = [
    'Main Bank Account',
    'Petty Cash',
    'GCash Business',
    'Reserve Vault'
  ];

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.recordedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesPay = selectedPaymentMethod === 'All' || e.paymentMethod === selectedPaymentMethod;

    let matchesDate = true;
    if (startDate && e.date < startDate) matchesDate = false;
    if (endDate && e.date > endDate) matchesDate = false;

    let matchesAmount = true;
    if (minAmount && e.amount < parseFloat(minAmount)) matchesAmount = false;
    if (maxAmount && e.amount > parseFloat(maxAmount)) matchesAmount = false;

    return matchesSearch && matchesCat && matchesPay && matchesDate && matchesAmount;
  });

  const totalExpenseSum = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExpense(expenseForm);
    setIsExpenseModalOpen(false);
    setExpenseForm({
      title: '',
      category: 'Rent & Utilities',
      amount: 150.00,
      paymentMethod: 'Bank Transfer',
      date: new Date().toISOString().split('T')[0],
      receiptUrl: '',
      notes: ''
    });
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransfer(transferForm);
    setIsTransferModalOpen(false);
  };

  const handleExportCSV = () => {
    if (subTab === 'expenses') {
      exportToCSV(filteredExpenses, 'Expenses_Log', [
        { key: 'date', label: 'Date' },
        { key: 'title', label: 'Expense Title' },
        { key: 'category', label: 'Category' },
        { key: 'amount', label: 'Amount ($)' },
        { key: 'paymentMethod', label: 'Payment Method' },
        { key: 'recordedBy', label: 'Recorded By' }
      ]);
    } else {
      exportToCSV(transfers, 'Fund_Transfers_Log', [
        { key: 'referenceNo', label: 'Ref No' },
        { key: 'date', label: 'Date' },
        { key: 'fromAccount', label: 'From Account' },
        { key: 'toAccount', label: 'To Account' },
        { key: 'amount', label: 'Amount ($)' },
        { key: 'status', label: 'Status' },
        { key: 'initiatedBy', label: 'Initiated By' }
      ]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg sm:text-xl font-extrabold sm:font-bold text-purple-950 dark:text-purple-100">
              Financials & Expenditures
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-purple-600/70 dark:text-purple-400/70 mt-0.5">
            Log company operational expenses, receipt attachments, and wallet fund transfers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Subtabs */}
          <div className="flex bg-purple-50 dark:bg-purple-950/60 p-1 rounded-xl sm:rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
            <button
              onClick={() => setSubTab('expenses')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
                subTab === 'expenses' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-700 dark:text-purple-300'
              }`}
            >
              Expenses Log
            </button>
            <button
              onClick={() => setSubTab('transfers')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
                subTab === 'transfers' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-700 dark:text-purple-300'
              }`}
            >
              Fund Transfers
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 hover:bg-purple-200 text-xs font-semibold flex items-center gap-1 transition-all"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {subTab === 'expenses' ? (
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 font-semibold text-[11px] sm:text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Record Expense</span>
            </button>
          ) : (
            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 font-semibold text-[11px] sm:text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>New Transfer</span>
            </button>
          )}
        </div>
      </div>

      {/* SUBTAB 1: Expenses Log */}
      {subTab === 'expenses' && (
        <div className="space-y-4">
          
          {/* Summary Box & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/60 dark:bg-[#1A112E]/60 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-950 dark:text-purple-100">
                Filtered Expenditures Total:
              </span>
              <span className="text-base font-bold text-rose-600 dark:text-rose-400 font-mono">
                {formatCurrency(totalExpenseSum)}
              </span>
            </div>

            <div className="flex flex-1 max-w-md gap-2 w-full">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search expense..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-xs text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-xs text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Expenses Table */}
          <div className="bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-purple-50/80 dark:bg-purple-950/60 border-b border-purple-100 dark:border-purple-900/40 text-purple-900 dark:text-purple-200 font-bold">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Title & Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Receipt Proof</th>
                    <th className="p-4">Logged By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100/60 dark:divide-purple-900/30 text-purple-900 dark:text-purple-200">
                  {filteredExpenses.map(e => (
                    <tr key={e.id} className="hover:bg-purple-50/40 dark:hover:bg-purple-900/20">
                      <td className="p-4 font-mono text-[11px] text-purple-500">
                        {formatDate(e.date)}
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-purple-950 dark:text-purple-100">{e.title}</div>
                        {e.notes && <div className="text-[10px] text-purple-500 italic mt-0.5">{e.notes}</div>}
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 font-semibold text-[11px]">
                          {e.category}
                        </span>
                      </td>

                      <td className="p-4 font-medium">
                        {e.paymentMethod}
                      </td>

                      <td className="p-4 font-bold text-rose-600 dark:text-rose-400 font-mono">
                        -{formatCurrency(e.amount)}
                      </td>

                      <td className="p-4">
                        {e.receiptUrl ? (
                          <button
                            onClick={() => setViewReceiptUrl(e.receiptUrl || null)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-semibold text-[10px] flex items-center gap-1 hover:underline"
                          >
                            <FileText className="w-3 h-3" /> View Receipt
                          </button>
                        ) : (
                          <span className="text-purple-400 text-[11px] italic">No File</span>
                        )}
                      </td>

                      <td className="p-4 text-purple-600 dark:text-purple-400">
                        {e.recordedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Fund Transfers Module */}
      {subTab === 'transfers' && (
        <div className="bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-purple-50/80 dark:bg-purple-950/60 border-b border-purple-100 dark:border-purple-900/40 text-purple-900 dark:text-purple-200 font-bold">
                <tr>
                  <th className="p-4">Ref No & Date</th>
                  <th className="p-4">From Account</th>
                  <th className="p-4">To Account</th>
                  <th className="p-4">Transfer Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Initiated By</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/60 dark:divide-purple-900/30 text-purple-900 dark:text-purple-200">
                {transfers.map(t => (
                  <tr key={t.id} className="hover:bg-purple-50/40 dark:hover:bg-purple-900/20">
                    <td className="p-4">
                      <div className="font-bold text-purple-950 dark:text-purple-100">{t.referenceNo}</div>
                      <div className="text-[10px] text-purple-500 font-mono">{formatDate(t.date)}</div>
                    </td>

                    <td className="p-4 font-semibold text-purple-800 dark:text-purple-300">
                      {t.fromAccount}
                    </td>

                    <td className="p-4 font-semibold text-indigo-700 dark:text-indigo-300">
                      &rarr; {t.toAccount}
                    </td>

                    <td className="p-4 font-bold font-mono text-purple-950 dark:text-purple-100">
                      {formatCurrency(t.amount)}
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center w-max gap-1 ${
                        t.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : t.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {t.status === 'Completed' && <CheckCircle className="w-3 h-3" />}
                        {t.status === 'Pending' && <Clock className="w-3 h-3 animate-pulse" />}
                        {t.status === 'Failed' && <XCircle className="w-3 h-3" />}
                        {t.status}
                      </span>
                    </td>

                    <td className="p-4 text-purple-600 dark:text-purple-400">
                      {t.initiatedBy}
                    </td>

                    <td className="p-4 text-right space-x-1">
                      {t.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => onUpdateTransferStatus(t.id, 'Completed')}
                            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                          >
                            Mark Completed
                          </button>
                          <button
                            onClick={() => onUpdateTransferStatus(t.id, 'Failed')}
                            className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px]"
                          >
                            Mark Failed
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: Add Expense */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1A112E] rounded-3xl border border-purple-100 dark:border-purple-800 shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/60 pb-3 mb-4">
              <h3 className="text-sm font-bold text-purple-950 dark:text-purple-100">
                Record New Operational Expense
              </h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="p-1 text-purple-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Expense Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Storefront Rent or Ad Spend"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as ExpenseCategory })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-bold focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Payment Method</label>
                  <select
                    value={expenseForm.paymentMethod}
                    onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value as PaymentMethod })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Petty Cash">Petty Cash</option>
                    <option value="GCash">GCash Business</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Date</label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Receipt Attachment URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={expenseForm.receiptUrl}
                  onChange={(e) => setExpenseForm({ ...expenseForm, receiptUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all mt-3"
              >
                Submit Expense Log
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Fund Transfer */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1A112E] rounded-3xl border border-purple-100 dark:border-purple-800 shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/60 pb-3 mb-4">
              <h3 className="text-sm font-bold text-purple-950 dark:text-purple-100">
                Initiate Account Fund Transfer
              </h3>
              <button onClick={() => setIsTransferModalOpen(false)} className="p-1 text-purple-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">From Account/Wallet</label>
                <select
                  value={transferForm.fromAccount}
                  onChange={(e) => setTransferForm({ ...transferForm, fromAccount: e.target.value as AccountWallet })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  {accounts.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">To Account/Wallet</label>
                <select
                  value={transferForm.toAccount}
                  onChange={(e) => setTransferForm({ ...transferForm, toAccount: e.target.value as AccountWallet })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  {accounts.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Transfer Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({ ...transferForm, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-bold focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Reference Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Sweep digital sales or petty cash fill"
                  value={transferForm.notes}
                  onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all mt-3"
              >
                Execute Transfer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: View Receipt Attachment */}
      {viewReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-lg w-full bg-white dark:bg-[#1A112E] rounded-3xl p-4 border border-purple-100 dark:border-purple-800 shadow-2xl">
            <button
              onClick={() => setViewReceiptUrl(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="font-bold text-sm text-purple-950 dark:text-purple-100 mb-3">
              Receipt Attachment Proof
            </h4>
            <img src={viewReceiptUrl} alt="Receipt Proof" className="w-full max-h-96 object-contain rounded-2xl border border-purple-100" />
          </div>
        </div>
      )}

    </div>
  );
};
