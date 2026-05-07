'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', session.user.id)
          .single();
        setProfile(profileData);
      }
    }

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', session.user.id)
          .single();
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="navbar">
      <Link href="/" className="nav-logo-group">
        <img 
          src="/assets/logo_text.png" 
          alt="Maketh Vision" 
          className="nav-logo-icon"
        />
        <div className="nav-logo-text">
          <span className="nav-logo serif">Maketh Vision</span>
          <span className="creator-credit">By Joshua Amuthanilavan</span>
        </div>
      </Link>
      
      <div className="nav-links">
        <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Home</Link>
        <Link href="/explore" className={`nav-link ${pathname === '/explore' ? 'active' : ''}`}>Explore</Link>
        <Link href="/upload" className={`nav-link ${pathname === '/upload' ? 'active' : ''}`}>Upload</Link>
        <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>About</Link>
      </div>

      <div className="nav-actions">
        {user ? (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link href="/upload" className="pill-btn primary">manifest</Link>
            <Link href="/profile" className="user-corner">
              <div className="user-avatar" style={{ border: '1px solid var(--color-primary)', background: 'rgba(226, 177, 122, 0.1)' }}>
                {profile?.username?.charAt(0) || 'U'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                <span className="username-display">{profile?.username || 'Seeker'}</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Manifesting</span>
              </div>
            </Link>
            <button onClick={handleLogout} className="pill-btn" style={{ background: 'transparent', cursor: 'pointer' }}>
              Exit
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/login" className="pill-btn">Login</Link>
            <Link href="/signup" className="pill-btn primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
