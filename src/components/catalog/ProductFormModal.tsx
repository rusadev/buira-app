import React, { useState } from 'react';
import type { Product, VariantGroup } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/formatters';
import { X, Plus, Trash2, Sparkles, Package, DollarSign, Layers } from 'lucide-react';

interface ProductFormModalProps {
  initialProduct?: Product | null;
  onClose: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ initialProduct, onClose }) => {
  const { currentEntityId, categories, addProduct, updateProduct } = usePOS();
  const entityCategories = categories.filter(c => c.entityId === currentEntityId);

  const [activeTab, setActiveTab] = useState<'info' | 'variants'>('info');

  const [name, setName] = useState<string>(initialProduct?.name || '');
  const [categoryId, setCategoryId] = useState<string>(initialProduct?.categoryId || (entityCategories[0]?.id || ''));
  const [sku, setSku] = useState<string>(initialProduct?.sku || `${currentEntityId === 'coffee_shop' ? 'CS' : 'AG'}-${Math.floor(100 + Math.random() * 900)}`);
  const [barcode, setBarcode] = useState<string>(initialProduct?.barcode || '');
  const [costPrice, setCostPrice] = useState<number>(initialProduct?.costPrice || 0);
  const [price, setPrice] = useState<number>(initialProduct?.price || 0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(initialProduct?.discountPercentage || 0);
  const [stock, setStock] = useState<number>(initialProduct?.stock || 50);
  const [minStockAlert, setMinStockAlert] = useState<number>(initialProduct?.minStockAlert || 10);
  const [image, setImage] = useState<string>(initialProduct?.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60');
  const [description, setDescription] = useState<string>(initialProduct?.description || '');
  const [isActive, setIsActive] = useState<boolean>(initialProduct?.isActive ?? true);

  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>(initialProduct?.variantGroups || []);

  const profitAmount = price - costPrice;
  const marginPercentage = price > 0 ? ((profitAmount / price) * 100).toFixed(1) : '0';

  const handleAddVariantGroup = () => {
    const newGroup: VariantGroup = {
      id: `vg_${Date.now()}`,
      name: 'Varian Baru (misal: Sugar Level / Level Pedas)',
      required: true,
      options: [
        { id: `opt_${Date.now()}_1`, name: 'Opsi 1', priceModifier: 0 },
        { id: `opt_${Date.now()}_2`, name: 'Opsi 2', priceModifier: 2000 }
      ]
    };
    setVariantGroups([...variantGroups, newGroup]);
  };

  const handleUpdateGroupTitle = (groupId: string, newTitle: string) => {
    setVariantGroups(variantGroups.map(g => g.id === groupId ? { ...g, name: newTitle } : g));
  };

  const handleAddOptionToGroup = (groupId: string) => {
    setVariantGroups(variantGroups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          options: [...g.options, { id: `opt_${Date.now()}`, name: 'Opsi Baru', priceModifier: 0 }]
        };
      }
      return g;
    }));
  };

  const handleUpdateOption = (groupId: string, optionId: string, name: string, priceModifier: number) => {
    setVariantGroups(variantGroups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          options: g.options.map(o => o.id === optionId ? { ...o, name, priceModifier } : o)
        };
      }
      return g;
    }));
  };

  const handleRemoveOption = (groupId: string, optionId: string) => {
    setVariantGroups(variantGroups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          options: g.options.filter(o => o.id !== optionId)
        };
      }
      return g;
    }));
  };

  const handleRemoveGroup = (groupId: string) => {
    setVariantGroups(variantGroups.filter(g => g.id !== groupId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (initialProduct) {
      updateProduct({
        ...initialProduct,
        name,
        categoryId,
        sku,
        barcode,
        costPrice,
        price,
        discountPercentage: discountPercentage > 0 ? discountPercentage : undefined,
        stock,
        minStockAlert,
        image,
        description,
        variantGroups,
        isActive
      });
    } else {
      addProduct({
        entityId: currentEntityId,
        name,
        categoryId,
        sku,
        barcode,
        costPrice,
        price,
        discountPercentage: discountPercentage > 0 ? discountPercentage : undefined,
        stock,
        minStockAlert,
        image,
        description,
        variantGroups,
        isActive
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]" style={{ border: '1px solid #e2e8f0' }}>
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-red-600" />
            <span>{initialProduct ? 'Edit Produk Katalog' : 'Tambah Produk Baru'}</span>
          </h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            style={{ outline: 'none' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation System */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 px-4 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all border-b-2 ${
              activeTab === 'info'
                ? 'bg-white text-red-600 border-red-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
            style={{ outline: 'none' }}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>1. Informasi & Harga</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('variants')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all border-b-2 ${
              activeTab === 'variants'
                ? 'bg-white text-red-600 border-red-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
            style={{ outline: 'none' }}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Varian & Modifier ({variantGroups.length})</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: INFORMASI UMUM & HARGA */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-800">Nama Produk *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Misal: Kopi Susu Gula Aren"
                    className="w-full bg-slate-50 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold"
                    style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Kategori Produk</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                    style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                  >
                    {entityCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Kode SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                    style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Harga Modal / HPP (Rp)</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                    style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Harga Jual Kasir (Rp)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs font-black text-red-600"
                    style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-800">Diskon Produk (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
                    placeholder="0 (misal: 10 untuk 10%)"
                    className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs font-black text-red-600"
                    style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                  />
                </div>
              </div>

              {/* Profit Margin Card */}
              <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between text-xs font-semibold" style={{ border: '1px solid #e2e8f0' }}>
                <div>
                  <span className="text-slate-500 block font-bold">Estimasi Keuntungan:</span>
                  <span className="font-black text-emerald-600 text-sm">{formatRupiah(profitAmount)}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block font-bold">Margin Keuntungan (%):</span>
                  <span className="font-black text-red-600 text-sm">{marginPercentage}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Jumlah Stok</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                    style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Min Stok Alert</label>
                  <input
                    type="number"
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                    style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi bahan/rasa..."
                  className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                  style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">URL Foto Produk</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                  style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 border-slate-300"
                />
                <label htmlFor="isActiveCheck" className="text-xs font-bold text-slate-800">
                  Produk Aktif (Tampil di Kasir)
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: VARIAN & MODIFIER */}
          {activeTab === 'variants' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-red-50/60 p-3 rounded-xl border border-red-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-600" />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Grup Varian & Modifier</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Tambahkan kustomisasi produk (suhu, level gula/pedas, topping)</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariantGroup}
                  className="px-3 py-1.5 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-extrabold flex items-center gap-1 shrink-0"
                  style={{ outline: 'none', border: 'none' }}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Tambah Grup</span>
                </button>
              </div>

              {variantGroups.length > 0 ? (
                variantGroups.map(group => (
                  <div key={group.id} className="bg-slate-50 rounded-xl p-3.5 space-y-3" style={{ border: '1px solid #e2e8f0' }}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={group.name}
                          onChange={(e) => handleUpdateGroupTitle(group.id, e.target.value)}
                          placeholder="Nama Grup Varian..."
                          className="flex-1 bg-white rounded-lg px-2.5 py-1.5 text-xs font-extrabold text-slate-900"
                          style={{ outline: 'none', border: '1px solid #cbd5e1' }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveGroup(group.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 pl-2">
                      {group.options.map(opt => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={opt.name}
                            onChange={(e) => handleUpdateOption(group.id, opt.id, e.target.value, opt.priceModifier)}
                            placeholder="Nama Opsi"
                            className="flex-1 bg-white rounded-lg px-2.5 py-1 text-xs text-slate-800 font-bold"
                            style={{ outline: 'none', border: '1px solid #cbd5e1' }}
                          />
                          <div className="flex items-center gap-1 w-36">
                            <span className="text-[10px] text-slate-500 font-extrabold">+Rp</span>
                            <input
                              type="number"
                              value={opt.priceModifier}
                              onChange={(e) => handleUpdateOption(group.id, opt.id, opt.name, parseFloat(e.target.value) || 0)}
                              className="w-full bg-white rounded-lg px-2 py-1 text-xs text-red-600 font-extrabold"
                              style={{ outline: 'none', border: '1px solid #cbd5e1' }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(group.id, opt.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddOptionToGroup(group.id)}
                        className="text-xs text-red-600 font-extrabold hover:underline flex items-center gap-1 pt-1"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Tambah Opsi Opsi Baru</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                  <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-bold">Produk ini belum memiliki varian atau modifier.</p>
                  <button
                    type="button"
                    onClick={handleAddVariantGroup}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-extrabold"
                    style={{ outline: 'none', border: 'none' }}
                  >
                    Tambah Grup Varian Pertama
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            {activeTab === 'info' && variantGroups.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('variants')}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all"
                style={{ outline: 'none', border: 'none' }}
              >
                Lanjut ke Varian →
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl text-white font-extrabold text-xs transition-all"
              style={{ outline: 'none', border: 'none', background: '#dc2626' }}
            >
              Simpan Ke Katalog Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
