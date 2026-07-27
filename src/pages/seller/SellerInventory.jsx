import { useState } from 'react';
import { Package, Plus } from 'lucide-react';
import useStore from '../../store/useStore';

export default function SellerInventory() {
  const { inventory, addInventory, foods } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ productId: '', quantity: '', cost: '' });

  const handleAdd = () => {
    if (!form.productId || !form.quantity || !form.cost) return;
    addInventory({
      productId: Number(form.productId),
      productName: foods.find((f) => f.id === Number(form.productId))?.name || '',
      quantity: Number(form.quantity),
      cost: Number(form.cost),
      date: new Date().toISOString(),
    });
    setForm({ productId: '', quantity: '', cost: '' });
    setShowForm(false);
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4 flex items-center justify-between">
        <h1 className="heading">Ombor</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1" style={{ color: '#e51e1e', fontSize: 14, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
          <Plus size={14} /> Kirim
        </button>
      </div>
      <div className="p-4 space-y-3">
        {showForm && (
          <div className="card p-4 space-y-3 animate-slide-down">
            <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className="input" style={{ background: '#141414' }}>
              <option value="">Mahsulot tanlang</option>
              {foods.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="Miqdor" className="input" />
            <input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} placeholder="Tannarx (so'm)" className="input" />
            <button onClick={handleAdd} className="btn btn-primary btn-sm w-full" style={{ borderRadius: 8 }}>Saqlash</button>
          </div>
        )}

        {inventory.length === 0 && (
          <div className="empty-state py-16">
            <div className="empty-state-icon"><Package size={20} /></div>
            <h3 style={{ color: '#fff', fontWeight: 500, marginBottom: 4 }}>Ombor bo'sh</h3>
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Mahsulot kirimini qo'shing</p>
          </div>
        )}
        {inventory.map((entry) => (
          <div key={entry.id} className="card p-3 flex items-center justify-between">
            <div>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{entry.productName}</p>
              <p style={{ color: '#6b6b6b', fontSize: 12 }}>{entry.quantity} ta · {entry.cost.toLocaleString()} so'm</p>
            </div>
            <p className="price-sm">{(entry.cost / entry.quantity).toLocaleString()} so'm/dona</p>
          </div>
        ))}
      </div>
    </div>
  );
}
