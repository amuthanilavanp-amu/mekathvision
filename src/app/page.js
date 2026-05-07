'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

const INITIAL_CATEGORIES = [
  { id: '1', name: 'Epic Fantasy', slug: 'fantasy', icon: '🧙‍♂️' },
  { id: '2', name: 'Sci-Fi Odyssey', slug: 'sci-fi', icon: '🚀' },
  { id: '3', name: 'Dark Mystery', slug: 'mystery', icon: '🕵️' },
  { id: '4', name: 'Eternal Romance', slug: 'romance', icon: '❤️' },
  { id: '5', name: 'Ancient Lore', slug: 'history', icon: '📜' },
  { id: '6', name: 'Future Visions', slug: 'future', icon: '🔮' }
];

export default function Home() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*');
      if (data && data.length > 0) setCategories(data);
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
            Experience storytelling like never before. Dive into a world of imagination, where every tale is a cinematic journey.
          </p>
          
          {/* Quick Access Realms (Buttons moved to top) */}
          <div className="category-scroll-container" style={{ margin: '40px 0', padding: '0 5%' }}>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <Link href={`/explore?category=${cat.slug}`} key={cat.id} className="pill-btn primary" style={{ fontSize: '0.8rem', padding: '12px 25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link href="/explore" className="hero-cta">Explore Library</Link>
            <Link href="/upload" className="hero-cta secondary">Manifest Tale</Link>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="section" style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '120px 5%' }}>

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

