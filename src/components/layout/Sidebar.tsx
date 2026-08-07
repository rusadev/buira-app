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

      {/* Sidebar Container (Mobile HP: Compact Icon Rail w-[72px] | Desktop: w-56 or w-[72px]) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-200 ease-in-out md:static md:translate-x-0 md:min-h-0 select-none
        ${isSidebarOpen ? 'translate-x-0 w-[72px]' : '-translate-x-full'}
        ${isSidebarCollapsed ? 'md:w-[72px] md:flex' : 'md:w-56 md:flex'}
      `}>

        {/* Mobile Header (Close Button) */}
        <div className="p-2 border-b border-slate-100 flex items-center justify-center md:hidden">
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            style={{ outline: 'none' }}
            title="Tutup Menu"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-1.5 space-y-1.5 overflow-y-auto flex-1 font-sans">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            const isCompactLayout = isSidebarCollapsed || isSidebarOpen;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                title={item.label}
                className={`w-full flex ${
                  isCompactLayout
                    ? 'flex-col items-center justify-center py-2 px-1 rounded-2xl gap-1 text-center' 
                    : 'flex-row items-center justify-between px-3.5 py-2.5 rounded-xl gap-3'
                } font-extrabold transition-all relative group ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                style={{ outline: 'none', border: 'none' }}
              >
                <div className={`flex items-center ${isCompactLayout ? 'flex-col gap-0.5' : 'gap-3'}`}>
                  <div className="relative">
                    {item.icon}
                    {/* Badge for Collapsed / Compact mode */}
                    {isCompactLayout && item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 bg-white text-red-600 border border-red-200 rounded-full text-[9px] font-black w-4 h-4 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={isCompactLayout ? 'text-[10px] tracking-tight font-extrabold text-center leading-tight' : 'text-xs font-bold'}>
                    {isCompactLayout ? item.shortLabel : item.label}
                  </span>
                </div>

                {/* Badge for Expanded mode */}
                {!isCompactLayout && item.badge !== undefined && item.badge > 0 && (
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
        <div className="hidden md:flex p-2 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? 'Perlebar Sidebar' : 'Ciutkan ke Mode Ringkas'}
            className="w-full py-2 px-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-red-600 transition-colors flex items-center justify-center gap-2 text-xs font-extrabold"
            style={{ outline: 'none', border: '1px solid #e2e8f0' }}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-red-600 stroke-[2.5]" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 text-red-600 stroke-[2.5]" />
                <span>Mode Icon Rail</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
