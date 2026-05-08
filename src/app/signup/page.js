'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Supabase requires an email, so we generate a dummy one from the username
    const sanitizedUsername = username.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const dummyEmail = `${sanitizedUsername}@sanctuary.vision`;

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

      // If user is already created but not confirmed (or just created), try to log in
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: dummyEmail,
        password: password,
      });

      if (loginError) {
        if (loginError.message.includes('Email not confirmed')) {
          throw new Error("Account created! However, email confirmation is required by the sanctuary. Please check your scrolls (or consult the visionary).");
        }
        throw loginError;
      }

      router.push('/?message=Welcome to the Sanctuary!');
      router.refresh();
    } catch (err) {
      let msg = err.message;
      if (msg.toLowerCase().includes('already registered')) {
        msg = "This identity is already manifested in the chronicles. Try logging in instead.";
      } else if (msg.toLowerCase().includes('email')) {
        msg = "This username is invalid or requires confirmation. Please choose another seeker identity.";
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

          <h2 className="serif" style={{ fontSize: '1.8rem', letterSpacing: '1px' }}>Begin Your Journey</h2>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.95rem' }}>Manifest your seeker identity in the chronicles</p>
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
