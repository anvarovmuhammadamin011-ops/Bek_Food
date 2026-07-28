import { useState, useMemo } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Phone, Star, Clock, Activity, Users, Eye, X, Check, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Avatar } from '../../components/ui/Avatar';

const ROLES = {
  seller: 'Sotuvchi',
  courier: 'Kuryer',
  admin: 'Admin',
};

const ROLE_KEYS = { Hammasi: 'all', Sotuvchilar: 'seller', Kuryerlar: 'courier', Adminlar: 'admin' };
const ROLE_TABS = ['Hammasi', 'Sotuvchilar', 'Kuryerlar', 'Adminlar'];

const MOCK_EMPLOYEES = [
  { id: 'e1', name: 'Jasurbek Toshmatov', phone: '+998 91 234 56 78', role: 'seller', online: true, rating: 4.8, orders: 1243, deliveries: 0, kpi: 92, lastLogin: '2026-07-28 08:15', workedHours: 186, activityPercent: 94, activityLog: ['Buyurtma #4521 qabul qilindi', 'Yetkazish tasdiqlandi', 'Hisobot yuborildi', "Stollar ro'yxatini yangiladi", 'Kassani tekshirdi'], password: '***' },
  { id: 'e2', name: 'Sardor Raximov', phone: '+998 90 111 22 33', role: 'seller', online: true, rating: 4.5, orders: 987, deliveries: 0, kpi: 85, lastLogin: '2026-07-28 07:50', workedHours: 172, activityPercent: 88, activityLog: ['Buyurtma #4520 qabul qilindi', "Mijoz qo'ng'irog'iga javob berildi", 'Menyu yangilandi', 'Chek chop etildi', 'Kassani yopdi'], password: '***' },
  { id: 'e3', name: 'Dilshod Karimov', phone: '+998 93 456 78 90', role: 'courier', online: false, rating: 4.9, orders: 0, deliveries: 2156, kpi: 97, lastLogin: '2026-07-27 22:30', workedHours: 198, activityPercent: 96, activityLog: ['Buyurtma #4518 yetkazildi', 'Yetkazish tasdiqlandi', "Yetkazish vaqti yangilandi", 'Mijoz bahosi qabul qilindi', "Jonli kuzatuv o'chirildi"], password: '***' },
  { id: 'e4', name: 'Mirzohid Yusupov', phone: '+998 94 567 89 01', role: 'courier', online: true, rating: 4.3, orders: 0, deliveries: 1834, kpi: 78, lastLogin: '2026-07-28 09:00', workedHours: 165, activityPercent: 82, activityLog: ['Buyurtma #4522 olishga chiqdi', 'Jonli kuzatuv yoqildi', 'Yetkazish kechikdi', 'Mijoz bilan gaplashdi', 'Qaytishga chiqdi'], password: '***' },
  { id: 'e5', name: 'Bobur Alimov', phone: '+998 95 678 90 12', role: 'admin', online: true, rating: 5.0, orders: 342, deliveries: 0, kpi: 99, lastLogin: '2026-07-28 08:00', workedHours: 210, activityPercent: 99, activityLog: ["Tizim sozlamalarini yangiladi", 'Hisobotni eksport qildi', "Yangi xodim qo'shdi", 'Narxlarni yangiladi', 'Bazani zaxiraladi'], password: '***' },
  { id: 'e6', name: 'Akbar Normatov', phone: '+998 97 890 12 34', role: 'seller', online: false, rating: 4.1, orders: 654, deliveries: 0, kpi: 71, lastLogin: '2026-07-26 18:45', workedHours: 142, activityPercent: 68, activityLog: ['Buyurtma #4499 qabul qilindi', 'Kassani tekshirdi', 'Menyuni yangiladi', 'Chek chop etildi', 'Stollarni tozaladi'], password: '***' },
  { id: 'e7', name: 'Nodir Abdullayev', phone: '+998 98 901 23 45', role: 'courier', online: false, rating: 4.6, orders: 0, deliveries: 1567, kpi: 83, lastLogin: '2026-07-27 21:10', workedHours: 155, activityPercent: 85, activityLog: ['Buyurtma #4510 yetkazildi', 'Yetkazish rad etildi', "Yetkazish vaqti o'zgartirildi", "Jonli kuzatuv o'chirildi", 'Yangi buyurtma qabul qilindi'], password: '***' },
  { id: 'e8', name: "Suhrob Turg'unov", phone: '+998 99 012 34 56', role: 'admin', online: false, rating: 4.7, orders: 210, deliveries: 0, kpi: 91, lastLogin: '2026-07-27 17:30', workedHours: 195, activityPercent: 90, activityLog: ["Xodimlar ro'yxatini yangiladi", 'Moliyaviy hisobotni tekshirdi', 'Tizimni yangiladi', 'Backup yaratdi', "Sozlamalarni o'zgartirdi"], password: '***' },
];

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={12} fill={s <= Math.round(rating) ? 'var(--warning)' : 'none'} stroke={s <= Math.round(rating) ? 'var(--warning)' : 'var(--text-muted)'} />
      ))}
      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>{rating.toFixed(1)}</span>
    </div>
  );
}

function KPIBar({ value }) {
  const color = value >= 90 ? 'var(--success)' : value >= 75 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div style={{ width: '100%', height: 6, background: 'var(--surface-active)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.5s ease' }} />
    </div>
  );
}

function getRoleBg(role) {
  if (role === 'seller') return 'var(--primary-light)';
  if (role === 'courier') return '#ECFDF5';
  if (role === 'admin') return '#FEF9C3';
  return 'var(--primary-light)';
}

function getRoleColor(role) {
  if (role === 'seller') return 'var(--primary)';
  if (role === 'courier') return 'var(--success)';
  if (role === 'admin') return 'var(--warning)';
  return 'var(--primary)';
}

export default function AdminEmployees() {
  const { employees = MOCK_EMPLOYEES, addEmployee, removeEmployee } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Hammasi');
  const [detailModal, setDetailModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const allEmployees = employees.length > 0 ? employees : MOCK_EMPLOYEES;

  const filtered = useMemo(() => {
    const key = ROLE_KEYS[activeTab];
    if (key === 'all') return allEmployees;
    return allEmployees.filter((e) => e.role === key);
  }, [activeTab, allEmployees]);

  const stats = useMemo(() => ({
    total: allEmployees.length,
    online: allEmployees.filter((e) => e.online).length,
    avgRating: allEmployees.length > 0 ? (allEmployees.reduce((s, e) => s + e.rating, 0) / allEmployees.length).toFixed(1) : '0.0',
    workedToday: allEmployees.filter((e) => e.lastLogin?.startsWith('2026-07-28')).length,
  }), [allEmployees]);

  const handleAddEmployee = (emp) => {
    if (addEmployee) addEmployee({ ...emp, id: `e${Date.now()}`, online: false, rating: 0, orders: 0, deliveries: 0, kpi: 0, lastLogin: '-', workedHours: 0, activityPercent: 0, activityLog: [] });
    setAddModal(false);
  };

  const handleDelete = (id) => {
    if (removeEmployee) removeEmployee(id);
    setDeleteConfirm(null);
    setDetailModal(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div variants={container} initial="hidden" animate="visible">
        <motion.div variants={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Xodimlar</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>Barcha xodimlarni boshqarish</p>
          </div>
          <Button variant="primary" size="md" leftIcon={<Plus size={16} />} onClick={() => setAddModal(true)}>Yangi xodim</Button>
        </motion.div>

        <motion.div variants={item} style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--surface)', padding: 5, borderRadius: 14, border: '1px solid var(--border)' }}>
          {ROLE_TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '9px 20px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                background: activeTab === tab ? 'var(--primary)' : 'transparent',
                color: activeTab === tab ? '#FFFFFF' : 'var(--text-muted)', transition: 'all 0.2s',
              }}
            >{tab}</button>
          ))}
        </motion.div>

        <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Jami xodimlar', value: stats.total, icon: Users, accent: 'primary' },
            { label: 'Faol hozir', value: stats.online, icon: Activity, accent: 'success' },
            { label: "O'rtacha reyting", value: stats.avgRating, icon: Star, accent: 'warning' },
            { label: 'Bugun ishlagan', value: stats.workedToday, icon: Clock, accent: 'info' },
          ].map((s, i) => {
            const Icon = s.icon;
            const accentBg = s.accent === 'success' ? '#ECFDF5' : s.accent === 'warning' ? '#FEF9C3' : s.accent === 'info' ? '#EFF6FF' : 'var(--primary-light)';
            const accentColor = s.accent === 'success' ? 'var(--success)' : s.accent === 'warning' ? 'var(--warning)' : s.accent === 'info' ? '#3B82F6' : 'var(--primary)';
            return (
              <Card key={i} padding="sm">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, flexShrink: 0 }}>
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

        <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16, marginBottom: 40 }}>
          {filtered.map((emp) => (
            <motion.div key={emp.id} variants={item}>
              <Card padding="md" hoverable>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: getRoleBg(emp.role), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: getRoleColor(emp.role), flexShrink: 0, position: 'relative' }}>
                    {emp.name.charAt(0)}
                    <div style={{ position: 'absolute', bottom: 1, right: 1, width: 13, height: 13, borderRadius: '50%', background: emp.online ? 'var(--success)' : 'var(--text-muted)', border: '2.5px solid var(--surface)' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.name}</span>
                      <Badge variant={emp.role === 'admin' ? 'warning' : emp.role === 'courier' ? 'success' : 'primary'} size="xs">{ROLES[emp.role]}</Badge>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: 12, marginTop: 3 }}>
                      <Phone size={11} /> {emp.phone}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <StarRating rating={emp.rating} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {emp.role === 'courier' ? `${emp.deliveries} yetkazish` : `${emp.orders} buyurtma`}
                  </span>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>KPI</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: emp.kpi >= 90 ? 'var(--success)' : emp.kpi >= 75 ? 'var(--warning)' : 'var(--danger)' }}>{emp.kpi}%</span>
                  </div>
                  <KPIBar value={emp.kpi} />
                </div>
                <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                  <Button variant="secondary" size="sm" leftIcon={<Eye size={14} />} style={{ flex: 1, justifyContent: 'center' }} onClick={() => setDetailModal(emp)}>Ko'rish</Button>
                  <Button variant="secondary" size="sm" leftIcon={<Edit size={14} />} style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEditModal(emp)}>Tahrirlash</Button>
                  <Button variant="outline" size="sm" style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.25)', flexShrink: 0 }} onClick={() => setDeleteConfirm(emp.id)}><Trash2 size={14} /></Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
            <Users size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
            <p style={{ fontSize: 14 }}>Bu kategoriyada xodimlar topilmadi</p>
          </div>
        )}
      </motion.div>

      <Modal isOpen={!!detailModal} onClose={() => setDetailModal(null)} title="Xodim ma'lumotlari" size="md">
        {detailModal && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 58, height: 58, borderRadius: '50%', background: getRoleBg(detailModal.role), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, color: getRoleColor(detailModal.role), flexShrink: 0 }}>
                {detailModal.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{detailModal.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                  <Badge variant={detailModal.role === 'admin' ? 'warning' : detailModal.role === 'courier' ? 'success' : 'primary'} size="xs">{ROLES[detailModal.role]}</Badge>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: detailModal.online ? 'var(--success)' : 'var(--text-muted)' }} />
                    {detailModal.online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 22 }}>
              {[
                { label: 'Telefon', value: detailModal.phone, icon: Phone },
                { label: 'Oxirgi login', value: detailModal.lastLogin, icon: Clock },
                { label: 'Ishlagan vaqt', value: `${detailModal.workedHours} soat`, icon: Clock },
                { label: 'Faolligi', value: `${detailModal.activityPercent}%`, icon: Activity },
                { label: 'Buyurtmalar', value: detailModal.role === 'courier' ? detailModal.deliveries : detailModal.orders, icon: Check },
                { label: 'KPI bali', value: `${detailModal.kpi}%`, icon: Shield },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} style={{ background: 'var(--bg)', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 }}><Icon size={13} /> {s.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{s.value}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Reyting</div>
              <StarRating rating={detailModal.rating} />
            </div>
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>KPI</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{detailModal.kpi}%</span>
              </div>
              <KPIBar value={detailModal.kpi} />
            </div>
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Oxirgi harakatlar</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(detailModal.activityLog || []).slice(0, 5).map((log, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--text-secondary)', padding: '8px 12px', background: 'var(--bg)', borderRadius: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                    {log}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 18 }}>
              <Button variant="primary" leftIcon={<Edit size={14} />} style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setDetailModal(null); setEditModal(detailModal); }}>Tahrirlash</Button>
              <Button variant="outline" style={{ flex: 1, justifyContent: 'center', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.25)' }} onClick={() => { setDeleteConfirm(detailModal.id); setDetailModal(null); }}><Trash2 size={14} /> O'chirish</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={addModal || !!editModal} onClose={() => { setAddModal(false); setEditModal(null); }} title={editModal ? 'Xodimni tahrirlash' : "Yangi xodim qo'shish"} size="md">
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          const data = { name: fd.get('name'), phone: fd.get('phone'), role: fd.get('role'), password: fd.get('password') };
          if (editModal) {
            if (addEmployee) addEmployee({ ...editModal, ...data });
            setEditModal(null);
          } else {
            handleAddEmployee(data);
          }
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>Ism</label>
              <input name="name" defaultValue={editModal?.name || ''} required
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 14px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                placeholder="To'liq ism"
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>Telefon</label>
              <input name="phone" defaultValue={editModal?.phone || ''} required
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 14px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                placeholder="+998 9X XXX XX XX"
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>Lavozim</label>
              <select name="role" defaultValue={editModal?.role || 'seller'}
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 14px', color: 'var(--text)', fontSize: 14, outline: 'none', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              >
                <option value="seller">Sotuvchi</option>
                <option value="courier">Kuryer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>Parol</label>
              <input name="password" type="text" defaultValue={editModal?.password || ''} required
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 14px', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                placeholder="Parol kiriting"
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 18 }}>
            <Button variant="secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setAddModal(false); setEditModal(null); }} type="button">Bekor qilish</Button>
            <Button variant="primary" style={{ flex: 1, justifyContent: 'center' }} type="submit">
              <Check size={14} /> {editModal ? 'Saqlash' : "Qo'shish"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} size="sm">
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: 'var(--danger)' }}>
            <Trash2 size={24} />
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>Xodimni o'chirish</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.5 }}>Bu xodimni ro'yxatdan o'chirishni xohlaysizmi? Amalga qaytarib bo'lmaydi.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setDeleteConfirm(null)}>Bekor qilish</Button>
            <Button variant="danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleDelete(deleteConfirm)}>O'chirish</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
