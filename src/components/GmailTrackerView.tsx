import React, { useState, useMemo } from 'react';
import { 
  Mail, 
  Plus, 
  Search, 
  Copy, 
  Check, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Download, 
  Sparkles, 
  RefreshCw, 
  PlusCircle, 
  X, 
  Sliders,
  ShieldCheck,
  Smartphone,
  Key
} from 'lucide-react';
import { exportToCSV } from '../utils/export';

export interface ServiceColumn {
  id: string;
  name: string;
  shortCode: string;
}

export interface GmailAccountRecord {
  id: string;
  email: string;
  password: string;
  recoveryEmail: string;
  recoveryPhone: string;
  section: string; // e.g. "FOR RECOVERY", "DONE YT", "ACTIVE"
  services: Record<string, boolean>; // e.g. { "PRIME": true, "YT_FH": true, "DISNEY": true }
  status: 'Active' | 'For Recovery' | 'Done' | 'Pending';
  notes?: string;
  isHighlighted?: boolean;
}

const DEFAULT_SERVICES: ServiceColumn[] = [
  { id: 'PRIME', name: 'Amazon Prime', shortCode: 'PRIME' },
  { id: 'YT_INDIV', name: 'YouTube Individual', shortCode: 'YT INDIV' },
  { id: 'YT_FH', name: 'YouTube Famhead', shortCode: 'YT FAMHEAD' },
  { id: 'CGPT', name: 'ChatGPT', shortCode: 'CHATGPT' },
  { id: 'DISNEY', name: 'Disney+', shortCode: 'DISNEY' }
];

const INITIAL_ACCOUNTS: GmailAccountRecord[] = [
  {
    id: 'acc_1',
    email: 'secretnoklue01@gmail.com',
    password: 'Luv2morrow,C!',
    recoveryEmail: 'backup.noklue@gmail.com',
    recoveryPhone: '09626432532',
    section: 'FOR RECOVERY',
    services: { PRIME: true, YT_INDIV: false, YT_FH: false, CGPT: false, DISNEY: false },
    status: 'For Recovery'
  },
  {
    id: 'acc_2',
    email: 'fenaocea@gmail.com',
    password: 'LuvMe2morrow,C!',
    recoveryEmail: 'fena.backup@gmail.com',
    recoveryPhone: '09938712952',
    section: 'DONE YT',
    services: { PRIME: true, YT_INDIV: false, YT_FH: true, CGPT: true, DISNEY: true },
    status: 'Done'
  },
  {
    id: 'acc_3',
    email: 'callielinuxgomez@gmail.com',
    password: 'LuvMe2morrow,C!',
    recoveryEmail: 'callie.rec@gmail.com',
    recoveryPhone: '09930154746',
    section: 'DONE YT',
    services: { PRIME: true, YT_INDIV: true, YT_FH: false, CGPT: false, DISNEY: true },
    status: 'Done'
  }
];

export const GmailTrackerView: React.FC = () => {
  const [accounts, setAccounts] = useState<GmailAccountRecord[]>([]);
  const [services, setServices] = useState<ServiceColumn[]>(DEFAULT_SERVICES);
  const [customSections, setCustomSections] = useState<string[]>(['FOR RECOVERY', 'DONE YT', 'ACTIVE SUBSCRIBERS']);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('All');
  const [showPasswords, setShowPasswords] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<GmailAccountRecord | null>(null);

  // Account Form
  const [accountForm, setAccountForm] = useState({
    email: '',
    password: 'Luv2morrow,C!',
    recoveryEmail: '',
    recoveryPhone: '',
    section: 'FOR RECOVERY',
    status: 'Active' as GmailAccountRecord['status'],
    notes: '',
    services: {} as Record<string, boolean>
  });

  // Custom Service / Section form inputs
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCode, setNewServiceCode] = useState('');
  const [newSectionName, setNewSectionName] = useState('');

  const sectionsList = useMemo(() => {
    const fromAccounts = Array.from(new Set(accounts.map(a => a.section)));
    const merged = Array.from(new Set([...customSections, ...fromAccounts]));
    return merged.length > 0 ? merged : ['FOR RECOVERY', 'DONE YT', 'ACTIVE'];
  }, [accounts, customSections]);

  // Copy helper
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Toggle checklist checkbox
  const handleToggleService = (accountId: string, serviceId: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        return {
          ...acc,
          services: {
            ...acc.services,
            [serviceId]: !acc.services[serviceId]
          }
        };
      }
      return acc;
    }));
  };

  // Delete account
  const handleDeleteAccount = (id: string) => {
    if (confirm('Are you sure you want to delete this account record?')) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  // Open add modal
  const handleOpenAddModal = () => {
    setAccountForm({
      email: '',
      password: 'Luv2morrow,C!',
      recoveryEmail: '',
      recoveryPhone: '',
      section: sectionsList[0] || 'FOR RECOVERY',
      status: 'Active',
      notes: '',
      services: services.reduce((acc, s) => ({ ...acc, [s.id]: false }), {})
    });
    setEditingAccount(null);
    setIsAddAccountModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (acc: GmailAccountRecord) => {
    setEditingAccount(acc);
    setAccountForm({
      email: acc.email,
      password: acc.password,
      recoveryEmail: acc.recoveryEmail || '',
      recoveryPhone: acc.recoveryPhone || '',
      section: acc.section,
      status: acc.status,
      notes: acc.notes || '',
      services: { ...acc.services }
    });
    setIsAddAccountModalOpen(true);
  };

  // Save account
  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountForm.email) return;

    if (editingAccount) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === editingAccount.id) {
          return {
            ...acc,
            email: accountForm.email,
            password: accountForm.password,
            recoveryEmail: accountForm.recoveryEmail,
            recoveryPhone: accountForm.recoveryPhone,
            section: accountForm.section,
            status: accountForm.status,
            notes: accountForm.notes,
            services: accountForm.services
          };
        }
        return acc;
      }));
    } else {
      const newAcc: GmailAccountRecord = {
        id: `acc_${Date.now()}`,
        email: accountForm.email,
        password: accountForm.password,
        recoveryEmail: accountForm.recoveryEmail,
        recoveryPhone: accountForm.recoveryPhone,
        section: accountForm.section,
        status: accountForm.status,
        notes: accountForm.notes,
        services: accountForm.services
      };
      setAccounts(prev => [newAcc, ...prev]);
    }

    setIsAddAccountModalOpen(false);
  };

  // Add new Service Column
  const handleAddServiceColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceCode) return;
    const newSvc: ServiceColumn = {
      id: newServiceCode.toUpperCase().replace(/\s+/g, '_'),
      name: newServiceName || newServiceCode,
      shortCode: newServiceCode.toUpperCase()
    };
    setServices(prev => [...prev, newSvc]);
    setNewServiceName('');
    setNewServiceCode('');
  };

  // Add new section
  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    if (!customSections.includes(newSectionName.trim().toUpperCase())) {
      setCustomSections(prev => [...prev, newSectionName.trim().toUpperCase()]);
    }
    setNewSectionName('');
  };

  // Filtered accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      const matchesSearch = acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            acc.password.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (acc.recoveryEmail && acc.recoveryEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (acc.recoveryPhone && acc.recoveryPhone.includes(searchQuery));
      if (!matchesSearch) return false;

      if (sectionFilter !== 'All' && acc.section !== sectionFilter) return false;

      if (selectedServiceFilter !== 'All') {
        if (!acc.services[selectedServiceFilter]) return false;
      }

      return true;
    });
  }, [accounts, searchQuery, sectionFilter, selectedServiceFilter]);

  // Group accounts by section
  const groupedAccounts = useMemo(() => {
    const map: Record<string, GmailAccountRecord[]> = {};
    filteredAccounts.forEach(acc => {
      if (!map[acc.section]) {
        map[acc.section] = [];
      }
      map[acc.section].push(acc);
    });
    return map;
  }, [filteredAccounts]);

  // CSV Export
  const handleExportTrackerCSV = () => {
    const exportData = accounts.map(acc => {
      const serviceSummary = services
        .filter(s => acc.services[s.id])
        .map(s => s.shortCode)
        .join(', ');

      return {
        Section: acc.section,
        Email_Address: acc.email,
        Password: acc.password,
        Recovery_Email: acc.recoveryEmail || 'None',
        Recovery_Number: acc.recoveryPhone || 'None',
        Active_Checklist: serviceSummary,
        Status: acc.status
      };
    });

    exportToCSV(exportData, `Lilac_Gmail_Subscription_Tracker_${new Date().toISOString().split('T')[0]}`, [
      { key: 'Section', label: 'Section' },
      { key: 'Email_Address', label: 'Email Address' },
      { key: 'Password', label: 'Password' },
      { key: 'Recovery_Email', label: 'Recovery Email' },
      { key: 'Recovery_Number', label: 'Recovery Number' },
      { key: 'Active_Checklist', label: 'Active Checklist' },
      { key: 'Status', label: 'Status' }
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* LILAC THEMED HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 bg-gradient-to-r from-[#9B87ED] via-[#836CE7] to-[#6E54DC] text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#C8BAFA] shadow-lg shadow-purple-400/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/20 text-white font-bold text-[10px] uppercase tracking-wider border border-white/30 backdrop-blur-md">
              Lilac Subscription Tracker
            </span>
            <span className="text-[11px] sm:text-xs text-purple-100 font-medium">
              Total Accounts: {accounts.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold sm:font-black tracking-tight mt-1 text-white flex items-center gap-2">
            <span>Gmail Subscription Tracker</span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
          </h2>
          <p className="text-[11px] sm:text-xs text-purple-100/90 max-w-xl mt-1 font-medium">
            Track email addresses, passwords, recovery emails, recovery numbers, and active service checklists (Prime, YouTube Indiv, YT Famhead, ChatGPT, Disney+, etc.).
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-1.5 sm:gap-2">
          {accounts.length > 0 ? (
            <button
              onClick={() => {
                if (confirm('Clear all account records to start completely fresh from zero?')) {
                  setAccounts([]);
                }
              }}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-rose-500/30 hover:bg-rose-500/40 text-white text-[11px] sm:text-xs font-bold backdrop-blur-md border border-rose-300/40 flex items-center gap-1.5 transition-all"
              title="Wipe tracker records to zero"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Start Fresh (0)</span>
            </button>
          ) : (
            <button
              onClick={() => setAccounts(INITIAL_ACCOUNTS)}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-white/20 hover:bg-white/30 text-white text-[11px] sm:text-xs font-bold backdrop-blur-md border border-white/30 flex items-center gap-1.5 transition-all"
              title="Load template accounts"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Data</span>
            </button>
          )}

          <button
            onClick={() => setIsServiceModalOpen(true)}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-white/15 hover:bg-white/25 text-white text-[11px] sm:text-xs font-bold backdrop-blur-md border border-white/25 flex items-center gap-1.5 transition-all"
          >
            <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />
            <span>Customize Checklist Items</span>
          </button>

          <button
            onClick={handleExportTrackerCSV}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-white/15 hover:bg-white/25 text-white text-[11px] sm:text-xs font-bold backdrop-blur-md border border-white/25 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-200" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-white text-purple-950 font-extrabold text-[11px] sm:text-xs shadow-md hover:bg-purple-50 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-700" />
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {/* FILTER & TOOLBAR */}
      <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-[#1C1230]/80 backdrop-blur-md border-2 border-[#D6CAFC] dark:border-purple-900/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3 text-xs">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500" />
          <input
            type="text"
            placeholder="Search email, password, recovery email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white/90 dark:bg-[#120B24] text-purple-950 dark:text-purple-100 outline-none focus:border-purple-500 font-medium"
          />
        </div>

        {/* Section & Service Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="font-bold text-purple-900 dark:text-purple-200 text-xs">Group:</span>
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-bold outline-none"
          >
            <option value="All">All Groups</option>
            {sectionsList.map(sec => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>

          <span className="font-bold text-purple-900 dark:text-purple-200 text-xs ml-1">Checklist Filter:</span>
          <select
            value={selectedServiceFilter}
            onChange={(e) => setSelectedServiceFilter(e.target.value)}
            className="px-3 py-1.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-bold outline-none"
          >
            <option value="All">All Active Items</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.shortCode}</option>
            ))}
          </select>

          {/* Password Toggle */}
          <button
            onClick={() => setShowPasswords(!showPasswords)}
            className="px-3 py-1.5 rounded-2xl bg-[#EADFFF] dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 hover:bg-[#DDD0FC] font-bold flex items-center gap-1.5 transition-all border border-[#C2B2F5]"
          >
            {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPasswords ? 'Hide Passwords' : 'Show Passwords'}</span>
          </button>
        </div>

      </div>

      {/* LILAC SPREADSHEET TABLE GRID */}
      <div className="bg-white/90 dark:bg-[#180E2B]/90 rounded-3xl border-2 border-[#C4B3F5] dark:border-purple-900/60 shadow-xl overflow-hidden font-sans">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            
            {/* LILAC TABLE HEADER */}
            <thead>
              <tr className="bg-gradient-to-r from-[#8E78EB] to-[#7961E6] text-white font-extrabold border-b-2 border-purple-300">
                
                <th className="p-3.5 min-w-[220px]">
                  Email Address
                </th>
                <th className="p-3.5 min-w-[150px]">
                  Password
                </th>
                <th className="p-3.5 min-w-[180px]">
                  Recovery Email
                </th>
                <th className="p-3.5 min-w-[140px]">
                  Recovery Number
                </th>

                {/* Checklist Columns */}
                {services.map(svc => (
                  <th key={svc.id} className="p-3.5 text-center min-w-[85px] border-l border-white/20">
                    <span className="px-2 py-0.5 rounded-lg bg-white/20 text-white font-bold text-[10px] tracking-wider uppercase backdrop-blur-sm border border-white/30">
                      {svc.shortCode}
                    </span>
                  </th>
                ))}

                <th className="p-3.5 text-right min-w-[100px] border-l border-white/20">
                  Actions
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-purple-100 dark:divide-purple-900/40">
              {Object.keys(groupedAccounts).length > 0 ? (
                Object.keys(groupedAccounts).map(sectionName => (
                  <React.Fragment key={sectionName}>
                    
                    {/* SECTION LILAC BANNER ROW */}
                    <tr className="bg-[#DDD2FC] dark:bg-purple-950/80 text-purple-950 dark:text-purple-100 font-extrabold tracking-wider uppercase text-xs">
                      <td colSpan={services.length + 5} className="py-2.5 px-4 text-center border-y-2 border-[#C2B2F5] dark:border-purple-800">
                        ✦ --- {sectionName} --- ✦
                      </td>
                    </tr>

                    {/* ACCOUNT ROWS */}
                    {groupedAccounts[sectionName].map(acc => (
                      <tr 
                        key={acc.id}
                        className="hover:bg-[#F4EFFF] dark:hover:bg-[#251642] transition-colors odd:bg-purple-50/30 dark:odd:bg-[#130B24]/40"
                      >
                        {/* Email Address */}
                        <td className="p-3.5 font-bold text-purple-950 dark:text-purple-100">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span className="font-mono">{acc.email}</span>
                            <button
                              onClick={() => handleCopyText(acc.email, `${acc.id}_email`)}
                              className="p-1 hover:bg-purple-200 dark:hover:bg-purple-900 rounded text-purple-600 transition-all shrink-0"
                              title="Copy Email"
                            >
                              {copiedId === `${acc.id}_email` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </td>

                        {/* Password */}
                        <td className="p-3.5 font-mono text-purple-900 dark:text-purple-200">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold">
                              {showPasswords ? acc.password : '••••••••'}
                            </span>
                            <button
                              onClick={() => handleCopyText(acc.password, `${acc.id}_pass`)}
                              className="p-1 hover:bg-purple-200 dark:hover:bg-purple-900 rounded text-purple-600 transition-all shrink-0"
                              title="Copy Password"
                            >
                              {copiedId === `${acc.id}_pass` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </td>

                        {/* Recovery Email */}
                        <td className="p-3.5 font-mono text-purple-800 dark:text-purple-300">
                          {acc.recoveryEmail ? (
                            <div className="flex items-center gap-1.5">
                              <span>{acc.recoveryEmail}</span>
                              <button
                                onClick={() => handleCopyText(acc.recoveryEmail, `${acc.id}_rec_email`)}
                                className="p-1 hover:bg-purple-200 dark:hover:bg-purple-900 rounded text-purple-600 transition-all shrink-0"
                                title="Copy Recovery Email"
                              >
                                {copiedId === `${acc.id}_rec_email` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          ) : (
                            <span className="text-purple-400/60 font-sans italic">None</span>
                          )}
                        </td>

                        {/* Recovery Number */}
                        <td className="p-3.5 font-mono text-purple-800 dark:text-purple-300">
                          {acc.recoveryPhone ? (
                            <div className="flex items-center gap-1.5">
                              <span>{acc.recoveryPhone}</span>
                              <button
                                onClick={() => handleCopyText(acc.recoveryPhone, `${acc.id}_rec_phone`)}
                                className="p-1 hover:bg-purple-200 dark:hover:bg-purple-900 rounded text-purple-600 transition-all shrink-0"
                                title="Copy Recovery Phone"
                              >
                                {copiedId === `${acc.id}_rec_phone` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          ) : (
                            <span className="text-purple-400/60 font-sans italic">None</span>
                          )}
                        </td>

                        {/* Service Checklist Columns */}
                        {services.map(svc => {
                          const isChecked = Boolean(acc.services[svc.id]);
                          return (
                            <td 
                              key={svc.id}
                              onClick={() => handleToggleService(acc.id, svc.id)}
                              className="p-3.5 text-center cursor-pointer hover:bg-purple-100/50 dark:hover:bg-purple-900/40 border-l border-purple-100 dark:border-purple-900/40 transition-colors"
                            >
                              <div className="flex justify-center items-center">
                                {isChecked ? (
                                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#8E78EB] to-[#7961E6] text-white flex items-center justify-center shadow-sm">
                                    <Check className="w-4 h-4 stroke-[3]" />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-lg border-2 border-purple-300 dark:border-purple-700 bg-white/60 dark:bg-[#120B24]" />
                                )}
                              </div>
                            </td>
                          );
                        })}

                        {/* Actions */}
                        <td className="p-3.5 text-right border-l border-purple-100 dark:border-purple-900/40">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEditModal(acc)}
                              className="p-1.5 hover:bg-purple-200 dark:hover:bg-purple-900/80 rounded-xl text-purple-700 dark:text-purple-300 transition-all"
                              title="Edit Record"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAccount(acc.id)}
                              className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded-xl text-rose-500 transition-all"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}

                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={services.length + 5} className="py-12 text-center text-purple-600/70 font-semibold">
                    No matching Gmail account records found. Click "Add Account" to create one.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>

      {/* ADD / EDIT ACCOUNT MODAL */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1C1230] rounded-3xl border-2 border-[#C4B5F5] dark:border-purple-800 shadow-2xl p-6 overflow-hidden">
            
            <div className="flex items-center justify-between border-b-2 border-purple-100 dark:border-purple-900/60 pb-3 mb-4">
              <h3 className="text-base font-extrabold text-purple-950 dark:text-purple-100 flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-600" />
                <span>{editingAccount ? 'Edit Gmail Subscription Record' : 'Add New Gmail Subscription Record'}</span>
              </h3>
              <button onClick={() => setIsAddAccountModalOpen(false)} className="text-purple-400 hover:text-purple-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={accountForm.email}
                  onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                  placeholder="user@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-medium outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                  Password *
                </label>
                <input
                  type="text"
                  required
                  value={accountForm.password}
                  onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                  placeholder="Luv2morrow,C!"
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-mono font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                    Recovery Email
                  </label>
                  <input
                    type="email"
                    value={accountForm.recoveryEmail}
                    onChange={(e) => setAccountForm({ ...accountForm, recoveryEmail: e.target.value })}
                    placeholder="recovery@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-medium outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                    Recovery Number
                  </label>
                  <input
                    type="text"
                    value={accountForm.recoveryPhone}
                    onChange={(e) => setAccountForm({ ...accountForm, recoveryPhone: e.target.value })}
                    placeholder="09626432532"
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-mono outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                  Group / Section
                </label>
                <select
                  value={accountForm.section}
                  onChange={(e) => setAccountForm({ ...accountForm, section: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-bold outline-none"
                >
                  {sectionsList.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Service Checklist Assignment */}
              <div className="p-3.5 rounded-2xl bg-[#F3EDFF] dark:bg-purple-950/60 border-2 border-[#D6CAFC] dark:border-purple-800 space-y-2">
                <span className="text-xs font-extrabold text-purple-950 dark:text-purple-200 block">
                  Active Services Checklist:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {services.map(svc => (
                    <label key={svc.id} className="flex items-center gap-2 cursor-pointer text-purple-900 dark:text-purple-200 font-bold p-1.5 rounded-xl bg-white/80 dark:bg-[#180E2B]">
                      <input
                        type="checkbox"
                        checked={Boolean(accountForm.services[svc.id])}
                        onChange={(e) => setAccountForm({
                          ...accountForm,
                          services: {
                            ...accountForm.services,
                            [svc.id]: e.target.checked
                          }
                        })}
                        className="rounded-lg text-purple-600 focus:ring-purple-500 w-4 h-4"
                      />
                      <span className="truncate">{svc.shortCode}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddAccountModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#8E78EB] to-[#7961E6] text-white font-extrabold shadow-md hover:opacity-95 active:scale-95 transition-all"
                >
                  Save Record
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* CUSTOMIZE SERVICES MODAL */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1C1230] rounded-3xl border-2 border-[#C4B5F5] dark:border-purple-800 shadow-2xl p-6 overflow-hidden">
            
            <div className="flex items-center justify-between border-b-2 border-purple-100 dark:border-purple-900/60 pb-3 mb-4">
              <h3 className="text-base font-extrabold text-purple-950 dark:text-purple-100 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-600" />
                <span>Customize Checklist Columns</span>
              </h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-purple-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Active Services */}
              <div className="space-y-2">
                <span className="font-extrabold text-purple-950 dark:text-purple-200 block">Active Checklist Items:</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {services.map(svc => (
                    <div key={svc.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 font-bold">
                      <div>
                        <span className="text-purple-950 dark:text-purple-100 font-mono mr-2">
                          [{svc.shortCode}]
                        </span>
                        <span className="text-purple-600 dark:text-purple-300 font-medium">{svc.name}</span>
                      </div>
                      {services.length > 1 && (
                        <button
                          onClick={() => setServices(prev => prev.filter(s => s.id !== svc.id))}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Service Column */}
              <form onSubmit={handleAddServiceColumn} className="pt-3 border-t border-purple-100 dark:border-purple-900/50 space-y-2">
                <span className="font-extrabold text-purple-950 dark:text-purple-200 block">Add New Checklist Column:</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Short Code (e.g. HBO)"
                    value={newServiceCode}
                    onChange={(e) => setNewServiceCode(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-mono uppercase font-bold outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Full Name (e.g. HBO Max)"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center justify-center gap-1 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Service Column
                </button>
              </form>

              {/* Add Section Group */}
              <div className="pt-3 border-t border-purple-100 dark:border-purple-900/50 space-y-2">
                <span className="font-extrabold text-purple-950 dark:text-purple-200 block">Add Group Header:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. ACTIVE SUBSCRIBERS"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 uppercase font-bold outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="px-4 py-2 rounded-xl bg-purple-200 dark:bg-purple-900/80 text-purple-900 dark:text-purple-100 font-bold"
                  >
                    Add Group
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
