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
      <h3 className="heading" style={{ marginBottom: 6 }}>{title}</h3>
      <p className="body" style={{ maxWidth: 240, marginBottom: action ? 20 : 0 }}>{description}</p>
      {action && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {action}
        </button>
      )}
    </div>
  );
}
