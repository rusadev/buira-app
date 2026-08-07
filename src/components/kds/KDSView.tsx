import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import type { Order } from '../../types/pos';
import { formatRupiah } from '../../utils/formatters';
import { ChefHat, Clock, Check, Utensils, ShoppingBag } from 'lucide-react';

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
    return `${elapsedMinutes}m lalu`;
  };

  const renderKanbanCard = (order: Order, column: 'pending' | 'ready' | 'completed') => {
    const elapsedMinutes = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
    const isLate = elapsedMinutes >= 10 && column === 'pending';

    return (
      <div 
        key={order.id}
        className={`bg-white rounded-xl p-3.5 flex flex-col justify-between space-y-3 border ${
          isLate 
            ? 'border-red-400 bg-red-50/30' 
            : 'border-slate-200'
        }`}
      >
        <div className="space-y-2">
          {/* Header Baris 1: Nomor Pesanan & Waktu */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-black text-slate-900">{order.orderNumber}</span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                {order.orderType} {order.tableNumber ? `(${order.tableNumber})` : ''}
              </span>
            </div>
            <span className={`text-[10px] font-extrabold ${isLate ? 'text-red-600' : 'text-slate-400'}`}>
              {getElapsedTime(order.createdAt)}
            </span>
          </div>

          {/* Nama Pelanggan */}
          <div className="text-xs font-black text-slate-900">
            {order.customerName}
          </div>

          {/* Daftar Item Pesanan */}
          <div className="space-y-1.5 pt-1">
            {order.items.map(item => (
              <div key={item.id} className="text-xs space-y-0.5">
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-slate-900 flex-1">
                    <strong className="text-red-600 mr-1">{item.quantity}x</strong>
                    {item.product.name}
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold">{formatRupiah(item.totalPrice)}</span>
                </div>

                {item.selectedVariants && item.selectedVariants.length > 0 && (
                  <p className="text-[10px] text-red-600 font-bold pl-3">
                    {item.selectedVariants.map(v => v.optionName).join(' · ')}
                  </p>
                )}

                {item.notes && (
                  <p className="text-[10px] text-slate-500 italic bg-slate-50 p-1 rounded border border-slate-100 pl-2">
                    Catatan: {item.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="pt-2 border-t border-slate-100">
          {column === 'pending' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'Ready')}
              className="w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition-colors"
              style={{ outline: 'none', border: 'none' }}
            >
              Siap Disajikan →
            </button>
          )}

          {column === 'ready' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'Completed')}
              className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors"
              style={{ outline: 'none', border: 'none' }}
            >
              Selesai Diantar ✓
            </button>
          )}

          {column === 'completed' && (
            <div className="text-center text-[11px] font-extrabold text-slate-400 py-0.5">
              Selesai
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-4 overflow-y-auto font-sans select-none">
      
      {/* Header Simpel */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-red-600" />
          <h2 className="text-sm font-extrabold text-slate-900">Kitchen Display Board</h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-colors ${
              filterType === 'ALL' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            style={{ outline: 'none' }}
          >
            Semua ({pendingOrders.length + readyOrders.length})
          </button>
          <button
            onClick={() => setFilterType('Dine-In')}
            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-colors ${
              filterType === 'Dine-In' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            style={{ outline: 'none' }}
          >
            Dine-In
          </button>
          <button
            onClick={() => setFilterType('Takeaway')}
            className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-colors ${
              filterType === 'Takeaway' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            style={{ outline: 'none' }}
          >
            Takeaway
          </button>
        </div>
      </div>

      {/* 3 Kolom Kanban Clean */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">

        {/* Kolom 1: Antrean Dapur */}
        <div className="bg-slate-100/80 rounded-2xl p-3 space-y-3 border border-slate-200">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-extrabold text-slate-700">1. Antrean Dapur</h3>
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {pendingOrders.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[75vh] overflow-y-auto">
            {pendingOrders.length > 0 ? (
              pendingOrders.map(order => renderKanbanCard(order, 'pending'))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 font-bold bg-white rounded-xl border border-slate-200">
                Tidak ada antrean.
              </div>
            )}
          </div>
        </div>

        {/* Kolom 2: Siap Disajikan */}
        <div className="bg-slate-100/80 rounded-2xl p-3 space-y-3 border border-slate-200">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-extrabold text-slate-700">2. Siap Disajikan</h3>
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[75vh] overflow-y-auto">
            {readyOrders.length > 0 ? (
              readyOrders.map(order => renderKanbanCard(order, 'ready'))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 font-bold bg-white rounded-xl border border-slate-200">
                Belum ada pesanan siap.
              </div>
            )}
          </div>
        </div>

        {/* Kolom 3: Selesai */}
        <div className="bg-slate-100/80 rounded-2xl p-3 space-y-3 border border-slate-200">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-extrabold text-slate-700">3. Selesai (Hari Ini)</h3>
            <span className="bg-slate-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {completedOrders.length}
            </span>
          </div>

          <div className="space-y-3 max-h-[75vh] overflow-y-auto">
            {completedOrders.length > 0 ? (
              completedOrders.map(order => renderKanbanCard(order, 'completed'))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 font-bold bg-white rounded-xl border border-slate-200">
                Belum ada pesanan selesai.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
