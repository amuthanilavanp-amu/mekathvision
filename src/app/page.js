'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

import { 
  FantasyIcon, 
  SciFiIcon, 
  MysteryIcon, 
  RomanceIcon, 
  HistoryIcon, 
  FutureIcon 
} from '@/components/Icons';
import MotionBackground from '@/components/MotionBackground';

const ICON_MAP = {
  'fantasy': <FantasyIcon />,
  'sci-fi': <SciFiIcon />,
  'mystery': <MysteryIcon />,
  'romance': <RomanceIcon />,
  'history': <HistoryIcon />,
  'future': <FutureIcon />
};

const INITIAL_CATEGORIES = [
  { id: '1', name: 'Epic Fantasy', slug: 'fantasy' },
  { id: '2', name: 'Sci-Fi Odyssey', slug: 'sci-fi' },
  { id: '3', name: 'Dark Mystery', slug: 'mystery' },
  { id: '4', name: 'Eternal Romance', slug: 'romance' },
  { id: '5', name: 'Ancient Lore', slug: 'history' },
  { id: '6', name: 'Future Visions', slug: 'future' }
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
        <MotionBackground />
        <div className="hero-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(12, 10, 9, 0.98))' }}></div>
        
        <div className="hero-content container">
          <h1 className="hero-title serif">The Storying</h1>
          <p className="hero-description">
            Experience storytelling like never before. Dive into a world of imagination, where every tale is a cinematic journey.
          </p>
          
          {/* Quick Access Realms */}
          <div className="category-scroll-container">
            <div className="category-scroll-inner">
              {categories.map((cat) => (
                <Link href={`/explore?category=${cat.slug}`} key={cat.id} className="pill-btn primary category-pill">
                  <span style={{ color: 'var(--color-bg)', display: 'flex' }}>
                    {ICON_MAP[cat.slug] || '✨'}
                  </span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="hero-cta-group">
            <Link href="/explore" className="hero-cta">Explore Library</Link>
            <Link href="/upload" className="hero-cta secondary">Manifest Tale</Link>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="section" style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 className="serif" style={{ marginBottom: '40px', border: 'none' }}>
            "Every story is a vision waiting to be told."
          </h2>
          <p style={{ color: 'var(--color-text-dim)', fontStyle: 'italic' }}>
            - Joshua Amuthanilavan
          </p>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="section" style={{ borderTop: '1px solid var(--glass-border)', textAlign: 'center', padding: '60px 0' }}>
        <div className="container">
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
            © 2026 Maketh Vision. All rights reserved. | Crafted with ❤️ by Joshua Amuthanilavan
          </p>
        </div>
      </footer>
    </main>
  );
}

