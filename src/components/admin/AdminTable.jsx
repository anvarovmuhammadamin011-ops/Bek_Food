import { ChevronLeft, ChevronRight } from 'lucide-react';

function th(label, sortable, asc, onSort) {
  return (
    <button type="button" onClick={onSort} className="th" style={{
      display: 'flex', alignItems: 'center', gap: 4, cursor: sortable ? 'pointer' : 'default', border: 0, background: 'transparent',
      color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, padding: '8px 4px', whiteSpace: 'nowrap',
    }}>
      {label}
      {sortable && (asc === false ? <ChevronLeft size={13} /> : asc === true ? <ChevronRight size={13} /> : <ChevronLeft size={13} style={{ opacity: 0.3 }} />)}
    </button>
  );
}

export default function AdminTable({ columns, rows, stickyHeader = true, hover = true, onRowClick, sort }) {
  const sorted = sort ? rows.slice().sort((a, b) => (String(a[sort.field] || '').toLowerCase() < String(b[sort.field] || '').toLowerCase() ? (sort.asc ? -1 : 1) : (sort.asc ? 1 : -1))) : rows;
  return (
    <>
      <div className="admin-table-wrap" style={{ width: '100%', overflow: 'auto' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead style={{ position: stickyHeader ? 'sticky' : 'static', top: 0, background: 'var(--surface)', zIndex: 1, borderBottom: '1px solid var(--border)' }}>
            <tr>
              {columns.map((c) => (
                <th key={c.key} style={{ textAlign: c.align || 'left', padding: '10px 14px', color: 'var(--text-dim)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
                  {c.sortable ? th(c.label, true, sort && sort.field === c.key ? sort.asc : undefined, () => sort && sort.onSort(c.key)) : c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={columns.length} style={{ padding: 32, textAlign: 'center', color: 'var(--text-dim)' }}>Ma'lumot yo'q</td></tr>
            ) : (
              sorted.map((row, i) => (
                <tr key={row.id || i} onClick={() => onRowClick && onRowClick(row)} style={{ cursor: onRowClick ? 'pointer' : 'default', opacity: row._dim ? 0.6 : 1, ...(hover ? { transition: 'background .15s', ':hover': { background: 'var(--surface-hover)' } } : {}) }}>
                  {columns.map((c) => (
                    <td key={c.key} style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', ...c.style }}>{c.render ? c.render(row[c.key], row) : row[c.key]}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
