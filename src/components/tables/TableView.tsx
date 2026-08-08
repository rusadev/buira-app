import React, { useState } from 'react';
import type { Table } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { TableFormModal } from './TableFormModal';
import { TableAreaManagerModal } from './TableAreaManagerModal';
import { 
  LayoutGrid, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  XCircle,
  MapPin
} from 'lucide-react';

export const TableView: React.FC = () => {
  const { 
    tables, 
    tableAreas,
    currentEntityId, 
    setSelectedTableNumber, 
    setActiveTab, 
    updateTableStatus,
    deleteTable 
  } = usePOS();

  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState<boolean>(false);
  const [deletingTable, setDeletingTable] = useState<Table | null>(null);

  const entityTables = tables.filter(t => t.entityId === currentEntityId);

  // Group areas
  const areas = Array.from(new Set(entityTables.map(t => t.area || 'Indoor Utama')));

  // Filtered tables
  const filteredTables = entityTables.filter(t => {
    if (selectedArea === 'ALL') return true;
    return (t.area || 'Indoor Utama') === selectedArea;
  });

  const availableCount = entityTables.filter(t => t.status === 'Available').length;
  const occupiedCount = entityTables.filter(t => t.status === 'Occupied').length;
  const reservedCount = entityTables.filter(t => t.status === 'Reserved').length;

  const handleSelectTableForOrder = (tableNum: string) => {
    setSelectedTableNumber(tableNum);
    setActiveTab('cashier');
  };

  const handleEditTable = (table: Table, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTable(table);
    setIsFormOpen(true);
  };

  const handleDeleteTable = (table: Table, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingTable(table);
  };

  const handleConfirmDelete = () => {
    if (deletingTable) {
      deleteTable(deletingTable.id);
      setDeletingTable(null);
    }
  };

  const handleQuickStatusChange = (tableId: string, newStatus: Table['status'], e: React.MouseEvent) => {
    e.stopPropagation();
    updateTableStatus(tableId, newStatus);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-6 overflow-y-auto font-sans select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-red-600" />
            <span>Denah & Manajemen Meja Dine-In</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Kelola tata letak meja, kapasitas kursi, status terisi/reservasi, dan zona area resto.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAreaModalOpen(true)}
            className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-extrabold px-3.5 py-2.5 rounded-none text-xs flex items-center gap-2 transition-all shrink-0"
            style={{ outline: 'none' }}
          >
            <MapPin className="w-4 h-4 text-red-600" />
            <span>Kelola Zona Area ({tableAreas.length})</span>
          </button>

          <button
            onClick={() => {
              setEditingTable(null);
              setIsFormOpen(true);
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2.5 rounded-none text-xs flex items-center gap-2 transition-all shrink-0"
            style={{ outline: 'none', border: 'none' }}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah Meja Baru</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-none border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Total Meja</span>
            <span className="text-base font-black text-slate-900">{entityTables.length} Meja</span>
          </div>
          <div className="w-8 h-8 rounded-none bg-slate-100 flex items-center justify-center text-slate-700 font-black text-xs">
            {entityTables.length}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-none border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Kosong (Available)</span>
            <span className="text-base font-black text-emerald-600">{availableCount} Meja</span>
          </div>
          <div className="w-8 h-8 rounded-none bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs">
            {availableCount}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-none border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Terisi (Occupied)</span>
            <span className="text-base font-black text-red-600">{occupiedCount} Meja</span>
          </div>
          <div className="w-8 h-8 rounded-none bg-red-50 text-red-600 flex items-center justify-center font-black text-xs">
            {occupiedCount}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-none border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Reservasi</span>
            <span className="text-base font-black text-slate-700">{reservedCount} Meja</span>
          </div>
          <div className="w-8 h-8 rounded-none bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs">
            {reservedCount}
          </div>
        </div>
      </div>

      {/* Area Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setSelectedArea('ALL')}
          className={`px-4 py-2 rounded-none text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
            selectedArea === 'ALL' ? 'bg-red-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
          style={{ outline: 'none' }}
        >
          Semua Zona Area ({entityTables.length})
        </button>
        {areas.map(a => {
          const count = entityTables.filter(t => (t.area || 'Indoor Utama') === a).length;
          const isActive = selectedArea === a;
          return (
            <button
              key={a}
              onClick={() => setSelectedArea(a)}
              className={`px-4 py-2 rounded-none text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                isActive ? 'bg-red-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
              style={{ outline: 'none' }}
            >
              {a} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid Meja */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredTables.length > 0 ? (
          filteredTables.map(table => {
            const isOccupied = table.status === 'Occupied';
            const isReserved = table.status === 'Reserved';

            return (
              <div
                key={table.id}
                onClick={() => handleSelectTableForOrder(table.tableNumber)}
                className={`p-4 rounded-none border transition-all cursor-pointer flex flex-col justify-between space-y-3 group bg-white ${
                  isOccupied 
                    ? 'border-red-500' 
                    : isReserved
                      ? 'border-slate-400 bg-slate-50/50'
                      : 'border-slate-200 hover:border-red-600'
                }`}
              >
                {/* Top Row: Table Number & Status Badge */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-red-600 transition-colors">
                      {table.tableNumber}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-slate-400" />
                      {table.area || 'Indoor Utama'}
                    </span>
                  </div>

                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-none uppercase tracking-wider ${
                    isOccupied 
                      ? 'bg-red-600 text-white' 
                      : isReserved
                        ? 'bg-slate-700 text-white'
                        : 'bg-emerald-600 text-white'
                  }`}>
                    {isOccupied ? 'Terisi' : isReserved ? 'Reservasi' : 'Kosong'}
                  </span>
                </div>

                {/* Middle Info: Capacity & Customer Name if occupied */}
                <div className="py-2 border-y border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-red-600" />
                      {table.capacity} Kursi
                    </span>
                    <span className="text-red-600 font-extrabold group-hover:underline text-[11px]">
                      Buka Order →
                    </span>
                  </div>

                  {isOccupied && table.customerName && (
                    <p className="text-[10px] font-extrabold text-red-700 bg-red-50 p-1 rounded border border-red-100 truncate">
                      Atas Nama: {table.customerName}
                    </p>
                  )}
                </div>

                {/* Bottom Quick Controls */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <div className="flex items-center gap-1">
                    {isOccupied ? (
                      <button
                        type="button"
                        onClick={(e) => handleQuickStatusChange(table.id, 'Available', e)}
                        className="px-2 py-0.5 rounded-none bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold border border-emerald-200"
                        style={{ outline: 'none' }}
                      >
                        Kosongkan
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleQuickStatusChange(table.id, 'Occupied', e)}
                        className="px-2 py-0.5 rounded-none bg-red-50 hover:bg-red-100 text-red-700 font-extrabold border border-red-200"
                        style={{ outline: 'none' }}
                      >
                        Tandai Terisi
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleEditTable(table, e)}
                      className="p-1 rounded-none bg-slate-100 hover:bg-slate-200 text-slate-600"
                      style={{ outline: 'none' }}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteTable(table, e)}
                      className="p-1 rounded-none bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600"
                      style={{ outline: 'none' }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full p-12 text-center text-slate-400 font-bold bg-white rounded-none border border-slate-200">
            Belum ada meja di zona area ini.
          </div>
        )}
      </div>

      {/* Table Form Modal */}
      {isFormOpen && (
        <TableFormModal
          initialTable={editingTable}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Table Area Manager Modal */}
      {isAreaModalOpen && (
        <TableAreaManagerModal
          onClose={() => setIsAreaModalOpen(false)}
        />
      )}

      {/* Delete Table Confirmation Modal */}
      {deletingTable && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
          <div className="bg-white rounded-none w-full max-w-sm overflow-hidden flex flex-col p-6 space-y-4 text-center" style={{ border: '1px solid #e2e8f0' }}>
            <div className="w-12 h-12 rounded-none bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto shrink-0">
              <Trash2 className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">Hapus Data Meja?</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Apakah Anda yakin ingin menghapus <strong className="text-slate-800">"{deletingTable.tableNumber}"</strong> dari denah meja?
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeletingTable(null)}
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
