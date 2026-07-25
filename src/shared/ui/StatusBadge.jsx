const statusColors = {
  PENDING: { bg: 'rgba(230, 119, 0, 0.15)', color: '#E67700' },
  ACCEPTED: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
  REJECTED: { bg: 'rgba(229, 30, 30, 0.15)', color: '#e51e1e' },
  PREPARING: { bg: 'rgba(230, 119, 0, 0.15)', color: '#E67700' },
  READY: { bg: 'rgba(43, 138, 62, 0.15)', color: '#2B8A3E' },
  DRIVER_ASSIGNED: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
  PICKED_UP: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
  DELIVERING: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
  DELIVERED: { bg: 'rgba(43, 138, 62, 0.15)', color: '#2B8A3E' },
  COMPLETED: { bg: 'rgba(43, 138, 62, 0.15)', color: '#2B8A3E' },
  CANCELLED: { bg: 'rgba(229, 30, 30, 0.15)', color: '#e51e1e' },
  ONLINE: { bg: 'rgba(43, 138, 62, 0.15)', color: '#2B8A3E' },
  OFFLINE: { bg: 'rgba(122, 122, 122, 0.15)', color: '#7a7a7a' },
  ON_DELIVERY: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
  PAID: { bg: 'rgba(43, 138, 62, 0.15)', color: '#2B8A3E' },
  FAILED: { bg: 'rgba(229, 30, 30, 0.15)', color: '#e51e1e' },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const colors = statusColors[status] || { bg: 'rgba(122, 122, 122, 0.15)', color: '#7a7a7a' };
  const labels = {
    PENDING: 'Kutilmoqda', ACCEPTED: 'Qabul qilindi', REJECTED: 'Rad etildi',
    PREPARING: 'Tayyorlanmoqda', READY: 'Tayyor', DRIVER_ASSIGNED: 'Haydovchi tayinlandi',
    PICKED_UP: 'Olib ketildi', DELIVERING: 'Yetkazilmoqda', DELIVERED: 'Yetkazildi',
    COMPLETED: 'Tugallandi', CANCELLED: 'Bekor qilindi', ONLINE: 'Online',
    OFFLINE: 'Offline', ON_DELIVERY: 'Yetkazishda', PAID: "To'langan",
    FAILED: 'Muvaffaqiyatsiz',
  };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: size === 'sm' ? '3px 8px' : '5px 12px',
      borderRadius: 'var(--radius-full)',
      background: colors.bg, color: colors.color,
      fontSize: size === 'sm' ? '11px' : '12px', fontWeight: 600,
    }}>
      <span style={{
        width: '5px', height: '5px', borderRadius: '50%',
        background: colors.color,
      }} />
      {labels[status] || status}
    </span>
  );
}
