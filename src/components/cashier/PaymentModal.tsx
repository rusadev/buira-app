import React, { useState } from 'react';
import type { PaymentMethod, Order } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { formatRupiah, generateOrderNumber } from '../../utils/formatters';
import { X, Banknote, QrCode, CreditCard, Wallet, CheckCircle2, ArrowRight } from 'lucide-react';

interface PaymentModalProps {
  onClose: () => void;
  onPaymentComplete: (completedOrder: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onPaymentComplete }) => {
  const { 
    currentEntity, 
    cart, 
    orderType, 
    selectedTableNumber, 
    customerName, 
    discountPercentage, 
    cashierName,
    createOrder 
  } = usePOS();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [cashGivenInput, setCashGivenInput] = useState<string>('');

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = Math.round(subtotalAfterDiscount * currentEntity.taxRate);
  const serviceAmount = Math.round(subtotalAfterDiscount * currentEntity.serviceRate);
  const grandTotal = subtotalAfterDiscount + taxAmount + serviceAmount;

  const cashGiven = parseFloat(cashGivenInput) || 0;
  const changeAmount = paymentMethod === 'Cash' ? Math.max(0, cashGiven - grandTotal) : 0;

  const isPaymentValid = paymentMethod === 'Cash' ? cashGiven >= grandTotal : true;

  const handleQuickCash = (amount: number) => {
    setCashGivenInput(amount.toString());
  };

  const handleProcessPayment = () => {
    if (!isPaymentValid) return;

    const orderNumber = generateOrderNumber(currentEntity.id === 'coffee_shop' ? 'CS' : 'AG');
    
    const newOrder = createOrder({
      orderNumber,
      entityId: currentEntity.id,
      customerName: customerName || 'Pelanggan Umum',
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
      paymentAmount: paymentMethod === 'Cash' ? cashGiven : grandTotal,
      changeAmount,
      status: 'Pending',
      cashierName: cashierName || 'Kasir Utama'
    });

    onPaymentComplete(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Proses Pembayaran Kasir</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                {orderType} {selectedTableNumber ? `(${selectedTableNumber})` : ''}
              </span>
            </h3>
            <p className="text-xs text-slate-500">Total Tagihan: <strong className="text-amber-700">{formatRupiah(grandTotal)}</strong></p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-5 overflow-y-auto flex-1">
          {/* Summary Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5 font-medium">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({cart.reduce((sum, i) => sum + i.quantity, 0)} item)</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Diskon ({discountPercentage}%)</span>
                <span>-{formatRupiah(discountAmount)}</span>
              </div>
            )}
            {taxAmount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Pajak Resto (PB1 {currentEntity.taxRate * 100}%)</span>
                <span>{formatRupiah(taxAmount)}</span>
              </div>
            )}
            {serviceAmount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Layanan Service ({currentEntity.serviceRate * 100}%)</span>
                <span>{formatRupiah(serviceAmount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-amber-800">
              <span>GRAND TOTAL</span>
              <span>{formatRupiah(grandTotal)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">Pilih Metode Pembayaran</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'Cash', label: 'Tunai (Cash)', icon: <Banknote className="w-4 h-4" /> },
                { id: 'QRIS', label: 'QRIS Statis/Dinamis', icon: <QrCode className="w-4 h-4" /> },
                { id: 'Debit', label: 'Kartu Debit/EDC', icon: <CreditCard className="w-4 h-4" /> },
                { id: 'E-Wallet', label: 'E-Wallet (Gopay/OVO)', icon: <Wallet className="w-4 h-4" /> },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === method.id
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {method.icon}
                  <span className="text-[11px]">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CASH PAYMENT UI */}
          {paymentMethod === 'Cash' && (
            <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="text-xs font-bold text-slate-800">Nominal Uang Tunai Diterima (Rp)</label>
              <div className="relative">
                <input 
                  type="number"
                  value={cashGivenInput}
                  onChange={(e) => setCashGivenInput(e.target.value)}
                  placeholder="Masukkan jumlah uang..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-extrabold text-amber-700 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Quick Money Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button 
                  onClick={() => handleQuickCash(grandTotal)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 border border-emerald-300"
                >
                  Uang Pas ({formatRupiah(grandTotal)})
                </button>
                {[20000, 50000, 100000, 200000].map(val => (
                  <button
                    key={val}
                    onClick={() => handleQuickCash(val)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200"
                  >
                    {formatRupiah(val)}
                  </button>
                ))}
              </div>

              {/* Change display */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Kembalian Kasir:</span>
                <span className={`text-base font-extrabold ${cashGiven >= grandTotal ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {cashGiven >= grandTotal ? formatRupiah(changeAmount) : `Kurang ${formatRupiah(grandTotal - cashGiven)}`}
                </span>
              </div>
            </div>
          )}

          {/* QRIS PAYMENT UI */}
          {paymentMethod === 'QRIS' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
              <p className="text-xs font-bold text-slate-800">Scan QRIS Nasional (ShopeePay/Gopay/OVO/Dana/BCA/Mandiri)</p>
              <div className="w-44 h-44 mx-auto bg-white p-2.5 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                  <path fill="currentColor" d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z M40,0 h20 v10 h-20 z M40,20 h10 v20 h-10 z M60,40 h20 v20 h-20 z M80,60 h20 v30 h-20 z M30,70 h20 v10 h-20 z M40,90 h30 v10 h-30 z" />
                </svg>
              </div>
              <p className="text-[11px] text-amber-700 font-bold animate-pulse">Menunggu verifikasi pembayaran otomatis...</p>
            </div>
          )}

          {/* DEBIT / CREDIT / E-WALLET */}
          {(paymentMethod === 'Debit' || paymentMethod === 'Credit' || paymentMethod === 'E-Wallet') && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-amber-600 mx-auto" />
              <p className="text-xs font-bold text-slate-900">Gunakan Mesin EDC / Aplikasi Merchant E-Wallet</p>
              <p className="text-xs text-slate-500">Pastikan transaksi sejumlah <strong>{formatRupiah(grandTotal)}</strong> sukses di terminal EDC sebelum menyelesaikan pesanan.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white"
          >
            Batal
          </button>
          <button
            disabled={!isPaymentValid}
            onClick={handleProcessPayment}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              isPaymentValid
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Selesaikan Pembayaran & Cetak Struk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
