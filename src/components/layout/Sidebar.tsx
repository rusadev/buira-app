import React from 'react';
import { usePOS } from '../../context/POSContext';
import type { NavTab } from '../../context/POSContext';
import { 
  ShoppingCart, 
  Package, 
  ChefHat, 
  LayoutGrid, 
  Boxes, 
  Receipt, 
  BarChart3, 
  Settings,
  Users,
  X
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, cart, currentEntityId, isSidebarOpen, setIsSidebarOpen } = usePOS();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'cashier', label: 'Kasir / POS', icon: <ShoppingCart className="w-4 h-4" />, badge: cartCount },
    { id: 'catalog', label: 'Katalog Produk', icon: <Package className="w-4 h-4" /> },
    { id: 'kds', label: 'Kitchen / Bar KDS', icon: <ChefHat className="w-4 h-4" /> },
    { id: 'tables', label: 'Denah Meja', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'inventory', label: 'Stok Bahan Baku', icon: <Boxes className="w-4 h-4" /> },
    { id: 'users', label: 'Kelola Staf & User', icon: <Users className="w-4 h-4" /> },
    { id: 'transactions', label: 'Riwayat Struk', icon: <Receipt className="w-4 h-4" /> },
    { id: 'reports', label: 'Laporan Omset', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Pengaturan Toko', icon: <Settings className="w-4 h-4" /> },
  ];

  const activeColor = currentEntityId === 'coffee_shop' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white';

  const handleSelectTab = (tabId: NavTab) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-transform duration-200 ease-in-out md:static md:translate-x-0 md:min-h-[calc(100vh-61px)]
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between md:hidden">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Menu Navigasi POS</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? `${activeColor}` 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-white text-slate-900' : 'bg-amber-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-200 text-slate-500 text-[11px] leading-relaxed">
          <p className="font-bold text-slate-700">Buira POS F&B Enterprise</p>
          <p>Multi-Tenant Merchant App</p>
        </div>
      </aside>
    </>
  );
};
