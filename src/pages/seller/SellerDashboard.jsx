import { useNavigate } from 'react-router-dom';
import { ClipboardList, Utensils, Package, Gift, LogOut, Bell } from 'lucide-react';
import useStore from '../../store/useStore';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { getPendingOrders, user, logout } = useStore();
  const pending = getPendingOrders();

  const cards = [
    { label: 'Buyurtmalar', count: pending.length, icon: ClipboardList, path: '/seller/orders', accent: true },
    { label: 'Menyu', icon: Utensils, path: '/seller/menu' },
    { label: 'Ombor', icon: Package, path: '/seller/inventory' },
    { label: 'Bonuslar', icon: Gift, path: '/seller/bonuses' },
  ];

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4 flex items-center justify-between">
        <h1 className="heading">Sotuvchi paneli</h1>
        <button onClick={() => logout()} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <LogOut size={16} color="#6b6b6b" />
        </button>
      </div>
      <div className="p-4">
        <p style={{ color: '#6b6b6b', fontSize: 12, marginBottom: 16 }}>Xush kelibsiz, {user?.name || 'Sotuvchi'}</p>
        <div className="grid grid-cols-2" style={{ gap: 12 }}>
          {cards.map((card) => (
            <button key={card.path} onClick={() => navigate(card.path)} className="card p-5 text-left" style={{ cursor: 'pointer' }}>
              <card.icon size={24} color={card.accent ? '#e51e1e' : '#6b6b6b'} />
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 500, marginTop: 12 }}>{card.label}</p>
              {card.count !== undefined && <p style={{ fontFamily: 'var(--font-display)', color: '#e51e1e', fontSize: 24, fontWeight: 600, marginTop: 4 }}>{card.count}</p>}
            </button>
          ))}
        </div>

        {pending.length > 0 && (
          <div className="card p-4" style={{ marginTop: 16 }}>
            <div className="flex items-center gap-2 mb-3">
              <Bell size={16} color="#e51e1e" className="animate-pulse" />
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>Kutayotgan buyurtmalar</h3>
            </div>
            {pending.slice(0, 3).map((o) => (
              <div key={o.id} className="flex items-center justify-between" style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <p style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>#{String(o.id).slice(-4)}</p>
                  <p style={{ color: '#6b6b6b', fontSize: 12 }}>{o.items.length} ta mahsulot</p>
                </div>
                <span className="badge badge-yellow" style={{ fontSize: 10 }}>{o.status === 'pending' ? 'Yangi' : 'Tayyorlanmoqda'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
