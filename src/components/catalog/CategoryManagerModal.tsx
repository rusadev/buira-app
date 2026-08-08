import React, { useState } from 'react';
import type { Category } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { X, Plus, Edit3, Trash2, Tag, LayoutGrid } from 'lucide-react';

interface CategoryManagerModalProps {
  onClose: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({ onClose }) => {
  const { categories, currentEntityId, addCategory, updateCategory, deleteCategory, products } = usePOS();

  const entityCategories = categories.filter(c => c.entityId === currentEntityId);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCatName, setNewCatName] = useState<string>('');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      entityId: currentEntityId,
      name: newCatName.trim(),
      iconName: 'Tag',
      color: 'bg-red-600'
    });

    setNewCatName('');
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) return;

    updateCategory(editingCategory);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (catId: string) => {
    const productCount = products.filter(p => p.categoryId === catId).length;
    if (productCount > 0) {
      alert(`Kategori ini memiliki ${productCount} produk. Pindahkan produk ke kategori lain terlebih dahulu sebelum menghapus.`);
      return;
    }

    if (window.confirm('Hapus kategori menu ini?')) {
      deleteCategory(catId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-white rounded-none w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]" style={{ border: '1px solid #e2e8f0' }}>

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Kelola Kategori Menu</h3>
              <p className="text-xs text-slate-500 font-medium">Tambah, ubah, atau hapus kategori produk kasir</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-none bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            style={{ outline: 'none', border: 'none' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">

          {/* Form Tambah Kategori Baru */}
          <form onSubmit={handleCreateCategory} className="flex gap-2">
            <input
              type="text"
              required
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              placeholder="Nama Kategori Baru (misal: Snack / Dessert)..."
              className="flex-1 bg-slate-50 rounded-none px-3.5 py-2 text-xs font-bold text-slate-900"
              style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-none text-white font-extrabold text-xs transition-colors flex items-center gap-1 shrink-0"
              style={{ outline: 'none', border: 'none', background: '#dc2626' }}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Tambah</span>
            </button>
          </form>

          {/* Form Edit jika sedang edit */}
          {editingCategory && (
            <form onSubmit={handleUpdateCategory} className="p-3 bg-red-50/70 border border-red-200 rounded-none space-y-2">
              <label className="text-[11px] font-extrabold text-red-700 block">Edit Nama Kategori</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="flex-1 bg-white rounded-none px-3 py-1.5 text-xs font-extrabold text-slate-900"
                  style={{ outline: 'none', border: '1.5px solid #fca5a5' }}
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-none bg-red-600 text-white font-extrabold text-xs"
                  style={{ outline: 'none', border: 'none' }}
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-3 py-1.5 rounded-none bg-white border border-slate-200 text-slate-600 font-bold text-xs"
                  style={{ outline: 'none' }}
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          {/* Category List */}
          <div className="space-y-2 pt-1">
            <p className="text-xs font-extrabold text-slate-800">Daftar Kategori Aktif ({entityCategories.length})</p>
            
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-none overflow-hidden bg-white">
              {entityCategories.length > 0 ? (
                entityCategories.map(cat => {
                  const count = products.filter(p => p.categoryId === cat.id).length;
                  return (
                    <div key={cat.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-none bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          <Tag className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900">{cat.name}</h4>
                          <span className="text-[10px] text-slate-500 font-bold">{count} Produk</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingCategory(cat)}
                          className="p-1.5 rounded-none bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-red-600 transition-colors"
                          style={{ outline: 'none' }}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 rounded-none bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors"
                          style={{ outline: 'none' }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 font-bold">
                  Belum ada kategori menu.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-none border border-slate-200 text-xs font-extrabold text-slate-700 hover:bg-slate-100 transition-colors"
            style={{ outline: 'none' }}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
