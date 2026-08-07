import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { BellRing, ChefHat, PackageCheck, Bike, ArrowRight, AlertTriangle, Clock } from 'lucide-react';

const KPI = [
  { key: 'pending', label: 'Yangi buyurtmalar', icon: BellRing, color: '#EF4444', bg: '#FEF2F2' },
  { key: 'preparing', label: 'Tayyorlanmoqda', icon: ChefHat, color: '#F97316', bg: '#FFF7ED' },
  { key: 'ready', label: 'Tayyor', icon: PackageCheck, color: '#22C55E', bg: '#F0FDF4' },
  { key: 'onTheWay', label: 'Yetkazilmoqda', icon: Bike, color: '#3B82F6', bg: '#EFF6FF' },
];

const formatPrice = (n) => Number(n || 0).toLocaleString('uz-UZ') + " so'm";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { orders, user } = useStore();

  const count = (status) => orders.filter((o) => o.status === status).length;
  const delivering = orders.filter((o) => ['assigned', 'onTheWay', 'pickedUp'].includes(o.status));

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const longWaiting = orders.filter((o) =>
    (o.status === 'pending' || o.status === 'confirmed') &&
    (Date.now() - new Date(o.createdAt).getTime()) > 15 * 60 * 1000
  );

  return (
    <div style={{ padding: '20px 16px 32px', background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{`
        .sd-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
        .sd-kpi{padding:20px;border-radius:16px;cursor:pointer;transition:all .2s;border:1px solid transparent}
        .sd-kpi:hover{transform:translateY(-2px);box-shadow:var(--shadow-md)}
        @media(max-width:480px){
          .sd-grid{gridTemplateColumns:1fr}
          .sd-kpi{padding:16px}
        }
        @media(min-width:768px){
          .sd-grid{gridTemplateColumns:repeat(4,1fr)}
        }
      `}</style>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>Dashboard</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Xush kelibsiz, <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user?.name || 'Operator'}</span></p>
          </div>
          <button onClick={() => navigate('/seller/orders')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, background: 'var(--primary)', color: '#fff', boxShadow: '0 2px 8px rgba(249,115,22,0.3)' }}>
            Buyurtmalar <ArrowRight size={16} />
          </button>
        </div>

        <div className="sd-grid" style={{ marginBottom: 24 }}>
          {KPI.map((k) => {
            const Icon = k.icon;
            const val = k.key === 'onTheWay' ? delivering.length : count(k.key);
            return (
              <div key={k.key} className="sd-kpi" style={{ background: k.bg }} onClick={() => navigate(`/seller/orders?status=${k.key}`)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <Icon size={22} style={{ color: k.color }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: k.color, background: '#fff', padding: '3px 10px', borderRadius: 999 }}>BUGUN</span>
                </div>
                <div style={{ fontSize: 36, fontWeight: 800, color: k.color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{val}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 6 }}>{k.label}</div>
              </div>
            );
          })}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg, #FEF2F2, #FFF7ED)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={18} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Action Required</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Hozir nima qilishingiz kerak</p>
            </div>
          </div>

          <div style={{ padding: '8px' }}>
            {pendingOrders.length === 0 && longWaiting.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>Hamma buyurtmalar tartibda</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Yangi buyurtma kelganda bu yerda paydo boladi</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pendingOrders.map((o) => (
                  <div key={o.id} style={{ padding: '14px 16px', borderRadius: 12, background: '#FEF2F2', border: '1px solid rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>#{String(o.id).slice(-4)}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)' }}>{formatPrice(o.total)}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {o.items?.map((it) => `${it.quantity}× ${it.food?.name}`).join(', ')}
                      </div>
                    </div>
                    <button onClick={() => { useStore.getState().acceptOrder(o.id); navigate('/seller/orders?status=confirmed'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, border: 'none', background: 'var(--success)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Accept Order
                    </button>
                  </div>
                ))}
                {longWaiting.filter((o) => o.status === 'confirmed').map((o) => (
                  <div key={o.id} style={{ padding: '14px 16px', borderRadius: 12, background: '#FFFBEB', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 140 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>#{String(o.id).slice(-4)}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--danger)', background: '#FEF2F2', padding: '2px 8px', borderRadius: 6 }}>
                          <Clock size={11} /> Kechikyapti
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tasdiqlangan — tayyorlashni bosing</div>
                    </div>
                    <button onClick={() => useStore.getState().startPreparing(o.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, border: 'none', background: 'var(--primary)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Start Preparing
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
