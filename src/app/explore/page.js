'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ExploreContent() {
  const [categories, setCategories] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');

  useEffect(() => {
    async function fetchData() {
      // Instant cache load
      const cachedCats = localStorage.getItem('mv_categories');
      if (cachedCats) setCategories(JSON.parse(cachedCats));

      try {
        const [catRes, storyRes] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('stories').select('*, profiles(username)').order('created_at', { ascending: false })
        ]);

        if (catRes.data) {
          setCategories(catRes.data);
          localStorage.setItem('mv_categories', JSON.stringify(catRes.data));
        }
        if (storyRes.data) setStories(storyRes.data);
      } catch (err) {
        console.error("Library error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredCategories = selectedCategory 
    ? categories.filter(c => c.slug === selectedCategory)
    : categories;

  if (loading && categories.length === 0) return (
    <div className="login-container">
      <div className="serif" style={{ fontSize: '2rem' }}>Opening the Archive...</div>
    </div>
  );

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '140px 5% 80px' }}>
        <header style={{ marginBottom: '60px' }}>
          <h1 className="serif" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '15px' }}>The Sanctuary Library</h1>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '1.1rem' }}>
            Discover tales manifested from the depths of imagination.
          </p>
        </header>

        {filteredCategories.map((cat) => {
          const catStories = stories.filter(s => s.category_id === cat.id);
          return (
            <section key={cat.id} style={{ marginBottom: '80px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px' }}>
                <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                <h2 className="serif" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>{cat.name}</h2>
              </div>

              {catStories.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                  {catStories.map((story) => (
                    <div key={story.id} className="category-card" style={{ textAlign: 'left', padding: '0', overflow: 'hidden' }}>
                      <img 
                        src={story.thumbnail_url} 
                        alt={story.title} 
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                      />
                      <div style={{ padding: '25px' }}>
                        <h3 className="serif" style={{ marginBottom: '10px', fontSize: '1.4rem' }}>{story.title}</h3>
                        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {story.description}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>By {story.profiles?.username || 'Unknown Seeker'}</span>
                          <Link href={story.file_url} className="pill-btn" style={{ fontSize: '0.7rem', padding: '6px 15px' }}>Read Tale</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '40px', background: 'var(--color-glass)', borderRadius: '24px', textAlign: 'center', border: '1px dashed var(--glass-border)' }}>
                  <p style={{ color: 'var(--color-text-dim)' }}>No tales have been manifested in this realm yet.</p>
                  <Link href="/upload" style={{ color: 'var(--color-primary)', fontSize: '0.9rem', marginTop: '10px', display: 'inline-block', fontWeight: '600' }}>Manifest the first one</Link>
                </div>
              )}
            </section>
          );
        })}

        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <Link href="/" className="hero-cta secondary">← Back to Sanctuary</Link>
        </div>
      </div>
    </main>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div>Loading Library...</div>}>
      <ExploreContent />
    </Suspense>
  );
}

