import { FileText, Printer, Download, Share2 } from 'lucide-react';
import useOrderManagerStore from '../store/useOrderManagerStore';

export default function OMReceiptsPage() {
  const { orders } = useOrderManagerStore();
  const completedOrders = orders.filter((o) => o.status === 'delivered' || o.status === 'out_for_delivery');

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>
        Receipt History
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {completedOrders.map((order) => (
          <div key={order.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px', borderRadius: '12px', background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'var(--color-primary-light)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <FileText size={18} color="var(--color-primary)" />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{order.orderNumber}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {order.customerName} · {new Date(order.orderTime).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)', marginRight: '12px' }}>
                {order.total.toLocaleString()} so'm
              </span>
              <button className="om-action-btn print" title="Print"><Printer size={14} /></button>
              <button className="om-action-btn print" title="Download"><Download size={14} /></button>
              <button className="om-action-btn print" title="Share"><Share2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {completedOrders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '14px' }}>No receipts yet</p>
        </div>
      )}
    </div>
  );
}
