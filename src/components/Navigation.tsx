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
  Sparkles
} from 'lucide-react';

export type NavTab = 'dashboard' | 'gmail_tracker' | 'domains' | 'profiles' | 'products' | 'expenses' | 'sales' | 'payroll' | 'reports' | 'team';

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
      badge: 'LILAC',
      badgeColor: 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200 font-bold'
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
      badgeColor: 'bg-purple-200 text-purple-900 dark:bg-purple-900 dark:text-purple-200 font-bold',
      ownerOnly: true
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
      <nav className="bg-white/90 dark:bg-[#180E2B]/90 backdrop-blur-md border-b-2 border-[#A895E8]/40 dark:border-purple-900/40 px-3 sm:px-6 md:px-8 py-2 sticky top-[57px] sm:top-[65px] z-30 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/25 active:scale-95 transition-all border border-purple-300/40"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
            ) : (
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
            )}
            <span className="tracking-wide uppercase text-[11px] sm:text-xs">Menu</span>
          </button>

          {/* Active Section Label Breadcrumb */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50/80 dark:bg-[#22153E]/80 border border-purple-200/60 dark:border-purple-800/60 text-purple-950 dark:text-purple-100 text-xs sm:text-sm font-semibold truncate">
            <ActiveIcon className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="truncate">{activeTabObject.label}</span>
            {activeTabObject.badge && (
              <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-extrabold shrink-0 border border-purple-300/40 ${activeTabObject.badgeColor || 'bg-purple-100 text-purple-900'}`}>
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
                      ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                      : 'bg-white/60 dark:bg-[#20133A]/60 text-purple-950/70 dark:text-purple-200/70 border-purple-200/60 dark:border-purple-800/60 hover:border-purple-400'
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
            className="fixed inset-0 bg-purple-950/60 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-out Navigation Drawer */}
          <div className="relative z-10 w-full max-w-xs sm:max-w-sm bg-white dark:bg-[#160D27] h-full shadow-2xl border-r-2 border-purple-300/40 dark:border-purple-800/60 flex flex-col justify-between animate-slide-in">
            
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-purple-100 dark:border-purple-900/60 flex items-center justify-between bg-gradient-to-r from-purple-800 to-indigo-800 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h2 className="font-serif font-black text-lg tracking-wider">
                  Navigation Menu
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                aria-label="Close Navigation Menu"
              >
                <X className="w-5 h-5 text-amber-200" />
              </button>
            </div>

            {/* Nav Tabs List */}
            <div className="p-3 sm:p-4 space-y-1.5 overflow-y-auto flex-1">
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-purple-600 dark:text-purple-400 px-3 py-1">
                Main Views & Workspaces
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
                        ? 'bg-gradient-to-r from-[#9B87ED] to-[#7D66DC] text-white border-purple-300 shadow-md shadow-purple-500/20 scale-[1.01]'
                        : 'bg-purple-50/60 dark:bg-[#1E1236]/60 text-purple-950 dark:text-purple-100 border-purple-200/50 dark:border-purple-900/50 hover:bg-purple-100 dark:hover:bg-[#281849] hover:border-purple-400'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20 text-amber-200' : 'bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300'}`}>
                        <Icon className="w-4 h-4 shrink-0" />
                      </div>
                      <span className="truncate">{tab.label}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {tab.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border border-purple-300/40 ${tab.badgeColor || 'bg-purple-200 text-purple-900'}`}>
                          {tab.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-amber-200' : 'text-purple-400'}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-purple-100 dark:border-purple-900/60 bg-purple-50/50 dark:bg-[#1B1030] text-xs">
              <div className="flex items-center justify-between text-purple-700 dark:text-purple-300 font-semibold">
                <span>Role: <strong className="capitalize text-purple-950 dark:text-purple-100">{currentRole}</strong></span>
                <span className="text-[10px] bg-purple-200 dark:bg-purple-900 px-2 py-0.5 rounded-full font-bold">Psychedelic Hub</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
