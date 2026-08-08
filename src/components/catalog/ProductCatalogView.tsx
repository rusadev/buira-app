import React, { useState } from 'react';
import type { Product } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/formatters';
import { ProductFormModal } from './ProductFormModal';
import { CategoryManagerModal } from './CategoryManagerModal';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Package, 
  AlertTriangle, 
  Tag, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  X
} from 'lucide-react';

export const ProductCatalogView: React.FC = () => {
  const { products, categories, currentEntityId, deleteProduct, updateProduct } = usePOS();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 8;

  const entityProducts = products.filter(p => p.entityId === currentEntityId);
  const entityCategories = categories.filter(c => c.entityId === currentEntityId);

  const filteredProducts = entityProducts.filter(p => {
    const matchesCategory = selectedCategoryId === 'ALL' || p.categoryId === selectedCategoryId;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleToggleActive = (product: Product) => {
    updateProduct({
      ...product,
      isActive: !product.isActive
    });
  };

  const handleConfirmDelete = () => {
    if (deletingProduct) {
      deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-4 sm:p-6 space-y-5 overflow-y-auto font-sans select-none">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-red-600" />
            <span>Katalog Produk & Harga (Master Data)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Kelola daftar menu, varian, HPP modal, dan harga jual produk kasir.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-extrabold px-3.5 py-2.5 rounded-none text-xs flex items-center gap-2"
            style={{ outline: 'none' }}
          >
            <Tag className="w-4 h-4 text-red-600" />
            <span>Kelola Kategori ({entityCategories.length})</span>
          </button>

          <button
            onClick={handleCreateNew}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-4 py-2.5 rounded-none text-xs flex items-center gap-2"
            style={{ outline: 'none', border: 'none' }}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-none border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nama produk atau SKU..."
            className="w-full bg-slate-50 rounded-none pl-10 pr-4 py-2 text-xs text-slate-800 font-bold border border-slate-200"
            style={{ outline: 'none' }}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 text-slate-800 text-xs rounded-none px-3.5 py-2 font-extrabold border border-slate-200"
            style={{ outline: 'none' }}
          >
            <option value="ALL">Semua Kategori ({entityProducts.length})</option>
            {entityCategories.map(cat => {
              const count = entityProducts.filter(p => p.categoryId === cat.id).length;
              return (
                <option key={cat.id} value={cat.id}>{cat.name} ({count})</option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Catalog Table Container */}
      <div className="bg-white border border-slate-200 rounded-none overflow-hidden flex flex-col justify-between">
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
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map(product => {
                  const cat = categories.find(c => c.id === product.categoryId);
                  const margin = product.price - product.costPrice;
                  const marginPercent = product.price > 0 ? ((margin / product.price) * 100).toFixed(0) : 0;
                  const isLowStock = product.stock <= product.minStockAlert;

                  return (
                    <tr key={product.id} className={`hover:bg-slate-50 ${!product.isActive ? 'opacity-60 bg-slate-50/50' : ''}`}>
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-none object-cover border border-slate-200 bg-slate-100 shrink-0"
                          />
                          <div>
                            <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 flex-wrap">
                              <span>{product.name}</span>
                              {product.isBestSeller && (
                                <span className="text-[9px] text-white bg-slate-900 px-1.5 py-0.5 rounded-none font-black tracking-wider uppercase">
                                  Best Seller
                                </span>
                              )}
                              {product.isRecommended && (
                                <span className="text-[9px] text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-none font-black tracking-wider uppercase">
                                  Rekomendasi
                                </span>
                              )}
                              {product.isPromoActive && product.promoTag && (
                                <span className="text-[9px] text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-none font-black tracking-wider uppercase">
                                  {product.promoTag}
                                </span>
                              )}
                              {product.discountPercentage && (
                                <span className="text-[10px] text-white bg-red-600 px-1.5 py-0.5 rounded-none font-black">
                                  -{product.discountPercentage}%
                                </span>
                              )}
                              {product.variantGroups && product.variantGroups.length > 0 && (
                                <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-none border border-slate-200 font-bold">
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
                            <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded-none text-[10px] font-bold border border-rose-200 flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              Menipis
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(product)}
                            title={product.isActive ? 'Nonaktifkan dari Kasir' : 'Aktifkan ke Kasir'}
                            className={`p-1.5 rounded-none border text-[10px] font-extrabold flex items-center gap-1 ${
                              product.isActive 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            }`}
                            style={{ outline: 'none' }}
                          >
                            {product.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="p-1.5 rounded-none bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-red-600"
                            style={{ outline: 'none' }}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setDeletingProduct(product)}
                            className="p-1.5 rounded-none bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-rose-600"
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

        {/* Pagination Bar */}
        {filteredProducts.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-slate-600">
            <div>
              Menampilkan <span className="text-slate-900 font-extrabold">{startIndex + 1}</span> - <span className="text-slate-900 font-extrabold">{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}</span> dari <span className="text-slate-900 font-extrabold">{filteredProducts.length}</span> produk
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
                className={`p-2 rounded-none border flex items-center justify-center ${
                  safeCurrentPage === 1 
                    ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                style={{ outline: 'none' }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-none text-xs font-extrabold flex items-center justify-center ${
                    safeCurrentPage === page
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                  style={{ outline: 'none' }}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage === totalPages}
                className={`p-2 rounded-none border flex items-center justify-center ${
                  safeCurrentPage === totalPages 
                    ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                style={{ outline: 'none' }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isFormOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryManagerModal
          onClose={() => setIsCategoryModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-none w-full max-w-sm overflow-hidden p-5 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-extrabold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>Hapus Produk?</span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Apakah Anda yakin ingin menghapus produk <strong>{deletingProduct.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="flex-1 py-2.5 rounded-none border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
                style={{ outline: 'none' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-none bg-rose-600 text-white text-xs font-extrabold hover:bg-rose-700"
                style={{ outline: 'none', border: 'none' }}
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
