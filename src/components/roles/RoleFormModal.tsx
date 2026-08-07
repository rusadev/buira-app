import React, { useState } from 'react';
import type { CustomRole, RolePermission } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { X, Check } from 'lucide-react';

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
        name,
        description,
        permissions
      });
    } else {
      addCustomRole({
        entityId: currentEntityId,
        name,
        description,
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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {initialRole ? 'Edit Role & Permission' : 'Buat Role Baru (Custom F&B Role)'}
            </h3>
            <p className="text-xs text-slate-500">Outlet: <strong className="text-amber-700">{currentEntity.name}</strong></p>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 flex-1">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Nama Role Baru *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: Head Barista / Supervisor Shift / Senior Cashier"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Deskripsi Singkat Role</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan wewenang dan tanggung jawab role ini..."
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Matrix Permission Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <label className="text-xs font-bold text-slate-900 block">Matriks Hak Akses & Permission Fitur</label>
            <div className="grid grid-cols-1 gap-2">
              {permissionFields.map(field => {
                const isChecked = permissions[field.key];
                return (
                  <div
                    key={field.key}
                    onClick={() => togglePermission(field.key)}
                    className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                      isChecked 
                        ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">{field.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{field.desc}</div>
                    </div>

                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                      isChecked ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
            >
              Simpan Role & Permission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
