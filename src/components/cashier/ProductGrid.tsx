import React, { useState } from 'react';
import type { Product, CartItem } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/formatters';
import { Search, LayoutGrid, AlertTriangle, Sparkles } from 'lucide-react';

interface ProductGridProps {
  onSelectProduct: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onSelectProduct }) => {
  const { products, categories, currentEntityId, addToCart } = usePOS();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const entityProducts = products.filter(p => p.entityId === currentEntityId && p.isActive);
  const entityCategories = categories.filter(c => c.entityId === currentEntityId);

  const filteredProducts = entityProducts.filter(p => {
    const matchesCategory = selectedCategory === 'ALL' || 
      (selectedCategory === 'PROMO' ? (p.isPromoActive || !!p.discountPercentage) : p.categoryId === selectedCategory);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product: Product) => {
    if (product.variantGroups && product.variantGroups.length > 0) {
      onSelectProduct(product);
    } else {
      const discountedPrice = product.discountPercentage
        ? Math.round(product.price * (1 - product.discountPercentage / 100))
        : product.price;
      const cartItem: CartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        product,
        quantity: 1,
        selectedVariants: [],
        unitPrice: discountedPrice,
        totalPrice: discountedPrice,
      };
      addToCart(cartItem);
    }
  };

  return (
    // Outer: fixed height, no overflow — only inner grid scrolls
    <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-slate-100 font-sans select-none overflow-hidden">

      {/* ── Sticky top bar: search + category pills (does NOT scroll) ── */}
      <div className="px-4 pt-4 pb-3 space-y-3 shrink-0">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama menu atau SKU..."
            className="w-full bg-white rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 font-semibold"
            style={{ outline: 'none', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
              selectedCategory === 'ALL' ? 'bg-red-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
            style={{ outline: 'none', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}
          >
            <LayoutGrid className="w-3.5 h-3.5 pointer-events-none" />
            <span>Semua ({entityProducts.length})</span>
          </button>

          {/* Special PROMO Filter Tab */}
          {entityProducts.some(p => p.isPromoActive || p.discountPercentage) && (
            <button
              onClick={() => setSelectedCategory('PROMO')}
              className={`flex items-center gap-1 px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === 'PROMO'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
              }`}
              style={{ outline: 'none' }}
            >
              <span>Promo Menu ({entityProducts.filter(p => p.isPromoActive || p.discountPercentage).length})</span>
            </button>
          )}
          {entityCategories.map(cat => {
            const count = entityProducts.filter(p => p.categoryId === cat.id).length;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isActive ? 'bg-red-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
                style={{ outline: 'none', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Scrollable product grid ONLY ── */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 pb-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3">
            {filteredProducts.map(product => {
              const hasVariants = product.variantGroups && product.variantGroups.length > 0;
              const isLowStock = product.stock > 0 && product.stock <= product.minStockAlert;
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product.id}
                  onClick={() => !isOutOfStock && handleProductClick(product)}
                  className={`product-card group flex flex-col ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden pointer-events-none bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="eager"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                      draggable={false}
                    />
                    {hasVariants && (
                      <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-black px-2 py-0.5 rounded-full pointer-events-none">
                        Varian
                      </span>
                    )}
                    {product.isPromoActive && product.promoTag && (
                      <span className="absolute bottom-2 right-2 bg-red-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full tracking-wider pointer-events-none uppercase shadow-xs">
                        {product.promoTag}
                      </span>
                    )}
                    {product.discountPercentage && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full pointer-events-none">
                        -{product.discountPercentage}%
                      </span>
                    )}
                    {isLowStock && (
                      <span className="absolute bottom-2 left-2 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full pointer-events-none flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Sisa {product.stock}
                      </span>
                    )}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center pointer-events-none">
                        <span className="text-red-600 font-black text-xs tracking-widest">HABIS</span>
                      </div>
                    )}
                  </div>

                  <div className="p-2.5 flex flex-col gap-1 flex-1 pointer-events-none">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.sku}</p>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {product.name}
                    </h4>
                    <div className="mt-auto pt-1.5 border-t border-slate-100">
                      {product.discountPercentage ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs sm:text-sm font-extrabold text-red-600">
                            {formatRupiah(Math.round(product.price * (1 - product.discountPercentage / 100)))}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 line-through">
                            {formatRupiah(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs sm:text-sm font-extrabold text-red-600">
                          {formatRupiah(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <LayoutGrid className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-500">Tidak ada produk ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
};
