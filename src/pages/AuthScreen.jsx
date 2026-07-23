import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Eye, EyeOff, ChevronRight, Camera } from 'lucide-react';
import useStore from '../store/useStore';

export default function AuthScreen() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);
  const [mode, setMode] = useState('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login({ id: 1, name: name || 'Bekzod', phone: phone || '+998901234567', email: 'bekzod@example.com', photo: null, language: 'uz' });
      setLoading(false);
      navigate('/');
    }, 1200);
  };

  const handleSocial = () => {
    setLoading(true);
    setTimeout(() => {
      login({ id: 1, name: 'Bekzod', phone: '+998901234567', email: 'bekzod@example.com', photo: null, language: 'uz' });
      setLoading(false);
      navigate('/');
    }, 800);
  };

  return (
    <div className="h-full flex flex-col bg-bg-primary relative overflow-hidden">
      <div className="flex-1 flex flex-col justify-center px-6 py-8 relative z-10 max-w-lg mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white tracking-[0.15em] uppercase">BEK FOOD</h1>
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5">Tez va Mazali</p>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold mb-1">Welcome Back!</h2>
            <p className="text-text-secondary text-sm mb-6">Sign in to continue ordering</p>

            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 text-text-muted -translate-y-1/2" />
              <input
                type="tel" placeholder="+998 __ ___ __ __" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-bg-card border border-border rounded-xl py-3.5 pl-11 pr-4 text-sm focus:border-accent-orange focus:outline-none transition-colors placeholder:text-text-muted"
              />
            </div>

            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-card border border-border rounded-xl py-3.5 px-4 text-sm focus:border-accent-orange focus:outline-none transition-colors placeholder:text-text-muted"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 text-text-muted -translate-y-1/2">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-accent-orange" /> Remember me
              </label>
              <button type="button" className="text-accent-orange font-semibold">Forgot Password?</button>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-60 rounded-xl py-3.5 mt-2">
              {loading ? <div className="w-5 h-5 rounded-full animate-spin" style={{ border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff' }} /> : <span className="flex items-center justify-center gap-1.5 text-sm font-bold">Sign In <ChevronRight size={16} /></span>}
            </button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider"><span className="bg-bg-primary px-3 text-text-muted font-bold">or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={handleSocial} className="flex items-center justify-center gap-2 bg-bg-card border border-border rounded-xl py-3 text-xs font-semibold ripple active:scale-95 transition-transform">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button type="button" onClick={handleSocial} className="flex items-center justify-center gap-2 bg-bg-card border border-border rounded-xl py-3 text-xs font-semibold ripple active:scale-95 transition-transform">
                <svg width="14" height="16" viewBox="0 0 17 20" fill="white"><path d="M8.5 0C6.4 0 4.8 1.5 4.8 3.7v1.3H3.2C1.7 5 0 6.7 0 8.8v3.7c0 2.1 1.7 3.8 3.2 3.8h10.7c1.5 0 3.2-1.7 3.2-3.8V8.8c0-2.1-1.7-3.8-3.2-3.8h-1.6V3.7C12.3 1.5 10.6 0 8.5 0zm0 2.2c.9 0 1.6.7 1.6 1.5v1.3H6.9V3.7c0-.8.7-1.5 1.6-1.5z"/></svg>
                Apple
              </button>
            </div>

            <p className="text-center text-sm text-text-secondary mt-6">
              Don't have an account? <button type="button" onClick={() => setMode('register')} className="text-accent-orange font-semibold">Sign Up</button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold mb-1">Create Account</h2>
            <p className="text-text-secondary text-sm mb-6">Join BEK FOOD today</p>

            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-bg-card border border-dashed border-border flex items-center justify-center text-text-muted cursor-pointer transition hover:border-accent-orange/40">
                <div className="text-center flex flex-col items-center">
                  <Camera size={18} className="text-text-secondary" />
                  <span className="text-[9px] mt-0.5 font-medium">Photo</span>
                </div>
              </div>
            </div>

             <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-bg-card border border-border rounded-xl py-3.5 px-4 text-sm focus:border-accent-orange focus:outline-none transition-colors placeholder:text-text-muted" />

            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 text-text-muted -translate-y-1/2" />
              <input type="tel" placeholder="+998 __ ___ __ __" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-bg-card border border-border rounded-xl py-3.5 pl-11 pr-4 text-sm focus:border-accent-orange focus:outline-none transition-colors placeholder:text-text-muted" />
            </div>

            <div className="relative">
              <input type={showPass ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-card border border-border rounded-xl py-3.5 px-4 text-sm focus:border-accent-orange focus:outline-none transition-colors placeholder:text-text-muted" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 text-text-muted -translate-y-1/2">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-60 rounded-xl py-3.5 mt-2">
              {loading ? <div className="w-5 h-5 rounded-full animate-spin" style={{ border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff' }} /> : <span className="flex items-center justify-center gap-1.5 text-sm font-bold">Create Account <ChevronRight size={16} /></span>}
            </button>

            <p className="text-center text-sm text-text-secondary mt-6">
              Already have an account? <button type="button" onClick={() => setMode('login')} className="text-accent-orange font-semibold">Sign In</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
