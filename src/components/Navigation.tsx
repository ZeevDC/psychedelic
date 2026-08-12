import React, { useState } from 'react';
import { Role } from '../types';
import { 
  LayoutDashboard, 
  Package, 
  Receipt, 
  TrendingUp, 
  Wallet, 
  Users, 
  FileSpreadsheet,
  Mail,
  Globe,
  Tv,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  KeyRound
} from 'lucide-react';

export type NavTab = 'dashboard' | 'gmail_tracker' | 'domains' | 'profiles' | 'products' | 'expenses' | 'sales' | 'payroll' | 'reports' | 'team' | 'auth';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentRole: Role;
  pendingApprovalsCount: number;
  lowStockCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  pendingApprovalsCount,
  lowStockCount
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'gmail_tracker' as NavTab,
      label: 'Gmail Subscriptions',
      icon: Mail,
      badge: 'SYNC',
      badgeColor: 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200 font-bold'
    },
    {
      id: 'domains' as NavTab,
      label: 'Domain Tracker',
      icon: Globe,
      badge: null
    },
    {
      id: 'profiles' as NavTab,
      label: 'Account Profiles',
      icon: Tv,
      badge: 'STREAM',
      badgeColor: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200 font-bold'
    },
    {
      id: 'products' as NavTab,
      label: 'Price Catalog & Slots',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : null,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
    },
    {
      id: 'expenses' as NavTab,
      label: 'Financials & Expenses',
      icon: Receipt,
      badge: null
    },
    {
      id: 'sales' as NavTab,
      label: 'Sales & Performance',
      icon: TrendingUp,
      badge: null
    },
    {
      id: 'payroll' as NavTab,
      label: 'Payroll & Salary',
      icon: Wallet,
      badge: null
    },
    {
      id: 'reports' as NavTab,
      label: 'Dynamic Reports',
      icon: FileSpreadsheet,
      badge: null
    },
    {
      id: 'team' as NavTab,
      label: 'Team & Access',
      icon: Users,
      badge: currentRole === 'owner' && pendingApprovalsCount > 0 ? `${pendingApprovalsCount} Pending` : null,
      badgeColor: 'bg-sky-200 text-sky-900 dark:bg-sky-900 dark:text-sky-200 font-bold',
      ownerOnly: true
    },
    {
      id: 'auth' as NavTab,
      label: 'Account Portal',
      icon: KeyRound,
      badge: 'AUTH',
      badgeColor: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 font-bold'
    }
  ];

  const activeTabObject = tabs.find(t => t.id === activeTab) || tabs[0];
  const ActiveIcon = activeTabObject.icon;

  const handleSelectTab = (tabId: NavTab) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Sticky Compact Navigation Bar featuring Hamburger Menu Trigger */}
      <nav className="bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border-b-2 border-sky-300/40 dark:border-blue-900/40 px-3 sm:px-6 md:px-8 py-2 sticky top-[57px] sm:top-[65px] z-30 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-md shadow-sky-500/20 active:scale-95 transition-all border border-sky-300/40"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-sky-200" />
            ) : (
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-sky-200" />
            )}
            <span className="tracking-wide uppercase text-[11px] sm:text-xs">Menu</span>
          </button>

          {/* Active Section Label Breadcrumb */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50/80 dark:bg-blue-950/80 border border-sky-200/60 dark:border-blue-800/60 text-slate-900 dark:text-sky-100 text-xs sm:text-sm font-semibold truncate">
            <ActiveIcon className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0" />
            <span className="truncate">{activeTabObject.label}</span>
            {activeTabObject.badge && (
              <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-extrabold shrink-0 border border-sky-300/40 ${activeTabObject.badgeColor || 'bg-sky-100 text-sky-900'}`}>
                {activeTabObject.badge}
              </span>
            )}
          </div>

          {/* Quick Tab Pills (Visible on large screens for instant access) */}
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {tabs.slice(0, 5).map(tab => {
              if (tab.ownerOnly && currentRole !== 'owner') return null;
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                    isActive
                      ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                      : 'bg-white/60 dark:bg-blue-950/60 text-slate-800 dark:text-sky-200/70 border-sky-200/60 dark:border-blue-800/60 hover:border-sky-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </nav>

      {/* Hamburger Drawer Overlay & Side Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop Dimmer */}
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-out Navigation Drawer */}
          <div className="relative z-10 w-full max-w-xs sm:max-w-sm bg-white dark:bg-[#0F172A] h-full shadow-2xl border-r-2 border-sky-300/40 dark:border-blue-800/60 flex flex-col justify-between animate-slide-in">
            
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-sky-100 dark:border-blue-900/60 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-300" />
                <h2 className="font-black text-lg tracking-wider">
                  Navigation Menu
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                aria-label="Close Navigation Menu"
              >
                <X className="w-5 h-5 text-sky-200" />
              </button>
            </div>

            {/* Nav Tabs List */}
            <div className="p-3 sm:p-4 space-y-1.5 overflow-y-auto flex-1">
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-sky-600 dark:text-sky-400 px-3 py-1">
                Main Workspaces
              </div>
              {tabs.map(tab => {
                if (tab.ownerOnly && currentRole !== 'owner') return null;

                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs sm:text-sm font-bold transition-all border-2 text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white border-sky-300 shadow-md shadow-sky-500/20 scale-[1.01]'
                        : 'bg-sky-50/60 dark:bg-blue-950/60 text-slate-900 dark:text-sky-100 border-sky-200/50 dark:border-blue-900/50 hover:bg-sky-100 dark:hover:bg-blue-900 hover:border-sky-400'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20 text-sky-200' : 'bg-sky-100 dark:bg-blue-900/60 text-sky-600 dark:text-sky-300'}`}>
                        <Icon className="w-4 h-4 shrink-0" />
                      </div>
                      <span className="truncate">{tab.label}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {tab.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border border-sky-300/40 ${tab.badgeColor || 'bg-sky-200 text-sky-900'}`}>
                          {tab.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-sky-200' : 'text-sky-400'}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-sky-100 dark:border-blue-900/60 bg-sky-50/50 dark:bg-blue-950/80 text-xs">
              <div className="flex items-center justify-between text-sky-700 dark:text-sky-300 font-semibold">
                <span>Role: <strong className="capitalize text-slate-900 dark:text-sky-100">{currentRole}</strong></span>
                <span className="text-[10px] bg-sky-200 dark:bg-blue-900 px-2 py-0.5 rounded-full font-bold text-sky-900 dark:text-sky-100">Dreamy Moonlight</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
