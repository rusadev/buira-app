import React, { useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import type { NavTab } from '../../context/POSContext';
import { getUserPermissions } from '../../utils/permissions';
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
  ShieldCheck,
  X
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    cart, 
    currentEntityId, 
    currentUser, 
    customRoles, 
    isSidebarOpen, 
    setIsSidebarOpen,
    isSidebarCollapsed
  } = usePOS();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const perms = getUserPermissions(currentUser, customRoles);

  const allNavItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number; isAllowed: boolean }[] = [
    { id: 'cashier', label: 'Kasir / POS', icon: <ShoppingCart className="w-4 h-4" />, badge: cartCount, isAllowed: perms.canAccessPOS },
    { id: 'catalog', label: 'Katalog Produk', icon: <Package className="w-4 h-4" />, isAllowed: perms.canManageCatalog },
    { id: 'kds', label: 'Kitchen / Bar KDS', icon: <ChefHat className="w-4 h-4" />, isAllowed: perms.canAccessKDS },
    { id: 'tables', label: 'Denah Meja', icon: <LayoutGrid className="w-4 h-4" />, isAllowed: perms.canManageTables },
    { id: 'inventory', label: 'Stok Bahan Baku', icon: <Boxes className="w-4 h-4" />, isAllowed: perms.canManageInventory },
    { id: 'roles', label: 'Role & Permission', icon: <ShieldCheck className="w-4 h-4" />, isAllowed: perms.canManageStaff },
    { id: 'users', label: 'Kelola Staf & User', icon: <Users className="w-4 h-4" />, isAllowed: perms.canManageStaff },
    { id: 'transactions', label: 'Riwayat Struk', icon: <Receipt className="w-4 h-4" />, isAllowed: perms.canViewReports || perms.canAccessPOS },
    { id: 'reports', label: 'Laporan Omset', icon: <BarChart3 className="w-4 h-4" />, isAllowed: perms.canViewReports },
    { id: 'settings', label: 'Pengaturan Toko', icon: <Settings className="w-4 h-4" />, isAllowed: perms.canManageSettings },
  ];

  const navItems = allNavItems.filter(item => item.isAllowed);

  // If current activeTab is not allowed, auto-redirect
  useEffect(() => {
    if (navItems.length > 0 && !navItems.some(i => i.id === activeTab)) {
      setActiveTab(navItems[0].id);
    }
  }, [currentUser, currentEntityId, activeTab]);

  const activeColor = currentEntityId === 'coffee_shop' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white';

  const handleSelectTab = (tabId: NavTab) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
  };

  // If sidebar is collapsed (Focus Mode enabled), hide sidebar on desktop
  const desktopWidthClass = isSidebarCollapsed ? 'md:hidden' : 'md:w-60 md:flex';

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
        fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-200 ease-in-out md:static md:translate-x-0 md:min-h-[calc(100vh-57px)]
        ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
        ${desktopWidthClass}
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
        <nav className="p-3 space-y-1 overflow-y-auto flex-1 font-sans">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? `${activeColor} shadow-xs` 
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
        <div className="p-3.5 border-t border-slate-200 text-slate-500 text-[11px] leading-relaxed">
          <p className="font-bold text-slate-700">Buira POS F&B</p>
          <p>Nav: <strong>{currentUser?.role}</strong></p>
        </div>
      </aside>
    </>
  );
};
