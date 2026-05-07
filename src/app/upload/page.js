'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function UploadPage() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storyCount, setStoryCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    description: ''
  });

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      const { data: catData } = await supabase.from('categories').select('*');
      setCategories(catData || []);

      if (user) {
        const { count } = await supabase
          .from('stories')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        setStoryCount(count || 0);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login first');
    if (storyCount >= 12) return alert('You have reached the maximum limit of 12 stories.');

    setUploading(true);
    // In a real app, we would upload to storage here. 
    // For this demo, we'll just show the feedback.
    setTimeout(() => {
      setUploading(false);
      alert('Your vision has been manifested! (Storage upload would happen here in production)');
    }, 2000);
  };

  if (loading) return (
    <div className="login-container">
      <div className="serif" style={{ fontSize: '2rem' }}>Loading Vision...</div>
    </div>
  );

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '140px 5% 80px' }}>
        <header style={{ marginBottom: '60px', textAlign: 'center' }}>
          <h1 className="serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '15px' }}>Manifest Your Tale</h1>
          <p style={{ color: 'var(--color-text-dim)' }}>
            Share your imagination. You have {storyCount} of 12 stories manifested.
          </p>
        </header>

        {!user ? (
          <div className="login-card">
            <h2 className="serif" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Access Restricted</h2>
            <p style={{ marginBottom: '40px', color: 'var(--color-text-dim)', fontSize: '1.1rem', lineHeight: '1.8' }}>
              You must be logged in to share your tales with the world. Join the sanctuary of storytellers today.
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <Link href="/login" className="hero-cta">Sign In</Link>
              <Link href="/signup" className="hero-cta secondary">Sign Up</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="login-card" style={{ maxWidth: '100%', textAlign: 'left' }}>
            <div className="form-group">
              <label>Story Title</label>
              <input 
                type="text" 
                required 
                placeholder="Enter a title for your story..."
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            
            <div className="form-group">
              <label>Genre / Category</label>
              <select 
                required 
                value={formData.category_id} 
                onChange={e => setFormData({...formData, category_id: e.target.value})}
              >
                <option value="">Select a Genre</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Description / Vision</label>
              <textarea 
                placeholder="Briefly describe the vision behind this tale..."
                rows="4"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '25px' }}>
              <div className="form-group">
                <label>Thumbnail Image (Required)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required 
                    id="thumb"
                    style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 2 }}
                  />
                  <div style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '2px dashed var(--glass-border)', 
                    borderRadius: '12px', 
                    padding: '30px', 
                    textAlign: 'center',
                    color: 'var(--color-text-dim)'
                  }}>
                    📸 Select Thumbnail
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Story Document (PDF/DOC)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    required 
                    id="story"
                    style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 2 }}
                  />
                  <div style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '2px dashed var(--glass-border)', 
                    borderRadius: '12px', 
                    padding: '30px', 
                    textAlign: 'center',
                    color: 'var(--color-text-dim)'
                  }}>
                    📄 Upload Story
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={uploading}>
              {uploading ? 'Manifesting...' : 'Manifest Story'}
            </button>
          </form>
        )}

        {/* View Point / Categories Section */}
        <section style={{ marginTop: '120px' }}>
          <header style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 className="serif" style={{ fontSize: '2.5rem', color: 'var(--color-primary)' }}>The Realms of Vision</h2>
            <p style={{ color: 'var(--color-text-dim)' }}>Explore the categories available for your manifestations</p>
          </header>
          
          <div className="category-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {categories.map((cat) => (
              <div key={cat.id} className="category-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{cat.icon}</div>
                <h3 className="serif" style={{ fontSize: '1.2rem' }}>{cat.name}</h3>
              </div>
            ))}
          </div>
        </section>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link href="/" style={{ color: 'var(--color-text-dim)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to Sanctuary
          </Link>
        </div>
      </div>
    </main>
  );
}

