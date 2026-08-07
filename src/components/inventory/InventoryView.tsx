import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { Boxes, AlertCircle, PlusCircle, MinusCircle, History } from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { inventory, stockMovements, currentEntityId, currentEntity, addStockMovement } = usePOS();

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN');
  const [movementQty, setMovementQty] = useState<number>(1);
  const [movementReason, setMovementReason] = useState<string>('Restok Pembelian Supplier');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const entityInventory = inventory.filter(i => i.entityId === currentEntityId);
  const entityMovements = stockMovements.filter(m => m.entityId === currentEntityId);

  const handleOpenMovementModal = (itemId: string, type: 'IN' | 'OUT') => {
    setSelectedItemId(itemId);
    setMovementType(type);
    setMovementReason(type === 'IN' ? 'Restok Pembelian Supplier' : 'Pemakaian Dapur / Rusak');
    setIsModalOpen(true);
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
      createdBy: 'Admin Inventaris'
    });

    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-5 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-amber-600" />
            <span>Stok Bahan Baku & Persediaan ({currentEntity.name})</span>
          </h2>
          <p className="text-xs text-slate-500">Monitoring stok bahan mentah (biji kopi, susu, ayam, cabai, minyak, packaging).</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Nama Bahan Baku</th>
              <th className="p-3.5">Kategori</th>
              <th className="p-3.5">Jumlah Stok Saat Ini</th>
              <th className="p-3.5">Estimasi Biaya per Unit</th>
              <th className="p-3.5">Restok Terakhir</th>
              <th className="p-3.5 text-right">Aksi Stok</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {entityInventory.length > 0 ? (
              entityInventory.map(item => {
                const isLowStock = item.stock <= item.minStock;

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      {item.name}
                    </td>
                    <td className="p-3.5 text-slate-500 font-medium">{item.category}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-extrabold ${isLowStock ? 'text-rose-600' : 'text-slate-900'}`}>
                          {item.stock} {item.unit}
                        </span>
                        {isLowStock && (
                          <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" />
                            Hampir Habis
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-600">{formatRupiah(item.costPerUnit)} / {item.unit}</td>
                    <td className="p-3.5 text-slate-500 font-medium">{item.lastRestocked}</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenMovementModal(item.id, 'IN')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-600 hover:text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Stok Masuk</span>
                        </button>
                        <button
                          onClick={() => handleOpenMovementModal(item.id, 'OUT')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-600 hover:text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                        >
                          <MinusCircle className="w-3.5 h-3.5" />
                          <span>Stok Keluar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                  Belum ada bahan baku terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Movement Logs */}
      <div className="space-y-3 pt-3">
        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-amber-600" />
          <span>Riwayat Pergerakan Stok Terbaru</span>
        </h3>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 max-h-48 overflow-y-auto space-y-2 text-xs">
          {entityMovements.length > 0 ? (
            entityMovements.map(m => (
              <div key={m.id} className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    m.type === 'IN' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {m.type === 'IN' ? '+ MASUK' : '- KELUAR'}
                  </span>
                  <span className="font-bold text-slate-900">{m.itemName}</span>
                  <span className="text-slate-500">({m.quantity} Pcs/Kg)</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-600 font-medium block">{m.reason}</span>
                  <span className="text-[10px] text-slate-400">{formatDate(m.createdAt)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400 italic text-center py-4">Belum ada catatan mutasi stok.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Input Mutasi Stok ({movementType === 'IN' ? 'Stok Masuk' : 'Stok Keluar'})
            </h3>
            <form onSubmit={handleSaveMovement} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Jumlah Qty</label>
                <input
                  type="number"
                  required
                  value={movementQty}
                  onChange={(e) => setMovementQty(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-amber-700 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Keterangan / Alasan</label>
                <input
                  type="text"
                  required
                  value={movementReason}
                  onChange={(e) => setMovementReason(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                >
                  Simpan Mutasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
