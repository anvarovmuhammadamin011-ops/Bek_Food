import useStore from '../../store/useStore';
import { CheckCircle, XCircle } from 'lucide-react';

export default function SellerOrders() {
  const { orders, updateOrderStatus } = useStore();
  const pending = orders.filter((o) => ['pending', 'preparing'].includes(o.status));

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4">
        <h1 className="heading">Buyurtmalar</h1>
      </div>
      <div className="p-4 space-y-3">
        {pending.length === 0 && (
          <div className="empty-state py-16">
            <p style={{ color: '#6b6b6b' }}>Yangi buyurtmalar yo'q</p>
          </div>
        )}
        {pending.map((o) => (
          <div key={o.id} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>Buyurtma #{String(o.id).slice(-4)}</p>
                <p style={{ color: '#6b6b6b', fontSize: 12 }}>{new Date(o.createdAt).toLocaleTimeString()}</p>
              </div>
              <span className={`badge ${o.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>{o.status === 'pending' ? 'Yangi' : 'Tayyorlanmoqda'}</span>
            </div>
            <div className="space-y-1 mb-3">
              {o.items.map((item) => (
                <div key={item.id} className="flex justify-between" style={{ fontSize: 12 }}>
                  <span style={{ color: '#6b6b6b' }}>{item.quantity}x {item.food.name}</span>
                  <span style={{ color: '#fff' }}>{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <p style={{ color: '#6b6b6b', fontSize: 12, marginBottom: 12 }}>Manzil: {o.address}</p>
            <div className="flex gap-2">
              {o.status === 'pending' && (
                <button onClick={() => updateOrderStatus(o.id, 'preparing')} className="btn btn-primary btn-sm flex-1" style={{ borderRadius: 8 }}>
                  <CheckCircle size={14} /> Qabul qilish
                </button>
              )}
              {o.status === 'preparing' && (
                <button onClick={() => updateOrderStatus(o.id, 'ready')} className="btn btn-primary btn-sm flex-1" style={{ borderRadius: 8 }}>
                  <CheckCircle size={14} /> Tayyor
                </button>
              )}
              <button onClick={() => updateOrderStatus(o.id, 'cancelled')} className="btn btn-secondary btn-sm" style={{ borderRadius: 8 }}>
                <XCircle size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
