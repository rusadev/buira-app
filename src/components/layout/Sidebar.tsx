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
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    cart, 
    currentUser, 
    customRoles, 
    isSidebarOpen, 
    setIsSidebarOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed
  } = usePOS();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const perms = getUserPermissions(currentUser, customRoles);

  const allNavItems: { id: NavTab; label: string; shortLabel: string; icon: React.ReactNode; badge?: number; isAllowed: boolean }[] = [
    { id: 'cashier', label: 'Kasir / POS', shortLabel: 'Kasir', icon: <ShoppingCart className="w-5 h-5" />, badge: cartCount, isAllowed: perms.canAccessPOS },
    { id: 'catalog', label: 'Katalog Produk', shortLabel: 'Katalog', icon: <Package className="w-5 h-5" />, isAllowed: perms.canManageCatalog },
    { id: 'kds', label: 'Kitchen KDS', shortLabel: 'Kitchen', icon: <ChefHat className="w-5 h-5" />, isAllowed: perms.canAccessKDS },
    { id: 'tables', label: 'Denah Meja', shortLabel: 'Meja', icon: <LayoutGrid className="w-5 h-5" />, isAllowed: perms.canManageTables },
    { id: 'inventory', label: 'Stok Bahan', shortLabel: 'Stok', icon: <Boxes className="w-5 h-5" />, isAllowed: perms.canManageInventory },
    { id: 'roles', label: 'Role & Izin', shortLabel: 'Role', icon: <ShieldCheck className="w-5 h-5" />, isAllowed: perms.canManageStaff },
    { id: 'users', label: 'Kelola Staf', shortLabel: 'Staf', icon: <Users className="w-5 h-5" />, isAllowed: perms.canManageStaff },
    { id: 'transactions', label: 'Riwayat Struk', shortLabel: 'Struk', icon: <Receipt className="w-5 h-5" />, isAllowed: perms.canViewReports || perms.canAccessPOS },
    { id: 'reports', label: 'Laporan Omset', shortLabel: 'Laporan', icon: <BarChart3 className="w-5 h-5" />, isAllowed: perms.canViewReports },
    { id: 'settings', label: 'Pengaturan', shortLabel: 'Setelan', icon: <Settings className="w-5 h-5" />, isAllowed: perms.canManageSettings },
  ];

  const navItems = allNavItems.filter(item => item.isAllowed);

  useEffect(() => {
    if (navItems.length > 0 && !navItems.some(i => i.id === activeTab)) {
      setActiveTab(navItems[0].id);
    }
  }, [currentUser, activeTab]);

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

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-200 ease-in-out md:static md:translate-x-0 md:min-h-0 select-none
        ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
        ${isSidebarCollapsed ? 'md:w-[72px] md:flex' : 'md:w-56 md:flex'}
      `}>

        {/* Mobile Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between md:hidden">
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Menu Navigasi POS</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
            style={{ outline: 'none' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1.5 overflow-y-auto flex-1 font-sans">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                title={item.label}
                className={`w-full flex ${
                  isSidebarCollapsed 
                    ? 'flex-col items-center justify-center py-2.5 px-1 rounded-2xl gap-1' 
                    : 'flex-row items-center justify-between px-3.5 py-2.5 rounded-xl gap-3'
                } font-extrabold transition-all relative group ${
                  isActive 
                    ? 'bg-red-600 text-white' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                style={{ outline: 'none', border: 'none' }}
              >
                <div className={`flex items-center ${isSidebarCollapsed ? 'flex-col gap-1' : 'gap-3'}`}>
                  <div className="relative">
                    {item.icon}
                    {/* Badge for Collapsed mode */}
                    {isSidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-red-700 text-white border-2 border-white rounded-full text-[9px] font-black w-4 h-4 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={isSidebarCollapsed ? 'text-[10px] tracking-tight font-bold text-center leading-tight' : 'text-xs font-bold'}>
                    {isSidebarCollapsed ? item.shortLabel : item.label}
                  </span>
                </div>

                {/* Badge for Expanded mode */}
                {!isSidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white text-red-600' : 'bg-red-600 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse / Expand Toggle Button for Desktop */}
        <div className="hidden md:flex items-center justify-between p-2.5 border-t border-slate-100 bg-slate-50/50">
          {!isSidebarCollapsed && (
            <div className="px-2 text-[11px] font-bold text-slate-400">
              Native POS Rail
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? 'Perlebar Sidebar' : 'Ciutkan ke Mode Icon Native'}
            className="w-full md:w-auto p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors flex items-center justify-center gap-1 text-xs font-bold"
            style={{ outline: 'none', border: '1px solid #e2e8f0' }}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Mode Icon Rail</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
