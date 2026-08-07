import React from 'react';
import { usePOS } from '../../context/POSContext';
import type { OrderStatus } from '../../types/pos';
import { formatDate } from '../../utils/formatters';
import { ChefHat, Clock, ArrowRight } from 'lucide-react';

export const KDSView: React.FC = () => {
  const { orders, currentEntityId, updateOrderStatus } = usePOS();

  const entityOrders = orders.filter(o => 
    o.entityId === currentEntityId && 
    o.status !== 'Served' && 
    o.status !== 'Completed' && 
    o.status !== 'Cancelled'
  );

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">Menunggu</span>;
      case 'Preparing':
        return <span className="bg-sky-100 text-sky-800 border border-sky-300 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">Sedang Dimasak / Dibuat</span>;
      case 'Ready':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">SIAP DISAJIKAN</span>;
      default:
        return null;
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus => {
    if (currentStatus === 'Pending') return 'Preparing';
    if (currentStatus === 'Preparing') return 'Ready';
    if (currentStatus === 'Ready') return 'Served';
    return 'Served';
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-5 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-amber-600" />
            <span>Kitchen Display System (KDS - {currentEntityId === 'coffee_shop' ? 'Barista Bar' : 'Dapur Resto'})</span>
          </h2>
          <p className="text-xs text-slate-500">Layar antrean real-time untuk tim {currentEntityId === 'coffee_shop' ? 'Barista' : 'Dapur'}.</p>
        </div>
        <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700">
          {entityOrders.length} Antrean Aktif
        </div>
      </div>

      {/* Orders Grid */}
      {entityOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entityOrders.map(order => (
            <div 
              key={order.id} 
              className={`bg-white border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                order.status === 'Ready' 
                  ? 'border-emerald-500' 
                  : order.status === 'Preparing'
                    ? 'border-sky-500'
                    : 'border-slate-200'
              }`}
            >
              {/* Header Card */}
              <div className="space-y-2 pb-3 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-extrabold text-slate-900">{order.orderNumber}</span>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-800">{order.customerName}</span>
                  <span className="text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {order.orderType} {order.tableNumber ? `(${order.tableNumber})` : ''}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>Dibuat: {formatDate(order.createdAt)}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="py-3 space-y-2 flex-1 max-h-48 overflow-y-auto">
                {order.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-2 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-900">
                      <span>{item.quantity}x {item.product.name}</span>
                    </div>
                    {item.selectedVariants && item.selectedVariants.length > 0 && (
                      <div className="text-[10px] text-amber-800 font-semibold">
                        {item.selectedVariants.map(v => `${v.groupName}: ${v.optionName}`).join(', ')}
                      </div>
                    )}
                    {item.notes && (
                      <div className="text-[10px] text-rose-700 italic font-bold">
                        Catatan: "{item.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-200">
                <button
                  onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    order.status === 'Pending'
                      ? 'bg-sky-600 hover:bg-sky-700 text-white'
                      : order.status === 'Preparing'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  {order.status === 'Pending' && <span>Mulai Masak / Buat Minuman</span>}
                  {order.status === 'Preparing' && <span>Tandai SIAP DISAJIKAN</span>}
                  {order.status === 'Ready' && <span>Tandai Selesai (Disajikan ke Meja)</span>}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-slate-400 space-y-2 bg-white border border-slate-200 rounded-2xl">
          <ChefHat className="w-12 h-12 stroke-1 text-slate-300" />
          <p className="text-xs font-bold text-slate-700">Tidak ada antrean masakan/minuman aktif saat ini.</p>
        </div>
      )}
    </div>
  );
};
