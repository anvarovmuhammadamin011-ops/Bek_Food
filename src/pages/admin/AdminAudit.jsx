import React, { useState, useMemo } from 'react';
import useStore from '../../store/useStore';
import {
  Search,
  Filter,
  Download,
  Clock,
  Monitor,
  Smartphone,
  Globe,
  Edit,
  Trash2,
  Plus,
  LogIn,
  X,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';

const mockAuditLogs = [
  {
    id: 1,
    timestamp: '2026-07-28T14:32:00',
    user: { name: 'Sardor Raximov', avatar: 'SR', role: 'Admin' },
    action: 'Yaratildi',
    description: 'Yangi menyu elementi "Ribeye Steak 300g" yaratildi',
    ipAddress: '192.168.1.45',
    device: 'Chrome 120 / Windows 11',
    details: { target: 'Menyu', oldValue: null, newValue: "Ribeye Steak 300g — 185,000 so'm" },
  },
  {
    id: 2,
    timestamp: '2026-07-28T13:18:00',
    user: { name: 'Nilufar Karimova', avatar: 'NK', role: 'Manager' },
    action: "O'zgartirildi",
    description: "Buyurtma #1048 holati \"Jarayonda\" dan \"Tayyorlangan\" ga o'zgartirildi",
    ipAddress: '192.168.1.62',
    device: 'Safari 17 / macOS',
    details: { target: 'Buyurtma #1048', oldValue: 'Jarayonda', newValue: 'Tayyorlangan' },
  },
  {
    id: 3,
    timestamp: '2026-07-28T12:45:00',
    user: { name: 'Jasur Toshev', avatar: 'JT', role: 'Admin' },
    action: "O'chirildi",
    description: '"Eski Lavash" menyu elementi o\'chirildi',
    ipAddress: '10.0.0.12',
    device: 'Firefox 121 / Ubuntu',
    details: { target: 'Menyu', oldValue: "Eski Lavash — 45,000 so'm", newValue: null },
  },
  {
    id: 4,
    timestamp: '2026-07-28T11:20:00',
    user: { name: 'Sardor Raximov', avatar: 'SR', role: 'Admin' },
    action: 'Kirish',
    description: 'Tizimga kirish amalga oshirildi',
    ipAddress: '192.168.1.45',
    device: 'Chrome 120 / Windows 11',
    details: { target: 'Tizim', oldValue: null, newValue: 'Muvaffaqiyatli kirish' },
  },
  {
    id: 5,
    timestamp: '2026-07-28T10:55:00',
    user: { name: 'Malika Nazarova', avatar: 'MN', role: 'Kassir' },
    action: 'Yaratildi',
    description: 'Yangi buyurtma #1052 yaratildi (5 ta mahsulot)',
    ipAddress: '192.168.1.78',
    device: 'Chrome 120 / Android 14',
    details: { target: 'Buyurtma #1052', oldValue: null, newValue: "5 ta mahsulot, 425,000 so'm" },
  },
  {
    id: 6,
    timestamp: '2026-07-28T09:30:00',
    user: { name: 'Nilufar Karimova', avatar: 'NK', role: 'Manager' },
    action: "O'zgartirildi",
    description: "\"Filial 2\" ning ish vaqti 09:00-23:00 dan 08:00-24:00 ga o'zgartirildi",
    ipAddress: '192.168.1.62',
    device: 'Safari 17 / iOS 18',
    details: { target: 'Filial 2', oldValue: '09:00-23:00', newValue: '08:00-24:00' },
  },
  {
    id: 7,
    timestamp: '2026-07-27T22:15:00',
    user: { name: 'Jasur Toshev', avatar: 'JT', role: 'Admin' },
    action: "O'zgartirildi",
    description: "Foydalanchi \"Malika Nazarova\" roli \"Oshpaz\" dan \"Kassir\" ga o'zgartirildi",
    ipAddress: '10.0.0.12',
    device: 'Chrome 120 / Windows 11',
    details: { target: 'Malika Nazarova', oldValue: 'Oshpaz', newValue: 'Kassir' },
  },
  {
    id: 8,
    timestamp: '2026-07-27T20:40:00',
    user: { name: 'Sardor Raximov', avatar: 'SR', role: 'Admin' },
    action: 'Yaratildi',
    description: "Yangi filial \"Bekfood Denov\" tizimga qo'shildi",
    ipAddress: '192.168.1.45',
    device: 'Chrome 120 / Windows 11',
    details: { target: 'Filial', oldValue: null, newValue: 'Bekfood Denov — Buxoro viloyati' },
  },
  {
    id: 9,
    timestamp: '2026-07-27T18:05:00',
    user: { name: 'Malika Nazarova', avatar: 'MN', role: 'Kassir' },
    action: "O'zgartirildi",
    description: "Buyurtma #1039 uchun to'lov kiritildi — 375,000 so'm",
    ipAddress: '192.168.1.78',
    device: 'Chrome 120 / Android 14',
    details: { target: 'Buyurtma #1039', oldValue: "To'lanmagan", newValue: "To'langan — 375,000 so'm" },
  },
  {
    id: 10,
    timestamp: '2026-07-27T15:22:00',
    user: { name: 'Nilufar Karimova', avatar: 'NK', role: 'Manager' },
    action: "O'chirildi",
    description: '"Test Filial" tizimdan o\'chirildi',
    ipAddress: '192.168.1.62',
    device: 'Firefox 121 / Windows 11',
    details: { target: 'Filial', oldValue: 'Test Filial', newValue: null },
  },
  {
    id: 11,
    timestamp: '2026-07-27T13:50:00',
    user: { name: 'Sardor Raximov', avatar: 'SR', role: 'Admin' },
    action: "O'zgartirildi",
    description: 'Tizim sozlamalari: Komissiya 2% dan 3% ga o\'zgartirildi',
    ipAddress: '192.168.1.45',
    device: 'Chrome 120 / Windows 11',
    details: { target: 'Sozlamalar', oldValue: 'Komissiya: 2%', newValue: 'Komissiya: 3%' },
  },
  {
    id: 12,
    timestamp: '2026-07-27T11:10:00',
    user: { name: 'Jasur Toshev', avatar: 'JT', role: 'Admin' },
    action: 'Kirish',
    description: 'Tizimga kirish — birinchi muvaffaqiyatsiz urinish',
    ipAddress: '10.0.0.12',
    device: 'Firefox 121 / Ubuntu',
    details: { target: 'Tizim', oldValue: null, newValue: "Noto'g'ri parol — xavfli kirish" },
  },
  {
    id: 13,
    timestamp: '2026-07-26T19:35:00',
    user: { name: 'Malika Nazarova', avatar: 'MN', role: 'Kassir' },
    action: "O'zgartirildi",
    description: "Buyurtma #1030 ga qo'shimcha mahsulot qo'shildi — \"Cezar Salat\"",
    ipAddress: '192.168.1.78',
    device: 'Chrome 120 / Android 14',
    details: { target: 'Buyurtma #1030', oldValue: '3 ta mahsulot', newValue: '4 ta mahsulot' },
  },
  {
    id: 14,
    timestamp: '2026-07-26T16:20:00',
    user: { name: 'Nilufar Karimova', avatar: 'NK', role: 'Manager' },
    action: 'Yaratildi',
    description: "Yangi xodim \"Alisher Abduvaliev\" tizimga qo'shildi — Oshpaz",
    ipAddress: '192.168.1.62',
    device: 'Safari 17 / macOS',
    details: { target: 'Xodim', oldValue: null, newValue: 'Alisher Abduvaliev — Oshpaz' },
  },
  {
    id: 15,
    timestamp: '2026-07-26T09:00:00',
    user: { name: 'Sardor Raximov', avatar: 'SR', role: 'Admin' },
    action: "O'chirildi",
    description: '"Eski Logo" fayli tizimdan o\'chirildi',
    ipAddress: '192.168.1.45',
    device: 'Chrome 120 / Windows 11',
    details: { target: 'Fayl', oldValue: 'Eski Logo.png (2.4 MB)', newValue: null },
  },
];

const actionConfig = {
  Yaratildi: { color: 'var(--success)', bg: 'rgba(34,197,94,0.08)', icon: Plus },
  "O'zgartirildi": { color: 'var(--warning)', bg: 'rgba(245,158,11,0.08)', icon: Edit },
  "O'chirildi": { color: 'var(--danger)', bg: 'rgba(239,68,68,0.08)', icon: Trash2 },
  Kirish: { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', icon: LogIn },
};

const roleColors = {
  Admin: 'var(--primary)',
  Manager: '#3B82F6',
  Kassir: 'var(--success)',
  Oshpaz: '#8B5CF6',
};

const AdminAudit = () => {
  const { user } = useStore();

  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    user: '',
    action: '',
    search: '',
  });
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const uniqueUsers = useMemo(() => [...new Set(mockAuditLogs.map((l) => l.user.name))], []);
  const uniqueActions = Object.keys(actionConfig);

  const filteredLogs = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      if (filters.dateFrom && new Date(log.timestamp) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(log.timestamp) > new Date(filters.dateTo + 'T23:59:59')) return false;
      if (filters.user && log.user.name !== filters.user) return false;
      if (filters.action && log.action !== filters.action) return false;
      if (filters.search && !log.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [filters]);

  const stats = useMemo(() => {
    const counts = { Yaratildi: 0, "O'zgartirildi": 0, "O'chirildi": 0, Kirish: 0 };
    filteredLogs.forEach((l) => { counts[l.action]++; });
    return counts;
  }, [filteredLogs]);

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleString('uz-UZ', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleExport = () => {
    const csvRows = [
      ['ID', 'Vaqt', 'Foydalanchi', 'Amal', 'Tavsif', 'IP', 'Qurilma'],
      ...filteredLogs.map((l) => [
        l.id,
        formatDateTime(l.timestamp),
        l.user.name,
        l.action,
        l.description,
        l.ipAddress,
        l.device,
      ]),
    ];
    const csv = csvRows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isMobile = (device) => /android|iphone|ipad|mobile/i.test(device);

  const clearFilters = () => {
    setFilters({ dateFrom: '', dateTo: '', user: '', action: '', search: '' });
  };

  const hasActiveFilters = filters.dateFrom || filters.dateTo || filters.user || filters.action || filters.search;

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      <style>{`
        @keyframes auditFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes auditSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 768px) {
          .audit-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .audit-filters-grid { grid-template-columns: 1fr !important; }
          .audit-header-row { flex-direction: column !important; align-items: stretch !important; gap: 12px !important; }
          .audit-log-row { flex-direction: column !important; }
          .audit-log-top { flex-direction: column !important; align-items: flex-start !important; gap: 6px !important; }
          .audit-meta-row { flex-wrap: wrap !important; }
          .audit-search-span { grid-column: span 1 !important; }
        }
      `}</style>

      <div style={{ marginBottom: '24px', animation: 'auditFadeIn 0.4s ease' }}>
        <div className="audit-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text)', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
              Audit Log
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              {filteredLogs.length} ta yozuv topildi
            </p>
          </div>
          <button
            onClick={handleExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'var(--primary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(249,115,22,0.3)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(249,115,22,0.35)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(249,115,22,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="audit-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px', animation: 'auditFadeIn 0.4s ease 0.05s both' }}>
        {Object.entries(stats).map(([action, count]) => {
          const cfg = actionConfig[action];
          const Icon = cfg.icon;
          return (
            <div
              key={action}
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: cfg.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={18} style={{ color: cfg.color }} />
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text)', lineHeight: 1 }}>{count}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{action}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        marginBottom: '24px',
        overflow: 'hidden',
        animation: 'auditFadeIn 0.4s ease 0.1s both',
      }}>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '16px 20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            borderBottom: filtersOpen ? '1px solid var(--border)' : 'none',
          }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Filter size={16} style={{ color: 'var(--primary)' }} />
          </div>
          <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)', flex: 1, textAlign: 'left' }}>
            Filtrlar
          </span>
          {hasActiveFilters && (
            <span style={{
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: '600',
            }}>
              Faol
            </span>
          )}
          <ChevronDown
            size={18}
            style={{
              color: 'var(--text-muted)',
              transition: 'transform 0.2s ease',
              transform: filtersOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>

        {filtersOpen && (
          <div style={{ padding: '16px 20px 20px' }}>
            <div className="audit-filters-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                  Dan
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                  Gacha
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                  Foydalanchi
                </label>
                <select
                  value={filters.user}
                  onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                >
                  <option value="">Barchasi</option>
                  {uniqueUsers.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginTop: '14px' }} className="audit-filters-grid">
              <div>
                <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                  Amal turi
                </label>
                <select
                  value={filters.action}
                  onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                >
                  <option value="">Barchasi</option>
                  {uniqueActions.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="audit-search-span">
                <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                  Qidirish
                </label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input
                    placeholder="Tavsif bo'yicha qidirish..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                  />
                </div>
              </div>
            </div>
            {hasActiveFilters && (
              <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={clearFilters}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    background: 'none',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-muted)',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--danger)'; e.currentTarget.style.color = 'var(--danger)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <X size={14} />
                  Filtrlarni tozalash
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredLogs.length === 0 ? (
          <div style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            padding: '60px 20px',
            textAlign: 'center',
            animation: 'auditFadeIn 0.4s ease',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <AlertCircle size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>
              Hech narsa topilmadi
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              Filtrlarni o'zgartirib ko'ring
            </p>
          </div>
        ) : (
          filteredLogs.map((log, i) => {
            const cfg = actionConfig[log.action];
            const ActionIcon = cfg.icon;
            return (
              <div
                key={log.id}
                onClick={() => setSelectedEntry(log)}
                style={{
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  animation: `auditFadeIn 0.3s ease ${0.03 * i}s both`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.2)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div className="audit-log-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `${roleColors[log.user.role] || 'var(--text-muted)'}10`,
                    color: roleColors[log.user.role] || 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: '700',
                    flexShrink: 0,
                    border: `1px solid ${roleColors[log.user.role] || 'var(--text-muted)'}20`,
                  }}>
                    {log.user.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="audit-log-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>{log.user.name}</span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          padding: '2px 7px',
                          borderRadius: '5px',
                          background: `${roleColors[log.user.role] || 'var(--text-muted)'}10`,
                          color: roleColors[log.user.role] || 'var(--text-muted)',
                          border: `1px solid ${roleColors[log.user.role] || 'var(--text-muted)'}20`,
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px',
                        }}>
                          {log.user.role}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>
                        <Clock size={12} />
                        <span>{formatDate(log.timestamp)}</span>
                        <span style={{ opacity: 0.4 }}>&middot;</span>
                        <span>{formatTime(log.timestamp)}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '2px 0 10px' }}>
                      {log.description}
                    </p>
                    <div className="audit-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '3px 9px',
                        borderRadius: '6px',
                        background: cfg.bg,
                        color: cfg.color,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap',
                      }}>
                        <ActionIcon size={11} />
                        {log.action}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <Globe size={12} />
                        {log.ipAddress}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        {isMobile(log.device) ? <Smartphone size={12} /> : <Monitor size={12} />}
                        {log.device}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedEntry && (
        <div
          onClick={() => setSelectedEntry(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px',
            animation: 'auditFadeIn 0.2s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              width: '100%',
              maxWidth: '520px',
              maxHeight: '80vh',
              overflow: 'auto',
              animation: 'auditSlideUp 0.25s ease',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
            }}>
              <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text)', margin: 0 }}>
                Kirish tafsilotlari
              </h2>
              <button
                onClick={() => setSelectedEntry(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              {[
                { label: 'ID', value: `#${selectedEntry.id}` },
                { label: 'Vaqt', value: formatDateTime(selectedEntry.timestamp) },
                { label: 'IP manzil', value: selectedEntry.ipAddress },
                { label: 'Tavsif', value: selectedEntry.description },
              ].map((row, idx) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: '11px 0',
                    borderBottom: idx < 3 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500', minWidth: '100px' }}>{row.label}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: '500', textAlign: 'right', flex: 1, marginLeft: '12px' }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500', minWidth: '100px' }}>Foydalanchi</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: '500' }}>{selectedEntry.user.name}</span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    padding: '2px 7px',
                    borderRadius: '5px',
                    background: `${roleColors[selectedEntry.user.role] || 'var(--text-muted)'}10`,
                    color: roleColors[selectedEntry.user.role] || 'var(--text-muted)',
                    border: `1px solid ${roleColors[selectedEntry.user.role] || 'var(--text-muted)'}20`,
                    textTransform: 'uppercase',
                  }}>
                    {selectedEntry.user.role}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500', minWidth: '100px' }}>Amal</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  background: actionConfig[selectedEntry.action].bg,
                  color: actionConfig[selectedEntry.action].color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  {React.createElement(actionConfig[selectedEntry.action].icon, { size: 11 })}
                  {selectedEntry.action}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500', minWidth: '100px' }}>Qurilma</span>
                <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isMobile(selectedEntry.device) ? <Smartphone size={13} /> : <Monitor size={13} />}
                  {selectedEntry.device}
                </span>
              </div>

              {selectedEntry.details && (selectedEntry.details.oldValue || selectedEntry.details.newValue) && (
                <div style={{
                  marginTop: '16px',
                  padding: '14px',
                  background: 'var(--bg)',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '10px',
                  }}>
                    O'zgarishlar
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <span style={{ color: 'var(--danger)', textDecoration: 'line-through' }}>
                      {selectedEntry.details.oldValue || '—'}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>→</span>
                    <span style={{ color: 'var(--success)' }}>
                      {selectedEntry.details.newValue || '—'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAudit;
