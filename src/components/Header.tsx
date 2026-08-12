import React from 'react';
import { User, Role } from '../types';
import { 
  Sparkles, 
  Moon, 
  Sun, 
  PlusCircle, 
  Shield, 
  UserCheck, 
  LogOut, 
  User as UserIcon,
  Bell,
  ChevronDown,
  RefreshCw
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenNewSale: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  lowStockCount: number;
  onResetData?: (mode: 'zero' | 'sample') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentRole,
  onRoleChange,
  darkMode,
  onToggleDarkMode,
  onOpenNewSale,
  onOpenProfile,
  onOpenAuth,
  onLogout,
  lowStockCount,
  onResetData
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#180E2B]/90 backdrop-blur-md border-b-2 border-[#A895E8]/60 dark:border-purple-900/60 px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src="/src/assets/images/psychedelic_logo_1785429226516.jpg"
            alt="Psychedelic Logo"
            className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl object-cover shadow-md shadow-purple-400/30 border-2 border-purple-200/80 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-2xl font-serif font-black tracking-widest bg-gradient-to-r from-purple-900 via-fuchsia-600 to-indigo-700 dark:from-purple-200 dark:via-fuchsia-300 dark:to-indigo-200 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-1">
                <span>Psychedelic</span>
                <span className="text-amber-400 text-[10px] sm:text-xs">✦</span>
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] text-purple-700/80 dark:text-purple-300/70 hidden sm:block font-medium">
              Sales, Inventory, Financials, Domains & Subscriptions
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Quick Role Switcher Pill for Demo / RBAC Testing */}
          <div className="hidden md:flex items-center bg-purple-50/80 dark:bg-purple-950/60 p-1 rounded-xl border border-purple-200/60 dark:border-purple-800/60 text-xs">
            <span className="text-[11px] font-medium text-purple-600 dark:text-purple-300 px-2 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Test Role:
            </span>
            <button
              onClick={() => onRoleChange('admin')}
              className={`px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1 ${
                currentRole === 'admin'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => onRoleChange('staff')}
              className={`px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1 ${
                currentRole === 'staff'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50'
              }`}
            >
              Staff
            </button>
          </div>

          {/* Data Mode Control (Start Fresh / Zero) */}
          {onResetData && (
            <div className="hidden lg:flex items-center gap-1 bg-purple-50/80 dark:bg-purple-950/60 p-1 rounded-xl border border-purple-200/60 dark:border-purple-800/60 text-xs">
              <button
                onClick={() => {
                  if (confirm('Start completely fresh from zero (clear all products, sales, expenses, payroll)?')) {
                    onResetData('zero');
                  }
                }}
                className="px-2.5 py-1 rounded-lg text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/50 font-bold flex items-center gap-1"
                title="Clear all database records to 0"
              >
                <RefreshCw className="w-3 h-3" /> Start Fresh (0)
              </button>
              <button
                onClick={() => onResetData('sample')}
                className="px-2 py-1 rounded-lg text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 font-medium"
                title="Load sample data"
              >
                Load Sample
              </button>
            </div>
          )}

          {/* Quick New Sale POS Button */}
          <button
            onClick={onOpenNewSale}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 font-medium text-xs sm:text-sm shadow-md shadow-purple-500/20 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log Sale</span>
          </button>

          {/* Dark / Light Lavender Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title="Toggle Lavender Theme"
            className="p-2 rounded-xl bg-purple-50/80 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/60 border border-purple-200/50 dark:border-purple-800/50 transition-all"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Low Stock Alert Indicator */}
          {lowStockCount > 0 && (
            <div className="relative" title={`${lowStockCount} items low on stock!`}>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <Bell className="w-4 h-4 animate-bounce" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {lowStockCount}
                </span>
              </div>
            </div>
          )}

          {/* User Account / Profile Menu */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/40 border border-transparent hover:border-purple-200/60 dark:hover:border-purple-800 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center ring-2 ring-purple-300 dark:ring-purple-700 shadow-sm shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-semibold text-purple-950 dark:text-purple-100 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-purple-600 dark:text-purple-400 capitalize">
                    {currentRole} Role
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#1A112E] border border-purple-100 dark:border-purple-900 shadow-xl shadow-purple-950/10 py-2 z-50">
                  <div className="px-4 py-2 border-b border-purple-100 dark:border-purple-900/50">
                    <div className="text-xs font-semibold text-purple-950 dark:text-purple-100">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-purple-500 dark:text-purple-400 truncate">
                      {currentUser.email}
                    </div>
                  </div>

                  <button
                    onClick={() => { setMenuOpen(false); onOpenProfile(); }}
                    className="w-full text-left px-4 py-2 text-xs text-purple-800 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/40 flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>My Profile & Settings</span>
                  </button>

                  <div className="px-4 py-1.5 md:hidden border-t border-purple-100 dark:border-purple-900/50 mt-1">
                    <div className="text-[10px] text-purple-400 uppercase font-semibold mb-1">Switch Test Role</div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => { onRoleChange('owner'); setMenuOpen(false); }}
                        className={`flex-1 py-1 text-[11px] rounded font-bold ${currentRole === 'owner' ? 'bg-purple-600 text-white' : 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'}`}
                      >
                        Owner
                      </button>
                      <button
                        onClick={() => { onRoleChange('admin'); setMenuOpen(false); }}
                        className={`flex-1 py-1 text-[11px] rounded font-bold ${currentRole === 'admin' ? 'bg-purple-600 text-white' : 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'}`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-purple-100 dark:border-purple-900/50 mt-1 pt-1">
                    <button
                      onClick={() => { setMenuOpen(false); onLogout(); }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800 text-xs font-semibold transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In / Demo</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
