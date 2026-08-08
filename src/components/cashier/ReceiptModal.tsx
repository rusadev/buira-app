import React, { useState } from 'react';
import type { Order } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { VoidOrderModal } from './VoidOrderModal';
import { Printer, CheckCircle, X, ShieldAlert } from 'lucide-react';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  const { currentEntity, orders } = usePOS();
  const [isVoidModalOpen, setIsVoidModalOpen] = useState<boolean>(false);

  // Get freshest order state from context to reflect void status
  const currentOrderState = orders.find(o => o.id === order.id) || order;
  const isCancelled = currentOrderState.status === 'Cancelled';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-white rounded-none w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isCancelled ? (
              <span className="text-xs font-black text-white bg-rose-600 px-2 py-0.5 rounded-none flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                TRANSAKSI VOID / BATAL
              </span>
            ) : (
              <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Pembayaran Berhasil!
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-none bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors border border-slate-200"
            style={{ outline: 'none' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thermal Receipt Body */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-100">
          <div 
            id="thermal-receipt" 
            className="bg-white text-slate-900 font-mono text-[11px] p-4 rounded-none mx-auto w-full max-w-[80mm] space-y-3 leading-tight border border-slate-200 shadow-sm relative overflow-hidden"
          >
            {isCancelled && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
                <div className="border-4 border-dashed border-red-600 rounded-none px-6 py-2 text-4xl font-black text-red-600 rotate-[-12deg] tracking-widest uppercase">
                  VOID
                </div>
              </div>
            )}

            {/* Header Store Info */}
            <div className="text-center space-y-1 pb-2 border-b border-dashed border-slate-400">
              {currentEntity.logo && (
                <div className="flex justify-center pb-1">
                  <img src={currentEntity.logo} alt={currentEntity.name} className="h-10 object-contain rounded-none" />
                </div>
              )}
              <div className="text-lg font-black uppercase tracking-wider">{currentEntity.name}</div>
              <div className="text-[10px] text-slate-600">{currentEntity.address}</div>
              <div className="text-[10px] text-slate-600">Telp: {currentEntity.phone}</div>
            </div>

            {/* VOID Banner Box */}
            {isCancelled && (
              <div className="my-2 p-2 border-2 border-dashed border-red-600 rounded-none bg-red-50 text-center space-y-0.5">
                <div className="text-xs font-black text-red-600 tracking-wider uppercase">
                  ✦ TRANSAKSI DIBATALKAN (VOID) ✦
                </div>
                {currentOrderState.voidReason && (
                  <p className="text-[10px] font-bold text-red-700">
                    Alasan: "{currentOrderState.voidReason}"
                  </p>
                )}
              </div>
            )}

            {/* Order Info */}
            <div className="space-y-0.5 text-[10px] pb-2 border-b border-dashed border-slate-400">
              <div className="flex justify-between">
                <span>No. Struk:</span>
                <span className="font-bold">{currentOrderState.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Tgl/Waktu:</span>
                <span>{formatDate(currentOrderState.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>{currentOrderState.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span>{currentOrderState.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Tipe Order:</span>
                <span className="font-bold">{currentOrderState.orderType} {currentOrderState.tableNumber ? `(${currentOrderState.tableNumber})` : ''}</span>
              </div>

              {isCancelled && currentOrderState.voidReason && (
                <div className="pt-1 text-[10px] text-red-600 font-bold">
                  ALASAN VOID: {currentOrderState.voidReason}
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="space-y-2 py-1 border-b border-dashed border-slate-400">
              {currentOrderState.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span>{formatRupiah(item.totalPrice)}</span>
                  </div>
                  {item.selectedVariants && item.selectedVariants.length > 0 && (
                    <div className="text-[9px] text-slate-600 pl-3">
                      {item.selectedVariants.map(v => `${v.groupName}: ${v.optionName}`).join(', ')}
                    </div>
                  )}
                  {item.notes && (
                    <div className="text-[9px] text-slate-500 pl-3 italic">
                      Note: {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="space-y-1 text-[10px] pt-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatRupiah(currentOrderState.subtotal)}</span>
              </div>
              {currentOrderState.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>Pajak Resto:</span>
                  <span>{formatRupiah(currentOrderState.taxAmount)}</span>
                </div>
              )}
              {currentOrderState.serviceAmount > 0 && (
                <div className="flex justify-between">
                  <span>Layanan Service:</span>
                  <span>{formatRupiah(currentOrderState.serviceAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-400">
                <span>TOTAL:</span>
                <span>{formatRupiah(currentOrderState.grandTotal)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Metode Bayar:</span>
                <span className="font-semibold">{currentOrderState.paymentMethod}</span>
              </div>
              {currentOrderState.paymentMethod === 'Cash' && (
                <>
                  <div className="flex justify-between">
                    <span>Diterima:</span>
                    <span>{formatRupiah(currentOrderState.paymentAmount)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Kembali:</span>
                    <span>{formatRupiah(currentOrderState.changeAmount)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer Struk */}
            <div className="text-center pt-3 border-t border-dashed border-slate-400 space-y-1 text-[9px] text-slate-600">
              <p className="font-bold">*** {currentEntity.receiptFooterNote || 'TERIMA KASIH ATAS KUNJUNGAN ANDA'} ***</p>
              <p>Powered by Buira POS F&B Enterprise</p>
            </div>
          </div>
        </div>

        {/* Footer Buttons (Sleek Compact 1-Line Button Bar) */}
        <div className="p-3 border-t border-slate-200 bg-white grid grid-cols-3 gap-2 shrink-0">
          {!isCancelled ? (
            <button
              onClick={() => setIsVoidModalOpen(true)}
              className="w-full py-2.5 px-2 rounded-none text-[11px] sm:text-xs font-bold uppercase tracking-wide text-rose-600 hover:bg-rose-50 border border-rose-300 transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
              style={{ outline: 'none' }}
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Void Struk</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 px-2 rounded-none text-slate-700 font-bold text-[11px] sm:text-xs uppercase tracking-wide border border-slate-300 hover:bg-slate-100 transition-all flex items-center justify-center whitespace-nowrap"
            style={{ outline: 'none' }}
          >
            Tutup
          </button>

          <button
            onClick={handlePrint}
            className="w-full py-2.5 px-2 rounded-none text-white font-bold text-[11px] sm:text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap"
            style={{ outline: 'none', border: 'none', background: '#dc2626' }}
          >
            <Printer className="w-3.5 h-3.5 stroke-[2] shrink-0" />
            <span>Cetak Struk</span>
          </button>
        </div>
      </div>

      {/* Void Modal */}
      {isVoidModalOpen && (
        <VoidOrderModal
          order={currentOrderState}
          onClose={() => setIsVoidModalOpen(false)}
        />
      )}
    </div>
  );
};
