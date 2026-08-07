import { number } from '../../../lib/format';

function Arc(cx, cy, r, startAngle, endAngle) {
  const sa = (startAngle * Math.PI) / 180;
  const ea = (endAngle * Math.PI) / 180;
  const x1 = cx + r * Math.cos(sa);
  const y1 = cy + r * Math.sin(sa);
  const x2 = cx + r * Math.cos(ea);
  const y2 = cy + r * Math.sin(ea);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1},${y1} A ${r},${r} 0 ${large} 1 ${x2},${y2} L ${cx},${cy} Z`;
}

export default function PieChart({ data = [], size = 160, hole = 60, legend = true, unit = 'soʻm' }) {
  const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0);
  if (!total) {
    return <div className="text-center" style={{ color: 'var(--text-dim)', fontSize: 13 }}>Ma'lumot yo'q</div>;
  }
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - 12) / 2;
  let offset = -90;
  const slices = data
    .filter((d) => Number(d.value) > 0)
    .map((d) => {
      const pct = (Number(d.value) / total) * 360;
      const start = offset;
      const end = offset + pct;
      offset = end;
      return { ...d, path: Arc(cx, cy, r, start, end), pct };
    });

  return (
    <div className="flex items-center gap-3" style={{ gap: 12 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }} role="img" aria-label="pie chart">
        {slices.map((d, i) => (
          <path key={i} d={d.path} fill={d.color || '#CBD5E1'} stroke="var(--bg)" strokeWidth={1.5} />
        ))}
        {hole > 0 && <circle cx={cx} cy={cy} r={hole / 2} fill="var(--surface)" />}
        {legend && (
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight={700} fill="var(--text)">
            {Math.round(total)}
          </text>
        )}
      </svg>
      {legend && (
        <div className="space-y-1" style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: d.color || '#CBD5E1', flexShrink: 0 }} />
              <span style={{ color: 'var(--text-secondary)' }}>{d.label || d.name}</span>
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>{number(d.value)} {unit}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
