import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Crown, Store, UserCheck, ArrowRight, Lock, Mail, Pill, Building2 } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { loginAsUser } = usePOS();
  const [email, setEmail] = useState<string>('superadmin@buira.id');
  const [password, setPassword] = useState<string>('••••••••');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('superadmin') || email.includes('ira')) {
      loginAsUser('user_superadmin_1');
    } else if (email.includes('geprek') || email.includes('siti')) {
      loginAsUser('user_ag_1');
    } else if (email.includes('apotek') || email.includes('rina')) {
      loginAsUser('user_apt_1');
    } else if (email.includes('properti') || email.includes('hendra')) {
      loginAsUser('user_prp_1');
    } else {
      loginAsUser('user_cs_1');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto">
            B
          </div>
          <h1 className="text-xl font-bold text-slate-900">Buira Enterprise SaaS Platform</h1>
          <p className="text-xs text-slate-500 font-medium">
            Portal Manajemen Role & Multi-Tenant Terpusat (F&B, Apotek, & Properti).
          </p>
        </div>

        {/* User Role Demo Selection */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            Pilih Role Akun Pengguna (Hierarchy Demo)
          </label>

          {/* SuperAdmin Card */}
          <button
            onClick={() => loginAsUser('user_superadmin_1')}
            className="w-full p-3.5 rounded-2xl border border-purple-300 bg-purple-50/60 hover:bg-purple-100/80 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center text-xl font-bold shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-purple-950 flex items-center gap-2">
                  <span>Bu Ira (Pengendali Penuh SaaS Platform)</span>
                  <span className="text-[10px] bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded font-extrabold">SUPERADMIN</span>
                </h3>
                <p className="text-[11px] text-purple-700 font-medium">Akses penuh ke seluruh Tenant, Owner, Billing, & Analytics SaaS</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Owner Multi-Outlet */}
            <button
              onClick={() => loginAsUser('user_cs_1')}
              className="p-3 rounded-2xl border border-amber-200 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-100/50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                    Pak Budi (Owner Multi-Store)
                  </h3>
                  <p className="text-[10px] text-amber-800 font-semibold">Pemilik Kopi Senja & Geprek</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0" />
            </button>

            {/* Manager Geprek */}
            <button
              onClick={() => loginAsUser('user_ag_1')}
              className="p-3 rounded-2xl border border-slate-200 hover:border-rose-500 bg-slate-50 hover:bg-rose-50/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
                  🍗
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                    Siti (Manager Store)
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold">Geprek Mercon Depok</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition-colors shrink-0" />
            </button>

            {/* Apoteker */}
            <button
              onClick={() => loginAsUser('user_apt_1')}
              className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
                  💊
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Apt. Rina S.Farm
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold">Apoteker Sehat Bu Ira</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
            </button>

            {/* Agent Properti */}
            <button
              onClick={() => loginAsUser('user_prp_1')}
              className="p-3 rounded-2xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
                  🏢
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    Hendra Sales
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold">Agent Bu Ira Residence</p>
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
                placeholder="superadmin@buira.id"
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
            Masuk Ke Platform SaaS
          </button>
        </form>
      </div>
    </div>
  );
};
