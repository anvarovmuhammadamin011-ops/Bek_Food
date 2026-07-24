import { useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center px-8 text-center bg-primary">
      <div className="text-8xl font-black text-primary mb-4 animate-pulse">404</div>
      <h2 className="text-xl font-bold mb-2">Page not found</h2>
      <p className="text-secondary text-sm mb-8 max-w-xs leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3">
        <button onClick={() => navigate('/')} className="btn btn-primary rounded-xl flex items-center gap-2">
          <Home size={16} /> Home
        </button>
        <button onClick={() => navigate('/search')} className="btn btn-secondary rounded-xl flex items-center gap-2">
          <Search size={16} /> Search
        </button>
      </div>
    </div>
  );
}
