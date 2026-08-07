import React, { useState } from 'react';
import type { Order } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/formatters';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';

interface VoidOrderModalProps {
  order: Order;
  onClose: () => void;
}

export const VoidOrderModal: React.FC<VoidOrderModalProps> = ({ order, onClose }) => {
  const { voidOrder, cashierName } = usePOS();

  const [selectedReason, setSelectedReason] = useState<string>('Salah Input Kasir');
  const [customNote, setCustomNote] = useState<string>('');

  const voidReasons = [
    'Salah Input Kasir',
    'Pelanggan Batal Pesan',
    'Bahan Baku Dapur Habis',
    'Komplain Kualitas / Retur',
    'Sistem Rusak / Double Order',
    'Lainnya'
  ];

  const handleConfirmVoid = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = selectedReason === 'Lainnya' 
      ? (customNote.trim() || 'Lainnya')
      : (customNote.trim() ? `${selectedReason} - ${customNote.trim()}` : selectedReason);

    voidOrder(order.id, finalReason, cashierName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col" style={{ border: '1px solid #e2e8f0' }}>

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50">
          <div className="flex items-center gap-2 text-rose-700">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-base font-extrabold">Pembatalan (Void) Transaksi</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            style={{ outline: 'none', border: '1px solid #fecaca' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirmVoid} className="p-5 space-y-4">
          
          {/* Order Summary Box */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-slate-900">{order.orderNumber}</span>
              <span className="font-black text-red-600">{formatRupiah(order.grandTotal)}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Pelanggan: <strong className="text-slate-800">{order.customerName}</strong> · {order.items.length} Item
            </p>
          </div>

          <div className="bg-rose-50/70 border border-rose-200 p-3 rounded-xl flex items-start gap-2 text-xs text-rose-800 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <p>Tindakan ini akan membatalkan struk transaksi dan mengembalikan status meja serta mengurangi omset penjualan.</p>
          </div>

          {/* Void Reason Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 block">Pilih Alasan Pembatalan (Void Reason) *</label>
            <div className="space-y-1.5">
              {voidReasons.map(reason => {
                const isSelected = selectedReason === reason;
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    className="w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between"
                    style={{
                      outline: 'none',
                      border: '1.5px solid',
                      borderColor: isSelected ? '#dc2626' : '#e2e8f0',
                      background: isSelected ? '#fef2f2' : '#ffffff',
                      color: isSelected ? '#991b1b' : '#475569',
                    }}
                  >
                    <span>{reason}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-red-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Note */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 block">Catatan Tambahan (Opsional)</label>
            <input
              type="text"
              value={customNote}
              onChange={e => setCustomNote(e.target.value)}
              placeholder="Misal: Otorisasi Supervisor Pak Budi..."
              className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
              style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              style={{ outline: 'none', border: 'none' }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl text-xs font-extrabold bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center justify-center gap-1.5"
              style={{ outline: 'none', border: 'none' }}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Konfirmasi Void</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
