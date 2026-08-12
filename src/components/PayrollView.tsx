import React, { useState } from 'react';
import { PayrollRecord, User, Role } from '../types';
import { formatCurrency, formatDate, exportToCSV } from '../utils/export';
import { PaymentSlipModal } from './PaymentSlipModal';
import { 
  Wallet, 
  Plus, 
  CheckCircle, 
  Clock, 
  FileText, 
  Download, 
  Filter, 
  Check, 
  X, 
  DollarSign, 
  UserCheck,
  Sparkles
} from 'lucide-react';

interface PayrollViewProps {
  payrollRecords: PayrollRecord[];
  users: User[];
  currentRole: Role;
  currentUser: User | null;
  onAddPayroll: (payrollData: any) => void;
  onReleasePayroll: (id: string, releasedBy: string) => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  payrollRecords,
  users,
  currentRole,
  currentUser,
  onAddPayroll,
  onReleasePayroll
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Released' | 'Unreleased'>('All');
  const [roleFilter, setRoleFilter] = useState<'All' | 'admin' | 'staff'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || '');
  const [payPeriod, setPayPeriod] = useState('July 16 - July 31, 2026');
  const [baseSalary, setBaseSalary] = useState<number>(25000.00);
  const [bonuses, setBonuses] = useState<number>(2500.00);
  const [deductions, setDeductions] = useState<number>(1500.00);
  const [notes, setNotes] = useState('');

  const filteredRecords = payrollRecords.filter(r => {
    const matchesSearch = r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.payPeriod.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (statusFilter === 'Released' && r.status !== 'Released') return false;
    if (statusFilter === 'Unreleased' && r.status !== 'Unreleased') return false;

    if (roleFilter !== 'All' && r.userRole !== roleFilter) return false;

    if (minAmount && r.netSalary < parseFloat(minAmount)) return false;
    if (maxAmount && r.netSalary > parseFloat(maxAmount)) return false;

    return true;
  });

  const totalUnreleasedAmount = payrollRecords
    .filter(r => r.status === 'Unreleased')
    .reduce((sum, r) => sum + r.netSalary, 0);

  const totalReleasedAmount = payrollRecords
    .filter(r => r.status === 'Released')
    .reduce((sum, r) => sum + r.netSalary, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPayroll({
      userId: selectedUserId,
      payPeriod,
      baseSalary,
      bonuses,
      deductions,
      notes
    });
    setIsAddModalOpen(false);
  };

  const handleReleaseClick = (record: PayrollRecord) => {
    const adminName = currentUser ? currentUser.name : 'Elena Vance (Admin)';
    onReleasePayroll(record.id, adminName);
    
    // Automatically preview the generated payment slip
    setSelectedPayslip({
      ...record,
      status: 'Released',
      releasedDate: new Date().toISOString().split('T')[0],
      releasedBy: adminName
    });
  };

  const handleExportCSV = () => {
    exportToCSV(filteredRecords, 'Payroll_Salary_Log', [
      { key: 'userName', label: 'Employee Name' },
      { key: 'userRole', label: 'Role' },
      { key: 'payPeriod', label: 'Pay Period' },
      { key: 'baseSalary', label: 'Base Pay ($)' },
      { key: 'bonuses', label: 'Bonus ($)' },
      { key: 'deductions', label: 'Deductions ($)' },
      { key: 'netSalary', label: 'Net Disbursed ($)' },
      { key: 'status', label: 'Status' }
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md p-5 rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold text-purple-950 dark:text-purple-100">
              Payroll & Salary Disbursal
            </h2>
          </div>
          <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-0.5">
            Manage staff base pay, bonuses, withholding deductions, and release digital payslips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <div className="flex bg-purple-50 dark:bg-purple-950/60 p-1 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 text-xs font-semibold">
            {(['All', 'Unreleased', 'Released'] as const).map(sf => (
              <button
                key={sf}
                onClick={() => setStatusFilter(sf)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  statusFilter === sf ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-800 dark:text-purple-200'
                }`}
              >
                {sf}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="p-2 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 hover:bg-purple-200 text-xs font-semibold transition-all"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          {currentRole === 'admin' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 font-semibold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Payroll Record</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-3xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Total Pending / Unreleased Payouts:</span>
            <div className="text-xl font-bold text-amber-950 dark:text-amber-100 font-mono mt-0.5">
              {formatCurrency(totalUnreleasedAmount)}
            </div>
          </div>
          <Clock className="w-8 h-8 text-amber-500 opacity-80" />
        </div>

        <div className="p-4 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Total Released Payroll Disbursed:</span>
            <div className="text-xl font-bold text-emerald-950 dark:text-emerald-100 font-mono mt-0.5">
              {formatCurrency(totalReleasedAmount)}
            </div>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-500 opacity-80" />
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-purple-50/80 dark:bg-purple-950/60 border-b border-purple-100 dark:border-purple-900/40 text-purple-900 dark:text-purple-200 font-bold">
              <tr>
                <th className="p-4">Employee</th>
                <th className="p-4">Pay Period</th>
                <th className="p-4">Base Salary</th>
                <th className="p-4">Bonus</th>
                <th className="p-4">Deductions</th>
                <th className="p-4">Net Payout</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions / Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100/60 dark:divide-purple-900/30 text-purple-900 dark:text-purple-200">
              {filteredRecords.map(r => (
                <tr key={r.id} className="hover:bg-purple-50/40 dark:hover:bg-purple-900/20">
                  <td className="p-4">
                    <div className="font-bold text-purple-950 dark:text-purple-100">{r.userName}</div>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-purple-100 text-purple-800 capitalize font-semibold">
                      {r.userRole}
                    </span>
                  </td>

                  <td className="p-4 font-semibold text-purple-800 dark:text-purple-300">
                    {r.payPeriod}
                  </td>

                  <td className="p-4 font-mono font-medium">
                    {formatCurrency(r.baseSalary)}
                  </td>

                  <td className="p-4 font-mono text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(r.bonuses)}
                  </td>

                  <td className="p-4 font-mono text-rose-600 dark:text-rose-400">
                    -{formatCurrency(r.deductions)}
                  </td>

                  <td className="p-4 font-bold font-mono text-purple-950 dark:text-purple-100 text-sm">
                    {formatCurrency(r.netSalary)}
                  </td>

                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center w-max gap-1 ${
                      r.status === 'Released'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {r.status === 'Released' ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 animate-pulse" />}
                      {r.status}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    {r.status === 'Unreleased' && currentRole === 'admin' && (
                      <button
                        onClick={() => handleReleaseClick(r)}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shadow-sm transition-all"
                      >
                        Mark as Released
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedPayslip(r)}
                      className="px-2.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 text-purple-800 dark:text-purple-200 font-semibold text-[11px] inline-flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Payslip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Create Payroll Record */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1A112E] rounded-3xl border border-purple-100 dark:border-purple-800 shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/60 pb-3 mb-4">
              <h3 className="text-sm font-bold text-purple-950 dark:text-purple-100">
                New Payroll Entry
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-purple-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Select Employee</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Pay Period</label>
                <input
                  type="text"
                  required
                  value={payPeriod}
                  onChange={(e) => setPayPeriod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Base Pay ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Bonus ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={bonuses}
                    onChange={(e) => setBonuses(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-purple-900 dark:text-purple-200 mb-1">Deduction ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={deductions}
                    onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-mono outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex justify-between font-bold">
                <span className="text-purple-900 dark:text-purple-200">Net Calculated Pay:</span>
                <span className="text-purple-700 dark:text-purple-300 font-mono">
                  {formatCurrency(Math.max(0, baseSalary + bonuses - deductions))}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all mt-2"
              >
                Save Payroll Entry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payslip Digital Preview Modal */}
      <PaymentSlipModal
        isOpen={Boolean(selectedPayslip)}
        onClose={() => setSelectedPayslip(null)}
        payroll={selectedPayslip}
      />

    </div>
  );
};
