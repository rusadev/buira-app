import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import type { OrderStatus, Order } from '../../types/pos';
import { formatRupiah } from '../../utils/formatters';
import { 
  ChefHat, 
  CheckCircle2, 
  Clock, 
  Flame, 
  BellRing, 
  CheckCheck, 
  Utensils, 
  ShoppingBag,
  Filter
} from 'lucide-react';

export const KDSView: React.FC = () => {
  const { orders, currentEntityId, updateOrderStatus } = usePOS();
  const [filterType, setFilterType] = useState<'ALL' | 'Dine-In' | 'Takeaway'>('ALL');

  const entityOrders = orders.filter(o => o.entityId === currentEntityId);

  // Filter orders by status
  const pendingOrders = entityOrders.filter(o => 
    (o.status === 'Pending' || o.status === 'Preparing') && 
    (filterType === 'ALL' || o.orderType === filterType)
  );

  const readyOrders = entityOrders.filter(o => 
    o.status === 'Ready' && 
    (filterType === 'ALL' || o.orderType === filterType)
  );

  const completedOrders = entityOrders
    .filter(o => o.status === 'Completed' && (filterType === 'ALL' || o.orderType === filterType))
    .slice(-6)
    .reverse();

  const getElapsedTime = (dateString: string) => {
    const elapsedMinutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
    if (elapsedMinutes < 1) return 'Baru saja';
    return `${elapsedMinutes} menit lalu`;
  };

  const renderKanbanCard = (order: Order, column: 'pending' | 'ready' | 'completed') => {
    const elapsedMinutes = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
    const isUrgent = elapsedMinutes >= 10 && column === 'pending';

    return (
      <div 
        key={order.id}
        className={`bg-white rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all border ${
          isUrgent 
            ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20' 
            : column === 'pending'
              ? 'border-red-200 hover:border-red-300'
              : column === 'ready'
                ? 'border-emerald-200 hover:border-emerald-300'
                : 'border-slate-200 opacity-80'
        }`}
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      >
        <div className="space-y-2.5">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <span className="font-mono font-black text-slate-900 text-xs tracking-wider">{order.orderNumber}</span>
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-slate-600">
                {order.orderType === 'Dine-In' ? <Utensils className="w-3 h-3 text-red-600" /> : <ShoppingBag className="w-3 h-3 text-red-600" />}
                <span>{order.orderType}</span>
                {order.tableNumber && <span className="text-red-600">({order.tableNumber})</span>}
              </div>
            </div>

            <div className="text-right">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                isUrgent 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                <Clock className="w-2.5 h-2.5" />
                {getElapsedTime(order.createdAt)}
              </span>
            </div>
          </div>

          {/* Customer Name */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-slate-900">{order.customerName}</span>
            <span className="text-[10px] text-slate-400 font-extrabold">
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Order Items List */}
          <div className="divide-y divide-slate-100 pt-1 space-y-1">
            {order.items.map(item => (
              <div key={item.id} className="pt-1.5 first:pt-0 space-y-0.5">
                <div className="flex justify-between items-start text-xs">
                  <span className="font-black text-slate-900 flex-1">
                    <strong className="text-red-600 font-black mr-1.5">{item.quantity}x</strong>
                    {item.product.name}
                  </span>
                  <span className="font-extrabold text-slate-400 text-[11px]">{formatRupiah(item.totalPrice)}</span>
                </div>

                {item.selectedVariants && item.selectedVariants.length > 0 && (
                  <div className="text-[10px] text-red-600 font-extrabold pl-4">
                    {item.selectedVariants.map(v => v.optionName).join(' · ')}
                  </div>
                )}

                {item.notes && (
                  <div className="text-[10px] italic text-red-700 bg-red-50 p-1 rounded font-bold pl-2 border border-red-100">
                    Catatan: "{item.notes}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Card Action Buttons */}
        <div className="pt-2 border-t border-slate-100">
          {column === 'pending' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'Ready')}
              className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5"
              style={{ outline: 'none', border: 'none' }}
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Selesai Dimasak → Siap Disajikan</span>
            </button>
          )}

          {column === 'ready' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'Completed')}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5"
              style={{ outline: 'none', border: 'none' }}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tandai Selesai Diantar</span>
            </button>
          )}

          {column === 'completed' && (
            <div className="text-center py-1 text-[11px] font-extrabold text-slate-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pesanan Selesai</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-100/70 p-6 space-y-5 overflow-y-auto font-sans select-none">
      
      {/* KDS Header & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-red-600" />
            <span>Kitchen & Bar Kanban Board (KDS)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Layar pantau alur persiapan antrean dapur & barista secara real-time.</p>
        </div>

        {/* Filter Type Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              filterType === 'ALL' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            style={{ outline: 'none' }}
          >
            Semua ({pendingOrders.length + readyOrders.length})
          </button>
          <button
            onClick={() => setFilterType('Dine-In')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              filterType === 'Dine-In' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            style={{ outline: 'none' }}
          >
            Dine-In
          </button>
          <button
            onClick={() => setFilterType('Takeaway')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              filterType === 'Takeaway' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            style={{ outline: 'none' }}
          >
            Takeaway
          </button>
        </div>
      </div>

      {/* ── KANBAN BOARD 3 COLUMNS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">

        {/* COLUMN 1: PROSES DAPUR (PENDING & PREPARING) */}
        <div className="bg-slate-200/60 rounded-2xl p-4 space-y-3 border border-slate-300/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                1. Proses Dapur / Barista
              </h3>
            </div>
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {pendingOrders.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[72vh] overflow-y-auto pr-1">
            {pendingOrders.length > 0 ? (
              pendingOrders.map(order => renderKanbanCard(order, 'pending'))
            ) : (
              <div className="bg-white/60 rounded-xl p-8 text-center text-xs font-bold text-slate-400 border border-dashed border-slate-300">
                Tidak ada pesanan dimasak.
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 2: SIAP DISAJIKAN (READY) */}
        <div className="bg-emerald-100/50 rounded-2xl p-4 space-y-3 border border-emerald-200/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900">
                2. Siap Disajikan / Antar
              </h3>
            </div>
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[72vh] overflow-y-auto pr-1">
            {readyOrders.length > 0 ? (
              readyOrders.map(order => renderKanbanCard(order, 'ready'))
            ) : (
              <div className="bg-white/60 rounded-xl p-8 text-center text-xs font-bold text-emerald-700/50 border border-dashed border-emerald-200">
                Belum ada pesanan siap diantar.
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: SELESAI (COMPLETED TODAY) */}
        <div className="bg-slate-200/40 rounded-2xl p-4 space-y-3 border border-slate-300/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                3. Selesai (Terbaru Hari Ini)
              </h3>
            </div>
            <span className="bg-slate-700 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {completedOrders.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[72vh] overflow-y-auto pr-1">
            {completedOrders.length > 0 ? (
              completedOrders.map(order => renderKanbanCard(order, 'completed'))
            ) : (
              <div className="bg-white/60 rounded-xl p-8 text-center text-xs font-bold text-slate-400 border border-dashed border-slate-300">
                Belum ada pesanan selesai.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
