import React from 'react';
import { usePOS } from '../../context/POSContext';
import { LayoutGrid, Users, ShoppingCart } from 'lucide-react';

export const TableView: React.FC = () => {
  const { tables, currentEntityId, currentEntity, setSelectedTableNumber, setOrderType, setActiveTab } = usePOS();

  const entityTables = tables.filter(t => t.entityId === currentEntityId);

  const handleSelectTableForOrder = (tableNumber: string) => {
    setOrderType('Dine-In');
    setSelectedTableNumber(tableNumber);
    setActiveTab('cashier');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-5 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-amber-600" />
            <span>Manajemen Meja Dine-In ({currentEntity.name})</span>
          </h2>
          <p className="text-xs text-slate-500">Denah meja visual interaktif untuk pesanan makan di tempat (Dine-In).</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Kosong
          </span>
          <span className="flex items-center gap-1 text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Terisi
          </span>
        </div>
      </div>

      {/* Grid Meja */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {entityTables.map(table => {
          const isOccupied = table.status === 'Occupied';

          return (
            <div
              key={table.id}
              onClick={() => handleSelectTableForOrder(table.tableNumber)}
              className={`p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col justify-between h-36 relative overflow-hidden group ${
                isOccupied
                  ? 'bg-rose-50 border-rose-300 hover:border-rose-400'
                  : 'bg-white border-slate-200 hover:border-amber-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                    {table.tableNumber}
                  </h4>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-0.5 font-medium">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>Kapasitas {table.capacity} Orang</span>
                  </div>
                </div>

                <span className={`w-3 h-3 rounded-full ${isOccupied ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              </div>

              {isOccupied ? (
                <div className="bg-white p-2 rounded-xl border border-rose-200 text-xs">
                  <span className="text-[10px] text-slate-400 block font-medium">Pelanggan:</span>
                  <span className="font-bold text-rose-800 truncate block">{table.customerName || 'Pelanggan'}</span>
                </div>
              ) : (
                <div className="pt-2">
                  <button className="w-full py-1.5 px-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-600 hover:text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1">
                    <ShoppingCart className="w-3 h-3" />
                    <span>Pilih Meja Ini</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
