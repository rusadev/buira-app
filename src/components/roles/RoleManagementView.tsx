import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import type { CustomRole } from '../../types/pos';
import { RoleFormModal } from './RoleFormModal';
import { ShieldCheck, Plus, Edit3, Trash2 } from 'lucide-react';

export const RoleManagementView: React.FC = () => {
  const { customRoles, currentEntityId, currentEntity, deleteCustomRole } = usePOS();
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [deletingRole, setDeletingRole] = useState<CustomRole | null>(null);

  const entityRoles = customRoles.filter(r => r.entityId === currentEntityId);

  const handleEdit = (role: CustomRole) => {
    setEditingRole(role);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingRole(null);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingRole) {
      deleteCustomRole(deletingRole.id);
      setDeletingRole(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-5 overflow-y-auto font-sans select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            <span>Kelola Role & Matriks Permission ({currentEntity.name})</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Pengaturan role kustom & batasan hak akses fitur untuk staf outlet F&B Anda.</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shrink-0"
          style={{ outline: 'none', border: 'none' }}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Role Baru</span>
        </button>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entityRoles.length > 0 ? (
          entityRoles.map(role => {
            const perm = role.permissions;
            const activePermsCount = Object.values(perm).filter(Boolean).length;

            return (
              <div key={role.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <span>{role.name}</span>
                      {role.isSystemRole && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-extrabold">
                          System Default
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(role)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-red-600 transition-colors"
                        style={{ outline: 'none' }}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {!role.isSystemRole && (
                        <button
                          onClick={() => setDeletingRole(role)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                          style={{ outline: 'none' }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{role.description}</p>
                </div>

                {/* Permission Badges Summary */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Hak Akses Fitur ({activePermsCount}/9 Aktif)
                  </div>
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {perm.canAccessPOS && <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded font-black">POS Kasir</span>}
                    {perm.canManageCatalog && <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded font-black">Katalog & HPP</span>}
                    {perm.canAccessKDS && <span className="bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded font-black">KDS Dapur</span>}
                    {perm.canManageTables && <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-black">Denah Meja</span>}
                    {perm.canManageInventory && <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded font-black">Stok Bahan</span>}
                    {perm.canManageStaff && <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-black">Kelola Staf</span>}
                    {perm.canViewReports && <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-black">Laporan Omset</span>}
                    {perm.canVoidOrders && <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded font-black">Void Transaksi</span>}
                    {perm.canManageSettings && <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-black">Pengaturan Toko</span>}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 font-bold">
            Belum ada custom role dibuat.
          </div>
        )}
      </div>

      {isFormOpen && (
        <RoleFormModal
          initialRole={editingRole}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Delete Role Modal */}
      {deletingRole && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 space-y-4 text-center" style={{ border: '1px solid #e2e8f0' }}>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto shrink-0">
              <Trash2 className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">Hapus Custom Role?</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Apakah Anda yakin ingin menghapus role <strong className="text-slate-800">"{deletingRole.name}"</strong>?
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeletingRole(null)}
                className="flex-1 py-3 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                style={{ outline: 'none', border: 'none' }}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 rounded-xl text-xs font-extrabold text-white transition-colors"
                style={{ outline: 'none', border: 'none', background: '#dc2626' }}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
