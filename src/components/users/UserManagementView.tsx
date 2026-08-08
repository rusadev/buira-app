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
  Building2,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  CircleDot
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { users, currentEntityId, currentEntity, currentUser, deleteUser } = usePOS();
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [deletingUser, setDeletingUser] = useState<UserAccount | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 8;

  // Exclude Global SuperAdmin accounts from tenant staff list
  const storeUsers = users.filter(u => 
    u.role !== 'SuperAdmin' && u.tenantId === currentEntityId
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
  const cashierBaristaCount = storeUsers.filter(u => u.role === 'Kasir' || u.role === 'Dapur' || u.role === 'Barista' || u.role === 'Staff').length;
  const managerAdminCount = storeUsers.filter(u => u.role === 'Manager' || u.role === 'Owner' || u.role === 'SPV').length;

  // Pagination calculation
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
          className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2.5 rounded-none text-xs flex items-center gap-2 transition-all shrink-0"
          style={{ outline: 'none', border: 'none' }}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Staf Baru</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-none border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Total Staf Akun</span>
            <span className="text-base font-black text-slate-900">{totalStaffCount} Staf</span>
          </div>
          <div className="w-8 h-8 rounded-none bg-slate-100 flex items-center justify-center text-slate-700 font-black text-xs">
            <UserCheck className="w-4 h-4 text-slate-700" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-none border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Kasir & Operasional</span>
            <span className="text-base font-black text-emerald-600">{cashierBaristaCount} Staf</span>
          </div>
          <div className="w-8 h-8 rounded-none bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-none border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Manager & Otoritas</span>
            <span className="text-base font-black text-red-600">{managerAdminCount} Staf</span>
          </div>
          <div className="w-8 h-8 rounded-none bg-red-50 text-red-600 flex items-center justify-center font-black text-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-none border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Outlet Terhubung</span>
            <span className="text-base font-black text-slate-800">{currentEntity.name}</span>
          </div>
          <div className="w-8 h-8 rounded-none bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs">
            <Building2 className="w-4 h-4 text-slate-700" />
          </div>
        </div>
      </div>

      {/* Search & Role Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-none border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari staf berdasarkan nama atau email login..."
            className="w-full bg-slate-50 rounded-none pl-10 pr-4 py-2 text-xs text-slate-800 font-bold"
            style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'Owner', 'Manager', 'Kasir'].map(roleName => (
            <button
              key={roleName}
              onClick={() => {
                setSelectedRoleFilter(roleName);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-none text-xs font-extrabold whitespace-nowrap transition-colors ${
                selectedRoleFilter === roleName
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
              style={{ outline: 'none' }}
            >
              {roleName === 'ALL' ? 'Semua Role' : roleName}
            </button>
          ))}

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-none border border-slate-200 shrink-0 ml-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-none transition-colors ${
                viewMode === 'grid' ? 'bg-white text-red-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              style={{ outline: 'none' }}
              title="Tampilan Kartu (Grid)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-none transition-colors ${
                viewMode === 'table' ? 'bg-white text-red-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              style={{ outline: 'none' }}
              title="Tampilan Tabel (List)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Staff View: GRID MODE */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map(userItem => {
              const isCurrentUser = userItem.id === currentUser?.id;

              return (
                <div 
                  key={userItem.id} 
                  className={`bg-white border rounded-none p-4 flex flex-col justify-between space-y-4 transition-all relative ${
                    isCurrentUser ? 'border-red-500' : 'border-slate-200 hover:border-red-600'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="relative">
                        <img
                          src={userItem.avatar}
                          alt={userItem.name}
                          className="w-12 h-12 rounded-none object-cover border border-slate-200"
                        />
                        {isCurrentUser && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-none flex items-center justify-center" title="Sesi Login Aktif">
                            <CircleDot className="w-2.5 h-2.5 text-white" />
                          </span>
                        )}
                      </div>

                      <span className={`px-2.5 py-1 rounded-none text-[10px] font-black uppercase tracking-wider border ${getRoleBadgeStyle(userItem.role)}`}>
                        {userItem.role}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                        <span>{userItem.name}</span>
                        {isCurrentUser && (
                          <span className="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-black">Anda</span>
                        )}
                      </h4>
                      <div className="flex items-center gap-1 text-slate-500 text-xs font-bold mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{userItem.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono font-bold">
                      {userItem.tenantId.toUpperCase()}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(userItem)}
                        className="p-1.5 rounded-none bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-red-600 transition-colors"
                        style={{ outline: 'none' }}
                        title="Edit Data Staf"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {!isCurrentUser && (
                        <button
                          onClick={() => setDeletingUser(userItem)}
                          className="p-1.5 rounded-none bg-slate-50 border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                          style={{ outline: 'none' }}
                          title="Hapus Staf"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full p-12 text-center text-slate-400 font-bold bg-white rounded-none border border-slate-200">
              Belum ada staf terdaftar di toko ini.
            </div>
          )}
        </div>
      ) : (
        /* Staff View: TABLE MODE */
        <div className="bg-white border border-slate-200 rounded-none overflow-hidden">
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
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map(userItem => {
                  const isCurrentUser = userItem.id === currentUser?.id;

                  return (
                    <tr key={userItem.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={userItem.avatar}
                            alt={userItem.name}
                            className="w-9 h-9 rounded-none object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                              <span>{userItem.name}</span>
                              {isCurrentUser && (
                                <span className="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-black">Anda</span>
                              )}
                            </h4>
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
                        <span className={`px-2.5 py-1 rounded-none text-[10px] font-black uppercase tracking-wider border ${getRoleBadgeStyle(userItem.role)}`}>
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
                            className="p-1.5 rounded-none bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-red-600 transition-colors"
                            style={{ outline: 'none' }}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {!isCurrentUser && (
                            <button
                              onClick={() => setDeletingUser(userItem)}
                              className="p-1.5 rounded-none bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors"
                              style={{ outline: 'none' }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
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
      )}

      {/* Pagination Controls */}
      {filteredUsers.length > 0 && (
        <div className="p-4 border-t border-slate-200 bg-white rounded-none flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-slate-600">
          <div>
            Menampilkan <span className="text-slate-900 font-extrabold">{startIndex + 1}</span> - <span className="text-slate-900 font-extrabold">{Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)}</span> dari <span className="text-slate-900 font-extrabold">{filteredUsers.length}</span> staf akun
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              className={`p-2 rounded-none border flex items-center justify-center transition-all ${
                safeCurrentPage === 1 
                  ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              style={{ outline: 'none' }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-none text-xs font-extrabold flex items-center justify-center transition-all ${
                  safeCurrentPage === page
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
                style={{ outline: 'none' }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              className={`p-2 rounded-none border flex items-center justify-center transition-all ${
                safeCurrentPage === totalPages 
                  ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              style={{ outline: 'none' }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
          <div className="bg-white rounded-none w-full max-w-sm overflow-hidden flex flex-col p-6 space-y-4 text-center" style={{ border: '1px solid #e2e8f0' }}>
            <div className="w-12 h-12 rounded-none bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto shrink-0">
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
                className="flex-1 py-3 rounded-none text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                style={{ outline: 'none', border: 'none' }}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 rounded-none text-xs font-extrabold text-white transition-colors"
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
