import React, { useState, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import type { EntityType } from '../../types/pos';
import { Clock, UserCheck, ShieldAlert, Menu, X, LogOut, ChevronDown, Store, Crown } from 'lucide-react';

interface NavbarProps {
  onOpenShiftModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenShiftModal }) => {
  const { 
    entities,
    currentEntityId,
    currentEntity, 
    activeShift,
    currentUser,
    switchTenant,
    logout,
    isSidebarOpen,
    toggleSidebar
  } = usePOS();

  const [time, setTime] = useState<string>('');
  const [isOutletDropdownOpen, setIsOutletDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const allowedTenants = entities.filter(e => 
    currentUser?.role === 'SuperAdmin' || currentUser?.allowedTenantIds.includes(e.id)
  );

  const canSwitchOutlet = allowedTenants.length > 1;

  const handleSwitchStore = (tenantId: EntityType) => {
    switchTenant(tenantId);
    setIsOutletDropdownOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-2.5 flex items-center justify-between gap-3">
      {/* Left Side: Hamburger & Tenant Store Info / Switcher */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Tenant Store Selector / Brand */}
        <div className="relative">
          <div 
            onClick={() => canSwitchOutlet && setIsOutletDropdownOpen(prev => !prev)}
            className={`flex items-center gap-2.5 p-1 rounded-xl transition-all ${
              canSwitchOutlet ? 'cursor-pointer hover:bg-slate-100' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xl shrink-0 font-extrabold">
              {currentEntity.logo}
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>{currentEntity.name}</span>
                {canSwitchOutlet && (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                )}
                {currentUser?.role === 'SuperAdmin' && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold border border-purple-200 flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5" />
                    SuperAdmin
                  </span>
                )}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">{currentEntity.address}</p>
            </div>
          </div>

          {/* Multi-Outlet Switcher Dropdown (For SuperAdmin / Multi-Store Owners) */}
          {isOutletDropdownOpen && canSwitchOutlet && (
            <>
              <div 
                onClick={() => setIsOutletDropdownOpen(false)}
                className="fixed inset-0 z-40"
              />
              <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl p-2 z-50 shadow-none">
                <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Pilih Outlet / Bisnis Milik Anda ({allowedTenants.length})
                </div>
                <div className="space-y-1">
                  {allowedTenants.map(entity => {
                    const isActive = entity.id === currentEntityId;
                    return (
                      <button
                        key={entity.id}
                        onClick={() => handleSwitchStore(entity.id)}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-left transition-all ${
                          isActive 
                            ? 'bg-amber-600 text-white' 
                            : 'text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-base">{entity.logo}</span>
                        <div>
                          <div className="font-bold">{entity.name}</div>
                          <div className={`text-[10px] font-medium ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                            {entity.businessType} • {entity.address}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Side: Clock, Shift Status, User Account & Logout */}
      <div className="flex items-center gap-3">
        {/* Realtime Clock */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          {time}
        </div>

        {/* Shift Button */}
        <button
          onClick={onOpenShiftModal}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            activeShift 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100' 
              : 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100'
          }`}
        >
          {activeShift ? (
            <>
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Shift: <strong>{activeShift.cashierName}</strong></span>
              <span className="sm:hidden">Shift Aktif</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Buka Shift</span>
            </>
          )}
        </button>

        {/* Authenticated User Profile & Logout */}
        {currentUser && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0" 
            />
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold text-slate-900 block leading-none">{currentUser.name}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                currentUser.role === 'SuperAdmin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : currentUser.role === 'Owner'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-600'
              }`}>
                {currentUser.role}
              </span>
            </div>

            <button
              onClick={logout}
              title="Logout & Ganti Akun"
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
