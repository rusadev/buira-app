import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import type { EntityType } from '../../types/pos';
import { Coffee, Drumstick, ArrowRight, Store, Lock, Mail } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { loginAsTenant } = usePOS();
  const [email, setEmail] = useState<string>('barista@kopisenja.id');
  const [password, setPassword] = useState<string>('••••••••');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('geprek') || email.includes('ayam')) {
      loginAsTenant('ayam_geprek');
    } else {
      loginAsTenant('coffee_shop');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto">
            B
          </div>
          <h1 className="text-xl font-bold text-slate-900">Buira App SaaS Portal</h1>
          <p className="text-xs text-slate-500 font-medium">
            Masuk ke Akun Tenant Usaha Anda untuk mengakses sistem Kasir & POS.
          </p>
        </div>

        {/* Quick Demo Tenant Switcher Cards */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            Pilih Demo Login Tenant Akun
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {/* Coffee Shop Account Card */}
            <button
              onClick={() => loginAsTenant('coffee_shop')}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center text-xl font-bold">
                  ☕
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    Akun Tenant Kopi Senja
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Coffee Shop & Artisan Pastry</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </button>

            {/* Ayam Geprek Account Card */}
            <button
              onClick={() => loginAsTenant('ayam_geprek')}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-rose-500 bg-slate-50 hover:bg-rose-50/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center text-xl font-bold">
                  🍗
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                    Akun Tenant Geprek Mercon
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Resto Ayam Geprek & Kuliner Pedas</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-200"></div>
          <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 absolute">Atau Login Email</span>
        </div>

        {/* Email Password Form */}
        <form onSubmit={handleCustomLogin} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Email Akun Merchant</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@toko.id"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all"
          >
            Masuk Ke Merchant POS
          </button>
        </form>
      </div>
    </div>
  );
};
