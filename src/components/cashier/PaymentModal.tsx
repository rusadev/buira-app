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
      customerName: customerName.trim() || 'Pelanggan',
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
    { id: 'Cash', label: 'Cash (Tunai)', icon: <Banknote className="w-4 h-4" /> },
    { id: 'QRIS', label: 'QRIS', icon: <QrCode className="w-4 h-4" /> },
    { id: 'Transfer', label: 'Transfer Bank', icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-none w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Pembayaran</h3>
            <p className="text-xs text-slate-500 font-medium">{currentEntity.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-none bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors border border-slate-200"
            style={{ outline: 'none' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleProcessPayment} className="p-5 overflow-y-auto space-y-4 flex-1">

          {/* Grand Total */}
          <div className="bg-red-600 rounded-none p-5 text-center space-y-1">
            <p className="text-xs font-bold text-red-200 uppercase tracking-widest">Total Pembayaran</p>
            <div className="text-3xl font-black text-white">{formatRupiah(grandTotal)}</div>
            <p className="text-xs text-red-200 font-medium">
              {cart.length} Menu · {orderType}
            </p>
          </div>

          {/* Quick Review: No. Meja & Pelanggan */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-none">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">No. Meja / Lokasi</label>
              <input
                type="text"
                value={selectedTableNumber}
                onChange={e => setSelectedTableNumber(e.target.value)}
                placeholder="No. Meja (misal: Meja 5 / Lesehan)..."
                className="w-full bg-white rounded-none px-2.5 py-1.5 text-xs text-slate-900 font-extrabold border border-slate-200"
                style={{ outline: 'none' }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nama Pelanggan</label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Nama Pelanggan..."
                className="w-full bg-white rounded-none px-2.5 py-1.5 text-xs text-slate-900 font-extrabold border border-slate-200"
                style={{ outline: 'none' }}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <p className="text-xs font-extrabold text-slate-700">Metode Pembayaran</p>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map(m => {
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-none text-xs font-extrabold transition-all"
                    style={{
                      outline: 'none',
                      border: '1.5px solid',
                      borderColor: isSelected ? '#dc2626' : '#e2e8f0',
                      background: isSelected ? '#dc2626' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#475569',
                    }}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cash Options */}
          {paymentMethod === 'Cash' && (
            <div className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Uang Diterima (Rp)</label>
                <input
                  type="number"
                  required
                  value={cashAmountInput}
                  onChange={e => setCashAmountInput(e.target.value)}
                  className="w-full bg-slate-50 rounded-none px-4 py-3 text-lg text-slate-900 font-extrabold"
                  style={{ 
                    outline: 'none', 
                    border: `1.5px solid ${!isCashSufficient ? '#ef4444' : '#e2e8f0'}` 
                  }}
                />
              </div>

              {/* Clean warning box */}
              {!isCashSufficient && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-none flex items-center justify-between text-xs text-red-700 font-extrabold">
                  <span>Uang kurang {formatRupiah(grandTotal - cashPaid)}</span>
                  <button
                    type="button"
                    onClick={() => setCashAmountInput(grandTotal.toString())}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-none text-[11px] font-black shrink-0"
                    style={{ outline: 'none', border: 'none' }}
                  >
                    Uang Pas
                  </button>
                </div>
              )}

              {/* Quick amounts */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Uang Pas', amount: grandTotal },
                  { label: '20.000', amount: 20000 },
                  { label: '50.000', amount: 50000 },
                  { label: '100.000', amount: 100000 },
                  { label: '200.000', amount: 200000 },
                ].map(q => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => handleQuickCash(q.amount)}
                    className="px-3 py-2 rounded-none text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                    style={{ outline: 'none', border: '1.5px solid #e2e8f0', background: '#ffffff' }}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
              
              {/* Change / Status */}
              <div className="flex justify-between items-center px-4 py-3 rounded-none" style={{ background: cashPaid >= grandTotal ? '#f0fdf4' : '#fef2f2', border: `1.5px solid ${cashPaid >= grandTotal ? '#bbf7d0' : '#fecaca'}` }}>
                <span className="text-xs font-extrabold text-slate-700">
                  {cashPaid >= grandTotal ? 'UANG KEMBALIAN' : 'KURANG BAYAR'}
                </span>
                <span className={`text-xl font-black ${cashPaid >= grandTotal ? 'text-emerald-600' : 'text-red-600'}`}>
                  {cashPaid >= grandTotal ? formatRupiah(changeAmount) : `−${formatRupiah(grandTotal - cashPaid)}`}
                </span>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isCashSufficient}
            className="w-full py-4 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all"
            style={{
              outline: 'none',
              border: 'none',
              background: isCashSufficient ? '#dc2626' : '#e2e8f0',
              color: isCashSufficient ? '#ffffff' : '#94a3b8',
              cursor: isCashSufficient ? 'pointer' : 'not-allowed',
            }}
          >
            <CheckCircle2 className="w-5 h-5" />
            Proses & Cetak Struk
          </button>
        </form>
      </div>
    </div>
  );
};
