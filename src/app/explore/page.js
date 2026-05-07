'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const INITIAL_CATEGORIES = [
  { id: '1', name: 'Epic Fantasy', slug: 'fantasy', icon: '🧙‍♂️' },
  { id: '2', name: 'Sci-Fi Odyssey', slug: 'sci-fi', icon: '🚀' },
  { id: '3', name: 'Dark Mystery', slug: 'mystery', icon: '🕵️' },
  { id: '4', name: 'Eternal Romance', slug: 'romance', icon: '❤️' },
  { id: '5', name: 'Ancient Lore', slug: 'history', icon: '📜' },
  { id: '6', name: 'Future Visions', slug: 'future', icon: '🔮' }
];

function ExplorePageContent() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, storyRes] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('stories').select('*, profiles(username)').order('created_at', { ascending: false })
        ]);

        if (catRes.data && catRes.data.length > 0) setCategories(catRes.data);
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

  const getFilteredStories = (catId) => {
    return stories.filter(s => {
      const matchesCategory = s.category_id === catId;
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           s.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '140px 5% 80px' }}>
        <header style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '30px' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h1 className="serif" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '15px' }}>The Sanctuary Library</h1>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '1.1rem' }}>
              Discover tales manifested from the depths of imagination.
            </p>
          </div>
          
          <div style={{ flex: '0 1 400px', width: '100%' }}>
            <div className="password-input-wrapper" style={{ background: 'var(--color-glass)', borderRadius: '100px', padding: '2px 10px', border: '1px solid var(--glass-border)' }}>
              <span style={{ paddingLeft: '15px', opacity: 0.5 }}>🔍</span>
              <input 
                type="text" 
                placeholder="Search the chronicles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', border: 'none', padding: '15px', width: '100%', color: 'white' }}
              />
            </div>
          </div>
        </header>

        {filteredCategories.map((cat) => {
          const catStories = getFilteredStories(cat.id);
          // If we are searching and this category has no matches, hide the category header too
          if (searchQuery && catStories.length === 0) return null;
          
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
      <ExplorePageContent />
    </Suspense>
  );
}

