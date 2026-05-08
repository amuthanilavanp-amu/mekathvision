'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

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
  { id: 1, name: 'Epic Fantasy', slug: 'fantasy' },
  { id: 2, name: 'Sci-Fi Odyssey', slug: 'sci-fi' },
  { id: 3, name: 'Dark Mystery', slug: 'mystery' },
  { id: 4, name: 'Eternal Romance', slug: 'romance' },
  { id: 5, name: 'Ancient Lore', slug: 'history' },
  { id: 6, name: 'Future Visions', slug: 'future' }
];

export default function UploadPage() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [storyCount, setStoryCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    description: ''
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [storyFile, setStoryFile] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, catRes] = await Promise.all([
          supabase.auth.getUser(),
          supabase.from('categories').select('*')
        ]);

        const currentUser = userRes.data.user;
        setUser(currentUser);
        
        if (catRes.data && catRes.data.length > 0) setCategories(catRes.data);

        if (currentUser) {
          const { count } = await supabase
            .from('stories')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', currentUser.id);
          setStoryCount(count || 0);
        }
      } catch (err) {
        console.error("Manifesting error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'thumbnail') setThumbnailFile(file);
      else setStoryFile(file);
    }
  };

  const uploadFile = async (file, bucket) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login first');
    if (storyCount >= 12) return alert('You have reached the maximum limit of 12 stories.');
    if (!thumbnailFile || !storyFile) return alert('Please select both a thumbnail and a story file.');

    setUploading(true);
    setUploadProgress(10);

    try {
      // 1. Upload Thumbnail
      setUploadProgress(30);
      const thumbnailUrl = await uploadFile(thumbnailFile, 'thumbnails');
      
      // 2. Upload Story File
      setUploadProgress(60);
      const storyUrl = await uploadFile(storyFile, 'stories');

      // 3. Save to Database
      setUploadProgress(80);
      const fileExt = storyFile.name.split('.').pop().toLowerCase();
      const { error: dbError } = await supabase
        .from('stories')
        .insert([{
          user_id: user.id,
          title: formData.title,
          category_id: formData.category_id,
          description: formData.description,
          thumbnail_url: thumbnailUrl,
          file_url: storyUrl,
          file_type: fileExt,
          file_name: storyFile.name,
          file_size: storyFile.size
        }]);

      if (dbError) throw dbError;

      setUploadProgress(100);
      alert('Your vision has been manifested in the chronicles!');
      
      // Reset form
      setFormData({ title: '', category_id: '', description: '' });
      setThumbnailFile(null);
      setStoryFile(null);
      setStoryCount(prev => prev + 1);
      
    } catch (err) {
      console.error("Upload error:", err);
      alert(`Manifestation failed: ${err.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };


  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />

      <div className="container" style={{ padding: '140px 5% 80px' }}>
        <header style={{ marginBottom: '60px', textAlign: 'center' }}>
          <h1 className="serif">Manifest Your Tale</h1>
          <p style={{ color: 'var(--color-text-dim)' }}>
            Share your imagination. You have {storyCount} of 12 stories manifested.
          </p>
        </header>

        {!user ? (
          <div className="login-card">
            <h2 className="serif" style={{ marginBottom: '20px' }}>Access Restricted</h2>
            <p style={{ marginBottom: '40px', color: 'var(--color-text-dim)', lineHeight: '1.8' }}>
              You must be logged in to share your tales with the world. Join the sanctuary of storytellers today.
            </p>
            <div className="hero-cta-group">
              <Link href="/login" className="hero-cta">Sign In</Link>
              <Link href="/signup" className="hero-cta secondary">Sign Up</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="login-card" style={{ maxWidth: '100%', textAlign: 'left' }}>
            {uploading && (
              <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--color-primary)', width: `${uploadProgress}%`, transition: 'width 0.3s ease' }}></div>
              </div>
            )}

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
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Description / Vision</label>
              <textarea 
                placeholder="Briefly describe the vision behind this tale..."
                rows="4"
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '25px' }}>
              <div className="form-group">
                <label>Thumbnail Image (Required)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required 
                    id="thumb"
                    onChange={(e) => handleFileChange(e, 'thumbnail')}
                    style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 2 }}
                  />
                  <div style={{ 
                    background: thumbnailFile ? 'rgba(212, 163, 115, 0.1)' : 'rgba(255,255,255,0.03)', 
                    border: thumbnailFile ? '2px solid var(--color-primary)' : '2px dashed var(--glass-border)', 
                    borderRadius: '12px', 
                    padding: '30px', 
                    textAlign: 'center',
                    color: thumbnailFile ? 'var(--color-primary)' : 'var(--color-text-dim)',
                    transition: 'all 0.3s ease'
                  }}>
                    {thumbnailFile ? `✅ ${thumbnailFile.name}` : '📸 Select Thumbnail'}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Story Document (PDF/DOC/PPT)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx,.ppt,.pptx" 
                    required 
                    id="story"
                    onChange={(e) => handleFileChange(e, 'story')}
                    style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 2 }}
                  />
                  <div style={{ 
                    background: storyFile ? 'rgba(212, 163, 115, 0.1)' : 'rgba(255,255,255,0.03)', 
                    border: storyFile ? '2px solid var(--color-primary)' : '2px dashed var(--glass-border)', 
                    borderRadius: '12px', 
                    padding: '30px', 
                    textAlign: 'center',
                    color: storyFile ? 'var(--color-primary)' : 'var(--color-text-dim)',
                    transition: 'all 0.3s ease'
                  }}>
                    {storyFile ? `✅ ${storyFile.name}` : '📄 Upload Story (PDF, DOC, PPT)'}
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={uploading}>
              {uploading ? `Manifesting (${uploadProgress}%)...` : 'Manifest Story'}
            </button>
          </form>
        )}

        {/* View Point / Categories Section */}
        <section style={{ marginTop: '120px' }}>
          <header style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 className="serif" style={{ color: 'var(--color-primary)' }}>The Realms of Vision</h2>
            <p style={{ color: 'var(--color-text-dim)' }}>Explore the categories available for your manifestations</p>
          </header>
          
          <div className="grid-auto">
            {categories.map((cat) => (
              <div key={cat.id} className="category-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ color: 'var(--color-primary)', marginBottom: '15px', display: 'flex' }}>
                  {ICON_MAP[cat.slug] || '✨'}
                </div>
                <h3 className="serif" style={{ fontSize: '1.1rem', margin: 0 }}>{cat.name}</h3>
              </div>
            ))}
          </div>
        </section>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link href="/" className="nav-link" style={{ fontSize: '0.9rem' }}>
            ← Back to Sanctuary
          </Link>
        </div>
      </div>
    </main>
  );
}

