import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, RotateCcw, Star } from 'lucide-react';
import useStore from '../store/useStore';

const statusConfig = {
  pending: { label: 'Kutilmoqda', color: '#eab308', bg: 'rgba(234,179,8,.15)' },
  preparing: { label: 'Tayyorlanmoqda', color: '#e51e1e', bg: 'rgba(229,30,30,.15)' },
  ready: { label: 'Tayyor', color: '#7fbf7f', bg: 'rgba(127,191,127,.15)' },
  onTheWay: { label: "Yo'lda", color: '#e51e1e', bg: 'rgba(229,30,30,.15)' },
  delivered: { label: 'Yetkazildi', color: '#7fbf7f', bg: 'rgba(127,191,127,.15)' },
  cancelled: { label: 'Bekor qilindi', color: '#6b6b6b', bg: 'rgba(255,255,255,.05)' },
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
        <h1 className="heading text-center" style={{ marginBottom: 12 }}>Buyurtmalar</h1>
        <div className="flex gap-2">
          {[
            { id: 'active', label: 'Faol', count: active.length },
            { id: 'completed', label: 'Tarix', count: completed.length },
            { id: 'cancelled', label: 'Bekor', count: cancelled.length },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1" style={{
                padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all .15s',
                background: tab === t.id ? '#e51e1e' : '#141414',
                color: tab === t.id ? '#fff' : '#6b6b6b',
                border: `1px solid ${tab === t.id ? '#e51e1e' : 'rgba(255,255,255,0.08)'}`
              }}>
              {t.label} {t.count > 0 && `(${t.count})`}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {displayed.length === 0 && (
          <div className="empty-state py-16">
            <div className="empty-state-icon">
              {tab === 'active' ? <Clock size={20} /> : tab === 'completed' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            </div>
            <h3 style={{ color: '#fff', fontWeight: 500, marginBottom: 4 }}>Buyurtma yo'q</h3>
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Hozircha buyurtmalar mavjud emas</p>
          </div>
        )}

        {displayed.map((order) => {
          const st = statusConfig[order.status] || statusConfig.pending;
          return (
            <div key={order.id} className="card p-4 animate-slide-up">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p style={{ color: '#6b6b6b', fontSize: 12 }}>Buyurtma #{String(order.id).slice(-4)}</p>
                  <p style={{ color: '#6b6b6b', fontSize: 12, marginTop: 2 }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="badge" style={{ color: st.color, background: st.bg, fontSize: 10, padding: '4px 8px' }}>{st.label}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex" style={{ marginRight: -4 }}>
                  {order.items.slice(0, 3).map((item, i) => (
                    <img key={i} src={item.food.image} alt="" style={{ width: 28, height: 28, borderRadius: 8, border: '2px solid #0a0a0a', objectFit: 'cover' }} />
                  ))}
                </div>
                <p style={{ color: '#6b6b6b', fontSize: 12 }}>{order.items.length} ta mahsulot</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="price-sm">{order.total.toLocaleString()} so'm</span>
                <div className="flex gap-2">
                  {tab === 'active' && (
                    <button onClick={() => navigate('/tracking')} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(229,30,30,.15)', color: '#e51e1e', fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer' }}>
                      Kuzatish
                    </button>
                  )}
                  {tab === 'completed' && (
                    <button style={{ padding: 6, borderRadius: 8, background: '#141414', border: '1px solid rgba(255,255,255,0.08)', color: '#6b6b6b', cursor: 'pointer' }}>
                      <Star size={14} />
                    </button>
                  )}
                  <button style={{ padding: 6, borderRadius: 8, background: '#141414', border: '1px solid rgba(255,255,255,0.08)', color: '#6b6b6b', cursor: 'pointer' }}>
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
