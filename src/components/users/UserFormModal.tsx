import React, { useState } from 'react';
import type { UserAccount, UserRole, EntityType } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { X } from 'lucide-react';

interface UserFormModalProps {
  initialUser?: UserAccount | null;
  onClose: () => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ initialUser, onClose }) => {
  const { currentEntityId, entities, addUser, updateUser } = usePOS();

  const [name, setName] = useState<string>(initialUser?.name || '');
  const [email, setEmail] = useState<string>(initialUser?.email || '');
  const [role, setRole] = useState<UserRole>(initialUser?.role || 'Kasir');
  const [assignedTenantId, setAssignedTenantId] = useState<EntityType>(initialUser?.tenantId || currentEntityId);
  const [avatar, setAvatar] = useState<string>(
    initialUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (initialUser) {
      updateUser({
        ...initialUser,
        name,
        email,
        role,
        tenantId: assignedTenantId,
        avatar
      });
    } else {
      addUser({
        name,
        email,
        role,
        tenantId: assignedTenantId,
        allowedTenantIds: [assignedTenantId],
        avatar
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-sm font-bold text-slate-900">
            {initialUser ? 'Edit Data Staf' : 'Tambah Staf / Kasir Baru'}
          </h3>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Nama Lengkap Staf *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: Andi Kasir"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Email Login Staf *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="andi@outlet.id"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Role / Hak Akses</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-bold"
            >
              <option value="Kasir">Kasir Operasional</option>
              <option value="Manager">Manager Outlet</option>
              <option value="Owner">Owner Outlet</option>
              <option value="Apoteker">Apoteker (Khusus Apotek)</option>
              <option value="Agent">Agent (Khusus Properti)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Penugasan Outlet / Tenant</label>
            <select
              value={assignedTenantId}
              onChange={(e) => setAssignedTenantId(e.target.value as EntityType)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-bold"
            >
              {entities.map(e => (
                <option key={e.id} value={e.id}>{e.name} ({e.businessType})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">URL Foto Profil Avatar</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
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
              Simpan Data Staf
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
