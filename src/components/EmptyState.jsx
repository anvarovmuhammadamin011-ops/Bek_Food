import { emptyStateIllustrations } from './Illustrations';

export default function EmptyState({ icon = 'cart', title, description, action, actionLabel, onAction }) {
  const Illustration = typeof icon === 'string' ? emptyStateIllustrations[icon] : null;

  return (
    <div className="empty-state animate-fade-in-up">
      {Illustration ? (
        <div className="animate-float" style={{ marginBottom: 20 }}><Illustration size={170} /></div>
      ) : (
        <div className="empty-state-icon animate-float" style={{ marginBottom: 20 }}>{icon}</div>
      )}
      <h3 className="heading" style={{ marginBottom: 6 }}>{title}</h3>
      <p className="body" style={{ maxWidth: 260, marginBottom: (action || actionLabel) ? 20 : 0 }}>{description}</p>
      {(action || actionLabel) && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {action || actionLabel}
        </button>
      )}
    </div>
  );
}
