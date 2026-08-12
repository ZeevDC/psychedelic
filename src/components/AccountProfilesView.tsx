import React, { useState } from 'react';
import { AccountProfileRecord } from '../types';
import { 
  Tv, 
  Plus, 
  Search, 
  Film, 
  User, 
  Key, 
  Calendar, 
  Trash2, 
  Edit, 
  Download, 
  RefreshCw, 
  PlusCircle, 
  X,
  Users,
  CheckCircle2
} from 'lucide-react';
import { exportToCSV } from '../utils/export';

interface AccountProfilesViewProps {
  profiles: AccountProfileRecord[];
  onAddProfile: (profile: Omit<AccountProfileRecord, 'id'>) => void;
  onUpdateProfile: (profile: AccountProfileRecord) => void;
  onDeleteProfile: (id: string) => void;
  onResetProfiles?: () => void;
}

export const AccountProfilesView: React.FC<AccountProfilesViewProps> = ({
  profiles,
  onAddProfile,
  onUpdateProfile,
  onDeleteProfile,
  onResetProfiles
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<AccountProfileRecord | null>(null);

  const [form, setForm] = useState({
    accountEmail: '',
    service: 'Netflix',
    profileName: '',
    pinCode: '',
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    slotsAvailable: 4,
    slotsTotal: 5,
    assignedUser: '',
    status: 'Active' as AccountProfileRecord['status'],
    notes: ''
  });

  const handleOpenAddModal = () => {
    setEditingProfile(null);
    setForm({
      accountEmail: '',
      service: 'Netflix',
      profileName: 'Profile 1',
      pinCode: '1234',
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      slotsAvailable: 4,
      slotsTotal: 5,
      assignedUser: '',
      status: 'Active',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: AccountProfileRecord) => {
    setEditingProfile(p);
    setForm({
      accountEmail: p.accountEmail,
      service: p.service,
      profileName: p.profileName,
      pinCode: p.pinCode || '',
      renewalDate: p.renewalDate,
      slotsAvailable: p.slotsAvailable,
      slotsTotal: p.slotsTotal,
      assignedUser: p.assignedUser || '',
      status: p.status,
      notes: p.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.accountEmail || !form.profileName) return;

    if (editingProfile) {
      onUpdateProfile({
        ...editingProfile,
        accountEmail: form.accountEmail,
        service: form.service,
        profileName: form.profileName,
        pinCode: form.pinCode,
        renewalDate: form.renewalDate,
        slotsAvailable: Number(form.slotsAvailable),
        slotsTotal: Number(form.slotsTotal),
        assignedUser: form.assignedUser,
        status: form.slotsAvailable === 0 ? 'Full' : form.status,
        notes: form.notes
      });
    } else {
      onAddProfile({
        accountEmail: form.accountEmail,
        service: form.service,
        profileName: form.profileName,
        pinCode: form.pinCode,
        renewalDate: form.renewalDate,
        slotsAvailable: Number(form.slotsAvailable),
        slotsTotal: Number(form.slotsTotal),
        assignedUser: form.assignedUser,
        status: form.slotsAvailable === 0 ? 'Full' : form.status,
        notes: form.notes
      });
    }
    setIsModalOpen(false);
  };

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = p.accountEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.profileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.assignedUser && p.assignedUser.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (serviceFilter !== 'All' && p.service !== serviceFilter) return false;
    return true;
  });

  const handleExportCSV = () => {
    const exportData = profiles.map(p => ({
      Account_Email: p.accountEmail,
      Service: p.service,
      Profile_Name: p.profileName,
      PIN_Code: p.pinCode || 'None',
      Renewal_Date: p.renewalDate,
      Slots_Available: `${p.slotsAvailable} / ${p.slotsTotal}`,
      Assigned_User: p.assignedUser || 'Unassigned',
      Status: p.status
    }));

    exportToCSV(exportData, `Streaming_Account_Profiles_${new Date().toISOString().split('T')[0]}`, [
      { key: 'Account_Email', label: 'Account Email' },
      { key: 'Service', label: 'Streaming Service' },
      { key: 'Profile_Name', label: 'Profile Name' },
      { key: 'PIN_Code', label: 'PIN Code' },
      { key: 'Renewal_Date', label: 'Renewal Date' },
      { key: 'Slots_Available', label: 'Slots Available' },
      { key: 'Assigned_User', label: 'Assigned Customer' },
      { key: 'Status', label: 'Status' }
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 bg-gradient-to-r from-indigo-800 via-purple-800 to-fuchsia-900 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-purple-300/40 shadow-lg relative overflow-hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] sm:text-xs font-bold mb-2">
            <Tv className="w-3.5 h-3.5 text-indigo-200" />
            <span>Streaming Account Profiles Manager</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold sm:font-black tracking-tight">
            Netflix, Disney+, HBO Max & Prime Video Profiles
          </h2>
          <p className="text-[11px] sm:text-xs text-purple-100/90 mt-1 max-w-xl font-medium">
            Manage individual user profiles, PIN codes, renewal dates, slots available/occupied, and client assignments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {profiles.length > 0 && onResetProfiles && (
            <button
              onClick={onResetProfiles}
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
            <span>Add Profile Record</span>
          </button>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-[#1C1230]/80 backdrop-blur-md border-2 border-[#D6CAFC] dark:border-purple-900/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3 text-xs">
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500" />
          <input
            type="text"
            placeholder="Search email, profile name, PIN, client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white/90 dark:bg-[#120B24] text-purple-950 dark:text-purple-100 outline-none focus:border-purple-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-purple-900 dark:text-purple-200">Service:</span>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-1.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-bold outline-none"
          >
            <option value="All">All Streaming Services ({profiles.length})</option>
            <option value="Netflix">Netflix</option>
            <option value="Disney+">Disney+</option>
            <option value="HBO Max">HBO Max</option>
            <option value="Prime Video">Prime Video</option>
          </select>
        </div>

      </div>

      {/* TABLE GRID */}
      <div className="bg-white/90 dark:bg-[#180E2B]/90 rounded-3xl border-2 border-[#C4B3F5] dark:border-purple-900/60 shadow-xl overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#8E78EB] to-[#7961E6] text-white font-extrabold border-b-2 border-purple-300">
                <th className="p-3.5 min-w-[130px]">Service</th>
                <th className="p-3.5 min-w-[200px]">Account Email</th>
                <th className="p-3.5 min-w-[150px]">Profile Name & PIN</th>
                <th className="p-3.5 min-w-[130px]">Renewal Date</th>
                <th className="p-3.5 min-w-[130px]">Slots Available</th>
                <th className="p-3.5 min-w-[150px]">Assigned Customer</th>
                <th className="p-3.5 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 dark:divide-purple-900/40">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map(p => (
                  <tr key={p.id} className="hover:bg-[#F4EFFF] dark:hover:bg-[#251642] transition-colors">
                    <td className="p-3.5 font-bold">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 ${
                        p.service === 'Netflix' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                        p.service === 'Disney+' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' :
                        p.service === 'HBO Max' ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        <Film className="w-3.5 h-3.5" />
                        <span>{p.service}</span>
                      </span>
                    </td>

                    <td className="p-3.5 font-mono font-bold text-purple-950 dark:text-purple-100">
                      {p.accountEmail}
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-purple-900 dark:text-purple-100 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-500" />
                        <span>{p.profileName}</span>
                      </div>
                      {p.pinCode && (
                        <div className="text-[11px] font-mono text-purple-600 dark:text-purple-300 font-bold mt-0.5">
                          PIN: {p.pinCode}
                        </div>
                      )}
                    </td>

                    <td className="p-3.5 font-mono text-purple-900 dark:text-purple-200">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-500" />
                        <span>{p.renewalDate}</span>
                      </div>
                    </td>

                    <td className="p-3.5 font-bold">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-purple-500" />
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-extrabold ${
                          p.slotsAvailable > 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {p.slotsAvailable} / {p.slotsTotal} Slots
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5 text-purple-900 dark:text-purple-200 font-medium">
                      {p.assignedUser || <span className="text-purple-400 italic">Unassigned</span>}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 hover:bg-purple-200 dark:hover:bg-purple-900/80 rounded-xl text-purple-700 dark:text-purple-300 transition-all"
                          title="Edit Profile"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProfile(p.id)}
                          className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded-xl text-rose-500 transition-all"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-purple-600/70 font-semibold">
                    No streaming account profiles logged. Click "Add Profile Record" to create one.
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
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1C1230] rounded-3xl border-2 border-[#C4B5F5] dark:border-purple-800 shadow-2xl p-6">
            <div className="flex items-center justify-between border-b-2 border-purple-100 dark:border-purple-900/60 pb-3 mb-4">
              <h3 className="text-base font-extrabold text-purple-950 dark:text-purple-100 flex items-center gap-2">
                <Tv className="w-5 h-5 text-purple-600" />
                <span>{editingProfile ? 'Edit Streaming Profile' : 'Add Streaming Account Profile'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-purple-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                    Service *
                  </label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-bold outline-none"
                  >
                    <option value="Netflix">Netflix</option>
                    <option value="Disney+">Disney+</option>
                    <option value="HBO Max">HBO Max</option>
                    <option value="Prime Video">Prime Video</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                    Profile Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Profile 1 / User A"
                    value={form.profileName}
                    onChange={(e) => setForm({ ...form, profileName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                  Account Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="stream.account@gmail.com"
                  value={form.accountEmail}
                  onChange={(e) => setForm({ ...form, accountEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                    PIN Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1234"
                    value={form.pinCode}
                    onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-mono font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                    Renewal Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.renewalDate}
                    onChange={(e) => setForm({ ...form, renewalDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                    Slots Available
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={form.slotsAvailable}
                    onChange={(e) => setForm({ ...form, slotsAvailable: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                    Total Slots Capacity
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={form.slotsTotal}
                    onChange={(e) => setForm({ ...form, slotsTotal: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-purple-950 dark:text-purple-200 mb-1">
                  Assigned Customer / Client Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maria Santos (FB Client)"
                  value={form.assignedUser}
                  onChange={(e) => setForm({ ...form, assignedUser: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#D6CAFC] dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 font-medium outline-none"
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
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
