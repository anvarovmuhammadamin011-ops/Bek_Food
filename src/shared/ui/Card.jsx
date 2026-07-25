export default function Card({ children, className = '', hoverable = false, style = {}, ...props }) {
  return (
    <div
      className={`card${hoverable ? ' card-clickable' : ''} ${className}`}
      style={{
        background: 'var(--ajif-black-soft)',
        border: '1px solid var(--ajif-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
