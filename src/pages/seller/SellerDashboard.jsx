import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { BellRing, ChefHat, PackageCheck, Bike, ArrowRight, AlertTriangle, Clock } from 'lucide-react';

const KPI = [
  { key: 'pending', label: 'Yangi', icon: BellRing, color: '#EF4444', bg: '#FEF2F2' },
  { key: 'preparing', label: 'Tayyorlanmoqda', icon: ChefHat, color: '#F97316', bg: '#FFF7ED' },
  { key: 'ready', label: 'Tayyor', icon: PackageCheck, color: '#22C55E', bg: '#F0FDF4' },
  { key: 'onTheWay', label: 'Yetkazilmoqda', icon: Bike, color: '#3B82F6', bg: '#EFF6FF' },
];

const formatPrice = (n) => Number(n || 0).toLocaleString('uz-UZ') + " so'm";

function SkeletonCard() {
  return (
    <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: 140 }} />
    </div>
  );
}

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { orders, user, isAppLoading } = useStore();

  const count = (status) => orders.filter((o) => o.status === status).length;
  const delivering = orders.filter((o) => ['assigned', 'onTheWay', 'pickedUp'].includes(o.status));

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const longWaiting = orders.filter((o) =>
    (o.status === 'pending' || o.status === 'confirmed') &&
    (Date.now() - new Date(o.createdAt).getTime()) > 15 * 60 * 1000
  );

  if (isAppLoading) {
    return (
      <div style={{ padding: '16px 16px 32px', background: 'var(--bg)', minHeight: '100vh' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="skeleton" style={{ height: 28, width: 120, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 14, width: 180, marginBottom: 24 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
          <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius)' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 16px 32px', background: 'var(--bg)', minHeight: '100%' }}>
      <style>{`
        .sd-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
        .sd-kpi{padding:16px;border-radius:var(--radius);cursor:pointer;transition:all .2s var(--ease);border:1px solid transparent;min-height:110px;display:flex;flex-direction:column;justify-content:space-between}
        .sd-kpi:active{transform:scale(.97)}
        .sd-kpi-num{font-size:32px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums}
        .sd-action-card{padding:14px 16px;border-radius:var(--radius-sm);display:flex;align-items:center;gap:12px}
        .sd-action-btn{display:flex;align-items:center;justify-content:center;gap:6px;padding:12px 0;border-radius:var(--radius-sm);border:none;font-size:14px;font-weight:700;cursor:pointer;min-height:48px;flex-shrink:0}
        @media(min-width:768px){
          .sd-grid{grid-template-columns:repeat(4,1fr);gap:14px}
          .sd-kpi{padding:20px;min-height:130px}
          .sd-kpi-num{font-size:38px}
        }
        @media(max-width:374px){
          .sd-kpi-num{font-size:28px}
          .sd-kpi{padding:14px;min-height:100px}
        }
      `}</style>

      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Xush kelibsiz, <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user?.name || 'Operator'}</span></p>
        </div>

        <div className="sd-grid" style={{ marginBottom: 20 }}>
          {KPI.map((k) => {
            const Icon = k.icon;
            const val = k.key === 'onTheWay' ? delivering.length : count(k.key);
            return (
              <div key={k.key} className="sd-kpi" style={{ background: k.bg }} onClick={() => navigate('/seller/orders?status=' + (k.key === 'onTheWay' ? 'onTheWay' : k.key))}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <Icon size={20} style={{ color: k.color }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: k.color, background: '#fff', padding: '3px 8px', borderRadius: 999, letterSpacing: '0.03em' }}>BUGUN</span>
                </div>
                <div>
                  <div className="sd-kpi-num" style={{ color: k.color }}>{val}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 2 }}>{k.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg, #FEF2F2, #FFF7ED)' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={16} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Action Required</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Hozir nima qilishingiz kerak</p>
            </div>
            {pendingOrders.length > 0 && (
              <span style={{ minWidth: 24, height: 24, borderRadius: 12, background: 'var(--danger)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 7px', flexShrink: 0 }}>
                {pendingOrders.length}
              </span>
            )}
          </div>

          <div style={{ padding: '8px' }}>
            {pendingOrders.length === 0 && longWaiting.length === 0 ? (
              <div style={{ padding: '36px 16px', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <span style={{ fontSize: 28 }}>✅</span>
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>Hamma buyurtmalar tartibda</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Yangi buyurtma kelganda bu yerda paydo bo'ladi</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pendingOrders.map((o) => (
                  <div key={o.id} className="sd-action-card" style={{ background: '#FEF2F2', border: '1px solid rgba(239,68,68,0.12)', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>#{String(o.id).slice(-4)}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--danger)' }}>{formatPrice(o.total)}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {o.customerName} · {o.items?.map((it) => `${it.quantity}× ${it.food?.name}`).join(', ')}
                      </div>
                    </div>
                    <button onClick={() => { useStore.getState().acceptOrder(o.id); navigate('/seller/orders?status=confirmed'); }}
                      className="sd-action-btn" style={{ background: 'var(--success)', color: '#fff', width: '100%', fontSize: 14 }}>
                      ACCEPT ORDER
                    </button>
                  </div>
                ))}
                {longWaiting.filter((o) => o.status === 'confirmed').map((o) => (
                  <div key={o.id} className="sd-action-card" style={{ background: '#FFFBEB', border: '1px solid rgba(245,158,11,0.15)', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>#{String(o.id).slice(-4)}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--danger)', background: '#FEF2F2', padding: '3px 8px', borderRadius: 6 }}>
                          <Clock size={11} /> Kechikyapti
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tasdiqlangan — tayyorlashni bosing</div>
                    </div>
                    <button onClick={() => useStore.getState().startPreparing(o.id)}
                      className="sd-action-btn" style={{ background: 'var(--primary)', color: '#fff', width: '100%', fontSize: 14 }}>
                      START PREPARING
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
