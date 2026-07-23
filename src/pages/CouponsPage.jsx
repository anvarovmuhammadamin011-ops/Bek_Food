import { useState } from 'react';
import { Tag, Copy, Check, Gift, Users, Award } from 'lucide-react';
import useStore from '../store/useStore';

export default function CouponsPage() {
  const { coupons } = useStore();
  const [promoInput, setPromoInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-24">
      <div className="p-4 max-w-lg mx-auto space-y-6">
        <h1 className="text-lg font-bold">Coupons & Rewards</h1>

        {/* Promo Code Input */}
        <div className="bg-bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={16} className="text-accent-orange" />
            <h3 className="text-sm font-semibold">Enter Promo Code</h3>
          </div>
          <div className="flex gap-2">
            <input value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="Enter code"
              className="flex-1 bg-bg-primary border border-border rounded-xl py-3 px-4 text-sm focus:border-accent-orange focus:outline-none transition-colors placeholder:text-text-muted uppercase tracking-wider" />
            <button className="px-5 rounded-xl btn-primary text-sm">Apply</button>
          </div>
        </div>

        {/* Available Coupons */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Available Coupons</h3>
          <div className="space-y-3">
            {coupons.filter(c => c.isActive).map(coupon => (
              <div key={coupon.id} className="bg-bg-card rounded-2xl p-4 border border-border animate-slide-up">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-accent-orange font-black text-lg">{coupon.code}</span>
                    </div>
                    <p className="text-text-secondary text-xs mt-1">
                      {coupon.discountType === 'percent' ? `${coupon.discount}% off` : `${coupon.discount.toLocaleString()} so'm off`}
                    </p>
                    <p className="text-text-muted text-[10px] mt-1">Min order: {coupon.minOrder.toLocaleString()} so'm • Expires: {coupon.expiresAt}</p>
                  </div>
                  <button onClick={() => handleCopy(coupon.code, coupon.id)}
                    className="p-2.5 rounded-xl bg-accent-orange/15 text-accent-orange active:scale-90 transition-all">
                    {copiedId === coupon.id ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="border-t border-border mt-3 pt-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-bg-primary border border-r-0 border-border" />
                  <div className="flex-1 border-t border-dashed border-border" />
                  <div className="w-4 h-4 rounded-full bg-bg-primary border border-l-0 border-border" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Referral */}
        <div className="bg-gradient-to-br from-accent-orange/20 to-accent-red/20 rounded-2xl p-5 border border-accent-orange/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-accent-orange/20">
              <Users size={20} className="text-accent-orange" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Refer a Friend</h3>
              <p className="text-text-secondary text-xs">Earn 10,000 so_m for each referral</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-bg-primary rounded-xl p-3">
            <code className="flex-1 text-accent-orange font-bold text-sm tracking-wider">BEK2026</code>
            <button onClick={() => handleCopy('BEK2026', 'referral')} className="p-2 rounded-lg bg-accent-orange/15 text-accent-orange active:scale-90 transition-transform">
              {copiedId === 'referral' ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Loyalty Points */}
        <div className="bg-bg-card rounded-2xl p-5 border border-border text-center">
          <Award size={32} className="text-accent-orange mx-auto mb-2" />
          <h3 className="font-bold">Loyalty Points</h3>
          <p className="text-3xl font-black text-accent-orange mt-2">2,450</p>
          <p className="text-text-secondary text-xs mt-1">Points available</p>
          <div className="mt-3 bg-bg-primary rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent-orange to-accent-red rounded-full" style={{ width: '65%' }} />
          </div>
          <p className="text-text-muted text-[10px] mt-2">550 points to next reward</p>
        </div>
      </div>
    </div>
  );
}
