import { useState } from 'react';
import { Users, Plus, Mail, Trash2 } from 'lucide-react';
import useStore from '../../store/useStore';

export default function AdminEmployees() {
  const { employees, addEmployee, removeEmployee } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('seller');

  const handleAdd = () => {
    if (!email) return;
    addEmployee({ email, role, name: email.split('@')[0] });
    setEmail('');
    setShowForm(false);
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4 flex items-center justify-between">
        <h1 className="heading">Xodimlar</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1" style={{ color: '#e51e1e', fontSize: 14, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
          <Plus size={14} /> Yangi
        </button>
      </div>
      <div className="p-4 space-y-3">
        {showForm && (
          <div className="card p-4 space-y-3 animate-slide-down">
            <div className="input-group">
              <Mail size={16} className="input-group-icon" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Google email" className="input" style={{ paddingLeft: 38 }} />
            </div>
            <div className="flex gap-2">
              {[
                { id: 'seller', label: 'Sotuvchi' },
                { id: 'courier', label: 'Kuryer' },
                { id: 'admin', label: 'Admin' },
              ].map((r) => (
                <button key={r.id} onClick={() => setRole(r.id)}
                  className="flex-1" style={{
                    padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all .15s',
                    background: role === r.id ? 'rgba(229,30,30,.15)' : '#141414',
                    border: `1px solid ${role === r.id ? 'rgba(229,30,30,.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: role === r.id ? '#e51e1e' : '#6b6b6b'
                  }}>
                  {r.label}
                </button>
              ))}
            </div>
            <button onClick={handleAdd} className="btn btn-primary btn-sm w-full" style={{ borderRadius: 8 }}>Qo'shish</button>
          </div>
        )}

        {employees.length === 0 && (
          <div className="empty-state py-16">
            <div className="empty-state-icon"><Users size={20} /></div>
            <h3 style={{ color: '#fff', fontWeight: 500, marginBottom: 4 }}>Xodimlar yo'q</h3>
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Email orqali xodim qo'shing</p>
          </div>
        )}

        {employees.map((emp) => (
          <div key={emp.id} className="card p-4 flex items-center justify-between">
            <div>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{emp.name}</p>
              <p style={{ color: '#6b6b6b', fontSize: 12 }}>{emp.email}</p>
              <span className="badge badge-red" style={{ fontSize: 10, marginTop: 4 }}>{emp.role === 'seller' ? 'Sotuvchi' : emp.role === 'courier' ? 'Kuryer' : 'Admin'}</span>
            </div>
            <button onClick={() => removeEmployee(emp.id)} style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#6b6b6b' }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
