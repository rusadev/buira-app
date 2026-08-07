import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import type { PaymentMethod, Order } from '../../types/pos';
import { formatRupiah } from '../../utils/formatters';
import { ReceiptModal } from './ReceiptModal';
import { X, Banknote, QrCode, CreditCard, Wallet, CheckCircle2 } from 'lucide-react';

interface PaymentModalProps {
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose }) => {
  const { 
    cart, 
    orderType, 
    selectedTableNumber, 
    customerName, 
    discountPercentage, 
    currentEntity,
    cashierName,
    createOrder
  } = usePOS();

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = Math.round(subtotalAfterDiscount * currentEntity.taxRate);
  const serviceAmount = Math.round(subtotalAfterDiscount * currentEntity.serviceRate);
  const grandTotal = subtotalAfterDiscount + taxAmount + serviceAmount;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [cashAmountInput, setCashAmountInput] = useState<string>(grandTotal.toString());
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const cashPaid = parseFloat(cashAmountInput) || 0;
  const changeAmount = Math.max(0, cashPaid - grandTotal);
  const isCashSufficient = paymentMethod !== 'Cash' || cashPaid >= grandTotal;

  const handleQuickCash = (amount: number) => {
    setCashAmountInput(amount.toString());
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCashSufficient) return;

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    
    const newOrder = createOrder({
      orderNumber,
      entityId: currentEntity.id,
      customerName: customerName.trim() || 'Pelanggan Umum',
      orderType,
      tableNumber: orderType === 'Dine-In' ? selectedTableNumber : undefined,
      items: cart,
      subtotal,
      discountAmount,
      discountPercentage,
      taxAmount,
      serviceAmount,
      grandTotal,
      paymentMethod,
      paymentAmount: paymentMethod === 'Cash' ? cashPaid : grandTotal,
      changeAmount: paymentMethod === 'Cash' ? changeAmount : 0,
      status: 'Preparing',
      cashierName
    });

    setCompletedOrder(newOrder);
  };

  if (completedOrder) {
    return (
      <ReceiptModal
        order={completedOrder}
        onClose={() => {
          setCompletedOrder(null);
          onClose();
        }}
      />
    );
  }

  const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { id: 'Cash', label: 'Uang Tunai', icon: <Banknote className="w-5 h-5 text-red-600" /> },
    { id: 'QRIS', label: 'QRIS / Statis', icon: <QrCode className="w-5 h-5 text-sky-600" /> },
    { id: 'Debit', label: 'Kartu Debit', icon: <CreditCard className="w-5 h-5 text-emerald-600" /> },
    { id: 'Credit', label: 'Kartu Kredit', icon: <CreditCard className="w-5 h-5 text-purple-600" /> },
    { id: 'E-Wallet', label: 'E-Wallet', icon: <Wallet className="w-5 h-5 text-amber-600" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Pembayaran Kasir POS</h3>
            <p className="text-xs text-slate-500">Outlet: <strong className="text-red-700">{currentEntity.name}</strong></p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleProcessPayment} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Total Payment Box */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-center space-y-1">
            <span className="text-xs font-bold text-red-900 uppercase tracking-wider block">TOTAL PEMBAYARAN</span>
            <div className="text-2xl sm:text-3xl font-black text-red-700">
              {formatRupiah(grandTotal)}
            </div>
            <p className="text-xs text-slate-500 font-medium">{cart.length} Jenis Menu • {orderType} {selectedTableNumber ? `(${selectedTableNumber})` : ''}</p>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">Pilih Metode Pembayaran</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {paymentMethods.map(m => {
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className={isSelected ? 'text-white' : ''}>{m.icon}</div>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cash Payment Options */}
          {paymentMethod === 'Cash' && (
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 block">Uang Diterima (Rp) *</label>
                <input
                  type="number"
                  required
                  value={cashAmountInput}
                  onChange={(e) => setCashAmountInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-900 font-bold focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Uang Pas', amount: grandTotal },
                  { label: 'Rp 20.000', amount: 20000 },
                  { label: 'Rp 50.000', amount: 50000 },
                  { label: 'Rp 100.000', amount: 100000 },
                ].map(q => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => handleQuickCash(q.amount)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors"
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Kembalian Calculator */}
              <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">UANG KEMBALIAN</span>
                <span className={`text-base font-black ${cashPaid >= grandTotal ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatRupiah(changeAmount)}
                </span>
              </div>
            </div>
          )}

          {/* Submit Checkout Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isCashSufficient}
              className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                isCashSufficient
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Proses & Cetak Struk Transaksi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
