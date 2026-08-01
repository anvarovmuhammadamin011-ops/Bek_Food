import {
  ShoppingBag,
  DollarSign,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ReceiptText,
} from 'lucide-react';
import useStore from '../../store/useStore';

const s = {
  page: {
    minHeight: '100%',
    background: 'var(--bg)',
    padding: 24,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.3px',
  },
  subtitle: {
    fontSize: 14,
    color: 'var(--text-muted)',
    marginTop: 4,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginBottom: 28,
  },
  statCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '22px 20px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s, border-color 0.2s',
  },
  statIconWrap: (bg) => ({
    width: 44,
    height: 44,
    borderRadius: 12,
    background: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  }),
  statLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-muted)',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 700,
    color: 'var(--text)',
    lineHeight: 1.1,
    letterSpacing: '-0.5px',
  },
  trendWrap: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    padding: '3px 8px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
  },
  section: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  sectionHeader: {
    padding: '18px 22px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  orderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '13px 22px',
    borderBottom: '1px solid var(--border)',
    transition: 'background 0.15s',
  },
  orderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  orderIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderId: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text)',
  },
  orderDate: {
    fontSize: 12,
    color: 'var(--text-muted)',
    marginTop: 1,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--primary)',
  },
  empty: {
    padding: '32px 22px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: 13,
  },
  badge: {
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 8,
  },
};

export default function AdminStatistics() {
  const { orders, inventory } = useStore();

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const totalCost = inventory.reduce((s, i) => s + (i.quantity * (i.unitCost || 0)), 0);
  const profit = totalRevenue - totalCost;

  const profitPositive = profit >= 0;

  const stats = [
    {
      label: 'Jami buyurtmalar',
      value: totalOrders,
      icon: ShoppingBag,
      bg: 'var(--primary-light)',
      color: 'var(--primary)',
    },
    {
      label: 'Jami tushum',
      value: totalRevenue.toLocaleString() + ' so\'m',
      icon: DollarSign,
      bg: 'var(--primary-light)',
      color: 'var(--primary)',
    },
    {
      label: 'Chiqim (ombor)',
      value: totalCost.toLocaleString() + ' so\'m',
      icon: Package,
      bg: '#FEF2F2',
      color: 'var(--danger)',
    },
    {
      label: 'Foyda',
      value: profit.toLocaleString() + ' so\'m',
      icon: profitPositive ? TrendingUp : TrendingDown,
      bg: profitPositive ? '#F0FDF4' : '#FEF2F2',
      color: profitPositive ? 'var(--success)' : 'var(--danger)',
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Statistika</h1>
        <p style={s.subtitle}>Biznesingiz asosiy ko'rsatkichlari</p>
      </div>

      <div style={s.grid} className="admin-stats-grid">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={i}
              style={s.statCard}
              className="admin-stat-card"
            >
              <div style={s.statIconWrap(st.bg)}>
                <Icon size={20} color={st.color} />
              </div>
              <p style={s.statLabel}>{st.label}</p>
              <p style={s.statValue}>{st.value}</p>
              {i === 3 && (
                <div
                  style={{
                    ...s.trendWrap,
                    background: profitPositive ? '#F0FDF4' : '#FEF2F2',
                    color: profitPositive ? 'var(--success)' : 'var(--danger)',
                  }}
                >
                  {profitPositive ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {profitPositive ? 'Foyda' : 'Zarar'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={s.section} className="admin-section">
        <div style={s.sectionHeader}>
          <span style={s.sectionTitle}>
            <ReceiptText size={16} color="var(--text-muted)" />
            Oxirgi buyurtmalar
          </span>
          <span
            style={{
              ...s.badge,
              background: 'var(--primary-light)',
              color: 'var(--primary)',
            }}
          >
            {totalOrders} ta
          </span>
        </div>

        {recentOrders.length === 0 ? (
          <div style={s.empty}>Buyurtmalar yo'q</div>
        ) : (
          <div className="admin-orders-list">
            {recentOrders.map((o) => (
              <div
                key={o.id}
                style={s.orderRow}
                className="admin-order-row"
              >
                <div style={s.orderLeft}>
                  <div style={s.orderIcon}>
                    <ReceiptText size={16} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={s.orderId}>#{String(o.id).slice(-4)}</div>
                    <div style={s.orderDate}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={s.orderTotal}>
                    {o.total.toLocaleString()} so'm
                  </span>
                  <ArrowUpRight size={14} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .admin-stat-card:hover {
          border-color: var(--border-strong);
          box-shadow: var(--shadow-sm);
        }
        .admin-order-row:hover {
          background: var(--surface-hover);
        }
        .admin-orders-list > div:last-child {
          border-bottom: none;
        }
        @media (max-width: 900px) {
          .admin-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 520px) {
          .admin-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
