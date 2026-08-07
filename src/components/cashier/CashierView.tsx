import React, { useState } from 'react';
import type { Product, CartItem, Order } from '../../types/pos';
import { ProductGrid } from './ProductGrid';
import { CartSidebar } from './CartSidebar';
import { VariantModal } from './VariantModal';
import { PaymentModal } from './PaymentModal';
import { ReceiptModal } from './ReceiptModal';
import { usePOS } from '../../context/POSContext';
import { ShoppingBag, ArrowLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

export const CashierView: React.FC = () => {
  const { addToCart, cart, currentEntity } = usePOS();

  const [selectedProductForVariant, setSelectedProductForVariant] = useState<Product | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  // Mobile view state toggle: 'catalog' vs 'cart'
  const [mobileTab, setMobileTab] = useState<'catalog' | 'cart'>('catalog');

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const taxAmount = Math.round(subtotal * currentEntity.taxRate);
  const serviceAmount = Math.round(subtotal * currentEntity.serviceRate);
  const grandTotal = subtotal + taxAmount + serviceAmount;

  const handleAddToCartWithVariants = (cartItem: CartItem) => {
    addToCart(cartItem);
  };

  const handlePaymentSuccess = (order: Order) => {
    setIsPaymentModalOpen(false);
    setLastCompletedOrder(order);
    setMobileTab('catalog');
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col md:flex-row min-w-0 overflow-hidden relative font-sans select-none">
      
      {/* Mobile Top Navigation Bar (Visible on Mobile < 768px) */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between shrink-0 border-b border-slate-800">
        <span className="text-xs font-black tracking-wider uppercase flex items-center gap-2">
          {mobileTab === 'cart' ? (
            <button 
              onClick={() => setMobileTab('catalog')} 
              className="flex items-center gap-1.5 text-red-400 font-extrabold"
              style={{ outline: 'none' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Menu</span>
            </button>
          ) : (
            <span className="truncate max-w-[160px] sm:max-w-xs font-black text-slate-100">
              Kasir ({currentEntity.name})
            </span>
          )}
        </span>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setMobileTab('catalog')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              mobileTab === 'catalog' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
            style={{ outline: 'none' }}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Katalog</span>
          </button>
          <button
            onClick={() => setMobileTab('cart')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              mobileTab === 'cart' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
            style={{ outline: 'none' }}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Keranjang</span>
            {totalCartCount > 0 && (
              <span className="bg-white text-red-600 px-1.5 py-0.2 rounded-full text-[10px] font-black">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Catalog Grid Section (Desktop: always visible | Mobile: visible when mobileTab === 'catalog') */}
      <div className={`flex-1 min-h-0 flex flex-col min-w-0 ${mobileTab === 'cart' ? 'hidden md:flex' : 'flex'}`}>
        <ProductGrid onSelectProduct={(product) => setSelectedProductForVariant(product)} />
        
        {/* Floating Bottom Cart Bar for Mobile (Only appears if cart has items on Mobile) */}
        {cart.length > 0 && mobileTab === 'catalog' && (
          <div className="md:hidden p-3 bg-slate-900 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setMobileTab('cart')}
              className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-2xl font-black text-xs flex items-center justify-between transition-all"
              style={{ outline: 'none', border: 'none' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center font-black text-xs">
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

      {/* Cart Sidebar Section (Desktop: right sidebar | Mobile: full screen when mobileTab === 'cart') */}
      <div className={`w-full md:w-[380px] lg:w-[420px] xl:w-[460px] md:min-w-[360px] border-l border-slate-200 shrink-0 min-h-0 flex flex-col ${mobileTab === 'catalog' ? 'hidden md:flex' : 'flex'}`}>
        <CartSidebar onOpenPaymentModal={() => setIsPaymentModalOpen(true)} />
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
    </div>
  );
};
