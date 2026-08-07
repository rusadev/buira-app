import React, { useState, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import type { EntityType } from '../../types/pos';
import { Clock, Menu, X, LogOut, ChevronDown, Maximize, Minimize, PanelLeftClose, PanelLeftOpen, Zap } from 'lucide-react';

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
    toggleSidebar,
    isSidebarCollapsed,
    toggleSidebarCollapse,
    isPOSFocusMode,
    togglePOSFocusMode
  } = usePOS();

  const [time, setTime] = useState<string>('');
  const [isOutletDropdownOpen, setIsOutletDropdownOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const allowedTenants = entities.filter(e => 
    currentUser?.role === 'SuperAdmin' || currentUser?.allowedTenantIds.includes(e.id)
  );

  const canSwitchOutlet = allowedTenants.length > 1;

  const handleSwitchStore = (tenantId: EntityType) => {
    switchTenant(tenantId);
    setIsOutletDropdownOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-3.5 py-2.5 flex items-center justify-between gap-3 font-sans">
      {/* Left Side: Sidebar Collapse Toggle & Store Identity */}
      <div className="flex items-center gap-2.5">
        {/* Desktop Sidebar Collapse Toggle */}
        <button
          onClick={toggleSidebarCollapse}
          title={isSidebarCollapsed ? "Buka Menu Manajemen (Mode Normal)" : "Sembunyikan Sidebar (Mode Kasir Fokus)"}
          className="hidden md:flex p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
        >
          {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4 text-red-600" /> : <PanelLeftClose className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Store Name & Dropdown */}
        <div className="relative">
          <div 
            onClick={() => canSwitchOutlet && setIsOutletDropdownOpen(prev => !prev)}
            className={`flex items-center gap-2.5 p-1 rounded-xl transition-all ${
              canSwitchOutlet ? 'cursor-pointer hover:bg-slate-100' : ''
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center text-lg shrink-0 font-extrabold shadow-xs">
              {currentEntity.logo}
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1 leading-tight">
                <span>{currentEntity.name}</span>
                {canSwitchOutlet && <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">{currentEntity.address}</p>
            </div>
          </div>

          {/* Multi-Outlet Dropdown */}
          {isOutletDropdownOpen && canSwitchOutlet && (
            <>
              <div 
                onClick={() => setIsOutletDropdownOpen(false)}
                className="fixed inset-0 z-40"
              />
              <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl p-2 z-50 shadow-lg">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Pilih Outlet ({allowedTenants.length})
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
                            ? 'bg-red-600 text-white shadow-xs' 
                            : 'text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-base">{entity.logo}</span>
                        <div>
                          <div className="font-bold text-xs">{entity.name}</div>
                          <div className={`text-[10px] font-medium ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                            {entity.address}
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

      {/* Center / Right: POS Focus Mode Toggle, Fullscreen, Clock, Shift & User */}
      <div className="flex items-center gap-2.5">
        {/* Dedicated POS Focus Mode Toggle (Pure Red Theme) */}
        <button
          onClick={togglePOSFocusMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            isPOSFocusMode 
              ? 'bg-red-600 text-white border-red-600 shadow-xs' 
              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{isPOSFocusMode ? 'Kasir Fokus' : 'Mode Normal'}</span>
        </button>

        {/* Fullscreen Full Mode Button */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh POS'}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-red-600" /> : <Maximize className="w-3.5 h-3.5 text-slate-600" />}
          <span className="hidden lg:inline">{isFullscreen ? 'Normal' : 'Full Screen'}</span>
        </button>

        {/* Realtime Clock */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs font-mono text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 font-bold">
          <Clock className="w-3.5 h-3.5 text-red-600" />
          {time}
        </div>

        {/* Shift Button */}
        <button
          onClick={onOpenShiftModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
            activeShift 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100' 
              : 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100'
          }`}
        >
          {activeShift ? (
            <span>Shift: <strong>{activeShift.cashierName}</strong></span>
          ) : (
            <span>Buka Shift</span>
          )}
        </button>

        {/* Profile & Logout */}
        {currentUser && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0" 
            />
            <div className="hidden lg:block text-left">
              <span className="text-xs font-bold text-slate-900 block leading-none">{currentUser.name}</span>
              <span className="text-[10px] text-slate-500 font-semibold">{currentUser.role}</span>
            </div>

            <button
              onClick={logout}
              title="Keluar"
              className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
