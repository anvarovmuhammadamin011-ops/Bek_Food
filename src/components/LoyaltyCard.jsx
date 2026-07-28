import { Crown, Star, Gift, Percent } from 'lucide-react';

export default function LoyaltyCard({ points = 0, tier = 'standard' }) {
  const tiers = {
    standard: { label: 'Standart', color: '#9CA3AF', icon: Star },
    silver: { label: 'Kumush', color: '#94A3B8', icon: Star },
    gold: { label: 'Oltin', color: '#F59E0B', icon: Crown },
    platinum: { label: 'Platinum', color: '#F97316', icon: Crown },
  };
  const t = tiers[tier] || tiers.standard;
  const TierIcon = t.icon;
  const maxPoints = tier === 'standard' ? 500 : tier === 'silver' ? 1500 : 5000;

  return (
    <div className="card animate-fade-in-up" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{
        padding: '18px 18px 14px',
        background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--bg) 100%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 'var(--radius-sm)',
              background: `${t.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TierIcon size={16} color={t.color} />
            </div>
            <div>
              <div style={{ color: t.color, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>{t.label}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>Sizning darajangiz</div>
            </div>
          </div>
          <div className="badge badge-primary">
            <Percent size={11} />
            <span>{tier === 'gold' ? '10%' : tier === 'platinum' ? '15%' : tier === 'silver' ? '5%' : '0%'}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '18px' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>Ballaringiz</div>
        <div className="flex items-baseline" style={{ gap: 6 }}>
          <span style={{ color: 'var(--text)', fontSize: 30, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{points}</span>
          <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>ball</span>
        </div>

        <div style={{ marginTop: 14 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Keyingi daraja</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>{points}/{maxPoints}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${Math.min((points / maxPoints) * 100, 100)}%` }} />
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, padding: '10px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border)' }}>
            <Gift size={16} color="var(--primary)" style={{ margin: '0 auto 4px' }} />
            <div style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 500 }}>Sovg'alar</div>
          </div>
          <div style={{ flex: 1, padding: '10px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border)' }}>
            <Percent size={16} color="var(--primary)" style={{ margin: '0 auto 4px' }} />
            <div style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 500 }}>Chegirmalar</div>
          </div>
        </div>
      </div>
    </div>
  );
}
