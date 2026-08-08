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
    <div className="w-full h-full max-h-full flex-1 bg-white flex flex-col min-h-0 overflow-hidden font-sans select-none">

      {/* ── 1. Top Header (Shrink-0) ── */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-red-600" />
          <h3 className="text-sm font-extrabold text-slate-900">
            Pesanan {totalItemCount > 0 && <span className="text-red-600">({totalItemCount})</span>}
          </h3>
        </div>
        {cart.length > 0 && (
          <button 
            onClick={handleClearCart} 
            className="text-[11px] text-slate-400 hover:text-red-600 flex items-center gap-1 font-bold transition-colors" 
            style={{ outline: 'none', border: 'none', background: 'transparent' }}
          >
            <X className="w-3.5 h-3.5" />
            Hapus Semua
          </button>
        )}
      </div>

      {/* ── 2. Order Type, Member & Customer Select (Shrink-0) ── */}
      <div className="px-4 py-2.5 border-b border-slate-100 space-y-2 shrink-0 bg-slate-50/60">
        <div className="flex gap-2">
          {orderTypes.map(type => {
            const isActive = orderType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setOrderType(type.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-extrabold transition-all"
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

        <div className="grid grid-cols-2 gap-2">
          {/* Customer / Member Input with Prominent Loyalty Trigger */}
          {selectedMember ? (
            <div className="p-1.5 border border-red-200 bg-white rounded-xl flex items-center justify-between col-span-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <Crown className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-black text-slate-900 block truncate">{selectedMember.name}</span>
                  <span className="text-[9px] font-black text-red-600 block">{selectedMember.tier} · {selectedMember.points} Poin</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedMember(null);
                  setCustomerName('');
                }}
                className="text-slate-400 hover:text-red-600 p-0.5 shrink-0"
                style={{ outline: 'none', border: 'none', background: 'transparent' }}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <div className="relative flex-1">
                <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Nama Pelanggan..."
                  className="w-full bg-white rounded-xl pl-7 pr-2 py-1.5 text-xs text-slate-800 font-bold border border-slate-200"
                  style={{ outline: 'none' }}
                />
              </div>
              <button
                type="button"
                onClick={() => setIsCustomerModalOpen(true)}
                className="p-1.5 rounded-xl bg-white border border-slate-200 hover:border-red-600 text-red-600 font-extrabold text-xs flex items-center justify-center shrink-0"
                style={{ outline: 'none' }}
                title="Pilih Member Pelanggan"
              >
                <Crown className="w-3.5 h-3.5 text-red-600" />
              </button>
            </div>
          )}

          {orderType === 'Dine-In' ? (
            <div className="relative">
              <input
                type="text"
                value={selectedTableNumber}
                onChange={e => setSelectedTableNumber(e.target.value)}
                placeholder="No. Meja / Lokasi (ketik bebas)..."
                className="w-full bg-white rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold border border-slate-200"
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
            <div className="w-full bg-slate-100 rounded-xl px-2.5 py-1.5 text-xs text-slate-400 font-bold border border-slate-200 flex items-center justify-center">
              Takeaway (Tanpa Meja)
            </div>
          )}
        </div>

        {/* Promo Voucher Input */}
        <div className="pt-1">
          {appliedPromo ? (
            <div className="p-2 border border-emerald-300 rounded-xl bg-emerald-50/60 flex items-center justify-between text-xs text-emerald-800 font-bold">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Promo: <strong>{appliedPromo.code}</strong> (-{appliedPromo.discountType === 'PERCENTAGE' ? `${appliedPromo.value}%` : formatRupiah(appliedPromo.value)})</span>
              </div>
              <button
                type="button"
                onClick={() => setAppliedPromo(null)}
                className="text-rose-600 hover:text-rose-700 font-black"
                style={{ outline: 'none' }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={e => setPromoCodeInput(e.target.value)}
                  placeholder="Kode Promo (misal: HUTRI82)"
                  className="w-full bg-white rounded-xl pl-8 pr-3 py-1.5 text-xs font-bold text-slate-900 border border-slate-200 uppercase"
                  style={{ outline: 'none' }}
                />
              </div>
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-red-600 font-extrabold text-xs shrink-0"
                style={{ outline: 'none' }}
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

      {/* ── 3. Scrollable Cart Item List (Flex-1 Min-h-0 Overflow-y-auto) ── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 divide-y divide-slate-100">
        {cart.length > 0 ? (
          cart.map(item => {
            const variantSummary = item.selectedVariants?.map(v => v.optionName).join(' · ');
            const disc = item.product.discountPercentage;
            const originalUnitPrice = disc ? Math.round(item.product.price / (1 - disc / 100)) : null;

            return (
              <div key={item.id} className="py-3 flex flex-col gap-1 group">
                <div className="flex items-start justify-between gap-2">
                  <div 
                    onClick={() => setEditingCartItem(item)} 
                    className="flex items-center gap-1.5 flex-1 flex-wrap cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">{item.product.name}</p>
                    {item.product.isPromoActive && item.product.promoTag && (
                      <span className="text-[9px] font-black text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                        {item.product.promoTag}
                      </span>
                    )}
                    {disc && (
                      <span className="text-[10px] font-black text-white bg-red-600 px-1.5 py-0.5 rounded-full shrink-0">
                        -{disc}%
                      </span>
                    )}
                    <Edit3 className="w-3 h-3 text-slate-300 group-hover:text-red-600 shrink-0 ml-1 transition-colors" />
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-5 h-5 rounded flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors shrink-0 mt-0.5"
                    style={{ outline: 'none', border: 'none', background: 'transparent' }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {variantSummary && (
                  <p 
                    onClick={() => setEditingCartItem(item)}
                    className="text-[11px] text-slate-500 font-medium leading-relaxed cursor-pointer hover:text-red-600 transition-colors"
                  >
                    {variantSummary}
                  </p>
                )}

                {item.notes && (
                  <p 
                    onClick={() => setEditingCartItem(item)}
                    className="text-[11px] italic text-slate-500 font-medium cursor-pointer hover:text-red-600 transition-colors"
                  >
                    "{item.notes}"
                  </p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
                      style={{ outline: 'none', border: 'none' }}
                    >
                      <Minus className="w-3 h-3 stroke-[3]" />
                    </button>
                    <span className="w-6 text-center text-xs font-black text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => handleIncrementQuantity(item)}
                      className="w-6 h-6 rounded bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
                      style={{ outline: 'none', border: 'none' }}
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                    </button>
                  </div>

                  <div className="text-right">
                    {originalUnitPrice && (
                      <p className="text-[10px] text-slate-400 line-through font-medium">
                        {formatRupiah(originalUnitPrice * item.quantity)}
                      </p>
                    )}
                    <span className="text-xs sm:text-sm font-black text-slate-900">{formatRupiah(item.totalPrice)}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-2 py-12 text-center">
            <ShoppingBag className="w-10 h-10 text-slate-200" strokeWidth={1.5} />
            <p className="text-xs font-bold text-slate-400">Belum ada pesanan</p>
          </div>
        )}
      </div>

      {/* ── 4. Pinned Bottom Footer (Shrink-0 — ALWAYS VISIBLE ABOVE NAVIGATION) ── */}
      <div className="shrink-0 p-3.5 border-t border-slate-200 bg-white space-y-2 font-sans">
        <div className="space-y-1 text-xs font-bold text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal ({totalItemCount} item)</span>
            <span className="font-extrabold text-slate-900">{formatRupiah(subtotal)}</span>
          </div>
          {promoDiscountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-extrabold">
              <span>Diskon Promo</span>
              <span>-{formatRupiah(promoDiscountAmount)}</span>
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
          <div className="flex justify-between items-center pt-1 border-t border-slate-100">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wide">Total Pembayaran</span>
            <span className="text-lg sm:text-xl font-black text-red-600">{formatRupiah(grandTotal)}</span>
          </div>
        </div>

        {/* Pay Button */}
        <button
          disabled={cart.length === 0}
          onClick={onOpenPaymentModal}
          className="w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-xs"
            style={{
              outline: 'none',
              border: 'none',
              background: cart.length > 0 ? '#dc2626' : '#e2e8f0',
              color: cart.length > 0 ? '#ffffff' : '#94a3b8',
              cursor: cart.length > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            <CreditCard className="w-4 h-4 stroke-[2.5]" />
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
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full text-center space-y-3 border border-slate-200">
            <h4 className="text-xs font-extrabold text-slate-900">Hapus Semua Pesanan?</h4>
            <p className="text-[11px] text-slate-500 font-medium">Seluruh item ({cart.length} menu) dalam keranjang akan dikosongkan.</p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setIsClearConfirmOpen(false)}
                className="flex-1 py-2 rounded-xl text-xs font-extrabold border border-slate-200 text-slate-600 hover:bg-slate-50"
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
                className="flex-1 py-2 rounded-xl text-xs font-black text-white bg-red-600 hover:bg-red-700"
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
