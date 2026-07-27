import { useNavigate } from 'react-router-dom';
import { Bike, Package, CheckCircle, LogOut } from 'lucide-react';
import useStore from '../../store/useStore';

export default function CourierDashboard() {
  const navigate = useNavigate();
  const { orders, user, logout } = useStore();
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const deliveredToday = orders.filter((o) => o.status === 'delivered' && new Date(o.createdAt).toDateString() === new Date().toDateString());

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4 flex items-center justify-between">
        <h1 className="heading">Kuryer paneli</h1>
        <button onClick={() => logout()} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <LogOut size={16} color="#6b6b6b" />
        </button>
      </div>
      <div className="p-4">
        <p style={{ color: '#6b6b6b', fontSize: 12, marginBottom: 16 }}>Xush kelibsiz, {user?.name || 'Kuryer'}</p>
        <div className="grid grid-cols-2" style={{ gap: 12 }}>
          <button onClick={() => navigate('/courier/orders')} className="card p-5 text-left" style={{ cursor: 'pointer' }}>
            <Package size={24} color="#e51e1e" />
            <p style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 24, fontWeight: 600, marginTop: 8 }}>{readyOrders.length}</p>
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Tayyor buyurtmalar</p>
          </button>
          <div className="card p-5">
            <CheckCircle size={24} color="#7fbf7f" />
            <p style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 24, fontWeight: 600, marginTop: 8 }}>{deliveredToday.length}</p>
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Bugun yetkazilgan</p>
          </div>
        </div>

        {readyOrders.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Yetkazishga tayyor</h3>
            <div className="space-y-3">
              {readyOrders.slice(0, 3).map((o) => (
                <div key={o.id} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p style={{ color: '#fff', fontWeight: 500 }}>#{String(o.id).slice(-4)}</p>
                      <p style={{ color: '#6b6b6b', fontSize: 12, marginTop: 2 }}>{o.address}</p>
                      <p style={{ color: '#6b6b6b', fontSize: 12 }}>{o.items.length} ta mahsulot</p>
                    </div>
                    <span className="price-sm">{o.total.toLocaleString()} so'm</span>
                  </div>
                  <button onClick={() => navigate('/courier/orders')} className="btn btn-primary btn-sm w-full" style={{ marginTop: 12, borderRadius: 8 }}>
                    <Bike size={14} /> Yo'lga chiqish
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
