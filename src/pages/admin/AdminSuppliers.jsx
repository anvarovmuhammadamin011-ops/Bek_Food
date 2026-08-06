import { useState } from 'react';
import { Plus, Search, Phone, Mail, MapPin, Trash2, Edit, Truck, CheckCircle2, CircleDashed } from 'lucide-react';

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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' },
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

const STORAGE_KEY = 'bekfood_suppliers_v1';

function load() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch { /* noop */ }
  return [
    { id: 1, name: 'Mevalar MCHJ', phone: '+998 90 123 45 67', email: 'info@mevalar.uz', address: 'Toshkent, Dehqon bozori', category: 'Meva-sabzavot', status: 'active', note: '' },
    { id: 2, name: 'Global Meat', phone: '+998 91 234 56 78', email: 'sales@globalmeat.uz', address: 'Chorsu bozori', category: 'Go\'sht', status: 'active', note: '' },
    { id: 3, name: 'Milky Farm', phone: '+998 93 345 67 89', email: 'info@milky.uz', address: 'Chilonzor tumani', category: 'Sut mahsulotlari', status: 'inactive', note: '' },
    { id: 4, name: 'Barkamol', phone: '+998 97 456 78 90', email: 'orders@barkamol.uz', address: 'Samarqand yo\'li', category: 'Yorma, un', status: 'active', note: '' },
  ];
}

function save(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

const emptyForm = { name: '', phone: '', email: '', address: '', category: '', status: 'active', note: '' };

export default function AdminSuppliers() {
  const [items, setItems] = useState(load);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = items.filter((i) =>
    !query || [i.name, i.category, i.phone, i.address].join(' ').toLowerCase().includes(query.toLowerCase())
  );
  const active = items.filter((i) => i.status === 'active').length;

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setModal(true); };
  const openEdit = (it) => { setEditingId(it.id); setForm({ name: it.name, phone: it.phone || '', email: it.email || '', address: it.address || '', category: it.category || '', status: it.status, note: it.note || '' }); setModal(true); };

  const handleSave = () => {
    if (!form.name) return;
    const item = { id: editingId || Date.now(), ...form };
    const next = editingId ? items.map((i) => (i.id === editingId ? item : i)) : [...items, item];
    setItems(next); save(next); setModal(false);
  };

  const handleDelete = () => { const next = items.filter((i) => i.id !== confirmDelete); setItems(next); save(next); setConfirmDelete(null); };

  return (
    <div style={s.page}>
      <style>{`@media(max-width:768px){.sup-modal-grid{grid-template-columns:1fr!important}.sup-header{flex-direction:column!important;align-items:stretch!important}}`}</style>
      <div style={s.container}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Ta'minotchilar (Suppliers)</h1>
            <p style={s.subtitle}>Mahsulot yetkazib beruvchilar ro'yxati</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={s.searchWrap}><Search size={16} style={s.searchIcon} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Qidirish..." style={s.searchInput} /></div>
            <button onClick={openAdd} style={s.btn}><Plus size={16} /> Yangi yetkazib beruvchi</button>
          </div>
        </div>

        <div style={s.statsGrid}>
          <div style={s.statCard}><div style={s.statValue}>{items.length}</div><div style={s.statLabel}>Jami</div></div>
          <div style={s.statCard}><div style={{ ...s.statValue, color: 'var(--success)' }}>{active}</div><div style={s.statLabel}>Faol</div></div>
          <div style={s.statCard}><div style={s.statValue}>{items.length - active}</div><div style={s.statLabel}>No faol</div></div>
        </div>

        <div style={s.grid}>
          {filtered.map((it) => (
            <div key={it.id} style={s.card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Truck size={18} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{it.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{it.category}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {it.status === 'active' ? <CheckCircle2 size={16} color="var(--success)" /> : <CircleDashed size={16} color="var(--text-muted)" />}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}><Phone size={13} /> {it.phone}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}><Mail size={13} /> {it.email || '—'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}><MapPin size={13} /> {it.address || '—'}</div>
              </div>
              {it.note && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{it.note}</div>}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => openEdit(it)} style={s.iconBtn}><Edit size={15} /></button>
                <button onClick={() => setConfirmDelete(it.id)} style={{ ...s.iconBtn, color: 'var(--danger)' }}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ ...s.card, textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Topilmadi</div>}
        </div>
      </div>

      {modal && (
        <div style={s.overlay} onClick={() => setModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editingId ? 'Tahrirlash' : 'Yangi yetkazib beruvchi'}</h2>
              <button onClick={() => setModal(false)} style={s.closeBtn}><Plus size={16} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            <div style={s.field}><label style={s.label}>Nomi *</label><input style={s.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Kompaniya nomi" /></div>
            <div className="sup-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={s.field}><label style={s.label}>Kategoriya</label><input style={s.input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Masalan: Go'sht" /></div>
              <div style={s.field}><label style={s.label}>Telefon</label><input style={s.input} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+998 90 123 45 67" /></div>
            </div>
            <div style={s.field}><label style={s.label}>Email</label><input style={s.input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="info@firma.uz" /></div>
            <div style={s.field}><label style={s.label}>Manzil</label><input style={s.input} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Bozor / tuman" /></div>
            <div style={s.field}>
              <label style={s.label}>Holati</label>
              <select style={s.input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Faol</option>
                <option value="inactive">No faol</option>
              </select>
            </div>
            <div style={s.field}><label style={s.label}>Izoh</label><input style={s.input} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></div>
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