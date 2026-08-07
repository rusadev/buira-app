import React from 'react';
import { usePOS } from '../../context/POSContext';
import type { OrderType } from '../../types/pos';
import { formatRupiah } from '../../utils/formatters';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  User, 
  Utensils, 
  ShoppingBag as TakeawayIcon, 
  Smartphone, 
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

  return (
    <div className="w-full sm:w-[45vw] md:w-[45vw] lg:w-[42vw] xl:w-[42vw] min-w-[420px] max-w-[580px] bg-white border-l border-slate-200 flex flex-col shrink-0 h-[calc(100vh-57px)] max-h-[calc(100vh-57px)] overflow-hidden font-sans select-none">
      {/* 1. Fixed Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2.5">
          <ShoppingBag className="w-4 h-4 text-red-600" />
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
            Daftar Pesanan {totalItemCount > 0 && `(${totalItemCount} Menu)`}
          </h3>
        </div>
        {cart.length > 0 && (
          <button 
            onClick={clearCart}
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-bold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset Pesanan
          </button>
        )}
      </div>

      {/* 2. Fixed Order Type & Customer Details */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
        {/* Order Type Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
          {[
            { id: 'Dine-In', label: 'Dine-In', icon: <Utensils className="w-3.5 h-3.5" /> },
            { id: 'Takeaway', label: 'Takeaway', icon: <TakeawayIcon className="w-3.5 h-3.5" /> },
            { id: 'Online-Gofood', label: 'Online', icon: <Smartphone className="w-3.5 h-3.5" /> },
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setOrderType(type.id as OrderType)}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                orderType === type.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {type.icon}
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* Customer & Table Selector */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="relative">
            <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Pelanggan Umum"
              className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
            />
          </div>

          {orderType === 'Dine-In' ? (
            <select
              value={selectedTableNumber}
              onChange={(e) => setSelectedTableNumber(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-600"
            >
              <option value="">-- Pilih Meja --</option>
              {entityTables.map(t => (
                <option key={t.id} value={t.tableNumber}>
                  {t.tableNumber} {t.status === 'Occupied' ? '(Terisi)' : ''}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center justify-center bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-400">
              Tanpa Meja
            </div>
          )}
        </div>
      </div>

      {/* 3. SCROLLABLE ONLY Items List (SPACIOUS & HIGH READABILITY FONTS) */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 divide-y divide-slate-100">
        {cart.length > 0 ? (
          cart.map(item => {
            const variantSummary = item.selectedVariants?.map(v => v.optionName).join(' • ');

            return (
              <div key={item.id} className="py-3.5 space-y-2 transition-colors hover:bg-slate-50/50">
                {/* Item Row: Title & Unit Price */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                      {item.product.name}
                    </h4>
                    <div className="text-xs sm:text-sm font-bold text-red-600 mt-0.5">
                      {formatRupiah(item.unitPrice)}
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-300 hover:text-red-600 p-1 transition-colors shrink-0"
                    title="Hapus menu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Readable Single-Line Variant Summary */}
                {variantSummary && (
                  <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg leading-relaxed inline-block">
                    {variantSummary}
                  </div>
                )}

                {/* Item Note */}
                {item.notes && (
                  <div className="text-xs text-red-900 italic bg-red-50/70 px-2.5 py-1 rounded-lg border border-red-100 font-medium">
                    "{item.notes}"
                  </div>
                )}

                {/* Quantity Controls & Line Total Price */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-900 font-black text-sm shadow-2xs"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-black text-slate-900 w-7 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-900 font-black text-sm shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-sm sm:text-base font-black text-slate-900">
                    {formatRupiah(item.totalPrice)}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
            <ShoppingBag className="w-12 h-12 stroke-1 text-slate-300" />
            <p className="text-sm font-bold text-slate-600">Keranjang pesanan kosong</p>
          </div>
        )}
      </div>

      {/* 4. PINNED AT BOTTOM Fixed Summary & Checkout Action Button */}
      <div className="p-4 bg-white border-t border-slate-200 space-y-3.5 shrink-0">
        {/* Discount Selector */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 font-extrabold">
            <Tag className="w-4 h-4 text-red-600" />
            <span>Diskon Promo</span>
          </div>
          <div className="flex items-center gap-1">
            {[0, 5, 10, 15, 20].map(d => (
              <button
                key={d}
                onClick={() => setDiscountPercentage(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all active:scale-95 ${
                  discountPercentage === d 
                    ? 'bg-red-600 text-white border-red-600 shadow-xs' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {d}%
              </button>
            ))}
          </div>
        </div>

        {/* Calculations */}
        <div className="space-y-1.5 text-xs text-slate-600 font-medium">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-slate-900 text-sm">{formatRupiah(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Diskon ({discountPercentage}%)</span>
              <span>-{formatRupiah(discountAmount)}</span>
            </div>
          )}
          {taxAmount > 0 && (
            <div className="flex justify-between text-slate-500">
              <span>Pajak (PB1 {currentEntity.taxRate * 100}%)</span>
              <span>{formatRupiah(taxAmount)}</span>
            </div>
          )}
          {serviceAmount > 0 && (
            <div className="flex justify-between text-slate-500">
              <span>Service Charge ({currentEntity.serviceRate * 100}%)</span>
              <span>{formatRupiah(serviceAmount)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
            <span className="text-xs sm:text-sm font-black text-slate-900 uppercase">GRAND TOTAL</span>
            <span className="text-xl sm:text-2xl font-black text-red-600">{formatRupiah(grandTotal)}</span>
          </div>
        </div>

        {/* Checkout Action Button */}
        <button
          disabled={cart.length === 0}
          onClick={onOpenPaymentModal}
          className={`w-full py-4 px-4 rounded-2xl text-sm sm:text-base font-extrabold transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] ${
            cart.length > 0
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-md'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span>Bayar & Selesaikan ({formatRupiah(grandTotal)})</span>
        </button>
      </div>
    </div>
  );
};
