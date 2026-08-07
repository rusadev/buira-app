import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Settings, Store, Percent, Printer, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentEntity, updateEntitySettings } = usePOS();

  const [name, setName] = useState<string>(currentEntity.name);
  const [tagline, setTagline] = useState<string>(currentEntity.tagline);
  const [address, setAddress] = useState<string>(currentEntity.address);
  const [phone, setPhone] = useState<string>(currentEntity.phone);
  const [taxRate, setTaxRate] = useState<number>(currentEntity.taxRate * 100);
  const [serviceRate, setServiceRate] = useState<number>(currentEntity.serviceRate * 100);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEntitySettings(currentEntity.id, {
      name,
      tagline,
      address,
      phone,
      taxRate: taxRate / 100,
      serviceRate: serviceRate / 100
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-6 overflow-y-auto font-sans select-none">
      <div>
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-red-600" />
          <span>Pengaturan Outlet & Struk Kasir</span>
        </h2>
        <p className="text-xs text-slate-500 font-medium">Kelola informasi toko, tarif pajak PB1, service charge, dan alamat cetak struk.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-xs font-extrabold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pengaturan toko berhasil diperbarui!</span>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <Store className="w-4 h-4 text-red-600" />
            <span>Profil Toko / Outlet ({currentEntity.name})</span>
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Nama Toko / Outlet *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
              style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Tagline / Slogan Toko</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
              style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Alamat Lengkap</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
              style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">No. Telepon / WhatsApp Toko</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
              style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
            />
          </div>
        </div>

        <div className="space-y-4 pt-3 border-t border-slate-100">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <Percent className="w-4 h-4 text-red-600" />
            <span>Pajak & Biaya Layanan (PB1 & Service Charge)</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Pajak Resto PB1 (%)</label>
              <input
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs font-black text-red-600"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Service Charge (%)</label>
              <input
                type="number"
                step="0.1"
                value={serviceRate}
                onChange={(e) => setServiceRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs font-black text-red-600"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              />
            </div>
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2"
            style={{ outline: 'none', border: 'none', background: '#dc2626' }}
          >
            <Printer className="w-4 h-4" />
            <span>Simpan Perubahan Pengaturan Toko</span>
          </button>
        </div>
      </form>
    </div>
  );
};
