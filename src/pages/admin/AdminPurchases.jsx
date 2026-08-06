import { useState } from 'react';
import { Plus, Search, Trash2, PackagePlus, Download, Truck } from 'lucide-react';

const s = {
  page: { padding: '24px 16px 32px', background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' },
  title: { fontSize: '26px', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' },
  btn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', background: 'var(--primary)', color: '#fff', fontFamily: 'inherit', minHeight: '44px' },
  btnGhost: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', cursor: 'pointer', fontSize: '14px', fontWeight: '600', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'inherit', minHeight: '44px' },
  searchWrap: { position: 'relative', flex: 1, maxWidth: '300px', minWidth: '200px' },
  searchInput: { width: '100%', padding: '10px 14px 10px 40px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--text)', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '20px' },
  statCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px 18px' },
  statValue: { fontSize: '20px', fontWeight: '700', color: 'var(--text)', lineHeight: 1.1 },
  statLabel: { fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' },
  tableWrap: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { textAlign: 'left', padding: '12px 14px', color: 'var(--text-muted)', fontWeight: '600', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' },
  td: { padding: '12px 14px', color: 'var(--text)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' },
  iconBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, marginRight: '6px' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' },
  modalTitle: { fontSize: '20px', fontWeight: '800', color: 'var(--text)', margin: 0 },
  closeBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 },
  field: { marginBottom: '16px' },
  label: { fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' },
  input: { width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
};

const STORAGE_KEY = 'bekfood_purchases_v1';
const INVENTORY_KEY = 'bekfood_inventory_v1';

function loadPurchases() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch { /* noop */ }
  return [
    { id: 1, product: 'Go\'sht (mol)', supplier: 'Global Meat', qty: 50, unit: 'kg', cost: 165000, total: 8250000, date: '2026-08-04', status: 'qabul_qilindi' },
    { id: 2, product: 'Pomidor', supplier: 'Mevalar MCHJ', qty: 30, unit: 'kg', cost: 15000, total: 450000, date: '2026-08-05', status: 'yolda' },
    { id: 3, product: 'Un (1-nav)', supplier: 'Barkamol', qty: 200, unit: 'kg', cost: 8500, total: 1700000, date: '2026-08-03', status: 'qabul_qilindi' },
    { id: 4, product: 'Sut', supplier: 'Milky Farm', qty: 20, unit: 'l', cost: 12000, total: 240000, date: '2026-08-05', status: 'buyurtma' },
  ];
}

function save(key, items) { localStorage.setItem(key, JSON.stringify(items)); }

const emptyForm = { product: '', supplier: '', qty: '', unit: 'kg', cost: '', date: new Date().toISOString().slice(0, 10), status: 'buyurtma' };

export default function AdminPurchases() {
  const [items, setItems] = useState(loadPurchases);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = items.filter((i) =>
    !query || [i.product, i.supplier].join(' ').toLowerCase().includes(query.toLowerCase())
  );
  const totalCost = items.reduce((s, i) => s + Number(i.total || 0), 0);
  const pending = items.filter((i) => i.status !== 'qabul_qilindi').length;

  const statusLabel = { buyurtma: 'Buyurtma', yolda: "Yo'lda", qabul_qilindi: 'Qabul qilindi' };
  const statusColor = { buyurtma: 'var(--warning)', yolda: 'var(--primary)', qabul_qilindi: 'var(--success)' };

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setModal(true); };
  const openEdit = (it) => { setEditingId(it.id); setForm({ product: it.product, supplier: it.supplier || '', qty: String(it.qty), unit: it.unit || 'kg', cost: String(it.cost), date: it.date, status: it.status }); setModal(true); };

  const handleSave = () => {
    if (!form.product || !form.qty) return;
    const total = Number(form.qty) * Number(form.cost || 0);
    const item = { id: editingId || Date.now(), ...form, qty: Number(form.qty), cost: Number(form.cost || 0), total };
    const next = editingId ? items.map((i) => (i.id === editingId ? item : i)) : [...items, item];
    setItems(next); save(STORAGE_KEY, next); setModal(false);
  };

  const handleReceive = (id) => {
    const it = items.find((i) => i.id === id);
    if (!it || it.status === 'qabul_qilindi') return;
    const next = items.map((i) => (i.id === id ? { ...i, status: 'qabul_qilindi' } : i));
    setItems(next); save(STORAGE_KEY, next);
    try {
      const inv = JSON.parse(localStorage.getItem(INVENTORY_KEY) || '[]');
      const match = inv.find((x) => x.name.toLowerCase() === it.product.toLowerCase());
      if (match) { match.qty = Number(match.qty || 0) + Number(it.qty); save(INVENTORY_KEY, inv); }
    } catch { /* noop */ }
  };

  const handleDelete = () => { const next = items.filter((i) => i.id !== confirmDelete); setItems(next); save(STORAGE_KEY, next); setConfirmDelete(null); };

  const exportCsv = () => {
    const head = 'Sana,Mahsulot,Taminotchi,Soni,O\'lchov,Narx (so\'m),Jami (so\'m),Holat';
    const rows = items.map((i) => [i.date, i.product, i.supplier, i.qty, i.unit, i.cost, i.total, statusLabel[i.status]].join(','));
    const blob = new Blob([head + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'xaridlar.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={s.page}>
      <style>{`@media(max-width:768px){.pur-modal-grid{grid-template-columns:1fr!important}.pur-header{flex-direction:column!important;align-items:stretch!important}}`}</style>
      <div style={s.container}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Xaridlar (Purchases)</h1>
            <p style={s.subtitle}>Yetkazib beruvchilardan mahsulot xaridlari</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={s.searchWrap}><Search size={16} style={s.searchIcon} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Qidirish..." style={s.searchInput} /></div>
            <button onClick={exportCsv} style={s.btnGhost}><Download size={15} /> CSV</button>
            <button onClick={openAdd} style={s.btn}><PackagePlus size={16} /> Yangi xarid</button>
          </div>
        </div>

        <div style={s.statsGrid}>
          <div style={s.statCard}><div style={s.statValue}>{items.length}</div><div style={s.statLabel}>Xaridlar</div></div>
          <div style={s.statCard}><div style={s.statValue}>{pending}</div><div style={s.statLabel}>Kutilmoqda</div></div>
          <div style={s.statCard}><div style={{ ...s.statValue, color: 'var(--danger)' }}>{totalCost.toLocaleString()} so'm</div><div style={s.statLabel}>Jami xarajat</div></div>
        </div>

        <div style={s.tableWrap}>
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Sana</th><th style={s.th}>Mahsulot</th><th style={s.th}>Ta'minotchi</th><th style={s.th}>Soni</th><th style={s.th}>Narx</th><th style={s.th}>Jami</th><th style={s.th}>Holat</th><th style={s.th}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((it) => (
                  <tr key={it.id}>
                    <td style={s.td}>{it.date}</td>
                    <td style={{ ...s.td, fontWeight: 600 }}>{it.product}</td>
                    <td style={s.td}>{it.supplier || '—'}</td>
                    <td style={s.td}>{it.qty} {it.unit}</td>
                    <td style={s.td}>{Number(it.cost).toLocaleString()}</td>
                    <td style={{ ...s.td, fontWeight: 600, color: 'var(--danger)' }}>{Number(it.total).toLocaleString()}</td>
                    <td style={s.td}><span style={{ background: (statusColor[it.status] || 'var(--text-muted)') + '14', color: statusColor[it.status] || 'var(--text-muted)', padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>{statusLabel[it.status]}</span></td>
                    <td style={s.td}>
                      {it.status !== 'qabul_qilindi' && (
                        <button onClick={() => handleReceive(it.id)} title="Qabul qilish" style={{ ...s.iconBtn, color: 'var(--success)' }}><Truck size={14} /></button>
                      )}
                      <button onClick={() => openEdit(it)} style={s.iconBtn}>✏️</button>
                      <button onClick={() => setConfirmDelete(it.id)} style={{ ...s.iconBtn, color: 'var(--danger)' }}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>Xarid topilmadi</div>}
        </div>
      </div>

      {modal && (
        <div style={s.overlay} onClick={() => setModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editingId ? 'Tahrirlash' : 'Yangi xarid'}</h2>
              <button onClick={() => setModal(false)} style={s.closeBtn}><Plus size={16} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            <div style={s.field}><label style={s.label}>Mahsulot *</label><input style={s.input} value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} placeholder="Masalan: Go'sht (mol)" /></div>
            <div style={s.field}><label style={s.label}>Ta'minotchi</label><input style={s.input} value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} placeholder="Kompaniya nomi" /></div>
            <div className="pur-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div style={s.field}><label style={s.label}>Soni *</label><input style={s.input} type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} /></div>
              <div style={s.field}><label style={s.label}>O'lchov</label><input style={s.input} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></div>
              <div style={s.field}><label style={s.label}>Narx</label><input style={s.input} type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} /></div>
            </div>
            <div style={s.field}><label style={s.label}>Sana</label><input style={s.input} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div style={s.field}>
              <label style={s.label}>Holat</label>
              <select style={s.input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="buyurtma">Buyurtma</option>
                <option value="yolda">Yo'lda</option>
                <option value="qabul_qilindi">Qabul qilindi</option>
              </select>
            </div>
            <button onClick={handleSave} style={{ ...s.btn, width: '100%', justifyContent: 'center' }}>Saqlash</button>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={s.overlay} onClick={() => setConfirmDelete(null)}>
          <div style={{ ...s.modal, maxWidth: '400px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={22} color="var(--danger)" />
            </div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px 0' }}>O'chirishni tasdiqlaysizmi?</h2>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ ...s.btn, background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border-strong)', flex: 1 }}>Bekor</button>
              <button onClick={handleDelete} style={{ ...s.btn, background: 'var(--danger)', flex: 1 }}>O'chirish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}