import React, { useState } from 'react';
import { User, Role } from '../types';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  Building, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  KeyRound,
  ShieldAlert,
  Send
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Sales');
  const [role, setRole] = useState<Role>('staff');

  if (!isOpen) return null;

  const handleFillDemo = (demoRole: 'admin' | 'staff') => {
    if (demoRole === 'admin') {
      setEmail('admin@lilacdream.com');
      setPassword('admin123');
    } else {
      setEmail('staff@lilacdream.com');
      setPassword('staff123');
    }
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to sign in.');
        
        onLoginSuccess(data.user);
        onClose();
      } else if (mode === 'signup') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, phone, department, role })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed.');

        if (data.user.status === 'pending') {
          setSuccessMsg('Account created! Your sign-up is pending Admin approval.');
        } else {
          setSuccessMsg('Account created successfully! You can now log in.');
          setMode('signin');
        }
      } else if (mode === 'forgot') {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Reset request failed.');

        setSuccessMsg(data.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#1A112E] rounded-3xl border border-purple-100 dark:border-purple-800/80 shadow-2xl shadow-purple-900/30 overflow-hidden transition-all">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Sparkles className="w-6 h-6 text-purple-100" />
          </div>
          
          <h2 className="text-xl font-bold tracking-tight">
            {mode === 'signin' && 'Welcome to Lilac Dream'}
            {mode === 'signup' && 'Create Staff / Admin Account'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="text-xs text-purple-100/80 mt-1">
            {mode === 'signin' && 'Sign in to access your sales & management portal'}
            {mode === 'signup' && 'Register your details for role approval'}
            {mode === 'forgot' && 'Send a secure reset link to your registered email'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">

          {/* Preset Fill Quick Buttons */}
          {mode === 'signin' && (
            <div className="mb-5 p-3 rounded-2xl bg-purple-50/80 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60">
              <div className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" /> Quick Demo Fill:
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin')}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium shadow-sm transition-all"
                >
                  Admin Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('staff')}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm transition-all"
                >
                  Staff Demo
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Penelope Cruz"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@lilacdream.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-purple-400 hover:text-purple-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555)..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                      Department
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Sales / Inventory"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Requested Account Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-[#120B24] text-purple-950 dark:text-purple-100 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="staff">User / Staff (Requires Admin Approval)</option>
                    <option value="admin">Administrator (Full System Access)</option>
                  </select>
                </div>
              </>
            )}

            {mode === 'signin' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-purple-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Register Account'}
                  {mode === 'forgot' && 'Send Reset Link'}
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Switch */}
          <div className="mt-5 text-center text-xs text-purple-600/80 dark:text-purple-400/80">
            {mode === 'signin' ? (
              <span>
                Don't have an account?{' '}
                <button
                  onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="font-semibold text-purple-700 dark:text-purple-300 hover:underline"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Remembered your password?{' '}
                <button
                  onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="font-semibold text-purple-700 dark:text-purple-300 hover:underline"
                >
                  Back to Sign In
                </button>
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
