import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import type { OrderType, CartItem, CustomerMember, PromoCode } from '../../types/pos';
import { formatRupiah } from '../../utils/formatters';
import { EditCartItemModal } from './EditCartItemModal';
import { CustomerModal } from './CustomerModal';
import { SplitBillModal } from './SplitBillModal';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  User, 
  Utensils, 
  ShoppingBag as TakeawayIcon,
  CreditCard,
  Edit3,
  Crown,
  Tag,
  Scissors,
  Check
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
    currentEntity,
    tables
  } = usePOS();

  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState<boolean>(false);

  // Modals state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);
  const [isSplitBillModalOpen, setIsSplitBillModalOpen] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<CustomerMember | null>(null);

  // Promo Code Voucher State
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string>('');

  const PROMO_DATABASE: PromoCode[] = [
    { id: 'promo-1', code: 'HUTRI82', discountType: 'PERCENTAGE', value: 10, minSpend: 50000, isActive: true },
    { id: 'promo-2', code: 'HEMAT20', discountType: 'FIXED', value: 20000, minSpend: 100000, isActive: true },
    { id: 'promo-3', code: 'COFFEETIME', discountType: 'PERCENTAGE', value: 15, minSpend: 40000, isActive: true }
  ];

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  // Calculate Voucher Promo Discount
  let promoDiscountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'PERCENTAGE') {
      promoDiscountAmount = Math.round((subtotal * appliedPromo.value) / 100);
    } else {
      promoDiscountAmount = appliedPromo.value;
    }
  }

  const subtotalAfterPromo = Math.max(0, subtotal - promoDiscountAmount);
  const taxAmount = Math.round(subtotalAfterPromo * currentEntity.taxRate);
  const serviceAmount = Math.round(subtotalAfterPromo * currentEntity.serviceRate);
  const grandTotal = subtotalAfterPromo + taxAmount + serviceAmount;

  const entityTables = tables.filter(t => t.entityId === currentEntity.id);
  const totalItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const orderTypes: { id: OrderType; label: string; icon: React.ReactNode }[] = [
    { id: 'Dine-In', label: 'Dine-In', icon: <Utensils className="w-3.5 h-3.5" /> },
    { id: 'Takeaway', label: 'Takeaway', icon: <TakeawayIcon className="w-3.5 h-3.5" /> },
  ];

  const handleClearCart = () => {
    if (cart.length > 1) {
      setIsClearConfirmOpen(true);
    } else {
      clearCart();
    }
  };

  const handleIncrementQuantity = (item: CartItem) => {
    if (item.quantity >= item.product.stock) {
      alert(`Stok ${item.product.name} terbatas (Sisa ${item.product.stock} ${item.product.unit}).`);
      return;
    }
    updateCartQuantity(item.id, item.quantity + 1);
  };

  // Apply Voucher Promo
  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoCodeInput.trim()) return;

    const found = PROMO_DATABASE.find(
      p => p.code.toUpperCase() === promoCodeInput.trim().toUpperCase() && p.isActive
    );

    if (!found) {
      setPromoError('Kode promo tidak valid atau tidak aktif.');
      return;
    }

    if (subtotal < found.minSpend) {
      setPromoError(`Min. belanja ${formatRupiah(found.minSpend)} untuk promo ini.`);
      return;
    }

    setAppliedPromo(found);
    setPromoCodeInput('');
  };

  return (
    <div className="w-full h-full max-h-full flex-1 bg-white flex flex-col min-h-0 overflow-hidden font-sans select-none relative">

      {/* ── 1. Top Header (Shrink-0) ── */}
      <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-red-600" />
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
            Pesanan {totalItemCount > 0 && <span className="text-red-600">({totalItemCount})</span>}
          </h3>
        </div>
        {cart.length > 0 && (
          <button 
            onClick={handleClearCart} 
            className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
            style={{ outline: 'none', border: 'none', background: 'transparent' }}
          >
            <X className="w-3.5 h-3.5" />
            <span>Hapus Semua</span>
          </button>
        )}
      </div>

      {/* ── 2. Scrollable Cart Body (Order Type, Customer, Table, Promo & Items) ── */}
      <div 
        className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100 font-sans"
        style={{ flex: '1 1 0%', WebkitOverflowScrolling: 'touch' }}
      >
        {/* Order Type, Member & Customer Select Header Block */}
        <div className="px-3.5 py-3 space-y-2.5 bg-slate-50/70 border-b border-slate-200 shrink-0">
          
          {/* Order Type Big Toggle Buttons (Native Mobile App Style) */}
          <div className="flex gap-2">
            {orderTypes.map(type => {
              const isActive = orderType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setOrderType(type.id)}
                  className="w-full flex-1 flex items-center justify-center gap-2 py-2.5 rounded-none text-xs sm:text-sm font-extrabold uppercase tracking-wide transition-all shadow-xs"
                  style={{
                    outline: 'none',
                    border: '1.5px solid',
                    borderColor: isActive ? '#dc2626' : '#cbd5e1',
                    background: isActive ? '#dc2626' : '#ffffff',
                    color: isActive ? '#ffffff' : '#334155',
                  }}
                >
                  <span className="scale-110">{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>

          {/* Customer Input + Prominent Member Button & Table Selection */}
          <div className="grid grid-cols-2 gap-2">
            {/* Customer / Member Input */}
            {selectedMember ? (
              <div className="p-2 border border-red-200 bg-red-50/40 rounded-none flex items-center justify-between col-span-1">
                <div className="flex items-center gap-2 min-w-0">
                  <Crown className="w-4 h-4 text-red-600 shrink-0 fill-red-200" />
                  <div className="min-w-0">
                    <span className="text-xs font-black text-slate-900 block truncate">{selectedMember.name}</span>
                    <span className="text-[10px] font-black text-red-600 block">{selectedMember.tier} · {selectedMember.points} Poin</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMember(null);
                    setCustomerName('');
                  }}
                  className="text-slate-400 hover:text-red-600 p-1 shrink-0"
                  style={{ outline: 'none', border: 'none', background: 'transparent' }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Nama Pelanggan..."
                    className="w-full bg-white rounded-none pl-9 pr-2 py-2 text-xs font-extrabold text-slate-900 border border-slate-200"
                    style={{ outline: 'none' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(true)}
                  className="py-2 px-2.5 rounded-none bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 font-black text-xs flex items-center gap-1 shrink-0 transition-colors"
                  style={{ outline: 'none' }}
                  title="Pilih atau Daftar Member Pelanggan"
                >
                  <Crown className="w-4 h-4 text-red-600" />
                  <span className="hidden xs:inline">Member</span>
                </button>
              </div>
            )}

            {/* Table Input */}
            {orderType === 'Dine-In' ? (
              <div className="relative">
                <input
                  type="text"
                  value={selectedTableNumber}
                  onChange={e => setSelectedTableNumber(e.target.value)}
                  placeholder="No. Meja / Lokasi..."
                  className="w-full bg-white rounded-none px-3 py-2 text-xs font-extrabold text-slate-900 border border-slate-200"
                  style={{ outline: 'none' }}
                  list="table-suggestions"
                />
                <datalist id="table-suggestions">
                  {entityTables.map(t => (
                    <option key={t.id} value={t.number}>
                      {t.number} ({t.status})
                    </option>
                  ))}
                  <option value="Meja 01" />
                  <option value="Meja 02" />
                  <option value="Lesehan A" />
                  <option value="Lesehan B" />
                  <option value="Teras Depan" />
                  <option value="Bar / Counter" />
                </datalist>
              </div>
            ) : (
              <div className="w-full bg-slate-100 rounded-none px-3 py-2 text-xs text-slate-400 font-extrabold border border-slate-200 flex items-center justify-center">
                Takeaway (Tanpa Meja)
              </div>
            )}
          </div>

          {/* Promo Voucher Input */}
          <div className="pt-0.5">
            {appliedPromo ? (
              <div className="p-2 border border-emerald-300 rounded-none bg-emerald-50/60 flex items-center justify-between text-xs text-emerald-800 font-bold">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Promo: <strong>{appliedPromo.code}</strong> (-{appliedPromo.discountType === 'PERCENTAGE' ? `${appliedPromo.value}%` : formatRupiah(appliedPromo.value)})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAppliedPromo(null)}
                  className="text-rose-600 hover:text-rose-700 font-black p-1"
                  style={{ outline: 'none' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={e => setPromoCodeInput(e.target.value)}
                    placeholder="KODE PROMO (MISAL: HUTRI82)"
                    className="w-full bg-white rounded-none pl-9 pr-3 py-2 text-xs font-extrabold text-slate-900 border border-slate-200 uppercase tracking-wide"
                    style={{ outline: 'none' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3.5 py-2 rounded-none bg-red-600 text-white hover:bg-red-700 font-black text-xs shrink-0 transition-colors"
                  style={{ outline: 'none', border: 'none' }}
                >
                  Gunakan
                </button>
              </div>
            )}
            {promoError && (
              <span className="text-[10px] font-bold text-rose-600 mt-1 block">{promoError}</span>
            )}
          </div>
        </div>

        {/* Cart Item List */}
        <div className="px-4 divide-y divide-slate-100">
          {cart.length > 0 ? (
            cart.map(item => {
              const variantSummary = item.selectedVariants?.map(v => v.optionName).join(' · ');
              const disc = item.product.discountPercentage;
              const originalUnitPrice = disc ? Math.round(item.product.price / (1 - disc / 100)) : null;

              return (
                <div key={item.id} className="py-3 flex flex-col gap-1.5 group">
                  <div className="flex items-start justify-between gap-2">
                    <div 
                      onClick={() => setEditingCartItem(item)} 
                      className="flex items-center gap-1.5 flex-1 flex-wrap cursor-pointer hover:opacity-80"
                    >
                      <p className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">{item.product.name}</p>
                      {item.product.isPromoActive && item.product.promoTag && (
                        <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded-none uppercase tracking-wider shrink-0">
                          {item.product.promoTag}
                        </span>
                      )}
                      {disc && (
                        <span className="text-[10px] font-black text-white bg-red-600 px-1.5 py-0.2 rounded-none shrink-0">
                          -{disc}%
                        </span>
                      )}
                      <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 shrink-0 ml-1" />
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-6 h-6 rounded-none flex items-center justify-center text-slate-300 hover:text-red-500 shrink-0 mt-0.5"
                      style={{ outline: 'none', border: 'none', background: 'transparent' }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {variantSummary && (
                    <p 
                      onClick={() => setEditingCartItem(item)}
                      className="text-xs text-slate-500 font-semibold leading-relaxed cursor-pointer hover:text-red-600"
                    >
                      {variantSummary}
                    </p>
                  )}

                  {item.notes && (
                    <p 
                      onClick={() => setEditingCartItem(item)}
                      className="text-xs italic text-slate-500 font-semibold cursor-pointer hover:text-red-600"
                    >
                      "{item.notes}"
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-none border border-slate-200">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-none bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 font-black text-base"
                        style={{ outline: 'none', border: 'none' }}
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                      <span className="w-7 text-center text-sm sm:text-base font-black text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => handleIncrementQuantity(item)}
                        className="w-7 h-7 rounded-none bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 font-black text-base"
                        style={{ outline: 'none', border: 'none' }}
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>

                    <div className="text-right">
                      {originalUnitPrice && (
                        <p className="text-xs text-slate-400 line-through font-medium">
                          {formatRupiah(originalUnitPrice * item.quantity)}
                        </p>
                      )}
                      <span className="text-sm sm:text-base font-black text-slate-900">{formatRupiah(item.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-2 py-8 text-center">
              <ShoppingBag className="w-10 h-10 text-slate-200" strokeWidth={1.5} />
              <p className="text-xs font-bold text-slate-400">Belum ada pesanan</p>
            </div>
          )}
        </div>
      </div>

      {/* ── 3. Pinned Bottom Footer (GUARANTEED 100% VISIBLE ABOVE MOBILE BOTTOM NAV) ── */}
      <div className="shrink-0 bg-white border-t-2 border-slate-200 p-3.5 pb-20 md:pb-3.5 space-y-2.5 font-sans shadow-xl z-30">
        
        {/* Total Row */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-black text-slate-900 uppercase tracking-wide">Total Pembayaran</span>
          <span className="text-base sm:text-lg font-black text-red-600">{formatRupiah(grandTotal)}</span>
        </div>

        {/* Big Prominent Pay Button */}
        <button
          disabled={cart.length === 0}
          onClick={onOpenPaymentModal}
          className="w-full py-3.5 sm:py-4 rounded-none text-xs sm:text-base font-black flex items-center justify-center gap-2 shadow-md uppercase tracking-wider transition-all"
          style={{
            outline: 'none',
            border: 'none',
            background: cart.length > 0 ? '#dc2626' : '#cbd5e1',
            color: cart.length > 0 ? '#ffffff' : '#94a3b8',
            cursor: cart.length > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          <span>Bayar Sekarang {cart.length > 0 && `(${formatRupiah(grandTotal)})`}</span>
        </button>
      </div>

      {/* Member Pelanggan Selector Modal */}
      {isCustomerModalOpen && (
        <CustomerModal
          onClose={() => setIsCustomerModalOpen(false)}
          onSelectCustomer={mem => {
            setSelectedMember(mem);
            setCustomerName(mem.name);
          }}
        />
      )}

      {/* Split Bill Modal */}
      {isSplitBillModalOpen && (
        <SplitBillModal
          cart={cart}
          grandTotal={grandTotal}
          onClose={() => setIsSplitBillModalOpen(false)}
          onPaySubBill={(subAmount, label) => {
            setIsSplitBillModalOpen(false);
            onOpenPaymentModal();
          }}
        />
      )}

      {/* In-cart Edit Modal */}
      {editingCartItem && (
        <EditCartItemModal
          cartItem={editingCartItem}
          onClose={() => setEditingCartItem(null)}
        />
      )}

      {/* Clear Confirm Dialog */}
      {isClearConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-none p-5 max-w-xs w-full text-center space-y-3 border border-slate-200">
            <h4 className="text-xs font-extrabold text-slate-900">Hapus Semua Pesanan?</h4>
            <p className="text-[11px] text-slate-500 font-medium">Seluruh item ({cart.length} menu) dalam keranjang akan dikosongkan.</p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setIsClearConfirmOpen(false)}
                className="flex-1 py-2 rounded-none text-xs font-extrabold border border-slate-200 text-slate-600 hover:bg-slate-50"
                style={{ outline: 'none' }}
              >
                Batal
              </button>
              <button
                onClick={() => {
                  clearCart();
                  setAppliedPromo(null);
                  setIsClearConfirmOpen(false);
                }}
                className="flex-1 py-2 rounded-none text-xs font-black text-white bg-red-600 hover:bg-red-700"
                style={{ outline: 'none', border: 'none' }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
