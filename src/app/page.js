'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*');
      setCategories(data || []);
    }
    fetchCategories();
  }, []);

  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <img 
          src="/assets/hero_background_1778049679282.png" 
          alt="Hero background" 
          className="hero-bg"
        />
        <div className="hero-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(12, 10, 9, 0.95))' }}></div>
        
        <div className="hero-content">
          <div className="creator-tag" style={{ marginBottom: '30px' }}>The Sanctuary of Stories</div>
          <h1 className="hero-title serif" style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', lineHeight: '1', marginBottom: '20px' }}>
            Where Visions <br /><span style={{ color: 'var(--color-primary)' }}>Find Their Voice</span>
          </h1>
          <p className="hero-description" style={{ maxWidth: '700px', fontSize: '1.2rem', marginBottom: '40px', opacity: '0.9' }}>
            Step into a realm where imagination has no bounds. Maketh Vision is the digital scroll for the modern storyteller, where every word manifests a world and every tale becomes a cinematic journey.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '60px' }}>
            <Link href="/explore" className="hero-cta">Enter the Library</Link>
            <Link href="/upload" className="hero-cta secondary">Manifest a Tale</Link>
          </div>

          <div className="scroll-indicator" style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', opacity: '0.6' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '10px' }}>Discover the Realms</div>
            <div className="mouse-icon" style={{ width: '20px', height: '35px', border: '2px solid var(--color-primary)', borderRadius: '10px', margin: '0 auto', position: 'relative' }}>
              <div style={{ width: '4px', height: '8px', background: 'var(--color-primary)', borderRadius: '2px', position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)', animation: 'scrollDown 2s infinite' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section (View Point) */}
      <section className="category-section">
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 className="serif" style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>View Point</h2>
          <p style={{ color: 'var(--color-text-dim)' }}>Browse the realms of imagination by genre</p>
        </header>

        <div className="category-grid">
          {categories.map((cat) => (
            <Link href={`/explore?category=${cat.slug}`} key={cat.id} style={{ textDecoration: 'none' }}>
              <div className="category-card">
                <div className="category-icon">{cat.icon}</div>
                <h3 className="serif" style={{ fontSize: '1.5rem', color: 'var(--color-text)' }}>{cat.name}</h3>
                <p style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem', marginTop: '10px' }}>
                  Explore tales of {cat.name.toLowerCase()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="section" style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="section-title serif" style={{ fontSize: '3rem', marginBottom: '40px', textAlign: 'center', border: 'none' }}>
            "Every story is a vision waiting to be told."
          </h2>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '1.2rem', fontStyle: 'italic' }}>
            - Joshua Amuthanilavan
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" style={{ padding: '100px 5%', background: 'linear-gradient(to bottom, var(--color-bg), #14110f)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          <div className="login-card" style={{ padding: '40px', textAlign: 'left' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🖋️</div>
            <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Manifest Your Tale</h3>
            <p style={{ color: 'var(--color-text-dim)', lineHeight: '1.7' }}>
              Our sanctuary provides the tools to bring your visions to life. Upload your chronicles and let the world witness your imagination.
            </p>
          </div>
          <div className="login-card" style={{ padding: '40px', textAlign: 'left' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>👁️</div>
            <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Cinematic View</h3>
            <p style={{ color: 'var(--color-text-dim)', lineHeight: '1.7' }}>
              Experience stories in a high-end, immersive environment. Every tale is presented with a cinematic touch, honoring the art of storytelling.
            </p>
          </div>
          <div className="login-card" style={{ padding: '40px', textAlign: 'left' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>⚖️</div>
            <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Seeker's Privacy</h3>
            <p style={{ color: 'var(--color-text-dim)', lineHeight: '1.7' }}>
              Your visions are yours. We provide a secure sanctuary for your identity and your tales, protected by the modern chronicles of auth.
            </p>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer style={{ padding: '60px 5%', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
          © 2026 Maketh Vision. All rights reserved. | Crafted with ❤️ by Joshua Amuthanilavan
        </p>
      </footer>
    </main>
  );
}

