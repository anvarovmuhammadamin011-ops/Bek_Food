import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';
import {
  Users, Crown, Activity, DollarSign, Star, Phone, ShoppingCart, Clock,
  Edit, Ban, Eye, Search, ArrowUpDown, Download, X, Heart, MessageSquare
} from 'lucide-react';
import { Card, StatCard, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Avatar } from '../../components/ui/Avatar';

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
  { id: 1, name: 'Alisher Navoiy', phone: '+998 90 123 45 67', vipTier: 'platinum', totalOrders: 1247, totalSpent: 8950000, lastOrder: '2026-07-27T18:30:00', favoriteDish: 'T-Bone Steak', avgCheck: 7180, rating: 4.9, blacklisted: false, notes: "VIP mijoz. Har doim 123-stolni so'raydi.", orders: [
    { id: 1001, date: '2026-07-27T18:30:00', total: 125000, items: ['T-Bone Steak', 'Caesar Salad', 'Red Wine'] },
    { id: 1002, date: '2026-07-25T19:15:00', total: 89000, items: ['Ribeye Steak', 'French Fries'] },
    { id: 1003, date: '2026-07-22T20:00:00', total: 145000, items: ['Wagyu Steak', 'Mushroom Soup', 'Sparkling Water'] },
    { id: 1004, date: '2026-07-20T17:45:00', total: 67000, items: ['Grilled Chicken', 'Coleslaw'] },
    { id: 1005, date: '2026-07-18T19:30:00', total: 112000, items: ['Lamb Chops', 'Garlic Bread', 'Juice'] },
  ] },
  { id: 2, name: 'Dilshod Karimov', phone: '+998 91 234 56 78', vipTier: 'gold', totalOrders: 634, totalSpent: 4250000, lastOrder: '2026-07-26T20:15:00', favoriteDish: 'Ribeye Steak', avgCheck: 6700, rating: 4.7, blacklisted: false, notes: "Kechki payt keladi. Uzum sharbat so'raydi.", orders: [
    { id: 1006, date: '2026-07-26T20:15:00', total: 98000, items: ['Ribeye Steak', 'Mashed Potatoes'] },
    { id: 1007, date: '2026-07-24T19:00:00', total: 76000, items: ['Filet Mignon', 'Salad'] },
    { id: 1008, date: '2026-07-21T20:30:00', total: 115000, items: ['Wagyu Steak', 'Wine'] },
  ] },
  { id: 3, name: 'Nodira Rashidova', phone: '+998 93 345 67 89', vipTier: 'silver', totalOrders: 189, totalSpent: 1560000, lastOrder: '2026-07-25T12:30:00', favoriteDish: 'Caesar Salad', avgCheck: 8250, rating: 4.5, blacklisted: false, notes: "Tushlik payt keladi. Go'sht kam yeydi.", orders: [
    { id: 1011, date: '2026-07-25T12:30:00', total: 45000, items: ['Caesar Salad', 'Soup'] },
    { id: 1012, date: '2026-07-23T13:00:00', total: 62000, items: ['Grilled Chicken', 'Juice'] },
  ] },
  { id: 4, name: 'Bobur Mirzoev', phone: '+998 94 456 78 90', vipTier: 'platinum', totalOrders: 1582, totalSpent: 12800000, lastOrder: '2026-07-28T11:00:00', favoriteDish: 'Wagyu Steak', avgCheck: 8090, rating: 5.0, blacklisted: false, notes: 'Eng sodiq mijoz.', orders: [] },
  { id: 5, name: 'Gulnara Alimova', phone: '+998 95 567 89 01', vipTier: 'gold', totalOrders: 521, totalSpent: 3890000, lastOrder: '2026-07-27T19:45:00', favoriteDish: 'Grilled Salmon', avgCheck: 7470, rating: 4.6, blacklisted: false, notes: "Do'stlari bilan keladi.", orders: [] },
  { id: 6, name: 'Sardor Raximov', phone: '+998 97 678 90 12', vipTier: 'oddiy', totalOrders: 42, totalSpent: 320000, lastOrder: '2026-07-20T13:00:00', favoriteDish: 'Chicken Steak', avgCheck: 7620, rating: 4.2, blacklisted: false, notes: 'Yangi mijoz.', orders: [] },
  { id: 7, name: 'Malika Ismoilova', phone: '+998 98 789 01 23', vipTier: 'silver', totalOrders: 156, totalSpent: 1120000, lastOrder: '2026-07-26T14:00:00', favoriteDish: 'Pasta Carbonara', avgCheck: 7180, rating: 4.3, blacklisted: false, notes: "Cheklovlar: yong'oq allergiya.", orders: [] },
  { id: 8, name: 'Jasur Toshmatov', phone: '+998 99 890 12 34', vipTier: 'oddiy', totalOrders: 18, totalSpent: 145000, lastOrder: '2026-07-15T20:30:00', favoriteDish: 'Burger', avgCheck: 8060, rating: 3.8, blacklisted: true, notes: 'Qoidabuzarlik: kechikdi.', orders: [] },
  { id: 9, name: 'Feruza Xolmatova', phone: '+998 90 901 23 45', vipTier: 'gold', totalOrders: 578, totalSpent: 4560000, lastOrder: '2026-07-28T12:00:00', favoriteDish: 'Lamb Chops', avgCheck: 7890, rating: 4.8, blacklisted: false, notes: "Tadbirlar uchun ko'p buyurtma beradi.", orders: [] },
  { id: 10, name: 'Otabek Sultarov', phone: '+998 91 012 34 56', vipTier: 'platinum', totalOrders: 1893, totalSpent: 15600000, lastOrder: '2026-07-28T19:00:00', favoriteDish: 'Wagyu Steak', avgCheck: 8240, rating: 4.9, blacklisted: false, notes: "Restoran do'sti.", orders: [] },
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

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function AdminCustomers() {
  const store = useStore();
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
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.favoriteDish.toLowerCase().includes(q));
    }
    if (tierFilter !== 'Hammasi') list = list.filter(c => c.vipTier === tierFilter.toLowerCase());
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div variants={itemVariants} style={{ padding: '28px 0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Mijozlar (CRM)</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '4px 0 0' }}>Mijozlarni boshqarish va tahlil qilish</p>
          </div>
          <button onClick={() => alert('Export CSV...')}
            style={{ padding: '10px 20px', borderRadius: 12, border: 'none', background: 'var(--primary)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px rgba(249,115,22,0.25)' }}>
            <Download size={16} /> Export
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <Card padding="md" variant="elevated" hoverable>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={22} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>{stats.total}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Jami mijozlar</div>
            </div>
          </div>
        </Card>
        <Card padding="md" variant="elevated" hoverable>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245,158,11,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Crown size={22} color="var(--warning)" />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--warning)' }}>{stats.vip}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>VIP mijozlar</div>
            </div>
          </div>
        </Card>
        <Card padding="md" variant="elevated" hoverable>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(34,197,94,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={22} color="var(--success)" />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--success)' }}>{stats.active}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Faol mijozlar</div>
            </div>
          </div>
        </Card>
        <Card padding="md" variant="elevated" hoverable>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(249,115,22,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={22} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(stats.avgCheck).replace(" so'm", '')}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>O'rtacha chek</div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
        {['silver', 'gold', 'platinum'].map(tier => {
          const isActive = tierFilter === tier.charAt(0).toUpperCase() + tier.slice(1);
          return (
            <div key={tier} onClick={() => setTierFilter(isActive ? 'Hammasi' : tier.charAt(0).toUpperCase() + tier.slice(1))}
              style={{
                background: isActive ? VIP_TIERS[tier].bg : 'var(--surface)',
                border: `1.5px solid ${isActive ? VIP_TIERS[tier].color + '55' : 'var(--border)'}`,
                borderRadius: 12, padding: '18px 20px', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: isActive ? `0 2px 12px ${VIP_TIERS[tier].color}18` : '0 1px 2px rgba(0,0,0,0.04)',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Crown size={18} color={VIP_TIERS[tier].color} />
                <span style={{ fontWeight: 600, color: VIP_TIERS[tier].color, fontSize: 15 }}>{VIP_TIERS[tier].label}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>{tierCounts[tier]}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{VIP_TIERS[tier].minOrders}+ buyurtma</div>
            </div>
          );
        })}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card padding="md" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" placeholder="Ism, telefon yoki taom bo'yicha qidirish..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 40px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg)', borderRadius: 10, padding: 4, border: '1px solid var(--border)' }}>
              {TIER_FILTER_OPTIONS.map(opt => (
                <button key={opt} onClick={() => setTierFilter(opt)}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: tierFilter === opt ? 'var(--primary)' : 'transparent', color: tierFilter === opt ? '#fff' : 'var(--text-muted)', transition: 'all 0.2s' }}>
                  {opt}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ArrowUpDown size={14} color="var(--text-muted)" />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ padding: '8px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                {SORT_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredCustomers.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
            <Users size={48} style={{ color: 'var(--border-strong)', marginBottom: 12 }} />
            <p style={{ fontSize: 16, margin: 0 }}>Mijozlar topilmadi</p>
          </div>
        )}
        {filteredCustomers.map(customer => {
          const tierInfo = VIP_TIERS[customer.vipTier];
          const initials = customer.name.split(' ').map(n => n[0]).join('');
          return (
            <motion.div key={customer.id} variants={itemVariants}
              style={{
                background: 'var(--surface)', border: '1px solid ' + (customer.blacklisted ? 'rgba(239,68,68,0.2)' : 'var(--border)'),
                borderRadius: 12, padding: '18px 20px', opacity: customer.blacklisted ? 0.6 : 1,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 14, background: tierInfo.bg,
                  border: `2px solid ${tierInfo.color}44`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 16, fontWeight: 700, color: tierInfo.color, flexShrink: 0,
                }}>
                  {initials}
                </div>
                <div style={{ minWidth: 160, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: 15 }}>{customer.name}</span>
                    {customer.blacklisted && <Ban size={14} color="var(--danger)" />}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Phone size={12} /> {customer.phone}
                  </div>
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20,
                  fontSize: 12, fontWeight: 600, background: tierInfo.bg, color: tierInfo.color,
                  border: `1px solid ${tierInfo.color}22`,
                }}>
                  <Crown size={12} /> {tierInfo.label}
                </span>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <ShoppingCart size={13} color="var(--primary)" /> {customer.totalOrders.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>buyurtmalar</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 15, fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(customer.totalSpent)}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>umumiy xarajat</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <Clock size={13} color="var(--text-muted)" />
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{formatDate(customer.lastOrder)}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>oxirgi buyurtma</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Star size={14} fill="var(--warning)" stroke="var(--warning)" />
                    <span style={{ fontSize: 13, color: 'var(--warning)', fontWeight: 600 }}>{customer.rating}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => openDetail(customer)}
                    style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Eye size={16} />
                  </button>
                  <button onClick={() => openDetail(customer)}
                    style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Edit size={16} />
                  </button>
                  <button onClick={() => openDetail(customer)}
                    style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)', background: customer.blacklisted ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', color: customer.blacklisted ? 'var(--success)' : 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Ban size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {showModal && selectedCustomer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, width: '90%', maxWidth: 640, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, background: VIP_TIERS[selectedCustomer.vipTier].bg,
                    border: `2px solid ${VIP_TIERS[selectedCustomer.vipTier].color}44`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700,
                    color: VIP_TIERS[selectedCustomer.vipTier].color,
                  }}>
                    {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{selectedCustomer.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <Phone size={13} color="var(--text-muted)" />
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{selectedCustomer.phone}</span>
                    </div>
                  </div>
                </div>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 8, borderRadius: 8 }}><X size={20} /></button>
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 10 }}>VIP Daraja</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {Object.entries(VIP_TIERS).map(([key, val]) => (
                      <button key={key} onClick={() => setEditTier(key)}
                        style={{ padding: '8px 16px', borderRadius: 10, border: `2px solid ${editTier === key ? val.color : 'var(--border)'}`, background: editTier === key ? val.bg : 'transparent', color: editTier === key ? val.color : 'var(--text-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        {val.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                  {[
                    { label: 'Jami buyurtmalar', value: selectedCustomer.totalOrders.toLocaleString(), color: 'var(--primary)' },
                    { label: 'Umumiy xarajat', value: formatCurrency(selectedCustomer.totalSpent), color: 'var(--success)' },
                    { label: "O'rtacha chek", value: formatCurrency(selectedCustomer.avgCheck).replace(" so'm", ''), color: 'var(--primary)' },
                  ].map((s, i) => (
                    <div key={i} style={{ background: 'var(--bg)', borderRadius: 10, padding: 16, textAlign: 'center', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                  <div style={{ flex: 1, background: 'var(--bg)', borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border)' }}>
                    <Heart size={18} color="var(--danger)" style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sevimli taom</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{selectedCustomer.favoriteDish}</div>
                    </div>
                  </div>
                  <div style={{ flex: 1, background: 'var(--bg)', borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border)' }}>
                    <Star size={18} fill="var(--warning)" stroke="var(--warning)" flexShrink={0} />
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Reyting</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--warning)' }}>{selectedCustomer.rating} / 5.0</div>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 24, background: 'var(--bg)', borderRadius: 10, padding: 16, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Ban size={18} color={selectedCustomer.blacklisted ? 'var(--danger)' : 'var(--text-muted)'} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Block ro'yxati</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedCustomer.blacklisted ? 'Bloklangan' : 'Faol'}</div>
                      </div>
                    </div>
                    <button onClick={() => setShowBlacklistInput(!showBlacklistInput)}
                      style={{ width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', background: selectedCustomer.blacklisted ? 'var(--primary)' : 'var(--border-strong)', position: 'relative', transition: 'background 0.2s' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: selectedCustomer.blacklisted ? 25 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                    </button>
                  </div>
                  {showBlacklistInput && (
                    <div style={{ marginTop: 12 }}>
                      <input type="text" placeholder="Sabab kiriting..." value={blacklistReason} onChange={e => setBlacklistReason(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 10 }}>
                    <MessageSquare size={14} /> Eslatmalar
                  </label>
                  <textarea rows={3} value={editNotes} onChange={e => setEditNotes(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none', resize: 'vertical', minHeight: 80, fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={16} color="var(--primary)" /> Oxirgi buyurtmalar
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedCustomer.orders.length === 0 && <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>Buyurtmalar yo'q</p>}
                    {selectedCustomer.orders.map(order => (
                      <div key={order.id} style={{ background: 'var(--bg)', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{formatShortDate(order.date)}</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(order.total)}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {order.items.map((item, i) => (
                            <span key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', background: 'var(--surface)', padding: '4px 10px', borderRadius: 6 }}>{item}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button onClick={closeModal}
                  style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Bekor qilish</button>
                <button onClick={() => { alert('Saqlandi!'); closeModal(); }}
                  style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: 'var(--primary)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(249,115,22,0.25)' }}>Saqlash</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
