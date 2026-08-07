import { useState } from 'react';
import useStore from '../../store/useStore';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const settings = useStore((s) => s.settings) || {};
  const { updateSettings } = useStore();
  const [local, setLocal] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const pm = (local.paymentMethods || {});
  return (
    <div className="admin-settings" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Sozlamalar</h2>
        <button type="button" onClick={handleSave} className="btn btn-sm btn-primary" style={{ fontSize: 12 }}><Save size={14} /> Saqlash {saved && <span style={{ color: 'var(--success-light)' }}>✓</span>}</button>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Do'kon ma'lumotlari</h3>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Nomi" value={local.name} onChange={(v) => setLocal({ ...local, name: v })} />
          <Field label="Telefon" value={local.phone} onChange={(v) => setLocal({ ...local, phone: v })} />
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Manzil" value={local.address} onChange={(v) => setLocal({ ...local, address: v })} />
          </div>
          <Field label="Ochish vaqti" value={local.openTime} onChange={(v) => setLocal({ ...local, openTime: v })} />
          <Field label="Yopilish vaqti" value={local.closeTime} onChange={(v) => setLocal({ ...local, closeTime: v })} />
          <Field label="Minimum buyurtma" value={local.minOrder} onChange={(v) => setLocal({ ...local, minOrder: Number(v) || 0 })} />
          <Field label="Yetkazish fee" value={local.deliveryFee} onChange={(v) => setLocal({ ...local, deliveryFee: Number(v) || 0 })} />
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>To'lov usloblari</h3>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {Object.entries(pm).map(([k, v]) => (
            <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <input type="checkbox" checked={!!v} onChange={(e) => setLocal({ ...local, paymentMethods: { ...pm, [k]: e.target.checked } })} />
              {k === 'cash' ? 'Naqt' : k === 'card' ? 'Karta' : k === 'click' ? 'Click' : k === 'payme' ? 'Payme' : k}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>{label}</label>
      <input type={type} className="input" value={value === undefined ? '' : value} onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        style={{ height: 40, fontSize: 13 }} />
    </div>
  );
}
