import React, { useState } from 'react';
import type { CustomRole, RolePermission } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { X, Check, ShieldCheck } from 'lucide-react';

interface RoleFormModalProps {
  initialRole?: CustomRole | null;
  onClose: () => void;
}

export const RoleFormModal: React.FC<RoleFormModalProps> = ({ initialRole, onClose }) => {
  const { currentEntityId, currentEntity, addCustomRole, updateCustomRole } = usePOS();

  const [name, setName] = useState<string>(initialRole?.name || '');
  const [description, setDescription] = useState<string>(initialRole?.description || '');
  
  const [permissions, setPermissions] = useState<RolePermission>(
    initialRole?.permissions || {
      canAccessPOS: true,
      canManageCatalog: false,
      canAccessKDS: false,
      canManageTables: true,
      canManageInventory: false,
      canManageStaff: false,
      canViewReports: false,
      canVoidOrders: false,
      canManageSettings: false
    }
  );

  const togglePermission = (key: keyof RolePermission) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (initialRole) {
      updateCustomRole({
        ...initialRole,
        name: name.trim(),
        description: description.trim(),
        permissions
      });
    } else {
      addCustomRole({
        entityId: currentEntityId,
        name: name.trim(),
        description: description.trim(),
        permissions,
        isSystemRole: false
      });
    }
    onClose();
  };

  const permissionFields: { key: keyof RolePermission; label: string; desc: string }[] = [
    { key: 'canAccessPOS', label: 'Akses Kasir & Checkout POS', desc: 'Melayani transaksi tunai, QRIS, dan cetak struk' },
    { key: 'canManageCatalog', label: 'Kelola Katalog Produk & HPP', desc: 'Tambah/edit produk, harga jual, dan modal HPP' },
    { key: 'canAccessKDS', label: 'Layar KDS Dapur & Barista', desc: 'Memantau dan mengubah status antrean masakan/minuman' },
    { key: 'canManageTables', label: 'Manajemen Denah Meja', desc: 'Memilih dan mengatur status meja Dine-In' },
    { key: 'canManageInventory', label: 'Kelola Stok Bahan Baku', desc: 'Mencatat persediaan dan mutasi stok masuk/keluar' },
    { key: 'canManageStaff', label: 'Kelola Staf & Hak Akses User', desc: 'Menambah kasir/staf baru dan mengatur permission' },
    { key: 'canViewReports', label: 'Lihat Laporan Omset & Keuangan', desc: 'Melihat total omset, laporan pembayaran, & best seller' },
    { key: 'canVoidOrders', label: 'Pembatalan Transaksi (Void)', desc: 'Membatalkan struk transaksi yang telah lunas' },
    { key: 'canManageSettings', label: 'Pengaturan Toko & Pajak PB1', desc: 'Mengubah profil resto, alamat struk, dan pajak' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-white rounded-none w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] space-y-4 p-6" style={{ border: '1px solid #e2e8f0' }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {initialRole ? 'Edit Role & Permission' : 'Buat Role Baru (Custom F&B Role)'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Outlet: <strong className="text-red-600 font-extrabold">{currentEntity.name}</strong></p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-none bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            style={{ outline: 'none' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto space-y-4 flex-1 pr-1">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Nama Role Baru *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: Head Barista / Supervisor Shift / Senior Cashier"
              className="w-full bg-slate-50 rounded-none px-3.5 py-2.5 text-xs text-slate-900 font-extrabold"
              style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Deskripsi Singkat Role</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan wewenang dan tanggung jawab role ini..."
              className="w-full bg-slate-50 rounded-none px-3.5 py-2 text-xs text-slate-900 font-extrabold"
              style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
            />
          </div>

          {/* Matrix Permission Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-extrabold text-slate-900 block">Matriks Hak Akses & Permission Fitur</label>
            <div className="grid grid-cols-1 gap-2">
              {permissionFields.map(field => {
                const isChecked = permissions[field.key];
                return (
                  <div
                    key={field.key}
                    onClick={() => togglePermission(field.key)}
                    className={`p-2.5 rounded-none border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                      isChecked 
                        ? 'bg-red-50 border-red-200 text-red-950 font-extrabold' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-slate-900">{field.label}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{field.desc}</div>
                    </div>

                    <div className={`w-5 h-5 rounded-none border flex items-center justify-center ${
                      isChecked ? 'bg-red-600 border-red-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="py-3.5 px-4 rounded-none text-slate-700 font-bold text-xs uppercase tracking-wider border border-slate-300 hover:bg-slate-100 transition-all shrink-0"
              style={{ outline: 'none' }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 px-5 rounded-none text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shrink-0"
              style={{ outline: 'none', border: 'none', background: '#dc2626' }}
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>Simpan Role & Permission</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
