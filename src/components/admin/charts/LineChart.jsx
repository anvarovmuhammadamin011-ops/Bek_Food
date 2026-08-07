function normalize(data) {
  const max = Math.max(1, ...data.map((d) => Number(d.value) || 0));
  const min = data.length ? Math.min(...data.map((d) => Number(d.value) || 0)) : 0;
  return data.map((d) => ({ ...d, v: Number(d.value) || 0, norm: (Number(d.value) || 0) / max, min: min === max ? 0 : (min / max) }));
}

export default function LineChart({ data = [], height = 160, color = 'var(--primary)', area = true, labels = false }) {
  const pts = normalize(data);
  const pad = 10;
  const W = 320;
  const h = height;
  const w = W - pad * 2;
  if (!pts.length) {
    return <div className="text-center" style={{ color: 'var(--text-dim)', fontSize: 13 }}>Ma'lumot yo'q</div>;
  }
  const x = (i) => pad + (i * w) / Math.max(1, pts.length - 1);
  const y = (p) => h - pad - (h - pad * 2) * p;

  const path = pts.map((p, i) => `${x(i)},${y(p.norm)}`).join(' L ');
  const areaPath = `${x(0)},${y(0)} L ${pts.map((p, i) => `${x(i)},${y(p.norm)}`).join(' L ')} L ${x(pts.length - 1)},${y(0)} Z`;

  return (
    <div className="w-full" style={{ width: '100%', overflowX: 'auto' }}>
      <svg width={W} height={h + (labels ? 22 : 0)} viewBox={`0 0 ${W} ${h + (labels ? 22 : 0)}`} style={{ display: 'block', width: '100%', height: 'auto' }} role="img" aria-label="line chart">
        {area && <path d={areaPath} fill={color} opacity={0.1} />}
        <polyline points={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => {
          const cx = x(i);
          const cy = y(p.norm);
          return <circle key={i} cx={cx} cy={cy} r={3.5} fill={color} />;
        })}
        {labels &&
          pts.map((p, i) => (
            <text key={i} x={x(i)} y={h - pad + 16} textAnchor="middle" fontSize={10} fill="var(--text-dim)">
              {p.label || p.date || p.hour}
            </text>
          ))}
      </svg>
    </div>
  );
}
