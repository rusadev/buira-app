import React from 'react';
import type { Order } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { Printer, CheckCircle, X } from 'lucide-react';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  const { currentEntity } = usePOS();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
            <CheckCircle className="w-4 h-4" />
            <span>Pembayaran Berhasil!</span>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Thermal Receipt Body */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-100/60">
          <div 
            id="thermal-receipt" 
            className="bg-white text-slate-900 font-mono text-[11px] p-4 rounded-xl mx-auto w-full max-w-[80mm] space-y-3 leading-tight border border-slate-300"
          >
            {/* Header Store Info */}
            <div className="text-center space-y-1 pb-2 border-b border-dashed border-slate-400">
              <div className="text-xl font-bold uppercase tracking-wider">{currentEntity.name}</div>
              <div className="text-[10px] text-slate-600">{currentEntity.address}</div>
              <div className="text-[10px] text-slate-600">Telp: {currentEntity.phone}</div>
            </div>

            {/* Order Info */}
            <div className="space-y-0.5 text-[10px] pb-2 border-b border-dashed border-slate-400">
              <div className="flex justify-between">
                <span>No. Struk:</span>
                <span className="font-bold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Tgl/Waktu:</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>{order.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span>{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Tipe Order:</span>
                <span className="font-bold">{order.orderType} {order.tableNumber ? `(${order.tableNumber})` : ''}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2 py-1 border-b border-dashed border-slate-400">
              {order.items.map((item, idx) => (
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
                    <div className="text-[9px] text-amber-800 pl-3 italic">
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
                <span>{formatRupiah(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Diskon ({order.discountPercentage}%):</span>
                  <span>-{formatRupiah(order.discountAmount)}</span>
                </div>
              )}
              {order.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>Pajak Resto:</span>
                  <span>{formatRupiah(order.taxAmount)}</span>
                </div>
              )}
              {order.serviceAmount > 0 && (
                <div className="flex justify-between">
                  <span>Layanan Service:</span>
                  <span>{formatRupiah(order.serviceAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-400">
                <span>TOTAL:</span>
                <span>{formatRupiah(order.grandTotal)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Metode Bayar:</span>
                <span className="font-semibold">{order.paymentMethod}</span>
              </div>
              {order.paymentMethod === 'Cash' && (
                <>
                  <div className="flex justify-between">
                    <span>Diterima:</span>
                    <span>{formatRupiah(order.paymentAmount)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Kembali:</span>
                    <span>{formatRupiah(order.changeAmount)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer Struk */}
            <div className="text-center pt-3 border-t border-dashed border-slate-400 space-y-1 text-[9px] text-slate-600">
              <p className="font-bold">*** TERIMA KASIH ATAS KUNJUNGAN ANDA ***</p>
              <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
              <p className="text-[8px] text-slate-400">Powered by Majoo Enterprise POS</p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white"
          >
            Selesai
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk Thermal (58/80mm)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
