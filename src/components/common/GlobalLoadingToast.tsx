import React from 'react';
import { usePOS } from '../../context/POSContext';
import { Loader2, CheckCircle2, Zap } from 'lucide-react';

export const GlobalLoadingToast: React.FC = () => {
  const { syncMessage, isSyncSuccess } = usePOS();

  if (!syncMessage) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-4">
      <div 
        className={`px-4 py-2.5 rounded-none shadow-2xl border flex items-center gap-2.5 font-sans backdrop-blur-md ${
          isSyncSuccess
            ? 'bg-emerald-900/90 border-emerald-400 text-white'
            : 'bg-slate-900/90 border-slate-700 text-white'
        }`}
      >
        {isSyncSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <Loader2 className="w-4 h-4 text-red-500 animate-spin shrink-0" />
        )}
        <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide">
          {!isSyncSuccess && <Zap className="w-3.5 h-3.5 text-red-400 fill-current" />}
          <span>{syncMessage}</span>
        </div>
      </div>
    </div>
  );
};
