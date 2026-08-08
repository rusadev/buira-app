import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import type { AuditLog } from '../../types/pos';
import { ShieldCheck, Search, Filter, Clock, User, AlertCircle, FileSpreadsheet, Lock } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { currentEntityId, currentEntity, currentUser } = usePOS();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterAction, setFilterAction] = useState<string>('ALL');

  // Initial Seed Audit Logs for demonstration
  const seedLogs: AuditLog[] = [
    {
      id: 'log-1',
      entityId: currentEntityId,
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      action: 'OPEN_SHIFT',
      actorName: currentUser?.name || 'Budi (Barista)',
      actorRole: currentUser?.role || 'Barista',
      details: 'Membuka Shift Kasir dengan Modal Kas Awal Rp 200.000 (PIN Terverifikasi)',
      severity: 'INFO'
    },
    {
      id: 'log-2',
      entityId: currentEntityId,
      timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      action: 'CREATE_ORDER',
      actorName: currentUser?.name || 'Budi (Barista)',
      actorRole: currentUser?.role || 'Barista',
      details: 'Memproses Transaksi ORD-889122 senilai Rp 56.580 (Metode: Cash)',
      severity: 'INFO'
    },
    {
      id: 'log-3',
      entityId: currentEntityId,
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
      action: 'VOID_ORDER',
      actorName: 'Manager Operasional',
      actorRole: 'Manager',
      details: 'Melakukan VOID Transaksi ORD-889100 senilai Rp 45.000 dengan alasan Pelanggan Batal',
      severity: 'WARNING'
    },
    {
      id: 'log-4',
      entityId: currentEntityId,
      timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(),
      action: 'SETTINGS_UPDATE',
      actorName: 'Owner F&B',
      actorRole: 'Owner',
      details: 'Memperbarui Pengaturan Biaya Layanan QRIS dan Logo Outlet Toko',
      severity: 'INFO'
    }
  ];

  const [logs] = useState<AuditLog[]>(seedLogs);

  const filteredLogs = logs.filter(l => {
    if (l.entityId !== currentEntityId) return false;
    if (filterAction !== 'ALL' && l.action !== filterAction) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.details.toLowerCase().includes(q) ||
        l.actorName.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportAuditExcel = () => {
    const headers = ['ID Log', 'Waktu & Tanggal', 'Tipe Aksi', 'Nama Petugas', 'Role Staff', 'Rincian Aktivitas Audit', 'Tingkat Keamanan'];
    const rows = filteredLogs.map(l => [
      `"${l.id}"`,
      `"${new Date(l.timestamp).toLocaleString('id-ID')}"`,
      `"${l.action}"`,
      `"${l.actorName}"`,
      `"${l.actorRole}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.severity || 'INFO'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.join('\n')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Audit_Log_${currentEntity.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6 font-sans bg-slate-50 select-none">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            <span>Audit Log System & Security Track ({currentEntity.name})</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Jejak rekaman aktivitas sensitif toko, buka/tutup shift kasir, void struk, dan keamanan.</p>
        </div>

        {/* Export Excel Audit Button */}
        <button
          onClick={handleExportAuditExcel}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-2.5 rounded-none text-xs flex items-center gap-2 transition-all shrink-0"
          style={{ outline: 'none', border: 'none' }}
        >
          <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
          <span>Export Audit Log (.csv)</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari jejak aktivitas, staf, atau ID transaksi..."
            className="w-full bg-white rounded-none pl-10 pr-4 py-2.5 text-xs text-slate-900 font-extrabold border border-slate-200"
            style={{ outline: 'none' }}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full sm:w-auto bg-white border border-slate-200 text-slate-900 text-xs rounded-none px-3 py-2.5 font-extrabold"
            style={{ outline: 'none' }}
          >
            <option value="ALL">Semua Aksi (All Logs)</option>
            <option value="OPEN_SHIFT">Buka Shift Kasir</option>
            <option value="CLOSE_SHIFT">Tutup Shift Kasir</option>
            <option value="CREATE_ORDER">Transaksi Baru</option>
            <option value="VOID_ORDER">Void Transaksi</option>
            <option value="SETTINGS_UPDATE">Pengaturan Outlet</option>
          </select>
        </div>
      </div>

      {/* Audit Log Data Table */}
      <div className="bg-white border border-slate-200 rounded-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-extrabold">
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Tipe Aksi</th>
                <th className="py-3 px-4">Petugas Staf</th>
                <th className="py-3 px-4">Rincian Aktivitas Audit</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => {
                  const dateStr = new Date(log.timestamp).toLocaleString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{dateStr}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-none text-[10px] font-black tracking-wider uppercase border ${
                          log.action === 'OPEN_SHIFT' || log.action === 'CLOSE_SHIFT'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : log.action === 'VOID_ORDER'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : log.action === 'SETTINGS_UPDATE'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{log.actorName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({log.actorRole})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-md">
                        <p className="line-clamp-2">{log.details}</p>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {log.severity === 'WARNING' || log.severity === 'CRITICAL' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-none">
                            <AlertCircle className="w-3 h-3" />
                            SENSITIF
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-none">
                            <ShieldCheck className="w-3 h-3" />
                            NORMAL
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-extrabold">
                    Tidak ada catatan audit log ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
