import { useEffect } from 'react';
import useAdminData from '../../hooks/useAdminData';
import { useAdminContext } from '../../components/admin/AdminContext';
import KpiCard from '../../components/admin/KpiCard';
import ProgressRing from '../../components/admin/charts/ProgressRing';
import BarChart from '../../components/admin/charts/BarChart';
import LineChart from '../../components/admin/charts/LineChart';
import PieChart from '../../components/admin/charts/PieChart';
import AdminTable from '../../components/admin/AdminTable';
import ExportButton from '../../components/admin/ExportButton';
import { formatPrice, number, percent } from '../../lib/format';
import { statusConfig, STATUS_COLOR } from '../../lib/statuses';
import { TrendingUp, Clock, CheckCircle2, ShoppingBasket } from 'lucide-react';

const STATUS_ORDER = ['pending', 'confirmed', 'preparing', 'ready', 'pickedUp', 'onTheWay', 'assigned', 'delivered', 'cancelled'];

function StatusCard({ status, count }) {
  const cfg = statusConfig(status);
  const color = STATUS_COLOR[status] || '#9CA3AF';
  return (
    <div className="card" style={{ padding: 14, borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 4 }}>{status}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{count}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cfg.label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const { days } = useAdminContext();
  const { kpi, revenue, trend, orders, statusCounts, peakHours, payments, delivery, products, inventory, refetch } = useAdminData();

  useEffect(() => {
    refetch({ days });
  }, [days, refetch]);

  const kpiLoading = !kpi;
  const summary = kpi || {};
  const activeOrders = statusCounts || {};

  const statusCards = STATUS_ORDER.map((s) => ({ status: s, count: activeOrders[s] || 0 }));

  const revenueSeries = (revenue || []).map((d) => ({ label: d.date, value: d.revenue }));
  const orderTrendSeries = (trend || []).map((d) => ({ label: d.date, value: d.count }));
  const topProducts = (products || []).slice(0, 6);
  const recentOrders = (orders || []).slice(0, 8);
  const lowStock = (inventory || []).filter((i) => i.status === 'low' || i.status === 'critical');
  const completedRate = summary.totalOrders ? percent(summary.completedToday || 0, summary.totalOrders) : 0;

  return (
    <div className="admin-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI ROW */}
      <section>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          <KpiCard title="Bugun daromad" value={formatPrice(summary.todayRevenue)} trend={summary.revenueChangePct} icon={TrendingUp} loading={kpiLoading} />
          <KpiCard title="Bugun buyurtma" value={summary.todayOrders} subtitle={`${summary.completedToday} yetkazildi`} icon={ShoppingBasket} loading={kpiLoading} color="var(--success)" />
          <KpiCard title="Faol buyurtma" value={summary.activeOrders} subtitle="Jarayonda" icon={Clock} loading={kpiLoading} color="var(--warning)" />
          <KpiCard title="Bajarilgan" value={summary.completedToday} subtitle="Bugun" icon={CheckCircle2} loading={kpiLoading} color="var(--primary)" />
          <KpiCard title="O'rtacha cheque" value={formatPrice(summary.avgOrderValue)} subtitle={summary.completedToday ? `${summary.completedToday} buyurtma` : '—'} icon={TrendingUp} loading={kpiLoading} />
          <KpiCard title="Bekor qilingan" value={summary.cancelledToday} loading={kpiLoading} color="var(--danger)" />
        </div>
      </section>

      {/* OVERALL + RING */}
      <section>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, alignItems: 'center' }}>
          <KpiCard title="Jami daromad" value={formatPrice(summary.totalRevenue)} subtitle="Barcha yetkazilgan" loading={kpiLoading} color="var(--success)" />
          <KpiCard title="Jami buyurtma" value={summary.totalOrders} subtitle="Barchasi" loading={kpiLoading} />
          <KpiCard title="Mijozlar" value={summary.totalCustomers} loading={kpiLoading} color="var(--primary)" />
          <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
            <ProgressRing value={completedRate} label={`${completedRate}%`} sublabel="Bugungi bajarilish" />
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Hozirgi portfgol bazasiga qarab bugungi yetkazishlar foizi</div>
          </div>
        </div>
      </section>

      {/* CHARTS: revenue + trend */}
      <section>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(1fr)', gap: 16 }}>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card" style={{ padding: 18 }}>
              <div className="flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Daromad ({days} kun)</h3>
                <ExportButton data={(revenue || []).map((d) => ({ sana: d.date, daromad: d.revenue, buyurtmalar: d.orders }))} filename="revenue" />
              </div>
              <LineChart data={revenueSeries} height={150} color="var(--primary)" />
            </div>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Buyurtma soni ({days} kun)</h3>
              </div>
              <BarChart data={orderTrendSeries} height={150} color="var(--primary)" />
            </div>
          </div>
        </div>
      </section>

      {/* STATUS + PEAK */}
      <section>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Buyurtma holati</h3>
            <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px,1fr))', gap: 10 }}>
              {statusCards.map((c) => (
                <StatusCard key={c.status} status={c.status} count={c.count} />
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>To'plash markazi (soat)</h3>
            <BarChart data={(peakHours || []).map((d) => ({ label: d.hour, value: d.count }))} height={140} color="var(--success)" labels />
          </div>
        </div>
      </section>

      {/* BOTTOM ROW: products + payments + delivery */}
      <section>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Eng ko'p sotilgan</h3>
              <ExportButton data={(topProducts || []).map((p) => ({ nom: p.name, soni: p.sold, daromad: p.revenue }))} filename="top-products" />
            </div>
            <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {(topProducts || []).length === 0 ? <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>Mahsulot yo'q</div> :
                (topProducts || []).map((p) => (
                  <div key={p.id} className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={p.image || '/food/placeholder.png'} alt={p.name} onError={(e) => { e.target.style.display = 'none' }} style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{p.sold} dona</div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>{formatPrice(p.revenue)}</div>
                  </div>
                ))}
            </div>
          </div>
          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>To'lov uslubi</h3>
            <PieChart data={(payments || []).map((p, i) => ({ label: p.name, value: p.count, color: `var(--colors-item-${i})` }))} size={150} unit="buyurtma" />
          </div>
          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Yetkazish / Olish</h3>
            <PieChart data={(delivery || []).map((d, i) => ({ label: d.name, value: d.count, color: `var(--colors-item-${i})` }))} size={150} unit="buyurtma" />
          </div>
        </div>
      </section>

      {/* INVENTORY ALERTS + REALTIME ACTIVITY */}
      <section>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Ombor ogohlantirishlari</h3>
              <span className="badge badge-warning" style={{ fontSize: 11 }}>{lowStock.length} ta</span>
            </div>
            {lowStock.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>Barcha mahsulotlar yetarli</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {lowStock.slice(0, 6).map((i) => (
                  <div key={i.id} className="flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--danger-light)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{i.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{number(i.quantity)} {i.unit} (min {number(i.minQuantity)})</div>
                    </div>
                    <span className="badge badge-danger" style={{ fontSize: 11 }}>{i.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Jonli faollik</h3>
            <AdminTable
              columns={[
                { key: 'id', label: '#' },
                { key: 'customerName', label: 'Mijoz' },
                { key: 'status', label: 'Holat', render: (v) => <span className="badge" style={{ background: `${STATUS_COLOR[v] || '#CBD5E1'}20`, color: STATUS_COLOR[v] || '#6B7280', fontSize: 10 }}>{statusConfig(v).label}</span> },
                { key: 'total', label: 'Summa', render: (v) => formatPrice(v) },
              ]}
              rows={recentOrders}
              hover={false}
            />
          </div>
        </div>
      </section>

      {/* BUSINESS INSIGHTS */}
      <section>
        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Biznes xulosalari</h3>
          <ul className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <li>Bugun {summary.completedToday} buyurtma yetkazilga, o'rtacha chekka {formatPrice(summary.avgOrderValue)}.</li>
            <li>Faol buyurtma: {summary.activeOrders} ta. Eng yaxshi sotilgan to'plash soatlari — ko'rib chiqing "To'plash markazi" jadvalni.</li>
            <li>Kam qolgan ombor mahsuloti {lowStock.length} ta — ustidan e'tibor bering.</li>
            <li>{(payments || []).filter((p) => p.name !== 'cash').reduce((a, p) => a + p.count, 0) || 0} buyurtma non-naqt so'nggi 30 kun ichida amalga oshirilgan.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
