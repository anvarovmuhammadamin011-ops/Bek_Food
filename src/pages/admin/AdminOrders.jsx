import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import useStore from '../../store/useStore';

export default function AdminOrders() {
  const { orders } = useStore();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4">
        <h1 className="heading" style={{ marginBottom: 12 }}>Barcha buyurtmalar</h1>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide" style={{ paddingBottom: 2 }}>
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'pending', label: 'Kutilmoqda' },
            { id: 'preparing', label: 'Tayyorlanmoqda' },
            { id: 'ready', label: 'Tayyor' },
            { id: 'onTheWay', label: "Yo'lda" },
            { id: 'delivered', label: 'Yetkazilgan' },
          ].map((t) => (
            <button key={t.id} onClick={() => setFilter(t.id)} className="whitespace-nowrap"
              style={{
                padding: '6px 12px', borderRadius: 16, fontSize: 11, fontWeight: 500, cursor: 'pointer', transition: 'all .15s',
                background: filter === t.id ? '#e51e1e' : '#141414',
                border: `1px solid ${filter === t.id ? '#e51e1e' : 'rgba(255,255,255,0.08)'}`,
                color: filter === t.id ? '#fff' : '#b8b8b8'
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 space-y-3">
        {filtered.length === 0 && (
          <div className="empty-state py-16">
            <div className="empty-state-icon"><ClipboardList size={20} /></div>
            <h3 style={{ color: '#fff', fontWeight: 500, marginBottom: 4 }}>Buyurtmalar yo'q</h3>
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Filtrlashni o'zgartiring</p>
          </div>
        )}
        {filtered.map((o) => (
          <div key={o.id} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p style={{ color: '#fff', fontWeight: 500 }}>Buyurtma #{String(o.id).slice(-4)}</p>
                <p style={{ color: '#6b6b6b', fontSize: 12 }}>{new Date(o.createdAt).toLocaleString()}</p>
              </div>
              <span className={`badge text-xs ${
                o.status === 'delivered' ? 'badge-green' : o.status === 'cancelled' ? 'badge-red' : 'badge-yellow'
              }`}>{o.status}</span>
            </div>
            <p style={{ color: '#6b6b6b', fontSize: 12, marginBottom: 8 }}>Manzil: {o.address} | To'lov: {o.paymentMethod === 'cash' ? 'Naqd' : 'Karta'}</p>
            <div className="space-y-1 mb-2">
              {o.items.map((item) => (
                <div key={item.id} className="flex justify-between" style={{ fontSize: 12 }}>
                  <span style={{ color: '#6b6b6b' }}>{item.quantity}x {item.food.name}</span>
                  <span style={{ color: '#fff' }}>{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between" style={{ fontWeight: 500, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: '#fff' }}>Jami</span>
              <span className="price">{o.total.toLocaleString()} so'm</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
