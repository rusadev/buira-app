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
import { AuditLogView } from './components/audit/AuditLogView';
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
    <div className="h-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-hidden">
      <Navbar onOpenShiftModal={() => setIsShiftModalOpen(true)} />

      <div className="flex-1 min-h-0 flex min-w-0 overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-slate-50 overflow-hidden pb-14 md:pb-0">
          {activeTab === 'cashier' && <CashierView />}
          {activeTab === 'catalog' && <ProductCatalogView />}
          {activeTab === 'kds' && <KDSView />}
          {activeTab === 'tables' && <TableView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'roles' && <RoleManagementView />}
          {activeTab === 'users' && <UserManagementView />}
          {activeTab === 'transactions' && <TransactionHistoryView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'audit' && <AuditLogView />}
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

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('POS Application Error Caught:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-white border border-slate-300 p-8 max-w-md w-full shadow-lg space-y-4 rounded-none">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-none flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-base font-extrabold text-slate-900">Terjadi Kesalahan Aplikasi</h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {this.state.error?.message || 'Sistem mengalami kendala sementara saat memuat tampilan.'}
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-none bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all"
              style={{ outline: 'none' }}
            >
              Reset Cache & Muat Ulang Aplikasi
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <POSProvider>
        <MainAppContent />
      </POSProvider>
    </ErrorBoundary>
  );
}
