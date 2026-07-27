import { useNavigate } from 'react-router-dom';
import { Building2, Users, BarChart3, ClipboardList, LogOut } from 'lucide-react';
import useStore from '../../store/useStore';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { orders, branches, employees, user, logout } = useStore();
  const todaySales = orders.filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const totalRevenue = todaySales.reduce((s, o) => s + o.total, 0);

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4 flex items-center justify-between">
        <h1 className="heading">Admin paneli</h1>
        <button onClick={() => logout()} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <LogOut size={16} color="#6b6b6b" />
        </button>
      </div>
      <div className="p-4">
        <p style={{ color: '#6b6b6b', fontSize: 12, marginBottom: 16 }}>Xush kelibsiz, {user?.name || 'Admin'}</p>

        <div className="card p-4" style={{ marginBottom: 16 }}>
          <p style={{ color: '#6b6b6b', fontSize: 12 }}>Bugungi savdo</p>
          <p style={{ fontFamily: 'var(--font-display)', color: '#e51e1e', fontSize: 30, fontWeight: 600, marginTop: 4 }}>
            {totalRevenue.toLocaleString()} so'm
          </p>
          <p style={{ color: '#6b6b6b', fontSize: 12, marginTop: 4 }}>{todaySales.length} ta buyurtma</p>
        </div>

        <div className="grid grid-cols-2" style={{ gap: 12 }}>
          <button onClick={() => navigate('/admin/branches')} className="card p-4 text-left" style={{ cursor: 'pointer' }}>
            <Building2 size={20} color="#e51e1e" />
            <p style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 18, fontWeight: 600, marginTop: 8 }}>{branches.length}</p>
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Filiallar</p>
          </button>
          <button onClick={() => navigate('/admin/employees')} className="card p-4 text-left" style={{ cursor: 'pointer' }}>
            <Users size={20} color="#e51e1e" />
            <p style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 18, fontWeight: 600, marginTop: 8 }}>{employees.length}</p>
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Xodimlar</p>
          </button>
          <button onClick={() => navigate('/admin/statistics')} className="card p-4 text-left" style={{ cursor: 'pointer' }}>
            <BarChart3 size={20} color="#e51e1e" />
            <p style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 18, fontWeight: 600, marginTop: 8 }}>Statistika</p>
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Savdo va foyda</p>
          </button>
          <button onClick={() => navigate('/admin/orders')} className="card p-4 text-left" style={{ cursor: 'pointer' }}>
            <ClipboardList size={20} color="#e51e1e" />
            <p style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 18, fontWeight: 600, marginTop: 8 }}>{orders.length}</p>
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Buyurtmalar</p>
          </button>
        </div>
      </div>
    </div>
  );
}
