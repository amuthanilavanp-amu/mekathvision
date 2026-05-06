'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function UploadPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storyCount, setStoryCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: ''
  });

  // Remove const supabase = getSupabase(); as we import it directly

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { count } = await supabase
          .from('stories')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        setStoryCount(count || 0);
      }
      setLoading(false);
    }
    checkUser();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login first');
    if (storyCount >= 12) return alert('You have reached the maximum limit of 12 stories.');

    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      alert('This is a demo. Your story and thumbnail would be uploaded to Supabase Storage in the production version.');
    }, 2000);
  };

  if (loading) return (
    <div className="login-container">
      <div className="serif" style={{ fontSize: '2rem' }}>Loading Vision...</div>
    </div>
  );

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1 className="serif">Access Restricted</h1>
          <p style={{ margin: '20px 0', color: 'var(--color-text-dim)' }}>You must be logged in to share your tales with the world.</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link href="/login" className="login-btn" style={{ textDecoration: 'none', width: 'auto', padding: '12px 30px' }}>Sign In</Link>
            <Link href="/" className="pill-btn" style={{ padding: '12px 30px' }}>Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '120px 5%' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: '60px', textAlign: 'center' }}>
          <h1 className="serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '15px' }}>Manifest Your Tale</h1>
          <p style={{ color: 'var(--color-text-dim)' }}>
            Share your imagination. You have {storyCount} of 12 stories manifested.
          </p>
        </header>

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
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '15px', color: 'white' }}
            >
              <option value="">Select a Genre</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Horror">Horror</option>
              <option value="Love">Love</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Adventure">Adventure</option>
            </select>
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
                  style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer' }}
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
                  style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer' }}
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

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link href="/" style={{ color: 'var(--color-text-dim)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to Sanctuary
          </Link>
        </div>
      </div>
    </main>
  );
}
