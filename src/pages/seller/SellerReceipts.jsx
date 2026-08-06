import React from 'react';
import useStore from '../../store/useStore';
import { printReceipt } from '../../utils/receipt';
import { Printer, ReceiptText, Search, Package } from 'lucide-react';

const s = {
  page: { padding: '32px', background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  title: { fontSize: '28px', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' },
  searchWrap: { position: 'relative', flex: 1, maxWidth: 300, minWidth: 200 },
  searchInput: { width: '100%', padding: '9px 14px 9px 36px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '14px 18px',
  },
  iconBox: { width: 42, height: 42, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rowInfo: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: '14px', fontWeight: '700', color: 'var(--text)', margin: 0 },
  rowSub: { fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' },
  amount: { fontSize: '14px', fontWeight: '700', color: 'var(--text)', flexShrink: 0, marginLeft: 'auto' },
  printBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '9px 16px', borderRadius: 10, border: 'none',
    background: 'var(--primary)', color: '#fff', cursor: 'pointer',
    fontSize: 12, fontWeight: 600, fontFamily: 'inherit', flexShrink: 0,
  },
  empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' },
};

export default function SellerReceipts() {
  const { orders, settings } = useStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const delivered = orders
    .filter((o) => o.status === 'delivered')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filtered = delivered.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      String(o.id).includes(q) ||
      (o.customerName || '').toLowerCase().includes(q) ||
      (o.customerPhone || '').replace(/\s+/g, '').includes(q.replace(/\s+/g, ''))
    );
  });

  return (
    <div className="sr-page" style={s.page}>
      <style>{`@media(max-width:480px){.sr-page{padding:16px!important}}`}</style>
      <div style={s.container}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Cheklar tarixi</h1>
            <p style={s.subtitle}>Yetkazilgan buyurtmalar ({filtered.length} ta)</p>
          </div>
          <div style={s.searchWrap}>
            <Search size={14} style={s.searchIcon} />
            <input
              style={s.searchInput}
              placeholder="ID, telefon yoki mijoz..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={s.empty}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--surface-active)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Package size={28} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>Cheklar yo'q</p>
            <p style={{ fontSize: 13, margin: 0 }}>Yetkazilgan buyurtmalar shu yerda ko'rinadi</p>
          </div>
        ) : (
          <div style={s.list}>
            {filtered.map((order) => (
              <div key={order.id} style={s.row}>
                <div style={s.iconBox}>
                  <ReceiptText size={19} style={{ color: 'var(--primary)' }} />
                </div>
                <div style={s.rowInfo}>
                  <p style={s.rowTitle}>#{String(order.id).slice(-4)} · {order.customerName}</p>
                  <p style={s.rowSub}>
                    {new Date(order.createdAt).toLocaleString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {order.customerPhone}
                  </p>
                </div>
                <span style={s.amount}>{(order.total || 0).toLocaleString('uz-UZ')} so'm</span>
                <button style={s.printBtn} onClick={() => printReceipt(order, settings)}>
                  <Printer size={14} /> Chek
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
