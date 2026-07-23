import { useState } from 'react';
import { MapPin, Plus, Trash2, Check, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

export default function AddressesPage() {
  const navigate = useNavigate();
  const { addresses, addAddress, removeAddress, setDefaultAddress } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const handleAdd = () => {
    if (!newAddress) return;
    addAddress({ label: newLabel || 'Other', fullAddress: newAddress, latitude: 41.3, longitude: 69.27, isDefault: addresses.length === 0 });
    setNewLabel('');
    setNewAddress('');
    setShowAdd(false);
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-24">
      <div className="p-4 glass-strong sticky top-0 z-30">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl bg-bg-card active:scale-95 transition-transform">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">My Addresses</h1>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-3">
        {addresses.map(addr => (
          <div key={addr.id} className={`bg-bg-card rounded-2xl p-4 border transition-all ${addr.isDefault ? 'border-accent-orange/40' : 'border-border'} animate-slide-up`}>
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl ${addr.isDefault ? 'bg-accent-orange/15 text-accent-orange' : 'bg-bg-primary text-text-muted'}`}>
                <MapPin size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{addr.label}</span>
                  {addr.isDefault && <span className="px-2 py-0.5 rounded-md bg-accent-orange/15 text-accent-orange text-[10px] font-semibold">Default</span>}
                </div>
                <p className="text-text-secondary text-xs mt-1">{addr.fullAddress}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 ml-11">
              {!addr.isDefault && (
                <button onClick={() => setDefaultAddress(addr.id)} className="text-accent-orange text-[11px] font-medium">Set Default</button>
              )}
              <button onClick={() => removeAddress(addr.id)} className="text-accent-red text-[11px] font-medium ml-auto flex items-center gap-1">
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>
        ))}

        {showAdd ? (
          <div className="bg-bg-card rounded-2xl p-4 border border-accent-orange/40 space-y-3 animate-slide-up">
            <h3 className="text-sm font-semibold">New Address</h3>
            <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Label (Home, Work...)"
              className="w-full bg-bg-primary border border-border rounded-xl py-3 px-3 text-sm focus:border-accent-orange focus:outline-none transition-colors placeholder:text-text-muted" />
            <textarea value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="Full address..."
              className="w-full bg-bg-primary border border-border rounded-xl p-3 text-sm focus:border-accent-orange focus:outline-none transition-colors placeholder:text-text-muted resize-none h-20" />
            <button className="w-full p-3 rounded-xl border border-dashed border-accent-orange/40 text-accent-orange text-xs font-medium text-center flex items-center justify-center gap-2">
              <MapPin size={14} /> Pick on Map
            </button>
            <div className="flex gap-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl bg-bg-primary text-text-secondary text-sm font-medium">Cancel</button>
              <button onClick={handleAdd} className="flex-1 btn-primary text-sm flex items-center justify-center gap-1"><Check size={14} /> Save</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAdd(true)} className="w-full py-4 rounded-2xl border-2 border-dashed border-border text-text-secondary text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
            <Plus size={18} /> Add New Address
          </button>
        )}
      </div>
    </div>
  );
}
