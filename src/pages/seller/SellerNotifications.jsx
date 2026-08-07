import useStore from '../../store/useStore';
import { Bell, BellRing, CheckCheck, Check, Bike, AlertTriangle, Trash2 } from 'lucide-react';

const formatTime = (t) => {
  const d = new Date(t);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'Hozirgina';
  if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
  return d.toLocaleString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const NOTIF_ICON = {
  order: BellRing,
  success: CheckCheck,
  warning: AlertTriangle,
  delivery: Bike,
  info: Bell,
};

const NOTIF_COLORS = {
  order: { color: '#EF4444', bg: '#FEF2F2' },
  success: { color: '#22C55E', bg: '#F0FDF4' },
  warning: { color: '#F59E0B', bg: '#FFFBEB' },
  delivery: { color: '#3B82F6', bg: '#EFF6FF' },
  info: { color: 'var(--primary)', bg: 'var(--primary-light)' },
};

export default function SellerNotifications() {
  const { sellerNotifications, markSellerNotifRead, clearSellerNotifs, isAppLoading } = useStore();
  const unread = sellerNotifications.filter((n) => !n.isRead).length;

  return (
    <div style={{ padding: '16px 16px 32px', background: 'var(--bg)', minHeight: '100%' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', margin: '0 0 2px 0', letterSpacing: '-0.5px' }}>Bildirishnomalar</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{unread} ta o'qilmagan</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {unread > 0 && (
              <button onClick={() => sellerNotifications.forEach((n) => !n.isRead && markSellerNotifRead(n.id))}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', minHeight: 40 }}>
                <Check size={14} /> <span className="sn-btn-label">O'qilgan</span>
              </button>
            )}
            {sellerNotifications.length > 0 && (
              <button onClick={clearSellerNotifs}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', color: 'var(--danger)', fontSize: 12, fontWeight: 600, cursor: 'pointer', minHeight: 40 }}>
                <Trash2 size={14} /> Tozalash
              </button>
            )}
          </div>
        </div>

        {isAppLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 'var(--radius-sm)' }} />)}
          </div>
        ) : sellerNotifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--surface-active)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Bell size={28} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>Bildirishnomalar yo'q</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Yangi bildirishnomalar shu yerda ko'rinadi</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {sellerNotifications.map((n) => {
              const Icon = NOTIF_ICON[n.type] || Bell;
              const colors = NOTIF_COLORS[n.type] || NOTIF_COLORS.info;
              return (
                <div key={n.id} onClick={() => markSellerNotifRead(n.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px', borderRadius: 'var(--radius-sm)', background: n.isRead ? 'var(--surface)' : colors.bg, border: '1px solid ' + (n.isRead ? 'var(--border)' : `${colors.color}20`), cursor: 'pointer', transition: 'all .15s' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                    <Icon size={18} style={{ color: colors.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: n.isRead ? 500 : 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</span>
                      {!n.isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors.color, flexShrink: 0 }} />}
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.message}</p>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>{formatTime(n.time)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
