import { useState, useMemo } from 'react';
import AdminTable from './AdminTable';
import AdminModal from './AdminModal';
import ExportButton from './ExportButton';
import { Search, Plus } from 'lucide-react';

export default function AdminListPage({
  title,
  count,
  columns,
  rows,
  loading,
  onAdd,
  onEdit,
  formComponent,
  searchable = [],
}) {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      searchable.length
        ? searchable.some((k) => String(r[k] || '').toLowerCase().includes(q))
        : Object.values(r).some((v) => String(v || '').toLowerCase().includes(q))
    );
  }, [query, rows, searchable]);

  return (
    <div className="admin-list-page">
      <div className="flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{title} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>({count ?? filtered.length})</span></h2>
        <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="admin-search" style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Qidirish..."
              className="input" style={{ height: 36, paddingLeft: 34, maxWidth: 200, fontSize: 13 }} />
          </div>
          {onAdd && (
            <button type="button" onClick={() => { setShowForm(true); onAdd?.(); }} className="btn btn-sm btn-primary" style={{ fontSize: 12 }}>
              <Plus size={14} /> Yangi
            </button>
          )}
          <ExportButton data={filtered} filename={title.replace(/\s+/g, '-').toLowerCase()} />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && <div style={{ padding: 16, color: 'var(--text-dim)' }}>Yuklanmoqda...</div>}
        <AdminTable columns={columns} rows={filtered} onRowClick={onEdit ? (row) => setEditing(row) : undefined} />
      </div>

      {showForm && formComponent && (
        <AdminModal open={showForm} title={editing ? "Tahriri" : "Yangi"} onClose={() => { setShowForm(false); setEditing(null); }} size="md"
          footer={<button type="button" className="btn btn-primary" style={{ fontSize: 12 }}>Saqlash</button>}>
          {formComponent(editing, () => { setShowForm(false); setEditing(null); onSave?.(editing); })}
        </AdminModal>
      )}
    </div>
  );
}
