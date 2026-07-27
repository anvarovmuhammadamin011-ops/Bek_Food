import { useState } from 'react';
import { Plus, MapPin, Clock, Phone } from 'lucide-react';
import useStore from '../../store/useStore';

export default function AdminBranches() {
  const { branches, addBranch } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', phone: '', workingHours: '' });

  const handleAdd = () => {
    if (!form.name) return;
    addBranch({ ...form, coverImage: '', logo: '', cuisine: 'Fastfood', rating: 0, deliveryTime: 0, distance: '', minOrder: 0, isOpen: true, coordinates: {} });
    setForm({ name: '', address: '', phone: '', workingHours: '' });
    setShowForm(false);
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4 flex items-center justify-between">
        <h1 className="heading">Filiallar</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1" style={{ color: '#e51e1e', fontSize: 14, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
          <Plus size={14} /> Yangi
        </button>
      </div>
      <div className="p-4 space-y-3">
        {showForm && (
          <div className="card p-4 space-y-3 animate-slide-down">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Filial nomi" className="input" />
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Manzil" className="input" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Telefon" className="input" />
            <input value={form.workingHours} onChange={(e) => setForm({ ...form, workingHours: e.target.value })} placeholder="Ish vaqti (10:00 - 23:00)" className="input" />
            <button onClick={handleAdd} className="btn btn-primary btn-sm w-full" style={{ borderRadius: 8 }}>Qo'shish</button>
          </div>
        )}

        {branches.map((b) => (
          <div key={b.id} className="card p-4">
            <h3 style={{ color: '#fff', fontWeight: 500 }}>{b.name}</h3>
            <div className="flex flex-wrap gap-3 mt-2" style={{ fontSize: 12, color: '#6b6b6b' }}>
              <span className="flex items-center gap-1"><MapPin size={12} /> {b.address}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {b.workingHours}</span>
              <span className="flex items-center gap-1"><Phone size={12} /> {b.phone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
