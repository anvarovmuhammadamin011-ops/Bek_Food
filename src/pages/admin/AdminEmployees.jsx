import React, { useState, useMemo } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Edit, Trash2, Phone, Star, Clock, Activity, Users, Eye, X, Check, Shield } from 'lucide-react';

const COLORS = {
  bg: '#0f0f0f',
  surface: '#1a1a1a',
  surfaceAlt: '#222222',
  surfaceHover: '#2a2a2a',
  border: '#2e2e2e',
  text: '#e8e6e3',
  textDim: '#888888',
  textMuted: '#555555',
  primary: '#c9451a',
  primaryHover: '#a33815',
  green: '#4caf50',
  red: '#e51e1e',
  yellow: '#eab308',
  blue: '#3b82f6',
  courier: '#7fbf7f',
  seller: '#e51e1e',
  admin: '#eab308',
  danger: '#dc2626',
};

const ROLES = {
  seller: 'Sotuvchi',
  courier: 'Kuryer',
  admin: 'Admin',
};

const ROLE_KEYS = { Hammasi: 'all', Sotuvchilar: 'seller', Kuryerlar: 'courier', Adminlar: 'admin' };
const ROLE_TABS = ['Hammasi', 'Sotuvchilar', 'Kuryerlar', 'Adminlar'];

const MOCK_EMPLOYEES = [
  { id: 'e1', name: 'Jasurbek Toshmatov', phone: '+998 91 234 56 78', role: 'seller', online: true, rating: 4.8, orders: 1243, deliveries: 0, kpi: 92, lastLogin: '2026-07-28 08:15', workedHours: 186, activityPercent: 94, activityLog: ['Buyurtma #4521 qabul qilindi', 'Yetkazish tasdiqlandi', 'Hisobot yuborildi', 'Stollar ro\'yxatini yangiladi', 'Kassani tekshirdi'], password: '***' },
  { id: 'e2', name: 'Sardor Raximov', phone: '+998 90 111 22 33', role: 'seller', online: true, rating: 4.5, orders: 987, deliveries: 0, kpi: 85, lastLogin: '2026-07-28 07:50', workedHours: 172, activityPercent: 88, activityLog: ['Buyurtma #4520 qabul qilindi', 'Mijoz qo\'ng\'irog\'iga javob berildi', 'Menyu yangilandi', 'Chek chop etildi', 'Kassani yopdi'], password: '***' },
  { id: 'e3', name: 'Dilshod Karimov', phone: '+998 93 456 78 90', role: 'courier', online: false, rating: 4.9, orders: 0, deliveries: 2156, kpi: 97, lastLogin: '2026-07-27 22:30', workedHours: 198, activityPercent: 96, activityLog: ['Buyurtma #4518 yetkazildi', 'Yetkazish tasdiqlandi', 'Yetkazish vaqti yangilandi', 'Mijoz bahosi qabul qilindi', 'Jonli kuzatuv o\'chirildi'], password: '***' },
  { id: 'e4', name: 'Mirzohid Yusupov', phone: '+998 94 567 89 01', role: 'courier', online: true, rating: 4.3, orders: 0, deliveries: 1834, kpi: 78, lastLogin: '2026-07-28 09:00', workedHours: 165, activityPercent: 82, activityLog: ['Buyurtma #4522 olishga chiqdi', 'Jonli kuzatuv yoqildi', 'Yetkazish kechikdi', 'Mijoz bilan gaplashdi', 'Qaytishga chiqdi'], password: '***' },
  { id: 'e5', name: 'Bobur Alimov', phone: '+998 95 678 90 12', role: 'admin', online: true, rating: 5.0, orders: 342, deliveries: 0, kpi: 99, lastLogin: '2026-07-28 08:00', workedHours: 210, activityPercent: 99, activityLog: ['Tizim sozlamalarini yangiladi', 'Hisobotni eksport qildi', 'Yangi xodim qo\'shdi', 'Narxlarni yangiladi', 'Bazani zaxiraladi'], password: '***' },
  { id: 'e6', name: 'Akbar Normatov', phone: '+998 97 890 12 34', role: 'seller', online: false, rating: 4.1, orders: 654, deliveries: 0, kpi: 71, lastLogin: '2026-07-26 18:45', workedHours: 142, activityPercent: 68, activityLog: ['Buyurtma #4499 qabul qilindi', 'Kassani tekshirdi', 'Menyuni yangiladi', 'Chek chop etildi', 'Stollarni tozaladi'], password: '***' },
  { id: 'e7', name: 'Nodir Abdullayev', phone: '+998 98 901 23 45', role: 'courier', online: false, rating: 4.6, orders: 0, deliveries: 1567, kpi: 83, lastLogin: '2026-07-27 21:10', workedHours: 155, activityPercent: 85, activityLog: ['Buyurtma #4510 yetkazildi', 'Yetkazish rad etildi', 'Yetkazish vaqti o\'zgartirildi', 'Jonli kuzatuv o\'chirildi', 'Yangi buyurtma qabul qilindi'], password: '***' },
  { id: 'e8', name: 'Suhrob Turg\'unov', phone: '+998 99 012 34 56', role: 'admin', online: false, rating: 4.7, orders: 210, deliveries: 0, kpi: 91, lastLogin: '2026-07-27 17:30', workedHours: 195, activityPercent: 90, activityLog: ['Xodimlar ro\'yxatini yangiladi', 'Moliyaviy hisobotni tekshirdi', 'Tizimni yangiladi', 'Backup yaratdi', 'Sozlamalarni o\'zgartirdi'], password: '***' },
];

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          fill={s <= Math.round(rating) ? COLORS.yellow : 'none'}
          stroke={s <= Math.round(rating) ? COLORS.yellow : COLORS.textMuted}
        />
      ))}
      <span style={{ fontSize: 11, color: COLORS.textDim, marginLeft: 4 }}>{rating.toFixed(1)}</span>
    </div>
  );
}

function KPIBar({ value }) {
  const color = value >= 90 ? COLORS.green : value >= 75 ? COLORS.yellow : COLORS.red;
  return (
    <div style={{ width: '100%', height: 6, background: COLORS.surfaceAlt, borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.5s ease' }} />
    </div>
  );
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

  const getRoleColor = (role) => COLORS[role] || COLORS.primary;

  const cardStyle = {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: 16,
    transition: 'all 0.2s ease',
    cursor: 'default',
    animation: 'fade-in 0.4s ease forwards',
  };

  const cardHoverHandlers = {
    onMouseEnter: (e) => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.transform = 'translateY(-2px)'; },
    onMouseLeave: (e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = 'translateY(0)'; },
  };

  const btnStyle = {
    background: COLORS.primary,
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    transition: 'background 0.2s',
  };

  const outlineBtnStyle = {
    background: 'transparent',
    color: COLORS.textDim,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: '6px 12px',
    fontSize: 12,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    transition: 'all 0.2s',
  };

  const inputStyle = {
    width: '100%',
    background: COLORS.surfaceAlt,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: '10px 12px',
    color: COLORS.text,
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, color: COLORS.text, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .stagger > *:nth-child(1) { animation-delay: 0s; }
        .stagger > *:nth-child(2) { animation-delay: 0.05s; }
        .stagger > *:nth-child(3) { animation-delay: 0.1s; }
        .stagger > *:nth-child(4) { animation-delay: 0.15s; }
        .stagger > *:nth-child(5) { animation-delay: 0.2s; }
        .stagger > *:nth-child(6) { animation-delay: 0.25s; }
        .stagger > *:nth-child(7) { animation-delay: 0.3s; }
        .stagger > *:nth-child(8) { animation-delay: 0.35s; }
        input:focus { border-color: ${COLORS.primary} !important; }
        button:hover { opacity: 0.9; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; animation: fade-in 0.2s ease; }
        .modal-content { background: ${COLORS.surface}; border: 1px solid ${COLORS.border}; border-radius: 16px; max-width: 520px; width: 90%; max-height: 85vh; overflow-y: auto; animation: fade-in 0.25s ease; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', animation: 'fade-in 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate(-1)} style={{ background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.text }}>
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Xodimlar</h1>
              <p style={{ fontSize: 12, color: COLORS.textDim, margin: 0 }}>Barcha xodimlarni boshqarish</p>
            </div>
          </div>
          <button onClick={() => setAddModal(true)} style={btnStyle}>
            <Plus size={16} /> Yangi xodim
          </button>
        </div>

        {/* Role Filter Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, background: COLORS.surface, padding: 4, borderRadius: 10, border: `1px solid ${COLORS.border}`, animation: 'fade-in 0.35s ease' }}>
          {ROLE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                border: 'none',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                background: activeTab === tab ? COLORS.primary : 'transparent',
                color: activeTab === tab ? '#fff' : COLORS.textDim,
                transition: 'all 0.2s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Jami xodimlar', value: stats.total, icon: <Users size={18} />, color: COLORS.text },
            { label: 'Faol hozir', value: stats.online, icon: <Activity size={18} />, color: COLORS.green },
            { label: "O'rtacha reyting", value: stats.avgRating, icon: <Star size={18} />, color: COLORS.yellow },
            { label: 'Bugun ishlagan', value: stats.workedToday, icon: <Clock size={18} />, color: COLORS.blue },
          ].map((s, i) => (
            <div key={i} className="card card-hover" style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 14, animationDelay: `${i * 0.07}s` }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontSize: 11, color: COLORS.textDim, margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</p>
                <p style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Employee Cards Grid */}
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14, marginBottom: 40 }}>
          {filtered.map((emp) => (
            <div key={emp.id} className="card card-hover" style={cardStyle} {...cardHoverHandlers}>
              {/* Top row: avatar + info + status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: getRoleColor(emp.role), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 17, color: '#fff', flexShrink: 0, position: 'relative' }}>
                  {emp.name.charAt(0)}
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: emp.online ? COLORS.green : COLORS.textMuted, border: `2px solid ${COLORS.surface}` }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.name}</span>
                    <span className={`badge badge-${emp.role === 'admin' ? 'yellow' : emp.role === 'courier' ? 'green' : 'red'}`} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: `${getRoleColor(emp.role)}22`, color: getRoleColor(emp.role), fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {ROLES[emp.role]}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: COLORS.textDim, fontSize: 12, marginTop: 2 }}>
                    <Phone size={11} /> {emp.phone}
                  </div>
                </div>
              </div>

              {/* Rating + Stats */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <StarRating rating={emp.rating} />
                <div style={{ display: 'flex', gap: 14, fontSize: 11, color: COLORS.textDim }}>
                  <span>{emp.role === 'courier' ? `${emp.deliveries} yetkazish` : `${emp.orders} buyurtma`}</span>
                </div>
              </div>

              {/* KPI */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: COLORS.textDim }}>KPI</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: emp.kpi >= 90 ? COLORS.green : emp.kpi >= 75 ? COLORS.yellow : COLORS.red }}>{emp.kpi}%</span>
                </div>
                <KPIBar value={emp.kpi} />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6, borderTop: `1px solid ${COLORS.border}`, paddingTop: 12 }}>
                <button onClick={() => setDetailModal(emp)} style={{ ...outlineBtnStyle, flex: 1, justifyContent: 'center' }} title="Ko'rish">
                  <Eye size={13} /> Ko'rish
                </button>
                <button onClick={() => setEditModal(emp)} style={{ ...outlineBtnStyle, flex: 1, justifyContent: 'center' }} title="Tahrirlash">
                  <Edit size={13} /> Tahrirlash
                </button>
                <button onClick={() => setDeleteConfirm(emp.id)} style={{ ...outlineBtnStyle, color: COLORS.danger, borderColor: `${COLORS.danger}44` }} title="O'chirish">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: COLORS.textDim }}>
            <Users size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ fontSize: 14 }}>Bu kategoriyada xodimlar topilmadi</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailModal && (
        <div className="modal-overlay" onClick={() => setDetailModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${COLORS.border}` }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Xodim ma'lumotlari</h3>
              <button onClick={() => setDetailModal(null)} style={{ background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: 20 }}>
              {/* Profile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: getRoleColor(detailModal.role), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, color: '#fff', flexShrink: 0 }}>
                  {detailModal.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{detailModal.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: `${getRoleColor(detailModal.role)}22`, color: getRoleColor(detailModal.role), fontWeight: 600 }}>{ROLES[detailModal.role]}</span>
                    <span style={{ fontSize: 12, color: COLORS.textDim, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: detailModal.online ? COLORS.green : COLORS.textMuted }} />
                      {detailModal.online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
                {[
                  { label: 'Telefon', value: detailModal.phone, icon: <Phone size={13} /> },
                  { label: 'Oxirgi login', value: detailModal.lastLogin, icon: <Clock size={13} /> },
                  { label: 'Ishlagan vaqt', value: `${detailModal.workedHours} soat`, icon: <Clock size={13} /> },
                  { label: 'Faolligi', value: `${detailModal.activityPercent}%`, icon: <Activity size={13} /> },
                  { label: 'Buyurtmalar', value: detailModal.role === 'courier' ? detailModal.deliveries : detailModal.orders, icon: <Check size={13} /> },
                  { label: 'KPI bali', value: `${detailModal.kpi}%`, icon: <Shield size={13} /> },
                ].map((s, i) => (
                  <div key={i} style={{ background: COLORS.surfaceAlt, borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{s.icon} {s.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Rating */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Reyting</div>
                <StarRating rating={detailModal.rating} />
              </div>

              {/* KPI Bar */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: COLORS.textDim }}>KPI</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{detailModal.kpi}%</span>
                </div>
                <KPIBar value={detailModal.kpi} />
              </div>

              {/* Activity Log */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Oxirgi harakatlar</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(detailModal.activityLog || []).slice(0, 5).map((log, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: COLORS.textDim, padding: '6px 10px', background: COLORS.surfaceAlt, borderRadius: 6 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: COLORS.primary, flexShrink: 0 }} />
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
                <button onClick={() => { setDetailModal(null); setEditModal(detailModal); }} style={{ ...btnStyle, flex: 1, justifyContent: 'center' }}>
                  <Edit size={14} /> Tahrirlash
                </button>
                <button onClick={() => { setDeleteConfirm(detailModal.id); setDetailModal(null); }} style={{ ...outlineBtnStyle, flex: 1, justifyContent: 'center', color: COLORS.danger, borderColor: `${COLORS.danger}44` }}>
                  <Trash2 size={14} /> O'chirish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Employee Modal */}
      {(addModal || editModal) && (
        <div className="modal-overlay" onClick={() => { setAddModal(false); setEditModal(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${COLORS.border}` }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{editModal ? 'Xodimni tahrirlash' : "Yangi xodim qo'shish"}</h3>
              <button onClick={() => { setAddModal(false); setEditModal(null); }} style={{ background: 'none', border: 'none', color: COLORS.textDim, cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: 20 }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: COLORS.textDim, marginBottom: 6 }}>Ism</label>
                    <input name="name" defaultValue={editModal?.name || ''} required style={inputStyle} placeholder="To'liq ism" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: COLORS.textDim, marginBottom: 6 }}>Telefon</label>
                    <input name="phone" defaultValue={editModal?.phone || ''} required style={inputStyle} placeholder="+998 9X XXX XX XX" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: COLORS.textDim, marginBottom: 6 }}>Lavozim</label>
                    <select name="role" defaultValue={editModal?.role || 'seller'} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                      <option value="seller">Sotuvchi</option>
                      <option value="courier">Kuryer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: COLORS.textDim, marginBottom: 6 }}>Parol</label>
                    <input name="password" type="text" defaultValue={editModal?.password || ''} required style={inputStyle} placeholder="Parol kiriting" />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 20, borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
                  <button type="button" onClick={() => { setAddModal(false); setEditModal(null); }} style={{ ...outlineBtnStyle, flex: 1, justifyContent: 'center' }}>Bekor qilish</button>
                  <button type="submit" style={{ ...btnStyle, flex: 1, justifyContent: 'center' }}>
                    <Check size={14} /> {editModal ? 'Saqlash' : "Qo'shish"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 24, maxWidth: 380, textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${COLORS.danger}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: COLORS.danger }}>
              <Trash2 size={22} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>Xodimni o'chirish</h3>
            <p style={{ fontSize: 13, color: COLORS.textDim, margin: '0 0 20px' }}>Bu xodimni ro'yxatdan o'chirishni xohlaysizmi? Amalga qaytarib bo'lmaydi.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ ...outlineBtnStyle, flex: 1, justifyContent: 'center' }}>Bekor qilish</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ ...btnStyle, flex: 1, justifyContent: 'center', background: COLORS.danger }}>O'chirish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
