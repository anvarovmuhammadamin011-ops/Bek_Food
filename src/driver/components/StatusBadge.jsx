const STATUS_COLORS = {
  assigned: { bg: 'rgba(230, 119, 0, 0.10)', color: 'var(--color-warning)' },
  accepted: { bg: 'var(--color-primary-light)', color: 'var(--color-primary)' },
  pickup: { bg: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6' },
  delivering: { bg: 'var(--color-primary-light)', color: 'var(--color-primary)' },
  arrived: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  delivered: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  completed: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  cancelled: { bg: 'var(--color-danger-light)', color: 'var(--color-danger)' },
  failed: { bg: 'var(--color-danger-light)', color: 'var(--color-danger)' },
  pending: { bg: 'rgba(230, 119, 0, 0.10)', color: 'var(--color-warning)' },
};

const SIZE_MAP = {
  sm: { fontSize: 10, padding: '3px 8px' },
  md: { fontSize: 12, padding: '4px 10px' },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const key = (status || '').toLowerCase();
  const colors = STATUS_COLORS[key] || { bg: 'var(--bg-secondary)', color: 'var(--text-secondary)' };
  const sizeStyles = SIZE_MAP[size] || SIZE_MAP.sm;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-full)',
        background: colors.bg,
        color: colors.color,
        fontSize: sizeStyles.fontSize,
        fontWeight: 600,
        textTransform: 'capitalize',
        letterSpacing: '0.02em',
        padding: sizeStyles.padding,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
}
