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

  return (
    <div className="w-96 lg:w-[420px] bg-white border-l border-slate-200 flex flex-col shrink-0 min-h-0">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-extrabold text-slate-900">Pesanan Aktif ({cart.reduce((sum, i) => sum + i.quantity, 0)})</h3>
        </div>
        {cart.length > 0 && (
          <button 
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Order Type & Customer Selection */}
      <div className="p-3.5 bg-slate-50 border-b border-slate-200 space-y-3">
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
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                orderType === type.id
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {type.icon}
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* Customer Name & Table Selection */}
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nama Pelanggan"
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-2 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-600 font-bold"
            />
          </div>

          {orderType === 'Dine-In' ? (
            <select
              value={selectedTableNumber}
              onChange={(e) => setSelectedTableNumber(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-600 font-bold"
            >
              <option value="">-- Pilih Meja --</option>
              {entityTables.map(t => (
                <option key={t.id} value={t.tableNumber}>
                  {t.tableNumber} {t.status === 'Occupied' ? '(Terisi)' : ''}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center justify-center bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-400 font-bold">
              Tanpa Meja
            </div>
          )}
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {cart.length > 0 ? (
          cart.map(item => (
            <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-sm font-extrabold text-slate-900 truncate">{item.product.name}</h4>
                  <div className="text-xs font-black text-amber-700">
                    {formatRupiah(item.unitPrice)}
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Selected Variants */}
              {item.selectedVariants && item.selectedVariants.length > 0 && (
                <div className="text-xs text-slate-700 bg-white p-2 rounded-xl border border-slate-200 space-y-0.5 font-medium">
                  {item.selectedVariants.map(v => (
                    <div key={v.groupId} className="flex justify-between">
                      <span>{v.groupName}: <strong className="text-slate-900 font-bold">{v.optionName}</strong></span>
                      {v.priceModifier > 0 && <span className="text-amber-700 font-bold">+{formatRupiah(v.priceModifier)}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Item Note */}
              {item.notes && (
                <div className="text-xs text-amber-900 italic bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  "{item.notes}"
                </div>
              )}

              {/* Quantity Controls & Subtotal */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 font-extrabold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-black text-slate-900 w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 font-extrabold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm font-black text-slate-900">
                  {formatRupiah(item.totalPrice)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
            <ShoppingBag className="w-12 h-12 stroke-1 text-slate-300" />
            <p className="text-sm font-bold text-slate-600">Keranjang belanja kosong.</p>
          </div>
        )}
      </div>

      {/* Cart Summary & Checkout */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
        {/* Discount Selection */}
        <div className="flex items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-1.5 text-slate-700 font-extrabold">
            <Tag className="w-4 h-4 text-amber-600" />
            <span>Diskon (%)</span>
          </div>
          <div className="flex items-center gap-1">
            {[0, 5, 10, 15, 20].map(d => (
              <button
                key={d}
                onClick={() => setDiscountPercentage(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  discountPercentage === d 
                    ? 'bg-amber-600 text-white border-amber-600' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {d}%
              </button>
            ))}
          </div>
        </div>

        {/* Financial Calculations */}
        <div className="space-y-1.5 text-xs text-slate-600 font-medium">
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
            <div className="flex justify-between">
              <span>Pajak (PB1 {currentEntity.taxRate * 100}%)</span>
              <span>{formatRupiah(taxAmount)}</span>
            </div>
          )}
          {serviceAmount > 0 && (
            <div className="flex justify-between">
              <span>Service Charge ({currentEntity.serviceRate * 100}%)</span>
              <span>{formatRupiah(serviceAmount)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
            <span className="text-sm font-extrabold text-slate-900">GRAND TOTAL</span>
            <span className="text-xl font-black text-amber-700">{formatRupiah(grandTotal)}</span>
          </div>
        </div>

        {/* Large Touch Checkout Button */}
        <button
          disabled={cart.length === 0}
          onClick={onOpenPaymentModal}
          className={`w-full py-4 px-4 rounded-2xl text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
            cart.length > 0
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
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
