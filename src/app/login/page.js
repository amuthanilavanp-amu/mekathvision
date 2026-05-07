'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function LoginContent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const sanitizedUsername = username.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const dummyEmail = `${sanitizedUsername}.mv@gmail.com`;

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: dummyEmail,
        password: password,
      });

      if (loginError) throw loginError;

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
        <span className="creator-tag">Visionary: Joshua Amuthanilavan</span>
        <div className="nav-logo-group" style={{ justifyContent: 'center', gap: '15px' }}>
          <img src="/assets/logo_text.png" alt="Logo" className="nav-logo-icon" style={{ width: '60px', height: '60px' }} />
          <div className="nav-logo-text" style={{ display: 'block', textAlign: 'left' }}>
            <span className="nav-logo serif" style={{ fontSize: '2rem' }}>Maketh Vision</span>
            <span className="creator-credit" style={{ fontSize: '0.7rem' }}>By Joshua Amuthanilavan</span>
          </div>
        </div>
        <h2 className="serif" style={{ marginTop: '30px', fontSize: '2rem' }}>Welcome Back</h2>
        <p style={{ color: 'var(--color-text-dim)' }}>Step back into the sanctuary of stories</p>
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
          <input 
            type="password" 
            id="password" 
            placeholder="••••••••" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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


