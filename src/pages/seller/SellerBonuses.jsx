import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Gift,
  Percent,
  Phone,
  CircleDollarSign,
  Inbox,
} from 'lucide-react';

export default function SellerBonuses() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');

  const s = {
    page: {
      minHeight: '100%',
      background: 'var(--bg)',
      paddingBottom: 100,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 16px 12px',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--text)',
    },
    title: {
      fontSize: 20,
      fontWeight: 700,
      color: 'var(--text)',
      margin: 0,
      letterSpacing: '-0.01em',
    },
    content: {
      padding: '0 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    },
    heroCard: {
      background: 'linear-gradient(135deg, var(--primary) 0%, #FB923C 100%)',
      borderRadius: 'var(--radius)',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    },
    heroGlow: {
      position: 'absolute',
      top: -20,
      right: -20,
      width: 100,
      height: 100,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
    heroIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      background: 'rgba(255,255,255,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    heroTitle: {
      fontSize: 18,
      fontWeight: 700,
      color: '#fff',
      margin: '0 0 4px 0',
    },
    heroDesc: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.8)',
      margin: 0,
      lineHeight: 1.4,
    },
    formCard: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 20,
    },
    formTitle: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--text)',
      margin: '0 0 16px 0',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    fieldGroup: {
      marginBottom: 14,
    },
    fieldLabel: {
      display: 'block',
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-secondary)',
      marginBottom: 6,
    },
    phoneRow: {
      display: 'flex',
      alignItems: 'center',
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden',
      transition: 'border-color 0.15s',
    },
    phonePrefix: {
      padding: '10px 0 10px 12px',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-muted)',
      background: 'var(--surface-active)',
      borderRight: '1px solid var(--border)',
      flexShrink: 0,
    },
    phoneInput: {
      flex: 1,
      padding: '10px 12px',
      border: 'none',
      background: 'transparent',
      color: 'var(--text)',
      fontSize: 13,
      outline: 'none',
    },
    amountInput: {
      width: '100%',
      padding: '10px 12px',
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text)',
      fontSize: 13,
      outline: 'none',
      transition: 'border-color 0.15s',
      boxSizing: 'border-box',
    },
    submitBtn: {
      width: '100%',
      padding: '12px',
      background: 'var(--primary)',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      color: '#fff',
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      transition: 'opacity 0.15s',
      marginTop: 4,
    },
    emptyCard: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 20,
    },
    emptyTitle: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--text)',
      margin: '0 0 12px 0',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    emptyState: {
      textAlign: 'center',
      padding: '24px 0',
    },
    historyCard: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 20,
    },
    historyTitle: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--text)',
      margin: '0 0 14px 0',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    statGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 8,
    },
    statItem: {
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: '12px 8px',
      textAlign: 'center',
    },
    statValue: {
      fontSize: 18,
      fontWeight: 700,
      color: 'var(--text)',
      fontVariantNumeric: 'tabular-nums',
      margin: '2px 0',
    },
    statLabel: {
      fontSize: 10,
      fontWeight: 500,
      color: 'var(--text-muted)',
    },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.headerLeft}>
          <button onClick={() => navigate(-1)} style={s.backBtn}>
            <ChevronLeft size={18} />
          </button>
          <h1 style={s.title}>Bonuslar</h1>
        </div>
      </div>

      <div style={s.content}>
        <div style={s.heroCard}>
          <div style={s.heroGlow} />
          <div style={s.heroIcon}>
            <Gift size={22} style={{ color: '#fff' }} />
          </div>
          <h2 style={s.heroTitle}>Bonus dasturi</h2>
          <p style={s.heroDesc}>
            Mijozlarga bonus qo'shing va ularni rag'batlantiring
          </p>
        </div>

        <div style={s.statGrid}>
          <div style={s.statItem}>
            <CircleDollarSign size={16} style={{ color: 'var(--primary)' }} />
            <div style={s.statValue}>0</div>
            <div style={s.statLabel}>Berilgan</div>
          </div>
          <div style={s.statItem}>
            <Percent size={16} style={{ color: 'var(--success)' }} />
            <div style={s.statValue}>0</div>
            <div style={s.statLabel}>Ishlatilgan</div>
          </div>
          <div style={s.statItem}>
            <Gift size={16} style={{ color: 'var(--warning)' }} />
            <div style={s.statValue}>0</div>
            <div style={s.statLabel}>Faol</div>
          </div>
        </div>

        <div style={s.formCard}>
          <h3 style={s.formTitle}>
            <Plus size={16} style={{ color: 'var(--primary)' }} />
            Mijozga bonus qo'shish
          </h3>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel}>Telefon raqam</label>
            <div style={s.phoneRow}>
              <span style={s.phonePrefix}>+998</span>
              <input
                style={s.phoneInput}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(XX) XXX-XX-XX"
              />
            </div>
          </div>

          <div style={{ ...s.fieldGroup, marginBottom: 0 }}>
            <label style={s.fieldLabel}>Bonus miqdori (so'm)</label>
            <input
              style={s.amountInput}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </div>

          <button style={{ ...s.submitBtn, marginTop: 16 }}>
            <Plus size={16} />
            Qo'shish
          </button>
        </div>

        <div style={s.historyCard}>
          <h3 style={s.historyTitle}>
            <Percent size={16} style={{ color: 'var(--success)' }} />
            Tarix
          </h3>
          <div style={s.emptyState}>
            <Inbox size={32} style={{ color: 'var(--text-muted)', opacity: 0.4, margin: '0 auto 8px', display: 'block' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0, fontWeight: 500 }}>
              Hozircha bonus tarixi yo'q
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: '4px 0 0 0' }}>
              Birinchi bonusni qo'shing
            </p>
          </div>
        </div>

        <div style={s.emptyCard}>
          <h3 style={s.emptyTitle}>
            <Percent size={16} style={{ color: 'var(--warning)' }} />
            Faol chegirmalar
          </h3>
          <div style={{ ...s.emptyState, padding: '16px 0' }}>
            <Inbox size={28} style={{ color: 'var(--text-muted)', opacity: 0.4, margin: '0 auto 6px', display: 'block' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
              Hozircha faol chegirmalar yo'q
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
