import { Crown, Star, Gift, Percent } from 'lucide-react';

export default function LoyaltyCard({ points = 0, tier = 'standard' }) {
  const tiers = {
    standard: { label: 'Standart', color: '#b8b8b8', icon: Star },
    silver: { label: 'Kumush', color: '#c0c0c0', icon: Star },
    gold: { label: 'Oltin', color: '#ffd700', icon: Crown },
    platinum: { label: 'Platinum', color: '#e5e4e2', icon: Crown },
  };
  const t = tiers[tier] || tiers.standard;
  const TierIcon = t.icon;

  return (
    <div className="card animate-fade-in-up" style={{ padding: 0, overflow: 'hidden', background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)' }}>
      {/* Header gradient */}
      <div style={{ padding: '16px 16px 12px', background: `linear-gradient(135deg, ${t.color}15, transparent)`, borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TierIcon size={16} color={t.color} />
            <span style={{ color: t.color, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>{t.label}</span>
          </div>
          <div className="flex items-center gap-1" style={{ color: '#e51e1e', fontSize: 11 }}>
            <Percent size={12} />
            <span>{tier === 'gold' ? '10%' : tier === 'platinum' ? '15%' : tier === 'silver' ? '5%' : '0%'}</span>
          </div>
        </div>
      </div>

      {/* Points */}
      <div style={{ padding: '16px' }}>
        <div style={{ color: '#6b6b6b', fontSize: 11, marginBottom: 4 }}>Sizning ballaringiz</div>
        <div className="flex items-baseline" style={{ gap: 4 }}>
          <span style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 28, fontWeight: 600 }}>{points}</span>
          <span style={{ color: '#6b6b6b', fontSize: 12 }}>ball</span>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 12 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
            <span style={{ color: '#6b6b6b', fontSize: 10 }}>Keyingi daraja</span>
            <span style={{ color: '#6b6b6b', fontSize: 10 }}>{points}/{tier === 'standard' ? 500 : tier === 'silver' ? 1500 : 5000}</span>
          </div>
          <div style={{ height: 4, background: 'var(--surface)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min((points / (tier === 'standard' ? 500 : tier === 'silver' ? 1500 : 5000)) * 100, 100)}%`,
              background: `linear-gradient(90deg, var(--red), ${t.color})`,
              borderRadius: 2,
              transition: 'width 1s cubic-bezier(.4,0,.2,1)'
            }} />
          </div>
        </div>

        {/* Perks */}
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, padding: '8px', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <Gift size={14} color="#e51e1e" style={{ margin: '0 auto 4px' }} />
            <div style={{ color: '#b8b8b8', fontSize: 10 }}>Sovg'alar</div>
          </div>
          <div style={{ flex: 1, padding: '8px', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <Percent size={14} color="#e51e1e" style={{ margin: '0 auto 4px' }} />
            <div style={{ color: '#b8b8b8', fontSize: 10 }}>Chegirmalar</div>
          </div>
        </div>
      </div>
    </div>
  );
}
