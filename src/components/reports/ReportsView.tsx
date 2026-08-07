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
  Percent,
  Receipt,
  Printer,
  UtensilsCrossed,
  FileSpreadsheet,
  Clock,
  UserCheck,
  Package,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';

type ReportTab = 'summary' | 'products' | 'staff' | 'hourly';

export const ReportsView: React.FC = () => {
  const { orders, currentEntityId, currentEntity, products, users } = usePOS();
  const [activeReportTab, setActiveReportTab] = useState<ReportTab>('summary');
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
  const estimatedNetProfit = grossProfit; // Net Profit before operating expenses

  // Payment Breakdown
  const cashSales = successOrders.filter(o => o.paymentMethod === 'Cash').reduce((sum, o) => sum + o.grandTotal, 0);
  const qrisSales = successOrders.filter(o => o.paymentMethod === 'QRIS' || o.paymentMethod === 'E-Wallet').reduce((sum, o) => sum + o.grandTotal, 0);
  const cardSales = successOrders.filter(o => o.paymentMethod === 'Debit' || o.paymentMethod === 'Credit' || o.paymentMethod === 'Debit / EDC').reduce((sum, o) => sum + o.grandTotal, 0);

  // Channel Breakdown
  const dineInCount = successOrders.filter(o => o.orderType === 'Dine-In').length;
  const takeawayCount = successOrders.filter(o => o.orderType === 'Takeaway').length;
  const deliveryCount = successOrders.filter(o => o.orderType === 'Delivery').length;

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

  const allProductReport = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue);
  const topProducts = allProductReport.slice(0, 5);

  // Staff Performance Breakdown
  const staffSalesMap: Record<string, { name: string; ordersCount: number; totalSales: number; cashSales: number; qrisSales: number; voidCount: number }> = {};

  entityOrders.forEach(o => {
    const cashier = o.cashierName || 'Kasir';
    if (!staffSalesMap[cashier]) {
      staffSalesMap[cashier] = {
        name: cashier,
        ordersCount: 0,
        totalSales: 0,
        cashSales: 0,
        qrisSales: 0,
        voidCount: 0
      };
    }

    if (o.status === 'Cancelled') {
      staffSalesMap[cashier].voidCount += 1;
    } else {
      staffSalesMap[cashier].ordersCount += 1;
      staffSalesMap[cashier].totalSales += o.grandTotal;
      if (o.paymentMethod === 'Cash') staffSalesMap[cashier].cashSales += o.grandTotal;
      else staffSalesMap[cashier].qrisSales += o.grandTotal;
    }
  });

  const staffReport = Object.values(staffSalesMap).sort((a, b) => b.totalSales - a.totalSales);

  // Hourly Sales Breakdown (Peak Hours)
  const hourlySalesMap: Record<number, { hourLabel: string; ordersCount: number; revenue: number }> = {};
  for (let h = 0; h < 24; h++) {
    hourlySalesMap[h] = {
      hourLabel: `${String(h).padStart(2, '0')}:00 - ${String((h + 1) % 24).padStart(2, '0')}:00`,
      ordersCount: 0,
      revenue: 0
    };
  }

  successOrders.forEach(o => {
    const d = new Date(o.createdAt);
    if (!isNaN(d.getTime())) {
      const hour = d.getHours();
      hourlySalesMap[hour].ordersCount += 1;
      hourlySalesMap[hour].revenue += o.grandTotal;
    }
  });

  const activeHourlyReport = Object.values(hourlySalesMap).filter(h => h.ordersCount > 0);

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
    link.setAttribute('download', `Laporan_Enterprise_${currentEntity.name.replace(/\s+/g, '_')}_${datePeriod}_${new Date().toISOString().split('T')[0]}.csv`);
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
            <span>Dashboard Laporan Keuangan Enterprise ({currentEntity.name})</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Laporan Laba Rugi (P&L), margin HPP produk, performa staf kasir, audit jam sibuk, & ekspor spreadsheet.</p>
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

      {/* Primary Financial KPI Summary Cards */}
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

        {/* Laba Kotor & HPP */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600">Estimasi Laba Kotor</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{formatRupiah(Math.max(0, grossProfit))}</div>
          <div className="text-[10px] text-slate-500 font-medium">Modal HPP Bahan: {formatRupiah(totalHPP)}</div>
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
          <div className="text-[10px] text-slate-500 font-medium">Total Struk: {totalTransactionsCount} Lunas / {voidOrders.length} Void</div>
        </div>

        {/* Diskon & Pajak PB1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600">Pajak PB1 & Diskon</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">{formatRupiah(totalTax)}</div>
          <div className="text-[10px] text-rose-600 font-bold">Diskon Promo Diberikan: {formatRupiah(totalDiscount)}</div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveReportTab('summary')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeReportTab === 'summary'
              ? 'bg-red-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
          style={{ outline: 'none' }}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Laporan Laba Rugi (P&L)</span>
        </button>

        <button
          onClick={() => setActiveReportTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeReportTab === 'products'
              ? 'bg-red-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
          style={{ outline: 'none' }}
        >
          <Package className="w-4 h-4" />
          <span>Margin HPP Produk ({allProductReport.length})</span>
        </button>

        <button
          onClick={() => setActiveReportTab('staff')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeReportTab === 'staff'
              ? 'bg-red-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
          style={{ outline: 'none' }}
        >
          <UserCheck className="w-4 h-4" />
          <span>Performa Staf Kasir ({staffReport.length})</span>
        </button>

        <button
          onClick={() => setActiveReportTab('hourly')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeReportTab === 'hourly'
              ? 'bg-red-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
          style={{ outline: 'none' }}
        >
          <Clock className="w-4 h-4" />
          <span>Audit Jam Sibuk (Peak Hours)</span>
        </button>
      </div>

      {/* TAB 1: EXECUTIVE FINANCIAL P&L SUMMARY */}
      {activeReportTab === 'summary' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* P&L Statement Card (2 cols) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-red-600" />
                  <span>Laporan Laba Rugi (Income Statement P&L)</span>
                </h3>
                <span className="text-[11px] bg-red-50 text-red-700 font-extrabold px-2.5 py-0.5 rounded-md border border-red-200">
                  {datePeriod}
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs font-bold space-y-2">
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-700">1. Total Penjualan Kotor (Gross Revenue)</span>
                  <span className="text-slate-900 font-black">{formatRupiah(totalSubtotal)}</span>
                </div>

                <div className="flex justify-between py-1.5 text-rose-600">
                  <span>2. Total Diskon & Promo Given (-)</span>
                  <span className="font-black">-{formatRupiah(totalDiscount)}</span>
                </div>

                <div className="flex justify-between py-1.5 text-slate-900 bg-slate-50 p-2 rounded-xl">
                  <span className="font-black">3. Penjualan Bersih (Net Revenue)</span>
                  <span className="font-black text-slate-900">{formatRupiah(netRevenue)}</span>
                </div>

                <div className="flex justify-between py-1.5 text-slate-600">
                  <span>4. Modal HPP Bahan Baku (COGS) (-)</span>
                  <span className="font-black">-{formatRupiah(totalHPP)}</span>
                </div>

                <div className="flex justify-between py-2 text-emerald-700 bg-emerald-50 p-2.5 rounded-xl text-sm font-black border border-emerald-200">
                  <span>5. Estimasi Laba Kotor (Gross Profit)</span>
                  <span>{formatRupiah(Math.max(0, grossProfit))}</span>
                </div>

                <div className="flex justify-between py-1.5 text-slate-600">
                  <span>6. Pajak Resto PB1 (10%) Collected</span>
                  <span className="font-black">+{formatRupiah(totalTax)}</span>
                </div>
              </div>
            </div>

            {/* Payment & Channel Card (1 col) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-red-600" />
                  <span>Breakdown Pembayaran</span>
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between text-xs font-extrabold">
                    <span className="text-slate-800">Uang Tunai (Cash)</span>
                    <span className="text-red-600">{formatRupiah(cashSales)}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-600 h-full" style={{ width: `${totalOmset > 0 ? (cashSales / totalOmset) * 100 : 0}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between text-xs font-extrabold">
                    <span className="text-slate-800">QRIS / E-Wallet</span>
                    <span className="text-emerald-600">{formatRupiah(qrisSales)}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: `${totalOmset > 0 ? (qrisSales / totalOmset) * 100 : 0}%` }} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between text-xs font-extrabold">
                    <span className="text-slate-800">Debit / Kredit EDC</span>
                    <span className="text-slate-800">{formatRupiah(cardSales)}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-slate-700 h-full" style={{ width: `${totalOmset > 0 ? (cardSales / totalOmset) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT SALES & HPP MARGIN BREAKDOWN */}
      {activeReportTab === 'products' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-red-600" />
              <span>Rincian Omset & Margin Laba Bersih per Produk ({allProductReport.length} Item)</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Nama Produk</th>
                  <th className="p-3.5">Kategori</th>
                  <th className="p-3.5">Porsi Terjual</th>
                  <th className="p-3.5">Modal HPP per Unit</th>
                  <th className="p-3.5">Total HPP Modal</th>
                  <th className="p-3.5">Total Omset Kotor</th>
                  <th className="p-3.5">Margin Laba (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allProductReport.length > 0 ? (
                  allProductReport.map((p, idx) => {
                    const totalCost = p.cost * p.qty;
                    const profitMargin = p.revenue - totalCost;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" />
                            <span className="font-extrabold text-slate-900">{p.name}</span>
                          </div>
                        </td>

                        <td className="p-3.5 font-bold text-red-600">{p.category}</td>

                        <td className="p-3.5 font-black text-slate-900">{p.qty} Porsi</td>

                        <td className="p-3.5 font-bold text-slate-600">{formatRupiah(p.cost)}</td>

                        <td className="p-3.5 font-bold text-slate-600">{formatRupiah(totalCost)}</td>

                        <td className="p-3.5 font-black text-slate-900">{formatRupiah(p.revenue)}</td>

                        <td className="p-3.5 font-black text-emerald-600">
                          +{formatRupiah(Math.max(0, profitMargin))}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">
                      Belum ada data produk terjual pada periode ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: STAFF PERFORMANCE REPORT */}
      {activeReportTab === 'staff' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-red-600" />
              <span>Audit Performa Penjualan & Kas Laci Staf Kasir ({staffReport.length} Staf)</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Nama Petugas Kasir</th>
                  <th className="p-3.5">Transaksi Lunas</th>
                  <th className="p-3.5">Penjualan Tunai (Cash)</th>
                  <th className="p-3.5">Penjualan Non-Tunai (QRIS)</th>
                  <th className="p-3.5">Total Omset Staf</th>
                  <th className="p-3.5">Jumlah Void</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffReport.length > 0 ? (
                  staffReport.map((staff, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-extrabold text-slate-900">
                        {staff.name}
                      </td>

                      <td className="p-3.5 font-black text-slate-900">{staff.ordersCount} Struk</td>

                      <td className="p-3.5 font-bold text-red-600">{formatRupiah(staff.cashSales)}</td>

                      <td className="p-3.5 font-bold text-emerald-600">{formatRupiah(staff.qrisSales)}</td>

                      <td className="p-3.5 font-black text-slate-900">{formatRupiah(staff.totalSales)}</td>

                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          staff.voidCount > 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {staff.voidCount} Void
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                      Belum ada data aktivitas staf pada periode ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: HOURLY PEAK HOURS AUDIT */}
      {activeReportTab === 'hourly' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-600" />
              <span>Audit Jam Sibuk Resto (Hourly Peak Hours Heatmap)</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Rentang Waktu Jam</th>
                  <th className="p-3.5">Jumlah Transaksi Masuk</th>
                  <th className="p-3.5">Total Omset dalam Jam Ini</th>
                  <th className="p-3.5">Rata-rata Basket per Transaksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeHourlyReport.length > 0 ? (
                  activeHourlyReport.map((h, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-mono font-extrabold text-slate-900">{h.hourLabel}</td>
                      <td className="p-3.5 font-black text-slate-900">{h.ordersCount} Pesanan</td>
                      <td className="p-3.5 font-black text-red-600">{formatRupiah(h.revenue)}</td>
                      <td className="p-3.5 font-bold text-slate-700">
                        {formatRupiah(h.ordersCount > 0 ? Math.round(h.revenue / h.ordersCount) : 0)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 font-bold">
                      Belum ada aktivitas transaksi pada jam ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
