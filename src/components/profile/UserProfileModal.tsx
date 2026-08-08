import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { X, User, KeyRound, Shield, CheckCircle2, Lock, Image as ImageIcon } from 'lucide-react';

interface UserProfileModalProps {
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { currentUser, updateUser } = usePOS();

  const [name, setName] = useState<string>(currentUser?.name || '');
  const [username, setUsername] = useState<string>(currentUser?.username || '');
  const [password, setPassword] = useState<string>(currentUser?.password || '');
  const [pinCode, setPinCode] = useState<string>(currentUser?.pinCode || '1234');
  const [avatar, setAvatar] = useState<string>(currentUser?.avatar || PRESET_AVATARS[0]);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    updateUser({
      ...currentUser,
      name: name.trim(),
      username: username.trim().toLowerCase(),
      password: password.trim(),
      pinCode: pinCode.trim(),
      avatar
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-white rounded-none w-full max-w-md overflow-hidden flex flex-col border border-slate-300 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="text-base font-black uppercase tracking-wide">Pengaturan Profil Saya</h3>
              <p className="text-[11px] text-slate-300 font-semibold">{currentUser?.role} · Outlet POS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-none bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            style={{ outline: 'none' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-extrabold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profil & Kata Sandi Berhasil Diperbarui!</span>
            </div>
          )}

          {/* Avatar Selector */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-red-600" />
              Foto Profil / Avatar *
            </label>
            <div className="flex items-center gap-3">
              <img
                src={avatar}
                alt="Profile Preview"
                className="w-14 h-14 rounded-none object-cover border-2 border-red-600 shadow-sm shrink-0"
              />
              <div className="grid grid-cols-6 gap-1 flex-1">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(url)}
                    className={`w-8 h-8 rounded-none overflow-hidden border-2 transition-all ${
                      avatar === url ? 'border-red-600 scale-105' : 'border-slate-200 hover:border-slate-400'
                    }`}
                    style={{ outline: 'none' }}
                  >
                    <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Nama Lengkap Pengguna *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-none px-3.5 py-2.5 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-red-600"
              style={{ outline: 'none' }}
            />
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Username Pengguna (Login Singkat) *</label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="misal: kasir, manager, owner"
              className="w-full bg-slate-50 border border-slate-300 rounded-none px-3.5 py-2.5 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-red-600 lowercase"
              style={{ outline: 'none' }}
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-red-600" />
              Kata Sandi Login *
            </label>
            <input
              type="text"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Masukkan password baru"
              className="w-full bg-slate-50 border border-slate-300 rounded-none px-3.5 py-2.5 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-red-600"
              style={{ outline: 'none' }}
            />
          </div>

          {/* Security PIN Code */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-red-600" />
              PIN Keamanan Shift (4-Digit) *
            </label>
            <input
              type="text"
              maxLength={6}
              required
              value={pinCode}
              onChange={e => setPinCode(e.target.value)}
              placeholder="misal: 1234"
              className="w-full bg-slate-50 border border-slate-300 rounded-none px-3.5 py-2.5 text-xs font-mono font-extrabold text-slate-900 focus:outline-none focus:border-red-600"
              style={{ outline: 'none' }}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-none bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
              style={{ outline: 'none' }}
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Simpan Perubahan Profil</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
