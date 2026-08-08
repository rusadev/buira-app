import React, { useState, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import type { EntityType } from '../../types/pos';
import { Clock, Menu, X, LogOut, ChevronDown, Maximize, Minimize, PanelLeftClose, PanelLeftOpen, Zap, RotateCw } from 'lucide-react';

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
    togglePOSFocusMode,
    refreshData
  } = usePOS();

  const [time, setTime] = useState<string>('');
  const [isOutletDropdownOpen, setIsOutletDropdownOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

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

  const isRealImageLogo = (logoStr?: string) => {
    if (!logoStr) return false;
    return logoStr.startsWith('data:') || logoStr.startsWith('http') || logoStr.startsWith('/');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 font-sans select-none">
      
      {/* Left Side: Sidebar Toggle & Store Info */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Desktop Sidebar Collapse Toggle */}
        <button
          type="button"
          onClick={toggleSidebarCollapse}
          title={isSidebarCollapsed ? "Buka Menu Manajemen" : "Sembunyikan Sidebar"}
          className="hidden md:flex p-2 rounded-none border border-slate-200 text-slate-700 hover:bg-slate-100 shrink-0"
          style={{ outline: 'none' }}
        >
          {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4 text-red-600" /> : <PanelLeftClose className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-none border border-slate-200 text-slate-700 hover:bg-slate-100 shrink-0"
          style={{ outline: 'none' }}
        >
          {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Store Name & Dropdown */}
        <div className="relative min-w-0">
          <div 
            onClick={() => canSwitchOutlet && setIsOutletDropdownOpen(prev => !prev)}
            className={`flex items-center gap-2 p-1 rounded-none min-w-0 ${
              canSwitchOutlet ? 'cursor-pointer hover:bg-slate-100' : ''
            }`}
          >
            {isRealImageLogo(currentEntity.logo) ? (
              <img 
                src={currentEntity.logo} 
                alt={currentEntity.name} 
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-none border border-slate-200 shrink-0" 
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-none bg-red-600 text-white flex items-center justify-center text-xs sm:text-sm font-black shrink-0">
                {currentEntity.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 leading-tight">
              <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1 truncate">
                <span className="truncate max-w-[100px] xs:max-w-[130px] sm:max-w-xs">{currentEntity.name}</span>
                {canSwitchOutlet && <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              </h1>
              <p className="text-[10px] text-slate-500 font-medium truncate hidden xs:block">{currentEntity.address}</p>
            </div>
          </div>

          {/* Multi-Outlet Dropdown */}
          {isOutletDropdownOpen && canSwitchOutlet && (
            <>
              <div 
                onClick={() => setIsOutletDropdownOpen(false)}
                className="fixed inset-0 z-40"
              />
              <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-none p-2 z-50 shadow-lg">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Pilih Outlet ({allowedTenants.length})
                </div>
                <div className="space-y-1">
                  {allowedTenants.map(entity => {
                    const isActive = entity.id === currentEntityId;
                    return (
                      <button
                        key={entity.id}
                        type="button"
                        onClick={() => handleSwitchStore(entity.id)}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-none text-xs font-bold text-left ${
                          isActive 
                            ? 'bg-red-600 text-white' 
                            : 'text-slate-800 hover:bg-slate-100'
                        }`}
                        style={{ outline: 'none' }}
                      >
                        {isRealImageLogo(entity.logo) ? (
                          <img src={entity.logo} alt={entity.name} className="w-6 h-6 object-contain rounded-none bg-white shrink-0" />
                        ) : (
                          <span className="w-6 h-6 rounded-none bg-slate-100 text-slate-900 flex items-center justify-center text-xs font-black shrink-0">
                            {entity.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-xs truncate">{entity.name}</div>
                          <div className={`text-[10px] font-medium truncate ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
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

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        
        {/* POS Focus Mode Toggle */}
        <button
          type="button"
          onClick={togglePOSFocusMode}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-none text-xs font-bold border ${
            isPOSFocusMode 
              ? 'bg-red-600 text-white border-red-600' 
              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
          }`}
          style={{ outline: 'none' }}
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span className="hidden md:inline">{isPOSFocusMode ? 'Kasir Fokus' : 'Mode Normal'}</span>
        </button>

        {/* Fullscreen Mode Button */}
        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh POS'}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-none border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold"
          style={{ outline: 'none' }}
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-red-600" /> : <Maximize className="w-3.5 h-3.5 text-slate-600" />}
          <span className="hidden lg:inline">{isFullscreen ? 'Normal' : 'Full Screen'}</span>
        </button>

        {/* Realtime Clock */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs font-mono text-slate-700 bg-white px-2.5 py-1.5 rounded-none border border-slate-200 font-bold">
          <Clock className="w-3.5 h-3.5 text-red-600" />
          {time}
        </div>

        {/* PWA Realtime Sync / Reload Button */}
        <button
          type="button"
          onClick={async () => {
            setIsRefreshing(true);
            await refreshData();
            setTimeout(() => setIsRefreshing(false), 600);
          }}
          title="Sinkronisasi Data Realtime & Reload PWA"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-none text-[11px] sm:text-xs font-bold border bg-white border-slate-200 text-slate-700 hover:bg-slate-100 transition-all"
          style={{ outline: 'none' }}
        >
          <RotateCw className={`w-3.5 h-3.5 text-red-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Sync Realtime</span>
        </button>

        {/* Shift Button */}
        <button
          type="button"
          onClick={onOpenShiftModal}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-none text-[11px] sm:text-xs font-bold border ${
            activeShift 
              ? 'bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-50' 
              : 'bg-white border-rose-300 text-rose-700 hover:bg-rose-50'
          }`}
          style={{ outline: 'none' }}
        >
          {activeShift ? (
            <span className="truncate max-w-[90px] sm:max-w-[120px]">
              Shift: <strong>{activeShift.cashierName}</strong>
            </span>
          ) : (
            <span>Buka Shift</span>
          )}
        </button>

        {/* Profile & Logout */}
        {currentUser && (
          <div className="flex items-center gap-1.5 pl-1.5 sm:pl-2 border-l border-slate-200">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-none object-cover border border-slate-200 shrink-0" 
            />
            <div className="hidden lg:block text-left">
              <span className="text-xs font-bold text-slate-900 block leading-none">{currentUser.name}</span>
              <span className="text-[10px] text-slate-500 font-semibold">{currentUser.role}</span>
            </div>

            <button
              type="button"
              onClick={logout}
              title="Keluar"
              className="p-1.5 rounded-none border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-rose-50 hover:border-rose-200"
              style={{ outline: 'none' }}
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
