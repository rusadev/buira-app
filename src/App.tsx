import React, { useState } from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CashierView } from './components/cashier/CashierView';
import { ProductCatalogView } from './components/catalog/ProductCatalogView';
import { KDSView } from './components/kds/KDSView';
import { TableView } from './components/tables/TableView';
import { InventoryView } from './components/inventory/InventoryView';
import { RoleManagementView } from './components/roles/RoleManagementView';
import { UserManagementView } from './components/users/UserManagementView';
import { TransactionHistoryView } from './components/transactions/TransactionHistoryView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { ShiftModal } from './components/shift/ShiftModal';
import { LoginView } from './components/auth/LoginView';

const MainAppContent: React.FC = () => {
  const { activeTab, currentUser } = usePOS();
  const [isShiftModalOpen, setIsShiftModalOpen] = useState<boolean>(false);

  // Render Login view if user is not authenticated
  if (!currentUser) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar onOpenShiftModal={() => setIsShiftModalOpen(true)} />

      <div className="flex-1 flex min-w-0 overflow-hidden pb-14 md:pb-0">
        <Sidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
          {activeTab === 'cashier' && <CashierView />}
          {activeTab === 'catalog' && <ProductCatalogView />}
          {activeTab === 'kds' && <KDSView />}
          {activeTab === 'tables' && <TableView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'roles' && <RoleManagementView />}
          {activeTab === 'users' && <UserManagementView />}
          {activeTab === 'transactions' && <TransactionHistoryView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Smartphone Bottom Navigation Bar */}
      <MobileBottomNav />

      {isShiftModalOpen && (
        <ShiftModal onClose={() => setIsShiftModalOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <POSProvider>
      <MainAppContent />
    </POSProvider>
  );
}
