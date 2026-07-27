import { ShoppingBag, Search, Heart, ClipboardList, MapPin } from 'lucide-react';

const icons = {
  cart: ShoppingBag,
  search: Search,
  heart: Heart,
  orders: ClipboardList,
  address: MapPin,
};

export default function EmptyState({ icon = 'cart', title, description, action, onAction }) {
  const Icon = icons[icon] || ShoppingBag;

  return (
    <div className="empty-state animate-fade-in-up">
      <div className="empty-state-icon animate-float">
        <Icon size={32} />
      </div>
      <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 500, marginBottom: 6, fontFamily: 'var(--font-display)' }}>
        {title}
      </h3>
      <p style={{ color: '#6b6b6b', fontSize: 13, lineHeight: 1.5, maxWidth: 240, marginBottom: action ? 20 : 0 }}>
        {description}
      </p>
      {action && (
        <button onClick={onAction} className="btn btn-primary" style={{ borderRadius: 'var(--radius)', marginTop: 8 }}>
          {action}
        </button>
      )}
    </div>
  );
}
