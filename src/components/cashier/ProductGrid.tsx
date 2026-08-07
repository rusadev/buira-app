import React, { useState } from 'react';
import type { Product, CartItem } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/formatters';
import { Search, Plus, Layers, AlertCircle, Sparkles } from 'lucide-react';

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
    const matchesCategory = selectedCategory === 'ALL' || p.categoryId === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variantGroups && product.variantGroups.length > 0) {
      onSelectProduct(product);
    } else {
      const cartItem: CartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        product,
        quantity: 1,
        selectedVariants: [],
        unitPrice: product.price,
        totalPrice: product.price
      };
      addToCart(cartItem);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-100 p-3.5 sm:p-4 space-y-3.5 overflow-y-auto font-sans select-none">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama menu, minuman, atau SKU..."
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-600 font-bold transition-all outline-none"
          />
        </div>
      </div>

      {/* Category Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border active:scale-95 ${
            selectedCategory === 'ALL'
              ? 'bg-red-600 text-white border-red-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Semua Menu ({entityProducts.length})</span>
        </button>
        {entityCategories.map(cat => {
          const count = entityProducts.filter(p => p.categoryId === cat.id).length;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border active:scale-95 ${
                isSelected
                  ? 'bg-red-600 text-white border-red-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>{cat.name} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Product Grid - INSTANT 0MS RESPONSE & NO OUTLINE FLASH */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3.5">
          {filteredProducts.map(product => {
            const hasVariants = product.variantGroups && product.variantGroups.length > 0;
            const isLowStock = product.stock <= product.minStockAlert;
            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product.id}
                onClick={(e) => !isOutOfStock && handleProductClick(product, e)}
                className={`group bg-white border border-slate-200 hover:border-red-600 rounded-xl p-2.5 flex flex-col justify-between transition-all duration-75 relative overflow-hidden select-none outline-none ${
                  isOutOfStock 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-pointer hover:bg-red-50/20 active:scale-[0.98]'
                }`}
              >
                {/* Compact Image */}
                <div className="relative h-24 sm:h-28 w-full rounded-lg overflow-hidden mb-2 bg-slate-100 border border-slate-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="eager"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {hasVariants && (
                    <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-red-500 shadow-xs">
                      <Sparkles className="w-2.5 h-2.5" />
                      Varian
                    </span>
                  )}
                  {isLowStock && !isOutOfStock && (
                    <span className="absolute bottom-1.5 left-1.5 bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <AlertCircle className="w-2.5 h-2.5" />
                      Sisa {product.stock}
                    </span>
                  )}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex items-center justify-center text-red-600 font-black text-xs">
                      HABIS
                    </div>
                  )}
                </div>

                {/* Title & SKU */}
                <div className="space-y-0.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.sku}</div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-red-700 transition-colors">
                    {product.name}
                  </h4>
                </div>

                {/* Price & Add Stepper */}
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-extrabold text-red-700">
                    {formatRupiah(product.price)}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-red-700 group-hover:bg-red-600 group-hover:text-white border border-red-200 flex items-center justify-center transition-colors">
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 space-y-2">
          <Layers className="w-12 h-12 stroke-1 text-slate-300" />
          <p className="text-sm font-bold text-slate-600">Tidak ada produk ditemukan.</p>
        </div>
      )}
    </div>
  );
};
