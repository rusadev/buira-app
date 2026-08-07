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
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-4 space-y-4 overflow-y-auto">
      {/* Top Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama produk, SKU, atau varian..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all font-medium"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
            selectedCategory === 'ALL'
              ? 'bg-amber-600 text-white border-amber-600'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Semua Kategori ({entityProducts.length})</span>
        </button>
        {entityCategories.map(cat => {
          const count = entityProducts.filter(p => p.categoryId === cat.id).length;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              <span>{cat.name} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Products Grid - FLAT LIGHT CARDS */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredProducts.map(product => {
            const hasVariants = product.variantGroups && product.variantGroups.length > 0;
            const isLowStock = product.stock <= product.minStockAlert;
            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product.id}
                onClick={() => !isOutOfStock && handleProductClick(product)}
                className={`group bg-white border border-slate-200 hover:border-amber-500 rounded-2xl p-3 flex flex-col justify-between transition-all duration-150 relative overflow-hidden ${
                  isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-amber-50/20'
                }`}
              >
                {/* Image */}
                <div className="relative aspect-video rounded-xl overflow-hidden mb-2.5 bg-slate-100 border border-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {hasVariants && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Varian
                    </span>
                  )}
                  {isLowStock && !isOutOfStock && (
                    <span className="absolute bottom-2 left-2 bg-rose-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" />
                      Sisa {product.stock}
                    </span>
                  )}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center text-rose-600 font-extrabold text-xs">
                      STOK HABIS
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-0.5">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{product.sku}</div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {product.name}
                  </h4>
                </div>

                {/* Price & Action */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-600">
                    {formatRupiah(product.price)}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white border border-amber-200 flex items-center justify-center transition-colors">
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
          <Layers className="w-10 h-10 stroke-1 text-slate-300" />
          <p className="text-xs font-medium">Tidak ada produk ditemukan.</p>
        </div>
      )}
    </div>
  );
};
