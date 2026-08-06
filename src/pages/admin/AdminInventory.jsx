import { useState } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const s = {
  page: { padding: '24px 16px 32px', background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' },
  title: { fontSize: '26px', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' },
  btn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', background: 'var(--primary)', color: '#fff', fontFamily: 'inherit', minHeight: '44px' },
  searchWrap: { position: 'relative', flex: 1, maxWidth: '300px', minWidth: '200px' },
  searchInput: { width: '100%', padding: '10px 14px 10px 40px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--text)', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '20px' },
  statCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px 18px' },
  statValue: { fontSize: '20px', fontWeight: '700', color: 'var(--text)', lineHeight: 1.1 },
  statLabel: { fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' },
  tableWrap: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '720px' },
  th: { fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--surface-active)', whiteSpace: 'nowrap' },
  td: { padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--text)', whiteSpace: 'nowrap' },
  badge: (color) => ({ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', background: color + '14', color, border: `1px solid ${color}30` }),
  iconBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, marginRight: '6px' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' },
  modalTitle: { fontSize: '20px', fontWeight: '800', color: 'var(--text)', margin: 0 },
  closeBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 },
  field: { marginBottom: '16px' },
  label: { fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' },
  input: { width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  row: { display: 'flex', gap: '14px' },
  rowField: { flex: 1 },
};

const STORAGE_KEY = 'bekfood_inventory_v1';

const seed = [
  { id: 1, name: 'Burger bulochka (Buns)', quantity: 200, unit: 'dona', price: 120000, supplier: 'Bek Non', date: '2026-08-01', expire: '2026-08-10', minQty: 50 },
  { id: 2, name: 'Cola 0.5L', quantity: 120, unit: 'dona', price: 780000, supplier: 'Coca Cola Uzbekistan', date: '2026-08-02', expire: '2027-08-01', minQty: 60 },
  { id: 3, name: "Go'sht (mol)", quantity: 40, unit: 'kg', price: 5200000, supplier: 'Chorsu bozor', date: '2026-08-01', expire: '2026-08-06', minQty: 15 },
  { id: 4, name: 'Ketchup 1L', quantity: 45, unit: 'dona', price: 540000, supplier: 'Calve', date: '2026-07-28', expire: '2027-07-28', minQty: 20 },
  { id: 5, name: 'Pishloq (cheese)', quantity: 12, unit: 'kg', price: 1200000, supplier: 'Uchqun', date: '2026-08-03', expire: '2026-08-17', minQty: 8 },
];

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* noop */ }
  return seed;
}

function save(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function AdminInventory() {
  const [items, setItems] = useState(load);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', quantity: '', unit: 'dona', price: '', supplier: '', date: '', expire: '', minQty: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = items.filter((i) => !query || i.name.toLowerCase().includes(query.toLowerCase()));

  const lowStock = items.filter((i) => i.quantity <= i.minQty);
  const totalValue = items.reduce((s, i) => s + Number(i.price || 0), 0);
  const expiredSoon = items.filter((i) => i.expire && new Date(i.expire) - Date.now() < 7 * 86400000);

  const openAdd = () => { setEditingId(null); setForm({ name: '', quantity: '', unit: 'dona', price: '', supplier: '', date: new Date().toISOString().slice(0, 10), expire: '', minQty: '' }); setModal(true); };
  const openEdit = (it) => { setEditingId(it.id); setForm({ name: it.name, quantity: String(it.quantity), unit: it.unit, price: String(it.price), supplier: it.supplier, date: it.date, expire: it.expire || '', minQty: String(it.minQty) }); setModal(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const item = {
      id: editingId || Date.now(),
      name: form.name.trim(),
      quantity: Number(form.quantity) || 0,
      unit: form.unit,
      price: Number(form.price) || 0,
      supplier: form.supplier || '—',
      date: form.date || new Date().toISOString().slice(0, 10),
      expire: form.expire || '',
      minQty: Number(form.minQty) || 0,
    };
    const next = editingId ? items.map((i) => (i.id === editingId ? item : i)) : [...items, item];
    setItems(next);
    save(next);
    setModal(false);
  };

  const handleDelete = () => {
    const next = items.filter((i) => i.id !== confirmDelete);
    setItems(next);
    save(next);
    setConfirmDelete(null);
  };

  return (
    <div style={s.page}>
      <style>{`@media(max-width:768px){.inv-header{flex-direction:column!important}.inv-stats{grid-template-columns:repeat(2,1fr)!important}.inv-modal-row{flex-direction:column!important}.inv-modal-row>div{min-width:100%!important}}`}</style>
      <div style={s.container}>
        <div className="inv-header" style={s.header}>
          <div>
            <h1 style={s.title}>Inventory</h1>
            <p style={s.subtitle}>Ombor zaxirasi — har kuni kelgan mahsulotlarni kiriting</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={s.searchWrap}>
              <Search size={16} style={s.searchIcon} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Qidirish..." style={s.searchInput} />
            </div>
            <button onClick={openAdd} style={s.btn}><Plus size={16} /> Yangi mahsulot</button>
          </div>
        </div>

        <div className="inv-stats" style={s.statsGrid}>
          <div style={s.statCard}><div style={s.statValue}>{items.length}</div><div style={s.statLabel}>Jami mahsulot</div></div>
          <div style={s.statCard}><div style={{ ...s.statValue, color: 'var(--danger)' }}>{lowStock.length}</div><div style={s.statLabel}>Kam zaxira</div></div>
          <div style={s.statCard}><div style={{ ...s.statValue, color: 'var(--warning)' }}>{expiredSoon.length}</div><div style={s.statLabel}>Muddati yaqin</div></div>
          <div style={s.statCard}><div style={s.statValue}>{(totalValue / 1000000).toFixed(1)}M</div><div style={s.statLabel}>Umumiy qiymat (so'm)</div></div>
        </div>

        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Mahsulot</th>
                <th style={s.th}>Miqdor</th>
                <th style={s.th}>Narxi</th>
                <th style={s.th}>Supplier</th>
                <th style={s.th}>Kelgan sana</th>
                <th style={s.th}>Expire date</th>
                <th style={s.th}>Qolgan</th>
                <th style={s.th}>Minimal</th>
                <th style={s.th}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((it) => {
                const low = it.quantity <= it.minQty;
                const expSoon = it.expire && new Date(it.expire) - Date.now() < 7 * 86400000;
                return (
                  <tr key={it.id}>
                    <td style={s.td}><strong>{it.name}</strong></td>
                    <td style={s.td}>{it.quantity} {it.unit}</td>
                    <td style={s.td}>{Number(it.price).toLocaleString()} so'm</td>
                    <td style={s.td}>{it.supplier}</td>
                    <td style={s.td}>{it.date}</td>
                    <td style={s.td}>{it.expire || '—'} {expSoon && <span style={s.badge('var(--warning)')}><AlertTriangle size={11} /> Tez</span>}</td>
                    <td style={s.td}><span style={low ? s.badge('var(--danger)') : s.badge('var(--success)')}>{low ? 'Kam' : 'Yetarli'}</span></td>
                    <td style={s.td}>{it.minQty} {it.unit}</td>
                    <td style={s.td}>
                      <button onClick={() => openEdit(it)} style={s.iconBtn}><Edit size={15} /></button>
                      <button onClick={() => setConfirmDelete(it.id)} style={{ ...s.iconBtn, color: 'var(--danger)' }}><Trash2 size={15} /></button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="9" style={{ ...s.td, textAlign: 'center', padding: '40px' }}>Hech narsa topilmadi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div style={s.overlay} onClick={() => setModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editingId ? 'Tahrirlash' : 'Yangi mahsulot'}</h2>
              <button onClick={() => setModal(false)} style={s.closeBtn}><Plus size={16} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            <div style={s.field}><label style={s.label}>Mahsulot nomi</label><input style={s.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Masalan: Burger Buns" /></div>
            <div className="inv-modal-row" style={s.row}>
              <div style={s.rowField}><label style={s.label}>Miqdori</label><input style={s.input} type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="200" /></div>
              <div style={s.rowField}><label style={s.label}>O'lchov</label>
                <select style={s.input} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                  <option value="dona">dona</option><option value="kg">kg</option><option value="L">L</option><option value="litr">litr</option>
                </select>
              </div>
            </div>
            <div className="inv-modal-row" style={s.row}>
              <div style={s.rowField}><label style={s.label}>Narxi (so'm)</label><input style={s.input} type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="120000" /></div>
              <div style={s.rowField}><label style={s.label}>Supplier</label><input style={s.input} value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} placeholder="Bek Non" /></div>
            </div>
            <div className="inv-modal-row" style={s.row}>
              <div style={s.rowField}><label style={s.label}>Kelgan sana</label><input style={s.input} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div style={s.rowField}><label style={s.label}>Expire date</label><input style={s.input} type="date" value={form.expire} onChange={(e) => setForm({ ...form, expire: e.target.value })} /></div>
            </div>
            <div style={s.field}><label style={s.label}>Minimal miqdor (ogohlantirish)</label><input style={s.input} type="number" value={form.minQty} onChange={(e) => setForm({ ...form, minQty: e.target.value })} placeholder="50" /></div>
            <button onClick={handleSave} style={{ ...s.btn, width: '100%', justifyContent: 'center' }}><CheckCircle2 size={16} /> Saqlash</button>
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
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 24px 0' }}>Bu amalni qaytarib bo'lmaydi</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ ...s.btn, background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border-strong)', flex: 1 }}>Bekor</button>
              <button onClick={handleDelete} style={{ ...s.btn, background: 'var(--danger)', flex: 1 }}>O'chirish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}