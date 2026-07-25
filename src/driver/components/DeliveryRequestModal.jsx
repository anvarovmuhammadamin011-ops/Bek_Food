import { useEffect, useRef } from 'react';
import { Clock, MapPin, Navigation, Package, Banknote } from 'lucide-react';

const RADIUS = 24;
const STROKE = 4;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function DeliveryRequestModal({
  order,
  onAccept,
  onReject,
  countdown,
  onTick,
}) {
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      onTick();
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [onTick]);

  useEffect(() => {
    if (countdown <= 0) {
      clearInterval(intervalRef.current);
      onReject();
    }
  }, [countdown, onReject]);

  if (!order) return null;

  const progress = countdown / 30;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="delivery-request-overlay">
      <div className="delivery-request-card">
        {/* Header with countdown */}
        <div className="request-header">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Circular countdown */}
            <div style={{ position: 'relative', width: 72, height: 72, marginBottom: 12 }}>
              <svg
                width={72}
                height={72}
                style={{ transform: 'rotate(-90deg)' }}
              >
                <circle
                  cx={36}
                  cy={36}
                  r={RADIUS}
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth={STROKE}
                />
                <circle
                  cx={36}
                  cy={36}
                  r={RADIUS}
                  fill="none"
                  stroke="white"
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <span style={{ fontSize: 20, fontWeight: 800, color: 'white', lineHeight: 1 }}>
                  {countdown}
                </span>
              </div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.9 }}>
              New Delivery Request
            </span>
            <span style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
              {order.orderNumber}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="request-body">
          {/* Restaurant */}
          <InfoRow
            icon={<Package size={16} color="var(--color-primary)" />}
            title={order.restaurant.name}
            subtitle={order.restaurant.address}
            iconBg="var(--color-primary-light)"
          />

          {/* Customer */}
          <InfoRow
            icon={<MapPin size={16} color="var(--color-success)" />}
            title={order.customer.name}
            subtitle={order.customer.address}
            iconBg="var(--color-success-light)"
          />

          {/* Stats row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 8,
              marginTop: 14,
              padding: '12px',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <StatPill icon={<Navigation size={12} />} value={`${order.distance} km`} label="Distance" />
            <StatPill icon={<Clock size={12} />} value={order.estimatedTime} label="Est. Time" />
            <StatPill icon={<Banknote size={12} />} value={`${(order.deliveryFee / 1000).toFixed(0)}k`} label="Fee" />
          </div>

          {/* Order value */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 12,
              padding: '10px 12px',
              background: 'var(--color-primary-light)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Order Value
            </span>
            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-primary)' }}>
              {(order.total / 1000).toFixed(0)},000 so'm
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="request-actions">
          <button
            onClick={onReject}
            style={styles.rejectBtn}
          >
            Reject
          </button>
          <button
            onClick={onAccept}
            style={styles.acceptBtn}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, title, subtitle, iconBg }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 'var(--radius-sm)',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
          {title}
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            marginTop: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function StatPill({ icon, value, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, color: 'var(--text-primary)' }}>
        {icon}
        <span style={{ fontSize: 13, fontWeight: 700 }}>{value}</span>
      </div>
      <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 500 }}>
        {label}
      </span>
    </div>
  );
}

const styles = {
  acceptBtn: {
    flex: 1,
    padding: '14px 0',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    background: 'var(--color-success)',
    color: 'white',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 16px rgba(43, 138, 62, 0.3)',
    fontFamily: 'var(--font-family)',
  },
  rejectBtn: {
    flex: 1,
    padding: '14px 0',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    background: 'var(--color-danger-light)',
    color: 'var(--color-danger)',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'var(--font-family)',
  },
};
