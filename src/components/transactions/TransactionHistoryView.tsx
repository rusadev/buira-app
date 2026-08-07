import React, { useState } from 'react';
import type { Order } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { getUserPermissions } from '../../utils/permissions';
import { ReceiptModal } from '../cashier/ReceiptModal';
import { VoidOrderModal } from '../cashier/VoidOrderModal';
import { 
  Receipt, 
  Search, 
  Printer, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  CreditCard
} from 'lucide-react';

export const TransactionHistoryView: React.FC = () => {
  const { orders, currentEntityId, currentEntity, currentUser, customRoles } = usePOS();
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrderType, setSelectedOrderType] = useState<string>('ALL');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedDatePeriod, setSelectedDatePeriod] = useState<string>('ALL');
  
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);
  const [selectedOrderForVoid, setSelectedOrderForVoid] = useState<Order | null>(null);

  // Pagination state (capped to 6 per page for 100vh zero scroll lock)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 6;

  const perms = getUserPermissions(currentUser, customRoles);
  const entityOrders = orders.filter(o => o.entityId === currentEntityId);

  // Calculate KPIs
  const successOrders = entityOrders.filter(o => o.status !== 'Cancelled');
  const totalRevenue = successOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalSuccessCount = successOrders.length;
  const cashSalesCount = successOrders.filter(o => o.paymentMethod === 'Cash').length;
  const qrisSalesCount = successOrders.filter(o => o.paymentMethod === 'QRIS' || o.paymentMethod === 'E-Wallet').length;
  const voidCount = entityOrders.filter(o => o.status === 'Cancelled').length;

  // Filter orders
  const filteredOrders = entityOrders.filter(o => {
    const matchesOrderType = selectedOrderType === 'ALL' || o.orderType === selectedOrderType;
    const matchesPayment = selectedPaymentMethod === 'ALL' || o.paymentMethod === selectedPaymentMethod;
    const matchesStatus = 
      selectedStatusFilter === 'ALL' ? true :
      selectedStatusFilter === 'SUCCESS' ? o.status !== 'Cancelled' :
      selectedStatusFilter === 'CANCELLED' ? o.status === 'Cancelled' : true;

    // Date Period Matching
    const matchesDate = (() => {
      if (selectedDatePeriod === 'ALL') return true;
      const orderDate = new Date(o.createdAt);
      if (isNaN(orderDate.getTime())) return true;

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

      if (selectedDatePeriod === 'TODAY') {
        return orderDate.getTime() >= todayStart;
      }

      if (selectedDatePeriod === 'LAST_7_DAYS') {
        const sevenDaysAgo = todayStart - (7 * 24 * 60 * 60 * 1000);
        return orderDate.getTime() >= sevenDaysAgo;
      }

      if (selectedDatePeriod === 'THIS_MONTH') {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        return orderDate.getTime() >= monthStart;
      }

      return true;
    })();

    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.cashierName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesOrderType && matchesPayment && matchesStatus && matchesDate && matchesSearch;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleOpenVoidModal = (order: Order) => {
    if (!perms.canVoidOrders) {
      alert('Anda tidak memiliki izin (permission) untuk membatalkan (Void) transaksi ini.');
      return;
    }
    setSelectedOrderForVoid(order);
  };

  return (
    <div className="flex-1 h-full flex flex-col min-h-0 bg-slate-50 p-6 space-y-4 overflow-hidden font-sans select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-red-600" />
            <span>Riwayat Transaksi & Struk Kasir ({currentEntity.name})</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Daftar seluruh pesanan yang telah di-checkout, cetak ulang struk, dan pembatalan transaksi.</p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Total Omset Lunas</span>
            <span className="text-sm sm:text-base font-black text-emerald-600">{formatRupiah(totalRevenue)}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Transaksi Sukses</span>
            <span className="text-sm sm:text-base font-black text-slate-900">{totalSuccessCount} Pesanan</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-black text-xs shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Metode Pembayaran</span>
            <span className="text-xs font-black text-slate-800">{cashSalesCount} Cash / {qrisSalesCount} QRIS</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs shrink-0">
            <CreditCard className="w-4 h-4 text-slate-700" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">Transaksi Void</span>
            <span className="text-sm sm:text-base font-black text-rose-600">{voidCount} Void</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-xs shrink-0">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shrink-0">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari no. struk, nama pelanggan, atau nama kasir..."
            className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 font-bold"
            style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          {/* Date Period Filter */}
          <select
            value={selectedDatePeriod}
            onChange={(e) => {
              setSelectedDatePeriod(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 text-slate-800 text-xs rounded-xl px-3 py-2 font-extrabold"
            style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
          >
            <option value="ALL">Semua Periode Tanggal</option>
            <option value="TODAY">Hari Ini (Today)</option>
            <option value="LAST_7_DAYS">7 Hari Terakhir</option>
            <option value="THIS_MONTH">Bulan Ini</option>
          </select>

          {/* Order Type Filter */}
          <select
            value={selectedOrderType}
            onChange={(e) => {
              setSelectedOrderType(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 text-slate-800 text-xs rounded-xl px-3 py-2 font-extrabold"
            style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
          >
            <option value="ALL">Semua Tipe Order</option>
            <option value="Dine-In">Dine-In (Makan di Tempat)</option>
            <option value="Takeaway">Takeaway (Bawa Pulang)</option>
            <option value="Delivery">Delivery (Pesan Antar)</option>
          </select>

          {/* Payment Filter */}
          <select
            value={selectedPaymentMethod}
            onChange={(e) => {
              setSelectedPaymentMethod(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 text-slate-800 text-xs rounded-xl px-3 py-2 font-extrabold"
            style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
          >
            <option value="ALL">Semua Metode Bayar</option>
            <option value="Cash">Cash (Tunai)</option>
            <option value="QRIS">QRIS / E-Wallet</option>
            <option value="Debit / EDC">Debit / EDC</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => {
              setSelectedStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 text-slate-800 text-xs rounded-xl px-3 py-2 font-extrabold"
            style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
          >
            <option value="ALL">Semua Status</option>
            <option value="SUCCESS">Lunas / Sukses</option>
            <option value="CANCELLED">Void / Dibatalkan</option>
          </select>
        </div>
      </div>

      {/* Transaction Table Container with 100vh Zero Scroll Lock */}
      <div className="flex-1 min-h-0 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between">
        <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="p-3">No. Struk / Waktu</th>
                <th className="p-3">Pelanggan & Order</th>
                <th className="p-3">Kasir Bertugas</th>
                <th className="p-3">Metode Bayar</th>
                <th className="p-3">Grand Total</th>
                <th className="p-3">Status Transaksi</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map(order => {
                  const isCancelled = order.status === 'Cancelled';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <span className="font-mono font-extrabold text-slate-900 block">{order.orderNumber}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{formatDate(order.createdAt)}</span>
                      </td>

                      <td className="p-3">
                        <span className="font-extrabold text-slate-900 block">{order.customerName || 'Pelanggan'}</span>
                        <span className="text-[10px] text-slate-500 font-bold">
                          {order.orderType} {order.tableNumber ? `(${order.tableNumber})` : ''}
                        </span>
                      </td>

                      <td className="p-3 text-slate-700 font-bold">{order.cashierName || 'Kasir'}</td>

                      <td className="p-3 font-extrabold text-slate-800">{order.paymentMethod}</td>

                      <td className="p-3 font-black text-red-600">{formatRupiah(order.grandTotal)}</td>

                      <td className="p-3">
                        <div className="flex flex-col items-start gap-0.5">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            isCancelled 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            {isCancelled ? 'Void' : 'Lunas'}
                          </span>
                          {isCancelled && order.voidReason && (
                            <span className="text-[10px] text-rose-600 font-bold italic truncate max-w-[140px]" title={order.voidReason}>
                              {order.voidReason}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForPrint(order)}
                            className="p-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-extrabold flex items-center gap-1 text-[11px] px-2.5 transition-colors"
                            style={{ outline: 'none' }}
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-500" />
                            <span>Struk</span>
                          </button>
                          {!isCancelled && (
                            <button
                              type="button"
                              onClick={() => handleOpenVoidModal(order)}
                              className="p-1 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-extrabold flex items-center gap-1 text-[11px] px-2.5 transition-colors"
                              style={{ outline: 'none' }}
                            >
                              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
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
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">
                    Belum ada riwayat transaksi yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredOrders.length > 0 && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-slate-600 shrink-0">
            <div>
              Menampilkan <span className="text-slate-900 font-extrabold">{startIndex + 1}</span> - <span className="text-slate-900 font-extrabold">{Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)}</span> dari <span className="text-slate-900 font-extrabold">{filteredOrders.length}</span> transaksi
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
                className={`p-1.5 rounded-xl border flex items-center justify-center transition-all ${
                  safeCurrentPage === 1 
                    ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                style={{ outline: 'none' }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-xl text-xs font-extrabold flex items-center justify-center transition-all ${
                    safeCurrentPage === page
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                  style={{ outline: 'none' }}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage === totalPages}
                className={`p-1.5 rounded-xl border flex items-center justify-center transition-all ${
                  safeCurrentPage === totalPages 
                    ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                style={{ outline: 'none' }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Print Receipt Modal */}
      {selectedOrderForPrint && (
        <ReceiptModal
          order={selectedOrderForPrint}
          onClose={() => setSelectedOrderForPrint(null)}
        />
      )}

      {/* Void Order Modal */}
      {selectedOrderForVoid && (
        <VoidOrderModal
          order={selectedOrderForVoid}
          onClose={() => setSelectedOrderForVoid(null)}
        />
      )}
    </div>
  );
};
