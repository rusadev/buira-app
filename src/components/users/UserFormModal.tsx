import React, { useState } from 'react';
import type { UserAccount, UserRole, EntityType } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { X, Eye, EyeOff, ShieldCheck, UserCheck } from 'lucide-react';

interface UserFormModalProps {
  initialUser?: UserAccount | null;
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
];

export const UserFormModal: React.FC<UserFormModalProps> = ({ initialUser, onClose }) => {
  const { currentEntityId, entities, customRoles, addUser, updateUser } = usePOS();

  const [assignedTenantId, setAssignedTenantId] = useState<EntityType>(initialUser?.tenantId || currentEntityId);
  const targetEntity = entities.find(e => e.id === assignedTenantId) || entities[0];

  const tenantCustomRoles = customRoles.filter(r => r.entityId === assignedTenantId);

  const [name, setName] = useState<string>(initialUser?.name || '');
  const [email, setEmail] = useState<string>(initialUser?.email || '');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole>(initialUser?.role || (tenantCustomRoles[0]?.name || 'Kasir'));
  const [customRoleId, setCustomRoleId] = useState<string>(initialUser?.customRoleId || tenantCustomRoles[0]?.id || '');
  const [avatar, setAvatar] = useState<string>(
    initialUser?.avatar || PRESET_AVATARS[0]
  );

  const handleRoleChange = (roleId: string) => {
    setCustomRoleId(roleId);
    const foundRole = tenantCustomRoles.find(r => r.id === roleId);
    if (foundRole) {
      setRole(foundRole.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    if (!initialUser && !password.trim()) return;

    if (initialUser) {
      updateUser({
        ...initialUser,
        name: name.trim(),
        email: email.trim(),
        password: password.trim() ? password.trim() : initialUser.password,
        role,
        customRoleId,
        tenantId: assignedTenantId,
        avatar
      });
    } else {
      addUser({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role,
        customRoleId,
        tenantId: assignedTenantId,
        allowedTenantIds: [assignedTenantId],
        avatar
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col space-y-4 p-6" style={{ border: '1px solid #e2e8f0' }}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {initialUser ? 'Edit Data Staf' : 'Tambah Staf Baru'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Outlet: <strong className="text-red-600 font-extrabold">{targetEntity.name}</strong></p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            style={{ outline: 'none' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Nama Lengkap Staf *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: Andi Kasir / Budi Barista"
              className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-extrabold"
              style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
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
              className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-extrabold"
              style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">
              {initialUser ? 'Ubah Kata Sandi (Kosongkan jika tidak diubah)' : 'Kata Sandi Staf *'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required={!initialUser}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={initialUser ? '••••••••' : 'Masukkan kata sandi login staf...'}
                className="w-full bg-slate-50 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 font-extrabold"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                style={{ outline: 'none' }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Penugasan Outlet</label>
              <select
                value={assignedTenantId}
                onChange={(e) => setAssignedTenantId(e.target.value as EntityType)}
                className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-900 font-extrabold"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              >
                {entities.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Role & Hak Akses</label>
              <select
                value={customRoleId}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-900 font-extrabold"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              >
                {tenantCustomRoles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Preset Avatar Selection */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-slate-800">Pilih Foto Profil Staf</label>
            <div className="flex items-center gap-2">
              {PRESET_AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatar(url)}
                  className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all shrink-0 ${
                    avatar === url ? 'border-red-600 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                  style={{ outline: 'none' }}
                >
                  <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors"
              style={{ outline: 'none', border: 'none' }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl text-white font-extrabold text-xs transition-colors"
              style={{ outline: 'none', border: 'none', background: '#dc2626' }}
            >
              Simpan Data Staf
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
