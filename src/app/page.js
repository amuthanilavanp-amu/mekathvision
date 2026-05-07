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
          <h1 className="hero-title serif">The Storying</h1>
          <p className="hero-description">
            Experience storytelling like never before. Dive into a world of imagination, where every tale is a cinematic journey crafted with passion and vision.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link href="/explore" className="hero-cta">Explore Stories</Link>
            <Link href="/upload" className="hero-cta secondary">
              Share Your Tale
            </Link>
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
              <div className="category-card" style={{ transition: 'transform 0.3s ease' }}>
                <div className="category-icon">{cat.icon}</div>
                <h3 className="serif" style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '10px' }}>{cat.name}</h3>
                <p style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem', marginBottom: '20px' }}>
                  Explore tales of {cat.name.toLowerCase()}
                </p>
                <div className="pill-btn primary" style={{ fontSize: '0.7rem', padding: '8px 20px', display: 'inline-block' }}>
                  Read Realm Tales
                </div>
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

      {/* Simple Footer */}
      <footer style={{ padding: '60px 5%', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
          © 2026 Maketh Vision. All rights reserved. | Crafted with ❤️ by Joshua Amuthanilavan
        </p>
      </footer>
    </main>
  );
}

