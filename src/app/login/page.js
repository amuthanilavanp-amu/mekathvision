'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function LoginContent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const sanitizedUsername = username.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const primaryEmail = `${sanitizedUsername}@sanctuary.vision`;

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: primaryEmail,
        password: password,
      });

      if (loginError) {
        // Fallback to legacy gmail format if first attempt fails
        const legacyEmail = `${sanitizedUsername}.mv@gmail.com`;
        const { error: legacyError } = await supabase.auth.signInWithPassword({
          email: legacyEmail,
          password: password,
        });
        if (legacyError) throw loginError;
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      let msg = err.message;
      if (msg.toLowerCase().includes('email')) {
        msg = "Incorrect username or password.";
      }
      setError(msg === 'Invalid login credentials' ? 'Incorrect username or password.' : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <div style={{ marginBottom: '40px' }}>
        <div className="flex-center" style={{ marginBottom: '20px' }}>
          <span className="creator-tag">Visionary: Joshua Amuthanilavan</span>
        </div>
        
        <div className="flex-center" style={{ gap: '20px', marginBottom: '30px' }}>
          <img 
            src="/assets/logo_text.png" 
            alt="Maketh Vision Logo" 
            className="nav-logo-icon" 
            style={{ width: '70px', height: '70px', border: '2px solid rgba(226, 177, 122, 0.4)' }} 
          />
          <div style={{ textAlign: 'left' }}>
            <h1 className="serif" style={{ fontSize: '2.2rem', color: 'var(--color-primary)', margin: 0 }}>Maketh Vision</h1>
            <p className="creator-credit" style={{ margin: 0, opacity: 0.6 }}>By Joshua Amuthanilavan</p>
          </div>
        </div>

        <h2 className="serif" style={{ fontSize: '1.8rem', letterSpacing: '1px' }}>Welcome Back</h2>
        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.95rem' }}>Step back into the sanctuary of stories</p>
      </div>

      {message && (
        <div style={{ padding: '12px', background: 'rgba(226, 177, 122, 0.1)', color: 'var(--color-primary)', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem' }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username" 
            placeholder="Enter your username" 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingRight: '45px' }}
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Authenticating...' : 'Enter the Sanctuary'}
        </button>
      </form>

      <div style={{ marginTop: '30px', fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>
        New here? <Link href="/signup" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>Start your vision</Link>
      </div>
      
      <Link href="/" style={{ display: 'inline-block', marginTop: '20px', fontSize: '0.8rem', color: 'rgba(250, 237, 205, 0.3)', textDecoration: 'none' }}>
        ← Back to home
      </Link>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="login-container">
      <Suspense fallback={<div className="serif" style={{ color: 'var(--color-primary)' }}>Consulting the Chronicles...</div>}>
        <LoginContent />
      </Suspense>
    </main>
  );
}


