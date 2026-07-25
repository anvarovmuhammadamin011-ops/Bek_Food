import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronDown } from 'lucide-react';
import useStore from '../store/useStore';

export default function BranchBanner() {
  const navigate = useNavigate();
  const selectedBranch = useStore((s) => s.selectedBranch);
  const branches = useStore((s) => s.branches);

  const branch = selectedBranch || branches.find(b => b.id === useStore.getState().selectedBranchId);

  if (!branch) return null;

  return (
    <button
      onClick={() => navigate('/branch-select')}
      style={{
        width: '100%',
        padding: '8px 16px',
        background: 'rgba(229, 30, 30, 0.06)',
        borderBottom: '1px solid var(--ajif-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        color: 'var(--ajif-white-muted)',
      }}
    >
      <MapPin size={12} color="var(--ajif-red)" />
      <span style={{ fontWeight: 600, color: 'var(--ajif-white)' }}>{branch.name}</span>
      <span>— o'zgartirish</span>
      <ChevronDown size={12} />
    </button>
  );
}
