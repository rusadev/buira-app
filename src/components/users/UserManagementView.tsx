import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import type { UserAccount } from '../../types/pos';
import { UserFormModal } from './UserFormModal';
import { Users, Plus, Edit3, Trash2, ShieldCheck, Mail } from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { users, currentEntityId, currentEntity, currentUser, deleteUser } = usePOS();
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  // Show users assigned to current entity or all users for SuperAdmin/Owner
  const storeUsers = users.filter(u => 
    currentUser?.role === 'SuperAdmin' || u.tenantId === currentEntityId
  );

  const handleEdit = (user: UserAccount) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-5 overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            <span>Manajemen Staf & Hak Akses User ({currentEntity.name})</span>
          </h2>
          <p className="text-xs text-slate-500">Kelola akun staf kasir, barista, manager, dan pemilik outlet bisnis.</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Staf Baru</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Pengguna / Staf</th>
              <th className="p-3.5">Email Login</th>
              <th className="p-3.5">Role / Akses</th>
              <th className="p-3.5">Penugasan Tenant</th>
              <th className="p-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {storeUsers.length > 0 ? (
              storeUsers.map(userItem => (
                <tr key={userItem.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={userItem.avatar}
                        alt={userItem.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900">{userItem.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {userItem.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{userItem.email}</span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      userItem.role === 'SuperAdmin'
                        ? 'bg-purple-100 text-purple-900 border border-purple-200'
                        : userItem.role === 'Owner'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {userItem.role}
                    </span>
                  </td>

                  <td className="p-3.5 font-semibold text-slate-800 uppercase text-[11px]">
                    {userItem.tenantId}
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(userItem)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-amber-700 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {userItem.id !== currentUser?.id && (
                        <button
                          onClick={() => deleteUser(userItem.id)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                  Belum ada staf terdaftar di toko ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <UserFormModal
          initialUser={editingUser}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};
