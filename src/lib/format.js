export function number(n) {
  return new Intl.NumberFormat('uz-UZ').format(Math.round(Number(n) || 0));
}

export function formatPrice(n) {
  return `${number(n)} so'm`;
}

export function formatCompact(n) {
  const v = Number(n) || 0;
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v >= 1e4 ? Math.round(v / 1e3) : (v / 1e3).toFixed(1))}K`;
  return String(Math.round(v));
}

export function percent(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export function trendPct(current, previous) {
  if (!previous) return current ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function formatPhone(phone) {
  const p = String(phone || '').replace(/\D/g, '');
  if (p.length === 12 && p.startsWith('998')) return `+998 ${p.slice(3, 5)} ${p.slice(5, 8)} ${p.slice(8)}`;
  if (p.length === 9) return `+998 ${p.slice(0, 2)} ${p.slice(2, 5)} ${p.slice(5)}`;
  return phone || '';
}

export function formatDate(date) {
  if (!date) return '—';
  const d = new Date(date);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
}

export function padNum(n, len = 2) {
  return String(Math.abs(Math.trunc(Number(n) || 0))).padStart(len, '0');
}

export const COLORS = ['#F97316', '#22C55E', '#3B82F8', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1'];
