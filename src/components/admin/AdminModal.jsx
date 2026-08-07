import { X } from 'lucide-react';

export default function AdminModal({ open, title, onClose, children, footer, size = 'md', closeOnEsc = true }) {
  if (!open) return null;
  const handleKey = (e) => {
    if (closeOnEsc && (e.key === 'Escape' || e.key === 'Enter')) {
      e.stopPropagation();
      onClose();
    }
  };
  return (
    <div className="admin-modal-backdrop" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: size === 'sm' ? 420 : size === 'lg' ? 1024 : size === 'xl' ? 1280 : 640,
        maxHeight: 'calc(100dvh - 32px)', background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        animation: 'scaleIn .2s var(--ease-spring)',
      }} onKeyDown={handleKey} tabIndex={-1}>
        <div className="admin-modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', background: 'var(--surface-hover)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        </div>
        <div className="admin-modal-body" style={{ padding: '20px 20px', overflow: 'auto', flex: 1, minHeight: 0 }}>{children}</div>
        {footer && <div className="admin-modal-footer" style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8, flexShrink: 0 }}>{footer}</div>}
      </div>
    </div>
  );
}
