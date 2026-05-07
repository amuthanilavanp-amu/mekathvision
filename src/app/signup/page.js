'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Supabase requires an email, so we generate a dummy one from the username
    // Using .com instead of .local to pass default Supabase email validation
    const sanitizedUsername = username.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const dummyEmail = `${sanitizedUsername}.mv@gmail.com`;

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: dummyEmail,
        password: password,
        options: {
          data: {
            username: username
          }
        }
      });

      if (signupError) throw signupError;

      // Log in immediately after signup
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: dummyEmail,
        password: password,
      });

      if (loginError) throw loginError;

      router.push('/?message=Welcome to the Sanctuary!');
      router.refresh();
    } catch (err) {
      let msg = err.message;
      if (msg.toLowerCase().includes('email')) {
        msg = "This username is already taken or invalid. Please choose another seeker identity.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-container">
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
          <h2 className="serif" style={{ marginTop: '30px', fontSize: '2rem' }}>Begin Your Journey</h2>
          <p style={{ color: 'var(--color-text-dim)' }}>Manifest your seeker identity in the chronicles</p>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="username">Create Username</label>
            <input 
              type="text" 
              id="username" 
              placeholder="e.g. VisionarySoul" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Create Password</label>
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
            {loading ? 'Creating Account...' : 'Manifest Account'}
          </button>
        </form>

        <div style={{ marginTop: '30px', fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>
          Already a seeker? <Link href="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>Enter the Sanctuary</Link>
        </div>
        
        <Link href="/" style={{ display: 'inline-block', marginTop: '20px', fontSize: '0.8rem', color: 'rgba(250, 237, 205, 0.3)', textDecoration: 'none' }}>
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
