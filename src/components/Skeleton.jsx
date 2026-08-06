export function SkeletonCard() {
  return (
    <div className="skeleton-card" style={{ padding: 8 }}>
      <div className="skeleton" style={{ aspectRatio: '4/3', borderRadius: 'var(--radius-sm)', marginBottom: 10 }} />
      <div style={{ padding: '0 6px 6px' }}>
        <div className="skeleton skeleton-title" style={{ marginBottom: 6 }} />
        <div className="skeleton skeleton-text" style={{ width: '70%', marginBottom: 12 }} />
        <div className="flex items-center justify-between">
          <div className="skeleton skeleton-text" style={{ width: 64, height: 16 }} />
          <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)' }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonBanner() {
  return (
    <div className="skeleton-card">
      <div className="skeleton" style={{ height: 150, borderRadius: 'var(--radius-xl)' }} />
    </div>
  );
}

export function SkeletonCategory() {
  return (
    <div className="flex" style={{ gap: 10 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="skeleton" style={{ width: 80, height: 38, borderRadius: 'var(--radius-full)', flexShrink: 0 }} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card flex items-center" style={{ gap: 12, padding: 14 }}>
          <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton skeleton-title" style={{ marginBottom: 6 }} />
            <div className="skeleton skeleton-text" style={{ width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
