import React from 'react';
import { usePOS } from '../../context/POSContext';
import { Settings, Store, Printer, Percent } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentEntity } = usePOS();

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-6 overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-600" />
          <span>Pengaturan Toko & System Configuration ({currentEntity.name})</span>
        </h2>
        <p className="text-xs text-slate-500">Atur profil usaha, printer thermal, tarif pajak resto PB1, dan footer struk.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Store Profile */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4 text-amber-600" />
            <span>Profil Toko & Header Struk</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-500 block mb-1 font-semibold">Nama Usaha / Entitas</label>
              <input 
                type="text" 
                readOnly 
                value={currentEntity.name} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1 font-semibold">Tagline</label>
              <input 
                type="text" 
                readOnly 
                value={currentEntity.tagline} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1 font-semibold">Alamat Struk</label>
              <input 
                type="text" 
                readOnly 
                value={currentEntity.address} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1 font-semibold">No. Telepon Merchant</label>
              <input 
                type="text" 
                readOnly 
                value={currentEntity.phone} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Tax & Printer */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Percent className="w-4 h-4 text-amber-600" />
            <span>Pajak Resto & Printer Struk</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 block">Pajak Resto (PB1)</span>
                <span className="text-[10px] text-slate-500 font-medium">Dikenakan pada kalkulasi akhir kasir</span>
              </div>
              <span className="text-sm font-extrabold text-amber-700">{currentEntity.taxRate * 100}%</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 block">Layanan Service Charge</span>
                <span className="text-[10px] text-slate-500 font-medium">Biaya service resto</span>
              </div>
              <span className="text-sm font-extrabold text-amber-700">{currentEntity.serviceRate * 100}%</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 text-amber-700 font-bold">
                <Printer className="w-4 h-4" />
                <span>Printer Thermal 58mm / 80mm</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Aplikasi mendukung Web Print API bawaan browser untuk langsung mencetak ke printer Bluetooth / USB Thermal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
