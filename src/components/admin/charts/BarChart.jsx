export default function BarChart({ data = [], height = 140, color = 'var(--primary)', axis = true, labels = true, valueOnTop = true }) {
  const max = Math.max(1, ...data.map((d) => Number(d.value) || 0));
  const pad = 10;
  const chartW = 320;
  const h = height;
  const barW = (chartW - pad * 2) / Math.max(1, data.length) * 0.6;
  const gutter = (chartW - pad * 2) / Math.max(1, data.length) * 0.4;
  const y = (v) => h - pad - (h - pad * 2) * (v / max);

  return (
    <div className="w-full" style={{ width: '100%', overflowX: 'auto' }}>
      <svg width={chartW} height={h + (labels ? 26 : 4)} viewBox={`0 0 ${chartW} ${h + (labels ? 26 : 4)}`} style={{ display: 'block', width: '100%', height: 'auto' }} role="img" aria-label="bar chart">
        {axis && (
          <line x1={pad} y1={h - pad} x2={chartW - pad} y2={h - pad} stroke="var(--border-strong)" strokeWidth={1} />
        )}
        {data.map((d, i) => {
          const v = Number(d.value) || 0;
          const bx = pad + i * (barW + gutter);
          const bh = y(v) - (h - pad);
          const by = h - pad - bh;
          return (
            <g key={i}>
              {v > 0 && (
                <rect x={bx} y={by} width={barW} height={bh} rx={3} fill={d.color || color} opacity={d.color ? 0.9 : 1} />
              )}
              {valueOnTop && v > 0 && (
                <text x={bx + barW / 2} y={by - 5} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--text-muted)">
                  {v}
                </text>
              )}
              {labels && (
                <text x={bx + barW / 2} y={h - pad + 16} textAnchor="middle" fontSize={11} fill="var(--text-dim)">
                  {d.label || d.date || d.hour}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
