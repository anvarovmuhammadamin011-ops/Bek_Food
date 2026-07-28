import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Clock, Phone, Search, Store, Edit, Trash2, X, Check, Power } from 'lucide-react';
import useStore from '../../store/useStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function AdminBranches() {
  const { branches = [], addBranch } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editBranch, setEditBranch] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ name: '', address: '', phone: '', workingHours: '' });

  const filtered = useMemo(() => {
    if (!searchQuery) return branches;
    const q = searchQuery.toLowerCase();
    return branches.filter(b => b.name.toLowerCase().includes(q) || (b.address && b.address.toLowerCase().includes(q)));
  }, [branches, searchQuery]);

  const stats = useMemo(() => ({
    total: branches.length,
    open: branches.filter(b => b.isOpen !== false).length,
    closed: branches.filter(b => b.isOpen === false).length,
  }), [branches]);

  const openAdd = () => {
    setEditBranch(null);
    setForm({ name: '', address: '', phone: '', workingHours: '' });
    setShowForm(true);
  };

  const openEdit = (branch) => {
    setEditBranch(branch);
    setForm({ name: branch.name || '', address: branch.address || '', phone: branch.phone || '', workingHours: branch.workingHours || '' });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editBranch) {
      if (addBranch) addBranch({ ...editBranch, ...form });
    } else {
      addBranch({ ...form, coverImage: '', logo: '', cuisine: 'Fastfood', rating: 0, deliveryTime: 0, distance: '', minOrder: 0, isOpen: true, coordinates: {} });
    }
    setForm({ name: '', address: '', phone: '', workingHours: '' });
    setEditBranch(null);
    setShowForm(false);
  };

  const handleClose = () => {
    setForm({ name: '', address: '', phone: '', workingHours: '' });
    setEditBranch(null);
    setShowForm(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div variants={container} initial="hidden" animate="visible">
        <motion.div variants={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Filiallar</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>Barcha filiallarni boshqarish</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: 280 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input placeholder="Filial qidirish..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 40px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
              />
            </div>
            <Button variant="primary" size="md" leftIcon={<Plus size={16} />} onClick={openAdd}>Yangi filial</Button>
          </div>
        </motion.div>

        <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Jami filiallar', value: stats.total, icon: Store, accent: 'primary' },
            { label: 'Ochiq', value: stats.open, icon: Power, accent: 'success' },
            { label: 'Yopiq', value: stats.closed, icon: Clock, accent: 'warning' },
          ].map((s, i) => {
            const Icon = s.icon;
            const accentBg = s.accent === 'primary' ? 'var(--primary-light)' : s.accent === 'success' ? '#ECFDF5' : '#FEF9C3';
            const accentColor = s.accent === 'primary' ? 'var(--primary)' : s.accent === 'success' ? 'var(--success)' : 'var(--warning)';
            return (
              <Card key={i} padding="sm" hoverable>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: accentColor }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</p>
                    <p style={{ fontSize: 24, fontWeight: 700, margin: '2px 0 0', color: 'var(--text)' }}>{s.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </motion.div>

        {filtered.length === 0 ? (
          <motion.div variants={item} style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--surface-active)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-muted)' }}><Store size={28} /></div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 4px' }}>Filiallar topilmadi</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{searchQuery ? "Qidiruv bo'yicha natija yo'q" : "Yangi filial qo'shish uchun yuqoridagi tugmani bosing"}</p>
          </motion.div>
        ) : (
          <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16, marginBottom: 40 }}>
            {filtered.map((b) => (
              <Card key={b.id} padding="md" hoverable>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: b.isOpen !== false ? 'var(--primary-light)' : 'var(--surface-active)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: b.isOpen !== false ? 'var(--primary)' : 'var(--text-muted)' }}>
                      <Store size={20} />
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</h3>
                  </div>
                  <Badge variant={b.isOpen !== false ? 'success' : 'default'} size="xs" dot dotColor={b.isOpen !== false ? 'var(--success)' : 'var(--text-muted)'}>
                    {b.isOpen !== false ? 'Ochiq' : 'Yopiq'}
                  </Badge>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {b.address && <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}><MapPin size={14} /> {b.address}</div>}
                  {b.workingHours && <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}><Clock size={14} /> {b.workingHours}</div>}
                  {b.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}><Phone size={14} /> {b.phone}</div>}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <Button variant="secondary" size="sm" leftIcon={<Edit size={15} />} onClick={() => openEdit(b)}>Tahrirlash</Button>
                  <Button variant="secondary" size="sm" style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }} onClick={() => setDeleteConfirm(b.id)}><Trash2 size={15} /></Button>
                </div>
              </Card>
            ))}
          </motion.div>
        )}
      </motion.div>

      <Modal isOpen={showForm} onClose={handleClose} title={editBranch ? 'Filialni tahrirlash' : 'Yangi filial'} size="md">
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>Filial nomi *</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Filial nomi"
            style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 14px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>Manzil</label>
          <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="To'liq manzil"
            style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 14px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>Telefon</label>
          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+998 9X XXX XX XX"
            style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 14px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>Ish vaqti</label>
          <input value={form.workingHours} onChange={e => setForm({ ...form, workingHours: e.target.value })} placeholder="10:00 - 23:00"
            style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 14px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 18 }}>
          <Button variant="secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleClose}>Bekor qilish</Button>
          <Button variant="primary" style={{ flex: 1, justifyContent: 'center' }} leftIcon={<Check size={14} />} onClick={handleSave}>{editBranch ? 'Saqlash' : "Qo'shish"}</Button>
        </div>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} size="sm">
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: 'var(--danger)' }}><Trash2 size={24} /></div>
          <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>Filialni o'chirish</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.5 }}>Bu filialni o'chirishni xohlaysizmi? Amalga qaytarib bo'lmaydi.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setDeleteConfirm(null)}>Bekor qilish</Button>
            <Button variant="danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { if (addBranch) addBranch({ isOpen: 'deleted', id: deleteConfirm }); setDeleteConfirm(null); }}>O'chirish</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
