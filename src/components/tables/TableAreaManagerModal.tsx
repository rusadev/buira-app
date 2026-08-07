import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { X, Plus, Trash2, MapPin } from 'lucide-react';

interface TableAreaManagerModalProps {
  onClose: () => void;
}

export const TableAreaManagerModal: React.FC<TableAreaManagerModalProps> = ({ onClose }) => {
  const { tableAreas, addTableArea, deleteTableArea, tables, currentEntityId } = usePOS();
  const [newAreaName, setNewAreaName] = useState<string>('');

  const entityTables = tables.filter(t => t.entityId === currentEntityId);

  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;

    addTableArea(newAreaName.trim());
    setNewAreaName('');
  };

  const handleDeleteArea = (areaName: string) => {
    const activeTablesInArea = entityTables.filter(t => (t.area || 'Indoor Utama') === areaName).length;
    if (activeTablesInArea > 0) {
      alert(`Zona area "${areaName}" memiliki ${activeTablesInArea} meja aktif. Pindahkan meja ke zona lain sebelum menghapus area ini.`);
      return;
    }

    if (window.confirm(`Hapus zona area "${areaName}"?`)) {
      deleteTableArea(areaName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col space-y-4 p-6" style={{ border: '1px solid #e2e8f0' }}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-extrabold text-slate-900">Kelola Zona Area Meja</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            style={{ outline: 'none' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add Area Form */}
        <form onSubmit={handleAddArea} className="flex gap-2">
          <input
            type="text"
            required
            value={newAreaName}
            onChange={(e) => setNewAreaName(e.target.value)}
            placeholder="Nama Zona Area Baru (misal: Rooftop / Garden)..."
            className="flex-1 bg-slate-50 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-extrabold"
            style={{ outline: 'none', border: '1.5px solid #e2e8f0' }}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-white font-extrabold text-xs transition-colors flex items-center gap-1 shrink-0"
            style={{ outline: 'none', border: 'none', background: '#dc2626' }}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah</span>
          </button>
        </form>

        {/* Area List */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-extrabold text-slate-800">Daftar Zona Area Resto ({tableAreas.length})</label>
          
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white max-h-[40vh] overflow-y-auto">
            {tableAreas.map(areaName => {
              const tableCount = entityTables.filter(t => (t.area || 'Indoor Utama') === areaName).length;
              return (
                <div key={areaName} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{areaName}</h4>
                      <span className="text-[10px] text-slate-400 font-bold">{tableCount} Meja</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteArea(areaName)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors"
                    style={{ outline: 'none' }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors"
            style={{ outline: 'none' }}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
