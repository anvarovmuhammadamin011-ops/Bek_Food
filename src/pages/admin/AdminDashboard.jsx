import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, BarChart3, ClipboardList, LogOut, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Clock } from 'lucide-react';
import useStore from '../../store/useStore';

function CountUp({ end, duration = 1200, suffix = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <>{val.toLocaleString()}{suffix}</>;
}

function MiniChart({ data, color = '#e51e1e' }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 32;
  const w = 100;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
      <polyline fill={`${color}15`} stroke="none" points={`0,${h} ${points} ${w},${h}`} />
    </svg>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { orders, branches, employees, user, logout } = useStore();
  const todaySales = orders.filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const totalRevenue = todaySales.reduce((s, o) => s + o.total, 0);
  const weekRevenue = orders.filter((o) => { const d = new Date(o.createdAt); const now = new Date(); return (now - d) < 7 * 86400000; }).reduce((s, o) => s + o.total, 0);
  const prevWeekRevenue = orders.filter((o) => { const d = new Date(o.createdAt); const now = new Date(); return (now - d) >= 7 * 86400000 && (now - d) < 14 * 86400000; }).reduce((s, o) => s + o.total, 0);
  const revenueChange = prevWeekRevenue > 0 ? Math.round(((weekRevenue - prevWeekRevenue) / prevWeekRevenue) * 100) : 0;
  const chartData = [12, 19, 8, 15, 22, 11, 17, 14, 20, 16, 23, 18];

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4 flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="heading">Admin paneli</h1>
          <p style={{ color: '#6b6b6b', fontSize: 12, marginTop: 2 }}>Xush kelibsiz, {user?.name || 'Admin'}</p>
        </div>
        <button onClick={() => logout()} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s' }}>
          <LogOut size={16} color="#6b6b6b" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Revenue Hero */}
        <div className="card animate-fade-in-up" style={{ padding: 16 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
            <span style={{ color: '#6b6b6b', fontSize: 12 }}>Bugungi savdo</span>
            <div className="flex items-center gap-1" style={{ color: revenueChange >= 0 ? '#7fbf7f' : '#e51e1e', fontSize: 11, fontWeight: 500 }}>
              {revenueChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {revenueChange >= 0 ? '+' : ''}{revenueChange}%
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', color: '#e51e1e', fontSize: 30, fontWeight: 600 }}>
            <CountUp end={totalRevenue} /> so'm
          </div>
          <p style={{ color: '#6b6b6b', fontSize: 12, marginTop: 4 }}>{todaySales.length} ta buyurtma</p>
          <div style={{ marginTop: 12 }}>
            <MiniChart data={chartData} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 stagger" style={{ gap: 8 }}>
          <div className="card animate-scale-in" style={{ padding: 12, textAlign: 'center' }}>
            <DollarSign size={18} color="#e51e1e" style={{ margin: '0 auto 4px' }} />
            <div style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 16, fontWeight: 600 }}><CountUp end={weekRevenue} /></div>
            <div style={{ color: '#6b6b6b', fontSize: 10 }}>Haftalik</div>
          </div>
          <div className="card animate-scale-in" style={{ padding: 12, textAlign: 'center', animationDelay: '.05s' }}>
            <ShoppingBag size={18} color="#e51e1e" style={{ margin: '0 auto 4px' }} />
            <div style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 16, fontWeight: 600 }}><CountUp end={orders.length} /></div>
            <div style={{ color: '#6b6b6b', fontSize: 10 }}>Buyurtmalar</div>
          </div>
          <div className="card animate-scale-in" style={{ padding: 12, textAlign: 'center', animationDelay: '.1s' }}>
            <Clock size={18} color="#e51e1e" style={{ margin: '0 auto 4px' }} />
            <div style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 16, fontWeight: 600 }}>{todaySales.length > 0 ? '25' : '0'}</div>
            <div style={{ color: '#6b6b6b', fontSize: 10 }}>Daqiqa ort.</div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-2 stagger" style={{ gap: 12 }}>
          <button onClick={() => navigate('/admin/branches')} className="card card-hover p-4 text-left" style={{ cursor: 'pointer' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'rgba(229,30,30,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Building2 size={18} color="#e51e1e" />
            </div>
            <p style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 18, fontWeight: 600 }}>{branches.length}</p>
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Filiallar</p>
          </button>
          <button onClick={() => navigate('/admin/employees')} className="card card-hover p-4 text-left" style={{ cursor: 'pointer' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'rgba(229,30,30,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Users size={18} color="#e51e1e" />
            </div>
            <p style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 18, fontWeight: 600 }}>{employees.length}</p>
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Xodimlar</p>
          </button>
          <button onClick={() => navigate('/admin/statistics')} className="card card-hover p-4 text-left" style={{ cursor: 'pointer' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'rgba(229,30,30,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <BarChart3 size={18} color="#e51e1e" />
            </div>
            <p style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 14, fontWeight: 500 }}>Statistika</p>
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Savdo va foyda</p>
          </button>
          <button onClick={() => navigate('/admin/orders')} className="card card-hover p-4 text-left" style={{ cursor: 'pointer' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'rgba(229,30,30,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <ClipboardList size={18} color="#e51e1e" />
            </div>
            <p style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 18, fontWeight: 600 }}>{orders.length}</p>
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Buyurtmalar</p>
          </button>
        </div>
      </div>
    </div>
  );
}
