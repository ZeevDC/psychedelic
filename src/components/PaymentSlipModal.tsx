import React from 'react';
import { PayrollRecord } from '../types';
import { formatCurrency, formatDate } from '../utils/export';
import { X, Printer, Sparkles, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

interface PaymentSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: PayrollRecord | null;
}

export const PaymentSlipModal: React.FC<PaymentSlipModalProps> = ({
  isOpen,
  onClose,
  payroll
}) => {
  if (!isOpen || !payroll) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/50 backdrop-blur-md animate-fade-in print:p-0 print:bg-white">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1A112E] rounded-3xl border border-purple-100 dark:border-purple-800 shadow-2xl p-6 md:p-8 overflow-hidden print:border-none print:shadow-none print:w-full">
        
        {/* Top Header Actions */}
        <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/60 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-base font-bold text-purple-950 dark:text-purple-100">
              Official Digital Payslip
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 hover:bg-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-purple-100 text-purple-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Payslip Document Body */}
        <div className="bg-purple-50/50 dark:bg-purple-950/30 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/40 space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-800/60 pb-4">
            <div>
              <h2 className="text-xl font-black text-purple-900 dark:text-purple-100 tracking-tight">
                LILAC DREAM ESSENTIALS
              </h2>
              <p className="text-[11px] text-purple-600 dark:text-purple-400">
                Official Payroll Statement & Payment Slip
              </p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                payroll.status === 'Released'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {payroll.status === 'Released' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                PAYMENT {payroll.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Employee & Pay Period Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-purple-500 font-semibold text-[10px] uppercase tracking-wider">Employee Name</div>
              <div className="font-bold text-purple-950 dark:text-purple-100 text-sm mt-0.5">{payroll.userName}</div>
              <div className="text-purple-600 dark:text-purple-400 capitalize text-[11px]">{payroll.userRole} Role</div>
            </div>

            <div>
              <div className="text-purple-500 font-semibold text-[10px] uppercase tracking-wider">Pay Period</div>
              <div className="font-bold text-purple-950 dark:text-purple-100 text-sm mt-0.5">{payroll.payPeriod}</div>
              <div className="text-purple-600 dark:text-purple-400 text-[11px]">
                Released: {payroll.releasedDate ? formatDate(payroll.releasedDate) : 'Pending Authorization'}
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-white dark:bg-[#120B24] rounded-xl border border-purple-100 dark:border-purple-900 p-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-purple-100 dark:border-purple-900/40">
              <span className="text-purple-700 dark:text-purple-300">Base Salary Compensation:</span>
              <span className="font-bold font-mono text-purple-950 dark:text-purple-100">{formatCurrency(payroll.baseSalary)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-purple-100 dark:border-purple-900/40">
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">Sales Performance Bonus:</span>
              <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">+{formatCurrency(payroll.bonuses)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-purple-100 dark:border-purple-900/40">
              <span className="text-rose-600 dark:text-rose-400">Deductions (Taxes & Withholding):</span>
              <span className="font-bold font-mono text-rose-600 dark:text-rose-400">-{formatCurrency(payroll.deductions)}</span>
            </div>

            <div className="flex justify-between py-2 font-bold text-sm text-purple-950 dark:text-purple-100 border-t-2 border-purple-200 dark:border-purple-800 pt-3">
              <span>NET DISBURSED SALARY:</span>
              <span className="font-mono text-purple-700 dark:text-purple-300 text-base">{formatCurrency(payroll.netSalary)}</span>
            </div>
          </div>

          {/* Signatures & Verification */}
          <div className="pt-2 flex items-center justify-between text-[10px] text-purple-500 border-t border-purple-100 dark:border-purple-900/40">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Verified Digital Disbursement Stamp</span>
            </div>
            <div>Auth Token: {payroll.id.toUpperCase()}</div>
          </div>

        </div>
      </div>
    </div>
  );
};
