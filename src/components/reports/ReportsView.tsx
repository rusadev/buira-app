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
  Percent,
  Calendar
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { orders, currentEntityId, currentEntity, products } = usePOS();
  
  const [datePeriod, setDatePeriod] = useState<string>('THIS_MONTH');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const firstDayOfMonthStr = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const [customStartDate, setCustomStartDate] = useState<string>(firstDayOfMonthStr);
  const [customEndDate, setCustomEndDate] = useState<string>(todayStr);

  // Filter orders by entity and selected Date Period / Custom Date Range
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
    if (datePeriod === 'CUSTOM') {
      const startMs = customStartDate ? new Date(`${customStartDate}T00:00:00`).getTime() : 0;
      const endMs = customEndDate ? new Date(`${customEndDate}T23:59:59`).getTime() : Infinity;
      return orderDate.getTime() >= startMs && orderDate.getTime() <= endMs;
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
  const totalService = successOrders.reduce((sum, o) => sum + o.serviceAmount, 0);
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
  const profitMarginPercent = netRevenue > 0 ? Math.round((grossProfit / netRevenue) * 100) : 0;

  // Payment Breakdown
  const cashSales = successOrders.filter(o => o.paymentMethod === 'Cash').reduce((sum, o) => sum + o.grandTotal, 0);
  const qrisSales = successOrders.filter(o => o.paymentMethod === 'QRIS' || o.paymentMethod === 'E-Wallet').reduce((sum, o) => sum + o.grandTotal, 0);
  const cardSales = successOrders.filter(o => o.paymentMethod === 'Transfer' || o.paymentMethod === 'Debit' || o.paymentMethod === 'Credit').reduce((sum, o) => sum + o.grandTotal, 0);

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

  // Ultra-Detailed Excel / CSV Export (Line-Item Breakdown & Financial Summary)
  const handleExportExcel = () => {
    // Worksheet 1: Line Itemized Sales Report
    const itemizedHeaders = [
      'No Struk',
      'Tanggal',
      'Jam',
      'Outlet / Store',
      'Kasir Bertugas',
      'Tipe Order',
      'Meja / Lokasi',
      'Pelanggan',
      'Nama Menu / Produk',
      'Kategori',
      'Qty Terjual',
      'Harga Satuan (Rp)',
      'Total Harga Menu (Rp)',
      'Metode Pembayaran',
      'Status Transaksi'
    ];

    const itemizedRows: string[] = [];

    entityOrders.forEach(o => {
      const d = new Date(o.createdAt);
      const dateStr = isNaN(d.getTime()) ? '-' : d.toISOString().split('T')[0];
      const timeStr = isNaN(d.getTime()) ? '-' : d.toTimeString().split(' ')[0];

      o.items.forEach(item => {
        itemizedRows.push([
          `"${o.orderNumber}"`,
          `"${dateStr}"`,
          `"${timeStr}"`,
          `"${currentEntity.name}"`,
          `"${o.cashierName || 'Kasir'}"`,
          `"${o.orderType}"`,
          `"${o.tableNumber || '-'}"`,
          `"${o.customerName || 'Pelanggan'}"`,
          `"${item.product.name}"`,
          `"${item.product.category || 'Menu Utama'}"`,
          item.quantity,
          item.unitPrice,
          item.totalPrice,
          `"${o.paymentMethod}"`,
          `"${o.status === 'Cancelled' ? 'VOID' : 'LUNAS'}"`
        ].join(','));
      });
    });

    // Worksheet 2: Financial P&L Executive Summary
    const summaryHeader = [
      '=== RINGKASAN FINANSIAL EXECUTIVE P&L ===',
      `Nama Outlet: "${currentEntity.name}"`,
      `Periode Laporan: "${datePeriod === 'CUSTOM' ? `${customStartDate} s/d ${customEndDate}` : datePeriod}"`,
      `Tanggal Cetak: "${new Date().toLocaleString('id-ID')}"`,
      '',
      'METRIK FINANSIAL,NILAI (RP)',
      `Total Omset Penjualan Kotor,${totalOmset}`,
      `Total Subtotal Sebelum Diskon,${totalSubtotal}`,
      `Total Diskon & Promo,${totalDiscount}`,
      `Pendapatan Bersih (Net Sales),${netRevenue}`,
      `Total Estimasi HPP / Modal Bahan,${totalHPP}`,
      `Estimasi Laba Kotor (Gross Profit),${grossProfit}`,
      `Profit Margin (%),${profitMarginPercent}%`,
      `Total Pajak PB1 Diterima,${totalTax}`,
      `Total Service Charge Diterima,${totalService}`,
      `Total Jumlah Transaksi,${totalTransactionsCount}`,
      `Rata-Rata Transaksi (AOV),${averageBasketSize}`,
      `Total Transaksi Void / Cancelled,${voidOrders.length}`,
      '',
      '=== RINCIAN TRANSAKSI ITEM ==='
    ].join('\n');

    const csvContent = '\uFEFF' + summaryHeader + '\n' + itemizedHeaders.join(',') + '\n' + itemizedRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Detail_${currentEntity.name.replace(/\s+/g, '_')}_${datePeriod}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6 font-sans bg-slate-50 select-none">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-600" />
            <span>Dashboard Laporan Eksekutif ({currentEntity.name})</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Ringkasan eksekutif omset, estimasi laba kotor, breakdown pembayaran, dan ekspor detail.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Date Period Filter Selector */}
          <select
            value={datePeriod}
            onChange={(e) => setDatePeriod(e.target.value)}
            className="bg-white border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 font-extrabold"
            style={{ outline: 'none' }}
          >
            <option value="TODAY">Hari Ini (Today)</option>
            <option value="LAST_7_DAYS">7 Hari Terakhir</option>
            <option value="THIS_MONTH">Bulan Ini</option>
            <option value="CUSTOM">Rentang Tanggal Custom...</option>
            <option value="ALL">Semua Periode (All-Time)</option>
          </select>

          {/* Custom Date Range Picker Inputs */}
          {datePeriod === 'CUSTOM' && (
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-xl text-xs font-bold text-slate-700">
              <Calendar className="w-4 h-4 text-red-600 ml-1" />
              <input
                type="date"
                value={customStartDate}
                onChange={e => setCustomStartDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                style={{ outline: 'none' }}
              />
              <span>s/d</span>
              <input
                type="date"
                value={customEndDate}
                onChange={e => setCustomEndDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                style={{ outline: 'none' }}
              />
            </div>
          )}

          {/* Export Detailed Excel Button */}
          <button
            onClick={handleExportExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shrink-0 shadow-xs"
            style={{ outline: 'none', border: 'none' }}
          >
            <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
            <span>Export Excel Detail (.csv)</span>
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
          <div className="text-2xl font-black text-slate-900">{formatRupiah(totalOmset)}</div>
          <p className="text-[11px] text-slate-500 font-bold">{totalTransactionsCount} Transaksi Selesai</p>
        </div>

        {/* Estimasi Laba Kotor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600">Estimasi Laba Kotor</span>
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center font-black">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{formatRupiah(grossProfit)}</div>
          <p className="text-[11px] text-slate-500 font-bold">Margin Laba Kotor: {profitMarginPercent}%</p>
        </div>

        {/* Rata-Rata Transaksi (AOV) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600">Rata-Rata Transaksi (AOV)</span>
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center font-black">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{formatRupiah(averageBasketSize)}</div>
          <p className="text-[11px] text-slate-500 font-bold">Rata-rata per struk belanja</p>
        </div>

        {/* Total Void / Transaksi Batal */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600">Total Struk Void</span>
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-rose-600 flex items-center justify-center font-black">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">{voidOrders.length} Struk</div>
          <p className="text-[11px] text-slate-500 font-bold">Transaksi Dibatalkan / Void</p>
        </div>
      </div>

      {/* Row 2: Financial P&L Statement & Payment Method Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* P&L Statement Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <TrendingUp className="w-4 h-4 text-red-600" />
            <span>Laporan Laba Rugi Sederhana (P&L Summary)</span>
          </h3>

          <div className="space-y-2.5 text-xs font-bold">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Total Penjualan Kotor (Gross Sales)</span>
              <span className="text-slate-900">{formatRupiah(totalSubtotal)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-rose-600">
              <span>Potongan Diskon & Promo (-)</span>
              <span>-{formatRupiah(totalDiscount)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-200 bg-slate-50 px-2 rounded-xl text-slate-900 font-black">
              <span>Pendapatan Bersih (Net Revenue)</span>
              <span>{formatRupiah(netRevenue)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-amber-700">
              <span>Estimasi HPP / Modal Bahan (-)</span>
              <span>-{formatRupiah(totalHPP)}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-slate-900 bg-emerald-50 px-2 rounded-xl text-emerald-800 font-black text-sm">
              <span>Estimasi Laba Kotor (Gross Profit)</span>
              <span>{formatRupiah(grossProfit)}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <CreditCard className="w-4 h-4 text-red-600" />
            <span>Breakdown Metode Pembayaran</span>
          </h3>

          <div className="space-y-3">
            {/* Cash */}
            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-black text-xs">
                  💵
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">Tunai (Cash)</span>
                  <span className="text-[10px] text-slate-500 font-bold">Laci Kasir</span>
                </div>
              </div>
              <span className="text-sm font-black text-slate-900">{formatRupiah(cashSales)}</span>
            </div>

            {/* QRIS */}
            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-black text-xs">
                  📱
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">QRIS / Digital Wallet</span>
                  <span className="text-[10px] text-slate-500 font-bold">Settlement H+1</span>
                </div>
              </div>
              <span className="text-sm font-black text-slate-900">{formatRupiah(qrisSales)}</span>
            </div>

            {/* Card / Transfer */}
            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-black text-xs">
                  💳
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">Transfer / EDC Bank</span>
                  <span className="text-[10px] text-slate-500 font-bold">Rekening Toko</span>
                </div>
              </div>
              <span className="text-sm font-black text-slate-900">{formatRupiah(cardSales)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Top 5 Best Selling Products */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-red-600" />
            <span>Top 5 Produk Terlaris (Best Sellers)</span>
          </h3>
          <span className="text-xs text-slate-500 font-bold">Berdasarkan Total Qty Terjual</span>
        </div>

        <div className="divide-y divide-slate-100">
          {topProducts.map((p, idx) => {
            const itemMargin = p.revenue > 0 ? Math.round(((p.revenue - (p.cost * p.qty)) / p.revenue) * 100) : 0;

            return (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </div>
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">{p.name}</span>
                    <span className="text-[10px] text-slate-500 font-bold">{p.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">{p.qty} Porsi Terjual</span>
                    <span className="text-[10px] font-bold text-emerald-600">Margin +{itemMargin}%</span>
                  </div>
                  <span className="text-sm font-black text-red-600 min-w-[90px]">{formatRupiah(p.revenue)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
