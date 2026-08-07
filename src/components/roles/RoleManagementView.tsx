import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import type { CustomRole } from '../../types/pos';
import { RoleFormModal } from './RoleFormModal';
import { ShieldCheck, Plus, Edit3, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export const RoleManagementView: React.FC = () => {
  const { customRoles, currentEntityId, currentEntity, deleteCustomRole } = usePOS();
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const entityRoles = customRoles.filter(r => r.entityId === currentEntityId);

  const handleEdit = (role: CustomRole) => {
    setEditingRole(role);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingRole(null);
    setIsFormOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-5 overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <span>Kelola Role & Matriks Permission ({currentEntity.name})</span>
          </h2>
          <p className="text-xs text-slate-500">Pengaturan role kustom & batasan hak akses fitur untuk staf outlet F&B Anda.</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all"
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
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{role.name}</span>
                      {role.isSystemRole && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                          System Default
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(role)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {!role.isSystemRole && (
                        <button
                          onClick={() => deleteCustomRole(role.id)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{role.description}</p>
                </div>

                {/* Permission Badges Summary */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Hak Akses Fitur ({activePermsCount}/9 Aktif)
                  </div>
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {perm.canAccessPOS && <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">POS Kasir</span>}
                    {perm.canManageCatalog && <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-semibold">Katalog & HPP</span>}
                    {perm.canAccessKDS && <span className="bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded font-semibold">KDS Dapur/Barista</span>}
                    {perm.canManageTables && <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-semibold">Denah Meja</span>}
                    {perm.canManageInventory && <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded font-semibold">Stok Bahan</span>}
                    {perm.canManageStaff && <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-semibold">Kelola Staf</span>}
                    {perm.canViewReports && <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">Laporan Omset</span>}
                    {perm.canVoidOrders && <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded font-semibold">Void Transaksi</span>}
                    {perm.canManageSettings && <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-semibold">Pengaturan Toko</span>}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 font-medium">
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
    </div>
  );
};
