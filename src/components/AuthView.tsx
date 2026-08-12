import React, { useState } from 'react';
import { User, Role } from '../types';
import { 
  LogOut, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  Building, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw,
  UserCheck,
  Settings,
  LayoutDashboard,
  Moon
} from 'lucide-react';

interface AuthViewProps {
  currentUser: User | null;
  currentRole: Role;
  onLoginSuccess: (user: User) => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  onNavigateTab: (tab: any) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  currentUser,
  currentRole,
  onLoginSuccess,
  onLogout,
  onOpenProfile,
  onNavigateTab
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Sales & Operations');
  const [role, setRole] = useState<Role>('admin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (authMode === 'signin') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Invalid credentials. Please check your email and password.');

        setSuccessMsg(`Welcome back, ${data.user.name}! Authenticated successfully.`);
        onLoginSuccess(data.user);
      } else if (authMode === 'signup') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, phone, department, role })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Account creation failed.');

        setSuccessMsg('Account registered successfully! Auto-logging in...');
        onLoginSuccess(data.user);
      } else if (authMode === 'forgot') {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Password reset request failed.');

        setSuccessMsg(data.message || 'If an account exists, a password reset link has been dispatched.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      
      {/* HEADER BANNER - DREAMY BLUE MOONLIGHT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 rounded-3xl border-2 border-sky-400/30 shadow-xl shadow-sky-950/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-200 text-xs font-bold mb-3 backdrop-blur-md">
            <Moon className="w-3.5 h-3.5 text-sky-300 fill-sky-300/30" />
            <span>Dreamy Blue Moonlight Access Control</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
            <span>Secure Authentication Portal</span>
            <Sparkles className="w-5 h-5 text-sky-300 animate-pulse" />
          </h2>
          <p className="text-xs sm:text-sm text-sky-100/90 mt-1.5 max-w-xl font-medium leading-relaxed">
            Please log into your registered user account or sign up for a new account to access the system features and workspaces.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative z-10">
          {currentUser ? (
            <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-300/40 text-emerald-200 text-xs font-bold flex items-center gap-2 backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Session Active ({currentUser.name})</span>
            </div>
          ) : (
            <div className="px-4 py-2 rounded-2xl bg-sky-500/20 border border-sky-300/40 text-sky-200 text-xs font-bold flex items-center gap-2 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-sky-300" />
              <span>Authentication Required</span>
            </div>
          )}
        </div>

        {/* Ethereal background light glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* MAIN AUTH CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ACTIVE USER SESSION / SECURITY INFO */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border-2 border-sky-200/80 dark:border-blue-900/60 shadow-lg shadow-sky-900/5 space-y-5">
            <div className="flex items-center justify-between border-b border-sky-100 dark:border-blue-900/50 pb-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-sky-100 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                <span>Account Status & Session</span>
              </h3>
              {currentUser && (
                <span className="px-3 py-1 rounded-full text-[10px] uppercase font-black bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-200 border border-sky-300 dark:border-sky-800">
                  {currentRole}
                </span>
              )}
            </div>

            {currentUser ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-sky-50/80 dark:bg-[#131F37]/80 border border-sky-200/80 dark:border-blue-900/60">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-sky-100 truncate">
                      {currentUser.name}
                    </h4>
                    <p className="text-xs text-sky-600 dark:text-sky-300 flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{currentUser.email}</span>
                    </p>
                    {currentUser.department && (
                      <p className="text-[11px] text-slate-500 dark:text-sky-400 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 shrink-0" />
                        <span>{currentUser.department}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-100 dark:border-blue-900/40">
                    <span className="text-[10px] text-sky-600 dark:text-sky-400 uppercase font-extrabold block">Role Level</span>
                    <span className="font-extrabold text-slate-900 dark:text-sky-100 capitalize">{currentUser.role}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-100 dark:border-blue-900/40">
                    <span className="text-[10px] text-sky-600 dark:text-sky-400 uppercase font-extrabold block">Account Status</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 capitalize">{currentUser.status}</span>
                  </div>
                </div>

                {/* LOGOUT & NAVIGATION ACTIONS */}
                <div className="pt-2 space-y-2.5">
                  <button
                    onClick={() => {
                      onLogout();
                      setSuccessMsg('You have been logged out successfully.');
                      setErrorMsg('');
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out Now</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={onOpenProfile}
                      className="py-2.5 px-3 rounded-xl bg-sky-100 dark:bg-blue-950 hover:bg-sky-200 dark:hover:bg-blue-900 text-sky-900 dark:text-sky-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-sky-200 dark:border-blue-800"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={() => onNavigateTab('dashboard')}
                      className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-sky-500/20"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Go to Dashboard</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center py-6">
                <div className="w-16 h-16 rounded-3xl bg-sky-100 dark:bg-blue-950 text-sky-500 dark:text-sky-300 flex items-center justify-center mx-auto shadow-inner border border-sky-200 dark:border-blue-800">
                  <UserCheck className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-sky-100 text-base">
                    No Active User Session
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-sky-300/80 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    Access is strictly restricted to authenticated users. Enter your credentials on the form to sign in or register a new user.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SYSTEM SECURITY NOTICE */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white shadow-md border border-sky-400/30 space-y-2">
            <div className="flex items-center gap-2 text-sky-300 text-xs font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Protected System Portal</span>
            </div>
            <p className="text-xs text-sky-100/80 leading-relaxed font-medium">
              All transactions, inventory logs, expenses, and domain management views require active authentication.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN / SIGN UP / FORGOT PASSWORD FORM */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-2 border-sky-200/80 dark:border-blue-900/60 shadow-xl shadow-sky-900/10 space-y-6">
            
            {/* MODE SWITCH TABS */}
            <div className="flex bg-sky-50 dark:bg-blue-950/60 p-1.5 rounded-2xl border border-sky-200/80 dark:border-blue-900/60">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                  authMode === 'signin'
                    ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-sky-500/20'
                    : 'text-sky-800 dark:text-sky-200 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                  authMode === 'signup'
                    ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-sky-500/20'
                    : 'text-sky-800 dark:text-sky-200 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                  authMode === 'forgot'
                    ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-sky-500/20'
                    : 'text-sky-800 dark:text-sky-200 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Reset Password</span>
              </button>
            </div>

            {/* NOTIFICATION MESSAGES */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-3 animate-fade-in">
                <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name (Sign Up only) */}
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-extrabold text-slate-900 dark:text-sky-100 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-sky-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-sky-200 dark:border-blue-900/80 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-sky-100 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-extrabold text-slate-900 dark:text-sky-100 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-sky-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@domain.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-sky-200 dark:border-blue-900/80 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-sky-100 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password (Sign In & Sign Up) */}
              {authMode !== 'forgot' && (
                <div>
                  <label className="block text-xs font-extrabold text-slate-900 dark:text-sky-100 mb-1.5">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-sky-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 rounded-2xl border border-sky-200 dark:border-blue-900/80 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-sky-100 text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-sky-400 hover:text-sky-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Extra Sign Up Fields */}
              {authMode === 'signup' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 dark:text-sky-100 mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-sky-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-sky-200 dark:border-blue-900/80 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-sky-100 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-900 dark:text-sky-100 mb-1.5">
                        Department
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 absolute left-3.5 top-3.5 text-sky-400" />
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-sky-200 dark:border-blue-900/80 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-sky-100 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                        >
                          <option value="Sales & Operations">Sales & Operations</option>
                          <option value="Inventory & Warehouse">Inventory & Warehouse</option>
                          <option value="Customer Care">Customer Care</option>
                          <option value="Finance & Accounting">Finance & Accounting</option>
                          <option value="Executive Management">Executive Management</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 dark:text-sky-100 mb-1.5">
                      Account Role
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole('staff')}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                          role === 'staff'
                            ? 'border-sky-500 bg-sky-100 dark:bg-blue-950 font-extrabold'
                            : 'border-sky-200 dark:border-blue-900 text-slate-700 dark:text-sky-200'
                        }`}
                      >
                        <div className="text-xs font-black text-slate-900 dark:text-sky-100">Staff Access</div>
                        <div className="text-[10px] text-sky-600 dark:text-sky-300 mt-0.5">Sales, POS & basic inventory</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('admin')}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                          role === 'admin'
                            ? 'border-sky-500 bg-sky-100 dark:bg-blue-950 font-extrabold'
                            : 'border-sky-200 dark:border-blue-900 text-slate-700 dark:text-sky-200'
                        }`}
                      >
                        <div className="text-xs font-black text-slate-900 dark:text-sky-100">Administrator</div>
                        <div className="text-[10px] text-sky-600 dark:text-sky-300 mt-0.5">Full access & reports</div>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {authMode === 'signin' && (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Sign In</span>
                      </>
                    )}
                    {authMode === 'signup' && (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Create Account</span>
                      </>
                    )}
                    {authMode === 'forgot' && (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Send Password Reset Link</span>
                      </>
                    )}
                  </>
                )}
              </button>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
};
