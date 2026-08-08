import React, { useState } from 'react';
import type { CartItem } from '../../types/pos';
import { formatRupiah } from '../../utils/formatters';
import { X, Users, Scissors, CheckCircle2, CreditCard } from 'lucide-react';

interface SplitBillModalProps {
  cart: CartItem[];
  grandTotal: number;
  onClose: () => void;
  onPaySubBill: (subTotalAmount: number, label: string) => void;
}

export const SplitBillModal: React.FC<SplitBillModalProps> = ({
  cart,
  grandTotal,
  onClose,
  onPaySubBill
}) => {
  const [splitMode, setSplitMode] = useState<'equal' | 'itemized'>('equal');
  const [personCount, setPersonCount] = useState<number>(2);

  // Equal split calculation
  const amountPerPerson = Math.ceil(grandTotal / personCount);

  // Itemized split state (selected cart item IDs for Sub-Bill 1)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const toggleItemSelection = (id: string) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter(i => i !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  const selectedItemsSubtotal = cart
    .filter(item => selectedItemIds.includes(item.id))
    .reduce((sum, item) => sum + item.totalPrice, 0);

  const remainingItemsSubtotal = grandTotal - selectedItemsSubtotal;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 shadow-xl">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-extrabold text-slate-900">Split Bill (Pisah Tagihan)</h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            style={{ outline: 'none', border: 'none' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSplitMode('equal')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              splitMode === 'equal'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
            style={{ outline: 'none' }}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Bagi Rata (Equal)</span>
          </button>

          <button
            type="button"
            onClick={() => setSplitMode('itemized')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              splitMode === 'itemized'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
            style={{ outline: 'none' }}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Pisah per Menu</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto min-h-0 space-y-4">
          
          {/* EQUAL SPLIT MODE */}
          {splitMode === 'equal' && (
            <div className="space-y-4">
              <div className="p-4 border border-slate-200 rounded-2xl bg-white space-y-2 text-center">
                <span className="text-xs font-bold text-slate-500 block">Total Tagihan Meja</span>
                <span className="text-2xl font-black text-slate-900">{formatRupiah(grandTotal)}</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 block">Pilih Jumlah Orang (Patungan):</label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 3, 4, 5].map(count => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setPersonCount(count)}
                      className={`py-3 rounded-xl text-xs font-black transition-all border ${
                        personCount === count
                          ? 'border-red-600 text-red-600 bg-red-50'
                          : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                      }`}
                      style={{ outline: 'none' }}
                    >
                      {count} Orang
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 border border-emerald-200 rounded-2xl bg-emerald-50/50 space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-emerald-800">
                  <span>Tagihan per Orang ({personCount} Orang):</span>
                  <span className="text-base font-black text-emerald-600">{formatRupiah(amountPerPerson)}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Pembayaran dapat diproses 1 per 1 untuk setiap anggota.</p>
              </div>

              <button
                type="button"
                onClick={() => onPaySubBill(amountPerPerson, `Split 1 dari ${personCount} Orang`)}
                className="w-full py-3.5 rounded-2xl text-white font-black text-xs flex items-center justify-center gap-2"
                style={{ outline: 'none', border: 'none', background: '#dc2626' }}
              >
                <CreditCard className="w-4 h-4" />
                <span>Bayar Bagian Orang 1 ({formatRupiah(amountPerPerson)})</span>
              </button>
            </div>
          )}

          {/* ITEMIZED SPLIT MODE */}
          {splitMode === 'itemized' && (
            <div className="space-y-4">
              <span className="text-xs font-extrabold text-slate-800 block">Pilih Menu untuk Sub-Tagihan 1:</span>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {cart.map(item => {
                  const isSelected = selectedItemIds.includes(item.id);

                  return (
                    <div 
                      key={item.id}
                      onClick={() => toggleItemSelection(item.id)}
                      className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected ? 'bg-red-50/40' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isSelected ? 'bg-red-600 border-red-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <span className="text-xs font-extrabold text-slate-900 block">{item.quantity}x {item.product.name}</span>
                          <span className="text-[10px] text-slate-500 font-bold">{formatRupiah(item.unitPrice)} / item</span>
                        </div>
                      </div>

                      <span className="text-xs font-black text-slate-900">{formatRupiah(item.totalPrice)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 border border-slate-200 rounded-2xl bg-white space-y-1.5 text-xs font-bold">
                <div className="flex justify-between">
                  <span className="text-slate-600">Sub-Tagihan 1 (Dipilih):</span>
                  <span className="font-black text-red-600">{formatRupiah(selectedItemsSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Sisa Tagihan 2:</span>
                  <span className="font-black text-slate-900">{formatRupiah(remainingItemsSubtotal)}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={selectedItemIds.length === 0}
                onClick={() => onPaySubBill(selectedItemsSubtotal, 'Split Sub-Tagihan 1')}
                className="w-full py-3.5 rounded-2xl text-white font-black text-xs flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ outline: 'none', border: 'none', background: '#dc2626' }}
              >
                <CreditCard className="w-4 h-4" />
                <span>Bayar Sub-Tagihan 1 ({formatRupiah(selectedItemsSubtotal)})</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
