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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">
              {activeShift ? 'Tutup Shift Kasir & Rekonsiliasi' : 'Buka Shift Kasir Baru'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-3.5 h-3.5" />
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
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Modal Kas Awal di Laci (Cash Float Rp)</label>
              <input
                type="number"
                required
                value={startingCashInput}
                onChange={(e) => setStartingCashInput(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-amber-700 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
            >
              Mulai Shift Kasir Sekarang
            </button>
          </form>
        ) : (
          <form onSubmit={handleCloseShift} className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2 font-medium">
              <div className="flex justify-between text-slate-600">
                <span>Kasir Bertugas:</span>
                <span className="font-bold text-slate-900">{activeShift.cashierName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Waktu Buka Shift:</span>
                <span>{formatDate(activeShift.startTime)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Modal Kas Awal:</span>
                <span>{formatRupiah(activeShift.startingCash)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Penjualan Tunai Shift Ini:</span>
                <span>+{formatRupiah(shiftCashSales)}</span>
              </div>
              <div className="flex justify-between text-sky-700 font-bold">
                <span>Penjualan QRIS/Non-Tunai:</span>
                <span>{formatRupiah(shiftQrisSales)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-amber-800 text-sm">
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
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-amber-700 focus:outline-none focus:border-amber-500"
              />
            </div>

            {actualEndingCashInput !== '' && (
              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between font-bold ${
                cashDifference === 0 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                  : cashDifference > 0 
                    ? 'bg-amber-50 border-amber-300 text-amber-900' 
                    : 'bg-rose-50 border-rose-300 text-rose-800'
              }`}>
                <span>Selisih Uang Kasir:</span>
                <span>{cashDifference === 0 ? 'SESUAI (TIDAK ADA SELISIH)' : formatRupiah(cashDifference)}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
            >
              Proses Tutup Shift & Rekonsiliasi
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
