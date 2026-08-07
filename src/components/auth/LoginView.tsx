import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import type { EntityType } from '../../types/pos';
import { Coffee, Drumstick, Pill, Building2, ArrowRight, Lock, Mail } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { loginAsTenant } = usePOS();
  const [email, setEmail] = useState<string>('barista@kopisenja.id');
  const [password, setPassword] = useState<string>('••••••••');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('geprek') || email.includes('ayam')) {
      loginAsTenant('ayam_geprek');
    } else if (email.includes('apotek') || email.includes('sehat')) {
      loginAsTenant('apotek_buira');
    } else if (email.includes('properti') || email.includes('residence')) {
      loginAsTenant('properti_buira');
    } else {
      loginAsTenant('coffee_shop');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto">
            B
          </div>
          <h1 className="text-xl font-bold text-slate-900">Buira Enterprise SaaS Platform</h1>
          <p className="text-xs text-slate-500 font-medium">
            Portal Autentikasi Terpusat untuk Ekosistem Bisnis F&B, Apotek, & Properti Bu Ira.
          </p>
        </div>

        {/* Quick Demo Tenant Switcher Cards */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            Pilih Demo Tenant Bisnis Bu Ira
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Coffee Shop */}
            <button
              onClick={() => loginAsTenant('coffee_shop')}
              className="p-3 rounded-2xl border border-slate-200 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
                  ☕
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    Kopi Senja
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold">Modul F&B Cafe</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0" />
            </button>

            {/* Ayam Geprek */}
            <button
              onClick={() => loginAsTenant('ayam_geprek')}
              className="p-3 rounded-2xl border border-slate-200 hover:border-rose-500 bg-slate-50 hover:bg-rose-50/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
                  🍗
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                    Geprek Mercon
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold">Modul F&B Resto</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition-colors shrink-0" />
            </button>

            {/* Apotek Bu Ira */}
            <button
              onClick={() => loginAsTenant('apotek_buira')}
              className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
                  💊
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Apotek Sehat Bu Ira
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold">Modul Apotek</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
            </button>

            {/* Properti Bu Ira */}
            <button
              onClick={() => loginAsTenant('properti_buira')}
              className="p-3 rounded-2xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
                  🏢
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    Bu Ira Residence
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold">Modul Properti</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-200"></div>
          <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 absolute">Atau Login Manual</span>
        </div>

        {/* Email Password Form */}
        <form onSubmit={handleCustomLogin} className="space-y-3">
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
            Masuk Ke SaaS Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};
