import { Bell } from 'lucide-react';
import useStore from '../store/useStore';

export default function NotificationsPage() {
  const { notifications, markNotifRead, clearNotifs } = useStore();

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="p-4 flex items-center justify-between">
        <h1 className="heading">Bildirishnomalar</h1>
        {notifications.length > 0 && (
          <button onClick={clearNotifs} style={{ color: '#e51e1e', fontSize: 12, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>Tozalash</button>
        )}
      </div>

      <div className="p-4 space-y-2">
        {notifications.length === 0 && (
          <div className="empty-state py-16">
            <div className="empty-state-icon">
              <Bell size={20} />
            </div>
            <h3 style={{ color: '#fff', fontWeight: 500, marginBottom: 4 }}>Bildirishnoma yo'q</h3>
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Yangiliklar va buyurtma holati haqida xabarlar keladi</p>
          </div>
        )}

        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => markNotifRead(n.id)}
            className="w-full text-left card p-4"
            style={{ cursor: 'pointer', borderColor: !n.isRead ? 'rgba(229,30,30,.3)' : undefined }}
          >
            <div className="flex items-start gap-3">
              <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: n.type === 'order' ? 'rgba(229,30,30,.15)' : 'rgba(234,179,8,.15)', color: n.type === 'order' ? '#e51e1e' : '#eab308' }}>
                <Bell size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ color: '#fff', fontSize: 14, fontWeight: !n.isRead ? 500 : 400 }}>{n.title}</h4>
                <p style={{ color: '#6b6b6b', fontSize: 12, marginTop: 2 }}>{n.message}</p>
                <p style={{ color: '#6b6b6b', fontSize: 10, marginTop: 4 }}>{new Date(n.time).toLocaleDateString()}</p>
              </div>
              {!n.isRead && <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 8, background: '#e51e1e' }} />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
