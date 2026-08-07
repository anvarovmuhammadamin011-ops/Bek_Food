import { Download } from 'lucide-react';
import { formatPrice } from '../../lib/format';

function toCSV(rows) {
  if (!rows.length) return '';
  const keys = Object.keys(rows[0]);
  const esc = (v) => `"${String(v === null || v === undefined ? '' : v).replace(/"/g, '""')}"`;
  return [keys.join(','), ...rows.map((r) => keys.map((k) => esc(r[k])).join(','))].join('\r\n');
}

export default function ExportButton({ data, filename = 'export', label = 'Eksport' }) {
  const handleExport = () => {
    if (!data || !data.length) return;
    const csv = toCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button type="button" onClick={handleExport} className="btn btn-sm btn-secondary" style={{ fontSize: 12 }}>
      <Download size={14} /> {label}
    </button>
  );
}

export function MoneyBadge({ amount, sign = true }) {
  return <span>{sign ? '+' : ''}{formatPrice(amount)}</span>;
}
