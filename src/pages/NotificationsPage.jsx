import { Bell } from 'lucide-react';
import useStore from '../store/useStore';

export default function NotificationsPage() {
  const { notifications, markNotifRead, clearNotifs } = useStore();

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="p-4 flex items-center justify-between">
        <h1 className="heading">Bildirishnomalar</h1>
        {notifications.length > 0 && (
          <button onClick={clearNotifs} style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>Tozalash</button>
        )}
      </div>

      <div className="p-4 space-y-2">
        {notifications.length === 0 && (
          <div className="empty-state py-16">
            <div className="empty-state-icon"><Bell size={24} /></div>
            <h3 className="heading">Bildirishnoma yo'q</h3>
            <p className="body">Yangiliklar va buyurtma holati haqida xabarlar keladi</p>
          </div>
        )}

        {notifications.map((n) => (
          <button key={n.id} onClick={() => markNotifRead(n.id)} className="w-full text-left card p-4" style={{ cursor: 'pointer', borderColor: !n.isRead ? 'rgba(249,115,22,.2)' : undefined }}>
            <div className="flex items-start" style={{ gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: n.type === 'order' ? 'var(--primary-light)' : 'var(--warning-light)', color: n.type === 'order' ? 'var(--primary)' : 'var(--warning)' }}>
                <Bell size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ color: 'var(--text)', fontSize: 14, fontWeight: !n.isRead ? 600 : 400 }}>{n.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{n.message}</p>
                <p className="caption" style={{ marginTop: 4 }}>{new Date(n.time).toLocaleDateString()}</p>
              </div>
              {!n.isRead && <div style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', flexShrink: 0, marginTop: 8, background: 'var(--primary)' }} />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
