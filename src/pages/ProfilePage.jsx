import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, ChevronRight, MapPin, Bell, Heart, ClipboardList, LogOut, Star, Pencil,
  Gift, CreditCard, Globe, Moon, Sun, Headphones, FileText, Lock, X, Check, Tag,
} from 'lucide-react';
import useStore from '../store/useStore';
import LoyaltyCard from '../components/LoyaltyCard';

const LANGUAGES = [
  { key: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
  { key: 'ru', label: 'Русский', flag: '🇷🇺' },
  { key: 'en', label: 'English', flag: '🇬🇧' },
];

function Toggle({ on, onChange, color = 'var(--primary)' }) {
  return (
    <button
      onClick={onChange}
      aria-pressed={on}
      style={{
        width: 46, height: 26, borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
        background: on ? color : 'var(--surface-active)', transition: 'all .25s var(--ease)',
        padding: 3, position: 'relative', flexShrink: 0,
      }}
    >
      <span style={{
        display: 'block', width: 20, height: 20, borderRadius: 'var(--radius-full)', background: '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,.18)', transition: 'transform .25s var(--ease-spring)',
        transform: on ? 'translateX(16px)' : 'translateX(0)',
      }} />
    </button>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, updateProfile, promoCodes, addresses } = useStore();

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [dark, setDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark');
  const [lang, setLang] = useState('uz');
  const [notif, setNotif] = useState(true);
  const [activeCoupons, setActiveCoupons] = useState([]);

  useEffect(() => {
    setActiveCoupons(promoCodes.filter((p) => p.active).slice(0, 3));
  }, [promoCodes]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const startEdit = () => { setEditName(user?.name || ''); setEditPhone((user?.phone || '').replace(/^998/, '')); setEditing(true); };
  const saveEdit = () => {
    const clean = editPhone.replace(/\D/g, '').slice(0, 12);
    updateProfile({ name: editName.trim() || user?.name, phone: clean.length === 9 ? `998${clean}` : clean ? `998${clean}` : user?.phone });
    setEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center">
        <div className="empty-state-icon"><User size={28} /></div>
        <h2 className="heading" style={{ marginBottom: 6 }}>Profilingizga kiring</h2>
        <p className="body" style={{ marginBottom: 24 }}>Buyurtma berish uchun kirish kerak</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">Kirish</button>
      </div>
    );
  }

  const cashback = user?.bonus || 15000;
  const phone = user?.phone || '+998901234567';
  const displayPhone = `+${phone.replace(/\D/g, '')}`;

  const settings = [
    { icon: MapPin, label: 'Xossa manzillar', sub: `${addresses.length} ta manzil`, path: '/addresses' },
    { icon: CreditCard, label: "To'lov usullari", sub: 'Karta, Click, Payme', path: '/payment' },
    { icon: Bell, label: 'Bildirishnomalar', sub: '', path: '/notifications' },
    { icon: Heart, label: 'Sevimlilar', sub: '', path: '/favorites' },
    { icon: ClipboardList, label: 'Buyurtmalar tarixi', sub: '', path: '/orders' },
  ];

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="p-4 space-y-4 mt-4">

        {/* 1. Profile header */}
        <div className="card p-5 text-center animate-fade-in" style={{ position: 'relative' }}>
          <button onClick={startEdit} style={{ position: 'absolute', top: 14, right: 14, width: 34, height: 34, borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', border: '1px solid rgba(249,115,22,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Pencil size={15} color="var(--primary)" />
          </button>
          <div style={{ width: 76, height: 76, borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', border: '2px solid rgba(249,115,22,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 28, fontWeight: 700, color: 'var(--primary)' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'B'}
          </div>
          <h2 style={{ color: 'var(--text)', fontSize: 19, fontWeight: 700 }}>{user?.name || 'Foydalanuvchi'}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{displayPhone}</p>
          <div className="flex justify-center" style={{ gap: 8, marginTop: 12 }}>
            <span className="badge badge-primary"><Star size={11} /> {cashback.toLocaleString()} so'm keshbek</span>
            <span className="badge badge-neutral">Vetka {user?.bonus > 500 ? 'Oltin' : user?.bonus > 100 ? 'Kumush' : 'Standart'}</span>
          </div>
        </div>

        {/* 2. Wallet + bonuses */}
        <LoyaltyCard points={cashback} tier={user?.bonus > 500 ? 'gold' : user?.bonus > 100 ? 'silver' : 'standard'} />

        <div className="grid grid-cols-2 stagger" style={{ gap: 10 }}>
          <div className="card card-hover animate-fade-in-up" onClick={() => navigate('/wallet')} style={{ padding: 14, cursor: 'pointer' }}>
            <div className="flex items-center" style={{ gap: 8, marginBottom: 8 }}>
              <span style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Gift size={15} color="var(--success)" />
              </span>
              <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>BEK Pay</span>
            </div>
            <div style={{ color: 'var(--text)', fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{cashback.toLocaleString()} so'm</div>
            <div style={{ color: 'var(--text-dim)', fontSize: 11, marginTop: 2 }}>Hamyo balansi</div>
          </div>
          <div className="card card-hover animate-fade-in-up" onClick={() => navigate('/coupons')} style={{ padding: 14, cursor: 'pointer' }}>
            <div className="flex items-center" style={{ gap: 8, marginBottom: 8 }}>
              <span style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tag size={15} color="var(--warning)" />
              </span>
              <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>Promokodlar</span>
            </div>
            <div style={{ color: 'var(--text)', fontSize: 20, fontWeight: 700 }}>{activeCoupons.length} dona</div>
            <div style={{ color: 'var(--text-dim)', fontSize: 11, marginTop: 2 }}>Aktiv chegirma</div>
          </div>
        </div>

        {/* 3. Settings list */}
        <div className="card animate-fade-in-up" style={{ overflow: 'hidden' }}>
          {settings.map((item, i) => (
            <button key={item.path} onClick={() => navigate(item.path)} className="w-full flex items-center justify-between" style={{
              padding: '13px 16px', transition: 'all .2s', cursor: 'pointer', background: 'none', border: 'none',
              borderBottom: i < settings.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div className="flex items-center" style={{ gap: 12 }}>
                <span style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'var(--surface-active)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.icon size={15} color="var(--text-muted)" />
                </span>
                <div>
                  <div style={{ color: 'var(--text)', fontSize: 14 }}>{item.label}</div>
                  {item.sub && <div style={{ color: 'var(--text-dim)', fontSize: 11 }}>{item.sub}</div>}
                </div>
              </div>
              <ChevronRight size={16} color="var(--text-dim)" />
            </button>
          ))}
        </div>

        {/* 4. Settings toggles */}
        <div className="card p-4 space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: 10 }}>
              <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--surface-active)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={15} color="var(--text-muted)" />
              </span>
              <div>
                <div style={{ color: 'var(--text)', fontSize: 14 }}>Ilova tili</div>
                <div style={{ color: 'var(--text-dim)', fontSize: 11 }}>{LANGUAGES.find((l) => l.key === lang)?.label}</div>
              </div>
            </div>
            <div className="flex p-1" style={{ background: 'var(--surface-active)', borderRadius: 'var(--radius-full)' }}>
              {LANGUAGES.map((l) => (
                <button key={l.key} onClick={() => setLang(l.key)} style={{
                  padding: '5px 10px', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  background: lang === l.key ? 'var(--primary)' : 'none', color: lang === l.key ? '#fff' : 'var(--text-muted)', transition: 'all .2s',
                }}>{l.flag} {l.key.toUpperCase()}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: 10 }}>
              <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--surface-active)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {dark ? <Moon size={15} color="var(--text-muted)" /> : <Sun size={15} color="var(--text-muted)" />}
              </span>
              <div>
                <div style={{ color: 'var(--text)', fontSize: 14 }}>Tungi rejim</div>
                <div style={{ color: 'var(--text-dim)', fontSize: 11 }}>{dark ? 'Yoniq' : "O'chiq"}</div>
              </div>
            </div>
            <Toggle on={dark} onChange={() => setDark(!dark)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: 10 }}>
              <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--surface-active)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={15} color="var(--text-muted)" />
              </span>
              <div>
                <div style={{ color: 'var(--text)', fontSize: 14 }}>Bildirishnomalar</div>
                <div style={{ color: 'var(--text-dim)', fontSize: 11 }}>Push xabarlar</div>
              </div>
            </div>
            <Toggle on={notif} onChange={() => setNotif(!notif)} />
          </div>
        </div>

        {/* 5. Support & info */}
        <div className="card overflow-hidden animate-fade-in-up" style={{ overflow: 'hidden' }}>
          {[
            { icon: Headphones, label: "Qo'llab-quvvatlash", note: '24/7 onlayn chat va call-markaz', onClick: () => navigate('/support') },
            { icon: FileText, label: 'Foydalanish shartlari', note: '', onClick: () => window.alert('Foydalanish shartlari v1.0') },
            { icon: Lock, label: 'Maxfiylik siyosati', note: '', onClick: () => window.alert('Maxfiylik siyosati v1.0') },
          ].map((item, i) => (
            <button key={item.label} onClick={item.onClick} className="w-full flex items-center justify-between" style={{ padding: '13px 16px', cursor: 'pointer', background: 'none', border: 'none', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <div className="flex items-center" style={{ gap: 12 }}>
                <span style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'var(--surface-active)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.icon size={15} color="var(--text-muted)" />
                </span>
                <div>
                  <div style={{ color: 'var(--text)', fontSize: 14 }}>{item.label}</div>
                  {item.note && <div style={{ color: 'var(--text-dim)', fontSize: 11 }}>{item.note}</div>}
                </div>
              </div>
              <ChevronRight size={16} color="var(--text-dim)" />
            </button>
          ))}
        </div>

        <button onClick={handleLogout} className="w-full flex items-center justify-center" style={{ gap: 8, padding: 14, borderRadius: 'var(--radius)', border: '1px solid rgba(239,68,68,.2)', background: 'none', color: 'var(--danger)', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all .2s' }}>
          <LogOut size={16} />
          Tizimdan chiqish
        </button>

        <div style={{ textAlign: 'center', paddingTop: 4, color: 'var(--text-dim)', fontSize: 11 }}>
          BEK FOOD v1.0.2 · {'©'} 2026
        </div>
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 16 }} onClick={() => setEditing(false)}>
          <div className="card p-5 animate-slide-up" style={{ width: '100%', maxWidth: 480, boxShadow: 'var(--shadow-xl)', border: 'none', marginBottom: 20 }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <h3 className="subheading" style={{ fontSize: 16 }}>Profilni tahrirlash</h3>
              <button onClick={() => setEditing(false)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Ismingiz" className="input" />
              <div className="input-group">
                <span className="input-group-icon" style={{ fontWeight: 600, color: 'var(--text-muted)' }}>+998</span>
                <input type="tel" inputMode="numeric" value={editPhone.replace(/^998/, '')} onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 12))} placeholder="90 123 45 67" className="input" style={{ paddingLeft: 52 }} />
              </div>
              <button onClick={saveEdit} className="btn btn-primary w-full" disabled={!editName.trim()}>
                <Check size={16} /> Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}