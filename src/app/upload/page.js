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
  'horror': <MysteryIcon />,
  'love': <RomanceIcon />,
  'motivation': <FutureIcon />,
  'adventure': <HistoryIcon />,
  'sci-fi': <SciFiIcon />,
  'kids': <FantasyIcon />,
  'mystery': <MysteryIcon />
};

const INITIAL_CATEGORIES = [
  { id: '1', name: 'Fantasy', slug: 'fantasy' },
  { id: '2', name: 'Horror', slug: 'horror' },
  { id: '3', name: 'Love', slug: 'love' },
  { id: '4', name: 'Motivation', slug: 'motivation' },
  { id: '5', name: 'Adventure', slug: 'adventure' },
  { id: '6', name: 'Sci-Fi', slug: 'sci-fi' },
  { id: '7', name: 'Kids', slug: 'kids' },
  { id: '8', name: 'Mystery', slug: 'mystery' }
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

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }, 'image/jpeg', 0.8);
        };
      };
    });
  };

  const uploadFile = async (file, bucket, onProgress) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    console.log(`Uploading ${file.name} to ${bucket}...`);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        onUploadProgress: (progress) => {
          if (onProgress && progress.total) {
            const percent = (progress.loaded / progress.total) * 100;
            onProgress(percent);
          }
        }
      });

    if (uploadError) {
      console.error(`Storage error (${bucket}):`, uploadError);
      throw new Error(`Storage error in bucket "${bucket}": ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!data || !data.publicUrl) {
      throw new Error(`Failed to get public URL for ${fileName} in ${bucket}`);
    }

    return data.publicUrl;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login first');
    
    // Check if category is selected
    if (!formData.category_id) return alert('Please select a realm (category).');

    if (storyCount >= 12) return alert('You have reached the maximum limit of 12 stories.');
    if (!thumbnailFile || !storyFile) return alert('Please select both a thumbnail and a story file.');

    // 10MB limit check
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (storyFile.size > MAX_SIZE) {
      return alert('Story document is too large. Maximum size allowed is 10MB.');
    }

    setUploading(true);
    setUploadProgress(0);

    let thumbProgress = 0;
    let storyProgress = 0;

    const updateCombinedProgress = () => {
      const totalUploadProgress = (thumbProgress + storyProgress) / 2;
      setUploadProgress(Math.round(totalUploadProgress * 0.9));
    };

    try {
      // 0. Ensure user profile exists (foreign key constraint)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (profileError || !profile) {
        throw new Error("Your profile could not be found. Please try logging out and back in.");
      }

      // 1. Compress Thumbnail if it's an image
      let finalThumbFile = thumbnailFile;
      if (thumbnailFile.type.startsWith('image/')) {
        setUploadProgress(2);
        try {
          finalThumbFile = await compressImage(thumbnailFile);
        } catch (compErr) {
          console.warn("Compression failed, using original:", compErr);
        }
      }

      // 2 & 3. Upload Thumbnail and Story File in parallel
      const [thumbnailUrl, storyUrl] = await Promise.all([
        uploadFile(finalThumbFile, 'thumbnails', (p) => {
          thumbProgress = p;
          updateCombinedProgress();
        }),
        uploadFile(storyFile, 'stories', (p) => {
          storyProgress = p;
          updateCombinedProgress();
        })
      ]);

      // 4. Save to Database
      setUploadProgress(95);
      const fileExt = storyFile.name.split('.').pop().toLowerCase();
      const catId = parseInt(formData.category_id);
      
      if (isNaN(catId)) {
        throw new Error("Invalid category selected.");
      }

      const { error: dbError } = await supabase
        .from('stories')
        .insert([{
          user_id: user.id,
          title: formData.title,
          category_id: catId,
          description: formData.description,
          thumbnail_url: thumbnailUrl,
          file_url: storyUrl,
          file_type: fileExt,
          file_name: storyFile.name,
          file_size: storyFile.size
        }]);

      if (dbError) {
        console.error("Database insert error:", dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }

      setUploadProgress(100);
      setTimeout(() => {
        alert('Your vision has been manifested in the chronicles!');
        setFormData({ title: '', category_id: '', description: '' });
        setThumbnailFile(null);
        setStoryFile(null);
        setStoryCount(prev => prev + 1);
        setUploading(false);
        setUploadProgress(0);
      }, 500);
      
    } catch (err) {
      console.error("Upload process failed:", err);
      alert(`Manifestation failed: ${err.message || 'Unknown error'}\n\nHint: Check if the "stories" and "thumbnails" buckets exist in Supabase Storage.`);
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
              <div style={{ marginBottom: '30px', animation: 'fadeIn 0.5s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                    {uploadProgress < 10 ? 'Preparing Vision...' : 
                     uploadProgress < 40 ? 'Analyzing Imagery...' :
                     uploadProgress < 80 ? 'Manifesting Chronicles...' :
                     uploadProgress < 95 ? 'Sealing the Tale...' : 'Finalizing...'}
                  </span>
                  <span style={{ color: 'var(--color-text-dim)' }}>{uploadProgress}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '100px', height: '6px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--color-primary), #fbbf24)', width: `${uploadProgress}%`, transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                </div>
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
                className="category-select"
              >
                <option value="">Select a Realm</option>
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

