import React, { useMemo, useState } from 'react';
import useStore from '../../store/useStore';
import { Search, Banknote, CreditCard, MapPin, FileText } from 'lucide-react';
import { printReceipt } from '../../utils/receipt';

const s = {
  page: { padding: '32px', background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: '760px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
  title: { fontSize: '28px', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' },
  searchWrap: { position: 'relative', width: '100%', maxWidth: 340 },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' },
  input: {
    width: '100%', padding: '10px 14px 10px 38px', borderRadius: 10, border: '1px solid var(--border)',
    background: 'var(--surface)', color: 'var(--text)', fontSize: 13, outline: 'none',
  },
  summaryRow: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
  summaryCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', flex: 1, minWidth: 160 },
  summaryLabel: { fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 },
  summaryValue: { fontSize: 18, fontWeight: 800, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' },
  row: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 },
  empty: { textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)', fontSize: 13 },
};

export default function CourierHistory() {
  const { user, orders, settings } = useStore();
  const [query, setQuery] = useState('');

  const courierId = user?.id;
  const delivered = useMemo(
    () => orders.filter((o) => o.courierId === courierId && o.status === 'delivered'),
    [orders, courierId]
  );

  const filtered = delivered.filter((o) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      String(o.id).includes(q) ||
      (o.customerName || '').toLowerCase().includes(q) ||
      (o.customerPhone || '').toLowerCase().includes(q)
    );
  });

  const totalEarnings = delivered.reduce((sum, o) => sum + (o.total || 0), 0);
  const todayStr = new Date().toDateString();
  const todayEarnings = delivered
    .filter((o) => new Date(o.deliveredAt).toDateString() === todayStr)
    .reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Yetkazish tarixi</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{delivered.length} ta buyurtma</p>
          </div>
          <div style={s.searchWrap}>
            <Search size={15} style={s.searchIcon} />
            <input
              style={s.input}
              placeholder="Buyurtma ID, mijoz yoki telefon..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div style={s.summaryRow}>
          <div style={s.summaryCard}>
            <p style={s.summaryLabel}>Bugungi daromad</p>
            <p style={s.summaryValue}>{todayEarnings.toLocaleString('uz-UZ')} so'm</p>
          </div>
          <div style={s.summaryCard}>
            <p style={s.summaryLabel}>Jami daromad</p>
            <p style={s.summaryValue}>{totalEarnings.toLocaleString('uz-UZ')} so'm</p>
          </div>
          <div style={s.summaryCard}>
            <p style={s.summaryLabel}>Yetkazilganlar</p>
            <p style={s.summaryValue}>{delivered.length} ta</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={s.empty}>
            {query ? 'Hech narsa topilmadi' : 'Hali yetkazilgan buyurtmalar yo\'q'}
          </div>
        ) : (
          filtered.map((o) => (
            <div key={o.id} style={s.row}>
              <div style={{ minWidth: 54 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: 0 }}>#{String(o.id).slice(-4)}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  {new Date(o.deliveredAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{o.customerName}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <MapPin size={11} /> {o.address || 'Olib ketish'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                  {(o.total || 0).toLocaleString('uz-UZ')} so'm
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                  {o.paymentMethod === 'card' ? <CreditCard size={11} /> : <Banknote size={11} />}
                  {o.paymentMethod === 'card' ? 'Karta' : 'Naqd'}
                </p>
              </div>
              <button
                onClick={() => printReceipt(o, settings)}
                title="Chek chop etish"
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
              >
                <FileText size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
