import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { X, Clock } from 'lucide-react';

interface ShiftModalProps {
  onClose: () => void;
}

export const ShiftModal: React.FC<ShiftModalProps> = ({ onClose }) => {
  const { activeShift, openShift, closeShift, cashierName, orders, currentEntityId } = usePOS();

  const [inputCashierName, setInputCashierName] = useState<string>(cashierName || 'Kasir Utama');
  const [startingCashInput, setStartingCashInput] = useState<string>('200000');
  const [actualEndingCashInput, setActualEndingCashInput] = useState<string>('');

  const shiftOrders = activeShift 
    ? orders.filter(o => o.entityId === currentEntityId && new Date(o.createdAt) >= new Date(activeShift.startTime) && o.status !== 'Cancelled')
    : [];

  const shiftCashSales = shiftOrders.filter(o => o.paymentMethod === 'Cash').reduce((sum, o) => sum + o.grandTotal, 0);
  const shiftQrisSales = shiftOrders.filter(o => o.paymentMethod === 'QRIS' || o.paymentMethod === 'E-Wallet').reduce((sum, o) => sum + o.grandTotal, 0);
  const expectedCashInDrawer = (activeShift?.startingCash || 0) + shiftCashSales;

  const actualCash = parseFloat(actualEndingCashInput) || 0;
  const cashDifference = actualCash - expectedCashInDrawer;

  const handleOpenShift = (e: React.FormEvent) => {
    e.preventDefault();
    openShift(inputCashierName, parseFloat(startingCashInput) || 0);
    onClose();
  };

  const handleCloseShift = (e: React.FormEvent) => {
    e.preventDefault();
    closeShift(actualCash);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col space-y-4 p-6" style={{ border: '1px solid #e2e8f0' }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              {activeShift ? 'Tutup Shift Kasir & Rekonsiliasi' : 'Buka Shift Kasir Baru'}
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

        {!activeShift ? (
          <form onSubmit={handleOpenShift} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Nama Petugas Kasir</label>
              <input
                type="text"
                required
                value={inputCashierName}
                onChange={(e) => setInputCashierName(e.target.value)}
                className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-extrabold"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Modal Kas Awal di Laci (Cash Float Rp)</label>
              <input
                type="number"
                required
                value={startingCashInput}
                onChange={(e) => setStartingCashInput(e.target.value)}
                className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs font-black text-red-600"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-white font-extrabold text-xs transition-colors"
              style={{ outline: 'none', border: 'none', background: '#dc2626' }}
            >
              Mulai Shift Kasir Sekarang
            </button>
          </form>
        ) : (
          <form onSubmit={handleCloseShift} className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-2 font-medium">
              <div className="flex justify-between text-slate-600 font-bold">
                <span>Kasir Bertugas:</span>
                <span className="font-extrabold text-slate-900">{activeShift.cashierName}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-bold">
                <span>Waktu Buka Shift:</span>
                <span>{formatDate(activeShift.startTime)}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-bold">
                <span>Modal Kas Awal:</span>
                <span>{formatRupiah(activeShift.startingCash)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-extrabold">
                <span>Penjualan Tunai Shift Ini:</span>
                <span>+{formatRupiah(shiftCashSales)}</span>
              </div>
              <div className="flex justify-between text-sky-700 font-extrabold">
                <span>Penjualan QRIS/Non-Tunai:</span>
                <span>{formatRupiah(shiftQrisSales)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-red-700 text-sm">
                <span>Ekspektasi Kas di Laci:</span>
                <span>{formatRupiah(expectedCashInDrawer)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Hitung Uang Tunai Aktual di Laci (Rp)</label>
              <input
                type="number"
                required
                value={actualEndingCashInput}
                onChange={(e) => setActualEndingCashInput(e.target.value)}
                placeholder="Hitung fisik uang kasir..."
                className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs font-black text-red-600"
                style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
              />
            </div>

            {actualEndingCashInput !== '' && (
              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between font-extrabold ${
                cashDifference === 0 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                  : cashDifference > 0 
                    ? 'bg-sky-50 border-sky-300 text-sky-900' 
                    : 'bg-rose-50 border-rose-300 text-rose-800'
              }`}>
                <span>Selisih Uang Kasir:</span>
                <span>{cashDifference === 0 ? 'SESUAI (TIDAK ADA SELISIH)' : formatRupiah(cashDifference)}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-white font-extrabold text-xs transition-colors"
              style={{ outline: 'none', border: 'none', background: '#dc2626' }}
            >
              Proses Tutup Shift & Rekonsiliasi
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
