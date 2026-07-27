import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import {
  ChevronLeft,
  Search,
  Filter,
  Download,
  Clock,
  User,
  Monitor,
  Smartphone,
  Globe,
  Edit,
  Trash2,
  Plus,
  LogIn,
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
    details: { target: 'Menyu', oldValue: null, newValue: 'Ribeye Steak 300g — 185,000 so\'m' },
  },
  {
    id: 2,
    timestamp: '2026-07-28T13:18:00',
    user: { name: 'Nilufar Karimova', avatar: 'NK', role: 'Manager' },
    action: "O'zgartirildi",
    description: 'Buyurtma #1048 holati "Jarayonda" dan "Tayyorlangan" ga o\'zgartirildi',
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
    details: { target: 'Menyu', oldValue: 'Eski Lavash — 45,000 so\'m', newValue: null },
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
    details: { target: 'Buyurtma #1052', oldValue: null, newValue: '5 ta mahsulot, 425,000 so\'m' },
  },
  {
    id: 6,
    timestamp: '2026-07-28T09:30:00',
    user: { name: 'Nilufar Karimova', avatar: 'NK', role: 'Manager' },
    action: "O'zgartirildi",
    description: '"Filial 2" ning ish vaqti 09:00-23:00 dan 08:00-24:00 ga o\'zgartirildi',
    ipAddress: '192.168.1.62',
    device: 'Safari 17 / iOS 18',
    details: { target: 'Filial 2', oldValue: '09:00-23:00', newValue: '08:00-24:00' },
  },
  {
    id: 7,
    timestamp: '2026-07-27T22:15:00',
    user: { name: 'Jasur Toshev', avatar: 'JT', role: 'Admin' },
    action: "O'zgartirildi",
    description: 'Foydalanchi "Malika Nazarova" roli "Oshpaz" dan "Kassir" ga o\'zgartirildi',
    ipAddress: '10.0.0.12',
    device: 'Chrome 120 / Windows 11',
    details: { target: 'Malika Nazarova', oldValue: 'Oshpaz', newValue: 'Kassir' },
  },
  {
    id: 8,
    timestamp: '2026-07-27T20:40:00',
    user: { name: 'Sardor Raximov', avatar: 'SR', role: 'Admin' },
    action: 'Yaratildi',
    description: 'Yangi filial "Bekfood Denov" tizimga qo\'shildi',
    ipAddress: '192.168.1.45',
    device: 'Chrome 120 / Windows 11',
    details: { target: 'Filial', oldValue: null, newValue: 'Bekfood Denov — Buxoro viloyati' },
  },
  {
    id: 9,
    timestamp: '2026-07-27T18:05:00',
    user: { name: 'Malika Nazarova', avatar: 'MN', role: 'Kassir' },
    action: "O'zgartirildi",
    description: 'Buyurtma #1039 uchun to\'lov kiritildi — 375,000 so\'m',
    ipAddress: '192.168.1.78',
    device: 'Chrome 120 / Android 14',
    details: { target: 'Buyurtma #1039', oldValue: 'To\'lanmagan', newValue: 'To\'langan — 375,000 so\'m' },
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
    details: { target: 'Tizim', oldValue: null, newValue: 'Noto\'g\'ri parol — xavfli kirish' },
  },
  {
    id: 13,
    timestamp: '2026-07-26T19:35:00',
    user: { name: 'Malika Nazarova', avatar: 'MN', role: 'Kassir' },
    action: "O'zgartirildi",
    description: 'Buyurtma #1030 ga qo\'shimcha mahsulot qo\'shildi — "Cezar Salat"',
    ipAddress: '192.168.1.78',
    device: 'Chrome 120 / Android 14',
    details: { target: 'Buyurtma #1030', oldValue: '3 ta mahsulot', newValue: '4 ta mahsulot' },
  },
  {
    id: 14,
    timestamp: '2026-07-26T16:20:00',
    user: { name: 'Nilufar Karimova', avatar: 'NK', role: 'Manager' },
    action: 'Yaratildi',
    description: 'Yangi xodim "Alisher Abduvaliev" tizimga qo\'shildi — Oshpaz',
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
  Yaratildi: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', icon: Plus },
  "O'zgartirildi": { color: '#eab308', bg: 'rgba(234,179,8,0.12)', icon: Edit },
  "O'chirildi": { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: Trash2 },
  Kirish: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', icon: LogIn },
};

const roleColors = {
  Admin: '#c8a97e',
  Manager: '#3b82f6',
  Kassir: '#22c55e',
  Oshpaz: '#a855f7',
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
    color: '#f5f5f5',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: '24px',
    maxWidth: '960px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '28px',
    animation: 'fadeIn 0.5s ease',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: '#2a2a2a',
    border: '1px solid #3a3a3a',
    color: '#f5f5f5',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#f5f5f5',
    margin: 0,
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #c8a97e, #b8956a)',
    border: 'none',
    borderRadius: '10px',
    color: '#1a1a1a',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  filtersCard: {
    background: '#242424',
    borderRadius: '16px',
    border: '1px solid #333',
    padding: '20px',
    marginBottom: '24px',
    animation: 'fadeIn 0.5s ease 0.1s both',
  },
  filtersHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '18px',
    paddingBottom: '14px',
    borderBottom: '1px solid #333',
  },
  filtersIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: '#c8a97e20',
    color: '#c8a97e',
  },
  filtersTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f5f5f5',
    margin: 0,
  },
  filtersGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '14px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '10px',
    color: '#f5f5f5',
    fontSize: '13px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  },
  searchRow: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '14px',
    marginTop: '14px',
  },
  searchInputWrapper: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666',
  },
  logList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  logEntry: {
    background: '#242424',
    borderRadius: '14px',
    border: '1px solid #333',
    padding: '18px 20px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    animation: 'fadeIn 0.5s ease both',
  },
  logEntryInner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
  },
  avatar: (color) => ({
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: `${color}18`,
    color: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    flexShrink: 0,
    border: `1px solid ${color}30`,
  }),
  logContent: {
    flex: 1,
    minWidth: 0,
  },
  logTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    marginBottom: '4px',
  },
  logUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#f5f5f5',
  },
  roleBadge: (color) => ({
    fontSize: '10px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '6px',
    background: `${color}18`,
    color: color,
    border: `1px solid ${color}30`,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  }),
  actionBadge: (cfg) => ({
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '8px',
    background: cfg.bg,
    color: cfg.color,
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  }),
  logDescription: {
    fontSize: '13px',
    color: '#bbb',
    lineHeight: '1.5',
    marginTop: '2px',
  },
  logMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '10px',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    color: '#777',
  },
  timestamp: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    color: '#888',
    flexShrink: 0,
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
  },
  emptyIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    background: '#2a2a2a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginBottom: '24px',
    animation: 'fadeIn 0.5s ease 0.05s both',
  },
  statCard: {
    background: '#242424',
    borderRadius: '12px',
    border: '1px solid #333',
    padding: '16px',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '24px',
    animation: 'fadeIn 0.2s ease',
  },
  modal: {
    background: '#1e1e1e',
    borderRadius: '20px',
    border: '1px solid #333',
    width: '100%',
    maxWidth: '520px',
    maxHeight: '80vh',
    overflow: 'auto',
    animation: 'slideUp 0.3s ease',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #333',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#f5f5f5',
    margin: 0,
  },
  modalClose: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: '#2a2a2a',
    border: '1px solid #3a3a3a',
    color: '#f5f5f5',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  modalBody: {
    padding: '24px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '12px 0',
    borderBottom: '1px solid #2a2a2a',
  },
  detailLabel: {
    fontSize: '13px',
    color: '#888',
    fontWeight: '500',
    minWidth: '120px',
  },
  detailValue: {
    fontSize: '13px',
    color: '#f5f5f5',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: '12px',
  },
  changeBlock: {
    marginTop: '16px',
    padding: '14px',
    background: '#1a1a1a',
    borderRadius: '10px',
    border: '1px solid #333',
  },
  changeTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#c8a97e',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '10px',
  },
  changeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '6px',
    fontSize: '13px',
  },
  changeFrom: {
    color: '#ef4444',
    textDecoration: 'line-through',
  },
  changeTo: {
    color: '#22c55e',
  },
  changeArrow: {
    color: '#666',
  },
};

const AdminAudit = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    user: '',
    action: '',
    search: '',
  });
  const [selectedEntry, setSelectedEntry] = useState(null);

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
    return d.toLocaleString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const handleExport = () => {
    const csvRows = [
      ['ID', 'Vaqt', 'Foydalanchi', 'Amal', 'Tavsif', 'IP', 'Qurilma'],
      ...filteredLogs.map((l) => [l.id, formatDateTime(l.timestamp), l.user.name, l.action, l.description, l.ipAddress, l.device]),
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

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-hover:hover {
          border-color: #c8a97e44 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(200, 169, 126, 0.1);
        }
        .card-hover { transition: all 0.3s ease; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200, 169, 126, 0.3); }
        .input:focus { border-color: #c8a97e !important; box-shadow: 0 0 0 3px rgba(200, 169, 126, 0.1); }
        .back-btn:hover { background: #3a3a3a !important; }
        .close-btn:hover { background: #3a3a3a !important; }
        .export-btn:hover { box-shadow: 0 6px 20px rgba(200, 169, 126, 0.3); }
        .log-entry:hover {
          border-color: #c8a97e44 !important;
          background: #2a2a2a !important;
        }
        .badge-red { background: rgba(239,68,68,0.12); color: #ef4444; }
        .badge-green { background: rgba(34,197,94,0.12); color: #22c55e; }
        .badge-yellow { background: rgba(234,179,8,0.12); color: #eab308; }
        .badge-blue { background: rgba(59,130,246,0.12); color: #3b82f6; }
      `}</style>

      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button className="back-btn" style={styles.backBtn} onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </button>
          <h1 style={styles.title}>Audit Log</h1>
        </div>
        <button className="export-btn btn-primary" style={styles.exportBtn} onClick={handleExport}>
          <Download size={16} />
          Export CSV
        </button>
      </header>

      <div style={styles.statsRow}>
        {Object.entries(stats).map(([action, count]) => {
          const cfg = actionConfig[action];
          return (
            <div key={action} className="card card-hover" style={styles.statCard}>
              <div style={{ ...styles.statNumber, color: cfg.color }}>{count}</div>
              <div style={styles.statLabel}>{action}</div>
            </div>
          );
        })}
      </div>

      <div className="card card-hover" style={styles.filtersCard}>
        <div style={styles.filtersHeader}>
          <div style={styles.filtersIcon}>
            <Filter size={18} />
          </div>
          <h3 style={styles.filtersTitle}>Filtrlar</h3>
        </div>

        <div style={styles.filtersGrid}>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Dan</label>
            <input
              className="input"
              style={styles.input}
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Gacha</label>
            <input
              className="input"
              style={styles.input}
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Foydalanchi</label>
            <select
              className="input"
              style={styles.input}
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
            >
              <option value="">Barchasi</option>
              {uniqueUsers.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ ...styles.filtersGrid, marginTop: '14px' }}>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Amal turi</label>
            <select
              className="input"
              style={styles.input}
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            >
              <option value="">Barchasi</option>
              {uniqueActions.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div style={{ ...styles.filterGroup, gridColumn: 'span 2' }}>
            <label style={styles.label}>Qidirish</label>
            <div style={styles.searchInputWrapper}>
              <Search size={16} style={styles.searchIcon} />
              <input
                className="input"
                style={{ ...styles.input, paddingLeft: '40px' }}
                placeholder="Tavsif bo'yicha qidirish..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={styles.logList}>
        {filteredLogs.length === 0 ? (
          <div className="card" style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Search size={28} color="#555" />
            </div>
            <p style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#999' }}>Hech narsa topilmadi</p>
            <p style={{ fontSize: '13px', margin: 0 }}>Filtrlarni o'zgartirib ko'ring</p>
          </div>
        ) : (
          filteredLogs.map((log, i) => {
            const cfg = actionConfig[log.action];
            const ActionIcon = cfg.icon;
            return (
              <div
                key={log.id}
                className="card-hover log-entry"
                style={{
                  ...styles.logEntry,
                  animationDelay: `${0.05 + i * 0.03}s`,
                }}
                onClick={() => setSelectedEntry(log)}
              >
                <div style={styles.logEntryInner}>
                  <div style={styles.avatar(roleColors[log.user.role] || '#888')}>
                    {log.user.avatar}
                  </div>
                  <div style={styles.logContent}>
                    <div style={styles.logTop}>
                      <div style={styles.logUser}>
                        <span style={styles.userName}>{log.user.name}</span>
                        <span style={styles.roleBadge(roleColors[log.user.role] || '#888')}>
                          {log.user.role}
                        </span>
                      </div>
                      <div style={styles.timestamp}>
                        <Clock size={12} />
                        <span>{formatDate(log.timestamp)}</span>
                        <span style={{ color: '#555' }}>·</span>
                        <span>{formatTime(log.timestamp)}</span>
                      </div>
                    </div>
                    <p style={styles.logDescription}>{log.description}</p>
                    <div style={styles.logMeta}>
                      <div style={styles.actionBadge(cfg)}>
                        <ActionIcon size={12} />
                        {log.action}
                      </div>
                      <div style={styles.metaItem}>
                        <Globe size={12} />
                        <span>{log.ipAddress}</span>
                      </div>
                      <div style={styles.metaItem}>
                        {isMobile(log.device) ? <Smartphone size={12} /> : <Monitor size={12} />}
                        <span>{log.device}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedEntry && (
        <div style={styles.modalOverlay} onClick={() => setSelectedEntry(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Kirish tafsilotlari</h2>
              <button
                className="close-btn"
                style={styles.modalClose}
                onClick={() => setSelectedEntry(null)}
              >
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>ID</span>
                <span style={styles.detailValue}>#{selectedEntry.id}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Vaqt</span>
                <span style={styles.detailValue}>{formatDateTime(selectedEntry.timestamp)}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Foydalanchi</span>
                <span style={styles.detailValue}>
                  {selectedEntry.user.name}
                  <span style={styles.roleBadge(roleColors[selectedEntry.user.role] || '#888')}>
                    {selectedEntry.user.role}
                  </span>
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Amal</span>
                <span style={styles.detailValue}>
                  <span style={styles.actionBadge(actionConfig[selectedEntry.action])}>
                    {React.createElement(actionConfig[selectedEntry.action].icon, { size: 12 })}
                    {selectedEntry.action}
                  </span>
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Tavsif</span>
                <span style={styles.detailValue}>{selectedEntry.description}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>IP manzil</span>
                <span style={styles.detailValue}>{selectedEntry.ipAddress}</span>
              </div>
              <div style={{ ...styles.detailRow, borderBottom: 'none' }}>
                <span style={styles.detailLabel}>Qurilma</span>
                <span style={styles.detailValue}>
                  {isMobile(selectedEntry.device) ? <Smartphone size={13} /> : <Monitor size={13} />}
                  {' '}{selectedEntry.device}
                </span>
              </div>

              {selectedEntry.details && (selectedEntry.details.oldValue || selectedEntry.details.newValue) && (
                <div style={styles.changeBlock}>
                  <div style={styles.changeTitle}>O'zgarishlar</div>
                  <div style={styles.changeRow}>
                    <span style={styles.changeFrom}>{selectedEntry.details.oldValue || '—'}</span>
                    <span style={styles.changeArrow}>→</span>
                    <span style={styles.changeTo}>{selectedEntry.details.newValue || '—'}</span>
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
