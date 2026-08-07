import React from 'react';
import { usePOS } from '../../context/POSContext';
import type { OrderType } from '../../types/pos';
import { formatRupiah } from '../../utils/formatters';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  User, 
  Utensils, 
  ShoppingBag as TakeawayIcon,
  Tag, 
  CreditCard 
} from 'lucide-react';

interface CartSidebarProps {
  onOpenPaymentModal: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ onOpenPaymentModal }) => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    orderType,
    setOrderType,
    selectedTableNumber,
    setSelectedTableNumber,
    customerName,
    setCustomerName,
    discountPercentage,
    setDiscountPercentage,
    currentEntity,
    tables
  } = usePOS();

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = Math.round(subtotalAfterDiscount * currentEntity.taxRate);
  const serviceAmount = Math.round(subtotalAfterDiscount * currentEntity.serviceRate);
  const grandTotal = subtotalAfterDiscount + taxAmount + serviceAmount;

  const entityTables = tables.filter(t => t.entityId === currentEntity.id);
  const totalItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const orderTypes: { id: OrderType; label: string; icon: React.ReactNode }[] = [
    { id: 'Dine-In', label: 'Dine-In', icon: <Utensils className="w-3.5 h-3.5" /> },
    { id: 'Takeaway', label: 'Takeaway', icon: <TakeawayIcon className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full sm:w-[50vw] lg:w-[48vw] xl:w-[46vw] min-w-[440px] max-w-[620px] bg-white border-l border-slate-100 flex flex-col shrink-0 h-[calc(100vh-57px)] max-h-[calc(100vh-57px)] overflow-hidden font-sans select-none">

      {/* ── Header ── */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-red-600" />
          <h3 className="text-sm font-extrabold text-slate-900">
            Pesanan {totalItemCount > 0 && <span className="text-red-600">({totalItemCount})</span>}
          </h3>
        </div>
        {cart.length > 0 && (
          <button onClick={clearCart} className="text-[11px] text-slate-400 hover:text-red-600 flex items-center gap-1 font-bold transition-colors">
            <X className="w-3.5 h-3.5" />
            Hapus Semua
          </button>
        )}
      </div>

      {/* ── Order Type & Customer ── */}
      <div className="px-4 py-3 border-b border-slate-100 space-y-2.5 shrink-0 bg-slate-50/60">
        {/* Dine-In / Takeaway toggle */}
        <div className="flex gap-2">
          {orderTypes.map(type => {
            const isActive = orderType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setOrderType(type.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all"
                style={{
                  outline: 'none',
                  border: '1.5px solid',
                  borderColor: isActive ? '#dc2626' : '#e2e8f0',
                  background: isActive ? '#dc2626' : '#ffffff',
                  color: isActive ? '#ffffff' : '#64748b',
                }}
              >
                {type.icon}
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Customer Name & Table */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Nama pelanggan..."
              className="w-full bg-white rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-slate-800 placeholder:text-slate-400"
              style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
            />
          </div>
          {orderType === 'Dine-In' ? (
            <select
              value={selectedTableNumber}
              onChange={e => setSelectedTableNumber(e.target.value)}
              className="bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
              style={{ outline: 'none', border: '1.5px solid #e2e8f0', minWidth: '110px' }}
            >
              <option value="">Pilih Meja</option>
              {entityTables.map(t => (
                <option key={t.id} value={t.tableNumber}>
                  {t.tableNumber}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center justify-center bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-400" style={{ border: '1.5px solid #e2e8f0', minWidth: '110px' }}>
              Tanpa Meja
            </div>
          )}
        </div>
      </div>

      {/* ── Scrollable Items ── */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5">
        {cart.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {cart.map(item => {
              const variantSummary = item.selectedVariants?.map(v => v.optionName).join(' · ');
              return (
                <div key={item.id} className="py-3.5 flex flex-col gap-1">

                  {/* Row 1: name + X */}
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-extrabold text-slate-900 leading-snug flex-1">{item.product.name}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-5 h-5 rounded flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors shrink-0 mt-0.5"
                      style={{ outline: 'none', border: 'none', background: 'transparent' }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Variant — clean plain text, no box/border */}
                  {variantSummary && (
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {variantSummary}
                    </p>
                  )}

                  {/* Notes — also clean */}
                  {item.notes && (
                    <p className="text-xs italic text-slate-500 font-medium">
                      "{item.notes}"
                    </p>
                  )}

                  {/* Row 2: stepper LEFT + total RIGHT */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg" style={{ border: '1px solid #e2e8f0' }}>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
                        style={{ outline: 'none', border: 'none' }}
                      >
                        <Minus className="w-3 h-3 stroke-[3]" />
                      </button>
                      <span className="w-6 text-center text-xs font-black text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
                        style={{ outline: 'none', border: 'none' }}
                      >
                        <Plus className="w-3 h-3 stroke-[3]" />
                      </button>
                    </div>
                    <span className="text-sm font-black text-slate-900">{formatRupiah(item.totalPrice)}</span>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-2 py-16 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-200" strokeWidth={1.5} />
            <p className="text-sm font-bold text-slate-400">Belum ada pesanan</p>
          </div>
        )}
      </div>

      {/* ── Pinned Bottom ── */}
      <div className="px-5 pt-3.5 pb-4 border-t border-slate-100 bg-white space-y-3 shrink-0">
        {/* Discount row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Tag className="w-3.5 h-3.5 text-red-600" />
            Diskon
          </div>
          <div className="flex items-center gap-1">
            {[0, 5, 10, 15, 20].map(d => (
              <button
                key={d}
                onClick={() => setDiscountPercentage(d)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
                style={{
                  outline: 'none',
                  border: '1.5px solid',
                  borderColor: discountPercentage === d ? '#dc2626' : '#e2e8f0',
                  background: discountPercentage === d ? '#dc2626' : '#ffffff',
                  color: discountPercentage === d ? '#ffffff' : '#64748b',
                }}
              >
                {d}%
              </button>
            ))}
          </div>
        </div>

        {/* Calculations */}
        <div className="space-y-1 text-xs font-medium text-slate-500">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-slate-800">{formatRupiah(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Diskon {discountPercentage}%</span>
              <span>−{formatRupiah(discountAmount)}</span>
            </div>
          )}
          {taxAmount > 0 && (
            <div className="flex justify-between">
              <span>Pajak PB1 ({currentEntity.taxRate * 100}%)</span>
              <span>{formatRupiah(taxAmount)}</span>
            </div>
          )}
          {serviceAmount > 0 && (
            <div className="flex justify-between">
              <span>Service ({currentEntity.serviceRate * 100}%)</span>
              <span>{formatRupiah(serviceAmount)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wide">Total</span>
            <span className="text-2xl font-black text-red-600">{formatRupiah(grandTotal)}</span>
          </div>
        </div>

        {/* Pay Button */}
        <button
          disabled={cart.length === 0}
          onClick={onOpenPaymentModal}
          className="w-full py-4 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all"
          style={{
            outline: 'none',
            border: 'none',
            background: cart.length > 0 ? '#dc2626' : '#e2e8f0',
            color: cart.length > 0 ? '#ffffff' : '#94a3b8',
            cursor: cart.length > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          <CreditCard className="w-4 h-4" />
          Bayar {cart.length > 0 && formatRupiah(grandTotal)}
        </button>
      </div>
    </div>
  );
};
