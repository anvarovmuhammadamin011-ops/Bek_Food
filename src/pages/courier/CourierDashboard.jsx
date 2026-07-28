import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, Navigation, Banknote, TrendingUp, Settings, LogOut, CheckCircle2, Truck, LayoutDashboard, ShoppingCart } from 'lucide-react';
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
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: 16,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        background: 'var(--primary-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
      }}>
        <Icon size={20} style={{ color: 'var(--primary)' }} />
      </div>
      <p style={{
        color: 'var(--text)',
        fontSize: 22,
        fontWeight: 700,
        lineHeight: 1.1,
        margin: 0,
      }}>
        {isString ? value : animated.toLocaleString()}{suffix || ''}
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4, margin: '4px 0 0 0' }}>{label}</p>
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
                x={x} y={y} width={barWidth} height={barH} rx={6} ry={6}
                fill="var(--primary)" opacity={0.8}
                style={{ transition: 'height 0.8s cubic-bezier(.4,0,.2,1), y 0.8s cubic-bezier(.4,0,.2,1)' }}
              />
              <text
                x={x + barWidth / 2} y={chartHeight + 18}
                textAnchor="middle" fill="var(--text-muted)" fontSize={10}
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
    <div className="h-full overflow-y-auto scrollbar-hide" style={{ paddingBottom: 90 }}>
      <div style={{ padding: 16 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}>
          <div>
            <h1 style={{
              color: 'var(--text)',
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
            }}>
              Kuryer paneli
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>
              {user?.name || 'Kuryer'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setIsOnline(!isOnline)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isOnline ? 'var(--success)' : 'var(--text-muted)',
                boxShadow: isOnline ? '0 0 8px rgba(34,197,94,0.4)' : 'none',
              }} />
              <span style={{ color: 'var(--text)', fontSize: 12, fontWeight: 600 }}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </button>
            <button
              onClick={handleLogout}
              style={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <LogOut size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 10,
          marginBottom: 20,
        }}>
          <StatCard icon={Package} label="Buyurtmalar soni" value={courierStats.today.orders} />
          <StatCard icon={Truck} label="Faol buyurtmalar" value={orders.filter(o => o.status === 'onTheWay').length} />
          <StatCard icon={CheckCircle2} label="Yakunlangan" value={courierStats.today.orders} />
          <StatCard icon={Clock} label="O'rtacha vaqt" value="28 daqiqa" isString />
          <StatCard icon={Navigation} label="Masofa" value="47.5 km" isString />
          <StatCard icon={Banknote} label="Daromad" value="180,000 so'm" isString />
        </div>

        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: 16,
          marginBottom: 20,
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600, margin: 0 }}>
              Haftalik statistika
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              background: 'rgba(34,197,94,0.08)',
              borderRadius: 8,
            }}>
              <TrendingUp size={12} style={{ color: 'var(--success)' }} />
              <span style={{ color: 'var(--success)', fontSize: 11, fontWeight: 600 }}>+12%</span>
            </div>
          </div>
          <WeekChart data={courierStats.weekChart} />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button
            onClick={() => navigate('/courier/orders')}
            style={{
              flex: 1,
              borderRadius: 12,
              padding: '14px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: 'var(--primary)',
              color: '#fff',
              boxShadow: '0 4px 14px rgba(249,115,22,0.3)',
            }}
          >
            <Package size={16} />
            Buyurtmalar
          </button>
          <button
            onClick={() => navigate('/courier/settings')}
            style={{
              flex: 1,
              borderRadius: 12,
              padding: '14px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              border: '1px solid var(--border)',
              cursor: 'pointer',
              background: 'var(--surface)',
              color: 'var(--text)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Settings size={16} />
            Sozlamalar
          </button>
        </div>

        <div>
          <h3 style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
            So'nggi faoliyat
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentDelivered.length === 0 && (
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '32px 20px',
                textAlign: 'center',
              }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Hali yetkazilgan buyurtmalar yo'q</p>
              </div>
            )}
            {recentDelivered.map((order) => (
              <div
                key={order.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px 16px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: 'rgba(34,197,94,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600, margin: 0 }}>
                        {order.customerName}
                      </p>
                      <p style={{
                        color: 'var(--text-muted)',
                        fontSize: 11,
                        marginTop: 2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {order.address}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                    <p style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 600, margin: 0 }}>
                      {order.total.toLocaleString()} so'm
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 10, marginTop: 2 }}>
                      {order.deliveredAt
                        ? new Date(order.deliveredAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
                        : '\u2014'
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '8px 0',
          maxWidth: 480,
          margin: '0 auto',
        }}>
          {[
            { icon: LayoutDashboard, label: 'Bosh sahifa', path: '/courier' },
            { icon: ShoppingCart, label: 'Buyurtmalar', path: '/courier/orders' },
            { icon: Settings, label: 'Sozlamalar', path: '/courier/settings' },
          ].map((item) => {
            const isActive = window.location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: -8,
                    width: 24,
                    height: 3,
                    borderRadius: 2,
                    background: 'var(--primary)',
                  }} />
                )}
                <item.icon
                  size={20}
                  style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}
                />
                <span style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
