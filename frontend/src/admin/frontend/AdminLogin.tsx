import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { ShieldAlert, Mail, Lock, ArrowRight, Globe, Key } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const [attemptedEmail, setAttemptedEmail] = useState('');

  // Dynamically load Google Identity Services Script
  useEffect(() => {
    // 1. Create script tag
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // 2. Initialize GIS when loaded
    script.onload = () => {
      // Use client ID if configured, or default placeholder
      // Vite client-side config read from import.meta.env
      const clientID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) || '';
      
      if ((window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.initialize({
          client_id: clientID,
          callback: handleGoogleLogin,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        (window as any).google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { 
            theme: 'dark', 
            size: 'large', 
            type: 'standard', 
            shape: 'rectangular', 
            text: 'signin_with',
            width: '100%' 
          }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleLogin = async (response: any) => {
    setLoading(true);
    setError('');
    
    try {
      const data = await api.post('/api/auth/google', { idToken: response.credential });
      localStorage.setItem('admin_token', data.token);
      navigate('/admin', { replace: true });
    } catch (err: any) {
      console.error('Google OAuth backend validation failed:', err);
      if (err.status === 403 || err.message?.includes('Access Denied')) {
        try {
          const base64Url = response.credential.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const payload = JSON.parse(jsonPayload);
          setAttemptedEmail(payload.email || '');
        } catch (e) {
          setAttemptedEmail('Google Account');
        }
        setShowRestrictedModal(true);
      } else {
        setError(err.message || 'Verification failed. Make sure ADMIN_EMAIL matches.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden font-display">
      {/* Confetti styles injected inline */}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 8px;
          top: -20px;
          opacity: 0.8;
          animation: confetti-fall 3.5s linear infinite;
          pointer-events: none;
        }
        .confetti-piece:nth-child(3n) { background: #3b82f6; border-radius: 50%; }
        .confetti-piece:nth-child(3n+1) { background: #a855f7; transform: rotate(45deg); }
        .confetti-piece:nth-child(3n+2) { background: #10b981; }
        .confetti-piece:nth-child(4n) { background: #f59e0b; border-radius: 50%; }
        .confetti-piece:nth-child(5n) { background: #ef4444; }
      `}</style>

      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="p-8 md:p-10 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-xl relative">
          
          {/* Logo / Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4 text-blue-400">
              <Globe size={28} />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white">
              Admin <span className="text-white/40 italic">Access</span>
            </h2>
            <p className="text-xs text-white/40 font-light mt-2">
              Log in to access your freelancer management portal.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 mb-6 font-light leading-relaxed">
              {error}
            </div>
          )}

          {/* Google Sign-In Container */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                Authenticate with Google
              </label>
              <div 
                id="google-signin-btn" 
                className="w-full overflow-hidden rounded-xl border border-white/10 hover:border-white/30 transition-colors"
              ></div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate('/')} 
              className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white/75 transition-colors cursor-pointer"
            >
              ← Return to Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Access Restricted Modal with Congratulations Animation */}
      {showRestrictedModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/85 backdrop-blur-md overflow-hidden">
          {/* Render Confetti Pieces inside overlay */}
          {Array.from({ length: 45 }).map((_, idx) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 3.5;
            const duration = 2.5 + Math.random() * 2.5;
            return (
              <div 
                key={idx} 
                className="confetti-piece" 
                style={{ 
                  left: `${left}%`, 
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`
                }}
              />
            );
          })}

          <div className="w-full max-w-md p-8 md:p-10 rounded-[2.5rem] bg-zinc-900/90 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl animate-scale-up text-center">
            
            {/* Top decorative blue glow */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rounded-t-[2.5rem]"></div>
            
            <div className="space-y-6">
              <div className="text-4xl animate-bounce">🎉 🥳 🥂</div>
              
              <div>
                <h3 className="text-2xl font-display font-black tracking-tight text-white">
                  Congratulations!
                </h3>
                <p className="text-[10px] text-green-400 font-mono font-bold uppercase tracking-widest mt-1.5">
                  100% Successful Authorization...
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-left space-y-3 relative z-10">
                <p className="text-xs text-white/75 leading-relaxed font-light">
                  Congratulations, you successfully signed in with Google! That's a huge milestone. 
                </p>
                <p className="text-xs text-white/45 leading-relaxed font-light">
                  Unfortunately, your email is not on the admin list. Here is a virtual cookie for your effort: 🍪
                </p>
                {attemptedEmail && (
                  <p className="text-[10px] text-blue-400 font-mono break-all bg-blue-500/5 p-2 rounded-lg border border-blue-500/10">
                    Logged Email: {attemptedEmail}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 relative z-10">
                <button
                  onClick={() => setShowRestrictedModal(false)}
                  className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Try Another Account
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </div>

            {/* Glowing orb in the modal */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/10 blur-[80px] pointer-events-none rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}
