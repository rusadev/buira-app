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
    <div className="w-80 sm:w-96 lg:w-[380px] bg-white border-l border-slate-200 flex flex-col shrink-0 min-h-0 font-sans">
      {/* 1. Header (Red Theme) */}
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-red-600" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
            Pesanan Aktif {totalItemCount > 0 && `(${totalItemCount})`}
          </h3>
        </div>
        {cart.length > 0 && (
          <button 
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* 2. Order Type & Customer Details */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2.5">
        {/* Order Type Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-slate-200">
          {[
            { id: 'Dine-In', label: 'Dine-In', icon: <Utensils className="w-3.5 h-3.5" /> },
            { id: 'Takeaway', label: 'Takeaway', icon: <TakeawayIcon className="w-3.5 h-3.5" /> },
            { id: 'Online-Gofood', label: 'Online', icon: <Smartphone className="w-3.5 h-3.5" /> },
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setOrderType(type.id as OrderType)}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
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

        {/* Customer & Table Row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Pelanggan Umum"
              className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 font-bold"
            />
          </div>

          {orderType === 'Dine-In' ? (
            <select
              value={selectedTableNumber}
              onChange={(e) => setSelectedTableNumber(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-600 font-bold"
            >
              <option value="">-- Pilih Meja --</option>
              {entityTables.map(t => (
                <option key={t.id} value={t.tableNumber}>
                  {t.tableNumber} {t.status === 'Occupied' ? '(Terisi)' : ''}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center justify-center bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-400 font-bold">
              Tanpa Meja
            </div>
          )}
        </div>
      </div>

      {/* 3. Streamlined Selected Cart Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {cart.length > 0 ? (
          cart.map(item => {
            const variantSummary = item.selectedVariants?.map(v => v.optionName).join(' • ');

            return (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 transition-all hover:border-slate-300">
                {/* Item Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug truncate">
                      {item.product.name}
                    </h4>
                    <div className="text-[11px] font-semibold text-red-700">
                      {formatRupiah(item.unitPrice)}
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-300 hover:text-rose-600 p-1 transition-colors shrink-0"
                    title="Hapus menu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Compact Variant Summary */}
                {variantSummary && (
                  <div className="text-[11px] text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 truncate">
                    {variantSummary}
                  </div>
                )}

                {/* Item Note */}
                {item.notes && (
                  <div className="text-[11px] text-rose-900 italic bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                    "{item.notes}"
                  </div>
                )}

                {/* Item Stepper & Item Total Price */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-800 font-bold text-xs shadow-2xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-slate-900 w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-white hover:bg-slate-200 flex items-center justify-center text-slate-800 font-bold text-xs shadow-2xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-xs font-bold text-slate-900">
                    {formatRupiah(item.totalPrice)}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-1.5">
            <ShoppingBag className="w-10 h-10 stroke-1 text-slate-300" />
            <p className="text-xs font-bold text-slate-500">Keranjang pesanan kosong</p>
          </div>
        )}
      </div>

      {/* 4. Streamlined Summary & Checkout Footer (Red Theme) */}
      <div className="p-3.5 bg-white border-t border-slate-200 space-y-2.5">
        {/* Discount Selector */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-600 font-bold">
            <Tag className="w-3.5 h-3.5 text-red-600" />
            <span>Diskon</span>
          </div>
          <div className="flex items-center gap-1">
            {[0, 5, 10, 15, 20].map(d => (
              <button
                key={d}
                onClick={() => setDiscountPercentage(d)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all ${
                  discountPercentage === d 
                    ? 'bg-red-600 text-white border-red-600' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {d}%
              </button>
            ))}
          </div>
        </div>

        {/* Calculations */}
        <div className="space-y-1 text-xs text-slate-600 font-medium">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-slate-900">{formatRupiah(subtotal)}</span>
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
            <span className="text-xs font-bold text-slate-900 uppercase">Grand Total</span>
            <span className="text-lg font-black text-red-700">{formatRupiah(grandTotal)}</span>
          </div>
        </div>

        {/* Red Checkout Action Button */}
        <button
          disabled={cart.length === 0}
          onClick={onOpenPaymentModal}
          className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            cart.length > 0
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Bayar & Selesaikan ({formatRupiah(grandTotal)})</span>
        </button>
      </div>
    </div>
  );
};
