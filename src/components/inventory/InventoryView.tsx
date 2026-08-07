import React, { useState } from 'react';
import type { InventoryItem } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { InventoryFormModal } from './InventoryFormModal';
import { 
  Boxes, 
  AlertCircle, 
  PlusCircle, 
  MinusCircle, 
  History, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  PackageCheck
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { inventory, stockMovements, currentEntityId, currentEntity, addStockMovement } = usePOS();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN');
  const [movementQty, setMovementQty] = useState<number>(1);
  const [movementReason, setMovementReason] = useState<string>('Restok Pembelian Supplier');
  const [isMovementModalOpen, setIsMovementModalOpen] = useState<boolean>(false);

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 8;

  const entityInventory = inventory.filter(i => i.entityId === currentEntityId);
  const entityMovements = stockMovements.filter(m => m.entityId === currentEntityId);

  // Dynamic Categories
  const categories = Array.from(new Set(entityInventory.map(i => i.category)));

  // Filtered inventory
  const filteredInventory = entityInventory.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate KPIs
  const totalItemsCount = entityInventory.length;
  const totalAssetValue = entityInventory.reduce((sum, item) => sum + (item.stock * item.costPerUnit), 0);
  const lowStockCount = entityInventory.filter(item => item.stock <= item.minStock).length;
  const todayMovementsCount = entityMovements.length;

  // Pagination calculation
  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInventory = filteredInventory.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleOpenMovementModal = (itemId: string, type: 'IN' | 'OUT') => {
    setSelectedItemId(itemId);
    setMovementType(type);
    setMovementQty(1);
    setMovementReason(type === 'IN' ? 'Restok Pembelian Supplier' : 'Pemakaian Dapur / Rusak');
    setIsMovementModalOpen(true);
  };

  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || movementQty <= 0) return;

    const item = inventory.find(i => i.id === selectedItemId);
    if (!item) return;

    addStockMovement({
      entityId: currentEntityId,
      inventoryItemId: selectedItemId,
      itemName: item.name,
      type: movementType,
      quantity: movementQty,
      reason: movementReason,
      createdBy: 'Admin Stok'
    });

    setIsMovementModalOpen(false);
  };

  const handleDeleteItem = () => {
    if (deletingItem) {
      const idx = inventory.findIndex(i => i.id === deletingItem.id);
      if (idx !== -1) {
        inventory.splice(idx, 1);
      }
      setDeletingItem(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-6 overflow-y-auto font-sans select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-red-600" />
            <span>Manajemen Stok Bahan Baku & Persediaan ({currentEntity.name})</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Audit persediaan bahan baku mentah, restok supplier, dan pencatatan mutasi pemakaian dapur.</p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shrink-0"
          style={{ outline: 'none', border: 'none' }}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Bahan Baku</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Total Item Bahan</span>
            <span className="text-base font-black text-slate-900">{totalItemsCount} Item</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-black text-xs">
            <PackageCheck className="w-4 h-4 text-slate-700" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Total Nilai Aset Stok</span>
            <span className="text-base font-black text-emerald-600">{formatRupiah(totalAssetValue)}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Stok Menipis Alert</span>
            <span className="text-base font-black text-red-600">{lowStockCount} Item</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xs">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Total Mutasi Log</span>
            <span className="text-base font-black text-slate-700">{todayMovementsCount} Log</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs">
            <History className="w-4 h-4 text-slate-700" />
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari bahan baku (kopi, susu, ayam, packaging)..."
            className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 font-bold"
            style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 text-slate-800 text-xs rounded-xl px-3.5 py-2 font-extrabold"
            style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
          >
            <option value="ALL">Semua Kategori ({entityInventory.length})</option>
            {categories.map(c => {
              const count = entityInventory.filter(i => i.category === c).length;
              return (
                <option key={c} value={c}>{c} ({count})</option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Inventory Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Nama Bahan Baku</th>
                <th className="p-3.5">Kategori</th>
                <th className="p-3.5">Stok Saat Ini</th>
                <th className="p-3.5">Harga per Unit (HPP)</th>
                <th className="p-3.5">Nilai Aset Stok</th>
                <th className="p-3.5">Restok Terakhir</th>
                <th className="p-3.5 text-right">Aksi Mutasi & Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedInventory.length > 0 ? (
                paginatedInventory.map(item => {
                  const isLowStock = item.stock <= item.minStock;
                  const totalValue = item.stock * item.costPerUnit;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-extrabold text-slate-900">
                        {item.name}
                      </td>

                      <td className="p-3.5 font-bold text-red-600">
                        {item.category}
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-black ${isLowStock ? 'text-rose-600' : 'text-slate-900'}`}>
                            {item.stock} {item.unit}
                          </span>
                          {isLowStock && (
                            <span className="bg-rose-50 text-rose-700 text-[10px] font-black px-1.5 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                              <AlertCircle className="w-2.5 h-2.5 text-rose-600" />
                              Restok!
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 font-bold text-slate-600">
                        {formatRupiah(item.costPerUnit)} / {item.unit}
                      </td>

                      <td className="p-3.5 font-black text-emerald-600">
                        {formatRupiah(totalValue)}
                      </td>

                      <td className="p-3.5 text-slate-500 font-bold">
                        {item.lastRestocked}
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenMovementModal(item.id, 'IN')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-600 hover:text-white font-extrabold text-[11px] flex items-center gap-1 transition-all"
                            style={{ outline: 'none' }}
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Stok Masuk</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenMovementModal(item.id, 'OUT')}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-600 hover:text-white font-extrabold text-[11px] flex items-center gap-1 transition-all"
                            style={{ outline: 'none' }}
                          >
                            <MinusCircle className="w-3.5 h-3.5" />
                            <span>Stok Keluar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem(item);
                              setIsFormOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-red-600 transition-colors"
                            style={{ outline: 'none' }}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingItem(item)}
                            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors"
                            style={{ outline: 'none' }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">
                    Belum ada bahan baku terdaftar di kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredInventory.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-slate-600">
            <div>
              Menampilkan <span className="text-slate-900 font-extrabold">{startIndex + 1}</span> - <span className="text-slate-900 font-extrabold">{Math.min(startIndex + ITEMS_PER_PAGE, filteredInventory.length)}</span> dari <span className="text-slate-900 font-extrabold">{filteredInventory.length}</span> bahan baku
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
                className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
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
                  className={`w-8 h-8 rounded-xl text-xs font-extrabold flex items-center justify-center transition-all ${
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
                className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
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
      </div>

      {/* Stock Movement Audit Log Section */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-red-600" />
          <span>Audit Log Mutasi Pergerakan Stok Terbaru</span>
        </h3>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 max-h-56 overflow-y-auto space-y-2 text-xs">
          {entityMovements.length > 0 ? (
            entityMovements.map(m => (
              <div key={m.id} className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    m.type === 'IN' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {m.type === 'IN' ? '+ MASUK' : '- KELUAR'}
                  </span>
                  <span className="font-extrabold text-slate-900">{m.itemName}</span>
                  <span className="text-slate-500 font-bold">({m.quantity} Unit)</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-700 font-bold block">{m.reason}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{formatDate(m.createdAt)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400 font-bold text-center py-4">Belum ada catatan mutasi stok.</p>
          )}
        </div>
      </div>

      {/* Movement Modal */}
      {isMovementModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4" style={{ border: '1px solid #e2e8f0' }}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Input Mutasi ({movementType === 'IN' ? 'Stok Masuk' : 'Stok Keluar'})
              </h3>
              <button
                type="button"
                onClick={() => setIsMovementModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                style={{ outline: 'none' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMovement} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Jumlah Qty Mutasi</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={movementQty}
                  onChange={(e) => setMovementQty(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 rounded-xl px-3.5 py-2 text-xs font-extrabold text-red-600"
                  style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Keterangan / Alasan Mutasi</label>
                <input
                  type="text"
                  required
                  value={movementReason}
                  onChange={(e) => setMovementReason(e.target.value)}
                  placeholder="Misal: Restok Pembelian Supplier / Pemakaian Dapur / Bahan Rusak"
                  className="w-full bg-slate-50 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-extrabold"
                  style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors"
                  style={{ outline: 'none' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-xl text-white font-extrabold text-xs transition-colors"
                  style={{ outline: 'none', border: 'none', background: '#dc2626' }}
                >
                  Simpan Mutasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Form Modal */}
      {isFormOpen && (
        <InventoryFormModal
          initialItem={editingItem}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Delete Item Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 space-y-4 text-center" style={{ border: '1px solid #e2e8f0' }}>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto shrink-0">
              <Trash2 className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">Hapus Bahan Baku?</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Apakah Anda yakin ingin menghapus <strong className="text-slate-800">"{deletingItem.name}"</strong> dari inventaris persediaan?
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="flex-1 py-3 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                style={{ outline: 'none', border: 'none' }}
              >
                Batal
              </button>
              <button
                onClick={handleDeleteItem}
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
