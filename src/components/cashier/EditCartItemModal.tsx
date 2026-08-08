import React, { useState } from 'react';
import type { CartItem, SelectedVariant } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/formatters';
import { X, Plus, Minus, Check, Edit3 } from 'lucide-react';

interface EditCartItemModalProps {
  cartItem: CartItem;
  onClose: () => void;
}

export const EditCartItemModal: React.FC<EditCartItemModalProps> = ({ cartItem, onClose }) => {
  const { updateCartItem } = usePOS();
  const product = cartItem.product;

  const [quantity, setQuantity] = useState<number>(cartItem.quantity);
  const [notes, setNotes] = useState<string>(cartItem.notes || '');

  const [selectedVariants, setSelectedVariants] = useState<Record<string, SelectedVariant>>(() => {
    const initial: Record<string, SelectedVariant> = {};
    cartItem.selectedVariants?.forEach(v => {
      initial[v.groupId] = v;
    });
    return initial;
  });

  const handleOptionSelect = (groupId: string, groupName: string, optionId: string, optionName: string, priceModifier: number) => {
    setSelectedVariants(prev => ({
      ...prev,
      [groupId]: { groupId, groupName, optionId, optionName, priceModifier }
    }));
  };

  const selectedVariantsList = Object.values(selectedVariants);
  const variantsExtraPrice = selectedVariantsList.reduce((sum, v) => sum + v.priceModifier, 0);

  const basePrice = product.discountPercentage
    ? Math.round(product.price * (1 - product.discountPercentage / 100))
    : product.price;

  const unitPrice = basePrice + variantsExtraPrice;
  const totalPrice = unitPrice * quantity;

  const handleSave = () => {
    // Check stock limit guard
    if (quantity > product.stock) {
      alert(`Stok produk tidak mencukupi. Sisa stok tersedia: ${product.stock}`);
      return;
    }

    updateCartItem(cartItem.id, {
      quantity,
      selectedVariants: selectedVariantsList,
      notes: notes.trim(),
      unitPrice,
      totalPrice
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-white rounded-none w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] border border-slate-200">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-red-600" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{product.name}</h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Edit Opsi Pesanan Keranjang</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-none bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors border border-slate-200"
            style={{ outline: 'none' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {product.variantGroups && product.variantGroups.length > 0 && (
            product.variantGroups.map(group => (
              <div key={group.id} className="space-y-2">
                <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                  {group.name}
                  {group.required && <span className="text-red-600">*</span>}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {group.options.map(opt => {
                    const isSelected = selectedVariants[group.id]?.optionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleOptionSelect(group.id, group.name, opt.id, opt.name, opt.priceModifier)}
                        className="p-2.5 rounded-none text-left text-xs font-semibold transition-all flex items-center justify-between"
                        style={{
                          outline: 'none',
                          border: '1.5px solid',
                          borderColor: isSelected ? '#dc2626' : '#e2e8f0',
                          background: isSelected ? '#fef2f2' : '#ffffff',
                          color: isSelected ? '#991b1b' : '#475569',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-none flex items-center justify-center shrink-0"
                            style={{
                              border: isSelected ? 'none' : '1.5px solid #cbd5e1',
                              background: isSelected ? '#dc2626' : 'transparent',
                            }}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                          </div>
                          <span>{opt.name}</span>
                        </div>
                        {opt.priceModifier !== 0 && (
                          <span className="text-[10px] font-bold text-red-600 shrink-0 ml-1">
                            {opt.priceModifier > 0 ? `+${formatRupiah(opt.priceModifier)}` : formatRupiah(opt.priceModifier)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {/* Notes */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-extrabold text-slate-800">Catatan Khusus</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Misal: Sedikit es, ekstra sambal..."
              className="w-full bg-slate-50 rounded-none px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 font-medium"
              style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
            />
          </div>

          {/* Quantity Stepper with Stock Limit Guard */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span className="text-xs font-extrabold text-slate-800 block">Jumlah Porsi</span>
              <span className="text-[10px] text-slate-400 font-bold">Stok tersedia: {product.stock}</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-none" style={{ border: '1px solid #e2e8f0' }}>
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-7 h-7 rounded bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors font-black"
                style={{ outline: 'none', border: 'none' }}
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <span className="text-sm font-black text-slate-900 w-7 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => {
                  if (quantity >= product.stock) {
                    alert(`Batas sisa stok tercapai (${product.stock} porsi)`);
                    return;
                  }
                  setQuantity(q => q + 1);
                }}
                className="w-7 h-7 rounded bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors font-black"
                style={{ outline: 'none', border: 'none' }}
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-4 bg-white">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Total Harga Baru</p>
            <p className="text-lg font-black text-red-600">{formatRupiah(totalPrice)}</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 text-white font-extrabold py-3 px-4 rounded-none text-sm transition-all flex items-center justify-center gap-2"
            style={{ outline: 'none', border: 'none', background: '#dc2626' }}
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};
