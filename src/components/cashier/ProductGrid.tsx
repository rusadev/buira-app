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

  const handleProductClick = (product: Product) => {
    if (product.variantGroups && product.variantGroups.length > 0) {
      onSelectProduct(product);
    } else {
      const cartItem: CartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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
    <div className="flex-1 flex flex-col min-w-0 bg-slate-100 p-4 sm:p-5 space-y-4 overflow-y-auto">
      {/* Search Input for POS Register */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama menu, minuman, atau SKU..."
            className="w-full bg-white border border-slate-300 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 font-bold transition-all"
          />
        </div>
      </div>

      {/* Category Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all flex items-center gap-2 border ${
            selectedCategory === 'ALL'
              ? 'bg-amber-600 text-white border-amber-600'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Semua Menu ({entityProducts.length})</span>
        </button>
        {entityCategories.map(cat => {
          const count = entityProducts.filter(p => p.categoryId === cat.id).length;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>{cat.name} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Product Grid - HIGH VISIBILITY CASHER CARDS */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => {
            const hasVariants = product.variantGroups && product.variantGroups.length > 0;
            const isLowStock = product.stock <= product.minStockAlert;
            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product.id}
                onClick={() => !isOutOfStock && handleProductClick(product)}
                className={`group bg-white border-2 border-slate-200 hover:border-amber-600 rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-150 relative overflow-hidden ${
                  isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-amber-50/20'
                }`}
              >
                {/* Image & Variant Indicators */}
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-slate-100 border border-slate-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {hasVariants && (
                    <span className="absolute top-2 right-2 bg-amber-600 text-white text-xs font-black px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-500">
                      <Sparkles className="w-3 h-3" />
                      Varian
                    </span>
                  )}
                  {isLowStock && !isOutOfStock && (
                    <span className="absolute bottom-2 left-2 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Sisa {product.stock}
                    </span>
                  )}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex items-center justify-center text-rose-600 font-black text-sm">
                      STOK HABIS
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{product.sku}</div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 line-clamp-2 leading-tight group-hover:text-amber-700 transition-colors">
                    {product.name}
                  </h4>
                </div>

                {/* Price & Touch Add Action */}
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-sm sm:text-base font-black text-amber-700">
                    {formatRupiah(product.price)}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white border border-amber-300 flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5 stroke-[3]" />
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
