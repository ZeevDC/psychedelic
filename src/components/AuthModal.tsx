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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const endpoint = mode === 'signin' 
        ? '/api/auth/login' 
        : (mode === 'signup' ? '/api/auth/register' : '/api/auth/forgot-password');

      const payload = mode === 'signin'
        ? { email, password }
        : (mode === 'signup' ? { name, email, password, phone, department, role } : { email });

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let data: any = {};
      const contentType = res.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        data = await res.json().catch(() => ({}));
      } else {
        const textText = await res.text().catch(() => '');
        data = { error: textText || `Server returned status ${res.status}` };
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
      }

      if (mode === 'signin' || mode === 'signup') {
        const loggedUser = data.user || {
          id: `usr_${Date.now()}`,
          name: name || email.split('@')[0] || 'User',
          email,
          role: role || 'admin',
          phone: phone || '',
          department: department || 'General',
          status: 'active',
          createdAt: new Date().toISOString()
        };
        setSuccessMsg(`Welcome, ${loggedUser.name}!`);
        onLoginSuccess(loggedUser);
        onClose();
      } else {
        setSuccessMsg(data.message || 'Password reset request dispatched.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0F172A] rounded-3xl border-2 border-sky-300/40 dark:border-blue-900/80 shadow-2xl shadow-sky-950/30 overflow-hidden transition-all">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 text-white text-center relative border-b border-sky-400/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner border border-sky-400/30">
            <Sparkles className="w-6 h-6 text-sky-300" />
          </div>
          
          <h2 className="text-xl font-bold tracking-tight">
            {mode === 'signin' && 'Sign Into Your Account'}
            {mode === 'signup' && 'Create Staff / Admin Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-sky-100/80 mt-1 font-medium">
            {mode === 'signin' && 'Enter your credentials to access system features'}
            {mode === 'signup' && 'Register your details to create an account'}
            {mode === 'forgot' && 'Send a secure reset link to your email'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">

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
                <label className="block text-xs font-bold text-slate-900 dark:text-sky-100 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3 text-sky-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sky-200 dark:border-blue-900/80 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-sky-100 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-sky-100 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-sky-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@domain.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sky-200 dark:border-blue-900/80 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-sky-100 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-sky-100 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-sky-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-sky-200 dark:border-blue-900/80 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-sky-100 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-sky-400 hover:text-sky-600"
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
                    <label className="block text-xs font-bold text-slate-900 dark:text-sky-100 mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-sky-400" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555)..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-sky-200 dark:border-blue-900/80 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-sky-100 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 dark:text-sky-100 mb-1">
                      Department
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-3 text-sky-400" />
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Sales / Ops"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-sky-200 dark:border-blue-900/80 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-sky-100 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-sky-100 mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full px-3 py-2 rounded-xl border border-sky-200 dark:border-blue-900/80 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-sky-100 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                  >
                    <option value="staff">Staff Access</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </>
            )}

            {mode === 'signin' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white font-black text-xs sm:text-sm shadow-md shadow-sky-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
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
          <div className="mt-5 text-center text-xs text-sky-600 dark:text-sky-400">
            {mode === 'signin' ? (
              <span>
                Don't have an account?{' '}
                <button
                  onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="font-bold text-sky-700 dark:text-sky-300 hover:underline"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Remembered your password?{' '}
                <button
                  onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="font-bold text-sky-700 dark:text-sky-300 hover:underline"
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
