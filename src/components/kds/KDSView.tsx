import React from 'react';
import { usePOS } from '../../context/POSContext';
import type { OrderStatus } from '../../types/pos';
import { formatRupiah } from '../../utils/formatters';
import { ChefHat, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const KDSView: React.FC = () => {
  const { orders, currentEntityId, updateOrderStatus } = usePOS();

  const activeOrders = orders.filter(o => o.entityId === currentEntityId && o.status !== 'Completed' && o.status !== 'Cancelled');

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
      case 'Preparing':
        return <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded text-[10px] font-black uppercase">Menunggu Dibuat</span>;
      case 'Ready':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-black uppercase">Siap Disajikan</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-6 overflow-y-auto font-sans select-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-red-600" />
            <span>Kitchen & Bar Display System (KDS)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Layar pantau antrean pesanan masuk dapur / barista secara real-time.</p>
        </div>

        <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-black text-red-600">
          {activeOrders.length} Pesanan Aktif
        </div>
      </div>

      {activeOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeOrders.map(order => (
            <div 
              key={order.id}
              className={`bg-white border rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all ${
                order.status === 'Preparing' ? 'border-red-600' : 'border-slate-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <span className="font-mono font-black text-slate-900 text-xs">{order.orderNumber}</span>
                    <p className="text-[10px] text-slate-400 font-bold">{order.orderType} {order.tableNumber ? `(${order.tableNumber})` : ''}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900">{order.customerName}</span>
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-red-600" />
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="divide-y divide-slate-100 pt-1">
                  {order.items.map(item => (
                    <div key={item.id} className="py-2 space-y-0.5">
                      <div className="flex justify-between items-start text-xs">
                        <span className="font-extrabold text-slate-900 flex-1">{item.quantity}x {item.product.name}</span>
                        <span className="font-extrabold text-slate-500">{formatRupiah(item.totalPrice)}</span>
                      </div>

                      {item.selectedVariants && item.selectedVariants.length > 0 && (
                        <div className="text-[10px] text-red-600 font-bold pl-3">
                          {item.selectedVariants.map(v => v.optionName).join(' · ')}
                        </div>
                      )}

                      {item.notes && (
                        <div className="text-[10px] italic text-rose-600 font-bold pl-3">
                          "{item.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                {order.status === 'Preparing' || order.status === 'Pending' ? (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Ready')}
                    className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
                    style={{ outline: 'none', border: 'none' }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tandai Siap Disajikan</span>
                  </button>
                ) : (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Completed')}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
                    style={{ outline: 'none', border: 'none' }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Selesaikan Pesanan</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
          <ChefHat className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-sm font-extrabold text-slate-500">Tidak ada antrean pesanan di dapur saat ini.</p>
        </div>
      )}
    </div>
  );
};
