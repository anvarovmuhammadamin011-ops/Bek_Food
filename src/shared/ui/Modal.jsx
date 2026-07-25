import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, style = {} }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '420px', maxHeight: '80vh',
          background: 'var(--ajif-black-soft)', border: '1px solid var(--ajif-border)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          ...style,
        }}
      >
        {title && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: '1px solid var(--ajif-border)',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ajif-white)' }}>{title}</h3>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', color: 'var(--ajif-white-muted)',
              cursor: 'pointer', padding: '4px', borderRadius: '6px',
            }}>
              <X size={18} />
            </button>
          </div>
        )}
        <div style={{ padding: '20px', overflowY: 'auto', maxHeight: 'calc(80vh - 60px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
