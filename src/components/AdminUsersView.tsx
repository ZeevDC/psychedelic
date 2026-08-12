import React from 'react';
import { User, Role } from '../types';
import { formatDate } from '../utils/export';
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  ShieldAlert, 
  Check, 
  X, 
  Sparkles,
  Search,
  Building,
  Mail,
  Phone,
  User as UserIcon
} from 'lucide-react';

interface AdminUsersViewProps {
  users: User[];
  currentRole: Role;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({
  users,
  currentRole,
  onUpdateUser
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  if (currentRole !== 'admin') {
    return (
      <div className="p-8 text-center bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md rounded-3xl border border-purple-100 dark:border-purple-900/50">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-purple-950 dark:text-purple-100">Access Restricted</h3>
        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 max-w-md mx-auto">
          The Team & RBAC Management Panel is reserved exclusively for Administrators. Use the top test role switcher to toggle to Admin.
        </p>
      </div>
    );
  }

  const pendingUsers = users.filter(u => u.status === 'pending');
  const activeUsers = users.filter(u => u.status !== 'pending');

  const filteredActive = activeUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.department || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md p-5 rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold text-purple-950 dark:text-purple-100">
              Admin Access Control & Team RBAC
            </h2>
          </div>
          <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-0.5">
            Approve new sign-ups, elevate user roles, and manage system security permissions.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-purple-400" />
          <input
            type="text"
            placeholder="Search staff name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-xs text-purple-950 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
      </div>

      {/* PENDING APPROVALS QUEUE */}
      {pendingUsers.length > 0 && (
        <div className="bg-purple-50/80 dark:bg-purple-950/40 p-5 rounded-3xl border border-purple-200 dark:border-purple-800 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-purple-950 dark:text-purple-100">
              Pending Sign-Up Approvals ({pendingUsers.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingUsers.map(u => (
              <div 
                key={u.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#1A112E] border border-purple-200 dark:border-purple-800/80 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center ring-2 ring-purple-300 shrink-0">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-purple-950 dark:text-purple-100">{u.name}</div>
                    <div className="text-[11px] text-purple-500">{u.email}</div>
                    <div className="text-[10px] text-purple-400 mt-0.5">Dept: {u.department || 'General'}</div>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => onUpdateUser(u.id, { status: 'active' })}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => onUpdateUser(u.id, { status: 'suspended' })}
                    className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 hover:bg-rose-200 font-bold text-xs flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USER DIRECTORY TABLE */}
      <div className="bg-white/80 dark:bg-[#1A112E]/80 backdrop-blur-md rounded-3xl border border-purple-100 dark:border-purple-900/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-purple-50/80 dark:bg-purple-950/60 border-b border-purple-100 dark:border-purple-900/40 text-purple-900 dark:text-purple-200 font-bold">
              <tr>
                <th className="p-4">User Details</th>
                <th className="p-4">Department</th>
                <th className="p-4">System Role</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">RBAC Role Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100/60 dark:divide-purple-900/30 text-purple-900 dark:text-purple-200">
              {filteredActive.map(u => (
                <tr key={u.id} className="hover:bg-purple-50/40 dark:hover:bg-purple-900/20">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center ring-1 ring-purple-300 shrink-0">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-purple-950 dark:text-purple-100">{u.name}</div>
                        <div className="text-[10px] text-purple-500">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-semibold text-purple-800 dark:text-purple-300">
                    {u.department || 'General'}
                  </td>

                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                      u.role === 'admin' 
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                    }`}>
                      {u.role} Access
                    </span>
                  </td>

                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      u.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {u.status}
                    </span>
                  </td>

                  <td className="p-4 text-purple-500 font-mono text-[11px]">
                    {formatDate(u.createdAt)}
                  </td>

                  <td className="p-4 text-right space-x-1">
                    {u.role === 'staff' ? (
                      <button
                        onClick={() => onUpdateUser(u.id, { role: 'admin' })}
                        className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px]"
                      >
                        Elevate to Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateUser(u.id, { role: 'staff' })}
                        className="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-800 hover:bg-purple-200 font-semibold text-[10px]"
                      >
                        Set as Staff
                      </button>
                    )}

                    {u.status === 'active' ? (
                      <button
                        onClick={() => onUpdateUser(u.id, { status: 'suspended' })}
                        className="px-2.5 py-1 rounded-xl bg-rose-100 text-rose-800 hover:bg-rose-200 font-semibold text-[10px]"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateUser(u.id, { status: 'active' })}
                        className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-semibold text-[10px]"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
