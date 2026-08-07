import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import type { UserAccount } from '../../types/pos';
import { UserFormModal } from './UserFormModal';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Mail, 
  Search,
  UserCheck,
  Shield,
  Building2
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { users, currentEntityId, currentEntity, currentUser, deleteUser } = usePOS();
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [deletingUser, setDeletingUser] = useState<UserAccount | null>(null);

  // Show users assigned to current entity or all users for SuperAdmin/Owner
  const storeUsers = users.filter(u => 
    currentUser?.role === 'SuperAdmin' || u.tenantId === currentEntityId
  );

  // Filtered staff list
  const filteredUsers = storeUsers.filter(user => {
    const matchesRole = selectedRoleFilter === 'ALL' || user.role === selectedRoleFilter;
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Calculate KPIs
  const totalStaffCount = storeUsers.length;
  const cashierBaristaCount = storeUsers.filter(u => u.role === 'Kasir' || u.role === 'Barista' || u.role === 'Staff').length;
  const managerAdminCount = storeUsers.filter(u => u.role === 'Manager' || u.role === 'Owner' || u.role === 'SuperAdmin').length;

  const handleEdit = (user: UserAccount) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingUser) {
      deleteUser(deletingUser.id);
      setDeletingUser(null);
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'SuperAdmin':
        return 'bg-slate-900 text-white border-slate-900';
      case 'Owner':
        return 'bg-red-600 text-white border-red-600';
      case 'Manager':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Kasir':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-6 overflow-y-auto font-sans select-none">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            <span>Manajemen Staf & Hak Akses User ({currentEntity.name})</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Kelola akun staf kasir, barista, manager, dan otoritas pemilik outlet bisnis.</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shrink-0"
          style={{ outline: 'none', border: 'none' }}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Staf Baru</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Total Staf Akun</span>
            <span className="text-base font-black text-slate-900">{totalStaffCount} Staf</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-black text-xs">
            <UserCheck className="w-4 h-4 text-slate-700" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Kasir & Operational</span>
            <span className="text-base font-black text-emerald-600">{cashierBaristaCount} Staf</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Manager & Otoritas</span>
            <span className="text-base font-black text-red-600">{managerAdminCount} Staf</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Outlet Terhubung</span>
            <span className="text-base font-black text-slate-800">{currentEntity.name}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs">
            <Building2 className="w-4 h-4 text-slate-700" />
          </div>
        </div>
      </div>

      {/* Search & Role Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari staf berdasarkan nama atau email login..."
            className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 font-bold"
            style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'Owner', 'Manager', 'Kasir'].map(roleName => (
            <button
              key={roleName}
              onClick={() => setSelectedRoleFilter(roleName)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-colors ${
                selectedRoleFilter === roleName
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
              style={{ outline: 'none' }}
            >
              {roleName === 'ALL' ? 'Semua Role' : roleName}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Staf Pengguna</th>
              <th className="p-3.5">Email Login</th>
              <th className="p-3.5">Role & Otoritas Akses</th>
              <th className="p-3.5">Penugasan Tenant</th>
              <th className="p-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(userItem => (
                <tr key={userItem.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={userItem.avatar}
                        alt={userItem.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-extrabold text-slate-900">{userItem.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {userItem.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{userItem.email}</span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getRoleBadgeStyle(userItem.role)}`}>
                      {userItem.role}
                    </span>
                  </td>

                  <td className="p-3.5 font-bold text-slate-800 uppercase text-[11px]">
                    {userItem.tenantId}
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEdit(userItem)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-red-600 transition-colors"
                        style={{ outline: 'none' }}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {userItem.id !== currentUser?.id && (
                        <button
                          onClick={() => setDeletingUser(userItem)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors"
                          style={{ outline: 'none' }}
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
                <td colSpan={5} className="p-8 text-center text-slate-400 font-bold">
                  Belum ada staf terdaftar di toko ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* User Form Modal */}
      {isFormOpen && (
        <UserFormModal
          initialUser={editingUser}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 space-y-4 text-center" style={{ border: '1px solid #e2e8f0' }}>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto shrink-0">
              <Trash2 className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">Hapus Akun Staf?</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Apakah Anda yakin ingin menghapus staf <strong className="text-slate-800">"{deletingUser.name}"</strong>? Staf tidak dapat login kembali setelah dihapus.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeletingUser(null)}
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
