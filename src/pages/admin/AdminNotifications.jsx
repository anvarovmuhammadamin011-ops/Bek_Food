import { useState } from 'react';
import useStore from '../../store/useStore';
import { formatDate } from '../../lib/format';
import { CheckSquare, Square, Bell } from 'lucide-react';

export default function AdminNotifications() {
  const notifications = useStore((s) => s.notifications || []);
  const { markNotifRead, clearNotifs } = useStore();
  const [showUnread, setShowUnread] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const list = showUnread ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="admin-notifications">
      <div className="flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Eslatmalar ({unreadCount} o'qilmagan)</h2>
        <div className="flex gap-2" style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => setShowUnread((v) => !v)} className="btn btn-sm" style={{ fontSize: 12 }}>{showUnread ? 'Hammasini ko\'r' : 'Fa qosiq'}</button>
          <button type="button" onClick={() => clearNotifs()} className="btn btn-sm btn-secondary" style={{ fontSize: 12 }}>Tozalash</button>
        </div>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {list.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-dim)' }}>Eslatma yo'q</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {list.map((n) => (
              <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <button type="button" onClick={() => markNotifRead(n.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: n.isRead ? 'var(--text-dim)' : 'var(--primary)' }}>
                  {n.isRead ? <Square size={16} /> : <CheckSquare size={16} />}
                </button>
                <Bell size={16} color={n.isRead ? 'var(--text-dim)' : 'var(--primary)'} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{formatDate(n.time || n.createdAt)}</div>
                </div>
                {!n.isRead && <span className="badge badge-primary" style={{ fontSize: 9 }}>NEW</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
