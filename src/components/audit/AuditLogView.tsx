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

  const [logs, setLogs] = useState<AuditLog[]>(seedLogs);

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
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            <span>Audit Log Sistem & Jejak Keamanan ({currentEntity.name})</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Rekaman jejak aktivitas sensitif (buka/tutup shift, PIN kasir, void struk, dan perubahan setelan).</p>
        </div>

        <button
          onClick={handleExportAuditExcel}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shrink-0 shadow-xs"
          style={{ outline: 'none', border: 'none' }}
        >
          <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
          <span>Export Audit Log (.csv)</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-2xl">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari rincian aktivitas, nama petugas, atau kata kunci..."
            className="w-full bg-slate-50 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 border border-slate-200"
            style={{ outline: 'none' }}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="bg-white border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2 font-extrabold w-full sm:w-auto"
            style={{ outline: 'none' }}
          >
            <option value="ALL">Semua Aksi Audit</option>
            <option value="OPEN_SHIFT">Buka Shift Kasir</option>
            <option value="CLOSE_SHIFT">Tutup Shift Kasir</option>
            <option value="CREATE_ORDER">Transaksi Baru</option>
            <option value="VOID_ORDER">Void Transaksi</option>
            <option value="SETTINGS_UPDATE">Perubahan Setelan</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="divide-y divide-slate-100">
          {filteredLogs.length > 0 ? (
            filteredLogs.map(log => {
              const dateStr = new Date(log.timestamp).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black shrink-0 border ${
                      log.action === 'OPEN_SHIFT' || log.action === 'CLOSE_SHIFT' ? 'bg-sky-50 border-sky-200 text-sky-700' :
                      log.action === 'VOID_ORDER' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                      log.action === 'SETTINGS_UPDATE' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                      'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}>
                      {log.action === 'OPEN_SHIFT' || log.action === 'CLOSE_SHIFT' ? <Lock className="w-4 h-4" /> :
                       log.action === 'VOID_ORDER' ? <AlertCircle className="w-4 h-4" /> :
                       <ShieldCheck className="w-4 h-4" />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-900">{log.action}</span>
                        <span className={`px-2 py-0.2 rounded-md text-[9px] font-black uppercase ${
                          log.severity === 'WARNING' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {log.severity || 'INFO'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed">{log.details}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold pt-0.5">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {log.actorName} ({log.actorRole})
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {dateStr}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs font-bold space-y-2">
              <ShieldCheck className="w-10 h-10 mx-auto text-slate-200" />
              <p>Tidak ada rekaman audit log yang sesuai filter.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
