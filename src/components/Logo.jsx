export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: { img: 28, text: 14 },
    md: { img: 40, text: 20 },
    lg: { img: 56, text: 28 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <img
        src="/favicon.jpg"
        alt="AJIF"
        style={{
          width: s.img,
          height: s.img,
          borderRadius: size === 'lg' ? '10px' : '6px',
          objectFit: 'cover',
        }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div
        style={{
          display: 'none',
          width: s.img,
          height: s.img,
          borderRadius: size === 'lg' ? '10px' : '6px',
          background: 'var(--ajif-black-soft)',
          border: '1px solid var(--ajif-border)',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-family-display)',
          fontStyle: 'italic',
          fontWeight: 700,
          color: 'var(--ajif-white)',
          fontSize: s.text,
          letterSpacing: '-0.02em',
        }}
      >
        AJif
      </div>
    </div>
  );
}
