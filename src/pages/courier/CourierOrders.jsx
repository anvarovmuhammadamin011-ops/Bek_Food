import { CheckCircle } from 'lucide-react';
import useStore from '../../store/useStore';

export default function CourierOrders() {
  const { orders, updateOrderStatus } = useStore();
  const readyOrders = orders.filter((o) => o.status === 'ready' || o.status === 'onTheWay');

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4">
        <h1 className="heading">Yetkazish</h1>
      </div>
      <div className="p-4 space-y-3">
        {readyOrders.length === 0 && (
          <div className="empty-state py-16">
            <p style={{ color: '#6b6b6b' }}>Yetkazish uchun buyurtmalar yo'q</p>
          </div>
        )}
        {readyOrders.map((o) => (
          <div key={o.id} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p style={{ color: '#fff', fontWeight: 500 }}>Buyurtma #{String(o.id).slice(-4)}</p>
                <p style={{ color: '#6b6b6b', fontSize: 12 }}>Manzil: {o.address}</p>
              </div>
              <span className="price-sm">{o.total.toLocaleString()} so'm</span>
            </div>
            <div style={{ fontSize: 12, color: '#6b6b6b', marginBottom: 12 }}>
              {o.items.map((item) => (
                <p key={item.id}>{item.quantity}x {item.food.name}</p>
              ))}
              {o.paymentMethod === 'cash' && <p style={{ color: '#e51e1e', marginTop: 4, fontWeight: 500 }}>Naqd: {o.total.toLocaleString()} so'm</p>}
            </div>
            <div className="flex gap-2">
              {o.status === 'ready' && (
                <button onClick={() => updateOrderStatus(o.id, 'onTheWay')} className="btn btn-primary btn-sm flex-1" style={{ borderRadius: 8 }}>
                  Yo'lga chiqish
                </button>
              )}
              {o.status === 'onTheWay' && (
                <button onClick={() => updateOrderStatus(o.id, 'delivered')} className="btn btn-primary btn-sm flex-1" style={{ borderRadius: 8 }}>
                  <CheckCircle size={14} /> Yetkazildi
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
