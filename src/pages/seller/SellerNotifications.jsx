import useStore from '../../store/useStore';
import { Bell, BellRing, CheckCheck, Check, ShoppingBag, Bike, AlertTriangle, Trash2 } from 'lucide-react';

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

export default function SellerNotifications() {
  const { sellerNotifications, markSellerNotifRead, clearSellerNotifs } = useStore();

  const unread = sellerNotifications.filter((n) => !n.isRead).length;

  return (
    <div style={{ padding: '20px 16px 32px', background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>Bildirishnomalar</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{unread} ta o'qilmagan</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {unread > 0 && (
              <button onClick={() => sellerNotifications.forEach((n) => !n.isRead && markSellerNotifRead(n.id))} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                <Check size={14} /> Hammasini o'qilgan deb belgilash
              </button>
            )}
            {sellerNotifications.length > 0 && (
              <button onClick={clearSellerNotifs} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', color: 'var(--danger)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                <Trash2 size={14} /> Tozalash
              </button>
            )}
          </div>
        </div>

        {sellerNotifications.length === 0 ? (
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
              const color = n.type === 'order' ? '#EF4444' : n.type === 'success' ? '#22C55E' : n.type === 'warning' ? '#F59E0B' : n.type === 'delivery' ? '#3B82F6' : 'var(--primary)';
              const bg = n.type === 'order' ? '#FEF2F2' : n.type === 'success' ? '#F0FDF4' : n.type === 'warning' ? '#FFFBEB' : n.type === 'delivery' ? '#EFF6FF' : 'var(--primary-light)';
              return (
                <div key={n.id} onClick={() => markSellerNotifRead(n.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, background: n.isRead ? 'var(--surface)' : bg, border: '1px solid ' + (n.isRead ? 'var(--border)' : `${color}20`), cursor: 'pointer', transition: 'all .15s' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: n.isRead ? 500 : 700, color: 'var(--text)' }}>{n.title}</span>
                      {!n.isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />}
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{n.message}</p>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{formatTime(n.time)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
