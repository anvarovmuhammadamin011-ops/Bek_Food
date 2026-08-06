import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Zap, Flame, Wifi, Building2, Landmark, Users, Megaphone, Bike, ShoppingBag, Wrench, MoreHorizontal } from 'lucide-react';

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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px' },
  iconBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, marginRight: '6px' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' },
  modalTitle: { fontSize: '20px', fontWeight: '800', color: 'var(--text)', margin: 0 },
  closeBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 },
  field: { marginBottom: '16px' },
  label: { fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' },
  input: { width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
};

const STORAGE_KEY = 'bekfood_expenses_v1';

const CATEGORIES = [
  { key: 'elektr', label: 'Elektr', icon: Zap, color: 'var(--warning)' },
  { key: 'gaz', label: 'Gaz', icon: Flame, color: 'var(--primary)' },
  { key: 'internet', label: 'Internet', icon: Wifi, color: 'var(--success)' },
  { key: 'ijara', label: 'Ijara', icon: Building2, color: 'var(--text-secondary)' },
  { key: 'soliq', label: 'Soliq', icon: Landmark, color: 'var(--danger)' },
  { key: 'ish_haqi', label: 'Ish haqi', icon: Users, color: 'var(--success)' },
  { key: 'reklama', label: 'Reklama', icon: Megaphone, color: 'var(--primary)' },
  { key: 'yetkazish', label: 'Yetkazib berish', icon: Bike, color: 'var(--warning)' },
  { key: 'xarid', label: 'Mahsulot xaridi', icon: ShoppingBag, color: 'var(--success)' },
  { key: 'ta_mirlash', label: "Ta'mirlash", icon: Wrench, color: 'var(--text-secondary)' },
  { key: 'boshqa', label: 'Boshqa', icon: MoreHorizontal, color: 'var(--text-muted)' },
];

function load() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch { /* noop */ }
  return [
    { id: 1, category: 'elektr', label: 'Elektr', amount: 480000, date: '2026-08-01', note: '' },
    { id: 2, category: 'ijara', label: 'Ijara', amount: 3500000, date: '2026-08-01', note: 'Avgust oyi' },
    { id: 3, category: 'ish_haqi', label: 'Ish haqi', amount: 8500000, date: '2026-08-05', note: '7 xodim' },
    { id: 4, category: 'reklama', label: 'Reklama', amount: 600000, date: '2026-08-03', note: 'Instagram' },
  ];
}

function save(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

export default function AdminExpenses() {
  const [items, setItems] = useState(load);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ category: 'elektr', amount: '', date: new Date().toISOString().slice(0, 10), note: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = items.filter((i) => {
    const cat = CATEGORIES.find((c) => c.key === i.category);
    return !query || (cat && cat.label.toLowerCase().includes(query.toLowerCase())) || (i.note || '').toLowerCase().includes(query.toLowerCase());
  });
  const total = items.reduce((s, i) => s + Number(i.amount || 0), 0);
  const monthTotal = items.filter((i) => i.date && i.date.startsWith(new Date().toISOString().slice(0, 7))).reduce((s, i) => s + Number(i.amount || 0), 0);

  const openAdd = () => { setEditingId(null); setForm({ category: 'elektr', amount: '', date: new Date().toISOString().slice(0, 10), note: '' }); setModal(true); };
  const openEdit = (it) => { setEditingId(it.id); setForm({ category: it.category, amount: String(it.amount), date: it.date, note: it.note || '' }); setModal(true); };

  const handleSave = () => {
    if (!form.amount) return;
    const item = { id: editingId || Date.now(), category: form.category, label: CATEGORIES.find((c) => c.key === form.category)?.label, amount: Number(form.amount), date: form.date, note: form.note };
    const next = editingId ? items.map((i) => (i.id === editingId ? item : i)) : [...items, item];
    setItems(next); save(next); setModal(false);
  };

  const handleDelete = () => { const next = items.filter((i) => i.id !== confirmDelete); setItems(next); save(next); setConfirmDelete(null); };

  return (
    <div style={s.page}>
      <style>{`@media(max-width:768px){.exp-header{flex-direction:column!important}}`}</style>
      <div style={s.container}>
        <div className="exp-header" style={s.header}>
          <div>
            <h1 style={s.title}>Xarajatlar (Expenses)</h1>
            <p style={s.subtitle}>Barcha xarajatlarni yozing — foydani aniq hisoblash uchun</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={s.searchWrap}><Search size={16} style={s.searchIcon} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Qidirish..." style={s.searchInput} /></div>
            <button onClick={openAdd} style={s.btn}><Plus size={16} /> Yangi xarajat</button>
          </div>
        </div>

        <div style={s.statsGrid}>
          <div style={s.statCard}><div style={s.statValue}>{items.length}</div><div style={s.statLabel}>Yozuvlar</div></div>
          <div style={s.statCard}><div style={{ ...s.statValue, color: 'var(--danger)' }}>{monthTotal.toLocaleString()} so'm</div><div style={s.statLabel}>Bu oy</div></div>
          <div style={s.statCard}><div style={s.statValue}>{(total / 1000000).toFixed(1)}M</div><div style={s.statLabel}>Jami (so'm)</div></div>
        </div>

        <div style={s.grid}>
          {filtered.map((it) => {
            const cat = CATEGORIES.find((c) => c.key === it.category) || CATEGORIES[CATEGORIES.length - 1];
            const Icon = cat.icon;
            return (
              <div key={it.id} style={s.card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: cat.color + '14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} color={cat.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{cat.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{it.date}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <button onClick={() => openEdit(it)} style={s.iconBtn}><Edit size={15} /></button>
                    <button onClick={() => setConfirmDelete(it.id)} style={{ ...s.iconBtn, color: 'var(--danger)' }}><Trash2 size={15} /></button>
                  </div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--danger)' }}>-{Number(it.amount).toLocaleString()} so'm</div>
                {it.note && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{it.note}</div>}
              </div>
            );
          })}
          {filtered.length === 0 && <div style={{ ...s.card, textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Xarajat topilmadi</div>}
        </div>
      </div>

      {modal && (
        <div style={s.overlay} onClick={() => setModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editingId ? 'Tahrirlash' : 'Yangi xarajat'}</h2>
              <button onClick={() => setModal(false)} style={s.closeBtn}><Plus size={16} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            <div style={s.field}>
              <label style={s.label}>Kategoriya</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button key={c.key} onClick={() => setForm({ ...form, category: c.key })} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 6px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
                      background: form.category === c.key ? c.color + '14' : 'var(--surface)', color: form.category === c.key ? c.color : 'var(--text-muted)',
                      border: `1.5px solid ${form.category === c.key ? c.color : 'var(--border)'}`, fontSize: 11, fontWeight: 600,
                    }}>
                      <Icon size={16} /> {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={s.field}><label style={s.label}>Summa (so'm)</label><input style={s.input} type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="480000" /></div>
            <div style={s.field}><label style={s.label}>Sana</label><input style={s.input} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div style={s.field}><label style={s.label}>Izoh</label><input style={s.input} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Masalan: Avgust oyi uchun" /></div>
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