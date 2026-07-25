import { AlertCircle, CheckCircle, ChefHat, UtensilsCrossed, Truck, XCircle } from 'lucide-react';
import useOrderManagerStore from '../store/useOrderManagerStore';

export default function OMDashboard() {
  const { getStats, setActivePage } = useOrderManagerStore();
  const stats = getStats();

  const cards = [
    { label: 'Yangi buyurtmalar', value: stats.pending, icon: AlertCircle, bg: 'var(--color-warning-light)', color: 'var(--color-warning)', page: 'orders' },
    { label: 'Qabul qilingan', value: stats.accepted, icon: CheckCircle, bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', page: 'orders' },
    { label: 'Tayyorlanmoqda', value: stats.preparing, icon: ChefHat, bg: 'rgba(249,115,22,0.1)', color: '#f97316', page: 'orders' },
    { label: 'Tayyor', value: stats.ready, icon: UtensilsCrossed, bg: 'var(--color-primary-light)', color: 'var(--color-primary)', page: 'orders' },
    { label: 'Haydovchi kutilmoqda', value: stats.waitingDriver, icon: Truck, bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6', page: 'delivery' },
    { label: 'Yetkazilmoqda', value: stats.outForDelivery, icon: Truck, bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6', page: 'delivery' },
    { label: 'Bugun yetkazilgan', value: stats.completed, icon: CheckCircle, bg: 'var(--color-success-light)', color: 'var(--color-success)', page: 'orders' },
    { label: 'Bekor qilingan', value: stats.cancelled, icon: XCircle, bg: 'var(--color-danger-light)', color: 'var(--color-danger)', page: 'orders' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>
        Buyurtma Boshqaruvi
      </h2>

      <div className="om-stats-grid">
        {cards.map((card, i) => (
          <div key={i} className="om-stat-card om-animate-in" style={{ animationDelay: `${i * 0.05}s` }} onClick={() => setActivePage(card.page)}>
            <div className="om-stat-icon" style={{ background: card.bg }}>
              <card.icon size={20} color={card.color} />
            </div>
            <div className="om-stat-value">{card.value}</div>
            <div className="om-stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', marginTop: '8px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
          Tezkor Xulosa
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg-secondary)', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.total}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Jami buyurtmalar</div>
          </div>
          <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg-secondary)', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-success)' }}>{stats.completed}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Yetkazilgan</div>
          </div>
          <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg-secondary)', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-danger)' }}>{stats.cancelled}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bekor qilingan</div>
          </div>
        </div>
      </div>
    </div>
  );
}
