import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Star } from 'lucide-react';
import useStore from '../store/useStore';
import EmptyState from '../components/EmptyState';

const statusConfig = {
  pending: { label: 'Kutilmoqda', color: 'var(--warning)', bg: 'var(--warning-light)' },
  preparing: { label: 'Tayyorlanmoqda', color: 'var(--primary)', bg: 'var(--primary-light)' },
  ready: { label: 'Tayyor', color: 'var(--success)', bg: 'var(--success-light)' },
  onTheWay: { label: "Yo'lda", color: 'var(--primary)', bg: 'var(--primary-light)' },
  delivered: { label: 'Yetkazildi', color: 'var(--success)', bg: 'var(--success-light)' },
  cancelled: { label: 'Bekor qilindi', color: 'var(--text-dim)', bg: 'var(--surface-active)' },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders } = useStore();
  const [tab, setTab] = useState('active');

  const active = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));
  const completed = orders.filter((o) => o.status === 'delivered');
  const cancelled = orders.filter((o) => o.status === 'cancelled');
  const displayed = tab === 'active' ? active : tab === 'completed' ? completed : cancelled;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="p-4">
        <h1 className="heading text-center" style={{ marginBottom: 14 }}>Buyurtmalar</h1>
        <div className="flex" style={{ gap: 8 }}>
          {[
            { id: 'active', label: 'Faol', count: active.length },
            { id: 'completed', label: 'Tarix', count: completed.length },
            { id: 'cancelled', label: 'Bekor', count: cancelled.length },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className="flex-1" style={{
              padding: '10px 0', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all .2s',
              background: tab === t.id ? 'var(--primary)' : 'var(--surface)',
              color: tab === t.id ? '#fff' : 'var(--text-muted)',
              border: `1.5px solid ${tab === t.id ? 'var(--primary)' : 'var(--border)'}`,
            }}>
              {t.label} {t.count > 0 && `(${t.count})`}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {displayed.length === 0 && (
          <EmptyState
            icon="orders"
            title="Buyurtma yo'q"
            description={tab === 'active' ? 'Faol buyurtmalaringiz yo\'q. Yangi buyurtma berishni boshlang!' : tab === 'completed' ? 'Hozircha bajarilgan buyurtmalar mavjud emas' : 'Bekor qilingan buyurtmalar yo\'q'}
            actionLabel={tab === 'active' ? 'Menyuga o\'tish' : undefined}
            onAction={() => navigate('/')}
          />
        )}

        {displayed.map((order) => {
          const st = statusConfig[order.status] || statusConfig.pending;
          return (
            <div key={order.id} className="card p-4 animate-slide-up">
              <div className="flex items-start justify-between" style={{ marginBottom: 12 }}>
                <div>
                  <p className="caption">Buyurtma #{String(order.id).slice(-4)}</p>
                  <p className="caption" style={{ marginTop: 2 }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="badge" style={{ color: st.color, background: st.bg }}>{st.label}</span>
              </div>
              <div className="flex items-center" style={{ gap: 4, marginBottom: 12 }}>
                <div className="flex" style={{ marginRight: -4 }}>
                  {order.items.slice(0, 3).map((item, i) => (
                    <img key={i} src={item.food.image} alt="" onError={(e) => { e.currentTarget.src = '/food/placeholder.svg'; }} style={{ width: 32, height: 32, borderRadius: 'var(--radius-xs)', border: '2px solid var(--bg)', objectFit: 'cover' }} />
                  ))}
                </div>
                <p className="caption">{order.items.length} ta mahsulot</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="price-sm">{order.total.toLocaleString()} so'm</span>
                <div className="flex" style={{ gap: 6 }}>
                  {tab === 'active' && (
                    <button onClick={() => navigate('/tracking')} className="btn btn-primary btn-xs">
                      Kuzatish
                    </button>
                  )}
                  {tab === 'completed' && (
                    <button className="btn btn-ghost btn-icon" style={{ width: 32, height: 32, minHeight: 32 }}>
                      <Star size={14} />
                    </button>
                  )}
                  <button className="btn btn-ghost btn-icon" style={{ width: 32, height: 32, minHeight: 32 }}>
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
