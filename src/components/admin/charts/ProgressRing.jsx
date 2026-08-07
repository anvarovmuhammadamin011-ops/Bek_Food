export default function ProgressRing({ value = 0, max = 100, size = 96, label, sublabel, color = 'var(--primary)', stroke = 8 }) {
  const pct = Math.max(0, Math.min(100, (Number(value) || 0) / max * 100));
  const radius = (size / 2) - stroke;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="progress">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--surface-active)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset .6s var(--ease)' }}
        />
      </svg>
      {label && <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{label}</div>}
      {sublabel && <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{sublabel}</div>}
    </div>
  );
}
