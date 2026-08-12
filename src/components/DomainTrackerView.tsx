import React, { useState } from 'react';
import { DomainRecord } from '../types';
import { 
  Globe, 
  Plus, 
  Search, 
  Calendar, 
  Mail, 
  Tag, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Sparkles,
  RefreshCw,
  PlusCircle,
  X
} from 'lucide-react';
import { exportToCSV } from '../utils/export';

interface DomainTrackerViewProps {
  domains: DomainRecord[];
  onAddDomain: (domain: Omit<DomainRecord, 'id'>) => void;
  onUpdateDomain: (domain: DomainRecord) => void;
  onDeleteDomain: (id: string) => void;
  onResetDomains?: () => void;
}

export const DomainTrackerView: React.FC<DomainTrackerViewProps> = ({
  domains,
  onAddDomain,
  onUpdateDomain,
  onDeleteDomain,
  onResetDomains
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<DomainRecord | null>(null);

  const [form, setForm] = useState({
    domainName: '',
    expiryDate: '',
    connectedEmail: '',
    premiumsUsed: '',
    registrar: 'GoDaddy / Namecheap',
    status: 'Active' as DomainRecord['status']
  });

  const handleOpenAddModal = () => {
    setEditingDomain(null);
    setForm({
      domainName: '',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      connectedEmail: '',
      premiumsUsed: '',
      registrar: 'Namecheap',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (d: DomainRecord) => {
    setEditingDomain(d);
    setForm({
      domainName: d.domainName,
      expiryDate: d.expiryDate,
      connectedEmail: d.connectedEmail,
      premiumsUsed: d.premiumsUsed,
      registrar: d.registrar || 'Namecheap',
      status: d.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.domainName) return;

    if (editingDomain) {
      onUpdateDomain({
        ...editingDomain,
        domainName: form.domainName,
        expiryDate: form.expiryDate,
        connectedEmail: form.connectedEmail,
        premiumsUsed: form.premiumsUsed,
        registrar: form.registrar,
        status: form.status
      });
    } else {
      onAddDomain({
        domainName: form.domainName,
        expiryDate: form.expiryDate,
        connectedEmail: form.connectedEmail,
        premiumsUsed: form.premiumsUsed,
        registrar: form.registrar,
        status: form.status
      });
    }
    setIsModalOpen(false);
  };

  const filteredDomains = domains.filter(d => {
    const matchesQuery = d.domainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.connectedEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.premiumsUsed.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesQuery) return false;
    if (statusFilter !== 'All' && d.status !== statusFilter) return false;
    return true;
  });

  const handleExportCSV = () => {
    const exportData = domains.map(d => ({
      Domain_Name: d.domainName,
      Expiry_Date: d.expiryDate,
      Connected_Email: d.connectedEmail,
      Premiums_Used: d.premiumsUsed,
      Registrar: d.registrar || 'N/A',
      Status: d.status
    }));

    exportToCSV(exportData, `Domain_Tracker_${new Date().toISOString().split('T')[0]}`, [
      { key: 'Domain_Name', label: 'Domain Name' },
      { key: 'Expiry_Date', label: 'Date of Expiry' },
      { key: 'Connected_Email', label: 'Connected Email' },
      { key: 'Premiums_Used', label: 'Premiums Used' },
      { key: 'Registrar', label: 'Registrar' },
      { key: 'Status', label: 'Status' }
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-purple-300/40 shadow-lg relative overflow-hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] sm:text-xs font-bold mb-2">
            <Globe className="w-3.5 h-3.5 text-purple-200" />
            <span>Web Domain Portfolio</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold sm:font-black tracking-tight">
            Domain Name Tracker
          </h2>
          <p className="text-[11px] sm:text-xs text-purple-100/90 mt-1 max-w-xl font-medium">
            Track domain names, expiry dates, connected emails, and custom premiums used (Canva, Shopify, Wix, Workspace, etc.).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {domains.length > 0 && onResetDomains && (
            <button
              onClick={onResetDomains}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-rose-500/30 hover:bg-rose-500/40 text-white text-[11px] sm:text-xs font-bold border border-rose-300/40 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset (0)</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-white/15 hover:bg-white/25 text-white text-[11px] sm:text-xs font-bold border border-white/25 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-white text-purple-950 font-extrabold text-[11px] sm:text-xs shadow-md hover:bg-purple-50 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-700" />
            <span>Add Domain</span>
          </button>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="p-4 rounded-3xl bg-white/80 dark:bg-[#1C1230]/80 backdrop-blur-md border-2 border-[#D6CAFC] dark:border-purple-900/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500" />
          <input
            type="text"
            placeholder="Search domain, email, premiums used..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white/90 dark:bg-[#120B24] text-purple-950 dark:text-purple-100 outline-none focus:border-purple-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-purple-900 dark:text-purple-200">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-bold outline-none"
          >
            <option value="All">All Domains ({domains.length})</option>
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

      </div>

      {/* TABLE GRID */}
      <div className="bg-white/90 dark:bg-[#180E2B]/90 rounded-3xl border-2 border-[#C4B3F5] dark:border-purple-900/60 shadow-xl overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#8E78EB] to-[#7961E6] text-white font-extrabold border-b-2 border-purple-300">
                <th className="p-3.5 min-w-[200px]">Domain Name</th>
                <th className="p-3.5 min-w-[140px]">Date of Expiry</th>
                <th className="p-3.5 min-w-[200px]">Email Connected</th>
                <th className="p-3.5 min-w-[220px]">Premiums Used</th>
                <th className="p-3.5 min-w-[120px]">Status</th>
                <th className="p-3.5 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 dark:divide-purple-900/40">
              {filteredDomains.length > 0 ? (
                filteredDomains.map(d => (
                  <tr key={d.id} className="hover:bg-[#F4EFFF] dark:hover:bg-[#251642] transition-colors">
                    <td className="p-3.5 font-bold text-purple-950 dark:text-purple-100">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-purple-600 shrink-0" />
                        <span className="font-mono text-sm">{d.domainName}</span>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-purple-900 dark:text-purple-200">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-500" />
                        <span>{d.expiryDate}</span>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-purple-900 dark:text-purple-200">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-purple-500" />
                        <span>{d.connectedEmail || 'None'}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="px-3 py-1 rounded-xl bg-purple-100/80 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 font-semibold border border-purple-200 dark:border-purple-800 inline-block">
                        {d.premiumsUsed || 'None specified'}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                        d.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
                          : d.status === 'Expiring Soon'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300'
                      }`}>
                        {d.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(d)}
                          className="p-1.5 hover:bg-purple-200 dark:hover:bg-purple-900/80 rounded-xl text-purple-700 dark:text-purple-300 transition-all"
                          title="Edit Domain"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteDomain(d.id)}
                          className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded-xl text-rose-500 transition-all"
                          title="Delete Domain"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-purple-600/70 font-semibold">
                    No domains logged. Click "Add Domain" to start tracking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1C1230] rounded-3xl border-2 border-[#C4B5F5] dark:border-purple-800 shadow-2xl p-6">
            <div className="flex items-center justify-between border-b-2 border-purple-100 dark:border-purple-900/60 pb-3 mb-4">
              <h3 className="text-base font-extrabold text-purple-950 dark:text-purple-100 flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                <span>{editingDomain ? 'Edit Domain Record' : 'Add New Domain'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-purple-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                  Domain Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. mycozystore.com"
                  value={form.domainName}
                  onChange={(e) => setForm({ ...form, domainName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-mono font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                    Date of Expiry *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as DomainRecord['status'] })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-bold outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                  Email Connected
                </label>
                <input
                  type="email"
                  placeholder="owner@domain.com"
                  value={form.connectedEmail}
                  onChange={(e) => setForm({ ...form, connectedEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                  Premiums Used (Custom Text)
                </label>
                <textarea
                  rows={2}
                  placeholder="Insert custom premiums text here (e.g. Canva Pro, Shopify Basic, Workspace Starter)"
                  value={form.premiumsUsed}
                  onChange={(e) => setForm({ ...form, premiumsUsed: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 outline-none font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#8E78EB] to-[#7961E6] text-white font-extrabold shadow-md hover:opacity-95"
                >
                  Save Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
