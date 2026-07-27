import { useState, useMemo } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
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
  Filter,
  ArrowUpDown,
  Download,
  X,
  TrendingUp,
  Heart,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';

const VIP_TIERS = {
  oddiy: { label: 'Oddiy', color: '#9ca3af', bg: 'rgba(156,163,175,0.15)', minOrders: 0 },
  silver: { label: 'Silver', color: '#c0c0c0', bg: 'rgba(192,192,192,0.15)', minOrders: 100 },
  gold: { label: 'Gold', color: '#ffd700', bg: 'rgba(255,215,0,0.15)', minOrders: 500 },
  platinum: { label: 'Platinum', color: '#e5e4e2', bg: 'rgba(229,228,226,0.15)', minOrders: 1000 },
};

const TIER_FILTER_OPTIONS = ['Hammasi', 'Silver', 'Gold', 'Platinum'];
const SORT_OPTIONS = [
  { value: 'name', label: 'Ism bo\'yicha' },
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
    notes: 'VIP mijoz. Har doim 123-stolni so\'raydi.',
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
    notes: 'Kechki payt keladi. Uzum sharbat so\'raydi.',
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
    notes: 'Tushlik payt keladi. Go\'sht kam yeydi.',
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
    notes: 'Do\'stlari bilan keladi. Ko\'p buyurtma beradi.',
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
    notes: 'Cheklovlar: yong\'oq allergiya.',
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
    notes: 'Tadbirlar uchun ko\'p buyurtma beradi.',
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
    notes: 'Restoran do\'sti. Tadbirlarga taklif qilinadi.',
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
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m';
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
      stars.push(<Star key={i} size={14} fill="#ffd700" stroke="#ffd700" />);
    } else if (i === full && half) {
      stars.push(<Star key={i} size={14} fill="#ffd700" stroke="#ffd700" style={{ opacity: 0.5 }} />);
    } else {
      stars.push(<Star key={i} size={14} fill="none" stroke="#4a4a4a" />);
    }
  }
  return stars;
}

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

  const tierCardStyle = (tier) => ({
    background: VIP_TIERS[tier].bg,
    border: `1px solid ${VIP_TIERS[tier].color}33`,
    borderRadius: '12px',
    padding: '16px 20px',
    flex: '1',
    minWidth: '160px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#e5e5e5', padding: '24px' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 16px; transition: all 0.2s ease; }
        .card-hover:hover { border-color: #c8a97e44; box-shadow: 0 4px 20px rgba(200,169,126,0.08); transform: translateY(-2px); }
        .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
        .btn-primary { background: linear-gradient(135deg, #c8a97e, #a88a5a); color: #0f0f0f; }
        .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .input { width: 100%; padding: 10px 16px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; color: #e5e5e5; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .input:focus { border-color: #c8a97e; }
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-red { background: rgba(239,68,68,0.15); color: #ef4444; }
        .badge-green { background: rgba(34,197,94,0.15); color: #22c55e; }
        .badge-yellow { background: rgba(250,204,21,0.15); color: #facc15; }
        .animate-fade-in { animation: fadeIn 0.4s ease forwards; }
        .stagger > *:nth-child(1) { animation-delay: 0.05s; }
        .stagger > *:nth-child(2) { animation-delay: 0.1s; }
        .stagger > *:nth-child(3) { animation-delay: 0.15s; }
        .stagger > *:nth-child(4) { animation-delay: 0.2s; }
        .stagger > *:nth-child(5) { animation-delay: 0.25s; }
        .stagger > *:nth-child(6) { animation-delay: 0.3s; }
        .stagger > *:nth-child(7) { animation-delay: 0.35s; }
        .stagger > *:nth-child(8) { animation-delay: 0.4s; }
        .stagger > *:nth-child(9) { animation-delay: 0.45s; }
        .stagger > *:nth-child(10) { animation-delay: 0.5s; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
        .modal-content { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 16px; width: 90%; max-width: 640px; max-height: 85vh; overflow-y: auto; animation: scaleIn 0.25s ease; }
        .modal-content::-webkit-scrollbar { width: 6px; }
        .modal-content::-webkit-scrollbar-track { background: transparent; }
        .modal-content::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', animation: 'fadeIn 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn"
            style={{ background: '#1a1a1a', border: '1px solid #333', color: '#e5e5e5', padding: '10px' }}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: 0 }}>Mijozlar (CRM)</h1>
            <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Mijozlarni boshqarish va tahlil qilish</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Export CSV...')}>
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }} className="stagger">
        <div className="card animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(200,169,126,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} color="#c8a97e" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>{stats.total}</div>
            <div style={{ fontSize: '13px', color: '#888' }}>Jami mijozlar</div>
          </div>
        </div>
        <div className="card animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,215,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Crown size={22} color="#ffd700" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#ffd700' }}>{stats.vip}</div>
            <div style={{ fontSize: '13px', color: '#888' }}>VIP mijozlar</div>
          </div>
        </div>
        <div className="card animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={22} color="#22c55e" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}>{stats.active}</div>
            <div style={{ fontSize: '13px', color: '#888' }}>Faol mijozlar</div>
          </div>
        </div>
        <div className="card animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} color="#3b82f6" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>{formatCurrency(stats.avgCheck).replace(" so'm", '')}</div>
            <div style={{ fontSize: '13px', color: '#888' }}>O'rtacha chek</div>
          </div>
        </div>
      </div>

      {/* VIP Tier Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }} className="stagger">
        {['silver', 'gold', 'platinum'].map(tier => (
          <div
            key={tier}
            className="card animate-fade-in"
            style={tierCardStyle(tier)}
            onClick={() => setTierFilter(tierFilter === tier ? 'Hammasi' : tier.charAt(0).toUpperCase() + tier.slice(1))}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Crown size={18} color={VIP_TIERS[tier].color} />
              <span style={{ fontWeight: '600', color: VIP_TIERS[tier].color, fontSize: '15px' }}>{VIP_TIERS[tier].label}</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff' }}>{tierCounts[tier]}</div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{VIP_TIERS[tier].minOrders}+ buyurtma</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="input"
              type="text"
              placeholder="Ism, telefon yoki taom bo'yicha qidirish..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '6px', background: '#111', borderRadius: '8px', padding: '4px' }}>
            {TIER_FILTER_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setTierFilter(opt)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: tierFilter === opt ? 'linear-gradient(135deg, #c8a97e, #a88a5a)' : 'transparent',
                  color: tierFilter === opt ? '#0f0f0f' : '#888',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={14} color="#888" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '8px 12px',
                background: '#111',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#e5e5e5',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredCustomers.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '48px 20px', color: '#666' }}>
            <Users size={48} color="#444" style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '16px', margin: 0 }}>Mijozlar topilmadi</p>
          </div>
        )}
        {filteredCustomers.map((customer, idx) => {
          const tierInfo = VIP_TIERS[customer.vipTier];
          return (
            <div
              key={customer.id}
              className="card card-hover animate-fade-in"
              style={{
                padding: '18px 20px',
                opacity: customer.blacklisted ? 0.5 : 1,
                border: customer.blacklisted ? '1px solid #ef444433' : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {/* Avatar */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: `linear-gradient(135deg, ${tierInfo.color}33, ${tierInfo.color}11)`,
                  border: `2px solid ${tierInfo.color}55`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: tierInfo.color,
                  flexShrink: 0,
                }}>
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </div>

                {/* Name & Phone */}
                <div style={{ minWidth: '160px', flex: '1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#fff', fontSize: '15px' }}>{customer.name}</span>
                    {customer.blacklisted && <Ban size={14} color="#ef4444" />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                    <Phone size={12} color="#666" />
                    <span style={{ fontSize: '13px', color: '#888' }}>{customer.phone}</span>
                  </div>
                </div>

                {/* VIP Badge */}
                <span className={`badge ${customer.vipTier === 'gold' ? 'badge-yellow' : customer.vipTier === 'platinum' ? 'badge-green' : customer.vipTier === 'silver' ? '' : ''}`}
                  style={customer.vipTier === 'silver' ? { background: 'rgba(192,192,192,0.15)', color: '#c0c0c0' } : customer.vipTier === 'oddiy' ? { background: 'rgba(156,163,175,0.15)', color: '#9ca3af' } : {}}
                >
                  <Crown size={12} />
                  {tierInfo.label}
                </span>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', flex: '1', justifyContent: 'flex-end' }}>
                  <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <ShoppingCart size={13} color="#c8a97e" />
                      <span style={{ fontWeight: '700', color: '#fff', fontSize: '15px' }}>{customer.totalOrders.toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>buyurtmalar</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '100px' }}>
                    <div style={{ fontWeight: '700', color: '#c8a97e', fontSize: '15px' }}>{formatCurrency(customer.totalSpent)}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>umumiy xarajat</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '90px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Clock size={13} color="#888" />
                      <span style={{ fontSize: '13px', color: '#aaa' }}>{formatDate(customer.lastOrder)}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>oxirgi buyurtma</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '100px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Heart size={13} color="#ef4444" />
                      <span style={{ fontSize: '13px', color: '#aaa' }}>{customer.favoriteDish}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>sevimli taom</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '70px' }}>
                    <div style={{ fontWeight: '600', color: '#fff', fontSize: '14px' }}>{formatCurrency(customer.avgCheck).replace(" so'm", '')}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>o'rtacha chek</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {renderStars(customer.rating)}
                    <span style={{ fontSize: '13px', color: '#ffd700', marginLeft: '4px' }}>{customer.rating}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button
                    className="btn"
                    style={{ background: '#222', border: '1px solid #333', color: '#e5e5e5', padding: '8px 12px', fontSize: '12px' }}
                    onClick={() => openDetail(customer)}
                    title="Ko'rish"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    className="btn"
                    style={{ background: '#222', border: '1px solid #333', color: '#c8a97e', padding: '8px 12px', fontSize: '12px' }}
                    onClick={() => openDetail(customer)}
                    title="Tahrirlash"
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    className="btn"
                    style={{
                      background: customer.blacklisted ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      border: `1px solid ${customer.blacklisted ? '#22c55e33' : '#ef444433'}`,
                      color: customer.blacklisted ? '#22c55e' : '#ef4444',
                      padding: '8px 12px',
                      fontSize: '12px',
                    }}
                    onClick={() => openDetail(customer)}
                    title={customer.blacklisted ? 'Blockdan chiqarish' : 'Blocklash'}
                  >
                    <Ban size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Detail Modal */}
      {showModal && selectedCustomer && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '0' }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #2a2a2a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#111',
              borderRadius: '16px 16px 0 0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: `linear-gradient(135deg, ${VIP_TIERS[selectedCustomer.vipTier].color}33, ${VIP_TIERS[selectedCustomer.vipTier].color}11)`,
                  border: `2px solid ${VIP_TIERS[selectedCustomer.vipTier].color}55`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: VIP_TIERS[selectedCustomer.vipTier].color,
                }}>
                  {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#fff' }}>{selectedCustomer.name}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <Phone size={13} color="#888" />
                    <span style={{ fontSize: '13px', color: '#888' }}>{selectedCustomer.phone}</span>
                  </div>
                </div>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '8px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {/* VIP Tier Selector */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '13px', color: '#888', fontWeight: '600', display: 'block', marginBottom: '8px' }}>VIP Daraja</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {Object.entries(VIP_TIERS).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setEditTier(key)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: `2px solid ${editTier === key ? val.color : '#333'}`,
                        background: editTier === key ? val.bg : 'transparent',
                        color: editTier === key ? val.color : '#888',
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

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                <div style={{ background: '#111', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: '#c8a97e' }}>{selectedCustomer.totalOrders.toLocaleString()}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Jami buyurtmalar</div>
                </div>
                <div style={{ background: '#111', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: '#22c55e' }}>{formatCurrency(selectedCustomer.totalSpent)}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Umumiy xarajat</div>
                </div>
                <div style={{ background: '#111', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: '#3b82f6' }}>{formatCurrency(selectedCustomer.avgCheck).replace(" so'm", '')}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>O'rtacha chek</div>
                </div>
              </div>

              {/* Favorite & Rating */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <div style={{ flex: 1, background: '#111', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Heart size={18} color="#ef4444" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Sevimli taom</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{selectedCustomer.favoriteDish}</div>
                  </div>
                </div>
                <div style={{ flex: 1, background: '#111', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>{renderStars(selectedCustomer.rating)}</div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Reyting</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffd700' }}>{selectedCustomer.rating} / 5.0</div>
                  </div>
                </div>
              </div>

              {/* Blacklist Toggle */}
              <div style={{ marginBottom: '24px', background: '#111', borderRadius: '10px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Ban size={18} color={selectedCustomer.blacklisted ? '#ef4444' : '#666'} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Block ro'yxati</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{selectedCustomer.blacklisted ? 'Bloklangan' : 'Faol'}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBlacklistInput(!showBlacklistInput)}
                    style={{
                      width: '48px',
                      height: '26px',
                      borderRadius: '13px',
                      border: 'none',
                      cursor: 'pointer',
                      background: selectedCustomer.blacklisted ? '#ef4444' : '#333',
                      position: 'relative',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      top: '3px',
                      left: selectedCustomer.blacklisted ? '25px' : '3px',
                      transition: 'left 0.2s',
                    }} />
                  </button>
                </div>
                {showBlacklistInput && (
                  <div style={{ marginTop: '12px' }}>
                    <input
                      className="input"
                      type="text"
                      placeholder="Sabab kiriting..."
                      value={blacklistReason}
                      onChange={e => setBlacklistReason(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '13px', color: '#888', fontWeight: '600', display: 'block', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={14} /> Eslatmalar
                </label>
                <textarea
                  className="input"
                  rows={3}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  style={{ resize: 'vertical', minHeight: '80px' }}
                />
              </div>

              {/* Order History */}
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="#c8a97e" />
                  Oxirgi buyurtmalar
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedCustomer.orders.map(order => (
                    <div key={order.id} style={{ background: '#111', borderRadius: '10px', padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', color: '#888' }}>{formatShortDate(order.date)}</span>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#c8a97e' }}>{formatCurrency(order.total)}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {order.items.map((item, i) => (
                          <span key={i} style={{ fontSize: '12px', color: '#aaa', background: '#1a1a1a', padding: '3px 8px', borderRadius: '4px' }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #2a2a2a', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn" style={{ background: '#222', border: '1px solid #333', color: '#e5e5e5' }} onClick={closeModal}>
                Bekor qilish
              </button>
              <button className="btn btn-primary" onClick={() => { alert("Saqlandi!"); closeModal(); }}>
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}