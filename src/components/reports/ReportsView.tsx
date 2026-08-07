import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  CreditCard, 
  Award, 
  ArrowUpRight,
  Download,
  Calendar,
  Percent,
  Receipt,
  Printer,
  PieChart,
  UtensilsCrossed
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { orders, currentEntityId, currentEntity, products } = usePOS();
  const [datePeriod, setDatePeriod] = useState<string>('THIS_MONTH');

  // Filter orders by entity and selected Date Period
  const entityOrders = orders.filter(o => {
    if (o.entityId !== currentEntityId) return false;
    
    const orderDate = new Date(o.createdAt);
    if (isNaN(orderDate.getTime())) return true;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    if (datePeriod === 'TODAY') {
      return orderDate.getTime() >= todayStart;
    }
    if (datePeriod === 'LAST_7_DAYS') {
      const sevenDaysAgo = todayStart - (7 * 24 * 60 * 60 * 1000);
      return orderDate.getTime() >= sevenDaysAgo;
    }
    if (datePeriod === 'THIS_MONTH') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      return orderDate.getTime() >= monthStart;
    }
    return true; // ALL
  });

  const successOrders = entityOrders.filter(o => o.status !== 'Cancelled');
  const voidOrders = entityOrders.filter(o => o.status === 'Cancelled');

  // Financial KPI Metrics
  const totalOmset = successOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalSubtotal = successOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalDiscount = successOrders.reduce((sum, o) => sum + o.discountAmount, 0);
  const totalTax = successOrders.reduce((sum, o) => sum + o.taxAmount, 0);
  const totalTransactionsCount = successOrders.length;
  const averageBasketSize = totalTransactionsCount > 0 ? Math.round(totalOmset / totalTransactionsCount) : 0;

  // Calculate Total HPP & Estimated Net Profit
  let totalHPP = 0;
  successOrders.forEach(o => {
    o.items.forEach(item => {
      const prod = products.find(p => p.id === item.product.id);
      const cost = prod?.costPrice || (item.product.price * 0.4); // fallback 40% cost ratio if HPP not set
      totalHPP += cost * item.quantity;
    });
  });

  const estimatedNetProfit = totalOmset - totalHPP - totalDiscount;

  // Payment Breakdown
  const cashSales = successOrders.filter(o => o.paymentMethod === 'Cash').reduce((sum, o) => sum + o.grandTotal, 0);
  const qrisSales = successOrders.filter(o => o.paymentMethod === 'QRIS' || o.paymentMethod === 'E-Wallet').reduce((sum, o) => sum + o.grandTotal, 0);
  const cardSales = successOrders.filter(o => o.paymentMethod === 'Debit' || o.paymentMethod === 'Credit' || o.paymentMethod === 'Debit / EDC').reduce((sum, o) => sum + o.grandTotal, 0);

  // Channel Breakdown
  const dineInCount = successOrders.filter(o => o.orderType === 'Dine-In').length;
  const takeawayCount = successOrders.filter(o => o.orderType === 'Takeaway').length;
  const deliveryCount = successOrders.filter(o => o.orderType === 'Delivery').length;

  // Top 5 Best Sellers
  const productSalesMap: Record<string, { name: string; qty: number; revenue: number; image: string; cost: number }> = {};

  successOrders.forEach(o => {
    o.items.forEach(item => {
      if (!productSalesMap[item.product.id]) {
        const prod = products.find(p => p.id === item.product.id);
        productSalesMap[item.product.id] = {
          name: item.product.name,
          qty: 0,
          revenue: 0,
          image: item.product.image,
          cost: prod?.costPrice || (item.product.price * 0.4)
        };
      }
      productSalesMap[item.product.id].qty += item.quantity;
      productSalesMap[item.product.id].revenue += item.totalPrice;
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Export to Excel / CSV Generator
  const handleExportExcel = () => {
    const headers = [
      'No Struk',
      'Tanggal',
      'Jam',
      'Pelanggan',
      'Tipe Order',
      'Kasir',
      'Metode Pembayaran',
      'Subtotal (Rp)',
      'Diskon (Rp)',
      'Pajak PB1 (Rp)',
      'Grand Total (Rp)',
      'Status'
    ];

    const rows = entityOrders.map(o => {
      const d = new Date(o.createdAt);
      const dateStr = isNaN(d.getTime()) ? '-' : d.toISOString().split('T')[0];
      const timeStr = isNaN(d.getTime()) ? '-' : d.toTimeString().split(' ')[0];

      return [
        `"${o.orderNumber}"`,
        `"${dateStr}"`,
        `"${timeStr}"`,
        `"${o.customerName || 'Pelanggan'}"`,
        `"${o.orderType}"`,
        `"${o.cashierName || 'Kasir'}"`,
        `"${o.paymentMethod}"`,
        o.subtotal || 0,
        o.discountAmount || 0,
        o.taxAmount || 0,
        o.grandTotal || 0,
        `"${o.status === 'Cancelled' ? 'VOID' : 'LUNAS'}"`
      ].join(',');
    });

    const csvString = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Keuangan_${currentEntity.name.replace(/\s+/g, '_')}_${datePeriod}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintSummaryReport = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-6 overflow-y-auto font-sans select-none">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-600" />
            <span>Dashboard Laporan Keuangan Enterprise ({currentEntity.name})</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Laporan omset penjualan kotor, estimasi laba bersih, breakdown pembayaran, dan ekspor data spreadsheet.</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Date Period Filter */}
          <select
            value={datePeriod}
            onChange={(e) => setDatePeriod(e.target.value)}
            className="bg-white border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 font-extrabold"
            style={{ outline: 'none' }}
          >
            <option value="TODAY">Hari Ini (Today)</option>
            <option value="LAST_7_DAYS">7 Hari Terakhir</option>
            <option value="THIS_MONTH">Bulan Ini</option>
            <option value="ALL">Semua Periode (All-Time)</option>
          </select>

          {/* Export Excel Button */}
          <button
            onClick={handleExportExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shrink-0"
            style={{ outline: 'none', border: 'none' }}
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Export Excel (.csv)</span>
          </button>

          {/* Print Summary Button */}
          <button
            onClick={handlePrintSummaryReport}
            className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-extrabold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shrink-0"
            style={{ outline: 'none' }}
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Omset */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600">Omset Penjualan Kotor</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-600">{formatRupiah(totalOmset)}</div>
          <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>Terhitung dari {totalTransactionsCount} pesanan lunas</span>
          </div>
        </div>

        {/* Estimasi Laba Bersih */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600">Estimasi Laba Bersih</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{formatRupiah(Math.max(0, estimatedNetProfit))}</div>
          <div className="text-[10px] text-slate-500 font-medium">Estimasi HPP Bahan: {formatRupiah(totalHPP)}</div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600">Rata-rata Basket (AOV)</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{formatRupiah(averageBasketSize)}</div>
          <div className="text-[10px] text-slate-500 font-medium">Struk Lunas: {totalTransactionsCount} / Struk Void: {voidOrders.length}</div>
        </div>

        {/* Total Diskon & Pajak */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600">Diskon & Pajak Resto</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">{formatRupiah(totalTax)}</div>
          <div className="text-[10px] text-rose-600 font-bold">Total Diskon Diberikan: {formatRupiah(totalDiscount)}</div>
        </div>
      </div>

      {/* Grid Row 2: Payment & Channel Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Payment Breakdown (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-red-600" />
              <span>Rincian Pembayaran Berdasarkan Metode</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-bold">Total: {formatRupiah(totalOmset)}</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold">
                <span className="text-slate-800">Uang Tunai (Cash)</span>
                <span className="text-red-600 font-black">{formatRupiah(cashSales)} ({totalOmset > 0 ? ((cashSales / totalOmset) * 100).toFixed(1) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-red-600 h-full transition-all duration-500"
                  style={{ width: `${totalOmset > 0 ? (cashSales / totalOmset) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold">
                <span className="text-slate-800">QRIS / E-Wallet (GoPay, OVO, ShopeePay, BCA QR)</span>
                <span className="text-emerald-600 font-black">{formatRupiah(qrisSales)} ({totalOmset > 0 ? ((qrisSales / totalOmset) * 100).toFixed(1) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full transition-all duration-500"
                  style={{ width: `${totalOmset > 0 ? (qrisSales / totalOmset) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold">
                <span className="text-slate-800">Debit / Kredit EDC</span>
                <span className="text-slate-800 font-black">{formatRupiah(cardSales)} ({totalOmset > 0 ? ((cardSales / totalOmset) * 100).toFixed(1) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-slate-700 h-full transition-all duration-500"
                  style={{ width: `${totalOmset > 0 ? (cardSales / totalOmset) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Channel Breakdown (1 col) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-red-600" />
              <span>Saluran Penjualan (Channel)</span>
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-extrabold text-slate-800">Dine-In (Makan di Tempat)</span>
              <span className="text-xs font-black text-red-600">{dineInCount} Pesanan</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-extrabold text-slate-800">Takeaway (Bawa Pulang)</span>
              <span className="text-xs font-black text-slate-900">{takeawayCount} Pesanan</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-extrabold text-slate-800">Delivery (Pesan Antar)</span>
              <span className="text-xs font-black text-indigo-600">{deliveryCount} Pesanan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Products Leaderboard */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-red-600" />
            <span>Top 5 Produk Terlaris & Margin Keuntungan</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-bold">Paling Banyak Dipesan</span>
        </div>

        <div className="space-y-2.5">
          {topProducts.length > 0 ? (
            topProducts.map((prod, idx) => {
              const totalCostForProd = prod.cost * prod.qty;
              const margin = prod.revenue - totalCostForProd;

              return (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{prod.name}</h4>
                      <span className="text-[10px] text-slate-500 font-bold">{prod.qty} Porsi Terjual</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-1 sm:pt-0">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Omset Kotor</span>
                      <span className="text-xs font-black text-slate-900">{formatRupiah(prod.revenue)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-600 font-bold block">Margin Laba</span>
                      <span className="text-xs font-black text-emerald-600">+{formatRupiah(Math.max(0, margin))}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 font-bold py-6 text-center">Belum ada data produk terjual di periode ini.</p>
          )}
        </div>
      </div>

    </div>
  );
};
