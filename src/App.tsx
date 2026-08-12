import React, { useState, useEffect } from 'react';
import { User, Role, Product, InventoryLog, Expense, FundTransfer, Sale, PayrollRecord, KPIStats, DomainRecord, AccountProfileRecord } from './types';
import { initialUsers } from './data/mockData';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { ExpensesView } from './components/ExpensesView';
import { SalesView } from './components/SalesView';
import { PayrollView } from './components/PayrollView';
import { AdminUsersView } from './components/AdminUsersView';
import { CustomReportsView } from './components/CustomReportsView';
import { GmailTrackerView } from './components/GmailTrackerView';
import { DomainTrackerView } from './components/DomainTrackerView';
import { AccountProfilesView } from './components/AccountProfilesView';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // User & RBAC state
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers[0]); // Elena Vance (Admin)
  const [currentRole, setCurrentRole] = useState<Role>('admin');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);

  // Data Stores (starts from zero as requested)
  const [products, setProducts] = useState<Product[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [transfers, setTransfers] = useState<FundTransfer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [users, setUsers] = useState<User[]>([initialUsers[0]]);
  const [domains, setDomains] = useState<DomainRecord[]>([]);
  const [accountProfiles, setAccountProfiles] = useState<AccountProfileRecord[]>([]);

  // Domain Handlers
  const handleAddDomain = (domainData: Omit<DomainRecord, 'id'>) => {
    const newDomain: DomainRecord = {
      ...domainData,
      id: `dom_${Date.now()}`
    };
    setDomains(prev => [newDomain, ...prev]);
  };

  const handleUpdateDomain = (updated: DomainRecord) => {
    setDomains(prev => prev.map(d => d.id === updated.id ? updated : d));
  };

  const handleDeleteDomain = (id: string) => {
    setDomains(prev => prev.filter(d => d.id !== id));
  };

  // Account Profile Handlers
  const handleAddProfile = (profileData: Omit<AccountProfileRecord, 'id'>) => {
    const newProfile: AccountProfileRecord = {
      ...profileData,
      id: `prof_${Date.now()}`
    };
    setAccountProfiles(prev => [newProfile, ...prev]);
  };

  const handleUpdateProfile = (updated: AccountProfileRecord) => {
    setAccountProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProfile = (id: string) => {
    setAccountProfiles(prev => prev.filter(p => p.id !== id));
  };

  // KPIs
  const [kpis, setKpis] = useState<KPIStats>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    totalSalesCount: 0,
    lowStockItemsCount: 0,
    pendingPayrollCount: 0,
    pendingTransfersCount: 0
  });

  // Fetch initial state from Express backend
  const refreshData = async () => {
    try {
      const [kpiRes, prodRes, invRes, expRes, trfRes, salRes, payRes, usrRes] = await Promise.all([
        fetch('/api/kpi').then(r => r.ok ? r.json() : null),
        fetch('/api/products').then(r => r.ok ? r.json() : null),
        fetch('/api/inventory/logs').then(r => r.ok ? r.json() : null),
        fetch('/api/expenses').then(r => r.ok ? r.json() : null),
        fetch('/api/transfers').then(r => r.ok ? r.json() : null),
        fetch('/api/sales').then(r => r.ok ? r.json() : null),
        fetch('/api/payroll').then(r => r.ok ? r.json() : null),
        fetch('/api/users').then(r => r.ok ? r.json() : null)
      ]);

      if (kpiRes) setKpis(kpiRes);
      if (prodRes) setProducts(prodRes);
      if (invRes) setInventoryLogs(invRes);
      if (expRes) setExpenses(expRes);
      if (trfRes) setTransfers(trfRes);
      if (salRes) setSales(salRes);
      if (payRes) setPayrollRecords(payRes);
      if (usrRes) setUsers(usrRes);
    } catch (err) {
      console.warn('Backend offline or falling back to local state:', err);
    }
  };

  // Reset Data handler
  const handleResetData = async (mode: 'zero' | 'sample') => {
    try {
      await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      });
      if (mode === 'zero') {
        setDomains([]);
        setAccountProfiles([]);
      }
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Sync dark mode class to HTML tag
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle Role Change
  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    }
  };

  // Mutations
  const handleAddProduct = async (productData: any) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProduct = async (id: string, productData: any) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdjustStock = async (productId: string, changeQuantity: number, reason: any, notes: string) => {
    try {
      const res = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          changeQuantity,
          reason,
          performedBy: currentUser ? currentUser.name : 'Staff',
          notes
        })
      });
      if (res.ok) refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExpense = async (expenseData: any) => {
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...expenseData,
          recordedBy: currentUser ? currentUser.name : 'Staff'
        })
      });
      if (res.ok) refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTransfer = async (transferData: any) => {
    try {
      const res = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...transferData,
          initiatedBy: currentUser ? currentUser.name : 'Staff'
        })
      });
      if (res.ok) refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTransferStatus = async (id: string, status: 'Pending' | 'Completed' | 'Failed') => {
    try {
      const res = await fetch(`/api/transfers/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSale = async (saleData: any) => {
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      });
      if (res.ok) refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPayroll = async (payrollData: any) => {
    try {
      const res = await fetch('/api/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payrollData)
      });
      if (res.ok) refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReleasePayroll = async (id: string, releasedBy: string) => {
    try {
      const res = await fetch(`/api/payroll/${id}/release`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ releasedBy })
      });
      if (res.ok) refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (updates: Partial<User>) => {
    if (!currentUser) return;
    handleUpdateUser(currentUser.id, updates);
    setCurrentUser({ ...currentUser, ...updates });
  };

  const lowStockCount = products.filter(p => p.status === 'active' && p.stockQuantity <= p.minStockLevel).length;
  const pendingApprovalsCount = users.filter(u => u.status === 'pending').length;

  return (
    <div className="min-h-screen bg-cozy-pattern text-purple-950 dark:text-purple-100 transition-colors duration-200 font-sans selection:bg-purple-200 dark:selection:bg-purple-900 pb-12">
      
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenNewSale={() => { setActiveTab('sales'); setIsNewSaleOpen(true); }}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => setCurrentUser(null)}
        lowStockCount={lowStockCount}
        onResetData={handleResetData}
      />

      {/* Main Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentRole={currentRole}
        pendingApprovalsCount={pendingApprovalsCount}
        lowStockCount={lowStockCount}
      />

      {/* Primary Page Workspace */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            kpis={kpis}
            sales={sales}
            products={products}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenNewSale={() => { setActiveTab('sales'); setIsNewSaleOpen(true); }}
          />
        )}

        {activeTab === 'gmail_tracker' && (
          <GmailTrackerView />
        )}

        {activeTab === 'domains' && (
          <DomainTrackerView
            domains={domains}
            onAddDomain={handleAddDomain}
            onUpdateDomain={handleUpdateDomain}
            onDeleteDomain={handleDeleteDomain}
            onResetDomains={() => setDomains([])}
          />
        )}

        {activeTab === 'profiles' && (
          <AccountProfilesView
            profiles={accountProfiles}
            onAddProfile={handleAddProfile}
            onUpdateProfile={handleUpdateProfile}
            onDeleteProfile={handleDeleteProfile}
            onResetProfiles={() => setAccountProfiles([])}
          />
        )}

        {activeTab === 'products' && (
          <ProductsView
            products={products}
            inventoryLogs={inventoryLogs}
            currentRole={currentRole}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onAdjustStock={handleAdjustStock}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesView
            expenses={expenses}
            transfers={transfers}
            onAddExpense={handleAddExpense}
            onAddTransfer={handleAddTransfer}
            onUpdateTransferStatus={handleUpdateTransferStatus}
          />
        )}

        {activeTab === 'sales' && (
          <SalesView
            sales={sales}
            products={products}
            users={users}
            currentUser={currentUser}
            onAddSale={handleAddSale}
          />
        )}

        {activeTab === 'payroll' && (
          <PayrollView
            payrollRecords={payrollRecords}
            users={users}
            currentRole={currentRole}
            currentUser={currentUser}
            onAddPayroll={handleAddPayroll}
            onReleasePayroll={handleReleasePayroll}
          />
        )}

        {activeTab === 'reports' && (
          <CustomReportsView
            sales={sales}
            expenses={expenses}
            payrollRecords={payrollRecords}
            products={products}
            users={users}
          />
        )}

        {activeTab === 'team' && (
          <AdminUsersView
            users={users}
            currentRole={currentRole}
            onUpdateUser={handleUpdateUser}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentRole(user.role);
        }}
      />

      {/* User Profile Modal */}
      {currentUser && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          currentUser={currentUser}
          onSaveProfile={handleSaveProfile}
        />
      )}

    </div>
  );
}
