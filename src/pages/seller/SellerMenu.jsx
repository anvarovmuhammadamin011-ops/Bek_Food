import { useState } from 'react';
import { Plus } from 'lucide-react';
import useStore from '../../store/useStore';

export default function SellerMenu() {
  const { foods } = useStore();

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4 flex items-center justify-between">
        <h1 className="heading">Menyu</h1>
        <button className="flex items-center gap-1" style={{ color: '#e51e1e', fontSize: 14, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
          <Plus size={14} /> Yangi
        </button>
      </div>
      <div className="p-4 space-y-2">
        {foods.map((f) => (
          <div key={f.id} className="card p-3 flex items-center gap-3">
            <img src={f.image} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
            <div className="flex-1 min-w-0">
              <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</h4>
              <p className="price-sm">{f.price.toLocaleString()} so'm</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" style={{ background: '#333' }} />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
