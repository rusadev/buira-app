import React, { useState } from 'react';
import type { Product, VariantGroup } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/formatters';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  Package, 
  DollarSign, 
  Layers, 
  Upload, 
  Image as ImageIcon,
  Tag,
  Check,
  Percent
} from 'lucide-react';

interface ProductFormModalProps {
  initialProduct?: Product | null;
  onClose: () => void;
}

const PRESET_IMAGES = [
  { label: 'Kopi Espresso / Hot', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60' },
  { label: 'Kopi Susu / Ice Latte', url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60' },
  { label: 'Matcha Green Tea', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60' },
  { label: 'Croissant / Pastry', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60' },
  { label: 'Ayam Geprek Pedas', url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60' },
  { label: 'Chocolate Cake', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60' },
  { label: 'Es Teh Manis', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60' },
];

const PROMO_TAGS = ['PROMO SPESIAL', 'BUY 1 GET 1', 'FLASH SALE', 'BUNDLING HEMAT', 'BEST DEAL'];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ initialProduct, onClose }) => {
  const { currentEntityId, categories, addProduct, updateProduct } = usePOS();
  const entityCategories = categories.filter(c => c.entityId === currentEntityId);

  const [activeTab, setActiveTab] = useState<'info' | 'image' | 'variants'>('info');

  const [name, setName] = useState<string>(initialProduct?.name || '');
  const [categoryId, setCategoryId] = useState<string>(initialProduct?.categoryId || (entityCategories[0]?.id || ''));
  const [sku, setSku] = useState<string>(initialProduct?.sku || `${currentEntityId === 'coffee_shop' ? 'CS' : 'AG'}-${Math.floor(100 + Math.random() * 900)}`);
  const [barcode, setBarcode] = useState<string>(initialProduct?.barcode || '');
  const [costPrice, setCostPrice] = useState<number>(initialProduct?.costPrice || 0);
  const [price, setPrice] = useState<number>(initialProduct?.price || 0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(initialProduct?.discountPercentage || 0);
  const [promoTag, setPromoTag] = useState<string>(initialProduct?.promoTag || '');
  const [isPromoActive, setIsPromoActive] = useState<boolean>(initialProduct?.isPromoActive ?? false);
  const [isBestSeller, setIsBestSeller] = useState<boolean>(initialProduct?.isBestSeller ?? false);
  const [isRecommended, setIsRecommended] = useState<boolean>(initialProduct?.isRecommended ?? false);
  const [stock, setStock] = useState<number>(initialProduct?.stock || 50);
  const [minStockAlert, setMinStockAlert] = useState<number>(initialProduct?.minStockAlert || 10);
  const [image, setImage] = useState<string>(initialProduct?.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60');
  const [description, setDescription] = useState<string>(initialProduct?.description || '');
  const [isActive, setIsActive] = useState<boolean>(initialProduct?.isActive ?? true);

  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>(initialProduct?.variantGroups || []);

  const profitAmount = price - costPrice;
  const marginPercentage = price > 0 ? ((profitAmount / price) * 100).toFixed(1) : '0';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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

    const payloadData = {
      name,
      categoryId,
      sku,
      barcode,
      costPrice,
      price,
      discountPercentage: discountPercentage > 0 ? discountPercentage : undefined,
      promoTag: isPromoActive && promoTag.trim() ? promoTag.trim() : undefined,
      isPromoActive: isPromoActive && !!promoTag.trim(),
      isBestSeller,
      isRecommended,
      stock,
      minStockAlert,
      image,
      description,
      variantGroups,
      isActive
    };

    if (initialProduct) {
      updateProduct({
        ...initialProduct,
        ...payloadData
      });
    } else {
      addProduct({
        entityId: currentEntityId,
        ...payloadData
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-white rounded-none w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-red-600" />
            <span>{initialProduct ? 'Edit Produk Katalog' : 'Tambah Produk Baru'}</span>
          </h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-none bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            style={{ outline: 'none' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation System (3 Tabs) */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 px-4 pt-2 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-none text-xs font-extrabold transition-all border-b-2 shrink-0 ${
              activeTab === 'info'
                ? 'bg-white text-red-600 border-red-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
            style={{ outline: 'none' }}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>1. Info & Harga</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-none text-xs font-extrabold transition-all border-b-2 shrink-0 ${
              activeTab === 'image'
                ? 'bg-white text-red-600 border-red-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
            style={{ outline: 'none' }}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>2. Foto Produk</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('variants')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-none text-xs font-extrabold transition-all border-b-2 shrink-0 ${
              activeTab === 'variants'
                ? 'bg-white text-red-600 border-red-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
            style={{ outline: 'none' }}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. Varian ({variantGroups.length})</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: INFORMASI UMUM & HARGA & PROMO */}
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
                    className="w-full bg-slate-50 rounded-none px-3.5 py-2 text-xs text-slate-900 font-bold"
                    style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Kategori Produk</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-50 rounded-none px-3 py-2 text-xs text-slate-900 font-bold"
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
                    className="w-full bg-slate-50 rounded-none px-3 py-2 text-xs text-slate-900 font-bold"
                    style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Harga Modal / HPP (Rp)</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 rounded-none px-3 py-2 text-xs text-slate-900 font-bold"
                    style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Harga Jual Kasir (Rp)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 rounded-none px-3 py-2 text-xs font-black text-red-600"
                    style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                  />
                </div>
              </div>

              {/* Profit Margin Card */}
              <div className="bg-slate-50 rounded-none p-3 flex items-center justify-between text-xs font-semibold" style={{ border: '1px solid #e2e8f0' }}>
                <div>
                  <span className="text-slate-500 block font-bold">Estimasi Keuntungan:</span>
                  <span className="font-black text-emerald-600 text-sm">{formatRupiah(profitAmount)}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block font-bold">Margin Keuntungan (%):</span>
                  <span className="font-black text-red-600 text-sm">{marginPercentage}%</span>
                </div>
              </div>

              {/* ── BAGIAN PROMO & SPECIAL CAMPAIGN ── */}
              <div className="p-3.5 bg-red-50/60 rounded-none border border-red-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-extrabold text-slate-900">Pengaturan Promo & Label Badge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPromoActiveCheck"
                      checked={isPromoActive}
                      onChange={(e) => setIsPromoActive(e.target.checked)}
                      className="w-4 h-4 rounded text-red-600 border-slate-300"
                    />
                    <label htmlFor="isPromoActiveCheck" className="text-xs font-extrabold text-red-700">
                      Aktifkan Promo
                    </label>
                  </div>
                </div>

                {isPromoActive && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-800">Label Badge Promo</label>
                      <input
                        type="text"
                        value={promoTag}
                        onChange={(e) => setPromoTag(e.target.value)}
                        placeholder="Misal: PROMO SPESIAL / BUY 1 GET 1"
                        className="w-full bg-white rounded-none px-3 py-1.5 text-xs font-extrabold text-red-600"
                        style={{ outline: 'none', border: '1.5px solid #fca5a5' }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-800">Potongan Diskon (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
                        placeholder="0 (misal: 15 untuk 15%)"
                        className="w-full bg-white rounded-none px-3 py-1.5 text-xs font-extrabold text-red-600"
                        style={{ outline: 'none', border: '1.5px solid #fca5a5' }}
                      />
                    </div>

                    {/* Quick Preset Promo Tags */}
                    <div className="col-span-2 flex flex-wrap gap-1 pt-1">
                      {PROMO_TAGS.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setPromoTag(tag)}
                          className="text-[10px] font-extrabold px-2 py-0.5 rounded-none bg-white hover:bg-red-600 hover:text-white text-red-600 border border-red-200 transition-colors"
                          style={{ outline: 'none' }}
                        >
                          +{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Jumlah Stok</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 rounded-none px-3 py-2 text-xs text-slate-900 font-bold"
                    style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Min Stok Alert</label>
                  <input
                    type="number"
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 rounded-none px-3 py-2 text-xs text-slate-900 font-bold"
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
                  className="w-full bg-slate-50 rounded-none px-3 py-2 text-xs text-slate-900 font-bold"
                  style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isBestSellerCheck"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 border-slate-300"
                  />
                  <label htmlFor="isBestSellerCheck" className="text-xs font-extrabold text-slate-800">
                    Tandai Best Seller
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isRecommendedCheck"
                    checked={isRecommended}
                    onChange={(e) => setIsRecommended(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 border-slate-300"
                  />
                  <label htmlFor="isRecommendedCheck" className="text-xs font-extrabold text-slate-800">
                    Tandai Rekomendasi (Chef/Barista Choice)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 border-slate-300"
                  />
                  <label htmlFor="isActiveCheck" className="text-xs font-extrabold text-slate-800">
                    Produk Aktif di Kasir
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD & GALERI FOTO PRODUK */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              
              {/* Preview Box */}
              <div className="p-4 bg-slate-50 rounded-none border border-slate-200 flex flex-col items-center justify-center gap-3 text-center">
                <div className="w-40 h-32 rounded-none overflow-hidden border-2 border-white shadow-md relative bg-slate-200">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  {isPromoActive && promoTag && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-none">
                      {promoTag}
                    </span>
                  )}
                </div>
                <span className="text-xs font-extrabold text-slate-700">Preview Foto Produk</span>
              </div>

              {/* Upload Dropzone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Upload Foto Dari Komputer / HP</label>
                <label className="border-2 border-dashed border-red-200 hover:border-red-500 bg-red-50/40 rounded-none p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                  <Upload className="w-6 h-6 text-red-600" />
                  <div className="text-xs font-extrabold text-slate-800">
                    Klik untuk memilih file gambar (PNG, JPG, WEBP)
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">Foto otomatis diproses ke format Base64 instan</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Preset F&B Photo Gallery */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 block">Atau Pilih Dari Galeri Foto F&B Presets (1-Klik)</label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_IMAGES.map((preset, idx) => {
                    const isSelected = image === preset.url;
                    return (
                      <div
                        key={idx}
                        onClick={() => setImage(preset.url)}
                        className={`group relative rounded-none overflow-hidden border-2 cursor-pointer transition-all aspect-video ${
                          isSelected ? 'border-red-600 ring-2 ring-red-600/30' : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-red-600/40 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white stroke-[3]" />
                          </div>
                        )}
                        <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white text-[9px] font-bold p-0.5 text-center truncate">
                          {preset.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom URL Input */}
              <div className="space-y-1 pt-1">
                <label className="text-xs font-bold text-slate-800">Atau Masukkan URL Foto Eksternal</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-50 rounded-none px-3 py-2 text-xs text-slate-900 font-bold"
                  style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
                />
              </div>
            </div>
          )}

          {/* TAB 3: VARIAN & MODIFIER */}
          {activeTab === 'variants' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-red-50/60 p-3 rounded-none border border-red-100">
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
                  className="px-3 py-1.5 rounded-none bg-red-600 text-white hover:bg-red-700 text-xs font-extrabold flex items-center gap-1 shrink-0"
                  style={{ outline: 'none', border: 'none' }}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Tambah Grup</span>
                </button>
              </div>

              {variantGroups.length > 0 ? (
                variantGroups.map(group => (
                  <div key={group.id} className="bg-slate-50 rounded-none p-3.5 space-y-3" style={{ border: '1px solid #e2e8f0' }}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={group.name}
                          onChange={(e) => handleUpdateGroupTitle(group.id, e.target.value)}
                          placeholder="Nama Grup Varian..."
                          className="flex-1 bg-white rounded-none px-2.5 py-1.5 text-xs font-extrabold text-slate-900"
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
                            className="flex-1 bg-white rounded-none px-2.5 py-1 text-xs text-slate-800 font-bold"
                            style={{ outline: 'none', border: '1px solid #cbd5e1' }}
                          />
                          <div className="flex items-center gap-1 w-36">
                            <span className="text-[10px] text-slate-500 font-extrabold">+Rp</span>
                            <input
                              type="number"
                              value={opt.priceModifier}
                              onChange={(e) => handleUpdateOption(group.id, opt.id, opt.name, parseFloat(e.target.value) || 0)}
                              className="w-full bg-white rounded-none px-2 py-1 text-xs text-red-600 font-extrabold"
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
                        <span>Tambah Opsi Baru</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-none border border-dashed border-slate-200 space-y-2">
                  <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-bold">Produk ini belum memiliki varian atau modifier.</p>
                  <button
                    type="button"
                    onClick={handleAddVariantGroup}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-none text-xs font-extrabold"
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
            {activeTab === 'info' && (
              <button
                type="button"
                onClick={() => setActiveTab('image')}
                className="py-3 px-4 rounded-none bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all"
                style={{ outline: 'none', border: 'none' }}
              >
                Lanjut ke Foto →
              </button>
            )}
            {activeTab === 'image' && (
              <button
                type="button"
                onClick={() => setActiveTab('variants')}
                className="py-3 px-4 rounded-none bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all"
                style={{ outline: 'none', border: 'none' }}
              >
                Lanjut ke Varian →
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-none text-white font-extrabold text-xs transition-all"
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
