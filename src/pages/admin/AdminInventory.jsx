import { useState } from 'react';
import useStore from '../../store/useStore';
import { motion } from 'framer-motion';
import {
  Plus, Edit, AlertTriangle, Package, Truck, Calendar,
  ArrowUp, ArrowDown, Search, X, Minus,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

const categories = ['Hammasi', "Go'sht", 'Non', 'Sous', 'Sabzavot', 'Ichimlik'];
const units = ['kg', 'dona', 'litr', 'pachka', 'quti'];

const defaultInventory = [
  { id: 1, name: "Mol go'shti", category: "Go'sht", quantity: 25, unit: 'kg', minQuantity: 10, supplier: "Toshkent Go'sht", expiryDate: '2026-08-15' },
  { id: 2, name: "Qo'y go'shti", category: "Go'sht", quantity: 3, unit: 'kg', minQuantity: 8, supplier: 'Samarqand Fermer', expiryDate: '2026-08-10' },
  { id: 3, name: 'Non', category: 'Non', quantity: 50, unit: 'dona', minQuantity: 20, supplier: 'Nonvoy Usti', expiryDate: '2026-07-30' },
  { id: 4, name: 'Lavash', category: 'Non', quantity: 15, unit: 'dona', minQuantity: 10, supplier: 'Nonvoy Usti', expiryDate: '2026-07-29' },
  { id: 5, name: 'Ketchup', category: 'Sous', quantity: 12, unit: 'litr', minQuantity: 5, supplier: 'Oziq-ovqat', expiryDate: '2026-12-01' },
  { id: 6, name: 'Mayonez', category: 'Sous', quantity: 0, unit: 'litr', minQuantity: 5, supplier: 'Oziq-ovqat', expiryDate: '2026-11-15' },
  { id: 7, name: 'Pomidor', category: 'Sabzavot', quantity: 18, unit: 'kg', minQuantity: 8, supplier: "Bog'dod Bozori", expiryDate: '2026-08-05' },
  { id: 8, name: 'Cola', category: 'Ichimlik', quantity: 30, unit: 'dona', minQuantity: 15, supplier: 'Imzo', expiryDate: '2027-01-20' },
];

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

function getStatus(quantity, minQuantity) {
  if (quantity === 0) return { label: 'Tugadi', color: 'var(--danger)' };
  if (quantity <= minQuantity) return { label: 'Kam qoldi', color: 'var(--warning)' };
  return { label: 'Yetarli', color: 'var(--success)' };
}

function getCategoryBadgeStyle(cat) {
  const map = {
    "Go'sht": { variant: 'danger' },
    'Non': { variant: 'warning' },
    'Sous': { variant: 'info' },
    'Sabzavot': { variant: 'success' },
    'Ichimlik': { variant: 'info' },
  };
  return map[cat] || { variant: 'default' };
}

export default function AdminInventory() {
  const store = useStore();
  const inventory = store?.inventory || defaultInventory;
  const updateInventory = store?.updateInventory || (() => {});
  const addInventory = store?.addInventory || (() => {});

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Hammasi');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: "Go'sht", quantity: '', unit: 'kg', minQuantity: '', supplier: '', expiryDate: '',
  });

  const filtered = inventory.filter((item) => {
    const matchCat = activeCategory === 'Hammasi' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const stats = {
    total: inventory.length,
    low: inventory.filter((i) => i.quantity > 0 && i.quantity <= i.minQuantity).length,
    out: inventory.filter((i) => i.quantity === 0).length,
    sufficient: inventory.filter((i) => i.quantity > i.minQuantity).length,
  };

  const criticalItems = inventory.filter((i) => i.quantity === 0 || i.quantity <= i.minQuantity);

  const openAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', category: "Go'sht", quantity: '', unit: 'kg', minQuantity: '', supplier: '', expiryDate: '' });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name, category: item.category, quantity: String(item.quantity),
      unit: item.unit, minQuantity: String(item.minQuantity), supplier: item.supplier, expiryDate: item.expiryDate,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    const data = { ...formData, quantity: Number(formData.quantity), minQuantity: Number(formData.minQuantity) };
    if (editingItem) updateInventory(editingItem.id, data);
    else addInventory({ ...data, id: Date.now() });
    setShowModal(false);
  };

  const handleQtyChange = (id, delta) => {
    const item = inventory.find((i) => i.id === id);
    if (item) updateInventory(id, { quantity: Math.max(0, item.quantity + delta) });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div variants={container} initial="hidden" animate="visible">
        <motion.div variants={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Inventarizatsiya</h1>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: 260 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input placeholder="Mahsulot qidirish..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 40px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <Button variant="primary" size="md" leftIcon={<Plus size={18} />} onClick={openAdd}>Yangi mahsulot</Button>
          </div>
        </motion.div>

        <motion.div variants={item} style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                border: activeCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: activeCategory === cat ? 'var(--primary-light)' : 'var(--surface)',
                color: activeCategory === cat ? 'var(--primary)' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}
            >{cat}</button>
          ))}
        </motion.div>

        <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Jami mahsulotlar', value: stats.total, icon: Package, color: 'var(--primary)' },
            { label: 'Tugagan', value: stats.out, icon: AlertTriangle, color: 'var(--danger)' },
            { label: 'Kam qoldi', value: stats.low, icon: ArrowDown, color: 'var(--warning)' },
            { label: 'Yetarli', value: stats.sufficient, icon: ArrowUp, color: 'var(--success)' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} padding="md">
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: 14 }}>
                  <Icon size={22} />
                </div>
                <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', lineHeight: 1, margin: 0 }}>{s.value}</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>{s.label}</p>
              </Card>
            );
          })}
        </motion.div>

        {criticalItems.length > 0 && (
          <motion.div variants={item} style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
            <AlertTriangle size={20} style={{ color: 'var(--danger)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--danger)', fontSize: 14 }}>Diqqat! {criticalItems.length} ta mahsulotda muammo bor</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>{criticalItems.map((i) => i.name).join(', ')} — zaxira yetarli emas yoki tugagan</div>
            </div>
          </motion.div>
        )}

        <motion.div variants={item} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Mahsulot', 'Kategoriya', 'Miqdori', 'Min. limit', 'Holat', 'Yetkazib beruvchi', 'Muddati', 'Amallar'].map((h) => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)', background: 'var(--surface-hover)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                      <Package size={44} style={{ marginBottom: 12, color: 'var(--border-strong)' }} />
                      <div style={{ fontSize: 15, fontWeight: 600 }}>Mahsulot topilmadi</div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => {
                    const st = getStatus(item.quantity, item.minQuantity);
                    const pct = item.minQuantity > 0 ? (item.quantity / item.minQuantity) * 100 : 0;
                    const catBadge = getCategoryBadgeStyle(item.category);
                    return (
                      <tr key={item.id}>
                        <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 14, color: 'var(--text)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}><Package size={18} /></div>
                            <span style={{ fontWeight: 600 }}>{item.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 14, color: 'var(--text)' }}>
                          <Badge variant={catBadge.variant} size="xs">{item.category}</Badge>
                        </td>
                        <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{item.quantity}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: 13, marginLeft: 2 }}>{item.unit}</span>
                        </td>
                        <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 14, color: 'var(--text-muted)' }}>
                          {item.minQuantity} {item.unit}
                        </td>
                        <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div style={{ width: 80, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: Math.min(pct, 100) + '%', height: '100%', borderRadius: 3, background: st.color, transition: 'width 0.3s' }} />
                            </div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: st.color }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: st.color, flexShrink: 0 }} />
                              {st.label}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13, whiteSpace: 'nowrap' }}>
                            <Truck size={14} /> {item.supplier}
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13, whiteSpace: 'nowrap' }}>
                            <Calendar size={14} /> {item.expiryDate}
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <button onClick={() => openEdit(item)}
                              style={{ padding: 8, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            ><Edit size={15} /></button>
                            <button onClick={() => handleQtyChange(item.id, -1)}
                              style={{ padding: '6px 8px', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            ><Minus size={14} /></button>
                            <button onClick={() => handleQtyChange(item.id, 1)}
                              style={{ padding: '6px 8px', borderRadius: 8, border: 'none', background: 'rgba(34,197,94,0.1)', color: 'var(--success)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            ><Plus size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? 'Mahsulotni tahrirlash' : "Yangi mahsulot qo'shish"} size="md">
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Mahsulot nomi</label>
            <input placeholder="Masalan: Mol go'shti" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Kategoriya</label>
            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, outline: 'none', cursor: 'pointer', fontFamily: 'inherit', boxSizing: 'border-box' }}
            >
              {categories.filter((c) => c !== 'Hammasi').map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Miqdori</label>
              <input type="number" placeholder="0" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>O'lchov birligi</label>
              <select value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, outline: 'none', cursor: 'pointer', fontFamily: 'inherit', boxSizing: 'border-box' }}
              >
                {units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Minimal limit</label>
            <input type="number" placeholder="0" value={formData.minQuantity} onChange={e => setFormData({ ...formData, minQuantity: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Yetkazib beruvchi</label>
            <input placeholder="Kompaniya nomi" value={formData.supplier} onChange={e => setFormData({ ...formData, supplier: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Muddati</label>
            <input type="date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Bekor qilish</Button>
            <Button variant="primary" onClick={handleSave} disabled={!formData.name || !formData.quantity}>
              {editingItem ? 'Saqlash' : "Qo'shish"}
            </Button>
          </div>
        </Modal>
      </motion.div>
    </motion.div>
  );
}
