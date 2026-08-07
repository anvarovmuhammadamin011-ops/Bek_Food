export const ORDER_STATUSES = [
  { value: 'pending', label: 'Kutilmoqda', color: 'warning', icon: 'Clock' },
  { value: 'confirmed', label: 'Tasdiqlanmagan', color: 'primary', icon: 'CheckCircle' },
  { value: 'preparing', label: 'Tayyorlanmoqda', color: 'warning', icon: 'Chef' },
  { value: 'ready', label: 'Tayyor', color: 'success', icon: 'PackageCheck' },
  { value: 'pickedUp', label: 'Olinadi', color: 'primary', icon: 'Truck' },
  { value: 'onTheWay', label: 'Yo\'lda', color: 'primary', icon: 'Navigation' },
  { value: 'delivered', label: 'Yetkazildi', color: 'success', icon: 'CheckCircle2' },
  { value: 'cancelled', label: 'Bekor qilingan', color: 'danger', icon: 'XCircle' },
  { value: 'assigned', label: 'Kuryerga berildi', color: 'primary', icon: 'User' },
];

export const STATUS_COLOR = {
  pending: '#F59E0B',
  confirmed: '#F97316',
  preparing: '#F59E0B',
  ready: '#22C55E',
  pickedUp: '#3B82F8',
  onTheWay: '#8B5CF6',
  delivered: '#22C55E',
  cancelled: '#EF4444',
  assigned: '#F97316',
  ok: '#22C55E',
  low: '#F59E0B',
  critical: '#EF4444',
};

export function statusConfig(value) {
  return ORDER_STATUSES.find((s) => s.value === value) || { value, label: value, color: 'neutral' };
}

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Naqt pul', icon: 'Banknote' },
  { value: 'card', label: 'Karta', icon: 'CreditCard' },
  { value: 'click', label: 'Click', icon: 'Wallet' },
  { value: 'payme', label: 'Payme', icon: 'Wallet' },
];
