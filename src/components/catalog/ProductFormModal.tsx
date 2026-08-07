import React, { useState } from 'react';
import type { Product, VariantGroup } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/formatters';
import { X, Plus, Trash2, Sparkles } from 'lucide-react';

interface ProductFormModalProps {
  initialProduct?: Product | null;
  onClose: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ initialProduct, onClose }) => {
  const { currentEntityId, categories, addProduct, updateProduct } = usePOS();

  const entityCategories = categories.filter(c => c.entityId === currentEntityId);

  const [name, setName] = useState<string>(initialProduct?.name || '');
  const [categoryId, setCategoryId] = useState<string>(initialProduct?.categoryId || (entityCategories[0]?.id || ''));
  const [sku, setSku] = useState<string>(initialProduct?.sku || `${currentEntityId === 'coffee_shop' ? 'CS' : 'AG'}-${Math.floor(100 + Math.random() * 900)}`);
  const [barcode, setBarcode] = useState<string>(initialProduct?.barcode || '');
  const [costPrice, setCostPrice] = useState<number>(initialProduct?.costPrice || 0);
  const [price, setPrice] = useState<number>(initialProduct?.price || 0);
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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>{initialProduct ? 'Edit Produk Katalog' : 'Tambah Produk Baru (Katalog Majoo)'}</span>
          </h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-800">Nama Produk *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Misal: Kopi Susu Gula Aren"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Kategori Produk</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
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
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-800">Barcode / EAN</label>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="8991001001"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Harga Modal / HPP (Rp)</label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Harga Jual Kasir (Rp)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-amber-700 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Margin Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs font-semibold">
            <div>
              <span className="text-slate-500 block">Estimasi Keuntungan:</span>
              <span className="font-extrabold text-emerald-700 text-sm">{formatRupiah(profitAmount)}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Margin Keuntungan (%):</span>
              <span className="font-extrabold text-amber-700 text-sm">{marginPercentage}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Jumlah Stok</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Min Stok Alert</label>
              <input
                type="number"
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
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
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">URL Foto Produk</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActiveCheck"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 border-slate-300"
            />
            <label htmlFor="isActiveCheck" className="text-xs font-bold text-slate-800">
              Produk Aktif (Tampil di Kasir)
            </label>
          </div>

          {/* Varian Groups */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Pengaturan Varian & Modifier</span>
              </div>
              <button
                type="button"
                onClick={handleAddVariantGroup}
                className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Grup Varian</span>
              </button>
            </div>

            {variantGroups.map(group => (
              <div key={group.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={group.name}
                    onChange={(e) => handleUpdateGroupTitle(group.id, e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveGroup(group.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 pl-2">
                  {group.options.map(opt => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={opt.name}
                        onChange={(e) => handleUpdateOption(group.id, opt.id, e.target.value, opt.priceModifier)}
                        placeholder="Nama Opsi"
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-medium"
                      />
                      <div className="flex items-center gap-1 w-32">
                        <span className="text-[10px] text-slate-500 font-bold">+Rp</span>
                        <input
                          type="number"
                          value={opt.priceModifier}
                          onChange={(e) => handleUpdateOption(group.id, opt.id, opt.name, parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-amber-700 font-bold"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(group.id, opt.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddOptionToGroup(group.id)}
                    className="text-[11px] text-amber-700 font-bold hover:underline flex items-center gap-1 pt-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Opsi</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-none transition-all"
            >
              Simpan Ke Katalog Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
