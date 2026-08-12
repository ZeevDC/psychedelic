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
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border-b-2 border-sky-300/50 dark:border-blue-900/60 px-3 sm:px-6 lg:px-8 py-2.5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <img
            src="/src/assets/images/psychedelic_logo_1785429226516.jpg"
            alt="Psychedelic Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl object-cover shadow-md shadow-sky-500/20 border-2 border-sky-300/80 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-2xl font-black tracking-wider bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-sky-100 dark:via-sky-200 dark:to-indigo-200 bg-clip-text text-transparent flex items-center gap-1.5">
                <span>Psychedelic Hub</span>
                <Moon className="w-4 h-4 text-sky-400 fill-sky-400/20" />
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] text-sky-800/80 dark:text-sky-300/70 hidden sm:block font-medium">
              Sales, Inventory, Financials & Workspace
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Data Mode Control (Start Fresh / Zero) */}
          {currentUser && onResetData && (
            <div className="hidden lg:flex items-center gap-1 bg-sky-50/80 dark:bg-blue-950/60 p-1 rounded-xl border border-sky-200/80 dark:border-blue-900/60 text-xs">
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
            </div>
          )}

          {/* Quick New Sale POS Button */}
          {currentUser && (
            <button
              onClick={onOpenNewSale}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-sky-500/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Sale</span>
            </button>
          )}

          {/* Dark / Light Moonlight Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            title="Toggle Moonlight Theme"
            className="p-2 rounded-xl bg-sky-50 dark:bg-blue-950 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-blue-900 border border-sky-200 dark:border-blue-800 transition-all"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Low Stock Alert Indicator */}
          {currentUser && lowStockCount > 0 && (
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
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-sky-50 dark:hover:bg-blue-950 border border-transparent hover:border-sky-200 dark:hover:border-blue-800 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-white flex items-center justify-center font-bold ring-2 ring-sky-300 dark:ring-blue-700 shadow-sm shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-slate-900 dark:text-sky-100 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-sky-600 dark:text-sky-400 capitalize">
                    {currentRole}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0F172A] border border-sky-200 dark:border-blue-900 shadow-xl shadow-sky-950/20 py-2 z-50">
                  <div className="px-4 py-2 border-b border-sky-100 dark:border-blue-900/50">
                    <div className="text-xs font-extrabold text-slate-900 dark:text-sky-100">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-sky-600 dark:text-sky-400 truncate">
                      {currentUser.email}
                    </div>
                  </div>

                  <button
                    onClick={() => { setMenuOpen(false); onOpenProfile(); }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-800 dark:text-sky-200 hover:bg-sky-50 dark:hover:bg-blue-950 flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>My Profile & Settings</span>
                  </button>

                  <div className="border-t border-sky-100 dark:border-blue-900/50 mt-1 pt-1">
                    <button
                      onClick={() => { setMenuOpen(false); onLogout(); }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-sky-500/20 hover:from-sky-600 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
