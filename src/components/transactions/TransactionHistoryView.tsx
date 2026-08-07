import React, { useState } from 'react';
import type { Order } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { getUserPermissions } from '../../utils/permissions';
import { ReceiptModal } from '../cashier/ReceiptModal';
import { Receipt, Search, Printer, AlertTriangle } from 'lucide-react';

export const TransactionHistoryView: React.FC = () => {
  const { orders, currentEntityId, currentEntity, currentUser, customRoles, updateOrderStatus } = usePOS();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);

  const perms = getUserPermissions(currentUser, customRoles);
  const entityOrders = orders.filter(o => o.entityId === currentEntityId);

  const filteredOrders = entityOrders.filter(o => {
    return o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
           o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           o.cashierName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleVoidOrder = (orderId: string) => {
    if (!perms.canVoidOrders) {
      alert('Anda tidak memiliki izin (permission) untuk membatalkan (Void) transaksi ini.');
      return;
    }
    if (confirm('Apakah Anda yakin ingin membatalkan (Void) transaksi ini?')) {
      updateOrderStatus(orderId, 'Cancelled');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-5 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-600" />
            <span>Riwayat Transaksi & Struk Kasir ({currentEntity.name})</span>
          </h2>
          <p className="text-xs text-slate-500">Daftar seluruh pesanan yang pernah di-checkout, cetak ulang struk, dan pembatalan transaksi.</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari no. struk, nama pelanggan, atau kasir..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-medium"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">No. Struk / Waktu</th>
              <th className="p-3.5">Pelanggan & Order</th>
              <th className="p-3.5">Kasir</th>
              <th className="p-3.5">Metode Bayar</th>
              <th className="p-3.5">Grand Total</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => {
                const isCancelled = order.status === 'Cancelled';

                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-slate-900 block">{order.orderNumber}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{formatDate(order.createdAt)}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-amber-800 block">{order.customerName}</span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {order.orderType} {order.tableNumber ? `(${order.tableNumber})` : ''}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600 font-medium">{order.cashierName}</td>
                    <td className="p-3.5 font-bold text-slate-800">{order.paymentMethod}</td>
                    <td className="p-3.5 font-extrabold text-amber-700">{formatRupiah(order.grandTotal)}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        isCancelled 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {isCancelled ? 'VOID / DIBATALKAN' : 'SUKSES / LUNAS'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrderForPrint(order)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center gap-1 text-[11px] px-2"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Struk</span>
                        </button>
                        {!isCancelled && perms.canVoidOrders && (
                          <button
                            onClick={() => handleVoidOrder(order.id)}
                            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 font-bold flex items-center gap-1 text-[11px] px-2"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Void</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                  Belum ada riwayat transaksi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrderForPrint && (
        <ReceiptModal
          order={selectedOrderForPrint}
          onClose={() => setSelectedOrderForPrint(null)}
        />
      )}
    </div>
  );
};
