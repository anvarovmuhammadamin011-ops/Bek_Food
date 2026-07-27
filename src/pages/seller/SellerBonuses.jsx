import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function SellerBonuses() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4">
        <h1 className="heading">Bonuslar</h1>
      </div>
      <div className="p-4 space-y-4">
        <div className="card p-4 space-y-3">
          <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>Mijozga bonus qo'shish</h3>
          <div className="input-group">
            <span style={{ position: 'absolute', left: 14, color: '#6b6b6b', fontSize: 14 }}>+998</span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefon raqam" className="input" style={{ paddingLeft: 44 }} />
          </div>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Bonus miqdori (so'm)" className="input" />
          <button className="btn btn-primary btn-sm w-full" style={{ borderRadius: 8 }}>
            <Plus size={14} /> Qo'shish
          </button>
        </div>
        <div className="card p-4">
          <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Faol chegirmalar</h3>
          <p style={{ color: '#6b6b6b', fontSize: 12 }}>Hozircha faol chegirmalar yo'q</p>
        </div>
      </div>
    </div>
  );
}
