import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, ChevronRight } from 'lucide-react';
import useStore from '../store/useStore';

export default function BranchSelectPage() {
  const navigate = useNavigate();
  const { branches, fetchBranches, setSelectedBranch, fetchNearestBranch } = useStore();
  const [nearestBranch, setNearestBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geoError, setGeoError] = useState(false);

  useEffect(() => {
    fetchBranches().then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (branches.length === 0) return;
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const nearest = await fetchNearestBranch(pos.coords.latitude, pos.coords.longitude);
        if (nearest) setNearestBranch(nearest);
      },
      () => setGeoError(true),
      { timeout: 5000 }
    );
  }, [branches]);

  const handleSelect = (branch) => {
    setSelectedBranch(branch);
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ajif-black)' }}>
        <div style={{ color: 'var(--ajif-white-muted)', fontSize: '14px' }}>Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--ajif-black)', overflow: 'auto' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px', paddingTop: '40px' }}>
          <img src="/favicon.jpg" alt="AJIF" style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', marginBottom: '16px' }} />
          <h1 style={{ fontFamily: 'var(--font-family-display)', fontStyle: 'italic', fontSize: '28px', color: 'var(--ajif-white)', marginBottom: '8px' }}>
            AJIF
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--ajif-white-muted)' }}>
            Filialni tanlang
          </p>
        </div>

        {/* Nearest branch banner */}
        {nearestBranch && (
          <button
            onClick={() => handleSelect(nearestBranch)}
            style={{
              width: '100%', padding: '16px', marginBottom: '20px',
              background: 'rgba(229, 30, 30, 0.10)', border: '1px solid rgba(229, 30, 30, 0.30)',
              borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ajif-red)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Sizga eng yaqin
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ajif-white)' }}>
                {nearestBranch.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ajif-white-muted)', marginTop: '2px' }}>
                {nearestBranch.distance} km masofada
              </div>
            </div>
            <ChevronRight size={20} color="var(--ajif-red)" />
          </button>
        )}

        {/* All branches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {branches.map((branch) => (
            <button
              key={branch.id}
              onClick={() => handleSelect(branch)}
              style={{
                width: '100%', padding: '16px',
                background: 'var(--ajif-black-soft)', border: '1px solid var(--ajif-border)',
                borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(229, 30, 30, 0.3)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(229, 30, 30, 0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--ajif-border)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ajif-white)', marginBottom: '4px' }}>
                {branch.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--ajif-white-muted)', marginBottom: '4px' }}>
                <MapPin size={12} />
                <span>{branch.address}</span>
              </div>
              {branch.workingHours && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--ajif-white-muted)' }}>
                  <Clock size={12} />
                  <span>{branch.workingHours.mon || '09:00-23:00'}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
