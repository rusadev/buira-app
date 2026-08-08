import React, { useState } from 'react';
import type { CustomerMember } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { X, UserCheck, Plus, Award, Phone, Search, Crown } from 'lucide-react';

interface CustomerModalProps {
  onClose: () => void;
  onSelectCustomer: (customer: CustomerMember) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({ onClose, onSelectCustomer }) => {
  const { currentEntityId } = usePOS();
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initial Seed Members
  const initialMembers: CustomerMember[] = [
    {
      id: 'mem-1',
      entityId: currentEntityId,
      name: 'Budi Santoso',
      phone: '08123456789',
      tier: 'Gold',
      points: 240,
      totalSpent: 2400000,
      createdAt: '2026-01-15'
    },
    {
      id: 'mem-2',
      entityId: currentEntityId,
      name: 'Siti Rahma',
      phone: '08579876543',
      tier: 'Platinum',
      points: 580,
      totalSpent: 5800000,
      createdAt: '2026-02-10'
    },
    {
      id: 'mem-3',
      entityId: currentEntityId,
      name: 'Andi Wijaya',
      phone: '08198765432',
      tier: 'Silver',
      points: 45,
      totalSpent: 450000,
      createdAt: '2026-03-01'
    }
  ];

  const [members, setMembers] = useState<CustomerMember[]>(initialMembers);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.phone.includes(searchQuery)
  );

  const handleRegisterMember = () => {
    if (!newName.trim() || !newPhone.trim()) {
      alert('Silakan lengkapi Nama & No HP pelanggan.');
      return;
    }

    const newMem: CustomerMember = {
      id: `mem-${Date.now()}`,
      entityId: currentEntityId,
      name: newName.trim(),
      phone: newPhone.trim(),
      tier: 'Silver',
      points: 10, // welcome bonus points
      totalSpent: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setMembers([newMem, ...members]);
    onSelectCustomer(newMem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-white rounded-none w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-extrabold text-slate-900">Member Pelanggan & Poin</h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-none bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors border border-slate-200"
            style={{ outline: 'none' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto min-h-0">
          
          {/* Action Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800">
              {isAddingNew ? 'Daftar Member Baru' : 'Pilih Member Pelanggan:'}
            </span>
            <button
              type="button"
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="text-xs font-extrabold text-red-600 hover:text-red-700 flex items-center gap-1"
              style={{ outline: 'none' }}
            >
              {isAddingNew ? 'Batal' : '+ Member Baru'}
            </button>
          </div>

          {/* Form Add New Member */}
          {isAddingNew ? (
            <div className="p-4 border border-slate-200 rounded-2xl bg-white space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Pelanggan *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="misal: Rina Melati"
                  className="w-full bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-900 border border-slate-200"
                  style={{ outline: 'none' }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">No. HP / WhatsApp *</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="0812-3456-7890"
                  className="w-full bg-white rounded-xl px-3 py-2 text-xs font-bold text-slate-900 border border-slate-200"
                  style={{ outline: 'none' }}
                />
              </div>

              <button
                type="button"
                onClick={handleRegisterMember}
                className="w-full py-3 rounded-xl text-white font-black text-xs transition-all"
                style={{ outline: 'none', border: 'none', background: '#dc2626' }}
              >
                Simpan & Pilih Member
              </button>
            </div>
          ) : (
            <>
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari nama atau No HP member..."
                  className="w-full bg-white rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 border border-slate-200"
                  style={{ outline: 'none' }}
                />
              </div>

              {/* Members list */}
              <div className="space-y-2">
                {filteredMembers.map(mem => (
                  <div
                    key={mem.id}
                    onClick={() => {
                      onSelectCustomer(mem);
                      onClose();
                    }}
                    className="p-3.5 border border-slate-200 rounded-2xl bg-white hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-red-600 flex items-center justify-center font-black text-xs shrink-0">
                        {mem.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900">{mem.name}</span>
                          <span className={`px-2 py-0.2 rounded-md text-[9px] font-black uppercase ${
                            mem.tier === 'Platinum' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            mem.tier === 'Gold' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {mem.tier}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {mem.phone}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-600 block">+{mem.points} Poin</span>
                      <span className="text-[9px] text-slate-400 font-bold">Reward Ready</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
