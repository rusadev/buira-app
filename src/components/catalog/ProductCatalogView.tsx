import React, { useState } from 'react';
import type { Product } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/formatters';
import { ProductFormModal } from './ProductFormModal';
import { Plus, Search, Edit3, Trash2, Package, AlertTriangle } from 'lucide-react';

export const ProductCatalogView: React.FC = () => {
  const { products, categories, currentEntityId, deleteProduct } = usePOS();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const entityProducts = products.filter(p => p.entityId === currentEntityId);
  const entityCategories = categories.filter(c => c.entityId === currentEntityId);

  const filteredProducts = entityProducts.filter(p => {
    const matchesCategory = selectedCategoryId === 'ALL' || p.categoryId === selectedCategoryId;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-5 overflow-y-auto font-sans select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-red-600" />
            <span>Katalog Produk & Harga (Master Data)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Kelola daftar menu, varian, HPP modal, dan harga jual produk kasir.</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all"
          style={{ outline: 'none', border: 'none' }}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama produk atau SKU..."
            className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 font-bold"
            style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="bg-slate-50 text-slate-800 text-xs rounded-xl px-3 py-2 font-extrabold"
            style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
          >
            <option value="ALL">Semua Kategori</option>
            {entityCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Produk</th>
                <th className="p-3.5">SKU / Kategori</th>
                <th className="p-3.5">HPP (Modal)</th>
                <th className="p-3.5">Harga Jual</th>
                <th className="p-3.5">Profit Margin</th>
                <th className="p-3.5">Stok & Status</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => {
                  const cat = categories.find(c => c.id === product.categoryId);
                  const margin = product.price - product.costPrice;
                  const marginPercent = product.price > 0 ? ((margin / product.price) * 100).toFixed(0) : 0;
                  const isLowStock = product.stock <= product.minStockAlert;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                          />
                          <div>
                            <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                              <span>{product.name}</span>
                              {product.discountPercentage && (
                                <span className="text-[10px] text-white bg-red-600 px-1.5 py-0.5 rounded font-black">
                                  -{product.discountPercentage}%
                                </span>
                              )}
                              {product.variantGroups && product.variantGroups.length > 0 && (
                                <span className="text-[10px] text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 font-bold">
                                  {product.variantGroups.length} Varian
                                </span>
                              )}
                            </h4>
                            <p className="text-[10px] text-slate-500 line-clamp-1">{product.description || 'Tidak ada deskripsi'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-mono text-slate-500 font-bold">{product.sku}</div>
                        <div className="text-[10px] text-red-600 font-bold">{cat?.name || 'Tanpa Kategori'}</div>
                      </td>

                      <td className="p-3.5 font-bold text-slate-500">
                        {formatRupiah(product.costPrice)}
                      </td>

                      <td className="p-3.5 font-black text-red-600">
                        {formatRupiah(product.price)}
                      </td>

                      <td className="p-3.5">
                        <span className="font-extrabold text-emerald-600 block">{formatRupiah(margin)}</span>
                        <span className="text-[10px] text-slate-500 font-bold">{marginPercent}% Margin</span>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isLowStock ? 'text-rose-600' : 'text-slate-800'}`}>
                            {product.stock} Porsi
                          </span>
                          {isLowStock && (
                            <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-rose-200 flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              Menipis
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-red-600 transition-colors"
                            style={{ outline: 'none' }}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors"
                            style={{ outline: 'none' }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-bold">
                    Belum ada produk terdaftar di katalog.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <ProductFormModal
          initialProduct={editingProduct}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};
