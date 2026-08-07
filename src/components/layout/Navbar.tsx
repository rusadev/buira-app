import React, { useState, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import { Coffee, Drumstick, Clock, UserCheck, ShieldAlert, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenShiftModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenShiftModal }) => {
  const { 
    entities, 
    currentEntityId, 
    switchEntity, 
    currentEntity, 
    activeShift,
    isSidebarOpen,
    toggleSidebar
  } = usePOS();

  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-2.5 flex items-center justify-between gap-3">
      {/* Left Side: Hamburger Toggle & Brand Switcher */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand & Tagline */}
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xl shrink-0`}>
            {currentEntity.logo}
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              {currentEntity.name}
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                PRO POS
              </span>
            </h1>
            <p className="text-[11px] text-slate-500">{currentEntity.tagline}</p>
          </div>
        </div>

        {/* Entity Switcher Buttons */}
        <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1">
          {entities.map(entity => {
            const isActive = entity.id === currentEntityId;
            return (
              <button
                key={entity.id}
                onClick={() => switchEntity(entity.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive 
                    ? entity.id === 'coffee_shop'
                      ? 'bg-amber-600 text-white'
                      : 'bg-rose-600 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {entity.id === 'coffee_shop' ? <Coffee className="w-3.5 h-3.5" /> : <Drumstick className="w-3.5 h-3.5" />}
                <span className="hidden lg:inline">{entity.id === 'coffee_shop' ? 'Coffee Shop' : 'Ayam Geprek'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Side: Clock & Shift Status */}
      <div className="flex items-center gap-2.5">
        {/* Realtime Clock */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
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
      </div>
    </header>
  );
};
