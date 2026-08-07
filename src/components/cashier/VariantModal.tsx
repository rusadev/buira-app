import React, { useState } from 'react';
import type { Product, SelectedVariant, CartItem } from '../../types/pos';
import { formatRupiah } from '../../utils/formatters';
import { X, Plus, Minus, Check } from 'lucide-react';

interface VariantModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const VariantModal: React.FC<VariantModalProps> = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, SelectedVariant>>(() => {
    const initial: Record<string, SelectedVariant> = {};
    product.variantGroups?.forEach(group => {
      if (group.options.length > 0) {
        const defaultOpt = group.options[0];
        initial[group.id] = {
          groupId: group.id,
          groupName: group.name,
          optionId: defaultOpt.id,
          optionName: defaultOpt.name,
          priceModifier: defaultOpt.priceModifier
        };
      }
    });
    return initial;
  });

  const [notes, setNotes] = useState<string>('');

  const handleOptionSelect = (groupId: string, groupName: string, optionId: string, optionName: string, priceModifier: number) => {
    setSelectedVariants(prev => ({
      ...prev,
      [groupId]: { groupId, groupName, optionId, optionName, priceModifier }
    }));
  };

  const selectedVariantsList = Object.values(selectedVariants);
  const variantsExtraPrice = selectedVariantsList.reduce((sum, v) => sum + v.priceModifier, 0);
  const unitPrice = product.price + variantsExtraPrice;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    const cartItem: CartItem = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      product,
      quantity,
      selectedVariants: selectedVariantsList,
      notes: notes.trim(),
      unitPrice,
      totalPrice
    };
    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">{product.name}</h3>
            <p className="text-xs text-amber-700 font-semibold">{formatRupiah(product.price)} (Harga Dasar)</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {product.variantGroups && product.variantGroups.length > 0 ? (
            product.variantGroups.map(group => (
              <div key={group.id} className="space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>{group.name}</span>
                  {group.required && <span className="text-rose-600">*</span>}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {group.options.map(opt => {
                    const isSelected = selectedVariants[group.id]?.optionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleOptionSelect(group.id, group.name, opt.id, opt.name, opt.priceModifier)}
                        className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{opt.name}</span>
                        </div>
                        {opt.priceModifier !== 0 && (
                          <span className={`text-[10px] font-bold ${opt.priceModifier > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                            {opt.priceModifier > 0 ? `+${formatRupiah(opt.priceModifier)}` : formatRupiah(opt.priceModifier)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">Produk ini tidak memiliki varian tambahan.</p>
          )}

          {/* Notes */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-slate-800">Catatan Khusus Pesanan</label>
            <input 
              type="text" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Misal: Sedikit es, ekstra sambal..."
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Qty Selector */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-800">Jumlah Porsi</span>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-1">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-slate-900 w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Harga</span>
            <span className="text-base font-extrabold text-amber-700">{formatRupiah(totalPrice)}</span>
          </div>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>Tambahkan ke Keranjang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
