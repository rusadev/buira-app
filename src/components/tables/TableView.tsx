import React from 'react';
import { usePOS } from '../../context/POSContext';
import { LayoutGrid, Users, Plus } from 'lucide-react';

export const TableView: React.FC = () => {
  const { tables, currentEntityId, setSelectedTableNumber, setActiveTab } = usePOS();

  const entityTables = tables.filter(t => t.entityId === currentEntityId);

  const handleSelectTable = (tableNum: string) => {
    setSelectedTableNumber(tableNum);
    setActiveTab('cashier');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 p-6 space-y-6 overflow-y-auto font-sans select-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-red-600" />
            <span>Denah & Manajemen Meja Dine-In</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Pilih meja pelanggan untuk langsung membuka transaksi pesanan kasir.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {entityTables.map(table => {
          const isOccupied = table.status === 'Occupied';
          return (
            <div
              key={table.id}
              onClick={() => handleSelectTable(table.tableNumber)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-32 group ${
                isOccupied 
                  ? 'bg-rose-50 border-rose-200 hover:border-rose-400' 
                  : 'bg-white border-slate-200 hover:border-red-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900 group-hover:text-red-600 transition-colors">
                  {table.tableNumber}
                </h4>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                  isOccupied ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {isOccupied ? 'Terisi' : 'Kosong'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                  <Users className="w-3 h-3 text-red-600" />
                  {table.capacity} Kursi
                </span>
                <span className="text-[10px] font-black text-red-600 group-hover:underline">
                  Pilih →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
