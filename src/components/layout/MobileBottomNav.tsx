import React from 'react';
import { usePOS } from '../../context/POSContext';
import type { NavTab } from '../../context/POSContext';
import { getUserPermissions } from '../../utils/permissions';
import { ShoppingCart, ChefHat, Boxes, Users, BarChart3 } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cart, currentUser, customRoles } = usePOS();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const perms = getUserPermissions(currentUser, customRoles);

  const bottomItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number; isAllowed: boolean }[] = [
    { id: 'cashier', label: 'Kasir', icon: <ShoppingCart className="w-5 h-5" />, badge: cartCount, isAllowed: perms.canAccessPOS },
    { id: 'kds', label: 'KDS Dapur', icon: <ChefHat className="w-5 h-5" />, isAllowed: perms.canAccessKDS },
    { id: 'inventory', label: 'Stok', icon: <Boxes className="w-5 h-5" />, isAllowed: perms.canManageInventory },
    { id: 'users', label: 'Staf', icon: <Users className="w-4 h-4" />, isAllowed: perms.canManageStaff },
    { id: 'reports', label: 'Laporan', icon: <BarChart3 className="w-5 h-5" />, isAllowed: perms.canViewReports },
  ];

  const allowedItems = bottomItems.filter(i => i.isAllowed);

  if (!currentUser || allowedItems.length === 0) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {allowedItems.map(item => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-none transition-all relative ${
              isActive ? 'text-red-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-none flex items-center justify-center border border-white shadow-xs">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
