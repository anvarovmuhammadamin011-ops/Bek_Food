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
        <button onClick={() => setShowForm(!showForm)} className="flex items-center" style={{ gap: 4, color: 'var(--primary)', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
          <Plus size={14} /> Yangi
        </button>
      </div>

      <div className="p-4 space-y-3">
        {showForm && (
          <div className="card p-4 animate-slide-down space-y-3">
            <textarea value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="To'liq manzil..."
              className="input resize-none" style={{ minHeight: 64 }} />
            <button className="btn btn-primary btn-sm w-full">Saqlash</button>
          </div>
        )}

        {addresses.length === 0 && (
          <div className="empty-state py-16">
            <div className="empty-state-icon"><MapPin size={24} /></div>
            <h3 className="heading">Manzil yo'q</h3>
            <p className="body">Yetkazib berish manzilini qo'shing</p>
          </div>
        )}

        {addresses.map((addr) => (
          <div key={addr.id} className="card p-4 flex items-start" style={{ gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: addr.isDefault ? 'var(--primary-light)' : 'var(--surface-active)', color: addr.isDefault ? 'var(--primary)' : 'var(--text-muted)' }}>
              <MapPin size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex items-center" style={{ gap: 8 }}>
                <span style={{ color: 'var(--text)', fontSize: 14, fontWeight: 500 }}>{addr.label}</span>
                {addr.isDefault && <span className="badge badge-primary" style={{ padding: '2px 8px', fontSize: 10 }}>Asosiy</span>}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 3 }}>{addr.fullAddress}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
