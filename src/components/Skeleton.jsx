export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-sm)', marginBottom: 10 }} />
      <div className="skeleton skeleton-title" style={{ marginBottom: 6 }} />
      <div className="skeleton skeleton-text" style={{ width: '80%', marginBottom: 8 }} />
      <div className="flex items-center justify-between">
        <div className="skeleton skeleton-text" style={{ width: 60 }} />
        <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)' }} />
      </div>
    </div>
  );
}

export function SkeletonBanner() {
  return (
    <div className="skeleton-card">
      <div className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-md)' }} />
    </div>
  );
}

export function SkeletonCategory() {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="skeleton" style={{ width: 80, height: 36, borderRadius: 16, flexShrink: 0 }} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card flex items-center gap-3">
          <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
          <div className="flex-1">
            <div className="skeleton skeleton-title" style={{ marginBottom: 6 }} />
            <div className="skeleton skeleton-text" style={{ width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
