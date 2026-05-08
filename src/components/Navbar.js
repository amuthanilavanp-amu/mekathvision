'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    async function getSession() {
      // 1. Instant UI from Cache
      const cachedProfile = localStorage.getItem('mv_profile');
      if (cachedProfile) setProfile(JSON.parse(cachedProfile));

      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', session.user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
          localStorage.setItem('mv_profile', JSON.stringify(profileData));
        }
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
        
        if (profileData) {
          setProfile(profileData);
          localStorage.setItem('mv_profile', JSON.stringify(profileData));
        }
      } else {
        setProfile(null);
        localStorage.removeItem('mv_profile');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Home</Link>
      <Link href="/explore" className={`nav-link ${pathname === '/explore' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Explore</Link>
      <Link href="/upload" className={`nav-link ${pathname === '/upload' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Upload</Link>
      <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>About</Link>
    </>
  );

  return (
    <>
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
          <NavLinks />
        </div>

        <div className="nav-actions">
          <div className="desktop-only">
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
          
          <button 
            className="menu-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Link href="/" className={`mobile-menu-link ${pathname === '/' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/explore" className={`mobile-menu-link ${pathname === '/explore' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Explore Library</Link>
          <Link href="/upload" className={`mobile-menu-link ${pathname === '/upload' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Manifest Tale</Link>
          <Link href="/about" className={`mobile-menu-link ${pathname === '/about' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Our Vision</Link>
          
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {user ? (
              <>
                <Link href="/profile" className="pill-btn primary" style={{ textAlign: 'center', padding: '15px' }} onClick={() => setIsMenuOpen(false)}>
                  My Sanctuary ({profile?.username || 'Seeker'})
                </Link>
                <button onClick={handleLogout} className="pill-btn" style={{ background: 'rgba(255,255,255,0.05)', padding: '15px' }}>
                  Exit Journey
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="pill-btn primary" style={{ textAlign: 'center', padding: '15px' }} onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link href="/signup" className="pill-btn" style={{ textAlign: 'center', padding: '15px' }} onClick={() => setIsMenuOpen(false)}>Join Sanctuary</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
