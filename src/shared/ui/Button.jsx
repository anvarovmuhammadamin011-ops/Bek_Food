export default function Button({ children, variant = 'primary', size = 'md', icon: Icon, className = '', style = {}, ...props }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all var(--transition-normal)',
    fontFamily: 'var(--font-family)',
    ...style,
  };

  const sizes = {
    sm: { padding: '8px 14px', fontSize: '12px' },
    md: { padding: '12px 20px', fontSize: '14px' },
    lg: { padding: '14px 24px', fontSize: '15px' },
  };

  const variants = {
    primary: { background: 'var(--ajif-red)', color: 'white', boxShadow: 'var(--shadow-primary)' },
    secondary: { background: 'transparent', color: 'var(--ajif-white)', border: '1px solid var(--ajif-border)' },
    ghost: { background: 'transparent', color: 'var(--ajif-white-muted)' },
    danger: { background: 'var(--ajif-red)', color: 'white' },
  };

  return (
    <button style={{ ...base, ...sizes[size], ...variants[variant] }} className={className} {...props}>
      {Icon && <Icon size={size === 'sm' ? 14 : 18} />}
      {children}
    </button>
  );
}
