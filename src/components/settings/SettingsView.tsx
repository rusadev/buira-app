import React, { useState, useRef } from 'react';
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
  Upload,
  Image as ImageIcon,
  Sliders,
  X
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentEntity, updateEntitySettings } = usePOS();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store profile fields
  const [name, setName] = useState<string>(currentEntity.name || '');
  const [tagline, setTagline] = useState<string>(currentEntity.tagline || '');
  const [logo, setLogo] = useState<string>(currentEntity.logo || '');
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
  const [taxRate, setTaxRate] = useState<number>(currentEntity.taxRate ? currentEntity.taxRate * 100 : 10);
  
  const [isServiceActive, setIsServiceActive] = useState<boolean>(currentEntity.serviceRate > 0);
  const [serviceRate, setServiceRate] = useState<number>(currentEntity.serviceRate ? currentEntity.serviceRate * 100 : 5);

  // Preset Brand Logos
  const PRESET_LOGOS = [
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&auto=format&fit=crop&q=80'
  ];

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

  // Form input state for new fee
  const [newFeeName, setNewFeeName] = useState<string>('');
  const [newFeeType, setNewFeeType] = useState<'PERCENTAGE' | 'FIXED'>('FIXED');
  const [newFeeValue, setNewFeeValue] = useState<number>(2000);
  const [newFeeAppliesTo, setNewFeeAppliesTo] = useState<'ALL' | 'Dine-In' | 'Takeaway' | 'Delivery'>('Takeaway');

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Logo file upload handler
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Ukuran file logo terlalu besar. Maksimal 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

  // Toggle fee active/inactive status
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
      logo,
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
            <span>Pengaturan Toko, Logo Brand, & Biaya Dinamis</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Kelola logo brand outlet, tarif pajak PB1 (Aktif/Non-aktif), biaya tambahan dinamis, & cetak struk.</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-white border border-emerald-300 text-emerald-700 px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Pengaturan toko, logo brand, & biaya dinamis berhasil disimpan!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: PROFIL TOKO & LOGO BRAND (Clean White Card) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
            <Store className="w-4 h-4 text-red-600" />
            <span>Profil Toko & Upload Logo Brand ({currentEntity.name})</span>
          </h3>

          {/* Logo Brand Upload & Preview Section */}
          <div className="p-4 border border-slate-200 rounded-2xl bg-white space-y-3">
            <label className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-red-600" />
              <span>Logo Brand Outlet / Toko (Akan Tampil di Header Struk)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Preview Box */}
              <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-white flex items-center justify-center p-2 relative shrink-0">
                {logo ? (
                  <>
                    <img src={logo} alt="Brand Logo" className="w-full h-full object-contain rounded-xl" />
                    <button
                      type="button"
                      onClick={() => setLogo('')}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs"
                      style={{ outline: 'none', border: 'none' }}
                      title="Hapus Logo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] text-slate-400 font-bold text-center">Belum ada logo</span>
                )}
              </div>

              {/* Upload Controls */}
              <div className="space-y-2 flex-1 w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileUpload}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                    style={{ outline: 'none', border: 'none' }}
                  >
                    <Upload className="w-4 h-4 stroke-[2.5]" />
                    <span>Upload Logo (PNG/JPG)</span>
                  </button>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold block">Atau Pilih Logo Preset:</span>
                  <div className="flex items-center gap-2">
                    {PRESET_LOGOS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLogo(url)}
                        className={`w-9 h-9 rounded-xl border p-1 bg-white hover:border-red-600 transition-all ${
                          logo === url ? 'border-red-600 ring-2 ring-red-100' : 'border-slate-200'
                        }`}
                        style={{ outline: 'none' }}
                      >
                        <img src={url} alt="Preset" className="w-full h-full object-cover rounded-lg" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

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

        {/* SECTION 2: PAJAK UTAMA PB1 & SERVICE CHARGE WITH ACTIVE TOGGLE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
            <Percent className="w-4 h-4 text-red-600" />
            <span>Pengaturan Pajak Resto (PB1) & Biaya Layanan Utamanya</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Pajak PB1 */}
            <div className="p-4 border border-slate-200 rounded-2xl space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">Pajak Resto PB1 / PPN (%)</span>
                  <span className="text-[10px] text-slate-400 font-medium">Jika Non-Aktif, pajak tidak tampil di struk.</span>
                </div>
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
            </div>

            {/* Service Charge */}
            <div className="p-4 border border-slate-200 rounded-2xl space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">Service Charge Resto (%)</span>
                  <span className="text-[10px] text-slate-400 font-medium">Jika Non-Aktif, biaya tidak tampil di struk.</span>
                </div>
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
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Biaya dengan status "Non-Aktif" tidak akan dihitung di kasir dan tidak tampil pada struk.</p>
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
                          : 'border-slate-300 text-slate-500 bg-slate-50'
                      }`}
                      style={{ outline: 'none' }}
                    >
                      {fee.isActive ? 'Aktif (Tampil di Struk)' : 'Non-Aktif (Tersembunyi)'}
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
            <span>Simpan Seluruh Pengaturan Toko & Logo Brand</span>
          </button>
        </div>

      </form>

    </div>
  );
};
