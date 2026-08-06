import { useState } from 'react';
import { Plus, Search, Trash2, Edit, User, UserCog, UserCheck, BadgeCheck } from 'lucide-react';

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
  tableWrap: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' },
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

const STORAGE_KEY = 'bekfood_employees_v1';

function load() {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch { /* noop */ }
  return [
    { id: 1, name: 'Aziz Karimov', role: 'seller', phone: '+998 90 111 22 33', salary: 2500000, status: 'active', joined: '2026-01-15', shift: 'Kunduzgi', note: '' },
    { id: 2, name: 'Malika Yusupova', role: 'seller', phone: '+998 91 222 33 44', salary: 2500000, status: 'active', joined: '2026-02-01', shift: 'Kechki', note: '' },
    { id: 3, name: 'Jasur Toshmatov', role: 'courier', phone: '+998 93 333 44 55', salary: 2200000, status: 'active', joined: '2026-03-10', shift: 'To\'liq', note: '' },
    { id: 4, name: 'Dilnoza Rahimova', role: 'chef', phone: '+998 97 444 55 66', salary: 4000000, status: 'active', joined: '2025-11-20', shift: 'Kunduzgi', note: '' },
  ];
}

function save(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

const roleLabel = { admin: 'Admin', seller: 'Sotuvchi', courier: 'Kuryer', chef: 'Oshpaz' };
const roleIcon = { admin: UserCog, seller: User, courier: UserCheck, chef: BadgeCheck };
const roleColor = { admin: 'var(--primary)', seller: 'var(--success)', courier: 'var(--warning)', chef: 'var(--text-secondary)' };

const emptyForm = { name: '', role: 'seller', phone: '', salary: '', status: 'active', joined: new Date().toISOString().slice(0, 10), shift: 'Kunduzgi', note: '' };

export default function AdminEmployees() {
  const [items, setItems] = useState(load);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = items.filter((i) => !query || [i.name, i.phone, roleLabel[i.role] || i.role].join(' ').toLowerCase().includes(query.toLowerCase()));
  const active = items.filter((i) => i.status === 'active').length;
  const monthlySalary = items.filter((i) => i.status === 'active').reduce((s, i) => s + Number(i.salary || 0), 0);

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setModal(true); };
  const openEdit = (it) => { setEditingId(it.id); setForm({ name: it.name, role: it.role, phone: it.phone || '', salary: String(it.salary || ''), status: it.status, joined: it.joined, shift: it.shift || '', note: it.note || '' }); setModal(true); };

  const handleSave = () => {
    if (!form.name) return;
    const item = { id: editingId || Date.now(), ...form, salary: Number(form.salary || 0) };
    const next = editingId ? items.map((i) => (i.id === editingId ? item : i)) : [...items, item];
    setItems(next); save(next); setModal(false);
  };

  const handleDelete = () => { const next = items.filter((i) => i.id !== confirmDelete); setItems(next); save(next); setConfirmDelete(null); };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Xodimlar (Employees)</h1>
            <p style={s.subtitle}>Ishchilar, maoshlar va ro'yxat boshqaruvi</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={s.searchWrap}><Search size={16} style={s.searchIcon} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Qidirish..." style={s.searchInput} /></div>
            <button onClick={openAdd} style={s.btn}><Plus size={16} /> Yangi xodim</button>
          </div>
        </div>

        <div style={s.statsGrid}>
          <div style={s.statCard}><div style={s.statValue}>{items.length}</div><div style={s.statLabel}>Jami</div></div>
          <div style={s.statCard}><div style={{ ...s.statValue, color: 'var(--success)' }}>{active}</div><div style={s.statLabel}>Ishlayapti</div></div>
          <div style={s.statCard}><div style={s.statValue}>{monthlySalary.toLocaleString()} so'm</div><div style={s.statLabel}>Oylik maosh (jami)</div></div>
        </div>

        <div style={s.tableWrap}>
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Xodim</th><th style={s.th}>Lavozim</th><th style={s.th}>Telefon</th><th style={s.th}>Smena</th><th style={s.th}>Maosh</th><th style={s.th}>Holat</th><th style={s.th}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((it) => {
                  const Icon = roleIcon[it.role] || User;
                  return (
                    <tr key={it.id}>
                      <td style={{ ...s.td, fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 10, background: (roleColor[it.role] || 'var(--text-muted)') + '14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={16} color={roleColor[it.role] || 'var(--text-muted)'} />
                          </div>
                          {it.name}
                        </div>
                      </td>
                      <td style={s.td}>{roleLabel[it.role] || it.role}</td>
                      <td style={s.td}>{it.phone}</td>
                      <td style={s.td}>{it.shift || '—'}</td>
                      <td style={s.td}>{Number(it.salary).toLocaleString()}</td>
                      <td style={s.td}><span style={{ background: (it.status === 'active' ? 'var(--success)' : 'var(--text-muted)') + '14', color: it.status === 'active' ? 'var(--success)' : 'var(--text-muted)', padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>{it.status === 'active' ? 'Ishlayapti' : 'Damda'}</span></td>
                      <td style={s.td}>
                        <button onClick={() => openEdit(it)} style={s.iconBtn}><Edit size={14} /></button>
                        <button onClick={() => setConfirmDelete(it.id)} style={{ ...s.iconBtn, color: 'var(--danger)' }}><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>Xodim topilmadi</div>}
        </div>
      </div>

      {modal && (
        <div style={s.overlay} onClick={() => setModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editingId ? 'Tahrirlash' : 'Yangi xodim'}</h2>
              <button onClick={() => setModal(false)} style={s.closeBtn}><Plus size={16} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            <div style={s.field}><label style={s.label}>F.I.Sh *</label><input style={s.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ism familiya" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={s.field}>
                <label style={s.label}>Lavozim</label>
                <select style={s.input} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="seller">Sotuvchi</option>
                  <option value="courier">Kuryer</option>
                  <option value="chef">Oshpaz</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={s.field}><label style={s.label}>Telefon</label><input style={s.input} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+998 90 000 00 00" /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={s.field}><label style={s.label}>Maosh</label><input style={s.input} type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="2500000" /></div>
              <div style={s.field}><label style={s.label}>Smena</label><input style={s.input} value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })} placeholder="Kunduzgi" /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={s.field}><label style={s.label}>Ishga qabul</label><input style={s.input} type="date" value={form.joined} onChange={(e) => setForm({ ...form, joined: e.target.value })} /></div>
              <div style={s.field}>
                <label style={s.label}>Holati</label>
                <select style={s.input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Ishlayapti</option>
                  <option value="inactive">Damda</option>
                </select>
              </div>
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