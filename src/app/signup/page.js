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
    // Supabase requires an email, so we generate a unique one from the username
    // We now allow dots, underscores, and dashes to prevent collisions between similar usernames
    const sanitizedEmailPart = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
    const dummyEmail = `${sanitizedEmailPart}@sanctuary.vision`;

    try {
      console.log("Attempting manifestation for:", { username, dummyEmail });

      // 1. Check if username is already taken
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (existingProfile) {
        throw new Error("This seeker identity is already claimed in the chronicles.");
      }

      // 2. Perform the Signup
      const { data, error: signupError } = await supabase.auth.signUp({
        email: dummyEmail,
        password: password,
        options: {
          data: { username: username }
        }
      });

      if (signupError) throw signupError;

      // 3. Immediate Login
      const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
        email: dummyEmail,
        password: password,
      });

      if (loginError) throw loginError;

      // 4. "Auto-Repair": If the trigger failed, try to create the profile manually now
      // This works because the user is now authenticated
      if (authData?.user) {
        await supabase.from('profiles').insert([
          { id: authData.user.id, username: username, email: dummyEmail }
        ]).select().single().catch(e => console.warn("Profile already exists or trigger worked."));
      }

      router.push('/?message=Welcome to the Sanctuary!');
      router.refresh();
    } catch (err) {
      console.error("Signup error detail:", err);
      let msg = err.message;
      const lowerMsg = msg.toLowerCase();
      
      if (lowerMsg.includes('already registered') || lowerMsg.includes('already exists')) {
        msg = "This identity is already manifested. Try logging in!";
      } else if (lowerMsg.includes('database error') || lowerMsg.includes('saving new user')) {
        msg = "The sanctuary is experiencing a heavy ripple. Please try once more with a slightly different name, or wait a moment.";
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
