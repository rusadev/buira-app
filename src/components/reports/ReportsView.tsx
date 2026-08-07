import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/formatters';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  CreditCard, 
  Award, 
  ArrowUpRight,
  Printer,
  FileSpreadsheet,
  Receipt,
  UserCheck,
  Percent
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
  const netRevenue = totalSubtotal - totalDiscount;
  const totalTransactionsCount = successOrders.length;
  const averageBasketSize = totalTransactionsCount > 0 ? Math.round(totalOmset / totalTransactionsCount) : 0;

  // Calculate Total HPP & Estimated Net Profit
  let totalHPP = 0;
  successOrders.forEach(o => {
    o.items.forEach(item => {
      const prod = products.find(p => p.id === item.product.id);
      const cost = prod?.costPrice || (item.product.price * 0.4);
      totalHPP += cost * item.quantity;
    });
  });

  const grossProfit = netRevenue - totalHPP;

  // Payment Breakdown
  const cashSales = successOrders.filter(o => o.paymentMethod === 'Cash').reduce((sum, o) => sum + o.grandTotal, 0);
  const qrisSales = successOrders.filter(o => o.paymentMethod === 'QRIS' || o.paymentMethod === 'E-Wallet').reduce((sum, o) => sum + o.grandTotal, 0);
  const cardSales = successOrders.filter(o => o.paymentMethod === 'Debit' || o.paymentMethod === 'Credit' || o.paymentMethod === 'Debit / EDC').reduce((sum, o) => sum + o.grandTotal, 0);

  // Detailed Product Breakdown
  const productSalesMap: Record<string, { id: string; name: string; category: string; qty: number; revenue: number; cost: number; image: string }> = {};

  successOrders.forEach(o => {
    o.items.forEach(item => {
      const prod = products.find(p => p.id === item.product.id);
      const cost = prod?.costPrice || (item.product.price * 0.4);

      if (!productSalesMap[item.product.id]) {
        productSalesMap[item.product.id] = {
          id: item.product.id,
          name: item.product.name,
          category: item.product.category || 'Menu Utama',
          qty: 0,
          revenue: 0,
          cost: cost,
          image: item.product.image
        };
      }
      productSalesMap[item.product.id].qty += item.quantity;
      productSalesMap[item.product.id].revenue += item.totalPrice;
    });
  });

  const topProducts = Object.values(productSalesMap).sort((a, b) => b.qty - a.qty).slice(0, 5);

  // Staff Performance Summary
  const staffSalesMap: Record<string, { name: string; ordersCount: number; totalSales: number }> = {};

  successOrders.forEach(o => {
    const cashier = o.cashierName || 'Kasir';
    if (!staffSalesMap[cashier]) {
      staffSalesMap[cashier] = { name: cashier, ordersCount: 0, totalSales: 0 };
    }
    staffSalesMap[cashier].ordersCount += 1;
    staffSalesMap[cashier].totalSales += o.grandTotal;
  });

  const staffReport = Object.values(staffSalesMap).sort((a, b) => b.totalSales - a.totalSales).slice(0, 4);

  // Export Detailed Excel / CSV
  const handleExportExcel = () => {
    const headers = [
      'No Struk',
      'Tanggal',
      'Jam',
      'Pelanggan',
      'Tipe Order',
      'Kasir Bertugas',
      'Metode Pembayaran',
      'Subtotal (Rp)',
      'Diskon (Rp)',
      'Pajak PB1 (Rp)',
      'Grand Total (Rp)',
      'Status Transaksi'
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
    link.setAttribute('download', `Laporan_Eksekutif_${currentEntity.name.replace(/\s+/g, '_')}_${datePeriod}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-6 overflow-y-auto font-sans select-none">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-600" />
            <span>Dashboard Laporan Eksekutif ({currentEntity.name})</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Ringkasan eksekutif omset, estimasi laba kotor, breakdown pembayaran, dan produk terlaris.</p>
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
            <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
            <span>Export Excel (.csv)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-extrabold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shrink-0"
            style={{ outline: 'none' }}
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak</span>
          </button>
        </div>
      </div>

      {/* Top 4 Primary Metric Cards (Clean White without Shading) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Omset */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600">Omset Penjualan Kotor</span>
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-red-600 flex items-center justify-center font-black">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-600">{formatRupiah(totalOmset)}</div>
          <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-bold">
            <ArrowUpRight className="w-3 h-3" />
            <span>{totalTransactionsCount} pesanan lunas</span>
          </div>
        </div>

        {/* Laba Kotor & HPP */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600">Estimasi Laba Kotor</span>
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center font-black">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{formatRupiah(Math.max(0, grossProfit))}</div>
          <div className="text-[10px] text-slate-500 font-medium">HPP Bahan: {formatRupiah(totalHPP)}</div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600">Rata-rata Basket (AOV)</span>
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-black">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{formatRupiah(averageBasketSize)}</div>
          <div className="text-[10px] text-slate-500 font-medium">Void: {voidOrders.length} Pesanan</div>
        </div>

        {/* Pajak PB1 & Diskon */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600">Pajak PB1 & Diskon</span>
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-black">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">{formatRupiah(totalTax)}</div>
          <div className="text-[10px] text-rose-600 font-bold">Diskon Promo: {formatRupiah(totalDiscount)}</div>
        </div>
      </div>

      {/* Main Executive Summary Section (2 Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Left Column: P&L Statement & Payment Breakdown */}
        <div className="space-y-5">
          {/* P&L Statement Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-4 h-4 text-red-600" />
                <span>Ringkasan Laba Rugi (P&L)</span>
              </h3>
              <span className="text-[10px] text-red-600 font-extrabold px-2.5 py-0.5 rounded-md border border-red-200">
                {datePeriod}
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs font-bold space-y-2">
              <div className="flex justify-between py-1">
                <span className="text-slate-700">Penjualan Kotor (Gross Sales)</span>
                <span className="text-slate-900 font-black">{formatRupiah(totalSubtotal)}</span>
              </div>

              <div className="flex justify-between py-1 text-rose-600">
                <span>Diskon & Promo Given (-)</span>
                <span className="font-black">-{formatRupiah(totalDiscount)}</span>
              </div>

              <div className="flex justify-between py-1 text-slate-600 font-bold">
                <span>Modal HPP Bahan Baku (-)</span>
                <span className="font-black">-{formatRupiah(totalHPP)}</span>
              </div>

              <div className="flex justify-between py-2 text-emerald-700 border border-emerald-300 p-2.5 rounded-xl text-sm font-black mt-1">
                <span>Estimasi Laba Kotor</span>
                <span>{formatRupiah(Math.max(0, grossProfit))}</span>
              </div>
            </div>
          </div>

          {/* Payment Breakdown Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-red-600" />
                <span>Metode Pembayaran</span>
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-slate-800">Uang Tunai (Cash)</span>
                  <span className="text-red-600">{formatRupiah(cashSales)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full" style={{ width: `${totalOmset > 0 ? (cashSales / totalOmset) * 100 : 0}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-slate-800">QRIS / E-Wallet</span>
                  <span className="text-emerald-600">{formatRupiah(qrisSales)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full" style={{ width: `${totalOmset > 0 ? (qrisSales / totalOmset) * 100 : 0}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-slate-800">Debit / EDC</span>
                  <span className="text-slate-800">{formatRupiah(cardSales)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-700 h-full" style={{ width: `${totalOmset > 0 ? (cardSales / totalOmset) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Top 5 Best Sellers & Staff Performance */}
        <div className="space-y-5">
          {/* Top 5 Products */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-red-600" />
                <span>Top 5 Produk Terlaris</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-bold">Menu Paling Populer</span>
            </div>

            <div className="space-y-2">
              {topProducts.length > 0 ? (
                topProducts.map((prod, idx) => {
                  const totalCostForProd = prod.cost * prod.qty;
                  const margin = prod.revenue - totalCostForProd;

                  return (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 font-black text-slate-800 text-xs flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </span>
                        <img src={prod.image} alt={prod.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" />
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900">{prod.name}</h4>
                          <span className="text-[10px] text-slate-500 font-bold">{prod.qty} Porsi Terjual</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-red-600 block">{formatRupiah(prod.revenue)}</span>
                        <span className="text-[10px] text-emerald-600 font-bold">Margin: +{formatRupiah(Math.max(0, margin))}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 font-bold py-6 text-center">Belum ada data produk terjual.</p>
              )}
            </div>
          </div>

          {/* Top Cashiers Staff Performance */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-red-600" />
                <span>Performa Staf Kasir</span>
              </h3>
            </div>

            <div className="space-y-2">
              {staffReport.length > 0 ? (
                staffReport.map((staf, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{staf.name}</h4>
                      <span className="text-[10px] text-slate-500 font-bold">{staf.ordersCount} Struk Ditangani</span>
                    </div>

                    <span className="text-xs font-black text-slate-900">{formatRupiah(staf.totalSales)}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-bold py-4 text-center">Belum ada aktivitas kasir.</p>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
