import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Settings, Store, Printer, Percent, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentEntity, updateStoreEntity } = usePOS();

  const [name, setName] = useState<string>(currentEntity.name);
  const [tagline, setTagline] = useState<string>(currentEntity.tagline);
  const [address, setAddress] = useState<string>(currentEntity.address);
  const [phone, setPhone] = useState<string>(currentEntity.phone);
  const [taxRateInput, setTaxRateInput] = useState<number>(currentEntity.taxRate * 100);
  const [serviceRateInput, setServiceRateInput] = useState<number>(currentEntity.serviceRate * 100);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreEntity({
      ...currentEntity,
      name,
      tagline,
      address,
      phone,
      taxRate: (parseFloat(taxRateInput.toString()) || 0) / 100,
      serviceRate: (parseFloat(serviceRateInput.toString()) || 0) / 100
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-6 overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-600" />
          <span>Pengaturan Outlet & Profil Merchant ({currentEntity.name})</span>
        </h2>
        <p className="text-xs text-slate-500">Kelola profil usaha, alamat cetak struk, tarif pajak resto PB1, dan printer thermal.</p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold text-center">
          ✅ Pengaturan outlet berhasil diperbarui!
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Store Profile */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4 text-amber-600" />
            <span>Profil Toko & Header Struk</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-700 font-bold block">Nama Outlet / Resto *</label>
              <input 
                type="text"
                required
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-700 font-bold block">Tagline Store</label>
              <input 
                type="text" 
                value={tagline} 
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-700 font-bold block">Alamat Struk cetak</label>
              <input 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-700 font-bold block">No. Telepon Struk</label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Tax & Printer */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-600" />
              <span>Pajak Resto & Printer Struk</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold block">Pajak Resto PB1 (%)</label>
                <input 
                  type="number" 
                  value={taxRateInput} 
                  onChange={(e) => setTaxRateInput(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-amber-700 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold block">Service Charge (%)</label>
                <input 
                  type="number" 
                  value={serviceRateInput} 
                  onChange={(e) => setServiceRateInput(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-amber-700 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Printer className="w-4 h-4 text-amber-600" />
                  <span>Printer Thermal 58mm / 80mm</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Printer thermal terhubung langsung melalui driver cetak browser fisik.</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan Outlet</span>
          </button>
        </div>
      </form>
    </div>
  );
};
