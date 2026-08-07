import { useState } from 'react';
import useAdminData from '../../hooks/useAdminData';
import api from '../../api/client';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import { statusConfig, STATUS_COLOR, ORDER_STATUSES } from '../../lib/statuses';
import { formatPrice, formatDate } from '../../lib/format';
import { Check, RefreshCw, Pencil } from 'lucide-react';

function paymentLabel(v) {
  if (v === 'cash') return 'Naqt';
  if (v === 'card') return 'Karta';
  return v;
}

export default function AdminOrders() {
  const { orders, loading, refreshKpi } = useAdminData();
  const [editing, setEditing] = useState(null);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'customerName', label: 'Mijoz', render: (v, row) => (
      <div>
        <div style={{ fontWeight: 600, color: 'var(--text)' }}>{v || '—'}</div>
        <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{row.customerPhone || ''}</div>
      </div>
    ) },
    { key: 'status', label: 'Holat', render: (v) => (
      <span className="badge" style={{ background: `${STATUS_COLOR[v] || '#CBD5E1'}20`, color: STATUS_COLOR[v] || '#6B7280', fontSize: 10, textTransform: 'capitalize' }}>
        {statusConfig(v).label}
      </span>
    ) },
    { key: 'total', label: 'Summa', render: (v) => <span style={{ fontWeight: 600 }}>{formatPrice(v)}</span> },
    { key: 'paymentMethod', label: "To'lov", render: paymentLabel },
    { key: 'deliveryType', label: 'Yetkazish' },
    { key: 'createdAt', label: 'Vaqt', render: (v) => formatDate(v) },
    { key: 'items', label: '', render: (v, row) => (
      <button type="button" className="btn-icon btn-sm" onClick={() => setEditing(row)} aria-label="Edit" style={{ width: 32, height: 32, fontSize: 13 }}>
        <Pencil size={14} />
      </button>
    ) },
  ];

  return (
    <div className="admin-orders">
      <div className="flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Buyurtmalar ({orders.length})</h2>
        <button type="button" onClick={() => refreshKpi()} className="btn btn-sm btn-secondary" style={{ fontSize: 12 }}>
          <RefreshCw size={14} /> Yangilash
        </button>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && <div style={{ padding: 16, color: 'var(--text-dim)' }}>Yuklanmoqda...</div>}
        <AdminTable columns={columns} rows={orders} onRowClick={(row) => setEditing(row)} />
      </div>

      {editing && (
        <AdminModal open={!!editing} title={`#${editing.id} buyurtmasi`} onClose={() => setEditing(null)} size="sm" footer={
          <button type="button" className="btn btn-primary" style={{ fontSize: 13 }}>Saqlash</button>
        }>
          <OrderStatusForm order={editing} onClose={() => setEditing(null)} onSaved={refreshKpi} />
        </AdminModal>
      )}
    </div>
  );
}

function OrderStatusForm({ order, onClose, onSaved }) {
  const [status, setStatus] = useState(order.status);
  return (
    <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13 }}>
      <div>
        <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Holat</label>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)} style={{ height: 42 }}>
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
        Jami: <b>{formatPrice(order.total)}</b> · Mijoz: {order.customerName} · {order.customerPhone}
      </div>
      <div className="flex justify-end gap-2" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
        <button type="button" className="btn btn-secondary" style={{ fontSize: 12 }} onClick={onClose}>Bekor</button>
        <button type="button" className="btn btn-primary" style={{ fontSize: 12 }} onClick={async () => {
          try {
            await api.adminUpdateOrderStatus(order.id, status);
            onSaved();
            onClose();
          } catch { onClose(); }
        }}>
          <Check size={14} /> Yangilash
        </button>
      </div>
    </div>
  );
}