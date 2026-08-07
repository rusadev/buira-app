import React, { useState } from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { CashierView } from './components/cashier/CashierView';
import { ProductCatalogView } from './components/catalog/ProductCatalogView';
import { KDSView } from './components/kds/KDSView';
import { TableView } from './components/tables/TableView';
import { InventoryView } from './components/inventory/InventoryView';
import { TransactionHistoryView } from './components/transactions/TransactionHistoryView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { ShiftModal } from './components/shift/ShiftModal';

const MainAppContent: React.FC = () => {
  const { activeTab } = usePOS();
  const [isShiftModalOpen, setIsShiftModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Navbar onOpenShiftModal={() => setIsShiftModalOpen(true)} />

      <div className="flex-1 flex min-w-0 overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-hidden">
          {activeTab === 'cashier' && <CashierView />}
          {activeTab === 'catalog' && <ProductCatalogView />}
          {activeTab === 'kds' && <KDSView />}
          {activeTab === 'tables' && <TableView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'transactions' && <TransactionHistoryView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

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
