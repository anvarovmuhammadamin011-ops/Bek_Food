export default function StatCard({
  icon,
  value,
  label,
  color = 'var(--color-primary)',
  bgColor,
}) {
  const bg = bgColor || `${color}15`;

  return (
    <div style={styles.card}>
      <div
        style={{
          ...styles.iconCircle,
          background: bg,
          color: color,
        }}
      >
        {icon}
      </div>
      <span style={styles.value}>{value}</span>
      <span style={styles.label}>{label}</span>
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 14,
    boxShadow: 'var(--shadow-card)',
    transition: 'box-shadow 200ms ease',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  value: {
    display: 'block',
    fontSize: 20,
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  label: {
    display: 'block',
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: 2,
    fontWeight: 500,
  },
};
