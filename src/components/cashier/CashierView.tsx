import React, { useState } from 'react';
import type { Product, CartItem, Order } from '../../types/pos';
import { ProductGrid } from './ProductGrid';
import { CartSidebar } from './CartSidebar';
import { VariantModal } from './VariantModal';
import { PaymentModal } from './PaymentModal';
import { ReceiptModal } from './ReceiptModal';
import { ShiftModal } from '../shift/ShiftModal';
import { usePOS } from '../../context/POSContext';
import { ShoppingBag, ArrowLeft, ChevronRight, LayoutGrid, Lock, KeyRound } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

export const CashierView: React.FC = () => {
  const { addToCart, cart, currentEntity, activeShift } = usePOS();

  const [selectedProductForVariant, setSelectedProductForVariant] = useState<Product | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState<boolean>(false);

  // Mobile view state toggle: 'catalog' vs 'cart'
  const [mobileTab, setMobileTab] = useState<'catalog' | 'cart'>('catalog');

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const taxAmount = Math.round(subtotal * currentEntity.taxRate);
  const serviceAmount = Math.round(subtotal * currentEntity.serviceRate);
  const grandTotal = subtotal + taxAmount + serviceAmount;

  const handleAddToCartWithVariants = (cartItem: CartItem) => {
    if (!activeShift) {
      setIsShiftModalOpen(true);
      return;
    }
    addToCart(cartItem);
  };

  const handlePaymentSuccess = (order: Order) => {
    setIsPaymentModalOpen(false);
    setLastCompletedOrder(order);
    setMobileTab('catalog');
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col md:flex-row min-w-0 overflow-hidden relative font-sans select-none">
      
      {/* Shift Lock Banner Overlay if Shift is NOT open */}
      {/* Shift Lock Banner Overlay if Shift is NOT open */}
      {!activeShift && (
        <div className="absolute inset-0 z-30 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-none p-6 sm:p-8 max-w-md w-full text-center space-y-4">
            <div className="w-14 h-14 rounded-none bg-rose-50 border border-rose-200 text-red-600 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">Akses Kasir POS Terkunci</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Shift kasir belum dibuka. Anda harus membuka shift dan mencatat modal awal laci kasir sebelum melayani transaksi checkout.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsShiftModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-none text-white font-black text-xs transition-all flex items-center justify-center gap-2"
                style={{ outline: 'none', border: 'none', background: '#dc2626' }}
              >
                <KeyRound className="w-4 h-4" />
                <span>Buka Shift Kasir Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Top Navigation Bar (Clean White Styling) */}
      <div className="md:hidden bg-white text-slate-900 px-4 py-2.5 flex items-center justify-between shrink-0 border-b border-slate-200">
        <span className="text-xs font-black tracking-wider uppercase flex items-center gap-2">
          {mobileTab === 'cart' ? (
            <button 
              onClick={() => setMobileTab('catalog')} 
              className="flex items-center gap-1.5 text-red-600 font-extrabold"
              style={{ outline: 'none' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Menu</span>
            </button>
          ) : (
            <span className="truncate max-w-[160px] sm:max-w-xs font-black text-slate-900">
              Kasir ({currentEntity.name})
            </span>
          )}
        </span>

        {/* Clean Mobile Switch Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-none border border-slate-200">
          <button
            onClick={() => setMobileTab('catalog')}
            className={`px-3 py-1 rounded-none text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              mobileTab === 'catalog' ? 'bg-red-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
            style={{ outline: 'none' }}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Katalog</span>
          </button>
          <button
            onClick={() => setMobileTab('cart')}
            className={`px-3 py-1 rounded-none text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              mobileTab === 'cart' ? 'bg-red-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
            style={{ outline: 'none' }}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Keranjang</span>
            {totalCartCount > 0 && (
              <span className="bg-white text-red-600 px-1.5 py-0.2 rounded-none text-[10px] font-black">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Catalog Grid Section (Desktop: always visible | Mobile: visible when mobileTab === 'catalog') */}
      <div className={`flex-1 min-h-0 flex flex-col min-w-0 ${mobileTab === 'cart' ? 'hidden md:flex' : 'flex'}`}>
        <ProductGrid onSelectProduct={(product) => setSelectedProductForVariant(product)} />
        
        {/* Floating Bottom Cart Bar for Mobile (Clean White Background Border) */}
        {cart.length > 0 && mobileTab === 'catalog' && (
          <div className="md:hidden p-3 bg-white border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setMobileTab('cart')}
              className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-none font-black text-xs flex items-center justify-between transition-all"
              style={{ outline: 'none', border: 'none' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-none bg-white/20 flex items-center justify-center font-black text-xs">
                  {totalCartCount}
                </div>
                <span>{totalCartCount} Menu Dipesan</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-black">
                <span>{formatRupiah(grandTotal)}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Cart Sidebar Section (35% - 38% Screen Width Ratio) */}
      <div className={`w-full h-full max-h-full md:w-[36%] lg:w-[38%] xl:w-[35%] md:min-w-[340px] md:max-w-[480px] border-l border-slate-200 min-h-0 flex flex-col overflow-hidden shrink-0 ${mobileTab === 'catalog' ? 'hidden md:flex' : 'flex'}`}>
        <CartSidebar onOpenPaymentModal={() => {
          if (!activeShift) {
            setIsShiftModalOpen(true);
            return;
          }
          setIsPaymentModalOpen(true);
        }} />
      </div>

      {/* Variant Selection Modal */}
      {selectedProductForVariant && (
        <VariantModal
          product={selectedProductForVariant}
          onClose={() => setSelectedProductForVariant(null)}
          onAddToCart={handleAddToCartWithVariants}
        />
      )}

      {/* Payment Processing Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentComplete={handlePaymentSuccess}
        />
      )}

      {/* Thermal Receipt Preview Modal */}
      {lastCompletedOrder && (
        <ReceiptModal
          order={lastCompletedOrder}
          onClose={() => setLastCompletedOrder(null)}
        />
      )}

      {/* Shift Modal Dialog */}
      {isShiftModalOpen && (
        <ShiftModal onClose={() => setIsShiftModalOpen(false)} />
      )}
    </div>
  );
};
