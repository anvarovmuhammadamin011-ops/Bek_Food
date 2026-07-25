import { CheckCircle, XCircle } from 'lucide-react';
import useDriverStore from '../store/useDriverStore';

export default function DriverHistoryPage() {
  const { deliveryHistory } = useDriverStore();

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>Tarix</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {deliveryHistory.map((order) => (
          <div key={order.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px', borderRadius: '12px', background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: order.status === 'completed' ? 'var(--color-success-light)' : 'var(--color-danger-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {order.status === 'completed' ? <CheckCircle size={18} color="var(--color-success)" /> : <XCircle size={18} color="var(--color-danger)" />}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{order.orderNumber}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {order.customer} · {order.date}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-success)' }}>+{order.earnings.toLocaleString()}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.timeTaken} daq</div>
            </div>
          </div>
        ))}
      </div>

      {deliveryHistory.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '14px' }}>Hali tarix yo'q</p>
        </div>
      )}
    </div>
  );
}
