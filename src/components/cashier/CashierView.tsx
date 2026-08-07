import React, { useState } from 'react';
import type { Product, CartItem, Order } from '../../types/pos';
import { ProductGrid } from './ProductGrid';
import { CartSidebar } from './CartSidebar';
import { VariantModal } from './VariantModal';
import { PaymentModal } from './PaymentModal';
import { ReceiptModal } from './ReceiptModal';
import { usePOS } from '../../context/POSContext';

export const CashierView: React.FC = () => {
  const { addToCart } = usePOS();

  const [selectedProductForVariant, setSelectedProductForVariant] = useState<Product | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  const handleAddToCartWithVariants = (cartItem: CartItem) => {
    addToCart(cartItem);
  };

  const handlePaymentSuccess = (order: Order) => {
    setIsPaymentModalOpen(false);
    setLastCompletedOrder(order);
  };

  return (
    <div className="flex-1 min-h-0 flex min-w-0 overflow-hidden">
      {/* Product Catalog Grid */}
      <ProductGrid onSelectProduct={(product) => setSelectedProductForVariant(product)} />

      {/* Active Order Cart Sidebar */}
      <CartSidebar onOpenPaymentModal={() => setIsPaymentModalOpen(true)} />

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
