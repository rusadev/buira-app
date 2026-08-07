import React, { useState } from 'react';
import type { AdditionalFee } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { 
  Settings, 
  Store, 
  Percent, 
  Printer, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Receipt,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  FileText,
  Sliders
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentEntity, updateEntitySettings } = usePOS();

  // Store profile fields
  const [name, setName] = useState<string>(currentEntity.name || '');
  const [tagline, setTagline] = useState<string>(currentEntity.tagline || '');
  const [address, setAddress] = useState<string>(currentEntity.address || '');
  const [phone, setPhone] = useState<string>(currentEntity.phone || '');
  const [receiptFooterNote, setReceiptFooterNote] = useState<string>(
    currentEntity.receiptFooterNote || 'Terima kasih atas kunjungan Anda! Sampai jumpa kembali.'
  );
  const [printerPaperWidth, setPrinterPaperWidth] = useState<'58mm' | '80mm'>(
    currentEntity.printerPaperWidth || '58mm'
  );

  // Tax & Service fields
  const [isTaxActive, setIsTaxActive] = useState<boolean>(currentEntity.taxRate > 0);
  const [taxRate, setTaxRate] = useState<number>(currentEntity.taxRate * 100);
  
  const [isServiceActive, setIsServiceActive] = useState<boolean>(currentEntity.serviceRate > 0);
  const [serviceRate, setServiceRate] = useState<number>(currentEntity.serviceRate * 100);

  // Dynamic Additional Fees State
  const initialFees: AdditionalFee[] = currentEntity.additionalFees || [
    {
      id: 'fee-1',
      name: 'Biaya Packaging / Box Takeaway',
      type: 'FIXED',
      value: 2000,
      isActive: true,
      appliesTo: 'Takeaway'
    },
    {
      id: 'fee-2',
      name: 'Biaya Pemeliharaan Kebersihan',
      type: 'FIXED',
      value: 1000,
      isActive: false,
      appliesTo: 'ALL'
    }
  ];

  const [additionalFees, setAdditionalFees] = useState<AdditionalFee[]>(initialFees);

  // Modal / Input State for New Additional Fee
  const [newFeeName, setNewFeeName] = useState<string>('');
  const [newFeeType, setNewFeeType] = useState<'PERCENTAGE' | 'FIXED'>('FIXED');
  const [newFeeValue, setNewFeeValue] = useState<number>(2000);
  const [newFeeAppliesTo, setNewFeeAppliesTo] = useState<'ALL' | 'Dine-In' | 'Takeaway' | 'Delivery'>('Takeaway');

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Add new dynamic custom fee
  const handleAddFee = () => {
    if (!newFeeName.trim()) {
      alert('Silakan masukkan nama biaya tambahan.');
      return;
    }

    const fee: AdditionalFee = {
      id: `fee-${Date.now()}`,
      name: newFeeName.trim(),
      type: newFeeType,
      value: Number(newFeeValue) || 0,
      isActive: true,
      appliesTo: newFeeAppliesTo
    };

    setAdditionalFees([...additionalFees, fee]);
    setNewFeeName('');
    setNewFeeValue(2000);
  };

  // Toggle fee active/inactive
  const handleToggleFeeStatus = (id: string) => {
    setAdditionalFees(additionalFees.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f));
  };

  // Remove fee
  const handleRemoveFee = (id: string) => {
    setAdditionalFees(additionalFees.filter(f => f.id !== id));
  };

  // Save Settings Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedEntity = {
      ...currentEntity,
      name,
      tagline,
      address,
      phone,
      receiptFooterNote,
      printerPaperWidth,
      taxRate: isTaxActive ? (taxRate / 100) : 0,
      serviceRate: isServiceActive ? (serviceRate / 100) : 0,
      additionalFees
    };

    updateEntitySettings(updatedEntity);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-6 overflow-y-auto font-sans select-none">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-red-600" />
            <span>Pengaturan Toko, Pajak, & Biaya Layanan Dinamis</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Kelola profil toko, tarif pajak PB1, daftar biaya tambahan dinamis, & cetak struk.</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-white border border-emerald-300 text-emerald-700 px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Pengaturan toko & biaya dinamis berhasil disimpan!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: PROFIL TOKO & FOOTER STRUK (Clean White Card) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
            <Store className="w-4 h-4 text-red-600" />
            <span>Profil Toko & Informasi Cetak Struk ({currentEntity.name})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Nama Toko / Outlet *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Resto / Coffee Shop..."
                className="w-full bg-white rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Tagline / Slogan Toko</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="misal: Rasa Otentik Berkualitas"
                className="w-full bg-white rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Alamat Lengkap</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Pemuda No. 123, Jakarta"
                className="w-full bg-white rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">No. Telepon / WhatsApp Toko</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-3456-7890"
                className="w-full bg-white rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-800">Catatan Kaki Struk (Receipt Footer Note)</label>
              <input
                type="text"
                value={receiptFooterNote}
                onChange={(e) => setReceiptFooterNote(e.target.value)}
                placeholder="Pesan di bagian bawah struk..."
                className="w-full bg-white rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Ukuran Kertas Printer Thermal</label>
              <select
                value={printerPaperWidth}
                onChange={(e) => setPrinterPaperWidth(e.target.value as '58mm' | '80mm')}
                className="w-full bg-white rounded-xl px-3 py-2 text-xs text-slate-900 font-extrabold"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              >
                <option value="58mm">58mm (Printer Kasir Bluetooth Portable)</option>
                <option value="80mm">80mm (Printer Kasir POS Desktop)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: PAJAK UTAMA PB1 & SERVICE CHARGE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
            <Percent className="w-4 h-4 text-red-600" />
            <span>Pengaturan Pajak Resto (PB1) & Biaya Layanan Utamanya</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Pajak PB1 */}
            <div className="p-4 border border-slate-200 rounded-2xl space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900">Pajak Resto PB1 / PPN (%)</span>
                <button
                  type="button"
                  onClick={() => setIsTaxActive(!isTaxActive)}
                  className={`text-xs font-extrabold flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                    isTaxActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                  style={{ outline: 'none' }}
                >
                  {isTaxActive ? 'Aktif' : 'Non-Aktif'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  disabled={!isTaxActive}
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-black ${
                    isTaxActive ? 'bg-white text-red-600 border border-slate-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                  style={{ outline: 'none' }}
                />
                <span className="text-xs font-extrabold text-slate-600">%</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Otomatis dihitung pada kalkulasi checkout kasir.</p>
            </div>

            {/* Service Charge */}
            <div className="p-4 border border-slate-200 rounded-2xl space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900">Service Charge Resto (%)</span>
                <button
                  type="button"
                  onClick={() => setIsServiceActive(!isServiceActive)}
                  className={`text-xs font-extrabold flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                    isServiceActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                  style={{ outline: 'none' }}
                >
                  {isServiceActive ? 'Aktif' : 'Non-Aktif'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  disabled={!isServiceActive}
                  value={serviceRate}
                  onChange={(e) => setServiceRate(parseFloat(e.target.value) || 0)}
                  className={`w-full rounded-xl px-3 py-2 text-xs font-black ${
                    isServiceActive ? 'bg-white text-red-600 border border-slate-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                  style={{ outline: 'none' }}
                />
                <span className="text-xs font-extrabold text-slate-600">%</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Biaya layanan service karyawan resto.</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: KELOLA BIAYA TAMBAHAN DINAMIS (DYNAMIC CUSTOM FEES ENGINE) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-red-600" />
                <span>Biaya Tambahan Dinamis Kustom (Dynamic Custom Fees)</span>
              </h3>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Atur biaya fleksibel seperti biaya packaging takeaway, pemeliharaan fasilitas, atau admin QRIS.</p>
            </div>
          </div>

          {/* Form Create New Dynamic Fee */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white">
            <span className="text-xs font-extrabold text-slate-900 block">Tambah Biaya Tambahan Baru:</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-1">
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Nama Biaya</label>
                <input
                  type="text"
                  value={newFeeName}
                  onChange={(e) => setNewFeeName(e.target.value)}
                  placeholder="misal: Biaya Packaging Box"
                  className="w-full bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Tipe Biaya</label>
                <select
                  value={newFeeType}
                  onChange={(e) => setNewFeeType(e.target.value as 'PERCENTAGE' | 'FIXED')}
                  className="w-full bg-white rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                  style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                >
                  <option value="FIXED">Nominal Tetap (Rp)</option>
                  <option value="PERCENTAGE">Persentase (%)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Nilai Biaya</label>
                <input
                  type="number"
                  value={newFeeValue}
                  onChange={(e) => setNewFeeValue(parseFloat(e.target.value) || 0)}
                  placeholder="misal: 2000"
                  className="w-full bg-white rounded-xl px-3 py-2 text-xs font-black text-red-600"
                  style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Berlaku Untuk</label>
                <select
                  value={newFeeAppliesTo}
                  onChange={(e) => setNewFeeAppliesTo(e.target.value as any)}
                  className="w-full bg-white rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                  style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                >
                  <option value="ALL">Semua Order (ALL)</option>
                  <option value="Takeaway">Takeaway Saja</option>
                  <option value="Dine-In">Dine-In Saja</option>
                  <option value="Delivery">Delivery Saja</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddFee}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                style={{ outline: 'none', border: 'none' }}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Tambahkan Biaya Dinamis</span>
              </button>
            </div>
          </div>

          {/* List of Dynamic Custom Fees */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-slate-900 block">Daftar Biaya Tambahan Terpasang:</span>

            {additionalFees.length > 0 ? (
              additionalFees.map(fee => (
                <div key={fee.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                      {fee.type === 'FIXED' ? 'Rp' : '%'}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{fee.name}</h4>
                      <span className="text-[10px] text-slate-500 font-bold">
                        Berlaku: <span className="text-red-600">{fee.appliesTo}</span> | Tipe: {fee.type === 'FIXED' ? `Rp ${fee.value.toLocaleString('id-ID')}` : `${fee.value}%`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleFeeStatus(fee.id)}
                      className={`text-[11px] font-extrabold px-3 py-1 rounded-full border transition-all ${
                        fee.isActive 
                          ? 'border-emerald-300 text-emerald-700 bg-white' 
                          : 'border-slate-300 text-slate-500 bg-white'
                      }`}
                      style={{ outline: 'none' }}
                    >
                      {fee.isActive ? 'Aktif' : 'Non-Aktif'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveFee(fee.id)}
                      className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                      style={{ outline: 'none' }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 font-bold p-4 border border-slate-200 rounded-2xl text-center">
                Belum ada biaya tambahan kustom.
              </p>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-none"
            style={{ outline: 'none', border: 'none', background: '#dc2626' }}
          >
            <Printer className="w-4 h-4" />
            <span>Simpan Seluruh Pengaturan Toko & Biaya Dinamis</span>
          </button>
        </div>

      </form>

    </div>
  );
};
