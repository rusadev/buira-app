import React, { useState } from 'react';
import type { Table } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { X, LayoutGrid, Users, MapPin } from 'lucide-react';

interface TableFormModalProps {
  initialTable?: Table | null;
  onClose: () => void;
}

const DEFAULT_AREAS = ['Indoor Utama', 'VIP Room', 'Outdoor Terrace', 'Lantai 2'];

export const TableFormModal: React.FC<TableFormModalProps> = ({ initialTable, onClose }) => {
  const { currentEntityId, addTable, updateTable } = usePOS();

  const [tableNumber, setTableNumber] = useState<string>(initialTable?.tableNumber || '');
  const [capacity, setCapacity] = useState<number>(initialTable?.capacity || 4);
  const [area, setArea] = useState<string>(initialTable?.area || 'Indoor Utama');
  const [status, setStatus] = useState<Table['status']>(initialTable?.status || 'Available');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber.trim()) return;

    if (initialTable) {
      updateTable({
        ...initialTable,
        tableNumber: tableNumber.trim(),
        capacity,
        area,
        status
      });
    } else {
      addTable({
        entityId: currentEntityId,
        tableNumber: tableNumber.trim(),
        capacity,
        area,
        status
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
            <LayoutGrid className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              {initialTable ? 'Edit Data Meja' : 'Tambah Meja Baru'}
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Nomor / Label Meja *</label>
            <input
              type="text"
              required
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Misal: Meja 01 / VIP-A / Outdoor 05"
              className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-extrabold"
              style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Kapasitas Kursi</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-extrabold"
                  style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Status Meja</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Table['status'])}
                className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-900 font-extrabold"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              >
                <option value="Available">Kosong (Available)</option>
                <option value="Occupied">Terisi (Occupied)</option>
                <option value="Reserved">Reservasi (Reserved)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Area / Zona Meja</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-900 font-extrabold"
              style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
            >
              {DEFAULT_AREAS.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Quick Area Tags */}
          <div className="flex flex-wrap gap-1 pt-1">
            {DEFAULT_AREAS.map(a => (
              <button
                key={a}
                type="button"
                onClick={() => setArea(a)}
                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border transition-colors ${
                  area === a ? 'bg-red-600 text-white border-red-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
                style={{ outline: 'none' }}
              >
                {a}
              </button>
            ))}
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
              Simpan Data Meja
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
