'use client';
import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
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

  const supabase = getSupabase();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // Get story count
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
    // Implementation for file upload to Supabase Storage would go here
    // For now, this is a placeholder for the logic
    setTimeout(() => {
      setUploading(false);
      alert('This is a demo. File upload logic is being configured.');
    }, 2000);
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

  if (!user) {
    return (
      <div className="hero" style={{ justifyContent: 'center', textAlign: 'center' }}>
         <div className="glass-card">
            <h1 className="serif">Login Required</h1>
            <p style={{ margin: '20px 0' }}>You must be logged in to upload stories.</p>
            <Link href="/" className="btn btn-primary">Back to Home</Link>
         </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '100px 10%' }}>
      <h1 className="serif" style={{ fontSize: '3rem', marginBottom: '20px' }}>Upload Your Story</h1>
      <p style={{ marginBottom: '50px', opacity: 0.7 }}>You have uploaded {storyCount} / 12 stories.</p>

      <form onSubmit={handleUpload} className="glass-card" style={{ maxWidth: '600px' }}>
        <div className="field">
          <label>Title</label>
          <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        
        <div className="field">
          <label>Category</label>
          <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option value="">Select Category</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Horror">Horror</option>
            <option value="Love">Love</option>
            <option value="Sci-Fi">Sci-Fi</option>
          </select>
        </div>

        <div className="field">
          <label>Thumbnail Image</label>
          <input type="file" accept="image/*" required />
        </div>

        <div className="field">
          <label>Story File (PDF/DOC/PPT)</label>
          <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" required />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Publish Story'}
        </button>
      </form>

      <style jsx>{`
        .field { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; font-weight: 600; opacity: 0.8; }
        input, select, textarea {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          outline: none;
        }
        input:focus { border-color: var(--color-primary); }
      `}</style>
    </div>
  );
}
