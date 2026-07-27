import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, Navigation, Banknote, TrendingUp, Settings, LogOut, Zap, CheckCircle2, Truck } from 'lucide-react';
import useStore from '../../store/useStore';

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = null;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return count;
}

function StatCard({ icon: Icon, label, value, suffix, isString }) {
  const animated = useCountUp(isString ? 0 : value);
  return (
    <div className="card card-hover p-4 animate-fade-in-up" style={{ background: '#141414', borderRadius: 14 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: 'rgba(229,30,30,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={18} color="#e51e1e" />
        </div>
      </div>
      <p style={{
        fontFamily: 'var(--font-display)', color: '#fff', fontSize: 22, fontWeight: 700,
        lineHeight: 1.1
      }}>
        {isString ? value : animated.toLocaleString()}{suffix || ''}
      </p>
      <p style={{ color: '#6b6b6b', fontSize: 11, marginTop: 4 }}>{label}</p>
    </div>
  );
}

function WeekChart({ data }) {
  const days = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'];
  const max = Math.max(...data, 1);
  const barWidth = 36;
  const gap = 8;
  const chartHeight = 120;
  const svgWidth = days.length * (barWidth + gap);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ overflowX: 'auto', paddingTop: 4 }}>
      <svg width={svgWidth} height={chartHeight + 28} style={{ display: 'block' }}>
        {data.map((val, i) => {
          const barH = animated ? (val / max) * chartHeight : 0;
          const x = i * (barWidth + gap) + gap / 2;
          const y = chartHeight - barH;
          return (
            <g key={i}>
              <rect
                x={x} y={y} width={barWidth} height={barH} rx={4} ry={4}
                fill="#e51e1e" opacity={0.85}
                style={{ transition: 'height 0.8s cubic-bezier(.4,0,.2,1), y 0.8s cubic-bezier(.4,0,.2,1)' }}
              />
              <text
                x={x + barWidth / 2} y={chartHeight + 18}
                textAnchor="middle" fill="#6b6b6b" fontSize={10}
                fontFamily="var(--font-sans)"
              >
                {days[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function CourierDashboard() {
  const navigate = useNavigate();
  const { user, courierStats, orders, logout } = useStore();
  const [isOnline, setIsOnline] = useState(true);

  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const recentDelivered = deliveredOrders.slice(0, 3);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in" style={{ marginBottom: 24 }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)', color: '#fff', fontSize: 22, fontWeight: 700,
              margin: 0
            }}>
              Kuryer paneli
            </h1>
            <p style={{ color: '#6b6b6b', fontSize: 12, marginTop: 2 }}>
              {user?.name || 'Kuryer'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOnline(!isOnline)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                background: '#141414', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10, cursor: 'pointer'
              }}
            >
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: isOnline ? '#22c55e' : '#6b6b6b',
                boxShadow: isOnline ? '0 0 6px rgba(34,197,94,0.5)' : 'none'
              }} />
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </button>
            <button
              onClick={handleLogout}
              style={{
                width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#141414', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10, cursor: 'pointer'
              }}
            >
              <LogOut size={16} color="#6b6b6b" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2" style={{ gap: 10, marginBottom: 20 }}>
          <StatCard icon={Package} label="Buyurtmalar soni" value={courierStats.today.orders} />
          <StatCard icon={Truck} label="Faol buyurtmalar" value={orders.filter(o => o.status === 'onTheWay').length} />
          <StatCard icon={CheckCircle2} label="Yakunlangan" value={courierStats.today.orders} />
          <StatCard icon={Clock} label="O'rtacha vaqt" value="28 daqiqa" isString />
          <StatCard icon={Navigation} label="Masofa" value="47.5 km" isString />
          <StatCard icon={Banknote} label="Daromad" value="180,000 so'm" isString />
        </div>

        {/* Weekly Chart */}
        <div className="card p-4 animate-fade-in-up stagger" style={{ background: '#141414', borderRadius: 14, marginBottom: 20 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
            <h3 style={{
              fontFamily: 'var(--font-display)', color: '#fff', fontSize: 14, fontWeight: 600, margin: 0
            }}>
              Haftalik statistika
            </h3>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px',
              background: 'rgba(34,197,94,0.1)', borderRadius: 6
            }}>
              <TrendingUp size={12} color="#22c55e" />
              <span style={{ color: '#22c55e', fontSize: 11, fontWeight: 600 }}>+12%</span>
            </div>
          </div>
          <WeekChart data={courierStats.weekChart} />
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-in-up stagger" style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button
            onClick={() => navigate('/courier/orders')}
            className="btn btn-primary btn-glow flex-1"
            style={{
              borderRadius: 12, padding: '14px 0', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 600
            }}
          >
            <Package size={16} />
            Buyurtmalar
          </button>
          <button
            className="btn btn-primary flex-1"
            style={{
              borderRadius: 12, padding: '14px 0', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 600,
              background: '#141414', border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            <TrendingUp size={16} />
            Statistika
          </button>
          <button
            className="btn btn-primary flex-1"
            style={{
              borderRadius: 12, padding: '14px 0', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6, fontSize: 13, fontWeight: 600,
              background: '#141414', border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            <Settings size={16} />
            Sozlamalar
          </button>
        </div>

        {/* Recent Activity */}
        <div className="animate-fade-in-up stagger">
          <h3 style={{
            fontFamily: 'var(--font-display)', color: '#fff', fontSize: 14, fontWeight: 600,
            marginBottom: 12
          }}>
            So'nggi faoliyat
          </h3>
          <div className="space-y-3">
            {recentDelivered.length === 0 && (
              <div className="card p-6" style={{ background: '#141414', borderRadius: 14, textAlign: 'center' }}>
                <p style={{ color: '#6b6b6b', fontSize: 13 }}>Hali yetkazilgan buyurtmalar yo'q</p>
              </div>
            )}
            {recentDelivered.map((order) => (
              <div
                key={order.id}
                className="card card-hover"
                style={{ background: '#141414', borderRadius: 14, padding: '14px 16px' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3" style={{ flex: 1 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, background: 'rgba(34,197,94,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <CheckCircle2 size={18} color="#22c55e" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: 0 }}>
                        {order.customerName}
                      </p>
                      <p style={{
                        color: '#6b6b6b', fontSize: 11, marginTop: 2,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }}>
                        {order.address}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                    <p style={{
                      fontFamily: 'var(--font-display)', color: '#e51e1e', fontSize: 13, fontWeight: 600, margin: 0
                    }}>
                      {order.total.toLocaleString()} so'm
                    </p>
                    <p style={{ color: '#6b6b6b', fontSize: 10, marginTop: 2 }}>
                      {order.deliveredAt
                        ? new Date(order.deliveredAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
                        : '—'
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
