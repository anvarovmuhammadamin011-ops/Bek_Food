export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: { wrap: 32, icon: 18, text: 13 },
    md: { wrap: 40, icon: 22, text: 16 },
    lg: { wrap: 56, icon: 30, text: 22 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div style={{
      width: s.wrap,
      height: s.wrap,
      borderRadius: size === 'lg' ? '16px' : '12px',
      background: 'var(--color-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-primary)',
      flexShrink: 0,
    }}>
      <span style={{
        fontWeight: 800,
        color: 'white',
        fontSize: s.text,
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}>
        AC
      </span>
    </div>
  );
}
