'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { 
  FantasyIcon, 
  SciFiIcon, 
  MysteryIcon, 
  RomanceIcon, 
  HistoryIcon, 
  FutureIcon 
} from '@/components/Icons';

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

function ExplorePageContent() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');

  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, catRes, storyRes] = await Promise.all([
          supabase.auth.getUser(),
          supabase.from('categories').select('*'),
          supabase.from('stories').select('*, profiles(username)').order('created_at', { ascending: false })
        ]);

        if (userRes.data?.user) setUser(userRes.data.user);
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

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm("Are you sure you want to banish this tale from the chronicles? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId);

      if (error) throw error;

      // Update state to remove the deleted story
      setStories(stories.filter(s => s.id !== storyId));
      alert("The tale has been banished.");
    } catch (err) {
      console.error("Error banishing tale:", err);
      alert("Failed to banish the tale. Please consult the scribes.");
    }
  };

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
      
      <div className="container" style={{ padding: '140px 5% 80px' }}>
        <header style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '30px' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h1 className="serif">The Sanctuary Library</h1>
            <p style={{ color: 'var(--color-text-dim)' }}>
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
          if (searchQuery && catStories.length === 0) return null;
          
          return (
            <section key={cat.id} style={{ marginBottom: '80px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px' }}>
                <span style={{ color: 'var(--color-primary)', display: 'flex' }}>
                  {ICON_MAP[cat.slug] || '✨'}
                </span>
                <h2 className="serif" style={{ color: 'var(--color-primary)', margin: 0 }}>{cat.name}</h2>
              </div>

              {catStories.length > 0 ? (
                <div className="grid-auto">
                  {catStories.map((story) => (
                    <div key={story.id} className="category-card" style={{ textAlign: 'left', padding: '0', overflow: 'hidden' }}>
                      <img 
                        src={story.thumbnail_url} 
                        alt={story.title} 
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                      />
                      <div style={{ padding: '25px' }}>
                        <h3 className="serif" style={{ marginBottom: '10px' }}>{story.title}</h3>
                        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {story.description}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>By {story.profiles?.username || 'Unknown Seeker'}</span>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            {user && user.id === story.user_id && (
                              <button 
                                onClick={() => handleDeleteStory(story.id)}
                                className="pill-btn" 
                                style={{ fontSize: '0.7rem', padding: '6px 15px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer' }}
                              >
                                Delete
                              </button>
                            )}
                            <a 
                              href={`https://docs.google.com/viewer?url=${encodeURIComponent(story.file_url)}&embedded=true`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="pill-btn" 
                              style={{ fontSize: '0.7rem', padding: '6px 15px' }}
                            >
                              Read Tale
                            </a>
                          </div>
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

