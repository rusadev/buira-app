import React, { useState } from 'react';
import type { InventoryItem } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { X, Boxes } from 'lucide-react';

interface InventoryFormModalProps {
  initialItem?: InventoryItem | null;
  onClose: () => void;
}

const DEFAULT_CATEGORIES = ['Biji Kopi & Teh', 'Susu & Dairy', 'Daging & Protein', 'Bumbu & Saus', 'Packaging & Cup'];
const UNITS = ['Kg', 'Gram', 'Liter', 'Ml', 'Pcs', 'Pack', 'Botol', 'Karton'];

export const InventoryFormModal: React.FC<InventoryFormModalProps> = ({ initialItem, onClose }) => {
  const { currentEntityId, addInventoryItem, updateInventoryItem } = usePOS();

  const [name, setName] = useState<string>(initialItem?.name || '');
  const [category, setCategory] = useState<string>(initialItem?.category || 'Biji Kopi & Teh');
  const [stock, setStock] = useState<number>(initialItem?.stock || 10);
  const [unit, setUnit] = useState<string>(initialItem?.unit || 'Kg');
  const [minStock, setMinStock] = useState<number>(initialItem?.minStock || 2);
  const [costPerUnit, setCostPerUnit] = useState<number>(initialItem?.costPerUnit || 50000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (initialItem) {
      updateInventoryItem({
        ...initialItem,
        name: name.trim(),
        category,
        stock,
        unit,
        minStock,
        costPerUnit
      });
    } else {
      addInventoryItem({
        entityId: currentEntityId,
        name: name.trim(),
        category,
        stock,
        unit,
        minStock,
        costPerUnit,
        lastRestocked: new Date().toISOString().split('T')[0]
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
            <Boxes className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              {initialItem ? 'Edit Bahan Baku' : 'Tambah Bahan Baku Baru'}
            </h3>
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
            <label className="text-xs font-bold text-slate-800">Nama Bahan Baku *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: Biji Kopi House Blend / Fresh Milk 1L"
              className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-extrabold"
              style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-900 font-extrabold"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              >
                {DEFAULT_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Satuan Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-900 font-extrabold"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              >
                {UNITS.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Stok Awal</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-extrabold"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Min Stok Alert</label>
              <input
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-extrabold"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Harga Beli per Unit (Rp HPP)</label>
            <input
              type="number"
              min="0"
              value={costPerUnit}
              onChange={(e) => setCostPerUnit(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-extrabold"
              style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all"
              style={{ outline: 'none', border: 'none' }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl text-white font-extrabold text-xs transition-all"
              style={{ outline: 'none', border: 'none', background: '#dc2626' }}
            >
              Simpan Bahan Baku
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
