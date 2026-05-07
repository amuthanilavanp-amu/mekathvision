'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);

        const { data: storyData } = await supabase
          .from('stories')
          .select('*, categories(name, icon)')
          .eq('user_id', user.id);
        setStories(storyData || []);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="login-container">
      <div className="serif" style={{ fontSize: '2rem' }}>Consulting the Chronicles...</div>
    </div>
  );

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2 className="serif">Seeker Not Found</h2>
          <p style={{ margin: '20px 0', color: 'var(--color-text-dim)' }}>You must be logged in to view your vision chamber.</p>
          <Link href="/login" className="pill-btn primary">Enter Sanctuary</Link>
        </div>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '140px 5% 80px' }}>
        <section className="login-card" style={{ maxWidth: '100%', textAlign: 'left', display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '60px' }}>
          <div className="user-avatar" style={{ width: '100px', height: '100px', fontSize: '3rem' }}>
            {profile?.username?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="serif" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{profile?.username || 'Seeker'}</h1>
            <p style={{ color: 'var(--color-text-dim)', marginBottom: '15px' }}>{user.email || 'Mystery Seeker'}</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>{stories.length}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Visions Manifested</span>
              </div>
            </div>
          </div>
        </section>

        <h2 className="serif" style={{ fontSize: '2rem', marginBottom: '30px' }}>Your Manifested Tales</h2>
        
        {stories.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
            {stories.map((story) => (
              <div key={story.id} className="category-card" style={{ textAlign: 'left', padding: '0', overflow: 'hidden' }}>
                <img src={story.thumbnail_url} alt={story.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '5px' }}>
                    {story.categories?.icon} {story.categories?.name}
                  </div>
                  <h3 className="serif" style={{ marginBottom: '10px' }}>{story.title}</h3>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link href={story.file_url} className="pill-btn" style={{ fontSize: '0.7rem', padding: '5px 12px' }}>Read</Link>
                    <button className="pill-btn" style={{ fontSize: '0.7rem', padding: '5px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '60px', background: 'var(--color-glass)', borderRadius: '24px', textAlign: 'center', border: '1px dashed var(--glass-border)' }}>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '1.1rem' }}>Your vision chamber is empty.</p>
            <Link href="/upload" className="pill-btn primary" style={{ marginTop: '20px', display: 'inline-block' }}>Manifest a Story</Link>
          </div>
        )}
      </div>
    </main>
  );
}
