import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

import {
  ChevronLeft, Plus, Gift, Percent, Phone, CircleDollarSign, Inbox,
  Home, ShoppingBag, UtensilsCrossed, BarChart3, Settings
} from 'lucide-react';

export default function SellerBonuses() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');

  const navItems = [
    { label: 'KDS', icon: Home, path: '/seller' },
    { label: 'Buyurtmalar', icon: ShoppingBag, path: '/seller/orders' },
    { label: 'Menyu', icon: UtensilsCrossed, path: '/seller/menu' },
    { label: 'Statistika', icon: BarChart3, path: '/seller/analytics' },
    { label: 'Sozlamalar', icon: Settings, path: '/seller/settings' },
  ];

  return (
    <div className="min-h-full bg-bg pb-24">
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-borderStrong transition-all">
            <ChevronLeft size={18} className="text-text" />
          </button>
          <h1 className="text-lg font-bold text-text">Bonuslar</h1>
        </div>

        <div className="bg-gradient-to-br from-primary to-orange-400 rounded-2xl p-5 mb-4 relative overflow-hidden">
          <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <Gift size={22} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Bonus dasturi</h2>
          <p className="text-sm text-white/80">Mijozlarga bonus qo'shing va ularni rag'batlantiring</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <CircleDollarSign size={16} className="mx-auto text-primary mb-1" />
            <p className="text-lg font-extrabold text-text tabular-nums">0</p>
            <p className="text-[10px] text-textMuted font-medium">Berilgan</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <Percent size={16} className="mx-auto text-success mb-1" />
            <p className="text-lg font-extrabold text-text tabular-nums">0</p>
            <p className="text-[10px] text-textMuted font-medium">Ishlatilgan</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <Gift size={16} className="mx-auto text-warning mb-1" />
            <p className="text-lg font-extrabold text-text tabular-nums">0</p>
            <p className="text-[10px] text-textMuted font-medium">Faol</p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Plus size={16} className="text-primary" />
            <span className="text-sm font-bold text-text">Mijozga bonus qo'shish</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">Telefon raqam</label>
              <div className="flex items-center bg-bg border border-border rounded-xl overflow-hidden">
                <span className="px-3 py-2.5 text-sm font-semibold text-textMuted bg-surfaceActive border-r border-border">+998</span>
                <input className="flex-1 px-3 py-2.5 bg-transparent border-none text-sm text-text outline-none" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(XX) XXX-XX-XX" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">Bonus miqdori (so'm)</label>
              <input className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-sm text-text outline-none focus:border-primary/40 transition-all" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
            </div>
            <button className="w-full py-3 rounded-xl bg-primary text-white font-semibold shadow-primary hover:brightness-110 active:scale-[0.97] transition-all text-sm flex items-center justify-center gap-2">
              <Plus size={16} /> Qo'shish
            </button>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Percent size={16} className="text-success" />
            <span className="text-sm font-bold text-text">Tarix</span>
          </div>
          <div className="text-center py-6">
            <Inbox size={32} className="mx-auto mb-2 text-borderStrong" />
            <p className="text-sm font-medium text-textMuted">Hozircha bonus tarixi yo'q</p>
            <p className="text-xs text-textMuted mt-1">Birinchi bonusni qo'shing</p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Percent size={16} className="text-warning" />
            <span className="text-sm font-bold text-text">Faol chegirmalar</span>
          </div>
          <div className="text-center py-4">
            <Inbox size={28} className="mx-auto mb-2 text-borderStrong" />
            <p className="text-xs text-textMuted">Hozircha faol chegirmalar yo'q</p>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
          {navItems.map((item) => (
            <button key={item.path} onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full border-none bg-transparent cursor-pointer transition-all"
              style={{ color: item.path === location.pathname ? 'var(--primary)' : 'var(--text-muted)' }}
            >
              <item.icon size={22} strokeWidth={item.path === location.pathname ? 2.2 : 1.8} />
              <span className="text-[10px] font-semibold" style={{ fontWeight: item.path === location.pathname ? 700 : 500 }}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}