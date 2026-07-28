import { useState, useMemo } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Crown,
  Activity,
  DollarSign,
  Star,
  Phone,
  ShoppingCart,
  Clock,
  Edit,
  Ban,
  Eye,
  Search,
  ArrowUpDown,
  Download,
  X,
  Heart,
  MessageSquare,
} from 'lucide-react';

const VIP_TIERS = {
  oddiy: { label: 'Oddiy', color: '#9ca3af', bg: 'rgba(156,163,175,0.08)', minOrders: 0 },
  silver: { label: 'Silver', color: '#c0c0c0', bg: 'rgba(192,192,192,0.1)', minOrders: 100 },
  gold: { label: 'Gold', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', minOrders: 500 },
  platinum: { label: 'Platinum', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', minOrders: 1000 },
};

const TIER_FILTER_OPTIONS = ['Hammasi', 'Silver', 'Gold', 'Platinum'];
const SORT_OPTIONS = [
  { value: 'name', label: "Ism bo'yicha" },
  { value: 'totalOrders', label: 'Buyurtmalar soni' },
  { value: 'lastOrder', label: 'Oxirgi buyurtma' },
];

const MOCK_CUSTOMERS = [
  {
    id: 1,
    name: 'Alisher Navoiy',
    phone: '+998 90 123 45 67',
    vipTier: 'platinum',
    totalOrders: 1247,
    totalSpent: 8950000,
    lastOrder: '2026-07-27T18:30:00',
    favoriteDish: 'T-Bone Steak',
    avgCheck: 7180,
    rating: 4.9,
    blacklisted: false,
    notes: "VIP mijoz. Har doim 123-stolni so'raydi.",
    orders: [
      { id: 1001, date: '2026-07-27T18:30:00', total: 125000, items: ['T-Bone Steak', 'Caesar Salad', 'Red Wine'] },
      { id: 1002, date: '2026-07-25T19:15:00', total: 89000, items: ['Ribeye Steak', 'French Fries'] },
      { id: 1003, date: '2026-07-22T20:00:00', total: 145000, items: ['Wagyu Steak', 'Mushroom Soup', 'Sparkling Water'] },
      { id: 1004, date: '2026-07-20T17:45:00', total: 67000, items: ['Grilled Chicken', 'Coleslaw'] },
      { id: 1005, date: '2026-07-18T19:30:00', total: 112000, items: ['Lamb Chops', 'Garlic Bread', 'Juice'] },
    ],
  },
  {
    id: 2,
    name: 'Dilshod Karimov',
    phone: '+998 91 234 56 78',
    vipTier: 'gold',
    totalOrders: 634,
    totalSpent: 4250000,
    lastOrder: '2026-07-26T20:15:00',
    favoriteDish: 'Ribeye Steak',
    avgCheck: 6700,
    rating: 4.7,
    blacklisted: false,
    notes: "Kechki payt keladi. Uzum sharbat so'raydi.",
    orders: [
      { id: 1006, date: '2026-07-26T20:15:00', total: 98000, items: ['Ribeye Steak', 'Mashed Potatoes'] },
      { id: 1007, date: '2026-07-24T19:00:00', total: 76000, items: ['Filet Mignon', 'Salad'] },
      { id: 1008, date: '2026-07-21T20:30:00', total: 115000, items: ['Wagyu Steak', 'Wine'] },
      { id: 1009, date: '2026-07-19T18:45:00', total: 54000, items: ['Grilled Salmon', 'Rice'] },
      { id: 1010, date: '2026-07-17T20:00:00', total: 88000, items: ['Porterhouse Steak', 'Beer'] },
    ],
  },
  {
    id: 3,
    name: 'Nodira Rashidova',
    phone: '+998 93 345 67 89',
    vipTier: 'silver',
    totalOrders: 189,
    totalSpent: 1560000,
    lastOrder: '2026-07-25T12:30:00',
    favoriteDish: 'Caesar Salad',
    avgCheck: 8250,
    rating: 4.5,
    blacklisted: false,
    notes: "Tushlik payt keladi. Go'sht kam yeydi.",
    orders: [
      { id: 1011, date: '2026-07-25T12:30:00', total: 45000, items: ['Caesar Salad', 'Soup'] },
      { id: 1012, date: '2026-07-23T13:00:00', total: 62000, items: ['Grilled Chicken', 'Juice'] },
      { id: 1013, date: '2026-07-20T12:15:00', total: 38000, items: ['Pasta Carbonara', 'Water'] },
      { id: 1014, date: '2026-07-18T12:45:00', total: 55000, items: ['Fish & Chips', 'Lemonade'] },
      { id: 1015, date: '2026-07-15T13:30:00', total: 41000, items: ['Club Sandwich', 'Coffee'] },
    ],
  },
  {
    id: 4,
    name: 'Bobur Mirzoev',
    phone: '+998 94 456 78 90',
    vipTier: 'platinum',
    totalOrders: 1582,
    totalSpent: 12800000,
    lastOrder: '2026-07-28T11:00:00',
    favoriteDish: 'Wagyu Steak',
    avgCheck: 8090,
    rating: 5.0,
    blacklisted: false,
    notes: 'Eng sodiq mijoz. Har hafta 2 marta keladi.',
    orders: [
      { id: 1016, date: '2026-07-28T11:00:00', total: 165000, items: ['Wagyu Steak', 'Truffle Fries', 'Champagne'] },
      { id: 1017, date: '2026-07-26T12:30:00', total: 132000, items: ['T-Bone Steak', 'Salad', 'Wine'] },
      { id: 1018, date: '2026-07-24T11:15:00', total: 98000, items: ['Filet Mignon', 'Soup'] },
      { id: 1019, date: '2026-07-22T19:00:00', total: 145000, items: ['Lobster', 'Risotto', 'White Wine'] },
      { id: 1020, date: '2026-07-20T12:00:00', total: 87000, items: ['Grilled Steak', 'Vegetables'] },
    ],
  },
  {
    id: 5,
    name: 'Gulnara Alimova',
    phone: '+998 95 567 89 01',
    vipTier: 'gold',
    totalOrders: 521,
    totalSpent: 3890000,
    lastOrder: '2026-07-27T19:45:00',
    favoriteDish: 'Grilled Salmon',
    avgCheck: 7470,
    rating: 4.6,
    blacklisted: false,
    notes: "Do'stlari bilan keladi. Ko'p buyurtma beradi.",
    orders: [
      { id: 1021, date: '2026-07-27T19:45:00', total: 178000, items: ['2x Ribeye', 'Grilled Salmon', 'Wine', 'Dessert'] },
      { id: 1022, date: '2026-07-25T20:00:00', total: 145000, items: ['T-Bone', 'Pasta', 'Juice'] },
      { id: 1023, date: '2026-07-22T18:30:00', total: 92000, items: ['Chicken Steak', 'Salad', 'Water'] },
      { id: 1024, date: '2026-07-19T19:15:00', total: 118000, items: ['Lamb Chops', 'Risotto', 'Beer'] },
      { id: 1025, date: '2026-07-16T20:30:00', total: 85000, items: ['Fish', 'Soup', 'Coffee'] },
    ],
  },
  {
    id: 6,
    name: 'Sardor Raximov',
    phone: '+998 97 678 90 12',
    vipTier: 'oddiy',
    totalOrders: 42,
    totalSpent: 320000,
    lastOrder: '2026-07-20T13:00:00',
    favoriteDish: 'Chicken Steak',
    avgCheck: 7620,
    rating: 4.2,
    blacklisted: false,
    notes: 'Yangi mijoz. Yaxshi xizmat kutadi.',
    orders: [
      { id: 1026, date: '2026-07-20T13:00:00', total: 65000, items: ['Chicken Steak', 'Fries'] },
      { id: 1027, date: '2026-07-15T12:30:00', total: 48000, items: ['Burger', 'Cola'] },
      { id: 1028, date: '2026-07-10T13:15:00', total: 72000, items: ['Ribeye', 'Salad'] },
      { id: 1029, date: '2026-07-05T12:00:00', total: 55000, items: ['Pasta', 'Water'] },
      { id: 1030, date: '2026-07-01T13:45:00', total: 41000, items: ['Soup', 'Sandwich'] },
    ],
  },
  {
    id: 7,
    name: 'Malika Ismoilova',
    phone: '+998 98 789 01 23',
    vipTier: 'silver',
    totalOrders: 156,
    totalSpent: 1120000,
    lastOrder: '2026-07-26T14:00:00',
    favoriteDish: 'Pasta Carbonara',
    avgCheck: 7180,
    rating: 4.3,
    blacklisted: false,
    notes: "Cheklovlar: yong'oq allergiya.",
    orders: [
      { id: 1031, date: '2026-07-26T14:00:00', total: 58000, items: ['Pasta Carbonara', 'Juice'] },
      { id: 1032, date: '2026-07-23T13:30:00', total: 42000, items: ['Caesar Salad', 'Soup'] },
      { id: 1033, date: '2026-07-19T14:15:00', total: 67000, items: ['Grilled Chicken', 'Rice'] },
      { id: 1034, date: '2026-07-16T12:45:00', total: 35000, items: ['Sandwich', 'Coffee'] },
      { id: 1035, date: '2026-07-12T13:00:00', total: 51000, items: ['Fish', 'Salad'] },
    ],
  },
  {
    id: 8,
    name: 'Jasur Toshmatov',
    phone: '+998 99 890 12 34',
    vipTier: 'oddiy',
    totalOrders: 18,
    totalSpent: 145000,
    lastOrder: '2026-07-15T20:30:00',
    favoriteDish: 'Burger',
    avgCheck: 8060,
    rating: 3.8,
    blacklisted: true,
    notes: 'Qoidabuzarlik: bir necha marta kechikdi.',
    orders: [
      { id: 1036, date: '2026-07-15T20:30:00', total: 75000, items: ['Burger', 'Fries', 'Beer'] },
      { id: 1037, date: '2026-07-08T19:00:00', total: 42000, items: ['Chicken Wrap', 'Cola'] },
      { id: 1038, date: '2026-07-01T20:15:00', total: 58000, items: ['Steak', 'Salad'] },
      { id: 1039, date: '2026-06-25T18:30:00', total: 35000, items: ['Soup', 'Bread'] },
      { id: 1040, date: '2026-06-18T19:45:00', total: 62000, items: ['Ribs', 'Corn', 'Juice'] },
    ],
  },
  {
    id: 9,
    name: 'Feruza Xolmatova',
    phone: '+998 90 901 23 45',
    vipTier: 'gold',
    totalOrders: 578,
    totalSpent: 4560000,
    lastOrder: '2026-07-28T12:00:00',
    favoriteDish: 'Lamb Chops',
    avgCheck: 7890,
    rating: 4.8,
    blacklisted: false,
    notes: "Tadbirlar uchun ko'p buyurtma beradi.",
    orders: [
      { id: 1041, date: '2026-07-28T12:00:00', total: 320000, items: ['5x T-Bone', 'Salads', 'Wine bottles'] },
      { id: 1042, date: '2026-07-25T13:00:00', total: 185000, items: ['3x Ribeye', 'Pasta', 'Juice'] },
      { id: 1043, date: '2026-07-21T12:30:00', total: 95000, items: ['Lamb Chops', 'Risotto'] },
      { id: 1044, date: '2026-07-18T19:00:00', total: 142000, items: ['Wagyu', 'Salad', 'Champagne'] },
      { id: 1045, date: '2026-07-14T13:15:00', total: 78000, items: ['Chicken', 'Soup', 'Water'] },
    ],
  },
  {
    id: 10,
    name: 'Otabek Sultarov',
    phone: '+998 91 012 34 56',
    vipTier: 'platinum',
    totalOrders: 1893,
    totalSpent: 15600000,
    lastOrder: '2026-07-28T19:00:00',
    favoriteDish: 'Wagyu Steak',
    avgCheck: 8240,
    rating: 4.9,
    blacklisted: false,
    notes: "Restoran do'sti. Tadbirlarga taklif qilinadi.",
    orders: [
      { id: 1046, date: '2026-07-28T19:00:00', total: 245000, items: ['Wagyu Steak', 'Lobster', 'Champagne', 'Dessert'] },
      { id: 1047, date: '2026-07-26T20:00:00', total: 178000, items: ['T-Bone', 'Salad', 'Wine'] },
      { id: 1048, date: '2026-07-24T18:30:00', total: 132000, items: ['Filet Mignon', 'Soup', 'Juice'] },
      { id: 1049, date: '2026-07-22T19:45:00', total: 198000, items: ['2x Ribeye', 'Pasta', 'Beer'] },
      { id: 1050, date: '2026-07-20T20:15:00', total: 156000, items: ['Lamb', 'Risotto', 'Water'] },
    ],
  },
];

function formatCurrency(amount) {
  return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return 'Hozirgina';
  if (diffH < 24) return `${diffH} soat oldin`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD} kun oldin`;
  return d.toLocaleDateString('uz-UZ');
}

function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(<Star key={i} size={14} fill="var(--warning)" stroke="var(--warning)" />);
    } else if (i === full && half) {
      stars.push(<Star key={i} size={14} fill="var(--warning)" stroke="var(--warning)" style={{ opacity: 0.5 }} />);
    } else {
      stars.push(<Star key={i} size={14} fill="none" stroke="var(--border-strong)" />);
    }
  }
  return stars;
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    color: 'var(--text)',
    padding: '28px',
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  headerTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'var(--text)',
    margin: 0,
  },
  headerSubtitle: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    margin: 0,
    marginTop: '2px',
  },
  exportBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--primary)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(249,115,22,0.25)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  },
  statCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    transition: 'all 0.2s ease',
  },
  statIcon: (bg) => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),
  statValue: (color) => ({
    fontSize: '24px',
    fontWeight: '700',
    color: color || 'var(--text)',
  }),
  statLabel: {
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  tierGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  },
  tierCard: (tier, isActive) => ({
    background: isActive ? VIP_TIERS[tier].bg : 'var(--surface)',
    border: `1.5px solid ${isActive ? VIP_TIERS[tier].color + '55' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)',
    padding: '18px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: isActive ? `0 2px 12px ${VIP_TIERS[tier].color}18` : 'var(--shadow-sm)',
  }),
  filterBar: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '16px 20px',
    marginBottom: '20px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 14px 10px 40px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  filterTabs: {
    display: 'flex',
    gap: '4px',
    background: 'var(--bg)',
    borderRadius: 'var(--radius-sm)',
    padding: '4px',
    border: '1px solid var(--border)',
  },
  filterTab: (active) => ({
    padding: '8px 16px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: active ? 'var(--primary)' : 'transparent',
    color: active ? '#fff' : 'var(--text-muted)',
  }),
  selectWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  select: {
    padding: '8px 12px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text)',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
  },
  customerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  customerCard: (blacklisted) => ({
    background: 'var(--surface)',
    border: `1px solid ${blacklisted ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)',
    padding: '18px 20px',
    opacity: blacklisted ? 0.6 : 1,
    transition: 'all 0.2s ease',
  }),
  avatar: (color) => ({
    width: '50px',
    height: '50px',
    borderRadius: '14px',
    background: VIP_TIERS[color]?.bg || 'var(--bg)',
    border: `2px solid ${VIP_TIERS[color]?.color || 'var(--border)'}44`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
    color: VIP_TIERS[color]?.color || 'var(--text-muted)',
    flexShrink: 0,
  }),
  customerName: {
    fontWeight: '600',
    color: 'var(--text)',
    fontSize: '15px',
  },
  customerPhone: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    marginTop: '3px',
  },
  badge: (tier) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    background: VIP_TIERS[tier]?.bg || 'var(--bg)',
    color: VIP_TIERS[tier]?.color || 'var(--text-muted)',
    border: `1px solid ${VIP_TIERS[tier]?.color || 'var(--border)'}22`,
    flexShrink: 0,
  }),
  statItem: {
    textAlign: 'center',
    minWidth: '80px',
  },
  statItemValue: {
    fontWeight: '700',
    color: 'var(--text)',
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
  statItemLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  actionBtn: (variant) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: variant === 'danger' ? 'rgba(239,68,68,0.06)' : variant === 'success' ? 'rgba(34,197,94,0.06)' : 'var(--surface)',
    color: variant === 'danger' ? 'var(--danger)' : variant === 'success' ? 'var(--success)' : 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    flexShrink: 0,
  }),
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    width: '90%',
    maxWidth: '640px',
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: 'var(--shadow-lg)',
  },
  modalHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalBody: {
    padding: '24px',
  },
  modalFooter: {
    padding: '16px 24px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  sectionLabel: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontWeight: '600',
    display: 'block',
    marginBottom: '10px',
  },
  tierBtn: (active, color) => ({
    padding: '8px 16px',
    borderRadius: '10px',
    border: `2px solid ${active ? color : 'var(--border)'}`,
    background: active ? VIP_TIERS[Object.keys(VIP_TIERS).find(k => VIP_TIERS[k].color === color)]?.bg || 'var(--bg)' : 'transparent',
    color: active ? color : 'var(--text-muted)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }),
  modalStatBox: (color) => ({
    background: 'var(--bg)',
    borderRadius: 'var(--radius-sm)',
    padding: '16px',
    textAlign: 'center',
    border: '1px solid var(--border)',
  }),
  modalStatValue: (color) => ({
    fontSize: '20px',
    fontWeight: '700',
    color: color,
  }),
  modalStatLabel: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  toggleTrack: (active) => ({
    width: '48px',
    height: '26px',
    borderRadius: '13px',
    border: 'none',
    cursor: 'pointer',
    background: active ? 'var(--primary)' : 'var(--border-strong)',
    position: 'relative',
    transition: 'background 0.2s',
    flexShrink: 0,
  }),
  toggleKnob: (active) => ({
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#fff',
    position: 'absolute',
    top: '3px',
    left: active ? '25px' : '3px',
    transition: 'left 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  }),
  textarea: {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    resize: 'vertical',
    minHeight: '80px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  orderCard: {
    background: 'var(--bg)',
    borderRadius: 'var(--radius-sm)',
    padding: '14px 16px',
    border: '1px solid var(--border)',
  },
  orderItemTag: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    background: 'var(--surface-active)',
    padding: '4px 10px',
    borderRadius: '6px',
    display: 'inline-block',
  },
  cancelBtn: {
    padding: '10px 20px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  saveBtn: {
    padding: '10px 24px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'var(--primary)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(249,115,22,0.25)',
    transition: 'all 0.2s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'var(--text-muted)',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
  },
  favBox: {
    flex: 1,
    background: 'var(--bg)',
    borderRadius: 'var(--radius-sm)',
    padding: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid var(--border)',
  },
};

export default function AdminCustomers() {
  const store = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('Hammasi');
  const [sortBy, setSortBy] = useState('name');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [editTier, setEditTier] = useState('');
  const [blacklistReason, setBlacklistReason] = useState('');
  const [showBlacklistInput, setShowBlacklistInput] = useState(false);

  const tierCounts = useMemo(() => {
    const counts = { silver: 0, gold: 0, platinum: 0 };
    MOCK_CUSTOMERS.forEach(c => {
      if (c.vipTier === 'silver') counts.silver++;
      if (c.vipTier === 'gold') counts.gold++;
      if (c.vipTier === 'platinum') counts.platinum++;
    });
    return counts;
  }, []);

  const stats = useMemo(() => {
    const total = MOCK_CUSTOMERS.length;
    const vip = MOCK_CUSTOMERS.filter(c => c.vipTier !== 'oddiy').length;
    const active = MOCK_CUSTOMERS.filter(c => !c.blacklisted).length;
    const avgCheck = Math.round(MOCK_CUSTOMERS.reduce((s, c) => s + c.avgCheck, 0) / total);
    return { total, vip, active, avgCheck };
  }, []);

  const filteredCustomers = useMemo(() => {
    let list = [...MOCK_CUSTOMERS];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.favoriteDish.toLowerCase().includes(q)
      );
    }
    if (tierFilter !== 'Hammasi') {
      list = list.filter(c => c.vipTier === tierFilter.toLowerCase());
    }
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'totalOrders') list.sort((a, b) => b.totalOrders - a.totalOrders);
    if (sortBy === 'lastOrder') list.sort((a, b) => new Date(b.lastOrder) - new Date(a.lastOrder));
    return list;
  }, [search, tierFilter, sortBy]);

  const openDetail = (customer) => {
    setSelectedCustomer(customer);
    setEditNotes(customer.notes);
    setEditTier(customer.vipTier);
    setBlacklistReason('');
    setShowBlacklistInput(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>Mijozlar (CRM)</h1>
          <p style={styles.headerSubtitle}>Mijozlarni boshqarish va tahlil qilish</p>
        </div>
        <button style={styles.exportBtn} onClick={() => alert('Export CSV...')}>
          <Download size={16} />
          Export
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon('var(--primary-light)')}>
            <Users size={22} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <div style={styles.statValue()}>{stats.total}</div>
            <div style={styles.statLabel}>Jami mijozlar</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon('rgba(245,158,11,0.08)')}>
            <Crown size={22} style={{ color: 'var(--warning)' }} />
          </div>
          <div>
            <div style={styles.statValue('var(--warning)')}>{stats.vip}</div>
            <div style={styles.statLabel}>VIP mijozlar</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon('rgba(34,197,94,0.08)')}>
            <Activity size={22} style={{ color: 'var(--success)' }} />
          </div>
          <div>
            <div style={styles.statValue('var(--success)')}>{stats.active}</div>
            <div style={styles.statLabel}>Faol mijozlar</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon('rgba(249,115,22,0.08)')}>
            <DollarSign size={22} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <div style={styles.statValue('var(--primary)')}>
              {formatCurrency(stats.avgCheck).replace(" so'm", '')}
            </div>
            <div style={styles.statLabel}>O'rtacha chek</div>
          </div>
        </div>
      </div>

      <div style={styles.tierGrid}>
        {['silver', 'gold', 'platinum'].map(tier => (
          <div
            key={tier}
            style={styles.tierCard(tier, tierFilter === tier.charAt(0).toUpperCase() + tier.slice(1))}
            onClick={() =>
              setTierFilter(
                tierFilter === tier.charAt(0).toUpperCase() + tier.slice(1)
                  ? 'Hammasi'
                  : tier.charAt(0).toUpperCase() + tier.slice(1)
              )
            }
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Crown size={18} style={{ color: VIP_TIERS[tier].color }} />
              <span style={{ fontWeight: '600', color: VIP_TIERS[tier].color, fontSize: '15px' }}>
                {VIP_TIERS[tier].label}
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text)' }}>{tierCounts[tier]}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {VIP_TIERS[tier].minOrders}+ buyurtma
            </div>
          </div>
        ))}
      </div>

      <div style={styles.filterBar}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '240px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              style={styles.searchInput}
              type="text"
              placeholder="Ism, telefon yoki taom bo'yicha qidirish..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>
          <div style={styles.filterTabs}>
            {TIER_FILTER_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setTierFilter(opt)}
                style={styles.filterTab(tierFilter === opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          <div style={styles.selectWrap}>
            <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={styles.select}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={styles.customerList}>
        {filteredCustomers.length === 0 && (
          <div style={styles.emptyState}>
            <Users size={48} style={{ color: 'var(--border-strong)', marginBottom: '12px' }} />
            <p style={{ fontSize: '16px', margin: 0 }}>Mijozlar topilmadi</p>
          </div>
        )}
        {filteredCustomers.map(customer => {
          const tierInfo = VIP_TIERS[customer.vipTier];
          return (
            <div key={customer.id} style={styles.customerCard(customer.blacklisted)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={styles.avatar(customer.vipTier)}>
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div style={{ minWidth: '160px', flex: '1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={styles.customerName}>{customer.name}</span>
                    {customer.blacklisted && <Ban size={14} style={{ color: 'var(--danger)' }} />}
                  </div>
                  <div style={styles.customerPhone}>
                    <Phone size={12} />
                    <span>{customer.phone}</span>
                  </div>
                </div>

                <span style={styles.badge(customer.vipTier)}>
                  <Crown size={12} />
                  {tierInfo.label}
                </span>

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', flex: '1', justifyContent: 'flex-end' }}>
                  <div style={styles.statItem}>
                    <div style={styles.statItemValue}>
                      <ShoppingCart size={13} style={{ color: 'var(--primary)' }} />
                      {customer.totalOrders.toLocaleString()}
                    </div>
                    <div style={styles.statItemLabel}>buyurtmalar</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={{ ...styles.statItemValue, color: 'var(--primary)' }}>
                      {formatCurrency(customer.totalSpent)}
                    </div>
                    <div style={styles.statItemLabel}>umumiy xarajat</div>
                  </div>
                  <div style={{ ...styles.statItem, minWidth: '90px' }}>
                    <div style={styles.statItemValue}>
                      <Clock size={13} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {formatDate(customer.lastOrder)}
                      </span>
                    </div>
                    <div style={styles.statItemLabel}>oxirgi buyurtma</div>
                  </div>
                  <div style={{ ...styles.statItem, minWidth: '100px' }}>
                    <div style={styles.statItemValue}>
                      <Heart size={13} style={{ color: 'var(--danger)' }} />
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {customer.favoriteDish}
                      </span>
                    </div>
                    <div style={styles.statItemLabel}>sevimli taom</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={{ fontWeight: '600', color: 'var(--text)', fontSize: '14px' }}>
                      {formatCurrency(customer.avgCheck).replace(" so'm", '')}
                    </div>
                    <div style={styles.statItemLabel}>o'rtacha chek</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {renderStars(customer.rating)}
                    <span style={{ fontSize: '13px', color: 'var(--warning)', marginLeft: '4px' }}>
                      {customer.rating}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    style={styles.actionBtn('default')}
                    onClick={() => openDetail(customer)}
                    title="Ko'rish"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    style={styles.actionBtn('default')}
                    onClick={() => openDetail(customer)}
                    title="Tahrirlash"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    style={styles.actionBtn(customer.blacklisted ? 'success' : 'danger')}
                    onClick={() => openDetail(customer)}
                    title={customer.blacklisted ? 'Blockdan chiqarish' : 'Blocklash'}
                  >
                    <Ban size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && selectedCustomer && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: VIP_TIERS[selectedCustomer.vipTier].bg,
                  border: `2px solid ${VIP_TIERS[selectedCustomer.vipTier].color}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: VIP_TIERS[selectedCustomer.vipTier].color,
                }}>
                  {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>
                    {selectedCustomer.name}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <Phone size={13} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {selectedCustomer.phone}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'background 0.2s' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={{ marginBottom: '24px' }}>
                <label style={styles.sectionLabel}>VIP Daraja</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.entries(VIP_TIERS).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setEditTier(key)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '10px',
                        border: `2px solid ${editTier === key ? val.color : 'var(--border)'}`,
                        background: editTier === key ? val.bg : 'transparent',
                        color: editTier === key ? val.color : 'var(--text-muted)',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                <div style={styles.modalStatBox('var(--primary)')}>
                  <div style={styles.modalStatValue('var(--primary)')}>
                    {selectedCustomer.totalOrders.toLocaleString()}
                  </div>
                  <div style={styles.modalStatLabel}>Jami buyurtmalar</div>
                </div>
                <div style={styles.modalStatBox('var(--success)')}>
                  <div style={styles.modalStatValue('var(--success)')}>
                    {formatCurrency(selectedCustomer.totalSpent)}
                  </div>
                  <div style={styles.modalStatLabel}>Umumiy xarajat</div>
                </div>
                <div style={styles.modalStatBox('var(--primary)')}>
                  <div style={styles.modalStatValue('var(--primary)')}>
                    {formatCurrency(selectedCustomer.avgCheck).replace(" so'm", '')}
                  </div>
                  <div style={styles.modalStatLabel}>O'rtacha chek</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <div style={styles.favBox}>
                  <Heart size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sevimli taom</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
                      {selectedCustomer.favoriteDish}
                    </div>
                  </div>
                </div>
                <div style={styles.favBox}>
                  <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>{renderStars(selectedCustomer.rating)}</div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Reyting</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--warning)' }}>
                      {selectedCustomer.rating} / 5.0
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '16px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Ban size={18} style={{ color: selectedCustomer.blacklisted ? 'var(--danger)' : 'var(--text-muted)' }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>Block ro'yxati</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {selectedCustomer.blacklisted ? 'Bloklangan' : 'Faol'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBlacklistInput(!showBlacklistInput)}
                    style={styles.toggleTrack(selectedCustomer.blacklisted)}
                  >
                    <div style={styles.toggleKnob(selectedCustomer.blacklisted)} />
                  </button>
                </div>
                {showBlacklistInput && (
                  <div style={{ marginTop: '12px' }}>
                    <input
                      style={styles.searchInput}
                      type="text"
                      placeholder="Sabab kiriting..."
                      value={blacklistReason}
                      onChange={e => setBlacklistReason(e.target.value)}
                      onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ ...styles.sectionLabel, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={14} /> Eslatmalar
                </label>
                <textarea
                  style={styles.textarea}
                  rows={3}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                />
              </div>

              <div>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: 'var(--text)',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <Clock size={16} style={{ color: 'var(--primary)' }} />
                  Oxirgi buyurtmalar
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedCustomer.orders.map(order => (
                    <div key={order.id} style={styles.orderCard}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          {formatShortDate(order.date)}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {order.items.map((item, i) => (
                          <span key={i} style={styles.orderItemTag}>{item}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={closeModal}>Bekor qilish</button>
              <button style={styles.saveBtn} onClick={() => { alert('Saqlandi!'); closeModal(); }}>
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}