import { AlertTriangle } from 'lucide-react';
import useOrderManagerStore from '../store/useOrderManagerStore';

export default function OMConfirmDialog() {
  const { showConfirmDialog, confirmMessage, confirmAction, closeConfirm } = useOrderManagerStore();

  if (!showConfirmDialog) return null;

  return (
    <div className="om-modal-overlay" onClick={closeConfirm}>
      <div className="om-modal" style={{ maxWidth: '380px' }} onClick={(e) => e.stopPropagation()}>
        <div className="om-modal-body" style={{ textAlign: 'center', padding: '28px 24px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'var(--color-warning-light)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <AlertTriangle size={24} color="var(--color-warning)" />
          </div>
          <p className="om-confirm-msg">{confirmMessage}</p>
          <div className="om-confirm-actions">
            <button className="om-confirm-cancel" onClick={closeConfirm}>Cancel</button>
            <button className="om-confirm-ok" onClick={() => { confirmAction?.(); closeConfirm(); }}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}
