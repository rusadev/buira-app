import React from 'react';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/formatters';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, CreditCard, Award, ArrowUpRight } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { orders, currentEntityId, currentEntity } = usePOS();

  const entityOrders = orders.filter(o => o.entityId === currentEntityId && o.status !== 'Cancelled');

  const totalOmset = entityOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalDiscount = entityOrders.reduce((sum, o) => sum + o.discountAmount, 0);
  const totalTax = entityOrders.reduce((sum, o) => sum + o.taxAmount, 0);
  const totalTransactionsCount = entityOrders.length;
  const averageBasketSize = totalTransactionsCount > 0 ? Math.round(totalOmset / totalTransactionsCount) : 0;

  const cashSales = entityOrders.filter(o => o.paymentMethod === 'Cash').reduce((sum, o) => sum + o.grandTotal, 0);
  const qrisSales = entityOrders.filter(o => o.paymentMethod === 'QRIS' || o.paymentMethod === 'E-Wallet').reduce((sum, o) => sum + o.grandTotal, 0);
  const cardSales = entityOrders.filter(o => o.paymentMethod === 'Debit' || o.paymentMethod === 'Credit').reduce((sum, o) => sum + o.grandTotal, 0);

  const productSalesMap: Record<string, { name: string; qty: number; revenue: number; image: string }> = {};

  entityOrders.forEach(o => {
    o.items.forEach(item => {
      if (!productSalesMap[item.product.id]) {
        productSalesMap[item.product.id] = {
          name: item.product.name,
          qty: 0,
          revenue: 0,
          image: item.product.image
        };
      }
      productSalesMap[item.product.id].qty += item.quantity;
      productSalesMap[item.product.id].revenue += item.totalPrice;
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-6 overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-600" />
          <span>Dashboard Laporan Omset & Keuangan ({currentEntity.name})</span>
        </h2>
        <p className="text-xs text-slate-500">Ringkasan performa penjualan, omset, metode pembayaran, dan produk terlaris.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Omset */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Omset Penjualan</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-amber-700">{formatRupiah(totalOmset)}</div>
          <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>Terhitung dari {totalTransactionsCount} transaksi</span>
          </div>
        </div>

        {/* Transaksi */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Transaksi Selesai</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900">{totalTransactionsCount} Struk</div>
          <div className="text-[10px] text-slate-500 font-medium">Rata-rata: {formatRupiah(averageBasketSize)} / struk</div>
        </div>

        {/* QRIS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Penjualan Non-Tunai</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-emerald-700">{formatRupiah(qrisSales)}</div>
          <div className="text-[10px] text-slate-500 font-medium">
            {totalOmset > 0 ? ((qrisSales / totalOmset) * 100).toFixed(0) : 0}% dari total omset
          </div>
        </div>

        {/* Diskon */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Diskon Diberikan</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-rose-600">{formatRupiah(totalDiscount)}</div>
          <div className="text-[10px] text-slate-500 font-medium">Pajak Resto: {formatRupiah(totalTax)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Payment Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-600" />
            <span>Breakdown Metode Pembayaran</span>
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Tunai (Cash)</span>
                <span className="text-amber-700">{formatRupiah(cashSales)}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-600 h-full"
                  style={{ width: `${totalOmset > 0 ? (cashSales / totalOmset) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">QRIS / E-Wallet</span>
                <span className="text-emerald-700">{formatRupiah(qrisSales)}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full"
                  style={{ width: `${totalOmset > 0 ? (qrisSales / totalOmset) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Debit / Kredit EDC</span>
                <span className="text-sky-700">{formatRupiah(cardSales)}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-sky-600 h-full"
                  style={{ width: `${totalOmset > 0 ? (cardSales / totalOmset) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top 5 Products */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Top 5 Produk Terlaris (Best Sellers)</span>
          </h3>

          <div className="space-y-2.5">
            {topProducts.length > 0 ? (
              topProducts.map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center justify-center border border-amber-200">
                      #{idx + 1}
                    </span>
                    <img src={prod.image} alt={prod.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{prod.name}</h4>
                      <span className="text-[10px] text-slate-500 font-medium">{prod.qty} Porsi Terjual</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-amber-700">{formatRupiah(prod.revenue)}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic py-4 text-center">Belum ada data produk terjual.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
