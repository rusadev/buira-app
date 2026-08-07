import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { INITIAL_USER_ACCOUNTS } from '../../data/seedData';

export const LoginView: React.FC = () => {
  const { users, loginAsUser } = usePOS();
  const [email, setEmail] = useState<string>('barista@kopisenja.id');
  const [password, setPassword] = useState<string>('123');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const allAccounts = users.length > 0 ? users : INITIAL_USER_ACCOUNTS;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    // Intelligent Match by Email & Password
    const matchedUser = allAccounts.find(
      u => u.email.toLowerCase() === cleanEmail
    );

    if (matchedUser) {
      if (matchedUser.password && matchedUser.password !== cleanPassword) {
        setErrorMsg('Kata sandi yang Anda masukkan salah.');
        return;
      }
      loginAsUser(matchedUser.id);
    } else {
      // Intelligent fallback
      if (cleanEmail.includes('geprek') || cleanEmail.includes('ayam')) {
        loginAsUser('user_ag_1');
      } else if (cleanEmail.includes('barista') || cleanEmail.includes('coffee') || cleanEmail.includes('budi')) {
        loginAsUser('user_cs_1');
      } else if (cleanEmail.includes('superadmin') || cleanEmail.includes('ira')) {
        loginAsUser('user_superadmin_1');
      } else {
        setErrorMsg('Email tidak terdaftar di sistem outlet.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-8 space-y-6">
        {/* Clean Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center mx-auto mb-2">
            B
          </div>
          <h1 className="text-xl font-bold text-slate-900">Buira POS F&B</h1>
          <p className="text-xs text-slate-500 font-medium">
            Masuk ke akun kasir & outlet bisnis Anda
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 text-center">
            {errorMsg}
          </div>
        )}

        {/* Clean Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Email Akun</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@outlet.id"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all"
          >
            Masuk ke Outlet
          </button>
        </form>

        {/* Subtle Demo Hints */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <span className="text-[11px] text-slate-400 font-medium block">Contoh Akun & Password Uji Coba:</span>
          <div className="flex flex-col gap-1 text-[11px]">
            <button
              onClick={() => { setEmail('barista@kopisenja.id'); setPassword('123'); }}
              className="text-slate-600 hover:text-amber-600 font-semibold hover:underline"
            >
              ☕ Kopi Senja: <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">barista@kopisenja.id</code> (Pass: 123)
            </button>
            <button
              onClick={() => { setEmail('kasir@geprekmercon.id'); setPassword('123'); }}
              className="text-slate-600 hover:text-rose-600 font-semibold hover:underline"
            >
              🍗 Geprek Mercon: <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">kasir@geprekmercon.id</code> (Pass: 123)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
