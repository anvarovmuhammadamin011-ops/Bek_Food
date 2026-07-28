import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

import {
  ChevronLeft, ChevronRight, Bell, Globe, Sun, LogOut, Store, Clock,
  MapPin, Settings, User, Phone, Save, Home, ShoppingBag, UtensilsCrossed, BarChart3
} from 'lucide-react';

function Toggle({ enabled, onToggle }) {
  return (
    <div onClick={onToggle} className={cn('w-10 h-[22px] rounded-full relative cursor-pointer transition-all flex-shrink-0', enabled ? 'bg-primary' : 'bg-surfaceActive')}>
      <div className={cn('w-[18px] h-[18px] rounded-full bg-white absolute top-[2px] transition-all shadow-sm', enabled ? 'left-[20px]' : 'left-[2px]')} />
    </div>
  );
}

export default function SellerSettings() {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const [restaurantName, setRestaurantName] = useState('Bekfood Restoran');
  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [workTime, setWorkTime] = useState('10:00 - 23:00');
  const [minOrder, setMinOrder] = useState("0 so'm");
  const [deliveryPrice, setDeliveryPrice] = useState('Bepul');
  const [deliveryRadius, setDeliveryRadius] = useState('5 km');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-borderStrong transition-all">
              <ChevronLeft size={18} className="text-text" />
            </button>
            <h1 className="text-lg font-bold text-text">Sozlamalar</h1>
          </div>
          <div className="w-9 h-9" />
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 mb-3">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center flex-shrink-0">
              <User size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-bold text-text">{user?.name || 'Seller'}</p>
              <p className="text-sm text-textMuted">{user?.phone || '+998 90 123 45 67'}</p>
              <Badge variant="primary" size="xs">Sotuvchi</Badge>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 mb-3">
          <div className="flex items-center gap-2 mb-4">
            <Store size={16} className="text-primary" />
            <span className="text-sm font-bold text-primary">Restoran Sozlamalari</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">Restoran nomi</label>
              <input className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-sm text-text outline-none focus:border-primary/40 transition-all" type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5"><Phone size={12} className="inline mr-1" />Telefon</label>
              <input className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-sm text-text outline-none focus:border-primary/40 transition-all" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5"><Clock size={12} className="inline mr-1" />Ish vaqti</label>
              <input className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-sm text-text outline-none focus:border-primary/40 transition-all" type="text" value={workTime} onChange={(e) => setWorkTime(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">Minimal buyurtma</label>
              <input className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-sm text-text outline-none focus:border-primary/40 transition-all" type="text" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5">Yetkazish narxi</label>
              <input className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-sm text-text outline-none focus:border-primary/40 transition-all" type="text" value={deliveryPrice} onChange={(e) => setDeliveryPrice(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5"><MapPin size={12} className="inline mr-1" />Yetkazish radiusi</label>
              <input className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-xl text-sm text-text outline-none focus:border-primary/40 transition-all" type="text" value={deliveryRadius} onChange={(e) => setDeliveryRadius(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={16} className="text-primary" />
            <span className="text-sm font-bold text-primary">Umumiy Sozlamalar</span>
          </div>

          <div className="divide-y divide-border">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><Bell size={16} className="text-primary" /></div>
                <span className="text-sm font-medium text-text">Bildirishnomalar</span>
              </div>
              <Toggle enabled={notifications} onToggle={() => setNotifications(!notifications)} />
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><Globe size={16} className="text-primary" /></div>
                <span className="text-sm font-medium text-text">Til</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-textMuted">O'zbek</span>
                <ChevronRight size={14} className="text-textMuted" />
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><Sun size={16} className="text-primary" /></div>
                <span className="text-sm font-medium text-text">Yorug' rejim</span>
              </div>
              <Toggle enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} />
            </div>
          </div>
        </div>

        <button className="w-full py-3 rounded-xl bg-primary text-white font-semibold shadow-primary hover:brightness-110 transition-all text-sm flex items-center justify-center gap-2 mb-3">
          <Save size={16} /> Saqlash
        </button>
        <button onClick={handleLogout} className="w-full py-3 rounded-xl bg-surface border border-danger/30 text-danger font-semibold hover:bg-danger/5 transition-all text-sm flex items-center justify-center gap-2">
          <LogOut size={16} /> Tizimdan chiqish
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
          {navItems.map((item) => {
            const active = item.path === '/seller/settings';
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full border-none bg-transparent cursor-pointer transition-all"
                style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }}
              >
                <item.icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[10px] font-semibold" style={{ fontWeight: active ? 700 : 500 }}>{item.label}</span>
                {active && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}