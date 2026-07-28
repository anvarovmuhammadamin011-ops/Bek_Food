import { motion } from 'framer-motion';
import {
  ShoppingBag, DollarSign, Package, TrendingUp, TrendingDown, ArrowUpRight, ReceiptText,
} from 'lucide-react';
import useStore from '../../store/useStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function AdminStatistics() {
  const { orders, inventory } = useStore();

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalCost = inventory.reduce((s, i) => s + i.cost, 0);
  const profit = totalRevenue - totalCost;
  const profitPositive = profit >= 0;

  const stats = [
    { label: 'Jami buyurtmalar', value: totalOrders, icon: ShoppingBag, bg: 'var(--primary-light)', color: 'var(--primary)' },
    { label: 'Jami tushum', value: totalRevenue.toLocaleString() + " so'm", icon: DollarSign, bg: 'var(--primary-light)', color: 'var(--primary)' },
    { label: 'Chiqim (ombor)', value: totalCost.toLocaleString() + " so'm", icon: Package, bg: '#FEF2F2', color: 'var(--danger)' },
    { label: 'Foyda', value: profit.toLocaleString() + " so'm", icon: profitPositive ? TrendingUp : TrendingDown, bg: profitPositive ? '#F0FDF4' : '#FEF2F2', color: profitPositive ? 'var(--success)' : 'var(--danger)' },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div variants={container} initial="hidden" animate="visible">
        <motion.div variants={item} style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px', margin: 0 }}>Statistika</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Biznesingiz asosiy ko'rsatkichlari</p>
        </motion.div>

        <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {stats.map((st, i) => {
            const Icon = st.icon;
            return (
              <Card key={i} padding="lg" hoverable>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={20} color={st.color} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>{st.label}</p>
                <p style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', lineHeight: '1.1', letterSpacing: '-0.5px', margin: 0 }}>{st.value}</p>
                {i === 3 && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, padding: '3px 8px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: profitPositive ? '#F0FDF4' : '#FEF2F2', color: profitPositive ? 'var(--success)' : 'var(--danger)' }}>
                    {profitPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {profitPositive ? 'Foyda' : 'Zarar'}
                  </div>
                )}
              </Card>
            );
          })}
        </motion.div>

        <motion.div variants={item}>
          <Card padding="lg" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ReceiptText size={16} color="var(--text-muted)" />
                Oxirgi buyurtmalar
              </div>
              <Badge variant="primary" size="xs">{totalOrders} ta</Badge>
            </div>
            <div style={{ marginTop: 0 }}>
              {recentOrders.length === 0 ? (
                <div style={{ padding: '32px 22px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Buyurtmalar yo'q</div>
              ) : (
                recentOrders.map((o) => (
                  <div key={o.id}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 22px', borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ReceiptText size={16} color="var(--primary)" />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>#{String(o.id).slice(-4)}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>{o.total.toLocaleString()} so'm</span>
                      <ArrowUpRight size={14} color="var(--text-muted)" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
