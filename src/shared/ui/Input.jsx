export default function Input({ label, icon: Icon, error, style = {}, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      {label && (
        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ajif-white-muted)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon size={16} style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--ajif-white-muted)',
          }} />
        )}
        <input
          style={{
            width: '100%', padding: Icon ? '12px 12px 12px 38px' : '12px',
            background: 'var(--ajif-black)', border: `1px solid ${error ? 'var(--ajif-red)' : 'var(--ajif-border)'}`,
            borderRadius: 'var(--radius-sm)', color: 'var(--ajif-white)',
            fontSize: '14px', fontFamily: 'var(--font-family)',
            outline: 'none', transition: 'border-color 0.2s',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'rgba(229, 30, 30, 0.4)'; }}
          onBlur={(e) => { e.target.style.borderColor = error ? 'var(--ajif-red)' : 'var(--ajif-border)'; }}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: '11px', color: 'var(--ajif-red)' }}>{error}</span>}
    </div>
  );
}
