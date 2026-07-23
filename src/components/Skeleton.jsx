export function SkeletonCard() {
  return (
    <div className="bg-bg-card rounded-2xl overflow-hidden border border-border">
      <div className="skeleton h-36 w-full" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-3 w-1/3" />
      </div>
    </div>
  );
}

export function SkeletonFoodCard() {
  return (
    <div className="flex-shrink-0 w-36 bg-bg-card rounded-2xl border border-border overflow-hidden">
      <div className="skeleton h-28 w-full" />
      <div className="p-2.5 space-y-2">
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonHorizontal() {
  return (
    <div className="flex gap-3 overflow-hidden px-4">
      {[1, 2, 3].map(i => <SkeletonFoodCard key={i} />)}
    </div>
  );
}

export function EmptyState({ icon: Icon, title = 'Nothing here', description = 'Check back later' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center animate-fade-in">
      {Icon && <div className="w-16 h-16 rounded-full bg-bg-card border border-border flex items-center justify-center mb-4"><Icon size={24} className="text-text-secondary" /></div>}
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-text-secondary text-sm">{description}</p>
    </div>
  );
}
