import { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import useOrderManagerStore from '../store/useOrderManagerStore';
import OMOrderCard from '../components/OMOrderCard';

const filters = [
  { id: 'all', label: 'Hammasi' },
  { id: 'pending', label: 'Kutilmoqda' },
  { id: 'accepted', label: 'Qabul qilingan' },
  { id: 'preparing', label: 'Tayyorlanmoqda' },
  { id: 'ready', label: 'Tayyor' },
  { id: 'delivery', label: 'Yetkazish' },
  { id: 'pickup', label: 'Olib ketish' },
  { id: 'delivered', label: 'Yetkazilgan' },
  { id: 'cancelled', label: 'Bekor qilingan' },
  { id: 'high-value', label: 'Qimmat' },
];

const sortOptions = [
  { id: 'newest', label: 'Eng yangi' },
  { id: 'oldest', label: 'Eng eski' },
  { id: 'highest', label: 'Eng qimmat' },
  { id: 'lowest', label: 'Eng arzon' },
  { id: 'waiting', label: 'Uzoq kutgan' },
];

export default function OMOrdersPage() {
  const {
    activeFilter, setActiveFilter, searchQuery, setSearchQuery,
    sortBy, setSortBy, getFilteredOrders, setSelectedOrder,
  } = useOrderManagerStore();
  const [showSort, setShowSort] = useState(false);
  const orders = getFilteredOrders();

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Buyurtmalar</h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="om-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buyurtma qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={() => setShowSort(!showSort)} className="om-topbar-btn" title="Saralash">
            <ArrowUpDown size={18} />
          </button>
        </div>
      </div>

      {showSort && (
        <div style={{
          display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px',
          padding: '12px', borderRadius: '12px', background: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}>
          {sortOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { setSortBy(opt.id); setShowSort(false); }}
              className={`om-filter-chip${sortBy === opt.id ? ' active' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      <div className="om-filters">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`om-filter-chip${activeFilter === f.id ? ' active' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="om-orders-grid">
        {orders.map((order) => (
          <OMOrderCard key={order.id} order={order} onClick={setSelectedOrder} />
        ))}
      </div>

      {orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
          <Package size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <p style={{ fontSize: '14px', fontWeight: 500 }}>Buyurtmalar topilmadi</p>
        </div>
      )}
    </div>
  );
}
