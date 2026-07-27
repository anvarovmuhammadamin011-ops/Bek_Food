import { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import useStore from '../store/useStore';

export default function AddressesPage() {
  const { addresses } = useStore();
  const [newAddress, setNewAddress] = useState('');
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="p-4 flex items-center justify-between">
        <h1 className="heading">Manzillarim</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1" style={{ color: '#e51e1e', fontSize: 12, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
          <Plus size={14} /> Yangi
        </button>
      </div>

      <div className="p-4 space-y-3">
        {showForm && (
          <div className="card p-4 animate-slide-down space-y-3">
            <textarea value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="To'liq manzil..."
              className="input" style={{ minHeight: 64 }} />
            <button className="btn btn-primary w-full btn-sm" style={{ borderRadius: 10 }}>Saqlash</button>
          </div>
        )}

        {addresses.length === 0 && (
          <div className="empty-state py-16">
            <div className="empty-state-icon">
              <MapPin size={20} />
            </div>
            <h3 style={{ color: '#fff', fontWeight: 500, marginBottom: 4 }}>Manzil yo'q</h3>
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Yetkazib berish manzilini qo'shing</p>
          </div>
        )}

        {addresses.map((addr) => (
          <div key={addr.id} className="card p-4 flex items-start gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: addr.isDefault ? 'rgba(229,30,30,.15)' : '#141414', color: addr.isDefault ? '#e51e1e' : '#6b6b6b' }}>
              <MapPin size={16} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{addr.label}</span>
                {addr.isDefault && <span className="badge badge-red" style={{ fontSize: 10, padding: '2px 6px' }}>Asosiy</span>}
              </div>
              <p style={{ color: '#6b6b6b', fontSize: 12, marginTop: 2 }}>{addr.fullAddress}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
